const express = require('express')
const {
  login,
  forgotPassword,
  register,
  verifyOtp,
  changePassword,
  registerWithGoogle,
  requestOtp,
  refreshToken,
  logout,
  verifyTokenResetPassword,
} = require('../controllers/authCtrl')
const router = express.Router()

router.post('/auth/login', login)
router.post('/auth/register', register)
router.post('/auth/register/google', registerWithGoogle)
router.post('/auth/forgot-password', forgotPassword)
router.post('/auth/otp', requestOtp)
router.post('/auth/verify-otp', verifyOtp)
router.post('/auth/logout', logout)
router.post('/auth/verify-token/:token', verifyTokenResetPassword)

router.get('/auth/refresh-token', refreshToken)

router.patch('/auth/reset-password/:token', changePassword)

module.exports = router
