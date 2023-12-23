const express = require('express')
const {
  getUserProfile,
  uploadIdCard,
  createIdCard,
  getDataCrutialUser,
  updateUserProfile,
} = require('../controllers/userCtrl')
const Authenticated = require('../middleware/authentication')
const { isUser } = require('../middleware/authorization')
const uploadMedia = require('../middleware/uploadMedia')

const router = express.Router()

router.get('/user/profile', Authenticated, getUserProfile)
router.get('/user/credential', Authenticated, isUser, getDataCrutialUser)
router.post('/user/upload/idcard', Authenticated, isUser, uploadIdCard)
router.patch(
  '/user/update/profile',
  Authenticated,
  isUser,
  uploadMedia.fields([{ name: 'profile', maxCount: 1 }]),
  updateUserProfile
)
router.post('/user/idcard', Authenticated, isUser, createIdCard)

module.exports = router
