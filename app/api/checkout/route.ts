import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrder, validateCoupon } from '@/lib/data-service';
import { getCurrentUser } from '@/lib/auth';

const OrderItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  volume: z.number().default(50),
  concentration: z.string().default('EDP'),
  price: z.number().min(0),
  quantity: z.number().min(1),
  bundleTag: z.string().optional(),
});

const CheckoutSchema = z.object({
  customerEmail: z.string().email(),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    street: z.string().min(3),
    apartment: z.string().optional(),
    city: z.string().min(2),
    state: z.string().optional(),
    postalCode: z.string().min(3),
    country: z.string().default('United Kingdom'),
  }),
  items: z.array(OrderItemSchema).min(1, 'Cart cannot be empty'),
  couponCode: z.string().optional(),
  shippingMethod: z.string().default('Complimentary Royal Mail Tracked 24'),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = CheckoutSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const { customerEmail, shippingAddress, items, couponCode, shippingMethod } = parsed.data;

    // Calculate subtotal server-side
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Validate coupon server-side
    let discountTotal = 0;
    if (couponCode) {
      const couponValidation = await validateCoupon(couponCode, subtotal);
      if (couponValidation.valid && couponValidation.discountAmount) {
        discountTotal = couponValidation.discountAmount;
      }
    }

    // Shipping rules
    const FREE_THRESHOLD = 15000; // £150
    const shippingTotal = subtotal >= FREE_THRESHOLD ? 0 : 1000;
    const finalTotal = Math.max(0, subtotal - discountTotal + shippingTotal);

    // Current user if logged in
    const user = await getCurrentUser();

    // Generate bespoke order number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ELY-${randomSuffix}`;

    const orderData = {
      orderNumber,
      user: user?.userId,
      customerEmail: customerEmail.toLowerCase(),
      items: items.map((i) => ({
        name: i.name,
        slug: i.slug,
        image: i.image,
        volume: i.volume,
        concentration: i.concentration,
        price: i.price,
        quantity: i.quantity,
        bundleTag: i.bundleTag,
      })),
      shippingAddress,
      shippingMethod,
      subtotal,
      discountTotal,
      shippingTotal,
      taxTotal: Math.round(subtotal * 0.2), // 20% UK VAT included
      total: finalTotal,
      currency: 'GBP',
      appliedCoupon: couponCode,
      status: 'processing',
      paymentStatus: 'paid', // Demo or Stripe completed
      trackingNumber: `RM-${Math.floor(100000000 + Math.random() * 900000000)}-GB`,
      carrier: 'Royal Mail UK Tracked 24',
    };

    const createdOrder = await createOrder(orderData);

    return NextResponse.json({
      success: true,
      order: createdOrder,
      orderNumber,
      message: 'Order placed successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
