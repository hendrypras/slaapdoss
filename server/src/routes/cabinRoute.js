const express = require('express')
const Authenticated = require('../middleware/authentication')
const { createCabin, getCabins } = require('../controllers/cabinCtrl')
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
router.get('/cabins', getCabins)

module.exports = router
