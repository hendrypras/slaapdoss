'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class RoomDateReservations extends Model {
    static associate(models) {
      RoomDateReservations.belongsTo(models.CabinRooms, {
        foreignKey: 'cabin_room_id',
        as: 'reservation_date',
      })
    }
  }
  RoomDateReservations.init(
    {
      start_reservation: DataTypes.DATE,
      end_reservation: DataTypes.DATE,
      cabin_room_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'RoomDateReservations',
      tableName: 'room_date_reservations',
    }
  )
  return RoomDateReservations
}
