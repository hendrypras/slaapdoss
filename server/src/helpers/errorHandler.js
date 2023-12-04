const errorHandler = (
  res,
  status = 500,
  statusMessage = 'Internal server error',
  message = "Something wen't wrong"
) => {
  return res.status(status).json({ status: statusMessage, message })
}
module.exports = errorHandler
