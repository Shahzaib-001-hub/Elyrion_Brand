import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event: Stripe.Event;

    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
      }
    } else {
      // In dev or sandbox test
      event = JSON.parse(rawBody);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderNumber = paymentIntent.metadata?.orderNumber;

      if (orderNumber) {
        const db = await connectToDatabase();
        if (db) {
          await Order.findOneAndUpdate(
            { orderNumber },
            {
              paymentStatus: 'paid',
              status: 'processing',
              stripePaymentIntentId: paymentIntent.id,
            }
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
