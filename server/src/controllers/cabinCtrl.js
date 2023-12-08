const { responseError, responseSuccess } = require('../helpers/responseHandler')
const {
  cloudinaryDeleteImg,
  uploadToCloudinary,
} = require('../config/cloudinary')

exports.createCabin = async (req, res) => {
  let imageResult
  try {
    if (!req.files.image) {
      return responseError(res, 400, 'Validation Failed', 'Image is required')
    }
    imageResult = await uploadToCloudinary(req.files.image[0], 'image')
    if (!imageResult.success) {
      return responseError(res, 500, 'Internal server error', imageResult.error)
    }
    return responseSuccess(res, 200, 'Ok', imageResult)
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
    return responseError(res, error.status, error.message)
  }
}
