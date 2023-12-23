'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cabins extends Model {
    static associate(models) {
      Cabins.hasMany(models.Rooms, {
        foreignKey: 'cabins_slug',
        sourceKey: 'slug',
        as: 'rooms',
      })
    }
  }
  Cabins.init(
    {
      name: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.STRING,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
      slug: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Cabins',
      tableName: 'cabins',
    }
  )
  return Cabins
}
