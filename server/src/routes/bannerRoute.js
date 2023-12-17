const express = require('express')
const {
  createBanner,
  getBanners,
  deleteBanner,
} = require('../controllers/bannerCtrl')
const uploadMedia = require('../middleware/uploadMedia')
const router = express.Router()

router.post(
  '/banner',
  uploadMedia.fields([{ name: 'banner', maxCount: 1 }]),
  createBanner
)
router.get('/banners', getBanners)
router.delete('/banner/:bannerId', deleteBanner)

module.exports = router
