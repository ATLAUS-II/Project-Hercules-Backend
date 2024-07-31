const {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll
} = require('@jest/globals')
const request = require('supertest')
const { app } = require('../../src/app')

const { User } = require('../../models')
const { memoryServerConnect, memoryServerDisconnect, clearDatabase } = require('../../db/dbUtil')

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
  let findOneSpy
  let createSpy

  beforeEach(() => {
    findOneSpy = jest.spyOn(User, 'findOne')
    createSpy = jest.spyOn(User, 'create')
  })

  afterEach(() => {
    findOneSpy.mockRestore()
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
    findOneSpy.mockReturnValue(mockDBUser)

    // Send request to user by id endpoint.
    const response = await request(app)
      .get('/api/v1/users/')
      .set('X-User-Info', JSON.stringify(mockAuthUser))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ user: mockDBUser })
  })

  test('should create a user if no user is found', async () => {
    // Set the spy to return null on the 'findOne' method.
    findOneSpy.mockReturnValue(null)

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

describe("User Integration Test", () => {
  const mockUser1 = {
    userId: "1",
    nickname: "Phil",
    email: "Phil@test.com",
    workouts: []
  };

  const mockUser2 = {
    userId: "2",
    nickname: "Bob",
    email: "Bob@test.com",
    workouts: []
  };

  beforeAll(async () => {
    await memoryServerConnect();
  });

  afterAll(async () => {
    await memoryServerDisconnect();
  });

  beforeEach(async () => {
    await clearDatabase(); // Ensure the database is clean before each test
  });

  test("Find all users", async () => {
    // Insert mock users into the database
    await User.create(mockUser1);
    await User.create(mockUser2);

    // Mock user info
    const mockAuthUser = {
      nickname: 'test user',
      email: 'test@user.com',
      sub: 'auth0|123'
    };

    // Send a request to the endpoint
    const response = await request(app)
      .get('/api/v1/users/')
      .set('X-User-Info', JSON.stringify(mockAuthUser));

    // Log the response to see what is returned
    console.log(response); 

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body.user.nickname).toBe(mockAuthUser.nickname);
    expect(response.body.user.email).toBe(mockAuthUser.email);
  });
});
