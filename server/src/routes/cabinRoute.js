const express = require('express')
const Authenticated = require('../middleware/authentication')
const {
  createCabin,
  getTypeRoom,
  getCabinsLocation,
  getDetailCabinRoomById,
  createTypeRoom,
  createRoom,
  getCabinBySlug,
} = require('../controllers/cabinCtrl')
const uploadMedia = require('../middleware/uploadMedia')
const { isAdmin } = require('../middleware/authorization')
const router = express.Router()

router.post(
  '/cabin',
  Authenticated,
  isAdmin,
  uploadMedia.fields([{ name: 'cabin', maxCount: 1 }]),
  createCabin
)
router.post(
  '/cabin/type-room',
  Authenticated,
  isAdmin,
  uploadMedia.fields([{ name: 'typeImage', maxCount: 1 }]),
  createTypeRoom
)

router.post('/cabin/room', Authenticated, isAdmin, createRoom)

router.get('/cabin/type-room', Authenticated, isAdmin, getTypeRoom)
router.get('/cabin/detail/:slug', getCabinBySlug)
router.get('/cabins/location', getCabinsLocation)
router.get('/cabin/room/:slug/:roomId', getDetailCabinRoomById)

module.exports = router
