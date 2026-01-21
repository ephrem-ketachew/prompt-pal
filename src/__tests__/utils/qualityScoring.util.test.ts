/**
 * Unit tests for Quality Scoring Utility
 */
import { calculateComprehensiveQualityScore } from '../../utils/qualityScoring.util.js';

describe('Quality Scoring Utility', () => {
  describe('calculateComprehensiveQualityScore', () => {
    it('should calculate comprehensive quality score', () => {
      const original = 'create image of cat';
      const optimized =
        'Create a high-quality, photorealistic image of a cat, centered in the frame, with natural lighting';

      const result = calculateComprehensiveQualityScore(
        original,
        optimized,
        'image',
      );

      expect(result).toHaveProperty('overall');
      expect(result).toHaveProperty('clarity');
      expect(result).toHaveProperty('specificity');
      expect(result).toHaveProperty('structure');
      expect(result).toHaveProperty('completeness');
      expect(result).toHaveProperty('intentPreservation');
      expect(result).toHaveProperty('breakdown');

      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
    });

    it('should show improvement in scores', () => {
      const original = 'cat';
      const optimized =
        'Create a high-quality, photorealistic image of a beautiful cat, centered in the frame';

      const result = calculateComprehensiveQualityScore(
        original,
        optimized,
        'image',
      );

      expect(result.clarity).toBeGreaterThan(50);
      expect(result.specificity).toBeGreaterThan(50);
      expect(result.overall).toBeGreaterThan(50);
    });

    it('should include breakdown with factors', () => {
      const original = 'create image of cat';
      const optimized = 'Create an image of a cat';

      const result = calculateComprehensiveQualityScore(
        original,
        optimized,
        'image',
      );

      expect(result.breakdown).toHaveProperty('clarity');
      expect(result.breakdown).toHaveProperty('specificity');
      expect(result.breakdown).toHaveProperty('structure');
      expect(result.breakdown.clarity).toHaveProperty('factors');
      expect(result.breakdown.specificity).toHaveProperty('factors');
    });

    it('should calculate intent preservation score', () => {
      const original = 'create image of cat';
      const optimized = 'Create an image of a cat';

      const result = calculateComprehensiveQualityScore(
        original,
        optimized,
        'image',
      );

      expect(result.intentPreservation).toBeGreaterThanOrEqual(0);
      expect(result.intentPreservation).toBeLessThanOrEqual(100);
    });

    it('should handle user answers in score calculation', () => {
      const original = 'create image of cat';
      const optimized =
        'Create a photorealistic image of an orange tabby cat';
      const userAnswers = {
        style: { type: 'option', value: 'photorealistic' },
        details: { type: 'custom', value: 'orange tabby' },
      };

      const result = calculateComprehensiveQualityScore(
        original,
        optimized,
        'image',
        userAnswers,
      );

      expect(result.intentPreservation).toBe(100); // Should be preserved
    });
  });
});

