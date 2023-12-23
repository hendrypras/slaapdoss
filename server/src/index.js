const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const { createClient } = require('redis')
const Routes = require('./routes/index')
const http = require('http')
const cookieParser = require('cookie-parser')
const compression = require('compression')

dotenv.config()
const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT
const redisClient = createClient()

;(async () => {
  await redisClient.connect()
})()

redisClient.on('ready', () => {
  console.log('redis connected successfully!')
})
redisClient.on('error', err => {
  console.log('Error in the Connection', err)
})

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(compression())
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/api', Routes)
const NODE_ENV = process.env.NODE_ENV
if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.all('*', (req, res) => {
  res.status(404).json({ message: 'URL Not Found', status: 404 })
})

if (!module.parent) {
  server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
  })
}

module.exports = app
