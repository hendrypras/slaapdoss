'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class RoomDateReservations extends Model {
    static associate(models) {
      RoomDateReservations.belongsTo(models.Rooms, {
        foreignKey: 'room_id',
        as: 'reservation_date',
      })
    }
  }
  RoomDateReservations.init(
    {
      start_reservation: DataTypes.STRING,
      end_reservation: DataTypes.STRING,
      room_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'RoomDateReservations',
      tableName: 'room_date_reservations',
    }
  )
  return RoomDateReservations
}
