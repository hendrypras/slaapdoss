const { responseError } = require('../helpers/responseHandler')
const verifyJwtToken = require('../utils/verifyTokenJwt')

const { Users } = require('../models')
const config = require('../../config')

const Authenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return responseError(
        res,
        401,
        'Unauthorized',
        'Invalid Authorization header'
      )

    const token = authHeader.split(' ')[1]

    if (!token)
      return responseError(res, 401, 'Unauthorized', 'Token is missing')

    verifyJwtToken(
      token,
      config.authentication.accessTokenSecret,
      async (err, decoded) => {
        if (err) {
          return responseError(
            res,
            403,
            'Forbidden',
            'Token expired or invalid'
          )
        }

        const user = await Users.findByPk(decoded.id, {
          attributes: { exclude: ['password'] },
        })

        if (!user)
          return responseError(res, 401, 'Unauthorized', 'User not found')

        req.user = user
        return next()
      }
    )
  } catch (error) {
    return responseError(res, 500, 'Internal Server Error', 'An error occurred')
  }
}

module.exports = Authenticated
