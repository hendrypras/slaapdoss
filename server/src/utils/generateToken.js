const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const generateAuthToken = (data, tokenSecret, exp) => {
  return jwt.sign(data, tokenSecret, {
    expiresIn: exp,
  })
}
const generateStepToken = data => {
  return jwt.sign(data, process.env.OTP_SECRET)
}
const generateResetPasswordToken = () => {
  return crypto.randomBytes(32).toString('hex')
}
module.exports = {
  generateAuthToken,
  generateResetPasswordToken,
  generateStepToken,
}
