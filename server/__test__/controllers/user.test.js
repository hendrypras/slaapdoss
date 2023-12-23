const request = require('supertest')
const app = require('../../src/index')
const { sequelize } = require('../../src/models/index')
const { queryInterface } = sequelize
const { Users } = require('../../src/models')
const config = require('../../config')
const path = require('path')
const { generateAuthToken } = require('../../src/services/authService')
const dummyUser = {
  email: 'dummy@mail.com',
  username: 'dummy',
  password: 'password12Db3',
}

let token
const tokenUserNotExists = generateAuthToken(
  { id: 123, role: 2 },
  config.authentication.accessTokenSecret,
  config.authentication.expAccessToken
)
const imageNotAccept = path.join(__dirname, `../static/images/ktp.svg`)
const imageAccept = path.join(__dirname, `../static/images/ktp.jpeg`)

beforeAll(done => {
  Users.create(dummyUser)
    .then(res => {
      const accessToken = generateAuthToken(
        { id: res.id, role: res.role },
        config.authentication.accessTokenSecret,
        config.authentication.expAccessToken
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
  test('Failed user notfound with status 404', done => {
    request(app)
      .get('/api/user/profile')
      .set('authorization', `Bearer ${tokenUserNotExists}`)
      .then(res => {
        expect(res.status).toBe(401)
        expect(res.body.status).toBe('Unauthorized')
        expect(res.body.message).toBe('User not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Get data crutial user', () => {
  test('Success get data Users with status 200', done => {
    request(app)
      .get('/api/user/credential')
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
  test('Failed user notfound with status 404', done => {
    request(app)
      .get('/api/user/credential')
      .set('authorization', `Bearer ${tokenUserNotExists}`)
      .then(res => {
        expect(res.status).toBe(401)
        expect(res.body.status).toBe('Unauthorized')
        expect(res.body.message).toBe('User not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Update user profile', () => {
  test('Failed empty image with status 400', done => {
    request(app)
      .patch('/api/user/update/profile')
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toBe('Image is required')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed format image with status 400', done => {
    request(app)
      .patch('/api/user/update/profile')
      .set('authorization', `Bearer ${token}`)
      .attach('profile', imageNotAccept)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe(
          'Unsupported file type! Please upload only JPG, JPEG, or PNG images.'
        )
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  jest.mock('../../src/configDb/cloudinary', () => ({
    uploadToCloudinary: jest.fn().mockImplementation((file, type) => {
      return {
        url: 'https://example.com/image.jpg',
        public_id: 'public_id_here',
        error: null,
      }
    }),
  }))
  test('Success update profile with status 200 ', done => {
    request(app)
      .patch('/api/user/update/profile')
      .set('authorization', `Bearer ${token}`)
      .attach('profile', imageAccept)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
