// file schedule

const { CronJob } = require('cron')
require('dotenv').config()
const callApi = require('../utils/callApi')
const { Orders } = require('../models')

const sandBoxMidtransUrl = process.env.MIDTRANS_SANDBOX_URL
const serverKeyMidtrans = process.env.MIDTRANS_SERVER_KEY

const expireTransaction = new CronJob(
  '*/2 * * * *',
  async orderId => {
    try {
      console.log(orderId, '<<<order id cron')
      const findOrder = await Orders.findOne({ where: { order_id: orderId } })
      if (!findOrder) {
        console.error(`Order with id ${orderId} not found`)
        return
      }
      if (findOrder.transaction_status !== 'pending') {
        console.error(`Order with id ${orderId} has been canceled`)
        return
      }
      const url = `${sandBoxMidtransUrl}/${orderId}/expire`
      const headers = {
        Authorization: `Basic ${Buffer.from(serverKeyMidtrans + ':').toString(
          'base64'
        )}`,
      }

      const response = await callApi(url, 'POST', headers)
      console.log(`Transaction with orderId ${orderId} expired:`, response)
    } catch (error) {
      console.error('Error expiring transaction:', error.message || error)
    }
  },
  null,
  false, // Set this to false initially, will start based on createPayment
  'Asia/Jakarta'
)

module.exports = { expireTransaction }
