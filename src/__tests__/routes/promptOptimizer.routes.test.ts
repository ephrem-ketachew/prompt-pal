/**
 * Integration tests for Prompt Optimizer API endpoints
 * Note: These tests require a running server and test database
 */
import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import User from '../../models/user.model.js';
import PromptOptimization from '../../models/promptOptimization.model.js';

// Mock Gemini to avoid actual API calls in tests
jest.mock('../../utils/gemini.util.js', () => ({
  isGeminiAvailable: jest.fn(() => false),
  generateQuestions: jest.fn(),
  parseFreeFormInput: jest.fn(),
  buildOptimizedPrompt: jest.fn(),
}));

describe('Prompt Optimizer API Routes', () => {
  let authToken: string;
  let testUser: any;
  let testUserId: string;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/test-db');
    }

    // Create a test user and get auth token
    // This would typically require setting up auth first
    // For now, we'll skip auth in tests or use a mock
  });

  afterAll(async () => {
    // Clean up
    await PromptOptimization.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/v1/prompt-optimizer/quick-optimize', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/prompt-optimizer/quick-optimize')
        .send({
          originalPrompt: 'create image of cat',
          targetModel: 'DALL-E 3',
          mediaType: 'image',
        });

      expect(response.status).toBe(401);
    });

    // Note: Full integration tests would require:
    // 1. User authentication setup
    // 2. Valid JWT token
    // 3. Database connection
    // These are placeholders for the test structure
  });

  describe('POST /api/v1/prompt-optimizer/analyze', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/prompt-optimizer/analyze')
        .send({
          originalPrompt: 'create image of cat',
          targetModel: 'DALL-E 3',
          mediaType: 'image',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/prompt-optimizer/build', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/prompt-optimizer/build')
        .send({
          originalPrompt: 'create image of cat',
          targetModel: 'DALL-E 3',
          mediaType: 'image',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/prompt-optimizer/history', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get(
        '/api/v1/prompt-optimizer/history',
      );

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/prompt-optimizer/:id', () => {
    it('should return 401 without authentication', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).get(
        `/api/v1/prompt-optimizer/${fakeId}`,
      );

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/prompt-optimizer/:id', () => {
    it('should return 401 without authentication', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).delete(
        `/api/v1/prompt-optimizer/${fakeId}`,
      );

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/prompt-optimizer/:id/apply', () => {
    it('should return 401 without authentication', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .post(`/api/v1/prompt-optimizer/${fakeId}/apply`)
        .send({
          title: 'Test Prompt',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/prompt-optimizer/:id/feedback', () => {
    it('should return 401 without authentication', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .post(`/api/v1/prompt-optimizer/${fakeId}/feedback`)
        .send({
          rating: 5,
          wasHelpful: true,
        });

      expect(response.status).toBe(401);
    });
  });
});

