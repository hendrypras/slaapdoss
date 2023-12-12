'use strict'
const { Model } = require('sequelize')
const { hashPassword } = require('../utils/bcryptPassword')
require('dotenv').config()
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasOne(models.IdCard, { foreignKey: 'user_id', as: 'id_card' })
      Users.hasMany(models.Orders, {
        as: 'user',
        foreignKey: {
          name: 'user_id',
        },
      })
    }
  }
  Users.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
      role: DataTypes.INTEGER,
      verified: DataTypes.BOOLEAN,
      id_card_id: DataTypes.INTEGER,
      reset_password_token: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
      reset_password_token_exp: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: user => {
          user.password = hashPassword(user.password)
          user.verified = false
          user.role = 2
          if (!user.image_url) {
            user.image_url = process.env.AVATAR_URL_DEFAULT
          }
        },
        beforeUpdate: user => {
          if (user.changed('password')) {
            user.password = hashPassword(user.password)
          }
        },
      },
      sequelize,
      modelName: 'Users',
      tableName: 'users',
    }
  )
  return Users
}
