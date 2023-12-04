'use strict'
const { Model } = require('sequelize')
const { hashPassword } = require('../utils/bcryptPassword')
require('dotenv').config()
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {}
  }
  Users.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
      role: DataTypes.INTEGER,
      refresh_token: DataTypes.STRING,
      reset_password_token: DataTypes.STRING,
      reset_password_token_exp: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: user => {
          user.password = hashPassword(user.password)
          user.role = 2
          if (!user.image_url) {
            user.image = process.env.AVATAR_URL_DEFAULT
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
