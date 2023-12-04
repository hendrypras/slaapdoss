const { Router } = require('express')

const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const paymentRoute = require('./paymentRoute')
const cabinRoute = require('./cabinRoute')
const assetRoute = require('./assetRoute')

const router = Router()

router.use(authRoute)
router.use(cabinRoute)
router.use(paymentRoute)
router.use(userRoute)
router.use(assetRoute)

module.exports = router
