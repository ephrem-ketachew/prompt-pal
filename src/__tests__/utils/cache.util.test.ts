/**
 * Unit tests for Cache Utility
 */
import {
  questionCache,
  optimizationCache,
  generateAnalysisCacheKey,
  generateQuestionsCacheKey,
} from '../../utils/cache.util.js';

describe('Cache Utility', () => {
  beforeEach(() => {
    // Clear cache before each test
    questionCache.clear();
    optimizationCache.clear();
  });

  describe('questionCache and optimizationCache', () => {
    it('should store and retrieve values', () => {
      questionCache.set('test-key', { data: 'test-value' });
      const result = questionCache.get('test-key');

      expect(result).toEqual({ data: 'test-value' });
    });

    it('should return null for non-existent keys', () => {
      const result = questionCache.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should delete values', () => {
      questionCache.set('test-key', { data: 'test-value' });
      questionCache.delete('test-key');
      const result = questionCache.get('test-key');

      expect(result).toBeNull();
    });

    it('should clear all values', () => {
      questionCache.set('key1', { data: 'value1' });
      questionCache.set('key2', { data: 'value2' });
      questionCache.clear();

      expect(questionCache.get('key1')).toBeNull();
      expect(questionCache.get('key2')).toBeNull();
    });

    it('should return correct cache size', () => {
      questionCache.set('key1', { data: 'value1' });
      questionCache.set('key2', { data: 'value2' });

      expect(questionCache.size()).toBe(2);
    });

    it('should expire entries after TTL', (done) => {
      // Set a value with 1 second TTL
      questionCache.set('expiring-key', { data: 'value' }, 1);

      // Should be available immediately
      expect(questionCache.get('expiring-key')).not.toBeNull();

      // Should be expired after 1.5 seconds
      setTimeout(() => {
        expect(questionCache.get('expiring-key')).toBeNull();
        done();
      }, 1500);
    }, 3000);

    it('should use custom TTL when provided', (done) => {
      optimizationCache.set('custom-ttl-key', { data: 'value' }, 2);

      setTimeout(() => {
        expect(optimizationCache.get('custom-ttl-key')).not.toBeNull();
      }, 1000);

      setTimeout(() => {
        expect(optimizationCache.get('custom-ttl-key')).toBeNull();
        done();
      }, 2500);
    }, 4000);

    it('should clean expired entries', () => {
      // Set entries with very short TTL
      questionCache.set('expired1', { data: 'value1' }, 0.1);
      questionCache.set('expired2', { data: 'value2' }, 0.1);
      questionCache.set('valid', { data: 'value3' }, 100);

      // Wait for expiration
      setTimeout(() => {
        questionCache.cleanExpired();
        expect(questionCache.get('expired1')).toBeNull();
        expect(questionCache.get('expired2')).toBeNull();
        expect(questionCache.get('valid')).not.toBeNull();
      }, 200);
    });
  });

  describe('generateAnalysisCacheKey', () => {
    it('should generate consistent keys for same input', () => {
      const key1 = generateAnalysisCacheKey('test prompt', 'image', 'DALL-E 3');
      const key2 = generateAnalysisCacheKey('test prompt', 'image', 'DALL-E 3');

      expect(key1).toBe(key2);
    });

    it('should generate different keys for different inputs', () => {
      const key1 = generateAnalysisCacheKey('test prompt', 'image', 'DALL-E 3');
      const key2 = generateAnalysisCacheKey('test prompt', 'text', 'DALL-E 3');
      const key3 = generateAnalysisCacheKey('test prompt', 'image', 'GPT-4');

      expect(key1).not.toBe(key2);
      expect(key1).not.toBe(key3);
      expect(key2).not.toBe(key3);
    });

    it('should handle case-insensitive input', () => {
      const key1 = generateAnalysisCacheKey('Test Prompt', 'IMAGE', 'dall-e 3');
      const key2 = generateAnalysisCacheKey('test prompt', 'image', 'DALL-E 3');

      expect(key1).toBe(key2);
    });

    it('should handle whitespace consistently', () => {
      const key1 = generateAnalysisCacheKey('  test prompt  ', 'image', 'DALL-E 3');
      const key2 = generateAnalysisCacheKey('test prompt', 'image', 'DALL-E 3');

      expect(key1).toBe(key2);
    });
  });

  describe('generateQuestionsCacheKey', () => {
    it('should generate consistent keys for same input', () => {
      const key1 = generateQuestionsCacheKey('test prompt', 'image', 'DALL-E 3');
      const key2 = generateQuestionsCacheKey('test prompt', 'image', 'DALL-E 3');

      expect(key1).toBe(key2);
    });

    it('should generate different keys for different inputs', () => {
      const key1 = generateQuestionsCacheKey('test prompt', 'image', 'DALL-E 3');
      const key2 = generateQuestionsCacheKey('test prompt', 'text', 'DALL-E 3');

      expect(key1).not.toBe(key2);
    });

    it('should generate different keys than analysis cache', () => {
      const analysisKey = generateAnalysisCacheKey('test prompt', 'image', 'DALL-E 3');
      const questionsKey = generateQuestionsCacheKey('test prompt', 'image', 'DALL-E 3');

      expect(analysisKey).not.toBe(questionsKey);
    });
  });
});

