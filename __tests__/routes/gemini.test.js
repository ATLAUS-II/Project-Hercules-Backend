const request = require('supertest');
const express = require('express');
const runGemini = require('../../src/services/gemini/GeminiService')
const { GeminiRouter } = require('../../src/routes/gemini/GeminiRouter')

jest.mock('@google/generative-ai');  // Mock the GoogleGenerativeAI library

describe('Gemini Router Tests', () => {
  let app;


  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/', GeminiRouter); // Mount the router on root path
  });

  // Test successful workout generation
  it('should return a 200 status code and workout in JSON format on a valid request', async () => {
    const mockResponse = { text: () => JSON.stringify({ workout: [{ exerciseName: 'Push-ups' }] }) };  // Mock response from runGemini
    jest.spyOn(runGemini, 'runGemini').mockResolvedValue(mockResponse);  // Mock runGemini behavior

    const response = await request(app).post('/').send({ prompt: 'Generate a workout for me' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('workout');
    expect(response.body.workout[0]).toHaveProperty('exerciseName'); // Check for workout data
  });

  // Test missing prompt error
  it('should return a 400 status code for missing prompt in request body', async () => {
    const response = await request(app).post('/');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Missing prompt in request');
  });

  // Test error handling during workout generation
  it('should return a 500 status code for errors during workout generation', async () => {
    jest.spyOn(runGemini, 'runGemini').mockRejectedValue(new Error('Mocked error'));

    const response = await request(app).post('/').send({ prompt: 'Generate a workout for me' });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('There was an Error generating workout');
  });
});