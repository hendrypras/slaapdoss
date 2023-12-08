const { AES } = require('crypto-js')

const encryptPayload = data => {
  try {
    if (typeof data === 'object') {
      return AES.encrypt(
        JSON.stringify(data),
        process.env.TOKEN_PAYLOAD
      ).toString()
    }
    if (typeof data === 'string') {
      return AES.encrypt(data, process.env.TOKEN_PAYLOAD).toString()
    }
  } catch (error) {
    Promise.reject(error)
  }
}

module.exports = encryptPayload
