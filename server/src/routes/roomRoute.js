const express = require('express')
const { getTypeRoom, createRoom } = require('../controllers/roomCtrl')
const Authenticated = require('../middleware/authentication')
const { isAdmin } = require('../middleware/authorization')
const uploadMedia = require('../middleware/uploadMedia')
const router = express.Router()

router.get('/room/type', getTypeRoom)
router.post(
  '/room',
  Authenticated,
  isAdmin,
  uploadMedia.fields([{ name: 'room', maxCount: 1 }]),
  createRoom
)

module.exports = router
