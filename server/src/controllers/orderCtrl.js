const { responseError, responseSuccess } = require('../helpers/responseHandler')
const {
  Orders,
  Users,
  Rooms,
  ResponsePayments,
  TypeRoom,
} = require('../models')
exports.getOrders = async (req, res) => {
  try {
    const authData = req.user
    const { orderId } = req.query
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
              model: TypeRoom,
              as: 'type_room',
              attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
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
      order: [['createdAt', 'DESC']],
    })

    return responseSuccess(res, 200, 'success', {
      results: orderId ? rows[0] : rows,
      count,
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
