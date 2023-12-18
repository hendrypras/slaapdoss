'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    static associate(models) {
      Rooms.hasMany(models.Orders, {
        as: 'orders',
        foreignKey: {
          name: 'room_id',
        },
      })
      Rooms.belongsTo(models.TypeRoom, {
        as: 'type_room',
        foreignKey: {
          name: 'type_room_id',
        },
      })
      Rooms.belongsTo(models.Cabins, {
        foreignKey: 'cabins_slug',
        targetKey: 'slug',
        as: 'cabin',
      })
      Rooms.hasMany(models.RoomDateReservations, {
        foreignKey: 'room_id',
        as: 'reservation_date',
      })
    }
  }
  Rooms.init(
    {
      cabins_slug: DataTypes.STRING,
      room_number: DataTypes.STRING,
      type_room_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Rooms',
      tableName: 'rooms',
    }
  )
  return Rooms
}
