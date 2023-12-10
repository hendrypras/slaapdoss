'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CabinRoom extends Model {
    static associate(models) {}
  }
  CabinRoom.init(
    {
      name: DataTypes.STRING,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
      price: DataTypes.INTEGER,
      type_cabin: DataTypes.INTEGER,
      information: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'CabinRoom',
      tableName: 'cabin_rooms',
    }
  )
  return CabinRoom
}
