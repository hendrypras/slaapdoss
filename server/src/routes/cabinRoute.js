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
  updateTypeRoom,
  getTypeRoomById,
  getCabins,
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

router.get('/cabin/type-room', getTypeRoom)
router.get('/cabin/type-room/:typeRoomId', getTypeRoomById)
router.get('/cabin/detail/:slug', getCabinBySlug)
router.get('/cabins/location', getCabinsLocation)
router.get('/cabin/room/:slug/:roomId', getDetailCabinRoomById)
router.get('/cabins', Authenticated, isAdmin, getCabins)

router.put(
  '/cabin/type-room/:typeRoomId',
  Authenticated,
  isAdmin,
  uploadMedia.fields([{ name: 'typeImage', maxCount: 1 }]),
  updateTypeRoom
)
module.exports = router
