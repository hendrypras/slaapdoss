const express = require('express')
const Authenticated = require('../middleware/authentication')
const { isUser, isAdmin } = require('../middleware/authorization')
const {
  getOrdersUser,
  getOrders,
  getOrderSuccess,
} = require('../controllers/orderCtrl')

const router = express.Router()

router.get('/orders', Authenticated, isUser, getOrdersUser)
router.get('/order/success/:orderId', Authenticated, isUser, getOrderSuccess)
router.get('/orders/all', Authenticated, isAdmin, getOrders)

module.exports = router
