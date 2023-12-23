'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class IdCard extends Model {
    static associate(models) {
      IdCard.belongsTo(models.Users, { foreignKey: 'user_id', as: 'id_card' })
    }
  }
  IdCard.init(
    {
      nik: DataTypes.STRING,
      name: DataTypes.STRING,
      birthday: DataTypes.STRING,
      id_card_url: DataTypes.STRING,
      id_card_public_id: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'IdCard',
      tableName: 'id_card',
    }
  )
  return IdCard
}
