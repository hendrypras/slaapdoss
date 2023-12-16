'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Banners extends Model {
    static associate(models) {}
  }
  Banners.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Banners',
      tableName: 'banners',
    }
  )
  return Banners
}
