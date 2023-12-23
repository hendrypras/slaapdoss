const request = require('supertest')
const app = require('../../src/index')
const { Users, Banners } = require('../../src/models')
const { sequelize } = require('../../src/models/index')
const { queryInterface } = sequelize
const config = require('../../config')
const path = require('path')
const { generateAuthToken } = require('../../src/services/authService')

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
const imageNotAccept = path.join(__dirname, `../static/images/banner.webp`)
const imageAccept = path.join(__dirname, `../static/images/banner.jpg`)

let token
let bannerId
beforeAll(done => {
  Promise.all([Users.create(dummyAdmin), Banners.create(dummyBanner)])
    .then(([userRes, bannerRes]) => {
      const accessToken = generateAuthToken(
        { id: userRes.id, role: userRes.role },
        config.authentication.accessTokenSecret,
        config.authentication.expAccessToken
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
  test('Image not acceptable with status 400', done => {
    request(app)
      .post('/api/banner')
      .set('authorization', `Bearer ${token}`)
      .attach('banner', imageNotAccept)
      .field('title', 'test')
      .field('description', 'test')
      .field('active', true)
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
  test('Validation Failed with status 400', done => {
    request(app)
      .post('/api/banner')
      .set('authorization', `Bearer ${token}`)
      .attach('banner', imageAccept)
      .field('description', 'test')
      .field('active', true)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toBe('title is required.')
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
  test('Success create banner with status 200', done => {
    request(app)
      .post('/api/banner')
      .set('authorization', `Bearer ${token}`)
      .attach('banner', imageAccept)
      .field('title', 'test')
      .field('description', 'test')
      .field('active', true)
      .then(res => {
        expect(res.status).toBe(201)
        expect(res.body.status).toBe('success')
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
