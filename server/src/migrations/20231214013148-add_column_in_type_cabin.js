'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'type_cabin', // table name
        'cabins_slug', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('type_cabin', 'cabins_slug'),
    ])
  },
}
