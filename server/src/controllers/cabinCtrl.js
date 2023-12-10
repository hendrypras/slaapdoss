const { responseError, responseSuccess } = require('../helpers/responseHandler')
const {
  cloudinaryDeleteImg,
  uploadToCloudinary,
} = require('../config/cloudinary')
const slugify = require('slugify')
const { Cabins } = require('../models')
const path = require('path')
const { validateBodyCreateCabin } = require('../helpers/validationJoi')
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
      where: whereClause,
    })

    const results = {
      cabin: slug ? responseCabin[0] : responseCabin,
      cabin_information,
    }

    return responseSuccess(res, 200, 'success', results)
  } catch (error) {
    console.log(error)
    return responseError(res, error?.status, error?.message)
  }
}
