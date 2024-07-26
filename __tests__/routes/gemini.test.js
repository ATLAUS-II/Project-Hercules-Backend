const request = require('supertest');
const express = require('express');
const { runGemini } = require('../../src/services/gemini/GeminiService'); // Import as named export
const { GeminiRouter } = require('../../src/routes/gemini/GeminiRouter');

jest.mock('@google/generative-ai');  // Mock the GoogleGenerativeAI library

jest.mock('../../src/services/gemini/GeminiService', () => ({
  runGemini: jest.fn(),  // Mock the runGemini function
}));

describe('Gemini Router Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/gemini', GeminiRouter);
  });

  mockedWorkout = {
      "focus_area" : "upper",
      "type": "strength",
      "level": "beginner",
      "exercises" : [
        {
          "exerciseName": "Push-ups",
          "reps": 10,
          "sets": 3
        }
      ]
  }

  it('should return a 200 status code and workout in JSON format on a valid request', async () => {
    const mockResponse = JSON.stringify(mockedWorkout);  // Mock response from runGemini
    runGemini.mockResolvedValue(mockResponse);  // Mock runGemini behavior

    const response = await request(app).get('/api/v1/gemini/workout?focus=upper&strength&type=strength&level=beginner');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('workout');
    console.log(response.body)
    expect(response.body.workout).toHaveProperty('focus_area'); // Check for workout data
  });

  it('should return a 400 status code for missing query in request', async () => {
    const response = await request(app).get('/api/v1/gemini/workout?focus=upper&type=strength');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Invalid Level');
  });

    it('should return a 400 status code for invalid query option in request', async () => {
      const response = await request(app).get('/api/v1/gemini/workout?focus=upper&type=strength&level=noob');
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid Level');
    });

  it('should return a 500 status code for errors during workout generation', async () => {
    const error = new Error('Mocked error')
    runGemini.mockRejectedValue(error);

    const response = await request(app).get('/api/v1/gemini/workout?focus=upper&strength&type=strength&level=beginner');
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(`There was an Error generating workout: ${error}`);
  });
});
