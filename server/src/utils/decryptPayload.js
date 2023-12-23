const CryptoJS = require('crypto-js')
const config = require('../../config')
const decryptObjectPayload = token => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, config.cryptoSecret)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    return null
  }
}
const decryptTextPayload = token => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, config.cryptoSecret)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    return null
  }
}

module.exports = {
  decryptObjectPayload,
  decryptTextPayload,
}
