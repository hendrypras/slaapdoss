const request = require('supertest')
const app = require('../index')
const { sequelize } = require('../models/index')
const { queryInterface } = sequelize
const { Users } = require('../models')

const dummyUser = {
  email: 'shendshpt@gmail.com',
  password: 'asdasd',
}
const loginEncrypt = {
  email: 'U2FsdGVkX1+4jiPB6ZHbnTlHDyAXtl0n1YjNakeSCFPsmlsWaEacdUwGrX2G4Hyq',
  password: 'U2FsdGVkX19d5Pc/aSExmPdlQEW5BlsEFYLGEGqDXYw=',
}
let tokenStep2
let tokenForgotPassword
beforeAll(done => {
  Users.create({
    username: 'shends',
    email: 'shendshpt@gmail.com',
    password: 'asdasd',
  })
    .then(res => {
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

describe('Send Otp For register', () => {
  test('Failed send otp when invalid payload', done => {
    request(app)
      .post('/api/auth/otp')
      .send({ email: 'dummy@gmail.com' })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toEqual('Invalid payload')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed send otp with status 400 validation failed', done => {
    request(app)
      .post('/api/auth/otp')
      .send({ email: loginEncrypt.password })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toEqual('email must be a valid email address.')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed send otp with status code 400', done => {
    request(app)
      .post('/api/auth/otp')
      .send({ email: loginEncrypt.email })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toEqual('Email already exists')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Success send otp to email with status 201', done => {
    request(app)
      .post('/api/auth/otp')
      .send({
        email:
          'U2FsdGVkX1/msPIq+BxybOjnXJigcHwPllzwGOpWe6bKd85IJl7GQOn0xrAerzEq',
      })
      .then(res => {
        expect(res.status).toBe(201)
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        tokenStep2 = res.body.data.token
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
describe('Verify Otp register', () => {
  test('Failed validation with status 400', done => {
    request(app)
      .post('/api/auth/verify-otp')
      .send({ code: '123123', token: tokenStep2 })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toEqual('code must be a number')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Invalida token payload with status 400', done => {
    request(app)
      .post('/api/auth/verify-otp')
      .send({
        code: 123456,
        token: 'ajsdfghasfdhjasfdhgasfdghafdhgasfrd67astdfhgasdasgh',
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toEqual('Invalid token payload')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Invalid OTP with status 400', done => {
    request(app)
      .post('/api/auth/verify-otp')
      .send({ code: 123456, token: tokenStep2 })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toEqual('Invalid OTP')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
describe('Register With google', () => {
  test('Validation failed with status 400', done => {
    request(app)
      .post('/api/auth/register/google')
      .send({
        email: 'email',
        username: 'test username',
        image: 'asdgfashgdfa',
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toEqual(
          'image must be a valid HTTP or HTTPS URI., email must be a valid email address.'
        )
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Success login with google account with status 200', done => {
    request(app)
      .post('/api/auth/register/google')
      .send({
        email: 'shendshpt@gmail.com',
        username: 'shends',
        image:
          'https://res.cloudinary.com/dlm3iavym/image/upload/v1701657426/avatar.svg',
      })
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
describe('Login', () => {
  test('Invalid encrypted payload', done => {
    request(app)
      .post('/api/auth/login')
      .send({ email: 'email@gmail.com', password: 'asdaskljdhgashdasjhas' })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe('Invalid payload')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed login user notfound with status 404', done => {
    request(app)
      .post('/api/auth/login')
      .send({
        email:
          'U2FsdGVkX1/msPIq+BxybOjnXJigcHwPllzwGOpWe6bKd85IJl7GQOn0xrAerzEq',
        password:
          'U2FsdGVkX1/msPIq+BxybOjnXJigcHwPllzwGOpWe6bKd85IJl7GQOn0xrAerzEq',
      })
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('User not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Validation failed with status 400', done => {
    request(app)
      .post('/api/auth/login')
      .send({
        email: 'U2FsdGVkX1/iJcv6iRbwDVVeQYP8ZPuMlr8qFbDK+FY=',
        password: 'U2FsdGVkX1/iJcv6iRbwDVVeQYP8ZPuMlr8qFbDK+FY=',
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toEqual('email must be a valid email address.')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Invalid password', done => {
    request(app)
      .post('/api/auth/login')
      .send({
        email: loginEncrypt.email,
        password: 'U2FsdGVkX1/iJcv6iRbwDVVeQYP8ZPuMlr8qFbDK+FY=',
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toEqual('Invalid Password')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Success login with status 200', done => {
    request(app)
      .post('/api/auth/login')
      .send(loginEncrypt)
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
describe('Forgot Password', () => {
  test('Failed send token to email when invalid payload', done => {
    request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'dummy@gmail.com' })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toEqual('Invalid payload')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Validation failed with status 400', done => {
    request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'U2FsdGVkX1/iJcv6iRbwDVVeQYP8ZPuMlr8qFbDK+FY=',
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toEqual('email must be a valid email address.')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed send email with status 404 user not found', done => {
    request(app)
      .post('/api/auth/forgot-password')
      .send({
        email:
          'U2FsdGVkX1/msPIq+BxybOjnXJigcHwPllzwGOpWe6bKd85IJl7GQOn0xrAerzEq',
      })
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('User with this email is not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Success send email with status 201', done => {
    request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: loginEncrypt.email,
      })
      .then(res => {
        expect(res.status).toBe(201)
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        tokenForgotPassword = res.body.data.token
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Verify token forgot password', () => {
  test('Failed verify token with status 400', done => {
    request(app)
      .post(`/api/auth/verify-token/token`)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe('Invalid token')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Success verify token fprgpt password with status 200', done => {
    request(app)
      .post(`/api/auth/verify-token/${tokenForgotPassword}`)
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

describe('change password', () => {
  test('Failed change password when invalid payload', done => {
    request(app)
      .patch('/api/auth/reset-password/token')
      .send({ payload: 'datakjghjhgencryp' })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toEqual('Invalid payload')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed change password with status 404', done => {
    request(app)
      .patch('/api/auth/reset-password/token')
      .send({
        payload:
          'U2FsdGVkX1986uPr/79JNRZn91MhfvA0TlMiYLunO2wjUNdcHdwGUEC+S4Vk9OBISRSHwH7DvrnXlwnksm15zLXDKmPLQs3W6/ahHFSZCd0=',
      })
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toEqual('User not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Success change password with status 200', done => {
    request(app)
      .patch(`/api/auth/reset-password/${tokenForgotPassword}`)
      .send({
        payload:
          'U2FsdGVkX19IkyKavIKgGpEh+3gZAXvR3HsjaGAILqPDRAj6+BSujug2MphPVThWNkR+M0rTaeLSL4DR0BUBKdI3cyj6MNTbSruxnbAPrgY=',
      })
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
