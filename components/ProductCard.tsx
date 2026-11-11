'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faShoppingBag, faStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductItem } from '@/lib/mock-data';

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.slug);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600',
      price: product.price,
      volume: product.volume || 50,
      concentration: product.concentration || 'EDP',
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.slug);
  };

  return (
    <div className="group luxury-card relative flex flex-col overflow-hidden bg-[var(--bg-surface)]">
      {/* Top badges & Wishlist button */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="label-editorial text-[9px] bg-[var(--bg-primary)]/80 backdrop-blur-md text-[var(--accent-gold)] border border-[var(--border-gold)] px-2 py-0.5 rounded">
            {product.concentration}
          </span>
          {product.moods?.[0] && (
            <span className="label-editorial text-[9px] bg-black/40 backdrop-blur-md text-[var(--text-secondary)] border border-[var(--border-subtle)] px-2 py-0.5 rounded hidden sm:inline-block">
              {product.moods[0]}
            </span>
          )}
        </div>
        <button
          onClick={handleToggleWishlist}
          className="pointer-events-auto w-8 h-8 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-red-400 hover:border-red-400/40 transition-colors"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FontAwesomeIcon
            icon={isFavorited ? faHeartSolid : faHeartRegular}
            className={`w-3.5 h-3.5 ${isFavorited ? 'text-red-500' : ''}`}
          />
        </button>
      </div>

      {/* Image Container with Studio Background & Hover Lift */}
      <Link href={`/fragrances/${product.slug}`} className="block relative aspect-[4/5] bg-neutral-950 overflow-hidden">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800'}
          alt={`${product.name} 50ml transparent flacon`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Subtle vignette shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-[var(--accent-gold)] text-[10px]">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="w-2.5 h-2.5" />
              ))}
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] tabular-nums">
              {product.rating?.average.toFixed(1)} ({product.rating?.count})
            </span>
          </div>

          {/* Title */}
          <Link href={`/fragrances/${product.slug}`} className="block">
            <h3 className="font-serif text-xl font-medium tracking-wide text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Volume & Origin */}
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            {product.volume}ml Flacon • Hand-poured in London
          </p>

          {/* Fragrance Notes Preview */}
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[var(--accent-gold)] font-medium">Notes:</span>
              <span className="truncate text-[11px]">
                {product.notes?.top?.[0]}, {product.notes?.heart?.[0]}, {product.notes?.base?.[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold tabular-nums text-[var(--text-primary)]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-[var(--text-secondary)] line-through tabular-nums">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            className="w-9 h-9 rounded bg-[var(--bg-raised)] border border-[var(--border-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-black transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
            aria-label={`Add ${product.name} to bag`}
            title="Quick add to bag"
          >
            <FontAwesomeIcon icon={faShoppingBag} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
