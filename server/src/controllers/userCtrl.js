const {
  cloudinaryDeleteImg,
  uploadToCloudinary,
} = require('../config/cloudinary')
const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { Users, IdCard } = require('../models')
const { createWorker } = require('tesseract.js')
const parseOCRTextToKTPObject = require('../utils/slicingTextOcr')
const {
  validateResultOcrIdCard,
  validateBodyCreateIdCard,
} = require('../helpers/validationJoi')
const encryptPayload = require('../utils/encryptPayload')
const { decryptObjectPayload } = require('../utils/decryptPayload')
const sequelize = require('../config/connectDb')

exports.getUserProfile = async (req, res) => {
  try {
    const authData = req.user
    const response = await Users.findByPk(authData?.id, {
      attributes: [
        'id',
        'image_url',
        'image_public_id',
        'username',
        'verified',
      ],
    })
    if (!response) return responseError(res, 404, 'Not Found', 'User not found')
    return responseSuccess(res, 200, 'success', response)
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}
exports.updateUserProfile = async (req, res) => {
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
    if (!req.files.profile) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }

    imageResult = await uploadToCloudinary(req.files.profile[0], 'image')

    if (!imageResult?.url) {
      return responseError(res, 500, 'Internal server error', imageResult)
    }
    const { imagePublicId } = req.body
    if (imagePublicId !== 'avatar') {
      await cloudinaryDeleteImg(imagePublicId, 'image')
    }
    const authData = req.user
    const response = await Users.update(
      { image_url: imageResult?.url, image_public_id: imageResult?.public_id },
      {
        where: {
          id: authData.id,
        },
      }
    )
    if (!response.length)
      return responseError(res, 404, 'Not Found', 'User not found')

    return responseSuccess(res, 200, 'success')
  } catch (error) {
    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    }
    return responseError(res, error?.status, error?.message)
  }
}

exports.getDataCrutialUser = async (req, res) => {
  try {
    const authData = req.user
    const response = await Users.findByPk(authData?.id, {
      include: [
        {
          model: IdCard,
          as: 'id_card',
          attributes: ['id', 'name', 'id_card_url'],
        },
      ],
      attributes: ['id', 'username', 'email'],
    })
    if (!response) return responseError(res, 404, 'Not Found', 'User not found')

    return responseSuccess(res, 200, 'success', encryptPayload(response))
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}

exports.uploadIdCard = async (req, res) => {
  try {
    const { idCardUrl } = req.body
    const worker = await createWorker('eng')
    const ret = await worker.recognize(idCardUrl)
    const result = parseOCRTextToKTPObject(ret.data.text)
    const validate = validateResultOcrIdCard(result)
    if (validate) {
      return responseError(
        res,
        400,
        'Bad Request',
        'Invalid ID Card, please enter a valid ID Card image and make sure it is clearly visible'
      )
    }
    return responseSuccess(res, 200, 'success', {
      idCard: encryptPayload(result),
      idCardUrl,
    })
  } catch (error) {
    return responseError(res, error?.status, error?.message)
  }
}

exports.createIdCard = async (req, res) => {
  let imageResult
  let t
  try {
    const { idCard, idCardUrl } = req.body
    const authData = req.user
    const decoded = decryptObjectPayload(idCard)
    const validate = validateBodyCreateIdCard(decoded)
    if (validate) return responseError(res, 404, 'Validation Failed', validate)
    const findIdCard = await IdCard.findOne({ where: { nik: decoded?.nik } })
    if (findIdCard) {
      return responseError(res, 409, 'Conflict', 'Id card already exist')
    }
    t = await sequelize.transaction()
    imageResult = await uploadToCloudinary(idCardUrl, 'image')
    if (!imageResult?.url) {
      return responseError(res, 500, 'Internal server error', imageResult)
    }
    await IdCard.create(
      {
        user_id: authData.id,
        id_card_url: imageResult?.url,
        id_card_public_id: imageResult?.public_id,
        ...decoded,
      },
      { transaction: t }
    )
    await Users.update(
      { verified: true },
      {
        where: {
          id: authData?.id,
        },
        transaction: t,
      }
    )
    await t.commit()
    return responseSuccess(res, 201, 'success')
  } catch (error) {
    if (t) await t.rollback()
    if (imageResult?.public_id)
      await cloudinaryDeleteImg(imageResult.public_id, 'image')
    return responseError(res, error?.status, error?.message)
  }
}
