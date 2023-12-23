const midtransClient = require('midtrans-client')
const config = require('../../config')
const coreApi = new midtransClient.CoreApi({
  isProduction: config.midtrans.isProduction,
  serverKey: config.midtrans.serverKey,
  clientKey: config.midtrans.clientKey,
})

module.exports = { coreApi }
