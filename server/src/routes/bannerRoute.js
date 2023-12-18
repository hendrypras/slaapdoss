const express = require('express')
const {
  createBanner,
  getBanners,
  deleteBanner,
  getBannersByAdmin,
} = require('../controllers/bannerCtrl')
const uploadMedia = require('../middleware/uploadMedia')
const router = express.Router()
const { isAdmin } = require('../middleware/authorization')
const Authenticated = require('../middleware/authentication')

router.post(
  '/banner',
  Authenticated,
  isAdmin,
  uploadMedia.fields([{ name: 'banner', maxCount: 1 }]),
  createBanner
)
router.get('/banners/all', Authenticated, isAdmin, getBannersByAdmin)
router.get('/banners', getBanners)
router.delete('/banner/:bannerId', Authenticated, isAdmin, deleteBanner)

module.exports = router
