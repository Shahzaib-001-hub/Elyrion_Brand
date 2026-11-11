import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductReviews, getProducts } from '@/lib/data-service';
import { ProductDetailClient } from '@/components/ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Fragrance Not Found',
    };
  }

  return {
    title: `${product.name} ${product.concentration} 50ml`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Elyrion Fragrances`,
      description: product.description.slice(0, 160),
      images: [product.images[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539'],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [reviews, allProducts] = await Promise.all([
    getProductReviews(slug),
    getProducts({ status: 'active' }),
  ]);

  const relatedProducts = allProducts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <ProductDetailClient
      product={product as any}
      reviews={reviews}
      relatedProducts={relatedProducts as any}
    />
  );
}
