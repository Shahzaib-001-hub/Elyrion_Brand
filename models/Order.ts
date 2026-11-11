import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IOrderItem {
  productId?: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image: string;
  volume: number;
  concentration: string;
  price: number; // minor units
  quantity: number;
  bundleTag?: string; // e.g. "Bespoke Trio Tier (10% Off)"
}

export interface IOrderAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  customerEmail: string;
  items: IOrderItem[];
  shippingAddress: IOrderAddress;
  shippingMethod: string;
  subtotal: number; // minor units
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  currency: string;
  appliedCoupon?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, required: true },
  volume: { type: Number, default: 50 },
  concentration: { type: String, default: 'EDP' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  bundleTag: { type: String },
});

const OrderAddressSchema = new Schema<IOrderAddress>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'United Kingdom' },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customerEmail: { type: String, required: true, lowercase: true },
    items: [OrderItemSchema],
    shippingAddress: OrderAddressSchema,
    shippingMethod: { type: String, default: 'Complimentary Royal Mail Tracked 24' },
    subtotal: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    shippingTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'GBP' },
    appliedCoupon: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
    },
    stripePaymentIntentId: { type: String },
    stripeSessionId: { type: String },
    trackingNumber: { type: String },
    carrier: { type: String, default: 'Royal Mail UK' },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
