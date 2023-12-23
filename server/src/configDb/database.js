require('dotenv').config()
const config = require('../../config')
const { DB_TEST_NAME } = process.env
module.exports = {
  development: {
    username: config.databaseMysql.username,
    password: config.databaseMysql.password,
    database: config.databaseMysql.name,
    host: config.databaseMysql.host,
    dialect: config.databaseMysql.dialect,
  },
  test: {
    username: config.databaseMysql.username,
    password: config.databaseMysql.password,
    database: DB_TEST_NAME,
    host: config.databaseMysql.host,
    dialect: config.databaseMysql.dialect,
  },
  production: {
    username: config.databaseMysql.username,
    password: config.databaseMysql.password,
    database: config.databaseMysql.name,
    host: config.databaseMysql.host,
    dialect: config.databaseMysql.dialect,
  },
}
