const { responseError } = require('../helpers/responseHandler')

const isAdmin = async (req, res, next) => {
  const { role } = req.user
  if (role !== 1) {
    return responseError(res, 406, 'Not Accepteble', 'You are not an admin')
  } else {
    next()
  }
}
const isUser = async (req, res, next) => {
  const { role } = req.user
  if (role !== 2) {
    return responseError(res, 406, 'Not Accepteble', 'You are not an user')
  } else {
    next()
  }
}

module.exports = { isAdmin, isUser }
