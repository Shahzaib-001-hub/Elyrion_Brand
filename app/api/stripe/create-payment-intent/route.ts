import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'gbp', metadata = {} } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than zero' }, { status: 400 });
    }

    // If real Stripe key is provided
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        metadata,
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      });
    }

    // Dev/Sandbox simulation when live secret key is not set
    return NextResponse.json({
      clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      id: `pi_mock_${Date.now()}`,
      demoMode: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
