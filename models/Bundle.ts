import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICuratedBundle extends Document {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  products: mongoose.Types.ObjectId[];
  price: number; // minor units
  compareAtPrice: number;
  badge: string; // e.g. "Save 25%" or "Limited Edition"
  image: string;
  stock: number;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CuratedBundleSchema = new Schema<ICuratedBundle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tagline: { type: String, default: 'Curated Haute Parfumerie Trio' },
    description: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, required: true },
    badge: { type: String, default: 'Complimentary Flacon Included' },
    image: { type: String, required: true },
    stock: { type: Number, default: 25 },
    featured: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CuratedBundle: Model<ICuratedBundle> =
  mongoose.models.CuratedBundle ||
  mongoose.model<ICuratedBundle>('CuratedBundle', CuratedBundleSchema);

// Build Your Own Bundle Tier Configuration Model
export interface IBundleTierConfig extends Document {
  tiers: {
    itemCount: number; // e.g. 3, 5, 7
    discountPercent: number; // e.g. 10, 15, 20
    label: string; // e.g. "Connoisseur's Trio (10% Off)"
  }[];
  active: boolean;
}

const BundleTierConfigSchema = new Schema<IBundleTierConfig>(
  {
    tiers: [
      {
        itemCount: { type: Number, required: true },
        discountPercent: { type: Number, required: true },
        label: { type: String, required: true },
      },
    ],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BundleTierConfig: Model<IBundleTierConfig> =
  mongoose.models.BundleTierConfig ||
  mongoose.model<IBundleTierConfig>('BundleTierConfig', BundleTierConfigSchema);
