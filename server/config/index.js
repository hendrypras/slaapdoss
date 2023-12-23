const development = require('./development')
const test = require('./test.env')

const nodeENV = process.env.NODE_ENV || 'development'

const env = { development, test }[nodeENV]

const config = {
  databaseMysql: {
    name: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    dialect: env.DB_DIALECT,
  },
  cloudinary: {
    name: env.CLOUDINARY_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
  midtrans: {
    clientKey: env.MIDTRANS_CLIENT_KEY,
    serverKey: env.MIDTRANS_SERVER_KEY,
    sandBoxUrl: env.MIDTRANS_SANBOX_URL,
    isProduction: env.MIDTRANS_IS_PRODUCTION,
  },
  authentication: {
    accessTokenSecret: env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
    expAccessToken: env.EXP_ACCESS_TOKEN,
    expRefreshToken: env.EXP_REFRESH_TOKEN,
  },
  nodemailer: {
    mailId: env.MAIL_ID,
    mp: env.MP,
  },
  cryptoSecret: env.CRYPTO_SECRET,
  otpSecret: env.OTP_SECRET,
  baseUrlClient: env.BASE_URL_CLIENT,
  avatarDefaultUrl: env.AVATAR_URL_DEFAULT,
  avatarDefaultId: env.AVATAR_DEFAULT_ID,
}

module.exports = config
