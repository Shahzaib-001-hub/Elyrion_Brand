import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProductNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface IProductSEO {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export interface IProductRating {
  average: number;
  count: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  description: string;
  notes: IProductNotes;
  volume: number; // e.g. 50 (ml)
  bottleType: string; // e.g. "Transparent glass"
  origin: string; // e.g. "UK"
  concentration: 'EDP' | 'EDT' | 'Parfum';
  gender: 'men' | 'women' | 'unisex';
  categories: mongoose.Types.ObjectId[];
  moods: string[];
  images: string[]; // Cloudinary public_ids
  price: number; // in minor units, e.g. 14500 (£145.00)
  compareAtPrice?: number;
  currency: string;
  stock: number;
  sku: string;
  barcode?: string;
  weight?: number; // grams
  tags: string[];
  seo: IProductSEO;
  status: 'draft' | 'active' | 'archived';
  rating: IProductRating;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    brand: { type: String, default: 'Elyrion', trim: true },
    description: { type: String, required: true },
    notes: {
      top: { type: [String], default: [] },
      heart: { type: [String], default: [] },
      base: { type: [String], default: [] },
    },
    volume: { type: Number, default: 50 },
    bottleType: { type: String, default: 'Transparent glass' },
    origin: { type: String, default: 'UK' },
    concentration: {
      type: String,
      enum: ['EDP', 'EDT', 'Parfum'],
      default: 'EDP',
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    moods: { type: [String], default: [] },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    currency: { type: String, default: 'GBP' },
    stock: { type: Number, default: 50, min: 0 },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String },
    weight: { type: Number, default: 350 },
    tags: { type: [String], default: [] },
    seo: {
      title: { type: String },
      description: { type: String },
      canonical: { type: String },
      ogImage: { type: String },
      noindex: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'active',
      index: true,
    },
    rating: {
      average: { type: Number, default: 5.0 },
      count: { type: Number, default: 1 },
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 'text', brand: 'text', tags: 'text', 'notes.top': 'text', 'notes.heart': 'text', 'notes.base': 'text' });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
