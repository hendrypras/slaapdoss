const { responseError, responseSuccess } = require('../helpers/responseHandler')
const {
  Orders,
  Users,
  Rooms,
  ResponsePayments,
  TypeRoom,
  Cabins,
} = require('../models')
exports.getOrders = async (req, res) => {
  try {
    const authData = req.user
    const { orderId, page = 1, limit = 2 } = req.query
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
