'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TypeCabin extends Model {
    static associate(models) {
      TypeCabin.hasMany(models.CabinRooms, {
        as: 'type_cabin',
        foreignKey: {
          name: 'type_cabin_id',
        },
      })
    }
  }
  TypeCabin.init(
    {
      name: DataTypes.STRING,
      information: DataTypes.STRING,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
      cabins_slug: DataTypes.STRING,
      price: DataTypes.INTEGER,
      capacity: DataTypes.STRING,
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
      modelName: 'TypeCabin',
      tableName: 'type_cabin',
    }
  )
  return TypeCabin
}
