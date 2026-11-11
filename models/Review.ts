import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  userName: string;
  rating: number; // 1 to 5
  headline: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    headline: { type: String, required: true },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
      index: true,
    },
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
