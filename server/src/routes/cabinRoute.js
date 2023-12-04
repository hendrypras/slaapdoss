const express = require('express')
const Authenticated = require('../middleware/authentication')
const { createCabin } = require('../controllers/cabinCtrl')
const uploadMedia = require('../middleware/uploadMedia')
const router = express.Router()

router.post(
  '/cabin',
  uploadMedia.fields([{ name: 'image', maxCount: 1 }]),
  createCabin
)

module.exports = router
