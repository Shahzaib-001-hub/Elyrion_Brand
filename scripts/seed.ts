import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from '../models/Product';
import Category from '../models/Category';
import { CuratedBundle, BundleTierConfig } from '../models/Bundle';
import Coupon from '../models/Coupon';
import MoodQuizConfig from '../models/MoodQuiz';
import User from '../models/User';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CURATED_BUNDLES,
  INITIAL_TIER_RULES,
  INITIAL_QUIZ_CONFIG,
  INITIAL_COUPONS,
} from '../lib/mock-data';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elyrion_fragrances';

async function seedDatabase() {
  console.log('🌿 Connecting to MongoDB for Elyrion Fragrances seeding...');

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 5,
    });
    console.log('✓ Connected to MongoDB');

    // 1. Seed Categories
    console.log('→ Seeding categories and curated collections...');
    await Category.deleteMany({});
    const insertedCategories = await Category.insertMany(INITIAL_CATEGORIES);
    console.log(`✓ Seeded ${insertedCategories.length} categories.`);

    const categoryMap = new Map();
    insertedCategories.forEach((cat) => {
      categoryMap.set(cat.slug.toLowerCase(), cat._id);
      categoryMap.set(cat.name.toLowerCase(), cat._id);
    });

    // 2. Seed Products
    console.log('→ Seeding 50ml transparent flacon creations...');
    await Product.deleteMany({});
    const productsToInsert = INITIAL_PRODUCTS.map((p) => {
      const { _id, categories, ...rest } = p;
      const catIds = categories
        .map((c) => categoryMap.get(c.toLowerCase()) || categoryMap.get(c.toLowerCase().replace(/\s+/g, '-')))
        .filter(Boolean);
      return {
        ...rest,
        categories: catIds,
      };
    });
    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`✓ Seeded ${insertedProducts.length} fragrances.`);

    // 3. Seed Bundles & Tiers
    console.log('→ Seeding curated discovery sets & tier rules...');
    await CuratedBundle.deleteMany({});
    
    // Map bundle product IDs to newly inserted product IDs
    const bundleProductMap: Record<string, any> = {};
    insertedProducts.forEach((p, idx) => {
      const orig = INITIAL_PRODUCTS[idx];
      if (orig) bundleProductMap[orig._id] = p._id;
    });

    const bundlesToInsert = INITIAL_CURATED_BUNDLES.map((b) => ({
      ...b,
      products: b.productIds.map((pid) => bundleProductMap[pid] || insertedProducts[0]._id),
    }));

    await CuratedBundle.insertMany(bundlesToInsert);

    await BundleTierConfig.deleteMany({});
    await BundleTierConfig.create({
      tiers: INITIAL_TIER_RULES,
      active: true,
    });
    console.log('✓ Seeded curated discovery sets and 3/5/7 custom tier rules.');

    // 4. Seed Mood Quiz
    console.log('→ Seeding 3-step Create Your Mood diagnostic...');
    await MoodQuizConfig.deleteMany({});
    await MoodQuizConfig.create(INITIAL_QUIZ_CONFIG);
    console.log('✓ Seeded mood quiz configurations.');

    // 5. Seed Coupons
    console.log('→ Seeding privilege codes...');
    await Coupon.deleteMany({});
    await Coupon.insertMany(INITIAL_COUPONS);
    console.log('✓ Seeded promotional coupons.');

    // 6. Seed Super Admin User
    console.log('→ Seeding master super admin concierge...');
    await User.deleteMany({ role: 'super_admin' });
    const adminPassword = process.env.ADMIN_PASSWORD || 'ElyrionLuxury2026!';
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await User.create({
      name: 'Elyrion Master Concierge',
      email: process.env.ADMIN_EMAIL || 'concierge@elyrion.com',
      passwordHash,
      role: 'super_admin',
      addresses: [
        {
          label: 'Mayfair Atelier',
          fullName: 'Elyrion Master Concierge',
          street: '14 Berkeley Square',
          city: 'London',
          postalCode: 'W1J 6BQ',
          country: 'United Kingdom',
          isDefault: true,
        },
      ],
      wishlist: [],
    });
    console.log('✓ Master Concierge super_admin created: concierge@elyrion.com');

    console.log('✨ Elyrion Fragrances database seed completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
}

seedDatabase();
