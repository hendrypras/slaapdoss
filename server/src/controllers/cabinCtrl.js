const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { Op } = require('sequelize')
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
} = require('../helpers/validationJoi')
const loadData = require('../helpers/databaseHelper')

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
    const { typeImage, ...rest } = newData

    const findTypeCabin = await TypeCabin.findAll({
      where: {
        name: { [Op.like]: newData?.name },
      },
    })
    if (findTypeCabin.length) {
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
      image_url: imageResult?.url,
      image_public_id: imageResult?.public_id,
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

exports.getCabins = async (req, res) => {
  try {
    const { province, city, slug } = req.query
    const whereClause = {}
    const cabinInformation = path.join(
      __dirname,
      '../../database/cabinInformation.json'
    )
    let cabin_information

    if (province) {
      whereClause.province = province
    }
    if (city) {
      whereClause.city = city
    }
    if (slug) {
      whereClause.slug = slug
      cabin_information = await loadData(cabinInformation)
    }

    const responseCabin = await Cabins.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: CabinRooms,
        as: 'cabin_rooms',
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
      where: whereClause,
    })

    const results = {
      cabin: slug ? responseCabin[0] : responseCabin,
      cabin_information,
    }

    return responseSuccess(res, 200, 'success', results)
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
