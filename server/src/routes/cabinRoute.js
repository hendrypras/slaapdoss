const express = require('express')
const Authenticated = require('../middleware/authentication')
const {
  createCabin,
  getCabins,
  createTypeCabin,
  createCabinRoom,
  getTypeCabin,
  getCabinsLocation,
  updateTypeCabin,
  getDetailCabinRoomById,
} = require('../controllers/cabinCtrl')
const uploadMedia = require('../middleware/uploadMedia')
const { isAdmin } = require('../middleware/authorization')
const router = express.Router()

router.post(
  '/cabin',

  uploadMedia.fields([{ name: 'cabin', maxCount: 1 }]),
  createCabin
)
router.post(
  '/cabin/type-room',

  uploadMedia.fields([{ name: 'typeImage', maxCount: 1 }]),
  createTypeCabin
)
router.put(
  '/cabin/type-room/:typeCabinId',

  uploadMedia.fields([{ name: 'typeImage', maxCount: 1 }]),
  updateTypeCabin
)
router.post('/cabin/room', createCabinRoom)

router.get('/cabin/type-room', getTypeCabin)
router.get('/cabins/detail/:slug', getCabins)
router.get('/cabins/location', getCabinsLocation)
router.get('/cabin/room/:slug/:roomId', getDetailCabinRoomById)

module.exports = router
