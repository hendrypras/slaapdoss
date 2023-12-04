const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { Users } = require('../models')
exports.getUserProfile = async (req, res) => {
  try {
    const authData = req.user
    const response = await Users.findByPk(authData?.id, {
      attributes: ['id', 'picture_url', 'first_name', 'last_name'],
    })
    if (!response) return responseError(res, 404, 'Not Found', 'User not found')
    return responseSuccess(res, 200, 'Ok', response)
  } catch (error) {
    return responseError(res, error.status)
  }
}
exports.getUserProfile2 = async (req, res) => {
  try {
    const authData = req.user
    const response = await Users.findByPk(authData?.id, {
      attributes: ['id', 'picture_url', 'first_name', 'last_name'],
    })
    if (!response) return responseError(res, 404, 'Not Found', 'User not found')
    return responseSuccess(res, 200, 'Ok', response)
  } catch (error) {
    return responseError(res, error.status)
  }
}
