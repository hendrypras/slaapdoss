const { errorHandler } = require('../helpers')

const isAdmin = async (req, res, next) => {
  const { role } = req.user
  if (role !== 1) {
    return errorHandler(res, 406, 'Not Accepteble', 'You are not an admin')
  } else {
    next()
  }
}
const isUser = async (req, res, next) => {
  const { role } = req.user
  if (role !== 2) {
    return errorHandler(res, 406, 'Not Accepteble', 'You are not an user')
  } else {
    next()
  }
}

module.exports = { isAdmin, isUser }
