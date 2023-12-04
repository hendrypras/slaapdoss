const { Op } = require('sequelize')
const moment = require('moment')
const path = require('path')

const { coreApi, snap } = require('../config/midtrans')
const { decryptTextPayload } = require('../utils/decryptPayload')
const { ResponsePayments, Users } = require('../models')
const { validateBodyCreatePayment } = require('../helpers/validationJoi')
const loadData = require('../helpers/databaseHelper')
const sequelize = require('../config/connectDb')
const { responseError, responseSuccess } = require('../helpers/responseHandler')
exports.createPayment = async (req, res) => {
  try {
    const { order_detail, request_midtrans } = req.body
    const { sku, limit_in_month } = order_detail
    const grossAmount = request_midtrans?.transaction_details?.gross_amount
    const decGrossAmount = decryptTextPayload(grossAmount)
    if (!decGrossAmount)
      return responseError(res, 403, 'Forbidden', 'Invalid payload')
    const authData = req.user
    request_midtrans.transaction_details.gross_amount = Number(decGrossAmount)
    const validate = validateBodyCreatePayment({
      order_detail,
      request_midtrans,
    })
    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }
    const database = path.join(
      __dirname,
      '../../database/priceListPremiumAccount.json'
    )
    const packet = loadData(database)
    const findPacket = packet?.find(item => item.sku === sku)
    if (!packet || !findPacket)
      return responseError(res, 404, 'Not found', 'packet not found')

    const currentDateTime = moment()
    const premiumDateTime = moment(authData?.premium_date)
    if (authData?.premium_date && premiumDateTime.isAfter(currentDateTime)) {
      return responseError(res, 400, 'Bad Request', 'You have subscribed')
    }

    coreApi
      .charge(request_midtrans)
      .then(async chargeResponse => {
        try {
          const { va_numbers, ...rest } = chargeResponse
          if (va_numbers && va_numbers?.length > 0) {
            await ResponsePayments.create({
              va_number: va_numbers[0]?.va_number,
              bank: va_numbers[0]?.bank,
              ...rest,
            })
          }
          const newPremiumDateTime = currentDateTime.add(
            limit_in_month,
            'months'
          )
          await Users.update(
            { premium_date: newPremiumDateTime },
            { where: { id: authData?.id } }
          )
          return responseSuccess(res, 201, 'Created', chargeResponse)
        } catch (error) {
          return responseError(res)
        }
      })
      .catch(e => {
        if (e.ApiResponse) {
          const errorMessage = e.ApiResponse.status_message
          const statusCode = e.ApiResponse.status_code
          return responseError(
            res,
            statusCode,
            'Internal Server Error',
            errorMessage
          )
        } else {
          return responseError(res)
        }
      })
  } catch (error) {
    return responseError(res)
  }
}

exports.createPaymentSnap = async (req, res) => {
  try {
    let parameter = {
      transaction_details: {
        order_id: 'YOUR-ORDERID-1234562',
        gross_amount: 10000,
      },
    }
    const token = await snap.createTransactionToken(parameter)
    return responseSuccess(res, 200, 'success', { token })
  } catch (error) {
    return responseError(res)
  }
}
exports.paymentNotification = async (req, res) => {
  const statusResponse = await coreApi.transaction.notification(req.body)
  const orderId = statusResponse.order_id
  const transactionStatus = statusResponse.transaction_status

  try {
    await sequelize.transaction(async t => {
      const existingResponse = await ResponsePayments.findOne({
        where: {
          order_id: orderId,
          transaction_status: { [Op.ne]: transactionStatus },
        },
        transaction: t,
      })

      if (existingResponse) {
        await existingResponse.update(
          { transaction_status: transactionStatus },
          { transaction: t }
        )
        let message = ''
        if (transactionStatus === 'settlement') {
          message = 'Order status updated to paid'
        } else if (transactionStatus === 'expire') {
          message = 'Order status updated to expire'
        } else if (transactionStatus === 'cancel') {
          message = 'Order status updated to cancel'
        }
        return responseSuccess(res, 200, 'Ok', message)
      } else {
        return responseSuccess(res, 200, 'Ok', 'Create payment successfully')
      }
    })
  } catch (error) {
    return responseError(res)
  }
}

exports.getPaymentMethods = async (req, res) => {
  try {
    const database = path.join(__dirname, '../../database/paymentMethods.json')
    const response = loadData(database)
    if (!response) return responseError(res)
    const filterData = response.filter(item => item.active)
    return responseSuccess(res, 200, 'Ok', filterData)
  } catch (error) {
    return responseError(res)
  }
}
exports.getResponsePaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params
    const response = await ResponsePayments.findOne({
      where: { order_id: orderId },
    })
    if (!response)
      return responseError(res, 404, 'Not Found', 'order id not found')
    return responseSuccess(res, 200, 'Ok', response)
  } catch (error) {
    return responseError(res)
  }
}
