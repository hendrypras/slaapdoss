const crypto = require('crypto')
const Redis = require('ioredis')
const { Op } = require('sequelize')
const { responseError, responseSuccess } = require('../helpers/responseHandler')
const { Users } = require('../models')
const { comparePassword } = require('../utils/bcryptPassword')

const {
  generateAuthToken,
  generateResetPasswordToken,
  generateStepToken,
} = require('../utils/generateToken')

const sendEmail = require('../utils/sendEmail')
const generateOtp = require('../utils/generateOtp')
const verifyJwtToken = require('../utils/verifyTokenJwt')
const {
  decryptObjectPayload,
  decryptTextPayload,
} = require('../utils/decryptPayload')
const { getLockingUser, setLockingUser } = require('../utils/guardLogin')

const {
  validateBodyGenerateOtpToEmail,
  validateBodyVerifyOtp,
  validateBodyRegisterWithGoogle,
  validateBodyRegister,
  validateBodyLogin,
  validateBodyChangePassword,
} = require('../helpers/validationJoi')
const {
  requestOtpBodyEmail,
  forgotPasswordBodyEmail,
} = require('../helpers/bodyEmail')
const redisClient = new Redis()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const EXP_ACCESS_TOKEN = process.env.EXP_ACCESS_TOKEN
const EXP_REFRESH_TOKEN = process.env.EXP_REFRESH_TOKEN

