import { z } from 'zod';
import { UserRole, UserStatus } from '../types/user.types.js';
import { ModerationReason, ContentType, FlagStatus, FlagResolution } from '../types/moderation.types.js';
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid ID format.' },
);

export const updateUserRoleSchema = z.object({
  role: z.enum(['user', 'admin', 'superadmin'], {
    message: 'Role is required',
  }),
});

export const getUsersAdminSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['user', 'admin', 'superadmin']).optional(),
  status: z.enum(['pending', 'approved', 'blocked']).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(
    ['pending', 'approved', 'blocked'] as [UserStatus, ...UserStatus[]],
    {
      message: 'Status is required',
    },
  ),
});

// Moderation schemas
export const moderateContentSchema = z.object({
  action: z.enum(['hide', 'unhide', 'delete', 'restore'], {
    message: 'Action must be: hide, unhide, delete, or restore',
  }),
  reason: z
    .enum(['spam', 'inappropriate', 'copyright', 'policy_violation', 'harassment', 'other'])
    .optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional(),
});

export const bulkModerateSchema = z.object({
  contentType: z.enum(['prompt', 'comment'], {
    message: 'Content type must be: prompt or comment',
  }),
  contentIds: z
    .array(objectIdSchema)
    .min(1, 'At least one content ID is required.')
    .max(100, 'Cannot moderate more than 100 items at once.'),
  action: z.enum(['hide', 'unhide', 'delete', 'restore'], {
    message: 'Action must be: hide, unhide, delete, or restore',
  }),
  reason: z
    .enum(['spam', 'inappropriate', 'copyright', 'policy_violation', 'harassment', 'other'])
    .optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional(),
});

export const getPromptsAdminSchema = z.object({
  search: z.string().optional(),
  isHidden: z.coerce.boolean().optional(),
  isDeleted: z.coerce.boolean().optional(),
  moderationReason: z
    .enum(['spam', 'inappropriate', 'copyright', 'policy_violation', 'other'])
    .optional(),
  flaggedOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export const getCommentsAdminSchema = z.object({
  promptId: objectIdSchema.optional(),
  isHidden: z.coerce.boolean().optional(),
  isDeleted: z.coerce.boolean().optional(),
  moderationReason: z
    .enum(['spam', 'inappropriate', 'harassment', 'other'])
    .optional(),
  flaggedOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export const getFlaggedContentSchema = z.object({
  contentType: z.enum(['prompt', 'comment']).optional(),
  status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']).optional().default('pending'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const reviewFlagSchema = z.object({
  resolution: z.enum(
    ['content_hidden', 'content_deleted', 'user_warned', 'no_action', 'false_report'],
    {
      message: 'Resolution must be: content_hidden, content_deleted, user_warned, no_action, or false_report',
    },
  ),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters.').optional(),
});

export const flagContentSchema = z.object({
  contentType: z.enum(['prompt', 'comment'], {
    message: 'Content type must be: prompt or comment',
  }),
  contentId: objectIdSchema,
  reason: z.enum(['spam', 'inappropriate', 'copyright', 'harassment', 'other'], {
    message: 'Reason is required',
  }),
  description: z.string().max(500, 'Description cannot exceed 500 characters.').optional(),
});

// Type exports
export type GetUsersAdminQuery = z.infer<typeof getUsersAdminSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ModerateContentInput = z.infer<typeof moderateContentSchema>;
export type BulkModerateInput = z.infer<typeof bulkModerateSchema>;
export type GetPromptsAdminQuery = z.infer<typeof getPromptsAdminSchema>;
export type GetCommentsAdminQuery = z.infer<typeof getCommentsAdminSchema>;
export type GetFlaggedContentQuery = z.infer<typeof getFlaggedContentSchema>;
export type ReviewFlagInput = z.infer<typeof reviewFlagSchema>;
export type FlagContentInput = z.infer<typeof flagContentSchema>;
