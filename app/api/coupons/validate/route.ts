import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateCoupon } from '@/lib/data-service';

const CouponRequestSchema = z.object({
  code: z.string().min(1, 'Coupon code cannot be empty'),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = CouponRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, message: parsed.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      );
    }

    const { code, subtotal } = parsed.data;
    const result = await validateCoupon(code, subtotal);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ valid: false, message: error.message }, { status: 500 });
  }
}
