import { z } from 'zod';
import { TimePeriod } from '../types/analytics.types.js';

export const getDashboardStatsSchema = z.object({
  // No query parameters needed for dashboard
});

export const getUserStatsSchema = z.object({
  // No query parameters needed for user stats
});

export const getPromptStatsSchema = z.object({
  // No query parameters needed for prompt stats
});

export const getCommentStatsSchema = z.object({
  // No query parameters needed for comment stats
});

export const getOptimizationStatsSchema = z.object({
  // No query parameters needed for optimization stats
});

export const getGrowthMetricsSchema = z.object({
  contentType: z
    .enum(['users', 'prompts', 'comments', 'optimizations'], {
      message: 'Content type must be: users, prompts, comments, or optimizations',
    })
    .optional()
    .default('users'),
  period: z
    .enum(['day', 'week', 'month', 'year', 'custom'], {
      message: 'Period must be: day, week, month, year, or custom',
    })
    .optional()
    .default('month'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const getEngagementMetricsSchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export const getOverviewStatsSchema = z.object({
  // No query parameters needed for overview
});

// Type exports
export type GetDashboardStatsQuery = z.infer<typeof getDashboardStatsSchema>;
export type GetUserStatsQuery = z.infer<typeof getUserStatsSchema>;
export type GetPromptStatsQuery = z.infer<typeof getPromptStatsSchema>;
export type GetCommentStatsQuery = z.infer<typeof getCommentStatsSchema>;
export type GetOptimizationStatsQuery = z.infer<
  typeof getOptimizationStatsSchema
>;
export type GetGrowthMetricsQuery = z.infer<typeof getGrowthMetricsSchema>;
export type GetEngagementMetricsQuery = z.infer<
  typeof getEngagementMetricsSchema
>;
export type GetOverviewStatsQuery = z.infer<typeof getOverviewStatsSchema>;

