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

describe('GET user info', () => {
  let findByIdSpy
  let createSpy

  beforeEach(() => {
    findByIdSpy = jest.spyOn(User, 'findById')
    createSpy = jest.spyOn(User, 'create')
  })

  afterEach(() => {
    findByIdSpy.mockRestore()
    createSpy.mockRestore()
  })

  test('should return a user by id', async () => {
    const mockUser = {
      nickname: 'test user',
      email: 'test@user.com',
      userId: '123'
    }

    findByIdSpy.mockReturnValue(mockUser)

    // Send request to user by id endpoint.
    const response = await request(app)
      .get('/api/v1/users/')
      .set('X-User-Info', JSON.stringify(mockUser))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ user: mockUser })
  })

  test('should create a user if no user is found', async () => {
    findByIdSpy.mockReturnValue(null)

    const newUser = {
      nickname: 'new user',
      email: 'new@user.com',
      userId: '456'
    }

    createSpy.mockReturnValue(newUser)

    const response = await request(app)
      .get('/api/v1/users/')
      .set('X-User-Info', JSON.stringify(newUser))

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ user: newUser })
  })
})
