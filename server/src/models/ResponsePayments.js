'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ResponsePayments extends Model {}
  ResponsePayments.init(
    {
      status_code: DataTypes.STRING,
      status_message: DataTypes.STRING,
      transaction_id: DataTypes.STRING,
      order_id: DataTypes.STRING,
      merchant_id: DataTypes.STRING,
      gross_amount: DataTypes.STRING,
      currency: DataTypes.STRING,
      payment_type: DataTypes.STRING,
      transaction_time: DataTypes.STRING,
      transaction_status: DataTypes.STRING,
      fraud_status: DataTypes.STRING,
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
