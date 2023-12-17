const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { Op } = require('sequelize')
const sequelize = require('../config/connectDb')
const {
  cloudinaryDeleteImg,
  uploadToCloudinary,
} = require('../config/cloudinary')
const slugify = require('slugify')
const { Cabins, TypeRoom, Rooms, RoomDateReservations } = require('../models')
const path = require('path')
const {
  validateBodyCreateCabin,
  validateBodyCreateCabinRoom,
  validateBodyCreateTypeCabin,
  validateBodyUpdateTypeCabin,
} = require('../helpers/validationJoi')
const loadData = require('../helpers/databaseHelper')
const {
  filterRoomsByDateRange,
  groupCabinRoomsByType,
  modifiedResponseDetailRoomCabin,
} = require('../services/cabinService')

exports.createCabin = async (req, res) => {
  let imageResult
  try {
    if (req.fileValidationError) {
      return responseError(
        res,
        400,
        'Bad Request',
        req.fileValidationError.message
      )
    }
    if (!req.files.cabin) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }
    imageResult = await uploadToCloudinary(req.files.cabin[0], 'image')
    if (!imageResult?.url) {
      return responseError(res, 500, 'Internal server error', imageResult.error)
    }
    const newData = req.body
    const { cabin, ...rest } = newData
    const validate = validateBodyCreateCabin({
      image_url: imageResult?.url,
      image_public_id: imageResult?.public_id,
      slug: slugify(newData?.name),
      ...rest,
    })
    if (validate) {
      if (imageResult?.public_id) {
        await cloudinaryDeleteImg(imageResult.public_id, 'image')
      }
      return responseError(res, 400, 'Validation failed', validate)
    }
    await Cabins.create({
      image_url: imageResult?.url,
      image_public_id: imageResult?.public_id,
      slug: slugify(newData?.name, { lower: true }),
      ...rest,
    })
    return responseSuccess(res, 201, 'success')
  } catch (error) {
    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    }
    return responseError(res, error?.status, error?.message)
  }
}

exports.createRoom = async (req, res) => {
  try {
    const { cabinsSlug, roomNumber, typeRoomId } = req.body
    const validate = validateBodyCreateCabinRoom(req.body)
    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }

    const [findTypeRoom, findCabins, findCabinRoom] = await Promise.all([
      TypeRoom.findByPk(typeRoomId),
      Cabins.findOne({
        where: { slug: cabinsSlug },
      }),
      Rooms.findOne({
        where: {
          cabins_slug: cabinsSlug,
          room_number: roomNumber,
          type_room_id: typeRoomId,
        },
      }),
    ])

    if (!findTypeRoom)
      return responseError(res, 404, 'Not Found', 'Type Cabin not found')
    if (!findCabins)
      return responseError(
        res,
        404,
        'Not Found',
        'Cabins with this slug not found'
      )
    if (findCabinRoom)
      return responseError(
        res,
        400,
        'Bad Request',
        'Room number already axist for this location'
      )

    await Rooms.create({
      cabins_slug: cabinsSlug,
      room_number: roomNumber,
      type_room_id: typeRoomId,
    })
    return responseSuccess(res, 201, 'success')
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}

exports.createTypeRoom = async (req, res) => {
  let imageResult
  try {
    if (req.fileValidationError) {
      return responseError(
        res,
        400,
        'Bad Request',
        req.fileValidationError.message
      )
    }
    if (!req.files.typeImage) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }
    const newData = req.body
    const { typeImage, cabinsSlug, ...rest } = newData
    const validate = validateBodyCreateTypeCabin({
      cabinsSlug,
      ...rest,
    })
    if (validate) {
      return responseError(res, 400, 'Validatin Failed', validate)
    }
    const [findTypeRoom, findCabins] = await Promise.all([
      TypeRoom.findAll({
        where: {
          name: { [Op.like]: newData?.name },
          cabins_slug: cabinsSlug,
        },
      }),
      Cabins.findOne({
        where: { slug: newData.cabinsSlug },
      }),
    ])
    if (findTypeRoom.length > 0) {
      return responseError(
        res,
        400,
        'Bad Request',
        'Type Room with this name already exist'
      )
    }
    if (!findCabins)
      return responseError(
        res,
        400,
        'Bad Request',
        'Cabins with this slug already exist'
      )
    imageResult = await uploadToCloudinary(req.files.typeImage[0], 'image')
    if (!imageResult?.url) {
      return responseError(res, 500, 'Internal server error', imageResult.error)
    }

    await TypeRoom.create({
      image_url: imageResult?.url,
      image_public_id: imageResult?.public_id,
      cabins_slug: cabinsSlug,
      ...rest,
    })
    return responseSuccess(res, 201, 'success')
  } catch (error) {
    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    }
    return responseError(res, error?.status, error?.message)
  }
}

