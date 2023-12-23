const { AES } = require('crypto-js')
const config = require('../../config')

const encryptPayload = data => {
  try {
    if (typeof data === 'object') {
      return AES.encrypt(JSON.stringify(data), config.cryptoSecret).toString()
    }
    if (typeof data === 'string') {
      return AES.encrypt(data, config.cryptoSecret).toString()
    }
  } catch (error) {
    Promise.reject(error)
  }
}

module.exports = encryptPayload
