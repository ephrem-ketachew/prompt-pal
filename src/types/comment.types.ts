import { Document, Types } from 'mongoose';

export interface ICommentDocument extends Document {
  prompt: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

