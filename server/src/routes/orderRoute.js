const express = require('express')
const Authenticated = require('../middleware/authentication')
const { isUser } = require('../middleware/authorization')
const { getOrders } = require('../controllers/orderCtrl')

const router = express.Router()

router.get('/orders', Authenticated, isUser, getOrders)

module.exports = router
