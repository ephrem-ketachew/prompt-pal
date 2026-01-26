import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import * as adminController from '../controllers/admin.controller.js';
import {
  getUsersAdminSchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  moderateContentSchema,
  bulkModerateSchema,
  getPromptsAdminSchema,
  updatePromptStatusSchema,
  getCommentsAdminSchema,
  getFlaggedContentSchema,
  reviewFlagSchema,
} from '../validation/admin.validation.js';
import { getUserSchema } from '../validation/user.schema.js';

const router = Router();

router.use(protect, restrictTo('admin', 'superadmin'));

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Change user role
 *     tags: [Admin]
 *     description: Change a user's role (user, admin, or superadmin). **Restricted to SUPERADMIN only.**
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID - must be a valid MongoDB ObjectId
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, superadmin]
 *                 description: New role to assign to the user
 *                 example: admin
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User role updated to admin.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         role:
 *                           type: string
 *                           example: admin
 *                         fullName:
 *                           type: string
 *                           example: John Doe
 *       400:
 *         description: Bad request - invalid ID or role value
 *       401:
 *         description: Unauthorized - valid JWT cookie required
 *       403:
 *         description: Forbidden - superadmin role required
 *       404:
 *         description: User not found
 */
router.patch(
  '/users/:id/role',
  restrictTo('superadmin'),
  validate(getUserSchema, 'params'),
  validate(updateUserRoleSchema, 'body'),
  adminController.updateUserRoleHandler,
);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin view)
 *     tags: [Admin]
 *     description: Retrieve a paginated list of all users with filtering by role, status, and search. Requires admin or superadmin role.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name or email (optional)
 *         example: john
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin, superadmin]
 *         description: Filter users by role (optional)
 *         example: user
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, blocked]
 *         description: Filter users by status (optional)
 *         example: approved
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page (max 100)
 *         example: 20
 *     responses:
 *       200:
 *         description: Successfully retrieved users with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *                   description: Total number of users matching the query
 *                   example: 500
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                   example: 25
 *       400:
 *         description: Bad request - invalid query parameters
 *       401:
 *         description: Unauthorized - valid JWT cookie required
 *       403:
 *         description: Forbidden - admin or superadmin role required
 */
router.get(
  '/users',
  validate(getUsersAdminSchema, 'query'),
  adminController.getAllUsersAdminHandler,
);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [Admin]
 *     description: Update the status of a user (pending, approved, or blocked). Requires admin or superadmin role.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID - must be a valid MongoDB ObjectId
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, blocked]
 *                 description: New status for the user
 *                 example: approved
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User status updated to approved.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         status:
 *                           type: string
 *                           example: approved
 *                         fullName:
 *                           type: string
 *                           example: John Doe
 *       400:
 *         description: Bad request - invalid ID or status value
 *       401:
 *         description: Unauthorized - valid JWT cookie required
 *       403:
 *         description: Forbidden - admin or superadmin role required
 *       404:
 *         description: User not found
 */
router.patch(
  '/users/:id/status',
  validate(getUserSchema, 'params'),
  validate(updateUserStatusSchema, 'body'),
  adminController.updateUserStatusHandler,
);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user details (Admin view)
 *     tags: [Admin]
 *     description: Retrieve detailed information about a specific user. Requires admin or superadmin role.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID - must be a valid MongoDB ObjectId
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized - valid JWT cookie required
 *       403:
 *         description: Forbidden - admin or superadmin role required
 *       404:
 *         description: User not found
 */
router.get(
  '/users/:id',
  validate(getUserSchema, 'params'),
  adminController.getUserDetailsHandler,
);

// ============================================================================
// PROMPT MODERATION ROUTES
// ============================================================================

