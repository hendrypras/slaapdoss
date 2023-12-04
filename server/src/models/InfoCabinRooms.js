'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class InfoCabinRooms extends Model {
    static associate(models) {}
  }
  InfoCabinRooms.init(
    {
      cabin_room_id: DataTypes.INTEGER,
      cabin_information_id: DataTypes.INTEGER,
      slug_place_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'InfoCabinRooms',
      tableName: 'info_cabin_rooms',
    }
  )
  return InfoCabinRooms
}
