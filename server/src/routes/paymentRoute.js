const express = require('express')
const Authenticated = require('../middleware/authentication')
const { isUser } = require('../middleware/authorization')
const {
  createPayment,
  paymentNotification,
  getPaymentMethods,
  getResponsePaymentByOrderId,
  createPaymentSnap,
} = require('../controllers/paymentCtrl')

const router = express.Router()

router.post('/payment', Authenticated, isUser, createPayment)
router.post('/payment/snap', createPaymentSnap)
router.post('/payment/notification', paymentNotification)

router.get('/payment/methods', Authenticated, getPaymentMethods)
router.get(
  '/payment/response/:orderId',
  Authenticated,
  isUser,
  getResponsePaymentByOrderId
)

module.exports = router
