import mongoose, { Schema, Model, Document } from 'mongoose';

export type PopupType =
  | 'exit_intent'
  | 'timed'
  | 'scroll'
  | 'announcement_bar'
  | 'countdown';

export interface IPopupPromotion extends Document {
  title: string;
  type: PopupType;
  heading: string;
  subheading?: string;
  couponCode?: string;
  buttonText: string;
  buttonLink?: string;
  delaySeconds?: number;
  scrollPercent?: number;
  countdownTarget?: Date;
  frequencyHours: number; // e.g. 24 hours
  active: boolean;
  pagesTarget?: string[]; // e.g. ['/fragrances', '/']
  createdAt: Date;
  updatedAt: Date;
}

const PopupPromotionSchema = new Schema<IPopupPromotion>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['exit_intent', 'timed', 'scroll', 'announcement_bar', 'countdown'],
      default: 'timed',
    },
    heading: { type: String, required: true },
    subheading: { type: String },
    couponCode: { type: String },
    buttonText: { type: String, default: 'Unlock Privilege' },
    buttonLink: { type: String, default: '/fragrances' },
    delaySeconds: { type: Number, default: 5 },
    scrollPercent: { type: Number, default: 40 },
    countdownTarget: { type: Date },
    frequencyHours: { type: Number, default: 24 },
    active: { type: Boolean, default: true },
    pagesTarget: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const PopupPromotion: Model<IPopupPromotion> =
  mongoose.models.PopupPromotion ||
  mongoose.model<IPopupPromotion>('PopupPromotion', PopupPromotionSchema);

export default PopupPromotion;
