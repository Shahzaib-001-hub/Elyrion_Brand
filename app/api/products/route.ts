import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/data-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const gender = searchParams.get('gender') || undefined;
    const category = searchParams.get('category') || undefined;
    const mood = searchParams.get('mood') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const status = searchParams.get('status') || undefined;
    const inStock = searchParams.get('inStock') === 'true';

    const products = await getProducts({
      search,
      gender,
      category,
      mood,
      sort,
      status,
      inStock,
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('API /api/products error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
