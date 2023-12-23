'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('id_card', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nik: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      birthday: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      id_card_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_card_public_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
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
    await queryInterface.dropTable('id_card')
  },
}
