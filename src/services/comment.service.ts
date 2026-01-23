import Comment from '../models/comment.model.js';
import Prompt from '../models/prompt.model.js';
import AppError from '../utils/appError.util.js';
import {
  CreateCommentInput,
  UpdateCommentInput,
  GetCommentsQuery,
} from '../validation/comment.schema.js';

export const createComment = async (
  promptId: string,
  userId: string,
  input: CreateCommentInput,
) => {
  // Verify prompt exists
  const prompt = await Prompt.findById(promptId);
  if (!prompt) {
    throw new AppError('Prompt not found.', 404);
  }

  const comment = await Comment.create({
    prompt: promptId,
    user: userId,
    text: input.text,
  });

  await comment.populate({
    path: 'user',
    select: 'firstName lastName email profileImage',
  });

  return comment;
};

export const getCommentsByPrompt = async (
  promptId: string,
  query: GetCommentsQuery,
) => {
  // Verify prompt exists
  const prompt = await Prompt.findById(promptId);
  if (!prompt) {
    throw new AppError('Prompt not found.', 404);
  }

  const { page = 1, limit = 20 } = query;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({
    prompt: promptId,
    isDeleted: false,
    isHidden: false,
  })
    .populate({
      path: 'user',
      select: 'firstName lastName email profileImage',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments({
    prompt: promptId,
    isDeleted: false,
    isHidden: false,
  });

  return {
    comments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
  };
};

export const getCommentById = async (commentId: string) => {
  const comment = await Comment.findOne({
    _id: commentId,
    isDeleted: false,
  }).populate({
    path: 'user',
    select: 'firstName lastName email profileImage',
  });

  if (!comment) {
    throw new AppError('Comment not found.', 404);
  }

  if (comment.isHidden) {
    throw new AppError('Comment not found.', 404);
  }

  return comment;
};

export const updateComment = async (
  commentId: string,
  userId: string,
  input: UpdateCommentInput,
  userRole: string,
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError('Comment not found.', 404);
  }

  const isOwner = comment.user.toString() === userId.toString();
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  if (!isOwner && !isAdmin) {
    throw new AppError(
      'You do not have permission to update this comment.',
      403,
    );
  }

  comment.text = String(input.text);
  await comment.save();

  await comment.populate({
    path: 'user',
    select: 'firstName lastName email profileImage',
  });

  return comment;
};

export const deleteComment = async (
  commentId: string,
  userId: string,
  userRole: string,
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError('Comment not found.', 404);
  }

  const isOwner = comment.user.toString() === userId.toString();
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  if (!isOwner && !isAdmin) {
    throw new AppError(
      'You do not have permission to delete this comment.',
      403,
    );
  }

  await Comment.findByIdAndDelete(commentId);

  return { message: 'Comment deleted successfully.' };
};

export const toggleCommentLike = async (commentId: string, userId: string) => {
  const comment = await Comment.findOne({
    _id: commentId,
    isDeleted: false,
  });

  if (!comment) {
    throw new AppError('Comment not found.', 404);
  }

  if (comment.isHidden) {
    throw new AppError('Comment not found.', 404);
  }

  const likeIndex = comment.likes.findIndex(
    (id) => id.toString() === userId.toString(),
  );

  if (likeIndex > -1) {
    comment.likes.splice(likeIndex, 1);
  } else {
    comment.likes.push(userId as any);
  }

  await comment.save();

  await comment.populate({
    path: 'user',
    select: 'firstName lastName email profileImage',
  });

  return comment;
};

