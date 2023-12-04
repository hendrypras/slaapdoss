'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CabinRooms extends Model {
    static associate(models) {}
  }
  CabinRooms.init(
    {
      title: DataTypes.STRING,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
      price: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price_after_discount: DataTypes.INTEGER,
      facility_room_id: DataTypes.STRING,
      information: DataTypes.STRING,
      breakfast: DataTypes.BOOLEAN,
      discount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'CabinRooms',
      tableName: 'cabin_rooms',
    }
  )
  return CabinRooms
}
