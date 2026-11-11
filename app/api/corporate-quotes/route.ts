import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCorporateQuote } from '@/lib/data-service';

const CorporateQuoteSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Please enter a valid corporate email'),
  phone: z.string().min(6, 'Valid phone number is required'),
  quantity: z.number().min(10, 'Minimum corporate order is 10 units'),
  budget: z.string().min(1, 'Please select your budget tier'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  customMessage: z.string().optional(),
  logoPublicId: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = CorporateQuoteSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const quote = await createCorporateQuote({
      ...parsed.data,
      deliveryDate: new Date(parsed.data.deliveryDate),
    });

    return NextResponse.json({
      success: true,
      quote,
      message: 'Your bespoke corporate gifting dossier has been submitted to the Elyrion Concierge.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
