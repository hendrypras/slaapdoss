'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TypeRoom extends Model {
    static associate(models) {
      TypeRoom.hasMany(models.Rooms, {
        as: 'rooms',
        foreignKey: {
          name: 'type_room_id',
        },
      })
      TypeRoom.belongsTo(models.Cabins, {
        foreignKey: 'cabins_slug',
        targetKey: 'slug',
        as: 'cabin',
      })
    }
  }
  TypeRoom.init(
    {
      name: DataTypes.STRING,
      capacity: DataTypes.STRING,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
      price: DataTypes.BIGINT,
      cabins_slug: DataTypes.STRING,
      breakfast: DataTypes.BOOLEAN,
    },
    {
      hooks: {
        beforeCreate: type => {
          if (!type.breakfast) {
            type.breakfast = false
          }
        },
      },
      sequelize,
      modelName: 'TypeRoom',
      tableName: 'type_room',
    }
  )
  return TypeRoom
}
