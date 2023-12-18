'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      Orders.belongsTo(models.Users, {
        as: 'user',
        foreignKey: {
          name: 'user_id',
        },
      })
      Orders.belongsTo(models.Rooms, {
        as: 'room',
        foreignKey: {
          name: 'room_id',
        },
      })
      Orders.hasOne(models.ResponsePayments, {
        foreignKey: 'order_id',
        sourceKey: 'order_id',
        as: 'response_payment',
      })
    }
  }
  Orders.init(
    {
      room_id: DataTypes.INTEGER,
      order_id: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      total_price: DataTypes.BIGINT,
      stay_duration: DataTypes.INTEGER,
      start_reservation: DataTypes.STRING,
      end_reservation: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Orders',
      tableName: 'orders',
    }
  )
  return Orders
}
