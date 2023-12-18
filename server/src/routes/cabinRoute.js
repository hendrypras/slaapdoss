const express = require('express')
const Authenticated = require('../middleware/authentication')
const {
  createCabin,
  getCabins,
  getTypeCabin,
  getCabinsLocation,
  updateTypeCabin,
  getDetailCabinRoomById,
  createTypeRoom,
  createRoom,
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
router.put(
  '/cabin/type-room/:typeCabinId',
  Authenticated,
  isAdmin,
  uploadMedia.fields([{ name: 'typeImage', maxCount: 1 }]),
  updateTypeCabin
)
router.post('/cabin/room', Authenticated, isAdmin, createRoom)

router.get('/cabin/type-room', Authenticated, isAdmin, getTypeCabin)
router.get('/cabins/detail/:slug', getCabins)
router.get('/cabins/location', getCabinsLocation)
router.get('/cabin/room/:slug/:roomId', getDetailCabinRoomById)

module.exports = router
