'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CabinInformations extends Model {
    static associate(models) {}
  }
  CabinInformations.init(
    {
      title: DataTypes.STRING,
      about_descriptiondes: DataTypes.TEXT,
      image_url: DataTypes.STRING,
      image_public_url: DataTypes.STRING,
      additional_info_id: DataTypes.STRING,
      lat: DataTypes.INTEGER,
      long: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'CabinInformations',
      tableName: 'cabin_informations',
    }
  )
  return CabinInformations
}
