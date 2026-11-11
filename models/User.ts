import mongoose, { Schema, Model, Document } from 'mongoose';
import { UserRole } from '@/lib/auth';

export interface ISavedAddress {
  _id?: string;
  label?: string; // e.g. "Home", "Mayfair Residence"
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  wishlist: mongoose.Types.ObjectId[];
  addresses: ISavedAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<ISavedAddress>({
  label: { type: String, default: 'Primary Residence' },
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'United Kingdom' },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'manager', 'support', 'content', 'customer'],
      default: 'customer',
    },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
