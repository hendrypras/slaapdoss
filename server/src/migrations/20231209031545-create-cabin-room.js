'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cabins_slug: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      room_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
        indexes: [
          {
            fields: ['room_number'],
            name: 'room_number_index',
          },
        ],
      },
      type_room_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms')
  },
}
