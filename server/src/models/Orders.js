'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      // define association here
    }
  }
  Orders.init(
    {
      cabin_room_id: DataTypes.INTEGER,
      order_id: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      total_price: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      stay_duration: DataTypes.INTEGER,
      start_reservation: DataTypes.DATE,
      end_reservation: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Orders',
      tableName: 'orders',
    }
  )
  return Orders
}
