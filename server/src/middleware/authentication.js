const { responseError } = require('../helpers/responseHandler')
const verifyJwtToken = require('../utils/verifyTokenJwt')
require('dotenv').config()

const { Users } = require('../models')
const Authenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader) {
      return responseError(
        res,
        401,
        'Unauthorized',
        "Sorry you haven't logged in yet"
      )
    }

    const token = authHeader.split(' ')[1]
    if (token) {
      verifyJwtToken(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            return responseError(res, 403, 'Forbidden', 'Token exp')
          }
          const user = await Users.findByPk(decoded.id, {
            attributes: { exclude: ['password'] },
          })
          if (!user)
            return responseError(res, 404, 'Not Found', 'User Notfound')
          req.user = user
          next()
        }
      )
    }
  } catch (error) {
    return responseError(res)
  }
}

module.exports = Authenticated
