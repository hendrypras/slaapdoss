const express = require('express')
const { getAssets } = require('../controllers/assetCtrl')
const router = express.Router()

router.get('/assets/web', getAssets)

module.exports = router
