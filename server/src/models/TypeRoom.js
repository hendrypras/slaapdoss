'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TypeRoom extends Model {
    static associate(models) {}
  }
  TypeRoom.init(
    {
      name: DataTypes.STRING,
      capacity: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'TypeRoom',
      tableName: 'type_room',
    }
  )
  return TypeRoom
}
