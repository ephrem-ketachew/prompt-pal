import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync.util.js';
import * as moderationService from '../services/moderation.service.js';
import { FlagContentInput } from '../validation/admin.validation.js';

export const flagContentHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const input = req.body as FlagContentInput;
    const userId = req.user!.id;

    // Override contentId from URL params if available (for prompt/:id/flag or comment/:id/flag)
    const contentIdFromParams = req.params.id || req.params.commentId;
    if (contentIdFromParams) {
      input.contentId = contentIdFromParams;
    }

    const flag = await moderationService.flagContent(userId, input);

    res.status(201).json({
      status: 'success',
      message: 'Content flagged successfully. Our team will review it shortly.',
      data: { flag },
    });
  },
);

