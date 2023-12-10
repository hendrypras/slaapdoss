const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { validateBodyCreateRoom } = require('../helpers/validationJoi')
const {
  cloudinaryDeleteImg,
  uploadToCloudinary,
} = require('../config/cloudinary')
const { TypeRoom, CabinRoom } = require('../models')

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

exports.createRoom = async (req, res) => {
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
    if (!req.files.room) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }
    imageResult = await uploadToCloudinary(req.files.room[0], 'image')
    if (!imageResult?.url) {
      return responseError(res, 500, 'Internal server error', imageResult.error)
    }
    const newData = req.body
    const { room, ...rest } = newData
    const validate = validateBodyCreateRoom({
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
    const findTypeRoom = await TypeRoom.findByPk(newData?.type_cabin)
    const findRoom = await CabinRoom.findOne({ where: { name: newData?.name } })
    if (findRoom) {
      if (imageResult?.public_id) {
        await cloudinaryDeleteImg(imageResult.public_id, 'image')
      }
      return responseError(res, 400, 'Bad Request', 'Room has ben created')
    }
    if (!findTypeRoom) {
      if (imageResult?.public_id) {
        await cloudinaryDeleteImg(imageResult.public_id, 'image')
      }
      return responseError(res, 404, 'Not Found', 'Type room not found')
    }
    await CabinRoom.create({
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
