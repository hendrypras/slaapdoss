const { Op } = require('sequelize')
const path = require('path')

const { coreApi } = require('../config/midtrans')
const generateIdPayment = require('../utils/generateIdPayment')
const { decryptTextPayload } = require('../utils/decryptPayload')
const { ResponsePayments, Orders, CabinRoom } = require('../models')
const { validateBodyCreatePayment } = require('../helpers/validationJoi')
const loadData = require('../helpers/databaseHelper')
const sequelize = require('../config/connectDb')
const { responseError, responseSuccess } = require('../helpers/responseHandler')

exports.createPayment = async (req, res) => {
  try {
    const {
      price,
      quantity,
      cabinRoomId,
      stayDuration,
      startReservation,
      endReservation,
      paymentType,
      bank,
    } = req.body
    const authData = req.user

    if (!authData?.verified) {
      return responseError(
        res,
        400,
        'Bad Request',
        'Sorry, your account has not been verified. Please verify your account on the user profile page'
      )
    }

    const priceDec = decryptTextPayload(price)
    const stayDurationDec = decryptTextPayload(stayDuration)
    const startReservationDec = decryptTextPayload(startReservation)
    const endReservationDec = decryptTextPayload(endReservation)

    if (!priceDec || !startReservationDec || !endReservationDec) {
      return responseError(res, 400, 'Bad Request', 'Invalid payload')
    }
    const validate = validateBodyCreatePayment({
      price: Number(priceDec),
      quantity: Number(quantity),
      cabinRoomId: Number(cabinRoomId),
      stayDuration: Number(stayDurationDec),
      startReservation: startReservationDec,
      endReservation: endReservationDec,
      paymentType,
      bank,
    })

    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }

    const checkRoomAvailability = await CabinRoom.findByPk(cabinRoomId)

    if (!checkRoomAvailability) {
      return responseError(res, 404, 'Not Found', 'Cabin room not found')
    }

    if (checkRoomAvailability?.quantity < quantity) {
      return responseError(
        res,
        400,
        'Bad Request',
        'The cabin space you are looking for is no longer available'
      )
    }

    const totalPrice = Number(priceDec) * Number(quantity)

    const requestMidtrans = {
      payment_type: paymentType,
      transaction_details: {
        order_id: `ID-${generateIdPayment()}`,
        gross_amount: totalPrice,
      },
      bank_transfer: {
        bank,
      },
    }

    let chargeResponse

    try {
      chargeResponse = await coreApi.charge(requestMidtrans)
    } catch (e) {
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
        return responseError(res, e.status, e.message)
      }
    }

    let createdOrder

    try {
      createdOrder = await sequelize.transaction(async t => {
        const updatedRoom = await CabinRoom.findByPk(cabinRoomId, {
          transaction: t,
          lock: true, // lock the row for update
        })

        if (!updatedRoom) {
          throw new Error('Cabin room not found')
        }

        if (updatedRoom.quantity < quantity) {
          throw new Error('Insufficient quantity available')
        }

        updatedRoom.quantity -= quantity
        await updatedRoom.save({ transaction: t })

        const { va_numbers, ...rest } = chargeResponse

        if (va_numbers && va_numbers?.length > 0) {
          await ResponsePayments.create(
            {
              va_number: va_numbers[0]?.va_number,
              bank: va_numbers[0]?.bank,
              ...rest,
            },
            { transaction: t }
          )
        }

        const order = await Orders.create(
          {
            cabin_room_id: cabinRoomId,
            order_id: chargeResponse?.order_id,
            user_id: authData?.id,
            total_price: totalPrice,
            quantity,
            stay_duration: Number(stayDurationDec),
            start_reservation: startReservationDec,
            end_reservation: endReservationDec,
          },
          { transaction: t }
        )

        return order
      })
    } catch (error) {
      await responseError(
        res,
        500,
        'Internal Server Error',
        error.message || 'An error occurred while processing your request'
      )
    }

    if (!createdOrder) {
      return responseError(
        res,
        500,
        'Internal Server Error',
        'Failed to create order'
      )
    }

    return responseSuccess(res, 201, 'success', chargeResponse)
  } catch (error) {
    return responseError(
      res,
      500,
      'Internal Server Error',
      'An error occurred while processing your request'
    )
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
    const filterData = response.filter(item => item.is_active)
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
