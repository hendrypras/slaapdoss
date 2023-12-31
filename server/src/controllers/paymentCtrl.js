const config = require('../../config')
const { Op } = require('sequelize')
const path = require('path')
const { coreApi } = require('../configDb/midtrans')
const { decryptTextPayload } = require('../utils/decryptPayload')
const {
  ResponsePayments,
  Orders,
  Rooms,
  RoomDateReservations,
} = require('../models')
const { validateBodyCreatePayment } = require('../helpers/validationJoi')
const loadData = require('../helpers/databaseHelper')
const sequelize = require('../configDb/connectDb')
const { responseError, responseSuccess } = require('../helpers/responseHandler')
const {
  checkDateRange,
  calculateDurationInDays,
  generateIdPayment,
} = require('../services/paymentService')
const sendEmail = require('../utils/sendEmail')
const callApi = require('../utils/callApi')
const { responsePaymentBodyEmail } = require('../helpers/bodyEmail')
const { getCurrentDate } = require('../services/cabinService')

exports.createPayment = async (req, res) => {
  let t

  try {
    const {
      price,
      roomId,
      stayDuration,
      startReservation,
      endReservation,
      paymentType,
      bank,
    } = req.body
    const authData = req.user
    const currentDate = getCurrentDate()

    if (!authData?.verified)
      return responseError(
        res,
        406,
        'Not Acceptable',
        'Sorry, your account has not been verified. Please verify your account on the user profile page'
      )

    if (endReservation <= startReservation || startReservation < currentDate)
      return responseError(
        res,
        409,
        'Conflict',
        'End reservation date should not be earlier than start reservation date'
      )

    const priceDec = decryptTextPayload(price)
    const stayDurationDec = decryptTextPayload(stayDuration)

    if (!priceDec || !stayDurationDec)
      return responseError(res, 400, 'Bad Request', 'Invalid payload')

    const validate = validateBodyCreatePayment({
      price: Number(priceDec),
      roomId: Number(roomId),
      stayDuration: Number(stayDurationDec),
      startReservation: parseInt(startReservation),
      endReservation: parseInt(endReservation),
      paymentType,
      bank,
    })

    if (validate) return responseError(res, 400, 'Validation Failed', validate)

    const numberOfDay = calculateDurationInDays(
      parseInt(startReservation),
      parseInt(endReservation)
    )

    const checkRoomAvailability = await Rooms.findByPk(roomId, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
      include: [
        {
          model: RoomDateReservations,
          as: 'reservation_date',
          attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
          where: {
            room_id: roomId,
          },
          required: false,
        },
      ],
    })

    if (!checkRoomAvailability)
      return responseError(res, 404, 'Not Found', 'Cabin room not found')

    const checkDate = checkDateRange(
      startReservation,
      endReservation,
      checkRoomAvailability?.reservation_date
    )

    if (checkDate.length > 0)
      return responseError(res, 400, 'Bad Request', 'Room not available')

    const totalPrice = Number(priceDec) * numberOfDay
    t = await sequelize.transaction()
    const generateOrderId = `${generateIdPayment()}${authData.id}${roomId}`
    const requestMidtrans = {
      payment_type: paymentType,
      transaction_details: {
        order_id: generateOrderId,
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
        room_id: roomId,
        start_reservation: startReservation.toString(),
        end_reservation: endReservation.toString(),
      },
      { transaction: t }
    )

    await Orders.create(
      {
        room_id: roomId,
        order_id: chargeResponse?.order_id,
        user_id: authData?.id,
        total_price: totalPrice,
        stay_duration: Number(stayDurationDec),
        start_reservation: startReservation.toString(),
        end_reservation: endReservation.toString(),
      },
      { transaction: t }
    )

    await t.commit()

    const paymentBodyEmail = responsePaymentBodyEmail(
      authData.username,
      chargeResponse?.order_id
    )
    const data = {
      to: authData.email,
      text: `Hi ${authData.username}`,
      subject: 'Reservation Cabin Slaapdoss',
      htm: paymentBodyEmail,
    }

    sendEmail(data)

    return responseSuccess(res, 201, 'success', chargeResponse)
  } catch (error) {
    if (t) await t.rollback()
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
          await existingResponse.update(
            { expiry_time: null },
            { transaction: t }
          )
          message = 'Order status updated to paid'
        } else if (
          transactionStatus === 'expire' ||
          transactionStatus === 'cancel'
        ) {
          await existingResponse.update(
            { expiry_time: null },
            { transaction: t }
          )
          const relatedReservation = await Orders.findOne({
            where: { order_id: orderId },
            attributes: ['room_id', 'start_reservation', 'end_reservation'],
            transaction: t,
          })

          if (relatedReservation) {
            await RoomDateReservations.destroy({
              where: {
                room_id: relatedReservation.room_id,
                start_reservation: relatedReservation.start_reservation,
                end_reservation: relatedReservation.end_reservation,
              },
              transaction: t,
            })
          }
          message = 'Order status updated to expire or deleted'
        }

        return responseSuccess(res, 200, 'Ok', message)
      } else {
        return responseSuccess(res, 200, 'Ok', 'success')
      }
    })
  } catch (error) {
    return responseError(res, error.status)
  }
}

exports.cancelTransaction = async (req, res) => {
  try {
    const { orderId } = req.params

    const findOrder = await Orders.findOne({
      include: [
        {
          model: ResponsePayments,
          as: 'response_payment',
        },
      ],
      where: { order_id: orderId },
    })

    if (!findOrder)
      return responseError(
        res,
        404,
        'Nor Found',
        `Order with id ${orderId} not found`
      )

    if (findOrder?.response_payment?.transaction_status !== 'pending')
      return responseError(
        res,
        400,
        'Bad Request',
        `This Order has been ${findOrder?.response_payment?.transaction_status}`
      )
    const { sandBoxUrl, serverKey } = config.midtrans
    const url = `${sandBoxUrl}/${orderId}/cancel`
    const headers = {
      Authorization: `Basic ${Buffer.from(serverKey + ':').toString('base64')}`,
    }

    const response = await callApi(url, 'POST', headers)

    return responseSuccess(res, 200, 'success', response)
  } catch (error) {
    return responseError(res, error.status, error.message)
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
