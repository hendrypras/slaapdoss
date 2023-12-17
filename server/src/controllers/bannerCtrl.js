const {
  uploadToCloudinary,
  cloudinaryDeleteImg,
} = require('../config/cloudinary')
const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { validateBodyCreateBanner } = require('../helpers/validationJoi')
const Redis = require('ioredis')
const { Banners } = require('../models')
const redisClient = new Redis()

exports.createBanner = async (req, res) => {
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
    if (!req.files.banner) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }
    const { title, description, active } = req.body
    const validate = validateBodyCreateBanner({ title, description, active })
    if (validate) return responseError(res, 400, 'Validation failed', validate)

    imageResult = await uploadToCloudinary(req.files.banner[0], 'image')
    if (!imageResult?.url) {
      return responseError(res, 500, 'Internal server error', imageResult.error)
    }
    await Banners.create({
      image_url: imageResult?.url,
      image_public_id: imageResult?.public_id,
      title,
      active,
      description,
    })
    await redisClient.del('banners')
    return responseSuccess(res, 201, 'success')
  } catch (error) {
    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    }
    return responseError(res, error.status, error.message)
  }
}

exports.getBanners = async (req, res) => {
  try {
    const cachedData = await redisClient.get('banners')
    if (cachedData) {
      const parsedData = JSON.parse(cachedData)
      return responseSuccess(res, 200, 'success', parsedData)
    } else {
      const response = await Banners.findAll({
        where: { active: true },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      })
      if (response.length > 0) {
        await redisClient.setex('banners', 3600, JSON.stringify(response))
      }
      return responseSuccess(res, 200, 'success', response)
    }
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
exports.deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params
    const banner = await Banners.findByPk(bannerId)
    if (!banner) {
      return responseError(res, 404, 'Not Found', 'Banner not found')
    }
    const cloudinaryDeletion = cloudinaryDeleteImg(
      banner.image_public_id,
      'image'
    )
    const bannerDeletion = banner.destroy()

    await Promise.all([cloudinaryDeletion, bannerDeletion])

    await redisClient.del('banners')
    return responseSuccess(res, 200, 'success')
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
