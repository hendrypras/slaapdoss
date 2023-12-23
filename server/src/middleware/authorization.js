const { responseError } = require('../helpers/responseHandler')

const isAdmin = async (req, res, next) => {
  try {
    const { role } = req.user

    if (!role)
      return responseError(
        res,
        500,
        'Internal Server Error',
        'Invalid user data'
      )

    if (role !== 1) {
      return responseError(res, 406, 'Not Acceptable', 'You are not an admin')
    } else {
      return next()
    }
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred')
  }
}

const isUser = async (req, res, next) => {
  try {
    const { role } = req.user

    if (!role) {
      return responseError(
        res,
        500,
        'Internal Server Error',
        'Invalid user data'
      )
    }

    if (role !== 2) {
      return responseError(res, 406, 'Not Acceptable', 'You are not an user')
    } else {
      return next()
    }
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred')
  }
}

module.exports = { isAdmin, isUser }
