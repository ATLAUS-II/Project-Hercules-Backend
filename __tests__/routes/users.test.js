const {
  describe,
  test,
  expect,
  beforeEach,
  afterEach
} = require('@jest/globals')
const request = require('supertest')
const { app } = require('../../src/app')

const { User } = require('../../models')

jest.mock('express-oauth2-jwt-bearer', () => ({
  auth: jest.fn(() => {
    return (req, res, next) => {
      next()
    }
  })
}))

// TODO: Add mock for the checkUser middleware.
jest.mock('../../src/middleware/checkUser', () => ({
  checkUser: jest.fn(async (req, res, next) => {
    console.log('CHECK USER RAN!')
    const userInfo = JSON.parse(req.headers['x-user-info'])
    // Mock finding or creating the user in the database
    // and return the user instance.
    const mockUserInstance = {
      ...userInfo,
      _id: '1a2b3c'
    }

    req.user = mockUserInstance
    next()
  })
}))

describe('GET user info', () => {
  let findByIdSpy

  beforeEach(() => {
    findByIdSpy = jest.spyOn(User, 'findById')
  })

  afterEach(() => {
    findByIdSpy.mockRestore()
  })

  test('should return a user by id', async () => {
    const mockUser = {
      _id: '1a2b3c',
      nickname: 'test user',
      email: 'test@user.com',
      userId: '123'
    }

    findByIdSpy.mockReturnValue(mockUser)

    // Send request to user by id endpoint.
    const response = await request(app)
      .get('/api/v1/users/')
      .set(
        'X-User-Info',
        JSON.stringify({
          email: 'test@user.com',
          nickname: 'test user',
          // TODO: Change sub to look like the actual sub.
          sub: '123'
        })
      )

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ user: mockUser })
  })

  // TODO: Evaluate if the test is obsolete once the middleware is implemented.
  test('should return 404 if user is not found', async () => {
    findByIdSpy.mockReturnValue(null)

    const response = await request(app)
      .get('/api/v1/users/')
      .set('X-User-Info', JSON.stringify({}))
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'User with ID 1a2b3c not found.' })
  })
})
