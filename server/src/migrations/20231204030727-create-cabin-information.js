'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cabin_informations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      about_description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      image_url: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image_public_url: {
        type: Sequelize.STRING,
        unique: true,
      },
      additional_info_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      lat: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      long: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('cabin_informations')
  },
}
