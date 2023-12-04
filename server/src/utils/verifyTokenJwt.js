const jwt = require('jsonwebtoken')
const verifyTokenJwt = (token, secret, cb) => {
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      cb(err, null)
    } else {
      cb(null, decoded)
    }
  })
}
module.exports = verifyTokenJwt
