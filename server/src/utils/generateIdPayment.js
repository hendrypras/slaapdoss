const generateIdPayment = () => {
  const otpLength = 8
  const min = 10 ** (otpLength - 1)
  const max = 10 ** otpLength - 1
  return Math.floor(Math.random() * (max - min + 1)) + min
}
module.exports = generateIdPayment
