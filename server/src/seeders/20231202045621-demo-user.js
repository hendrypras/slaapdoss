'use strict'

const { hashPassword } = require('../utils/bcryptPassword')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@gmail.com',
        image_url: process.env.AVATAR_URL_DEFAULT,
        image_public_id: 'avatar',
        password: hashPassword('passwordadmin'),
        role: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {})
  },
}
