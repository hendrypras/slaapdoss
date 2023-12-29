'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('type_room', 'information')
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('type_room')
  },
}
