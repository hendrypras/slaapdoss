const request = require('supertest')
const app = require('../index')

describe('Get StaticAssets', () => {
  test('Success with status 200', done => {
    request(app)
      .get('/api/asset/web')
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
describe('Get Translation', () => {
  test('Success  get translation with status 200', done => {
    request(app)
      .get('/api/translation/web')
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
