/**
 * Intent Preservation Utility
 * Validates that optimized prompts don't add unsolicited creative details
 */

export interface IntentPreservationResult {
  preserved: boolean;
  violations: string[];
  addedDetails: string[];
  score: number; // 0-100, 100 = perfect preservation
}

/**
 * Check if optimized prompt preserves user intent
 * Compares original prompt with optimized to ensure no unsolicited details were added
 */
export function validateIntentPreservation(
  originalPrompt: string,
  optimizedPrompt: string,
  userAnswers?: Record<string, any>,
  additionalDetails?: string,
): IntentPreservationResult {
  const violations: string[] = [];
  const addedDetails: string[] = [];

  // Extract what user actually specified
  const userSpecified = extractUserSpecifiedDetails(
    originalPrompt,
    userAnswers,
    additionalDetails,
  );

  // Extract what's in the optimized prompt
  const optimizedDetails = extractPromptDetails(optimizedPrompt);

  // Check for unsolicited additions
  const unsolicitedColors = findUnsolicitedColors(
    optimizedDetails.colors,
    userSpecified.colors,
  );
  if (unsolicitedColors.length > 0) {
    violations.push(`Added colors not specified: ${unsolicitedColors.join(', ')}`);
    addedDetails.push(...unsolicitedColors);
  }

  const unsolicitedStyles = findUnsolicitedStyles(
    optimizedDetails.styles,
    userSpecified.styles,
  );
  if (unsolicitedStyles.length > 0) {
    violations.push(`Added styles not specified: ${unsolicitedStyles.join(', ')}`);
    addedDetails.push(...unsolicitedStyles);
  }

  const unsolicitedBackgrounds = findUnsolicitedBackgrounds(
    optimizedDetails.backgrounds,
    userSpecified.backgrounds,
  );
  if (unsolicitedBackgrounds.length > 0) {
    violations.push(
      `Added backgrounds not specified: ${unsolicitedBackgrounds.join(', ')}`,
    );
    addedDetails.push(...unsolicitedBackgrounds);
  }

  const unsolicitedMoods = findUnsolicitedMoods(
    optimizedDetails.moods,
    userSpecified.moods,
  );
  if (unsolicitedMoods.length > 0) {
    violations.push(`Added moods not specified: ${unsolicitedMoods.join(', ')}`);
    addedDetails.push(...unsolicitedMoods);
  }

  // Calculate preservation score
  const score = calculatePreservationScore(violations.length, optimizedPrompt.length);

  return {
    preserved: violations.length === 0,
    violations,
    addedDetails,
    score,
  };
}

/**
 * Extract details that user actually specified
 */
function extractUserSpecifiedDetails(
  originalPrompt: string,
  userAnswers?: Record<string, any>,
  additionalDetails?: string,
): {
  colors: string[];
  styles: string[];
  backgrounds: string[];
  moods: string[];
} {
  const colors: string[] = [];
  const styles: string[] = [];
  const backgrounds: string[] = [];
  const moods: string[] = [];

  // Extract from original prompt
  const originalLower = originalPrompt.toLowerCase();
  extractColors(originalLower, colors);
  extractStyles(originalLower, styles);
  extractBackgrounds(originalLower, backgrounds);
  extractMoods(originalLower, moods);

  // Extract from user answers
  if (userAnswers) {
    Object.values(userAnswers).forEach((answer: any) => {
      if (answer && typeof answer === 'object') {
        const value = answer.customText || answer.value || '';
        if (value && value !== 'no_preference' && value !== 'default') {
          const lowerValue = value.toLowerCase();
          extractColors(lowerValue, colors);
          extractStyles(lowerValue, styles);
          extractBackgrounds(lowerValue, backgrounds);
          extractMoods(lowerValue, moods);
        }
      }
    });
  }

  // Extract from additional details
  if (additionalDetails) {
    const detailsLower = additionalDetails.toLowerCase();
    extractColors(detailsLower, colors);
    extractStyles(detailsLower, styles);
    extractBackgrounds(detailsLower, backgrounds);
    extractMoods(detailsLower, moods);
  }

  return { colors, styles, backgrounds, moods };
}

