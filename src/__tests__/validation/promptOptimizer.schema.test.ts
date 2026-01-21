/**
 * Unit tests for Prompt Optimizer Validation Schemas
 */
import {
  quickOptimizeSchema,
  analyzePromptSchema,
  buildPromptSchema,
  applyOptimizationSchema,
  feedbackSchema,
} from '../../validation/promptOptimizer.schema.js';

describe('Prompt Optimizer Validation Schemas', () => {
  describe('quickOptimizeSchema', () => {
    it('should validate correct input', () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image',
      };

      const result = quickOptimizeSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const input = {
        originalPrompt: 'create image of cat',
        // Missing targetModel and mediaType
      };

      const result = quickOptimizeSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject prompt that is too short', () => {
      const input = {
        originalPrompt: 'cat', // Too short
        targetModel: 'DALL-E 3',
        mediaType: 'image',
      };

      const result = quickOptimizeSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid mediaType', () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'invalid', // Invalid
      };

      const result = quickOptimizeSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should sanitize input', () => {
      const input = {
        originalPrompt: '  create image of cat  ',
        targetModel: '  DALL-E 3  ',
        mediaType: 'image',
      };

      const result = quickOptimizeSchema.safeParse(input);
      if (result.success) {
        expect(result.data.originalPrompt).toBe('create image of cat');
        expect(result.data.targetModel).toBe('DALL-E 3');
      }
    });
  });

  describe('analyzePromptSchema', () => {
    it('should validate correct input', () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image',
      };

      const result = analyzePromptSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('buildPromptSchema', () => {
    it('should validate correct input with answers', () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image',
        answers: {
          style: {
            type: 'option',
            value: 'photorealistic',
          },
        },
        additionalDetails: 'orange tabby, golden hour',
      };

      const result = buildPromptSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate input without answers', () => {
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image',
      };

      const result = buildPromptSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject additionalDetails that is too long', () => {
      const longDetails = 'a'.repeat(2001); // Exceeds max length
      const input = {
        originalPrompt: 'create image of cat',
        targetModel: 'DALL-E 3',
        mediaType: 'image',
        additionalDetails: longDetails,
      };

      const result = buildPromptSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('applyOptimizationSchema', () => {
    it('should validate correct input', () => {
      const input = {
        title: 'Optimized Cat Prompt',
        description: 'A premium optimized prompt',
        tags: ['cat', 'image'],
        isPublic: true,
      };

      const result = applyOptimizationSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject title that is too short', () => {
      const input = {
        title: 'ab', // Too short
        tags: [],
        isPublic: true,
      };

      const result = applyOptimizationSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject too many tags', () => {
      const input = {
        title: 'Test Prompt',
        tags: Array(11).fill('tag'), // Too many
        isPublic: true,
      };

      const result = applyOptimizationSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('feedbackSchema', () => {
    it('should validate correct input', () => {
      const input = {
        rating: 5,
        wasHelpful: true,
        comments: 'Great optimization!',
      };

      const result = feedbackSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject rating that is too low', () => {
      const input = {
        rating: 0, // Too low
        wasHelpful: true,
      };

      const result = feedbackSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject rating that is too high', () => {
      const input = {
        rating: 6, // Too high
        wasHelpful: true,
      };

      const result = feedbackSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject comments that are too long', () => {
      const input = {
        rating: 5,
        wasHelpful: true,
        comments: 'a'.repeat(501), // Too long
      };

      const result = feedbackSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

