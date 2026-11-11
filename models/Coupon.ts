import mongoose, { Schema, Model, Document } from 'mongoose';

export type DiscountType = 'percentage' | 'fixed' | 'free_shipping';

export interface ICoupon extends Document {
  code: string;
  discountType: DiscountType;
  discountValue: number; // percentage (e.g. 15 for 15%) or minor units (e.g. 2000 for £20)
  minSpend?: number; // minor units
  usageLimit?: number;
  usedCount: number;
  perCustomerLimit?: number;
  expiryDate?: Date;
  applicableCategories?: mongoose.Types.ObjectId[];
  applicableProducts?: mongoose.Types.ObjectId[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping'],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minSpend: { type: Number, default: 0 },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    perCustomerLimit: { type: Number, default: 1 },
    expiryDate: { type: Date },
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
