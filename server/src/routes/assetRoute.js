const express = require('express')
const { getStaticAssets, getTranslation } = require('../controllers/assetCtrl')
const router = express.Router()

router.get('/asset/web', getStaticAssets)
router.get('/translation/web', getTranslation)

module.exports = router
