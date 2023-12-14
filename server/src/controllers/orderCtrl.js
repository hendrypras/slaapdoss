const { responseError, responseSuccess } = require('../helpers/responseHandler')
const {
  Orders,
  Users,
  CabinRooms,
  ResponsePayments,
  TypeCabin,
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
          model: CabinRooms,
          as: 'room',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: TypeCabin,
              as: 'type_cabin',
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
    })

    return responseSuccess(res, 200, 'success', {
      results: count === 1 ? rows[0] : rows,
      count,
    })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
