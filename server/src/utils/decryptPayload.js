const CryptoJS = require('crypto-js')

const decryptObjectPayload = token => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, process.env.TOKEN_PAYLOAD)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    return null
  }
}
const decryptTextPayload = token => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, process.env.TOKEN_PAYLOAD)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    return null
  }
}

module.exports = {
  decryptObjectPayload,
  decryptTextPayload,
}
