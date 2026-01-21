/**
 * Unit tests for Gemini Utility
 * Note: These tests mock the Gemini API to avoid actual API calls
 */
import {
  initializeGemini,
  isGeminiAvailable,
  generateContent,
  generateQuestions,
  parseFreeFormInput,
  buildOptimizedPrompt,
} from '../../utils/gemini.util.js';

// Mock Google Generative AI
jest.mock('@google/generative-ai', () => {
  const mockGenerateContent = jest.fn();
  const mockModel = {
    generateContent: mockGenerateContent,
  };

  const mockGenAI = jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn(() => mockModel),
  }));

  return {
    GoogleGenerativeAI: mockGenAI,
  };
});

// Mock logger
jest.mock('../../config/logger.config.js', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('Gemini Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('initializeGemini', () => {
    it('should initialize Gemini when API key is provided', () => {
      process.env.GOOGLE_AI_API_KEY = 'test-api-key';
      process.env.GEMINI_MODEL = 'gemini-pro';
      process.env.OPTIMIZATION_TEMPERATURE = '0.7';
      process.env.OPTIMIZATION_MAX_TOKENS = '2000';

      initializeGemini();
      expect(isGeminiAvailable()).toBe(true);
    });

    it('should not initialize Gemini when API key is missing', () => {
      delete process.env.GOOGLE_AI_API_KEY;

      initializeGemini();
      expect(isGeminiAvailable()).toBe(false);
    });

    it('should use default model when not specified', () => {
      process.env.GOOGLE_AI_API_KEY = 'test-api-key';
      delete process.env.GEMINI_MODEL;

      initializeGemini();
      expect(isGeminiAvailable()).toBe(true);
    });
  });

  describe('isGeminiAvailable', () => {
    it('should return false when Gemini is not initialized', () => {
      expect(isGeminiAvailable()).toBe(false);
    });

    it('should return true when Gemini is initialized', () => {
      process.env.GOOGLE_AI_API_KEY = 'test-api-key';
      initializeGemini();
      expect(isGeminiAvailable()).toBe(true);
    });
  });

  describe('generateContent', () => {
    beforeEach(() => {
      process.env.GOOGLE_AI_API_KEY = 'test-api-key';
      initializeGemini();
    });

    it('should throw error when Gemini is not available', async () => {
      // Reset Gemini
      jest.resetModules();
      delete process.env.GOOGLE_AI_API_KEY;

      await expect(
        generateContent('test prompt'),
      ).rejects.toThrow('Gemini is not available');
    });

    it('should handle API errors gracefully', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockModel = GoogleGenerativeAI().getGenerativeModel();
      mockModel.generateContent.mockRejectedValueOnce(
        new Error('API Error'),
      );

      await expect(
        generateContent('test prompt', { maxRetries: 1 }),
      ).rejects.toThrow();
    });

    it('should retry on transient errors', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockModel = GoogleGenerativeAI().getGenerativeModel();
      
      // First call fails, second succeeds
      mockModel.generateContent
        .mockRejectedValueOnce(new Error('Rate limit exceeded'))
        .mockResolvedValueOnce({
          response: {
            text: jest.fn(() => 'Success response'),
          },
        });

      const result = await generateContent('test prompt', { maxRetries: 2 });
      expect(mockModel.generateContent).toHaveBeenCalledTimes(2);
    });
  });

  describe('generateQuestions', () => {
    beforeEach(() => {
      process.env.GOOGLE_AI_API_KEY = 'test-api-key';
      initializeGemini();
    });

    it('should throw error when Gemini is not available', async () => {
      jest.resetModules();
      delete process.env.GOOGLE_AI_API_KEY;

      await expect(
        generateQuestions('test prompt', 'image', 'DALL-E 3', []),
      ).rejects.toThrow('Gemini is not available');
    });

    it('should generate questions in correct format', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockModel = GoogleGenerativeAI().getGenerativeModel();
      
      const mockResponse = JSON.stringify({
        questions: [
          {
            id: 'style',
            question: 'What style do you prefer?',
            type: 'select',
            options: ['photorealistic', 'cartoon', 'abstract'],
            priority: 'high',
          },
        ],
      });

      mockModel.generateContent.mockResolvedValueOnce({
        response: {
          text: jest.fn(() => mockResponse),
        },
      });

      const result = await generateQuestions(
        'create image of cat',
        'image',
        'DALL-E 3',
        [],
      );

      expect(result).toHaveProperty('questions');
      expect(Array.isArray(result.questions)).toBe(true);
    });
  });

  describe('parseFreeFormInput', () => {
    beforeEach(() => {
      process.env.GOOGLE_AI_API_KEY = 'test-api-key';
      initializeGemini();
    });

    it('should throw error when Gemini is not available', async () => {
      jest.resetModules();
      delete process.env.GOOGLE_AI_API_KEY;

      await expect(
        parseFreeFormInput('orange tabby cat', 'image', 'DALL-E 3'),
      ).rejects.toThrow('Gemini is not available');
    });

    it('should parse free-form input correctly', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockModel = GoogleGenerativeAI().getGenerativeModel();
      
      const mockResponse = JSON.stringify({
        extractedDetails: {
          color: 'orange',
          breed: 'tabby',
          subject: 'cat',
        },
      });

      mockModel.generateContent.mockResolvedValueOnce({
        response: {
          text: jest.fn(() => mockResponse),
        },
      });

      const result = await parseFreeFormInput(
        'orange tabby cat',
        'image',
        'DALL-E 3',
      );

      expect(result).toHaveProperty('extractedDetails');
    });
  });

  describe('buildOptimizedPrompt', () => {
    beforeEach(() => {
      process.env.GOOGLE_AI_API_KEY = 'test-api-key';
      initializeGemini();
    });

    it('should throw error when Gemini is not available', async () => {
      jest.resetModules();
      delete process.env.GOOGLE_AI_API_KEY;

      await expect(
        buildOptimizedPrompt(
          'create image of cat',
          'image',
          'DALL-E 3',
          {},
          '',
        ),
      ).rejects.toThrow('Gemini is not available');
    });

    it('should build optimized prompt preserving intent', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockModel = GoogleGenerativeAI().getGenerativeModel();
      
      mockModel.generateContent.mockResolvedValueOnce({
        response: {
          text: jest.fn(() => 'Create an image of a cat'),
        },
      });

      const result = await buildOptimizedPrompt(
        'create image of cat',
        'image',
        'DALL-E 3',
        {},
        '',
      );

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include user answers in optimized prompt', async () => {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const mockModel = GoogleGenerativeAI().getGenerativeModel();
      
      mockModel.generateContent.mockResolvedValueOnce({
        response: {
          text: jest.fn(() => 'Create a photorealistic image of an orange cat'),
        },
      });

      const userAnswers = {
        style: { type: 'option', value: 'photorealistic' },
        details: { type: 'custom', value: 'orange' },
      };

      const result = await buildOptimizedPrompt(
        'create image of cat',
        'image',
        'DALL-E 3',
        userAnswers,
        '',
      );

      expect(result).toContain('photorealistic');
      expect(result).toContain('orange');
    });
  });
});

