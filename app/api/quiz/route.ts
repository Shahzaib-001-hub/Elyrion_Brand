import { NextRequest, NextResponse } from 'next/server';
import { getMoodQuizConfig, getProducts } from '@/lib/data-service';

export async function GET() {
  try {
    const config = await getMoodQuizConfig();
    return NextResponse.json({ config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { occasionId, moodId, seasonId } = body;

    const config = await getMoodQuizConfig();
    const products = await getProducts({ status: 'active' });

    // Collect target moods and notes from quiz config
    const targetMoods: string[] = [];
    const targetNotes: string[] = [];

    const selectedIds = [occasionId, moodId, seasonId];

    config.steps.forEach((step) => {
      step.options.forEach((opt) => {
        if (selectedIds.includes(opt.id)) {
          if (opt.associatedMoods) targetMoods.push(...opt.associatedMoods);
          if (opt.associatedNotes) targetNotes.push(...opt.associatedNotes);
        }
      });
    });

    // Score products
    const rankedProducts = products.map((product) => {
      let score = 20; // baseline compatibility

      // Check moods
      product.moods?.forEach((m) => {
        if (targetMoods.includes(m)) {
          score += 25;
        }
      });

      // Check notes
      const allProductNotes = [
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base,
      ];

      allProductNotes.forEach((n) => {
        if (
          targetNotes.some(
            (tn) =>
              n.toLowerCase().includes(tn.toLowerCase()) ||
              tn.toLowerCase().includes(n.toLowerCase())
          )
        ) {
          score += 15;
        }
      });

      const matchPercentage = Math.min(99, Math.max(65, score));

      return {
        ...product,
        matchScore: score,
        matchPercentage,
        matchingMoods: product.moods?.filter((m) => targetMoods.includes(m)) || [],
      };
    });

    rankedProducts.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      rankedProducts: rankedProducts.slice(0, 4),
      topMatch: rankedProducts[0],
      targetMoods: Array.from(new Set(targetMoods)),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
