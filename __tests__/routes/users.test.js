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

// Mock the express-oauth2-jwt-bearer module.
jest.mock('express-oauth2-jwt-bearer', () => ({
  auth: jest.fn(() => {
    return (req, res, next) => {
      next()
    }
  })
}))

describe('GET user info', () => {
  // Variables to hold the jest spies.
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
    const mockAuthUser = {
      nickname: 'test user',
      email: 'test@user.com',
      sub: 'abc|123'
    }

    const mockDBUser = {
      nickname: 'test user',
      email: 'test@user.com',
      userID: '123'
    }

    // Set the spy to return the mock user.
    findByIdSpy.mockReturnValue(mockDBUser)

    // Send request to user by id endpoint.
    const response = await request(app)
      .get('/api/v1/users/')
      .set('X-User-Info', JSON.stringify(mockAuthUser))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ user: mockDBUser })
  })

  test('should create a user if no user is found', async () => {
    // Set the spy to return null on the 'findById' method.
    findByIdSpy.mockReturnValue(null)

    const newUser = {
      nickname: 'new user',
      email: 'new@user.com',
      sub: 'abc|456'
    }

    const newDBUser = {
      nickname: 'new user',
      email: 'new@user.com',
      userId: '456'
    }

    // Set the spy to return the mock user on the 'create' method.
    createSpy.mockReturnValue(newDBUser)

    // Send request to user by id endpoint.
    const response = await request(app)
      .get('/api/v1/users/')
      .set('X-User-Info', JSON.stringify(newUser))

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ user: newDBUser })
  })
})
