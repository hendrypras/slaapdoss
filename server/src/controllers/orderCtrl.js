const { responseError, responseSuccess } = require('../helpers/responseHandler')
const {
  Orders,
  Users,
  Rooms,
  ResponsePayments,
  TypeRoom,
  Cabins,
  IdCard,
} = require('../models')
const encryptPayload = require('../utils/encryptPayload')
const sequelize = require('../config/connectDb')

exports.getOrdersUser = async (req, res) => {
  try {
    const authData = req.user
    const { orderId, page = 1, limit = 18 } = req.query
    const whereClause = { user_id: authData.id }
    if (orderId) {
      whereClause.order_id = orderId
    }
    const { count, rows } = await Orders.findAndCountAll({
      include: [
        {
          model: Users,
          as: 'user',
          attributes: ['id', 'username', 'image_url'],
        },
        {
          model: Rooms,
          as: 'room',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: Cabins,
              as: 'cabin',
              attributes: ['address', 'name', 'city'],
            },
            {
              model: TypeRoom,
              as: 'type_room',
              attributes: [
                'name',
                'capacity',
                'price',
                'information',
                'image_url',
                'breakfast',
              ],
            },
          ],
        },
        {
          model: ResponsePayments,
          as: 'response_payment',
        },
      ],
      where: whereClause,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [
        [
          sequelize.literal(
            "response_payment.transaction_status = 'settlement'"
          ),
          'DESC',
        ],
        ['createdAt', 'DESC'],
      ],
      limit: Number(limit),
      offset: (Number(page) - 1) * limit,
    })
    let results = rows
    if (orderId) {
      results = rows[0]
    }
    return responseSuccess(res, 200, 'success', {
      results,
      count,
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.getOrders = async (req, res) => {
  try {
    const { orderId, page = 1, limit = 18 } = req.query
    const whereClause = {}
    if (orderId) {
      whereClause.order_id = orderId
    }
    const { count, rows } = await Orders.findAndCountAll({
      include: [
        {
          model: Users,
          as: 'user',
          attributes: ['username', 'email'],
        },
        {
          model: Rooms,
          as: 'room',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: Cabins,
              as: 'cabin',
              attributes: ['name', 'city'],
            },
            {
              model: TypeRoom,
              as: 'type_room',
              attributes: ['name'],
            },
          ],
        },
        {
          model: ResponsePayments,
          as: 'response_payment',
          attributes: ['transaction_status', 'va_number', 'order_id'],
        },
      ],
      where: whereClause,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * limit,
    })
    let results = rows
    if (orderId) {
      results = rows.slice(0, 1)
    }
    return responseSuccess(res, 200, 'success', {
      results,
      count,
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
exports.getOrderSuccess = async (req, res) => {
  try {
    const { orderId } = req.params
    const response = await Orders.findOne({
      where: { order_id: orderId },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Users,
          as: 'user',
          attributes: ['email'],
          include: [
            {
              model: IdCard,
              as: 'id_card',
              attributes: ['name', 'nik'],
            },
          ],
        },
        {
          model: Rooms,
          as: 'room',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: Cabins,
              as: 'cabin',
              attributes: ['name', 'city', 'address'],
            },
            {
              model: TypeRoom,
              as: 'type_room',
              attributes: ['name'],
            },
          ],
        },
        {
          model: ResponsePayments,
          as: 'response_payment',
          where: { transaction_status: 'settlement' },
          attributes: [
            'transaction_status',
            'payment_type',
            'bank',
            'order_id',
          ],
        },
      ],
    })
    if (!response)
      return responseError(
        res,
        404,
        'Not Found',
        `Order with id ${orderId} not found`
      )
    if (response?.user?.id_card) {
      const encryptedNik = encryptPayload(response.user?.id_card?.nik)
      response.user.id_card.nik = encryptedNik
    }
    return responseSuccess(res, 200, 'success', response)
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
