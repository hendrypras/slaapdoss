const request = require('supertest')
const app = require('../index')
const { Users, Banners } = require('../models')
const { generateAuthToken } = require('../utils/generateToken')
const { sequelize } = require('../models/index')
const { queryInterface } = sequelize
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const EXP_ACCESS_TOKEN = process.env.EXP_ACCESS_TOKEN

const dummyAdmin = {
  email: 'admin1@mail.com',
  username: 'admin1',
  password: 'password123',
  role: 1,
}
const dummyBanner = {
  title: 'test',
  description: 'test',
  active: true,
  image_url: 'https://banner.com',
  image_public_id: 'test',
}
let token
let bannerId
beforeAll(done => {
  Promise.all([Users.create(dummyAdmin), Banners.create(dummyBanner)])
    .then(([userRes, bannerRes]) => {
      const accessToken = generateAuthToken(
        { id: userRes.id, role: userRes.role },
        ACCESS_TOKEN_SECRET,
        EXP_ACCESS_TOKEN
      )
      token = accessToken
      bannerId = bannerRes.id
      done()
    })
    .catch(err => {
      done(err)
    })
})

afterAll(done => {
  Promise.all([
    queryInterface.bulkDelete('users', null, {}),
    queryInterface.bulkDelete('banners', null, {}),
  ])
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
})
describe('Create banner', () => {
  test('Failed with status 400', done => {
    request(app)
      .post('/api/banner')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: 'test',
        description: 'test',
        active: true,
        banner: 'httls',
      })
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
})
describe('Get banners user', () => {
  test('Success with status 200', done => {
    request(app)
      .get('/api/banners')
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
})
describe('Get banners user admin', () => {
  test('Success with status 200', done => {
    request(app)
      .get('/api/banners/all')
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
})
describe('Update status banner by admin', () => {
  test('Success with status 200', done => {
    request(app)
      .patch(`/api/banner/private/${bannerId}`)
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failded with status 404 notfound', done => {
    request(app)
      .patch(`/api/banner/private/102`)
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('Banner not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failded with status 400 ', done => {
    request(app)
      .patch(`/api/banner/dummy/${bannerId}`)
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe(
          "The only statuses allowed are 'private' and 'public'"
        )
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
describe('Delete banner by admin', () => {
  test('Success with status 200', done => {
    request(app)
      .delete(`/api/banner/${bannerId}`)
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failded with status 404 notfound', done => {
    request(app)
      .delete(`/api/banner/102`)
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('Banner not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
