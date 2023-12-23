const verifyJwtToken = require('../../src/utils/verifyTokenJwt')
const Authenticated = require('../../src/middleware/authentication')
const { Users } = require('../../src/models')

jest.mock('../../src/utils/verifyTokenJwt')

describe('Authenticated Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      headers: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Token Valid and User Found', async () => {
    req.headers.authorization = 'Bearer valid-token'

    verifyJwtToken.mockImplementation((token, secret, callback) => {
      callback(null, { id: 1 })
    })

    Users.findByPk = jest
      .fn()
      .mockResolvedValue({ id: 1, username: 'test_user' })

    await Authenticated(req, res, next)

    expect(res.status).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(req.user).toEqual({ id: 1, username: 'test_user' })
  })

  test('Token Valid but User Not Found', async () => {
    req.headers.authorization = 'Bearer valid-token'

    verifyJwtToken.mockImplementation((token, secret, callback) => {
      callback(null, { id: 1 })
    })

    Users.findByPk = jest.fn().mockResolvedValue(null)

    await Authenticated(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      status: 'Unauthorized',
      message: 'User not found',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('Expired Token', async () => {
    req.headers.authorization = 'Bearer expired-token'

    verifyJwtToken.mockImplementation((token, secret, callback) => {
      callback({ name: 'TokenExpiredError' })
    })

    await Authenticated(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      status: 'Forbidden',
      message: 'Token expired or invalid',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('No Token Provided', async () => {
    await Authenticated(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      status: 'Unauthorized',
      message: 'Invalid Authorization header',
    })
    expect(next).not.toHaveBeenCalled()
  })
})
