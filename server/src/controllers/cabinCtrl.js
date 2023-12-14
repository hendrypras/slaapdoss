const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { Op } = require('sequelize')
const sequelize = require('../config/connectDb')
const {
  cloudinaryDeleteImg,
  uploadToCloudinary,
} = require('../config/cloudinary')
const slugify = require('slugify')
const {
  Cabins,
  TypeCabin,
  CabinRooms,
  RoomDateReservations,
} = require('../models')
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
      const deleteImage = await cloudinaryDeleteImg(
        imageResult.public_id,
        'image'
      )
      if (!deleteImage) {
        return responseError(
          res,
          500,
          'Internal server error',
          'Failed to delete image in cloud'
        )
      }
    }
    return responseError(res, error?.status, error?.message)
  }
}

exports.createCabinRoom = async (req, res) => {
  try {
    const newData = req.body
    const validate = validateBodyCreateCabinRoom(newData)
    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }

    const [findTypeCabin, findCabins, findCabinRoom] = await Promise.all([
      TypeCabin.findByPk(newData?.typeCabinId),
      Cabins.findOne({
        where: { slug: newData?.cabinsSlug },
      }),
      CabinRooms.findOne({
        where: {
          cabins_slug: newData?.cabinsSlug,
          room_number: newData?.roomNumber,
          type_cabin_id: newData?.typeCabinId,
        },
      }),
    ])

    if (!findCabins)
      return responseError(
        res,
        404,
        'Not Found',
        'Cabins with this slug not found'
      )
    if (!findTypeCabin)
      return responseError(res, 404, 'Not Found', 'Type Cabin not found')
    if (findCabinRoom)
      return responseError(
        res,
        400,
        'Bad Request',
        'Room number already axist for this location'
      )

    await CabinRooms.create({
      cabins_slug: newData?.cabinsSlug,
      room_number: newData?.roomNumber,
      type_cabin_id: newData?.typeCabinId,
    })
    return responseSuccess(res, 201, 'success')
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}

exports.createTypeCabin = async (req, res) => {
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

    const findTypeCabin = await TypeCabin.findAll({
      where: {
        name: { [Op.like]: newData?.name },
        cabins_slug: cabinsSlug,
      },
    })
    if (findTypeCabin.length > 0) {
      return responseError(
        res,
        400,
        'Bad Request',
        'Type Room with this name already exist'
      )
    }
    imageResult = await uploadToCloudinary(req.files.typeImage[0], 'image')
    if (!imageResult?.url) {
      return responseError(res, 500, 'Internal server error', imageResult.error)
    }

    const validate = validateBodyCreateTypeCabin({
      cabinsSlug,
      ...rest,
    })
    if (validate) {
      if (imageResult?.public_id) {
        await cloudinaryDeleteImg(imageResult.public_id, 'image')
      }
      return responseError(res, 400, 'Validatin Failed', validate)
    }

    await TypeCabin.create({
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

    const findTypeCabin = await TypeCabin.findAll({
      where: {
        name: { [Op.like]: newData?.name },
        cabins_slug: cabinsSlug,
        id: { [Op.not]: typeCabinId },
      },
    })

    if (findTypeCabin.length > 0) {
      return responseError(
        res,
        400,
        'Bad Request',
        'Type Room with this name already exists'
      )
    }
    if (req.files.typeImage) {
      imageResult = await uploadToCloudinary(req.files.typeImage[0], 'image')
      if (!imageResult?.url || !imageResult?.public_id) {
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

    await TypeCabin.update(
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
    // Always attempt to delete the image in case of any unexpected error
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
        model: CabinRooms,
        as: 'cabins_rooms',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: TypeCabin,
            as: 'type_cabin',
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
      responseCabin.cabin_rooms,
      dateStart,
      dateEnd
    )
    const { cabin_rooms, ...cabinDetail } = responseCabin.toJSON()
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
        'province',
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
    const response = await TypeCabin.findAll({
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
        model: CabinRooms,
        as: 'cabins_rooms',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: TypeCabin,
            as: 'type_cabin',
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
