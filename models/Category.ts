import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  isCollection?: boolean;
  order: number;
  seo?: {
    title?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String },
    bannerImage: { type: String },
    isCollection: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seo: {
      title: { type: String },
      description: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
