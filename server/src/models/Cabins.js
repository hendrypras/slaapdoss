'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cabins extends Model {
    static associate(models) {}
  }
  Cabins.init(
    {
      name: DataTypes.STRING,
      city: DataTypes.STRING,
      description: DataTypes.TEXT,
      address: DataTypes.STRING,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
      slug: DataTypes.STRING,
      province: DataTypes.STRING,
      village: DataTypes.STRING,
      district: DataTypes.STRING,
      city_name: DataTypes.STRING,
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
