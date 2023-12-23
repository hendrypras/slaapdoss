const {
  uploadToCloudinary,
  cloudinaryDeleteImg,
} = require('../configDb/cloudinary')
const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { validateBodyCreateBanner } = require('../helpers/validationJoi')
const Redis = require('ioredis')
const { Banners } = require('../models')
const redisClient = new Redis()

exports.createBanner = async (req, res) => {
  let imageResult
  try {
    if (req?.fileValidationError)
      return responseError(
        res,
        400,
        'Bad Request',
        req.fileValidationError.message
      )

    if (!req?.files?.banner)
      return responseError(res, 400, 'Validation Failed', 'Image is required')

    const { title, description, active } = req.body

    const validate = validateBodyCreateBanner({ title, description, active })

    if (validate) return responseError(res, 400, 'Validation Failed', validate)

    imageResult = await uploadToCloudinary(req.files.banner[0], 'image')

    if (!imageResult?.url)
      return responseError(res, 500, 'Internal server error', imageResult.error)

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
    }

    const response = await Banners.findAll({
      where: { active: true },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })

    if (response.length > 0) {
      await redisClient.setex('banners', 3600, JSON.stringify(response))
    }

    return responseSuccess(res, 200, 'success', response)
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.getBannersByAdmin = async (req, res) => {
  try {
    const cachedData = await redisClient.get('banners')
    if (cachedData) {
      const parsedData = JSON.parse(cachedData)
      return responseSuccess(res, 200, 'success', parsedData)
    }

    const response = await Banners.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })

    if (response.length > 0)
      redisClient.set('banners', JSON.stringify(response))

    return responseSuccess(res, 200, 'success', response)
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.updateStatusBanner = async (req, res) => {
  try {
    const { bannerId, status } = req.params

    const banner = await Banners.findByPk(bannerId)

    if (!banner) return responseError(res, 404, 'Not Found', 'Banner not found')

    const totalBanner = await Banners.count()

    if (totalBanner <= 1 && status === 'private')
      return responseError(
        res,
        400,
        'Bad Request',
        'Cannot update, minimum of 1 banner required'
      )

    let activeStatus

    if (status === 'private') {
      activeStatus = false
    } else if (status === 'public') {
      activeStatus = true
    } else {
      return responseError(
        res,
        400,
        'Bad Request',
        "The only statuses allowed are 'private' and 'public'"
      )
    }

    banner.active = activeStatus

    await banner.save()

    await redisClient.del('banners')

    return responseSuccess(res, 200, 'success')
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
exports.deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params

    const banner = await Banners.findByPk(bannerId)

    if (!banner) return responseError(res, 404, 'Not Found', 'Banner not found')

    const totalBanner = await Banners.count()

    if (totalBanner <= 1)
      return responseError(
        res,
        400,
        'Bad Request',
        'Cannot delete, minimum of 1 banners required'
      )

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