/**
 * @swagger
 * /admin/prompts:
 *   get:
 *     summary: Get all prompts (Admin view)
 *     tags: [Admin]
 *     description: Retrieve a paginated list of all prompts with moderation filters. Requires admin or superadmin role.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search prompts by title, text, or description (optional)
 *       - in: query
 *         name: isHidden
 *         schema:
 *           type: boolean
 *         description: Filter by hidden status (optional)
 *       - in: query
 *         name: isDeleted
 *         schema:
 *           type: boolean
 *         description: Filter by deleted status (optional)
 *       - in: query
 *         name: moderationReason
 *         schema:
 *           type: string
 *           enum: [spam, inappropriate, copyright, policy_violation, other]
 *         description: Filter by moderation reason (optional)
 *       - in: query
 *         name: flaggedOnly
 *         schema:
 *           type: boolean
 *         description: Show only flagged prompts (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Successfully retrieved prompts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 */
router.get(
  '/prompts',
  validate(getPromptsAdminSchema, 'query'),
  adminController.getPromptsAdminHandler,
);

/**
 * @swagger
 * /admin/prompts/{id}:
 *   get:
 *     summary: Get prompt details (Admin view)
 *     tags: [Admin]
 *     description: Retrieve detailed information about a specific prompt including moderation fields.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved prompt details
 *       404:
 *         description: Prompt not found
 */
router.get(
  '/prompts/:id',
  validate(getUserSchema, 'params'),
  adminController.getPromptDetailsAdminHandler,
);

/**
 * @swagger
 * /admin/prompts/{id}/status:
 *   patch:
 *     summary: Update prompt status
 *     tags: [Admin]
 *     description: Update the status of a prompt (active, inactive, or deleted). Requires admin or superadmin role.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prompt ID - must be a valid MongoDB ObjectId
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, deleted]
 *                 description: New status for the prompt
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Prompt status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Prompt status updated to inactive.
 *                 data:
 *                   type: object
 *                   properties:
 *                     prompt:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         status:
 *                           type: string
 *                           example: inactive
 *                         isHidden:
 *                           type: boolean
 *                           example: true
 *                         isDeleted:
 *                           type: boolean
 *                           example: false
 *       400:
 *         description: Bad request - invalid ID or status value
 *       401:
 *         description: Unauthorized - valid JWT cookie required
 *       403:
 *         description: Forbidden - admin or superadmin role required
 *       404:
 *         description: Prompt not found
 */
router.patch(
  '/prompts/:id/status',
  validate(getUserSchema, 'params'),
  validate(updatePromptStatusSchema, 'body'),
  adminController.updatePromptStatusHandler,
);

/**
 * @swagger
 * /admin/prompts/{id}/moderate:
 *   patch:
 *     summary: Moderate a prompt
 *     tags: [Admin]
 *     description: Hide, unhide, delete, or restore a prompt. Requires admin or superadmin role.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [hide, unhide, delete, restore]
 *               reason:
 *                 type: string
 *                 enum: [spam, inappropriate, copyright, policy_violation, other]
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Prompt moderated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Prompt not found
 */
router.patch(
  '/prompts/:id/moderate',
  validate(getUserSchema, 'params'),
  validate(moderateContentSchema, 'body'),
  adminController.moderatePromptHandler,
);

/**
 * @swagger
 * /admin/prompts/bulk:
 *   post:
 *     summary: Bulk moderate prompts
 *     tags: [Admin]
 *     description: Perform bulk moderation actions on multiple prompts. Requires admin or superadmin role.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentType
 *               - contentIds
 *               - action
 *             properties:
 *               contentType:
 *                 type: string
 *                 enum: [prompt]
 *               contentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 100
 *               action:
 *                 type: string
 *                 enum: [hide, unhide, delete, restore]
 *               reason:
 *                 type: string
 *                 enum: [spam, inappropriate, copyright, policy_violation, other]
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Bulk moderation completed
 *       400:
 *         description: Bad request
 */
router.post(
  '/prompts/bulk',
  validate(bulkModerateSchema, 'body'),
  adminController.bulkModeratePromptsHandler,
);

// ============================================================================
// COMMENT MODERATION ROUTES
// ============================================================================

