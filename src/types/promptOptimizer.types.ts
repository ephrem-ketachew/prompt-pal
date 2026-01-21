import { Document, Types } from 'mongoose';
import { MediaType } from './prompt.types.js';

export type OptimizationType = 'quick' | 'premium';
export type OptimizationMode = 'analyze' | 'build' | 'complete';
export type OptimizationStatus = 'pending' | 'analyzing' | 'questions_ready' | 'building' | 'completed' | 'failed';

export interface QuestionAnswer {
  type: 'option' | 'custom' | 'default' | 'skipped';
  value: string;
  customText?: string;
}

export interface OptimizationQuestion {
  id: string;
  question: string;
  type: 'select' | 'select_or_text' | 'textarea';
  priority: 'high' | 'medium' | 'low';
  answered: boolean;
  answer?: QuestionAnswer;
}

export interface QualityScore {
  before: number;
  after: number;
  improvements: string[];
  intentPreserved: boolean;
}

export interface OptimizationMetadata {
  wordCount: {
    before: number;
    after: number;
  };
  clarityScore: {
    before: number;
    after: number;
  };
  specificityScore: {
    before: number;
    after: number;
  };
  structureScore: {
    before: number;
    after: number;
  };
  completenessScore: number;
}

export interface PromptAnalysis {
  completenessScore: number;
  missingElements: string[];
  grammarFixed: boolean;
  structureImproved: boolean;
}

export interface IPromptOptimizationDocument extends Document {
  user: Types.ObjectId;
  originalPrompt: string;
  optimizedPrompt?: string;
  targetModel: string;
  mediaType: MediaType;
  optimizationType: OptimizationType;
  optimizationMode: OptimizationMode;
  
  // Question-based optimization data
  questions?: OptimizationQuestion[];
  additionalDetails?: string;
  userAnswers?: Record<string, QuestionAnswer>;
  
  // Quality metrics
  qualityScore?: QualityScore;
  metadata?: OptimizationMetadata;
  analysis?: PromptAnalysis;
  
  // Suggestions
  suggestions?: Array<{
    type: string;
    section: string;
    original: string;
    suggested: string;
    reason: string;
  }>;
  
  // Context
  promptContext?: {
    useCase?: string;
    outputType?: string;
    tone?: string;
    length?: string;
  };
  
  // Feedback
  feedback?: {
    rating?: number;
    wasHelpful?: boolean;
    comments?: string;
    submittedAt?: Date;
  };
  
  status: OptimizationStatus;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

