/**
 * Integration tests for Prompt Optimizer Service
 * Note: These tests require a test database connection
 */
import * as promptOptimizerService from '../../services/promptOptimizer.service.js';
import PromptOptimization from '../../models/promptOptimization.model.js';
import mongoose from 'mongoose';

// Mock Gemini utility
jest.mock('../../utils/gemini.util.js', () => ({
  isGeminiAvailable: jest.fn(() => false),
  generateQuestions: jest.fn(),
  parseFreeFormInput: jest.fn(),
  buildOptimizedPrompt: jest.fn(),
}));

describe('Prompt Optimizer Service', () => {
  let testUserId: string;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/test-db');
    }
    testUserId = new mongoose.Types.ObjectId().toString();
  });

  afterAll(async () => {
    // Clean up test data
    await PromptOptimization.deleteMany({ user: testUserId });
    await mongoose.connection.close();
  });

  describe('quickOptimize', () => {
    it('should create a quick optimization', async () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image' as const,
      };

      const result = await promptOptimizerService.quickOptimize(
        testUserId,
        input,
      );

      expect(result).toHaveProperty('_id');
      expect(result.originalPrompt).toBe(input.originalPrompt);
      expect(result.optimizedPrompt).toBeTruthy();
      expect(result.optimizationType).toBe('quick');
      expect(result.status).toBe('completed');
      expect(result.qualityScore).toBeDefined();
      expect(result.qualityScore?.intentPreserved).toBe(true);
    });

    it('should fix grammar in optimized prompt', async () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image' as const,
      };

      const result = await promptOptimizerService.quickOptimize(
        testUserId,
        input,
      );

      expect(result.optimizedPrompt).toContain('a cat');
      expect(result.optimizedPrompt).not.toContain('image of cat');
    });

    it('should calculate quality scores', async () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image' as const,
      };

      const result = await promptOptimizerService.quickOptimize(
        testUserId,
        input,
      );

      expect(result.qualityScore?.before).toBeGreaterThanOrEqual(0);
      expect(result.qualityScore?.after).toBeGreaterThanOrEqual(0);
      expect(result.qualityScore?.after).toBeGreaterThanOrEqual(
        result.qualityScore?.before || 0,
      );
    });
  });

  describe('analyzePromptForQuestions', () => {
    it('should analyze prompt and generate questions', async () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image' as const,
      };

      const result = await promptOptimizerService.analyzePromptForQuestions(
        testUserId,
        input,
      );

      expect(result).toHaveProperty('optimization');
      expect(result).toHaveProperty('questions');
      expect(result).toHaveProperty('additionalDetailsField');
      expect(result).toHaveProperty('quickOptimized');
      expect(result.questions.length).toBeGreaterThan(0);
      expect(result.optimization.status).toBe('questions_ready');
    });

    it('should include analysis in result', async () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image' as const,
      };

      const result = await promptOptimizerService.analyzePromptForQuestions(
        testUserId,
        input,
      );

      expect(result.optimization.analysis).toBeDefined();
      expect(result.optimization.analysis?.missingElements).toBeDefined();
      expect(result.optimization.analysis?.completenessScore).toBeDefined();
    });
  });

  describe('getOptimizationHistory', () => {
    it('should retrieve optimization history', async () => {
      // Create some test optimizations
      await promptOptimizerService.quickOptimize(testUserId, {
        originalPrompt: 'test prompt 1',
        targetModel: 'DALL-E 3',
        mediaType: 'image',
      });

      await promptOptimizerService.quickOptimize(testUserId, {
        originalPrompt: 'test prompt 2',
        targetModel: 'GPT-4',
        mediaType: 'text',
      });

      const result = await promptOptimizerService.getOptimizationHistory(
        testUserId,
        { page: 1, limit: 10 },
      );

      expect(result.optimizations.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
      expect(result.page).toBe(1);
      expect(result.stats).toBeDefined();
    });

    it('should filter by optimization type', async () => {
      const result = await promptOptimizerService.getOptimizationHistory(
        testUserId,
        { page: 1, limit: 10, optimizationType: 'quick' },
      );

      result.optimizations.forEach((opt) => {
        expect(opt.optimizationType).toBe('quick');
      });
    });
  });

  describe('getOptimizationById', () => {
    it('should retrieve optimization by ID', async () => {
      const optimization = await promptOptimizerService.quickOptimize(
        testUserId,
        {
          originalPrompt: 'test get by id',
          targetModel: 'DALL-E 3',
          mediaType: 'image',
        },
      );

      const result = await promptOptimizerService.getOptimizationById(
        optimization._id.toString(),
        testUserId,
      );

      expect(result._id.toString()).toBe(optimization._id.toString());
      expect(result.originalPrompt).toBe('test get by id');
    });

    it('should throw error if optimization not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      await expect(
        promptOptimizerService.getOptimizationById(fakeId, testUserId),
      ).rejects.toThrow('Optimization not found');
    });
  });

  describe('deleteOptimization', () => {
    it('should delete optimization', async () => {
      const optimization = await promptOptimizerService.quickOptimize(
        testUserId,
        {
          originalPrompt: 'test delete',
          targetModel: 'DALL-E 3',
          mediaType: 'image',
        },
      );

      const result = await promptOptimizerService.deleteOptimization(
        optimization._id.toString(),
        testUserId,
      );

      expect(result.message).toBe('Optimization deleted successfully.');

      // Verify it's deleted
      await expect(
        promptOptimizerService.getOptimizationById(
          optimization._id.toString(),
          testUserId,
        ),
      ).rejects.toThrow('Optimization not found');
    });
  });
});

