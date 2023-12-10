'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('response_payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_message: {
        type: Sequelize.STRING,
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      order_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gross_amount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payment_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transaction_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      transaction_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      va_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bank: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiry_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('response_payments')
  },
}
