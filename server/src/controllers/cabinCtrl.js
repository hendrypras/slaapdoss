const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { Op } = require('sequelize')
const {
  cloudinaryDeleteImg,
  uploadToCloudinary,
} = require('../configDb/cloudinary')
const slugify = require('slugify')
const { Cabins, TypeRoom, Rooms, RoomDateReservations } = require('../models')
const path = require('path')
const {
  validateBodyCreateCabin,
  validateBodyCreateCabinRoom,
  validateBodyCreateTypeRoom,
  validateBodyUpdateTypeRoom,
} = require('../helpers/validationJoi')
const loadData = require('../helpers/databaseHelper')
const {
  filterRoomsByDateRange,
  groupCabinRoomsByType,
  modifiedResponseDetailRoomCabin,
  getCurrentDate,
} = require('../services/cabinService')

exports.createCabin = async (req, res) => {
  let imageResult
  try {
    if (req?.fileValidationError) {
      return responseError(
        res,
        400,
        'Bad Request',
        req.fileValidationError.message
      )
    }
    if (!req?.files?.cabin) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }
    const newData = req.body
    const { cabin, ...rest } = newData
    const validate = validateBodyCreateCabin({
      ...rest,
    })
    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }
    const slug = slugify(newData?.name, { lower: true })

    const existingCabin = await Cabins.findOne({
      where: { slug },
    })
    if (existingCabin) {
      return responseError(
        res,
        400,
        'Bad Request',
        'Cabin with this name already exists'
      )
    }

    imageResult = await uploadToCloudinary(req?.files?.cabin[0], 'image')
    if (!imageResult?.url) {
      return responseError(res, 500, 'Internal server error', imageResult.error)
    }

    await Cabins.create({
      image_url: imageResult?.url,
      image_public_id: imageResult?.public_id,
      slug,
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
    if (!req?.files?.typeImage) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }
    const newData = req.body
    const { typeImage, cabinsSlug, ...rest } = newData
    const validate = validateBodyCreateTypeRoom({
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
        404,
        'Not Found',
        'Cabins with this slug not found'
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
      return responseError(res, 404, 'Not Found', 'Type room not found')
    if (!findCabins)
      return responseError(res, 404, 'Not Found', 'Cabin not found')
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

exports.getCabinBySlug = async (req, res) => {
  try {
    const { dateStart, dateEnd } = req.query
    const { slug } = req.params
    const currentDate = getCurrentDate()

    if (
      parseInt(dateEnd, 10) <= parseInt(dateStart, 10) ||
      parseInt(dateStart, 10) < currentDate
    )
      return responseError(
        res,
        409,
        'Conflict',
        'End reservation date should not be earlier than start reservation date'
      )

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

exports.getTypeRoom = async (req, res) => {
  try {
    const response = await TypeRoom.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })
    return responseSuccess(res, 200, 'success', response)
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}
exports.getTypeRoomById = async (req, res) => {
  try {
    const { typeRoomId } = req.params

    const response = await TypeRoom.findByPk(typeRoomId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })

    if (!response)
      return responseError(res, 404, 'Not Found', 'Type room not found')

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

exports.updateTypeRoom = async (req, res) => {
  let imageResult
  try {
    const { typeRoomId } = req.params
    const { typeImage, imagePublicId, cabinsSlug, imageUrl, ...rest } = req.body

    if (!req.files.typeImage && !imageUrl && !imagePublicId) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }

    if (req.fileValidationError) {
      return responseError(
        res,
        400,
        'Bad Request',
        req.fileValidationError.message
      )
    }

    const validate = validateBodyUpdateTypeRoom({
      imagePublicId,
      imageUrl,
      cabinsSlug,
      ...rest,
    })

    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }

    const findTypeCabin = await TypeRoom.findAll({
      where: {
        name: { [Op.like]: rest?.name },
        cabins_slug: cabinsSlug,
        id: { [Op.not]: typeRoomId },
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

    await TypeRoom.update(
      {
        image_url: imageResult?.url || imageUrl,
        image_public_id: imageResult?.public_id || imagePublicId,
        cabins_slug: cabinsSlug,
        ...rest,
      },
      {
        where: {
          id: typeRoomId,
        },
      }
    )

    if (imageResult?.url) {
      await cloudinaryDeleteImg(imagePublicId, 'image')
    }

    return responseSuccess(res, 200, 'success')
  } catch (error) {
    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    }

    return responseError(res, error?.status, error?.message)
  }
}