//generate otp to email
exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body
    const emailDecoded = decryptTextPayload(email)
    if (!emailDecoded)
      return responseError(res, 400, 'Bad Request', 'Invalid payload')
    const validate = validateBodyGenerateOtpToEmail({ email: emailDecoded })

    if (validate) return responseError(res, 400, 'Validation Failed', validate)

    const recipientName = emailDecoded.substring(0, emailDecoded.indexOf('@'))
    const user = await Users.findOne({ where: { email: emailDecoded } })
    if (user)
      return responseError(res, 400, 'Bad Request', 'Email already exists')

    const generatedOTP = generateOtp()
    const expirationTime = Math.floor(Date.now() / 1000) + 300
    redisClient.set(
      `otp-register-${emailDecoded}`,
      JSON.stringify({ code: generatedOTP, exp: expirationTime })
    )

    const otpBodyEmail = requestOtpBodyEmail(recipientName, generatedOTP)
    const data = {
      to: emailDecoded,
      text: `Hey ${recipientName}`,
      subject: 'OTP Verification',
      htm: otpBodyEmail,
    }
    await sendEmail(data)
    return responseSuccess(res, 201, 'success', {
      token: generateStepToken({ step: 2, email: emailDecoded }),
      otpExp: expirationTime,
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.verifyOtp = async (req, res) => {
  try {
    const { code, token } = req.body
    const validate = validateBodyVerifyOtp(req.body)
    if (validate) return responseError(res, 400, 'Validation Failed', validate)

    verifyJwtToken(token, process.env.OTP_SECRET, async (err, decoded) => {
      if (err) {
        return responseError(res, 400, 'Bad Request', 'Invalid token payload')
      } else {
        if (decoded?.step !== 2)
          return responseError(
            res,
            400,
            'Bad Request',
            'You have not completed the previous step'
          )
        const otp = await redisClient.get(`otp-register-${decoded?.email}`)
        if (!otp) return responseError(res, 400, 'Bad Request', 'Invalid OTP')
        const responseOtp = JSON.parse(otp)
        const currentDate = Math.floor(Date.now() / 1000)
        if (responseOtp?.exp < currentDate) {
          await redisClient.del(`otp-register-${decoded?.email}`)
          return responseError(res, 400, 'Bad Request', 'Otp Expire')
        }

        if (parseInt(responseOtp?.code) === parseInt(code)) {
          await redisClient.del(`otp-register-${decoded?.email}`)
          return responseSuccess(res, 200, 'success', {
            token: generateStepToken({ step: 3, email: decoded?.email }),
          })
        } else {
          return responseError(res, 400, 'Bad Request', 'Invalid OTP')
        }
      }
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

// register account
exports.register = async (req, res) => {
  try {
    const { payload, token } = req.body
    const decData = decryptObjectPayload(payload)
    if (!decData)
      return responseError(res, 400, 'Bad Request', 'Invalid payload')
    verifyJwtToken(token, process.env.OTP_SECRET, async (err, decoded) => {
      if (err) {
        return responseError(res, 400, 'Bad Requst', 'Invalid token payload')
      } else {
        if (decoded?.step !== 3)
          return responseError(
            res,
            400,
            'Bad Request',
            'You have not completed the previous step'
          )
        const validate = validateBodyRegister({
          token,
          email: decoded?.email,
          ...decData,
        })
        if (validate)
          return responseError(res, 400, 'Validation Failed', validate)

        const user = await Users.findOne({
          where: {
            [Op.or]: [
              { username: decData?.username },
              { email: decoded?.email },
            ],
          },
        })
        if (user)
          return responseError(
            res,
            400,
            'Bad Request',
            'Email or Username already exists'
          )
        await Users.create({
          username: decData.username,
          email: decoded?.email,
          password: decData.password,
        })
        return responseSuccess(res, 201, 'success')
      }
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

// login or register using google
exports.registerWithGoogle = async (req, res) => {
  try {
    const { username, image, email } = req.body
    const validate = validateBodyRegisterWithGoogle(req.body)
    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }
    const findUser = await Users.findOne({ where: { email } })
    if (!findUser) {
      const user = await Users.create({
        username: username + Math.floor(1000 + Math.random() * 9000),
        email,
        image,
        password:
          Math.random().toString(36).slice(-4) +
          Math.random().toString(36).slice(-4),
      })
      const accessToken = generateAuthToken(
        { id: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        EXP_ACCESS_TOKEN
      )
      const refreshToken = generateAuthToken(
        { id: user.id },
        REFRESH_TOKEN_SECRET,
        EXP_REFRESH_TOKEN
      )
      user.refresh_token = refreshToken
      await user.save()
      res.cookie('__refreshToken__', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      return responseSuccess(res, 201, 'success', { token: accessToken })
    } else {
      const accessToken = generateAuthToken(
        { id: findUser.id, role: findUser.role },
        ACCESS_TOKEN_SECRET,
        EXP_ACCESS_TOKEN
      )
      const refreshToken = generateAuthToken(
        { id: findUser.id },
        REFRESH_TOKEN_SECRET,
        EXP_REFRESH_TOKEN
      )
      findUser.refresh_token = refreshToken
      await findUser.save()
      res.cookie('__refreshToken__', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      return responseSuccess(res, 200, 'success', { token: accessToken })
    }
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const emailDec = decryptTextPayload(email)
    const passwordDec = decryptTextPayload(password)

    if (!emailDec || !passwordDec)
      return responseError(res, 400, 'Bad Request', 'Invalid payload')

    const validate = validateBodyLogin({
      email: emailDec,
      password: passwordDec,
    })

    if (validate) return responseError(res, 400, 'Validation Failed', validate)

    const user = await Users.findOne({ where: { email: emailDec } })

    if (!user) return responseError(res, 404, 'Not Found', 'User not found')

    const countLoginFail = await getLockingUser(user?.email)
    if (countLoginFail >= 3)
      return responseError(
        res,
        400,
        'Bad Request',
        'Too many requests password failed, please wait 5 minutes'
      )

    const isMatch = comparePassword(passwordDec, user.password)
    if (!isMatch) {
      setLockingUser(emailDec, countLoginFail)
      return responseError(res, 400, 'Bad Request', 'Invalid Password')
    }
    const accessToken = generateAuthToken(
      { id: user.id, role: user.role },
      ACCESS_TOKEN_SECRET,
      EXP_ACCESS_TOKEN
    )
    const refreshToken = generateAuthToken(
      { id: user.id },
      REFRESH_TOKEN_SECRET,
      EXP_REFRESH_TOKEN
    )
    user.refresh_token = refreshToken
    await user.save()
    res.cookie('__refreshToken__', refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      secure: false,
    })

    return responseSuccess(res, 200, 'success', {
      token: accessToken,
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies
    if (!cookies?.__refreshToken__)
      return responseError(res, 401, 'Unauthorized')
    const refreshToken = cookies.__refreshToken__
    verifyJwtToken(refreshToken, REFRESH_TOKEN_SECRET, async (err, decode) => {
      if (err) {
        return responseError(res, 403, 'Forbidden')
      } else {
        const user = await Users.findOne({
          where: { refresh_token: refreshToken, id: decode?.id },
        })
        if (!user)
          return responseError(
            res,
            404,
            'Not Found',
            'User with this token notfound'
          )
        const accessToken = generateAuthToken(
          { id: user.id, role: user.role },
          ACCESS_TOKEN_SECRET,
          EXP_ACCESS_TOKEN
        )
        return responseSuccess(res, 200, 'success', {
          token: accessToken,
        })
      }
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.logout = async (req, res) => {
  try {
    const { __refreshToken__: refreshToken } = req.cookies
    if (!refreshToken) {
      return responseError(res, 401, 'Unauthorized')
    }

    verifyJwtToken(refreshToken, REFRESH_TOKEN_SECRET, async (err, decode) => {
      if (err) {
        return responseError(res, 403, 'Forbidden')
      } else {
        const [, affectedRows] = await Users.update(
          { refresh_token: null },
          { where: { refresh_token: refreshToken } }
        )

        if (affectedRows === 0) {
          return responseError(
            res,
            404,
            'Not Found',
            'User with this token not found'
          )
        }

        res.clearCookie('__refreshToken__', {
          httpOnly: true,
          secure: false,
        })

        return responseSuccess(res, 200, 'success')
      }
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const emailDecoded = decryptTextPayload(email)
    if (!emailDecoded)
      return responseError(res, 400, 'Bad Request', 'Invalid payload')

    const validate = validateBodyGenerateOtpToEmail({ email: emailDecoded })
    if (validate) return responseError(res, 400, 'Validation Failed', validate)

    const user = await Users.findOne({ where: { email: emailDecoded } })

    if (!user)
      return responseError(
        res,
        404,
        'Not Found',
        'User with this email is not found'
      )

    const token = generateResetPasswordToken()
    await Users.update(
      {
        reset_password_token: crypto
          .createHash('sha256')
          .update(token)
          .digest('hex'),
        reset_password_token_exp: Date.now() + 5 * 60 * 1000, // 5 menit
      },
      {
        where: {
          id: user.id,
        },
      }
    )
    const data = {
      to: emailDecoded,
      text: `Hi ${user?.username}`,
      subject: 'Reset Your Password',
      htm: forgotPasswordBodyEmail(user?.username, token),
    }
    sendEmail(data)
    return responseSuccess(res, 201, 'success', { token })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { payload } = req.body
    const { token } = req.params
    const decData = decryptObjectPayload(payload)
    if (!decData)
      return responseError(res, 400, 'Bad Request', 'Invalid payload')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await Users.findOne({
      where: { reset_password_token: hashedToken },
    })
    if (!user) return responseError(res, 404, 'Not Found', 'User not found')
    const formatDateExp = parseInt(user.reset_password_token_exp, 10)
    const resetExpDate = new Date(formatDateExp)
    const now = new Date()
    if (resetExpDate < now) {
      return responseError(res, 400, 'Bad Request', 'Token expired')
    }
    const validate = validateBodyChangePassword(decData)
    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }
    user.password = decData?.password
    user.reset_password_token = null
    user.reset_password_token_exp = null
    await user.save()
    return responseSuccess(res, 200, 'success')
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.verifyTokenResetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await Users.findOne({
      where: { reset_password_token: hashedToken },
    })
    if (!user) return responseError(res, 400, 'Bad Request', 'Invalid token')
    const formatDateExp = parseInt(user.reset_password_token_exp, 10)
    const resetExpDate = new Date(formatDateExp)
    const now = new Date()
    if (resetExpDate < now) {
      return responseError(res, 400, 'Bad Request', 'Token expired')
    }
    return responseSuccess(res, 200, 'success')
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
