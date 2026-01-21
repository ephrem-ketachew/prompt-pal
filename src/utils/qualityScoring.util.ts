/**
 * Quality Scoring Utility
 * Comprehensive quality scoring for prompts
 */

import { analyzePrompt, PromptAnalysisResult } from './promptAnalyzer.util.js';
import { validateIntentPreservation } from './intentPreservation.util.js';

export interface ComprehensiveQualityScore {
  overall: number; // 0-100
  clarity: number;
  specificity: number;
  structure: number;
  completeness: number;
  intentPreservation: number;
  breakdown: {
    clarity: { score: number; factors: string[] };
    specificity: { score: number; factors: string[] };
    structure: { score: number; factors: string[] };
    completeness: { score: number; factors: string[] };
    intentPreservation: { score: number; factors: string[] };
  };
}

/**
 * Calculate comprehensive quality score
 */
export function calculateComprehensiveQualityScore(
  originalPrompt: string,
  optimizedPrompt: string,
  mediaType: 'text' | 'image' | 'video' | 'audio',
  userAnswers?: Record<string, any>,
  additionalDetails?: string,
): ComprehensiveQualityScore {
  // Analyze both prompts
  const originalAnalysis = analyzePrompt(originalPrompt, mediaType);
  const optimizedAnalysis = analyzePrompt(optimizedPrompt, mediaType);

  // Validate intent preservation
  const intentValidation = validateIntentPreservation(
    originalPrompt,
    optimizedPrompt,
    userAnswers,
    additionalDetails,
  );

  // Calculate individual scores
  const clarity = calculateClarityScore(originalAnalysis, optimizedAnalysis);
  const specificity = calculateSpecificityScore(originalAnalysis, optimizedAnalysis);
  const structure = calculateStructureScore(originalAnalysis, optimizedAnalysis);
  const completeness = optimizedAnalysis.completenessScore;
  const intentPreservation = intentValidation.score;

  // Calculate overall score (weighted average)
  const overall = Math.round(
    clarity.score * 0.25 +
      specificity.score * 0.25 +
      structure.score * 0.2 +
      completeness * 0.15 +
      intentPreservation * 0.15,
  );

  return {
    overall,
    clarity: clarity.score,
    specificity: specificity.score,
    structure: structure.score,
    completeness,
    intentPreservation,
    breakdown: {
      clarity,
      specificity,
      structure,
      completeness: {
        score: completeness,
        factors: [
          `Missing elements: ${optimizedAnalysis.missingElements.length}`,
          `Completeness: ${completeness}%`,
        ],
      },
      intentPreservation: {
        score: intentPreservation,
        factors: intentValidation.preserved
          ? ['Intent fully preserved']
          : [
              'Intent violations detected',
              ...intentValidation.violations,
            ],
      },
    },
  };
}

/**
 * Calculate clarity score with factors
 */
function calculateClarityScore(
  original: PromptAnalysisResult,
  optimized: PromptAnalysisResult,
): { score: number; factors: string[] } {
  const improvement = optimized.clarityScore - original.clarityScore;
  const factors: string[] = [];

  if (improvement > 0) {
    factors.push(`Clarity improved by ${improvement} points`);
  } else if (improvement < 0) {
    factors.push(`Clarity decreased by ${Math.abs(improvement)} points`);
  } else {
    factors.push('Clarity maintained');
  }

  if (optimized.clarityScore >= 80) {
    factors.push('High clarity achieved');
  } else if (optimized.clarityScore >= 60) {
    factors.push('Moderate clarity');
  } else {
    factors.push('Clarity needs improvement');
  }

  return {
    score: optimized.clarityScore,
    factors,
  };
}

/**
 * Calculate specificity score with factors
 */
function calculateSpecificityScore(
  original: PromptAnalysisResult,
  optimized: PromptAnalysisResult,
): { score: number; factors: string[] } {
  const improvement = optimized.specificityScore - original.specificityScore;
  const factors: string[] = [];

  if (improvement > 0) {
    factors.push(`Specificity improved by ${improvement} points`);
  } else if (improvement < 0) {
    factors.push(`Specificity decreased by ${Math.abs(improvement)} points`);
  } else {
    factors.push('Specificity maintained');
  }

  const wordIncrease = optimized.wordCount - original.wordCount;
  if (wordIncrease > 0) {
    factors.push(`Added ${wordIncrease} words for detail`);
  }

  if (optimized.specificityScore >= 80) {
    factors.push('Highly specific');
  } else if (optimized.specificityScore >= 60) {
    factors.push('Moderately specific');
  } else {
    factors.push('Needs more specificity');
  }

  return {
    score: optimized.specificityScore,
    factors,
  };
}

/**
 * Calculate structure score with factors
 */
function calculateStructureScore(
  original: PromptAnalysisResult,
  optimized: PromptAnalysisResult,
): { score: number; factors: string[] } {
  const improvement = optimized.structureScore - original.structureScore;
  const factors: string[] = [];

  if (improvement > 0) {
    factors.push(`Structure improved by ${improvement} points`);
  } else if (improvement < 0) {
    factors.push(`Structure decreased by ${Math.abs(improvement)} points`);
  } else {
    factors.push('Structure maintained');
  }

  if (optimized.structureScore >= 80) {
    factors.push('Well-structured prompt');
  } else if (optimized.structureScore >= 60) {
    factors.push('Adequate structure');
  } else {
    factors.push('Structure needs improvement');
  }

  return {
    score: optimized.structureScore,
    factors,
  };
}

