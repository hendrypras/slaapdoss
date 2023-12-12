const express = require('express')
const Authenticated = require('../middleware/authentication')
const {
  createCabin,
  getCabins,
  createTypeCabin,
  createCabinRoom,
  getTypeCabin,
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
  createTypeCabin
)
router.post('/cabin/room', Authenticated, isAdmin, createCabinRoom)

router.get('/cabin/type-room', getTypeCabin)
router.get('/cabins', getCabins)

module.exports = router
