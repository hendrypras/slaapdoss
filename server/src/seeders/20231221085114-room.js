'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('rooms', [
      {
        cabins_slug: 'slaapcabin-bromo',
        room_number: 12,
        type_room_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('rooms', null, {})
  },
}
