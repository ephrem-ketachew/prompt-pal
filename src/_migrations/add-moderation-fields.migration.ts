/**
 * Migration: Add Moderation Fields to Prompts and Comments
 * 
 * This migration adds moderation-related fields to existing Prompt and Comment documents:
 * - isHidden (default: false)
 * - isDeleted (default: false)
 * - deletedAt (optional)
 * - deletedBy (optional)
 * - moderationReason (optional)
 * - moderationNotes (optional)
 * - flaggedCount (default: 0)
 * - lastFlaggedAt (optional)
 * 
 * Run with: pnpm tsx src/_migrations/add-moderation-fields.migration.ts
 */

import mongoose from 'mongoose';
import config from '../config/env.config.js';
import Prompt from '../models/prompt.model.js';
import Comment from '../models/comment.model.js';
import logger from '../config/logger.config.js';

const connectDB = async () => {
  const dbUrlTemplate = config.mongo.uriTemplate;
  const dbPassword = config.mongo.password;
  const dbUrl = dbUrlTemplate.replace('<PASSWORD>', dbPassword);

  try {
    await mongoose.connect(dbUrl);
    logger.info('[Migration]: MongoDB Connected...');
  } catch (err: any) {
    logger.error(`[Migration]: DB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

const migratePrompts = async () => {
  try {
    logger.info('[Migration]: Starting Prompt migration...');

    // Update all prompts that don't have moderation fields
    const result = await Prompt.updateMany(
      {
        $or: [
          { isHidden: { $exists: false } },
          { isDeleted: { $exists: false } },
          { flaggedCount: { $exists: false } },
        ],
      },
      {
        $set: {
          isHidden: false,
          isDeleted: false,
          flaggedCount: 0,
        },
      },
    );

    logger.info(
      `[Migration]: ✅ Updated ${result.modifiedCount} prompt(s) with moderation fields`,
    );
    return result.modifiedCount;
  } catch (error: any) {
    logger.error(`[Migration]: ❌ Failed to migrate prompts: ${error.message}`);
    throw error;
  }
};

const migrateComments = async () => {
  try {
    logger.info('[Migration]: Starting Comment migration...');

    // Update all comments that don't have moderation fields
    const result = await Comment.updateMany(
      {
        $or: [
          { isHidden: { $exists: false } },
          { isDeleted: { $exists: false } },
          { flaggedCount: { $exists: false } },
        ],
      },
      {
        $set: {
          isHidden: false,
          isDeleted: false,
          flaggedCount: 0,
        },
      },
    );

    logger.info(
      `[Migration]: ✅ Updated ${result.modifiedCount} comment(s) with moderation fields`,
    );
    return result.modifiedCount;
  } catch (error: any) {
    logger.error(`[Migration]: ❌ Failed to migrate comments: ${error.message}`);
    throw error;
  }
};

const run = async () => {
  try {
    await connectDB();

    const promptCount = await migratePrompts();
    const commentCount = await migrateComments();

    logger.info(
      `[Migration]: ✅ Migration completed successfully! Updated ${promptCount} prompts and ${commentCount} comments.`,
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    logger.error(`[Migration]: ❌ Migration failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run migration if executed directly
if (require.main === module) {
  run();
}

export default run;

