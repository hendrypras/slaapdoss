const request = require('supertest')
require('dotenv').config()
const app = require('../index')
const { sequelize } = require('../models/index')
const { queryInterface } = sequelize
const { generateAuthToken } = require('../utils/generateToken')
const { Users } = require('../models')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const EXP_ACCESS_TOKEN = process.env.EXP_ACCESS_TOKEN
const dummyUser = {
  email: 'dummy@mail.com',
  username: 'dummy',
  password: 'password123',
}

let token

beforeAll(done => {
  Users.create(dummyUser)
    .then(res => {
      const accessToken = generateAuthToken(
        { id: res.id, role: res.role },
        ACCESS_TOKEN_SECRET,
        EXP_ACCESS_TOKEN
      )
      token = accessToken
      done()
    })
    .catch(err => {
      done(err)
    })
})

afterAll(done => {
  queryInterface
    .bulkDelete('users', null, {})
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
})

describe('Get User profile', () => {
  test('Success get Users with status 200', done => {
    request(app)
      .get('/api/user/profile')
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('User not found with status 404', done => {
    const fakeToken = generateAuthToken(
      { id: 999, role: 'user' },
      ACCESS_TOKEN_SECRET,
      EXP_ACCESS_TOKEN
    )

    request(app)
      .get('/api/user/profile')
      .set('authorization', `Bearer ${fakeToken}`)
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('User Notfound')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
