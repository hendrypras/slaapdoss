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
const sequelize = require('../configDb/connectDb')

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
          attributes: ['username'],
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
          sequelize.literal(`
            CASE 
              WHEN response_payment.transaction_status = 'pending' THEN 1
              WHEN response_payment.transaction_status = 'settlement' THEN 2
              ELSE 3
            END
          `),
          'ASC',
        ],
        ['createdAt', 'DESC'],
      ],

      limit: Number(limit),
      offset: (Number(page) - 1) * limit,
    })
    if (orderId) {
      const foundOrder = count > 0 ? rows[0] : null
      if (!foundOrder) {
        return responseError(
          res,
          404,
          'Not Found',
          'Order with this id not found'
        )
      }
      return responseSuccess(res, 200, 'success', {
        results: foundOrder,
        count,
      })
    } else {
      return responseSuccess(res, 200, 'success', { results: rows, count })
    }
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.getOrders = async (req, res) => {
  try {
    const { orderId, page = 1, limit = 18 } = req.query
    const whereClause = orderId ? { order_id: orderId } : {}

    const [ordersResult, responseTransactionStatusCount] = await Promise.all([
      Orders.findAndCountAll({
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
      }),
      ResponsePayments.findAll({
        attributes: [
          'transaction_status',
          [sequelize.fn('COUNT', 'transaction_status'), 'count'],
          [
            sequelize.fn(
              'SUM',
              sequelize.literal(
                'CASE WHEN transaction_status = "settlement" THEN gross_amount ELSE 0 END'
              )
            ),
            'total_gross_amount',
          ],
        ],
        group: ['transaction_status'],
      }),
    ])

    const { count, rows } = ordersResult

    const transactionStatusCounts = {}
    const totalGrossAmountSettlement = responseTransactionStatusCount
      ?.find(status => status?.transaction_status === 'settlement')
      ?.get('total_gross_amount')

    responseTransactionStatusCount?.forEach(status => {
      transactionStatusCounts[status.transaction_status] = status.get('count')
    })

    return responseSuccess(res, 200, 'success', {
      results: rows,
      count,
      transactionStatusCounts,
      totalGrossAmountSettlement,
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}

exports.getOrderDetail = async (req, res) => {
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
          attributes: ['email', 'username'],
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
              attributes: [
                'name',
                'capacity',
                'price',
                'image_url',
                'breakfast',
              ],
            },
          ],
        },
        {
          model: ResponsePayments,
          as: 'response_payment',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
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
