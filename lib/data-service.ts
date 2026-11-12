import connectToDatabase from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import Category from '@/models/Category';
import { CuratedBundle, BundleTierConfig } from '@/models/Bundle';
import Coupon, { ICoupon } from '@/models/Coupon';
import CorporateQuote from '@/models/CorporateQuote';
import Order, { IOrder } from '@/models/Order';
import Review from '@/models/Review';
import MoodQuizConfig from '@/models/MoodQuiz';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CURATED_BUNDLES,
  INITIAL_TIER_RULES,
  INITIAL_QUIZ_CONFIG,
  INITIAL_COUPONS,
  ProductItem,
} from '@/lib/mock-data';

// In-memory runtime state for mutations when MongoDB is in fallback/local mode
let inMemoryProducts = [...INITIAL_PRODUCTS];
let inMemoryQuotes: any[] = [];
let inMemoryOrders: any[] = [
  {
    _id: 'ord_mock_001',
    orderNumber: 'ELY-98231',
    customerEmail: 'ambassador@mayfair.co.uk',
    items: [
      {
        name: 'Oud Impérial',
        slug: 'oud-imperial',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
        volume: 50,
        concentration: 'Parfum',
        price: 21000,
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Lord Julian Sterling',
      email: 'ambassador@mayfair.co.uk',
      phone: '+44 20 7946 0912',
      street: '14 Berkeley Square',
      city: 'London',
      postalCode: 'W1J 6BQ',
      country: 'United Kingdom',
    },
    subtotal: 21000,
    discountTotal: 0,
    shippingTotal: 0,
    taxTotal: 0,
    total: 21000,
    currency: 'GBP',
    status: 'shipped',
    paymentStatus: 'paid',
    trackingNumber: 'RM-774920192-GB',
    carrier: 'Royal Mail Special Delivery',
    createdAt: new Date('2026-11-09T14:20:00Z'),
  },
  {
    _id: 'ord_mock_002',
    orderNumber: 'ELY-98232',
    customerEmail: 'eleanor.vane@kensington.com',
    items: [
      {
        name: 'Rose Saphir',
        slug: 'rose-saphir',
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop',
        volume: 50,
        concentration: 'EDP',
        price: 18500,
        quantity: 1,
      },
      {
        name: 'Bergamote Céleste',
        slug: 'bergamote-celeste',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
        volume: 50,
        concentration: 'EDP',
        price: 16500,
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Lady Eleanor Vane',
      email: 'eleanor.vane@kensington.com',
      phone: '+44 20 7946 0884',
      street: '28 Kensington Palace Gardens',
      city: 'London',
      postalCode: 'W8 4QQ',
      country: 'United Kingdom',
    },
    subtotal: 35000,
    discountTotal: 3500,
    shippingTotal: 0,
    taxTotal: 0,
    total: 31500,
    currency: 'GBP',
    status: 'processing',
    paymentStatus: 'paid',
    trackingNumber: 'PENDING',
    carrier: 'Royal Mail Tracked 24',
    createdAt: new Date('2026-11-10T09:15:00Z'),
  },
];

let inMemoryReviews: any[] = [
  {
    _id: 'rev_1',
    productSlug: 'oud-imperial',
    userName: 'Lord Sterling',
    rating: 5,
    headline: 'Unparalleled depth and longevity',
    comment:
      'The smoky Cambodian oud in Oud Impérial is the finest distillation I have experienced outside of the Arabian Gulf. It develops with magnificent warmth throughout an entire evening.',
    verifiedPurchase: true,
    createdAt: new Date('2026-10-14'),
  },
  {
    _id: 'rev_2',
    productSlug: 'oud-imperial',
    userName: 'Camilla D.',
    rating: 5,
    headline: 'Pure elegance in a glass flacon',
    comment:
      'The transparent 50ml bottle feels substantial and weighted. The Bulgarian rose heart note cuts through the oud beautifully.',
    verifiedPurchase: true,
    createdAt: new Date('2026-10-28'),
  },
  {
    _id: 'rev_3',
    productSlug: 'rose-saphir',
    userName: 'Sophia Montgomery',
    rating: 5,
    headline: 'Ethereal morning rose',
    comment:
      'Unlike cloying commercial roses, Rose Saphir is crisp, dewy, and grounded by iris. Truly an haute parfumerie masterpiece.',
    verifiedPurchase: true,
    createdAt: new Date('2026-11-02'),
  },
];

// Product Services
export async function getProducts(filter?: {
  gender?: string;
  category?: string;
  mood?: string;
  notesFamily?: string;
  inStock?: boolean;
  search?: string;
  sort?: string;
  status?: string;
}) {
  const db = await connectToDatabase();
  if (db) {
    try {
      const query: any = {};
      if (filter?.status) {
        query.status = filter.status;
      } else {
        query.status = 'active';
      }

      if (filter?.gender && filter.gender !== 'all') {
        query.gender = filter.gender;
      }

      if (filter?.mood && filter.mood !== 'all') {
        query.moods = filter.mood;
      }

      if (filter?.inStock) {
        query.stock = { $gt: 0 };
      }

      if (filter?.search) {
        query.$text = { $search: filter.search };
      }

      let sortOptions: any = { createdAt: -1 };
      if (filter?.sort === 'price-asc') sortOptions = { price: 1 };
      if (filter?.sort === 'price-desc') sortOptions = { price: -1 };
      if (filter?.sort === 'rating') sortOptions = { 'rating.average': -1 };
      if (filter?.sort === 'featured') sortOptions = { stock: -1 };

      const products = await Product.find(query).sort(sortOptions).lean();
      if (products.length > 0) {
        return JSON.parse(JSON.stringify(products));
      }
    } catch (e) {
      console.warn('MongoDB query fallback to local products');
    }
  }

  // Fallback to in-memory/mock data with filtering
  let results = [...inMemoryProducts];

  if (filter?.status) {
    results = results.filter((p) => p.status === filter.status);
  } else {
    results = results.filter((p) => p.status === 'active');
  }

  if (filter?.gender && filter.gender !== 'all') {
    results = results.filter((p) => p.gender === filter.gender);
  }

  if (filter?.category && filter.category !== 'all') {
    results = results.filter((p) =>
      p.categories.some((c) => c.toLowerCase() === filter.category?.toLowerCase())
    );
  }

  if (filter?.mood && filter.mood !== 'all') {
    results = results.filter((p) =>
      p.moods.some((m) => m.toLowerCase() === filter.mood?.toLowerCase())
    );
  }

  if (filter?.inStock) {
    results = results.filter((p) => p.stock > 0);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.notes.top.some((n) => n.toLowerCase().includes(q)) ||
        p.notes.heart.some((n) => n.toLowerCase().includes(q)) ||
        p.notes.base.some((n) => n.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filter?.sort === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (filter?.sort === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (filter?.sort === 'rating') {
    results.sort((a, b) => b.rating.average - a.rating.average);
  } else if (filter?.sort === 'newest') {
    // preserve default array order
  }

  return results;
}

export async function getProductBySlug(slug: string) {
  const db = await connectToDatabase();
  if (db) {
    try {
      const product = await Product.findOne({ slug }).lean();
      if (product) return JSON.parse(JSON.stringify(product));
    } catch (e) {
      // fallback
    }
  }

  return inMemoryProducts.find((p) => p.slug === slug) || null;
}

export async function createProduct(productData: any) {
  const db = await connectToDatabase();
  if (db) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (e) {
      console.warn('Error creating product in DB, saving in memory', e);
    }
  }

  const newProd = {
    ...productData,
    _id: `prod_${Date.now()}`,
    rating: { average: 5.0, count: 1 },
  };
  inMemoryProducts.unshift(newProd);
  return newProd;
}

export async function updateProduct(id: string, updates: any) {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (updated) return updated;
    } catch (e) {
      // fallback
    }
  }

  const index = inMemoryProducts.findIndex((p) => p._id === id);
  if (index !== -1) {
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...updates };
    return inMemoryProducts[index];
  }
  return null;
}

// Curated Bundles & Tiers
export async function getCuratedBundles() {
  const db = await connectToDatabase();
  if (db) {
    try {
      const bundles = await CuratedBundle.find({ active: true }).lean();
      if (bundles.length > 0) return JSON.parse(JSON.stringify(bundles));
    } catch (e) {}
  }
  return INITIAL_CURATED_BUNDLES;
}

export async function getBundleTierConfig() {
  const db = await connectToDatabase();
  if (db) {
    try {
      const config = await BundleTierConfig.findOne({ active: true }).lean();
      if (config) return JSON.parse(JSON.stringify(config));
    } catch (e) {}
  }
  return { tiers: INITIAL_TIER_RULES, active: true };
}

// Mood Quiz
export async function getMoodQuizConfig() {
  const db = await connectToDatabase();
  if (db) {
    try {
      const config = await MoodQuizConfig.findOne({ active: true }).lean();
      if (config) return JSON.parse(JSON.stringify(config));
    } catch (e) {}
  }
  return INITIAL_QUIZ_CONFIG;
}

// Coupons
export async function validateCoupon(code: string, subtotal: number) {
  const cleanCode = code.trim().toUpperCase();
  const db = await connectToDatabase();
  let couponData: any = null;

  if (db) {
    try {
      couponData = await Coupon.findOne({ code: cleanCode, active: true }).lean();
    } catch (e) {}
  }

  if (!couponData) {
    couponData = INITIAL_COUPONS.find((c) => c.code === cleanCode && c.active);
  }

  if (!couponData) {
    return { valid: false, message: 'Invalid or expired privilege coupon.' };
  }

  if (couponData.minSpend && subtotal < couponData.minSpend) {
    return {
      valid: false,
      message: `Minimum spend requirement of £${(couponData.minSpend / 100).toFixed(2)} not met.`,
    };
  }

  let discountAmount = 0;
  if (couponData.discountType === 'percentage') {
    discountAmount = Math.round((subtotal * couponData.discountValue) / 100);
  } else if (couponData.discountType === 'fixed') {
    discountAmount = Math.min(couponData.discountValue, subtotal);
  } else if (couponData.discountType === 'free_shipping') {
    discountAmount = 0; // handled in shipping logic
  }

  return {
    valid: true,
    code: couponData.code,
    discountType: couponData.discountType,
    discountValue: couponData.discountValue,
    discountAmount,
    message: `Privilege code ${couponData.code} applied successfully.`,
  };
}

// Corporate Quotes
export async function createCorporateQuote(data: any) {
  const db = await connectToDatabase();
  if (db) {
    try {
      return await CorporateQuote.create(data);
    } catch (e) {}
  }
  const quote = { ...data, _id: `quote_${Date.now()}`, createdAt: new Date(), status: 'pending' };
  inMemoryQuotes.unshift(quote);
  return quote;
}

export async function getCorporateQuotes() {
  const db = await connectToDatabase();
  if (db) {
    try {
      const quotes = await CorporateQuote.find().sort({ createdAt: -1 }).lean();
      if (quotes.length > 0) return quotes;
    } catch (e) {}
  }
  return inMemoryQuotes;
}

// Orders
export async function createOrder(orderData: any) {
  const db = await connectToDatabase();
  if (db) {
    try {
      return await Order.create(orderData);
    } catch (e) {}
  }
  const newOrder = {
    ...orderData,
    _id: `ord_${Date.now()}`,
    createdAt: new Date(),
  };
  inMemoryOrders.unshift(newOrder);
  return newOrder;
}

export async function getOrders() {
  const db = await connectToDatabase();
  if (db) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      if (orders.length > 0) return orders;
    } catch (e) {}
  }
  return inMemoryOrders;
}

export async function getOrderById(idOrNumber: string) {
  const db = await connectToDatabase();
  if (db) {
    try {
      const order = await Order.findOne({
        $or: [{ orderNumber: idOrNumber }, { _id: idOrNumber }],
      }).lean();
      if (order) return order;
    } catch (e) {}
  }
  return (
    inMemoryOrders.find(
      (o) => o.orderNumber === idOrNumber || o._id === idOrNumber
    ) || null
  );
}

// Reviews
export async function getProductReviews(productSlug: string) {
  return inMemoryReviews.filter((r) => r.productSlug === productSlug);
}

export async function addProductReview(reviewData: any) {
  const newReview = {
    ...reviewData,
    _id: `rev_${Date.now()}`,
    createdAt: new Date(),
    status: 'approved',
  };
  inMemoryReviews.unshift(newReview);
  return newReview;
}
