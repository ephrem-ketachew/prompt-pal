/**
 * Unit tests for Intent Preservation Utility
 */
import { validateIntentPreservation } from '../../utils/intentPreservation.util.js';

describe('Intent Preservation Utility', () => {
  describe('validateIntentPreservation', () => {
    it('should preserve intent when no unsolicited details are added', () => {
      const original = 'create image of cat';
      const optimized = 'Create an image of a cat';

      const result = validateIntentPreservation(original, optimized);

      expect(result.preserved).toBe(true);
      expect(result.violations.length).toBe(0);
      expect(result.score).toBe(100);
    });

    it('should detect unsolicited colors', () => {
      const original = 'create image of cat';
      const optimized =
        'Create an image of an orange tabby cat with green eyes';

      const result = validateIntentPreservation(original, optimized);

      expect(result.preserved).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations.some((v) => v.includes('colors'))).toBe(true);
    });

    it('should detect unsolicited styles', () => {
      const original = 'create image of cat';
      const optimized =
        'Create a photorealistic, watercolor-style image of a cat';

      const result = validateIntentPreservation(original, optimized);

      expect(result.preserved).toBe(false);
      expect(result.violations.some((v) => v.includes('styles'))).toBe(true);
    });

    it('should detect unsolicited backgrounds', () => {
      const original = 'create image of cat';
      const optimized =
        'Create an image of a cat in a cozy library with bookshelves';

      const result = validateIntentPreservation(original, optimized);

      expect(result.preserved).toBe(false);
      expect(result.violations.some((v) => v.includes('backgrounds'))).toBe(
        true,
      );
    });

    it('should preserve intent when user specified details are used', () => {
      const original = 'create image of orange cat';
      const optimized = 'Create an image of an orange cat';

      const result = validateIntentPreservation(original, optimized);

      expect(result.preserved).toBe(true);
    });

    it('should preserve intent when user answers include details', () => {
      const original = 'create image of cat';
      const optimized =
        'Create an image of an orange tabby cat with green eyes';
      const userAnswers = {
        style: { type: 'option', value: 'photorealistic' },
        details: {
          type: 'custom',
          value: 'orange tabby',
          customText: 'orange tabby with green eyes',
        },
      };

      const result = validateIntentPreservation(
        original,
        optimized,
        userAnswers,
      );

      // Should be preserved because user specified orange tabby
      expect(result.preserved).toBe(true);
    });

    it('should preserve intent when additional details are provided', () => {
      const original = 'create image of cat';
      const optimized =
        'Create an image of a cat in a garden with golden hour lighting';
      const additionalDetails = 'garden, golden hour lighting';

      const result = validateIntentPreservation(
        original,
        optimized,
        undefined,
        additionalDetails,
      );

      expect(result.preserved).toBe(true);
    });

    it('should calculate preservation score correctly', () => {
      const original = 'create image of cat';
      const optimized = 'Create an image of a cat';

      const result = validateIntentPreservation(original, optimized);

      expect(result.score).toBe(100);
    });

    it('should lower score for violations', () => {
      const original = 'create image of cat';
      const optimized =
        'Create a photorealistic image of an orange tabby cat in a cozy library with warm lighting';

      const result = validateIntentPreservation(original, optimized);

      expect(result.score).toBeLessThan(100);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });
});