exports.updateTypeCabin = async (req, res) => {
  let imageResult
  let transaction
  try {
    const { typeCabinId } = req.params
    const newData = req.body
    const { typeImage, imagePublicId, cabinsSlug, imageUrl, ...rest } = newData
    if (req.fileValidationError) {
      return responseError(
        res,
        400,
        'Bad Request',
        req.fileValidationError.message
      )
    }
    if (!req.files.typeImage && !imageUrl && !imagePublicId) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }
    const validate = validateBodyUpdateTypeCabin({
      imagePublicId,
      imageUrl,
      cabinsSlug,
      ...rest,
    })

    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }

    const findTypeRoom = await TypeRoom.findAll({
      where: {
        name: { [Op.like]: newData?.name },
        cabins_slug: cabinsSlug,
        id: { [Op.not]: typeCabinId },
      },
    })

    if (findTypeRoom.length > 0) {
      return responseError(
        res,
        400,
        'Bad Request',
        'Type Room with this name already exists'
      )
    }
    if (req.files.typeImage) {
      imageResult = await uploadToCloudinary(req.files.typeImage[0], 'image')
      if (!imageResult?.url) {
        return responseError(
          res,
          500,
          'Internal server error',
          imageResult.error
        )
      }
    }

    // Begin Sequelize transaction
    transaction = await sequelize.transaction()

    await TypeRoom.update(
      {
        image_url: imageResult?.url || imageUrl,
        image_public_id: imageResult?.public_id || imagePublicId,
        cabins_slug: cabinsSlug,
        ...rest,
      },
      {
        where: {
          id: typeCabinId,
        },
        transaction, // Pass transaction object
      }
    )

    // Commit the transaction if update is successful
    await transaction.commit()

    if (imageResult?.url) {
      await cloudinaryDeleteImg(imagePublicId, 'image')
    }

    return responseSuccess(res, 200, 'success')
  } catch (error) {
    if (transaction) {
      // Rollback the transaction if an error occurs
      await transaction.rollback()
    }

    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    }

    return responseError(res, error?.status, error?.message)
  } finally {
    if (imageResult?.public_id && !transaction) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    }
  }
}

exports.getCabins = async (req, res) => {
  try {
    const { dateStart, dateEnd } = req.query
    const { slug } = req.params
    const cabinInformationJson = path.join(
      __dirname,
      '../../database/cabinInformation.json'
    )
    const cabinIncludeByTypeJson = path.join(
      __dirname,
      '../../database/cabinFacilities.json'
    )

    const responseCabin = await Cabins.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: Rooms,
        as: 'rooms',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: TypeRoom,
            as: 'type_room',
            attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
          },
          {
            model: RoomDateReservations,
            as: 'reservation_date',
            attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
          },
        ],
      },
      where: { slug },
    })

    if (!responseCabin)
      return responseError(res, 404, 'Not Found', 'Cabin not found')

    const [cabinInformation, cabinInclude] = await Promise.all([
      loadData(cabinInformationJson),
      loadData(cabinIncludeByTypeJson),
    ])
    const filteredRooms = filterRoomsByDateRange(
      responseCabin.rooms,
      dateStart,
      dateEnd
    )
    const { rooms, ...cabinDetail } = responseCabin.toJSON()
    const filteredRoomsWithoutReservation = groupCabinRoomsByType(
      filteredRooms,
      cabinInclude
    )

    const results = {
      cabin: cabinDetail,
      cabinRooms: filteredRoomsWithoutReservation,
      cabinInformation,
    }

    return responseSuccess(res, 200, 'success', results)
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}

exports.getCabinsLocation = async (req, res) => {
  try {
    const responseCabin = await Cabins.findAll({
      attributes: [
        'id',
        'name',
        'city',
        'image_url',
        'latitude',
        'longitude',
        'slug',
      ],
    })

    return responseSuccess(res, 200, 'success', responseCabin)
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}

exports.getTypeCabin = async (req, res) => {
  try {
    const response = await TypeRoom.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })
    return responseSuccess(res, 200, 'success', response)
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}

exports.getDetailCabinRoomById = async (req, res) => {
  try {
    const { slug, roomId } = req.params

    const responseCabin = await Cabins.findOne({
      attributes: ['address', 'slug'],
      include: {
        where: { id: roomId },
        model: Rooms,
        as: 'rooms',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: TypeRoom,
            as: 'type_room',
            attributes: ['name', 'price', 'information', 'capacity'],
          },
        ],
      },
      where: { slug },
    })
    if (!responseCabin)
      return responseError(res, 404, 'Not Found', 'Cabin not found')
    const modifiedResponse = modifiedResponseDetailRoomCabin(responseCabin)
    return responseSuccess(res, 200, 'success', modifiedResponse)
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}
