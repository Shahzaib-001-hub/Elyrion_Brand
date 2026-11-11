import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICorporateQuote extends Document {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  quantity: number;
  budget: string;
  deliveryDate: Date;
  customMessage?: string;
  logoPublicId?: string; // Cloudinary public_id
  logoUrl?: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'closed';
  adminNotes?: string;
  estimatedTotal?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CorporateQuoteSchema = new Schema<ICorporateQuote>(
  {
    company: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    quantity: { type: Number, required: true, min: 10 },
    budget: { type: String, required: true },
    deliveryDate: { type: Date, required: true },
    customMessage: { type: String },
    logoPublicId: { type: String },
    logoUrl: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'quoted', 'closed'],
      default: 'pending',
      index: true,
    },
    adminNotes: { type: String },
    estimatedTotal: { type: Number },
  },
  { timestamps: true }
);

export const CorporateQuote: Model<ICorporateQuote> =
  mongoose.models.CorporateQuote ||
  mongoose.model<ICorporateQuote>('CorporateQuote', CorporateQuoteSchema);

export default CorporateQuote;
