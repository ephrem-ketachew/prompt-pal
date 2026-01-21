/**
 * Unit tests for Prompt Analyzer Utility
 */
import { analyzePrompt } from '../../utils/promptAnalyzer.util.js';

describe('Prompt Analyzer Utility', () => {
  describe('analyzePrompt', () => {
    it('should analyze a simple image prompt correctly', () => {
      const result = analyzePrompt('create image of cat', 'image');

      expect(result).toHaveProperty('completenessScore');
      expect(result).toHaveProperty('missingElements');
      expect(result).toHaveProperty('grammarFixed');
      expect(result).toHaveProperty('wordCount');
      expect(result).toHaveProperty('clarityScore');
      expect(result).toHaveProperty('specificityScore');
      expect(result).toHaveProperty('structureScore');

      expect(result.missingElements.length).toBeGreaterThan(0);
      expect(result.completenessScore).toBeLessThan(100);
    });

    it('should detect grammar issues', () => {
      const result = analyzePrompt('create image of cat', 'image');
      expect(result.grammarFixed).toBeDefined();
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should identify missing elements for image prompts', () => {
      const result = analyzePrompt('draw me a cat', 'image');

      expect(result.missingElements.length).toBeGreaterThan(0);
      expect(result.completenessScore).toBeLessThan(100);
    });

    it('should identify missing elements for text prompts', () => {
      const result = analyzePrompt('write something', 'text');

      expect(result.missingElements).toContain('tone');
      expect(result.missingElements).toContain('format');
      expect(result.missingElements).toContain('context');
    });

    it('should calculate scores correctly', () => {
      const result = analyzePrompt('create image of cat', 'image');

      expect(result.clarityScore).toBeGreaterThanOrEqual(0);
      expect(result.clarityScore).toBeLessThanOrEqual(100);
      expect(result.specificityScore).toBeGreaterThanOrEqual(0);
      expect(result.specificityScore).toBeLessThanOrEqual(100);
      expect(result.structureScore).toBeGreaterThanOrEqual(0);
      expect(result.structureScore).toBeLessThanOrEqual(100);
      expect(result.completenessScore).toBeGreaterThanOrEqual(0);
      expect(result.completenessScore).toBeLessThanOrEqual(100);
    });

    it('should handle prompts with existing style information', () => {
      const result = analyzePrompt(
        'create a photorealistic image of a cat',
        'image',
      );

      // Style should be detected, so missingElements might not include it
      expect(result.missingElements.length).toBeLessThan(5);
    });

    it('should handle prompts with existing background information', () => {
      const result = analyzePrompt(
        'create image of cat in a garden',
        'image',
      );

      // Background should be detected
      expect(result.missingElements.length).toBeLessThan(5);
    });

    it('should handle very short prompts', () => {
      const result = analyzePrompt('cat', 'image');

      expect(result.wordCount).toBe(1);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should handle long detailed prompts', () => {
      const longPrompt =
        'Create a high-quality, photorealistic image of a beautiful orange tabby cat, centered in the frame, with soft natural lighting, blurred background, warm vibrant colors, showcasing detailed fur texture, professional photography style';
      const result = analyzePrompt(longPrompt, 'image');

      expect(result.wordCount).toBeGreaterThan(10);
      expect(result.missingElements.length).toBeLessThan(3);
      expect(result.completenessScore).toBeGreaterThan(70);
    });
  });
});