/**
 * Extract details from optimized prompt
 */
function extractPromptDetails(prompt: string): {
  colors: string[];
  styles: string[];
  backgrounds: string[];
  moods: string[];
} {
  const promptLower = prompt.toLowerCase();
  const colors: string[] = [];
  const styles: string[] = [];
  const backgrounds: string[] = [];
  const moods: string[] = [];

  extractColors(promptLower, colors);
  extractStyles(promptLower, styles);
  extractBackgrounds(promptLower, backgrounds);
  extractMoods(promptLower, moods);

  return { colors, styles, backgrounds, moods };
}

/**
 * Extract colors from text
 */
function extractColors(text: string, colors: string[]): void {
  const colorKeywords = [
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
    'black',
    'white',
    'gray',
    'grey',
    'gold',
    'silver',
    'vibrant',
    'warm',
    'cool',
    'pastel',
    'neon',
    'orange tabby',
    'calico',
    'tabby',
  ];

  colorKeywords.forEach((color) => {
    if (text.includes(color) && !colors.includes(color)) {
      colors.push(color);
    }
  });
}

/**
 * Extract styles from text
 */
function extractStyles(text: string, styles: string[]): void {
  const styleKeywords = [
    'photorealistic',
    'realistic',
    'cartoon',
    'illustration',
    'artistic',
    'painting',
    'abstract',
    'minimalist',
    'watercolor',
    'oil painting',
    'digital art',
    'sketch',
    'drawing',
  ];

  styleKeywords.forEach((style) => {
    if (text.includes(style) && !styles.includes(style)) {
      styles.push(style);
    }
  });
}

/**
 * Extract backgrounds from text
 */
function extractBackgrounds(text: string, backgrounds: string[]): void {
  const backgroundKeywords = [
    'indoor',
    'outdoor',
    'studio',
    'garden',
    'library',
    'beach',
    'forest',
    'city',
    'room',
    'background',
    'setting',
    'environment',
    'scene',
  ];

  backgroundKeywords.forEach((bg) => {
    if (text.includes(bg) && !backgrounds.includes(bg)) {
      backgrounds.push(bg);
    }
  });
}

/**
 * Extract moods from text
 */
function extractMoods(text: string, moods: string[]): void {
  const moodKeywords = [
    'cozy',
    'dramatic',
    'peaceful',
    'energetic',
    'mysterious',
    'happy',
    'sad',
    'romantic',
    'playful',
    'serious',
    'relaxed',
    'tense',
    'atmosphere',
    'mood',
  ];

  moodKeywords.forEach((mood) => {
    if (text.includes(mood) && !moods.includes(mood)) {
      moods.push(mood);
    }
  });
}

/**
 * Find unsolicited colors
 */
function findUnsolicitedColors(
  optimizedColors: string[],
  userColors: string[],
): string[] {
  return optimizedColors.filter((color) => !userColors.includes(color));
}

/**
 * Find unsolicited styles
 */
function findUnsolicitedStyles(
  optimizedStyles: string[],
  userStyles: string[],
): string[] {
  return optimizedStyles.filter((style) => !userStyles.includes(style));
}

/**
 * Find unsolicited backgrounds
 */
function findUnsolicitedBackgrounds(
  optimizedBackgrounds: string[],
  userBackgrounds: string[],
): string[] {
  return optimizedBackgrounds.filter(
    (bg) => !userBackgrounds.includes(bg),
  );
}

/**
 * Find unsolicited moods
 */
function findUnsolicitedMoods(
  optimizedMoods: string[],
  userMoods: string[],
): string[] {
  return optimizedMoods.filter((mood) => !userMoods.includes(mood));
}

/**
 * Calculate preservation score (0-100)
 */
function calculatePreservationScore(
  violationCount: number,
  promptLength: number,
): number {
  if (violationCount === 0) return 100;

  // More violations = lower score
  // Longer prompts get slight leniency (might have more context)
  const baseDeduction = violationCount * 20;
  const lengthBonus = promptLength > 100 ? 5 : 0;

  return Math.max(0, 100 - baseDeduction + lengthBonus);
}

