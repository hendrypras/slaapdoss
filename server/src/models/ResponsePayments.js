'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ResponsePayments extends Model {
    static associate(models) {
      ResponsePayments.belongsTo(models.Orders, {
        foreignKey: 'order_id',
        sourceKey: 'order_id',
        as: 'response_payment',
      })
    }
  }
  ResponsePayments.init(
    {
      status_code: DataTypes.STRING,
      status_message: DataTypes.STRING,
      transaction_id: DataTypes.STRING,
      order_id: DataTypes.STRING,
      gross_amount: DataTypes.STRING,
      payment_type: DataTypes.STRING,
      transaction_time: DataTypes.DATE,
      transaction_status: DataTypes.STRING,
      va_number: DataTypes.STRING,
      bank: DataTypes.STRING,
      expiry_time: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ResponsePayments',
      tableName: 'response_payments',
      timestamps: false,
    }
  )
  return ResponsePayments
}
