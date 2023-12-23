const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const Redis = require('ioredis')
const redisClient = new Redis()

const generateOtp = () => {
  const otpLength = 6
  const min = Math.pow(10, otpLength - 1)
  const max = Math.pow(10, otpLength) - 1
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getLockingUser = async keyUser => {
  const attempts = await redisClient.get(keyUser)
  return attempts ? parseInt(attempts, 10) : 0
}

const setLockingUser = (keyUser, countLocking) => {
  redisClient.set(keyUser, countLocking + 1, 'EX', 10)
}
const generateResetPasswordToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

const generateAuthToken = (data, tokenSecret, exp) => {
  return jwt.sign(data, tokenSecret, {
    expiresIn: exp,
  })
}

const generateStepToken = data => {
  return jwt.sign(data, config.otpSecret)
}

const generateTokens = user => {
  const accessToken = generateAuthToken(
    { id: user.id, role: user.role },
    config.authentication.accessTokenSecret,
    config.authentication.expAccessToken
  )

  const refreshToken = generateAuthToken(
    { id: user.id },
    config.authentication.refreshTokenSecret,
    config.authentication.expRefreshToken
  )

  return { accessToken, refreshToken }
}
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('__refreshToken__', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: false,
  })
}
module.exports = {
  generateTokens,
  generateAuthToken,
  generateStepToken,
  setRefreshTokenCookie,
  generateResetPasswordToken,
  getLockingUser,
  setLockingUser,
  generateOtp,
}