/**
 * @swagger
 * /admin/comments:
 *   get:
 *     summary: Get all comments (Admin view)
 *     tags: [Admin]
 *     description: Retrieve a paginated list of all comments with moderation filters.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: promptId
 *         schema:
 *           type: string
 *         description: Filter by prompt ID (optional)
 *       - in: query
 *         name: isHidden
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isDeleted
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: moderationReason
 *         schema:
 *           type: string
 *           enum: [spam, inappropriate, harassment, other]
 *       - in: query
 *         name: flaggedOnly
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 */
router.get(
  '/comments',
  validate(getCommentsAdminSchema, 'query'),
  adminController.getCommentsAdminHandler,
);

/**
 * @swagger
 * /admin/comments/{id}:
 *   get:
 *     summary: Get comment details (Admin view)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved comment details
 *       404:
 *         description: Comment not found
 */
router.get(
  '/comments/:id',
  validate(getUserSchema, 'params'),
  adminController.getCommentDetailsAdminHandler,
);

/**
 * @swagger
 * /admin/comments/{id}/moderate:
 *   patch:
 *     summary: Moderate a comment
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [hide, unhide, delete, restore]
 *               reason:
 *                 type: string
 *                 enum: [spam, inappropriate, harassment, other]
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Comment moderated successfully
 */
router.patch(
  '/comments/:id/moderate',
  validate(getUserSchema, 'params'),
  validate(moderateContentSchema, 'body'),
  adminController.moderateCommentHandler,
);

/**
 * @swagger
 * /admin/comments/bulk:
 *   post:
 *     summary: Bulk moderate comments
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentType
 *               - contentIds
 *               - action
 *             properties:
 *               contentType:
 *                 type: string
 *                 enum: [comment]
 *               contentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 100
 *               action:
 *                 type: string
 *                 enum: [hide, unhide, delete, restore]
 *               reason:
 *                 type: string
 *                 enum: [spam, inappropriate, harassment, other]
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Bulk moderation completed
 */
router.post(
  '/comments/bulk',
  validate(bulkModerateSchema, 'body'),
  adminController.bulkModerateCommentsHandler,
);

// ============================================================================
// FLAG MANAGEMENT ROUTES
// ============================================================================

/**
 * @swagger
 * /admin/flags:
 *   get:
 *     summary: Get flagged content
 *     tags: [Admin]
 *     description: Retrieve a paginated list of flagged content for review.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: contentType
 *         schema:
 *           type: string
 *           enum: [prompt, comment]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewed, resolved, dismissed]
 *           default: pending
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Successfully retrieved flagged content
 */
router.get(
  '/flags',
  validate(getFlaggedContentSchema, 'query'),
  adminController.getFlaggedContentHandler,
);

/**
 * @swagger
 * /admin/flags/stats:
 *   get:
 *     summary: Get flag statistics
 *     tags: [Admin]
 *     description: Get aggregated statistics about flagged content.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved flag statistics
 */
router.get('/flags/stats', adminController.getFlagStatsHandler);

/**
 * @swagger
 * /admin/flags/{id}:
 *   get:
 *     summary: Get flag details
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved flag details
 *       404:
 *         description: Flag not found
 */
router.get(
  '/flags/:id',
  validate(getUserSchema, 'params'),
  adminController.getFlagDetailsHandler,
);

/**
 * @swagger
 * /admin/flags/{id}/review:
 *   post:
 *     summary: Review and resolve a flag
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resolution
 *             properties:
 *               resolution:
 *                 type: string
 *                 enum: [content_hidden, content_deleted, user_warned, no_action, false_report]
 *               notes:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Flag reviewed and resolved successfully
 */
router.post(
  '/flags/:id/review',
  validate(getUserSchema, 'params'),
  validate(reviewFlagSchema, 'body'),
  adminController.reviewFlagHandler,
);

/**
 * @swagger
 * /admin/flags/{id}/dismiss:
 *   patch:
 *     summary: Dismiss a flag
 *     tags: [Admin]
 *     description: Dismiss a flag as a false report.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flag dismissed successfully
 */
router.patch(
  '/flags/:id/dismiss',
  validate(getUserSchema, 'params'),
  adminController.dismissFlagHandler,
);

export default router;
