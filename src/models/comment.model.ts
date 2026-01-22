/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - prompt
 *         - user
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: Comment ID
 *           example: 507f1f77bcf86cd799439011
 *         prompt:
 *           type: string
 *           description: Prompt ID this comment belongs to (references Prompt model)
 *           example: 507f1f77bcf86cd799439011
 *         user:
 *           type: string
 *           description: User ID who created the comment (references User model)
 *           example: 507f1f77bcf86cd799439011
 *         text:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *           description: Comment text content
 *           example: This prompt worked great for my project!
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked this comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Comment creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
import mongoose, { Schema, SchemaDefinition } from 'mongoose';
import { ICommentDocument } from '../types/comment.types.js';

const commentSchemaDefinition: SchemaDefinition<ICommentDocument> = {
  prompt: {
    type: Schema.Types.ObjectId,
    ref: 'Prompt',
    required: [true, 'Prompt is required.'],
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required.'],
    index: true,
  },
  text: {
    type: String,
    required: [true, 'Comment text is required.'],
    trim: true,
    minlength: [1, 'Comment text cannot be empty.'],
    maxlength: [1000, 'Comment text cannot exceed 1000 characters.'],
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
};

const commentSchema = new Schema<ICommentDocument>(commentSchemaDefinition, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for efficient queries
commentSchema.index({ prompt: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ prompt: 1, likes: 1 });

const Comment = mongoose.model<ICommentDocument>('Comment', commentSchema);

export default Comment;

