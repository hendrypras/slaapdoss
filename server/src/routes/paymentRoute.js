const express = require('express')
const Authenticated = require('../middleware/authentication')
const { isUser } = require('../middleware/authorization')
const {
  paymentNotification,
  getPaymentMethods,
  getResponsePaymentByOrderId,
  createPayment,
  cancelTransaction,
} = require('../controllers/paymentCtrl')

const router = express.Router()

router.post('/payment', Authenticated, isUser, createPayment)
router.post('/payment/notification', paymentNotification)
router.post(
  '/payment/cancel/:orderId',
  Authenticated,
  isUser,
  cancelTransaction
)

router.post('/payment/notification', paymentNotification)

router.get('/payment/methods', Authenticated, getPaymentMethods)
router.get(
  '/payment/response/:orderId',
  Authenticated,
  isUser,
  getResponsePaymentByOrderId
)

module.exports = router
