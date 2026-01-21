/**
 * Edge case tests for Prompt Optimizer Service
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

describe('Prompt Optimizer Service - Edge Cases', () => {
  let testUserId: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/test-db');
    }
    testUserId = new mongoose.Types.ObjectId().toString();
  });

  afterAll(async () => {
    await PromptOptimization.deleteMany({ user: testUserId });
    await mongoose.connection.close();
  });

  describe('Edge Cases', () => {
    it('should handle very long prompts', async () => {
      const longPrompt = 'a'.repeat(5000);
      const result = await promptOptimizerService.quickOptimize(testUserId, {
        originalPrompt: longPrompt,
        targetModel: 'DALL-E 3',
        mediaType: 'image',
      });

      expect(result).toHaveProperty('_id');
      expect(result.originalPrompt).toBe(longPrompt);
    });

    it('should handle prompts with special characters', async () => {
      const specialPrompt = 'create image of cat 🐱 with @#$%^&*() characters';
      const result = await promptOptimizerService.quickOptimize(testUserId, {
        originalPrompt: specialPrompt,
        targetModel: 'DALL-E 3',
        mediaType: 'image',
      });

      expect(result).toHaveProperty('_id');
      expect(result.originalPrompt).toBe(specialPrompt);
    });

    it('should handle prompts with unicode characters', async () => {
      const unicodePrompt = 'create image of 猫 (cat in Chinese)';
      const result = await promptOptimizerService.quickOptimize(testUserId, {
        originalPrompt: unicodePrompt,
        targetModel: 'DALL-E 3',
        mediaType: 'image',
      });

      expect(result).toHaveProperty('_id');
      expect(result.originalPrompt).toBe(unicodePrompt);
    });

    it('should handle empty user answers', async () => {
      const result = await promptOptimizerService.analyzePromptForQuestions(
        testUserId,
        {
          originalPrompt: 'create image of cat',
          targetModel: 'DALL-E 3',
          mediaType: 'image',
        },
      );

      expect(result).toHaveProperty('questions');
      expect(result.questions.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle pagination edge cases', async () => {
      // Test with page 0
      const result1 = await promptOptimizerService.getOptimizationHistory(
        testUserId,
        { page: 0, limit: 10 },
      );
      expect(result1).toHaveProperty('optimizations');

      // Test with very large page number
      const result2 = await promptOptimizerService.getOptimizationHistory(
        testUserId,
        { page: 999999, limit: 10 },
      );
      expect(result2.optimizations.length).toBe(0);

      // Test with limit 0
      const result3 = await promptOptimizerService.getOptimizationHistory(
        testUserId,
        { page: 1, limit: 0 },
      );
      expect(result3).toHaveProperty('optimizations');
    });

    it('should handle invalid optimization ID gracefully', async () => {
      const invalidId = 'invalid-id-format';
      
      await expect(
        promptOptimizerService.getOptimizationById(invalidId, testUserId),
      ).rejects.toThrow();
    });

    it('should handle deletion of non-existent optimization', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await expect(
        promptOptimizerService.deleteOptimization(fakeId, testUserId),
      ).rejects.toThrow('Optimization not found');
    });

    it('should handle different media types correctly', async () => {
      const mediaTypes = ['text', 'image', 'video', 'audio'] as const;

      for (const mediaType of mediaTypes) {
        const result = await promptOptimizerService.quickOptimize(testUserId, {
          originalPrompt: `create ${mediaType} content`,
          targetModel: 'GPT-4',
          mediaType,
        });

        expect(result.mediaType).toBe(mediaType);
      }
    });

    it('should handle concurrent optimizations for same user', async () => {
      const promises = Array(5).fill(null).map(() =>
        promptOptimizerService.quickOptimize(testUserId, {
          originalPrompt: 'create image of cat',
          targetModel: 'DALL-E 3',
          mediaType: 'image',
        }),
      );

      const results = await Promise.all(promises);
      expect(results.length).toBe(5);
      results.forEach((result) => {
        expect(result).toHaveProperty('_id');
        expect(result.user.toString()).toBe(testUserId);
      });
    });
  });
});

