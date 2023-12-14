const { Op } = require('sequelize')
const path = require('path')
const { coreApi } = require('../config/midtrans')
const generateIdPayment = require('../utils/generateIdPayment')
const { decryptTextPayload } = require('../utils/decryptPayload')
const {
  ResponsePayments,
  Orders,
  CabinRooms,
  RoomDateReservations,
} = require('../models')
const { validateBodyCreatePayment } = require('../helpers/validationJoi')
const loadData = require('../helpers/databaseHelper')
const sequelize = require('../config/connectDb')
const { responseError, responseSuccess } = require('../helpers/responseHandler')
const {
  checkDateRange,
  calculateDurationInDays,
} = require('../services/paymentService')

exports.createPayment = async (req, res) => {
  let t

  try {
    const {
      price,
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

    if (!priceDec || !stayDurationDec) {
      return responseError(res, 400, 'Bad Request', 'Invalid payload')
    }

    const validate = validateBodyCreatePayment({
      price: Number(priceDec),
      cabinRoomId: Number(cabinRoomId),
      stayDuration: Number(stayDurationDec),
      startReservation: parseInt(startReservation),
      endReservation: parseInt(endReservation),
      paymentType,
      bank,
    })
    if (validate) {
      return responseError(res, 400, 'Validation Failed', validate)
    }
    if (endReservation <= startReservation) {
      return responseError(
        res,
        400,
        'Bad Request',
        'End reservation date should not be earlier than start reservation date'
      )
    }
    const numberOfDay = calculateDurationInDays(
      parseInt(startReservation),
      parseInt(endReservation)
    )

    const checkRoomAvailability = await CabinRooms.findByPk(cabinRoomId, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
      include: [
        {
          model: RoomDateReservations,
          as: 'reservation_date',
          attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
          where: {
            cabin_room_id: cabinRoomId,
          },
          required: false,
        },
      ],
    })

    if (!checkRoomAvailability) {
      return responseError(res, 404, 'Not Found', 'Cabin room not found')
    }

    const checkDate = checkDateRange(
      startReservation,
      endReservation,
      checkRoomAvailability?.reservation_date
    )
    if (
      checkRoomAvailability?.reservation_date?.length > 0 ||
      checkDate.length > 0
    ) {
      return responseError(res, 400, 'Bad Request', 'Room not available')
    }

    const totalPrice = Number(priceDec) * numberOfDay
    t = await sequelize.transaction()

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
        await t.rollback()
        return responseError(
          res,
          Number(statusCode),
          'Internal Server Error',
          errorMessage
        )
      } else {
        await t.rollback()
        return responseError(
          res,
          500,
          e.status,
          e.message || 'Unknown error occurred'
        )
      }
    }

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

    await RoomDateReservations.create(
      {
        cabin_room_id: cabinRoomId,
        start_reservation: startReservation.toString(),
        end_reservation: endReservation.toString(),
      },
      { transaction: t }
    )
    await Orders.create(
      {
        cabin_room_id: cabinRoomId,
        order_id: chargeResponse?.order_id,
        user_id: authData?.id,
        total_price: totalPrice,
        stay_duration: Number(stayDurationDec),
        start_reservation: startReservation.toString(),
        end_reservation: endReservation.toString(),
      },
      { transaction: t }
    )

    await t.commit() // Commit transaction if success all
    return responseSuccess(res, 201, 'success', chargeResponse)
  } catch (error) {
    if (t) await t.rollback() // Rollback transaction
    return responseError(
      res,
      500,
      'Internal Server Error',
      error.message || 'An error occurred while processing your request'
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
    return responseError(res, error.status)
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
