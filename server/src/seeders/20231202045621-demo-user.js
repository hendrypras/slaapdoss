'use strict'

const config = require('../../config')
const { hashPassword } = require('../utils/bcryptPassword')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@gmail.com',
        image_url: config.avatarDefaultUrl,
        image_public_id: 'avatar',
        password: hashPassword('passwordadmin'),
        verified: false,
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
