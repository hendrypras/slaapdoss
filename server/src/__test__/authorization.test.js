const { isAdmin, isUser } = require('../middleware/authorization')

describe('Authorization Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      user: {},
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

  describe('isAdmin Middleware', () => {
    test('User is an admin', () => {
      req.user.role = 1

      isAdmin(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })

    test('User is not an admin', () => {
      req.user.role = 2

      isAdmin(req, res, next)

      expect(res.status).toHaveBeenCalledWith(406)
      expect(res.json).toHaveBeenCalledWith({
        status: 'Not Acceptable',
        message: 'You are not an admin',
      })
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('isUser Middleware', () => {
    test('User is an user', () => {
      req.user.role = 2

      isUser(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })

    test('User is not an user', () => {
      req.user.role = 1

      isUser(req, res, next)

      expect(res.status).toHaveBeenCalledWith(406)
      expect(res.json).toHaveBeenCalledWith({
        status: 'Not Acceptable',
        message: 'You are not an user',
      })
      expect(next).not.toHaveBeenCalled()
    })
  })
})
