'use strict'

const { hashPassword } = require('../utils/bcryptPassword')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        first_name: 'hendry',
        last_name: 'pras',
        email: 'hendry@gmail.com',
        password: hashPassword('password123'),
        role: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {})
  },
}
