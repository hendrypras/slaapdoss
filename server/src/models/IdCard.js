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
      address: DataTypes.STRING,
      job: DataTypes.STRING,
      marial_status: DataTypes.STRING,
      birthday: DataTypes.STRING,
      religion: DataTypes.STRING,
      citizenship: DataTypes.STRING,
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
