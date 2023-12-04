const express = require('express')
const { getAssets } = require('../controllers/assetCtrl')
const router = express.Router()

router.get('/asset/web', getAssets)

module.exports = router
