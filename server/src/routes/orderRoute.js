const express = require('express')
const Authenticated = require('../middleware/authentication')
const { isUser, isAdmin } = require('../middleware/authorization')
const {
  getOrdersUser,
  getOrders,
  getOrderDetail,
} = require('../controllers/orderCtrl')

const router = express.Router()

router.get('/orders', Authenticated, isUser, getOrdersUser)
router.get('/order/:orderId', Authenticated, isUser, getOrderDetail)
router.get('/orders/all', getOrders)

module.exports = router
