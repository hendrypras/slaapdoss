const express = require('express')
const { getUserProfile, getUserProfile2 } = require('../controllers/userCtrl')
const Authenticated = require('../middleware/authentication')
const router = express.Router()

router.get('/user/profile', Authenticated, getUserProfile)
router.get('/user/profile/2', Authenticated, getUserProfile2)

module.exports = router
