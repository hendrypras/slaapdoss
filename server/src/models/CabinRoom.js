'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CabinRooms extends Model {
    static associate(models) {
      CabinRooms.hasMany(models.Orders, {
        as: 'room',
        foreignKey: {
          name: 'cabin_room_id',
        },
      })
      CabinRooms.belongsTo(models.TypeCabin, {
        as: 'type_cabin',
        foreignKey: {
          name: 'type_cabin_id',
        },
      })
      CabinRooms.belongsTo(models.Cabins, {
        foreignKey: 'cabins_slug',
        sourceKey: 'slug',
        as: 'cabins_rooms',
      })
      CabinRooms.hasMany(models.RoomDateReservations, {
        foreignKey: 'cabin_room_id',
        as: 'reservation_date',
      })
    }
  }
  CabinRooms.init(
    {
      cabins_slug: DataTypes.STRING,
      room_number: DataTypes.STRING,
      type_cabin_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'CabinRooms',
      tableName: 'cabin_rooms',
    }
  )
  return CabinRooms
}
