const { errorHandler, handleResponseSuccess } = require('../helpers')
const { Users } = require('../models')
exports.getUserProfile = async (req, res) => {
  try {
    const authData = req.user
    const response = await Users.findByPk(authData?.id, {
      attributes: ['id', 'picture_url', 'first_name', 'last_name'],
    })
    if (!response) return errorHandler(res, 404, 'Not Found', 'User not found')
    return handleResponseSuccess(res, 200, 'Ok', response)
  } catch (error) {
    return errorHandler(res, error.status)
  }
}
exports.getUserProfile2 = async (req, res) => {
  try {
    const authData = req.user
    const response = await Users.findByPk(authData?.id, {
      attributes: ['id', 'picture_url', 'first_name', 'last_name'],
    })
    if (!response) return errorHandler(res, 404, 'Not Found', 'User not found')
    return handleResponseSuccess(res, 200, 'Ok', response)
  } catch (error) {
    return errorHandler(res, error.status)
  }
}
