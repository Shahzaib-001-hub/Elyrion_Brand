'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faShoppingBag,
  faCheck,
  faArrowRight,
  faBoxOpen,
} from '@fortawesome/free-solid-svg-icons';
import { INITIAL_CURATED_BUNDLES, INITIAL_PRODUCTS } from '@/lib/mock-data';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function CuratedBundlesPage() {
  const { addItem, setIsCartOpen } = useCart();
  const bundles = INITIAL_CURATED_BUNDLES;

  const handleAddCuratedBundle = (bundle: (typeof bundles)[0]) => {
    addItem({
      id: `curated_bundle_${bundle.slug}`,
      slug: bundle.slug,
      name: bundle.title,
      image: bundle.image,
      price: bundle.price,
      volume: 150, // 3x50ml or total
      concentration: 'Extrait / EDP Coffret',
      bundleTag: bundle.badge,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[var(--border-gold)] bg-[var(--bg-surface)] text-[var(--accent-gold)] text-xs">
          <FontAwesomeIcon icon={faBoxOpen} className="w-3.5 h-3.5" />
          <span className="label-editorial text-[9px]">Private Coffret Editions</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-light">
          Curated Discovery Sets
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Masterfully sequenced trilogies and duos hand-assembled into black linen coffrets with silk pull ribbons. Perfect for collectors and connoisseurs.
        </p>
      </div>

      {/* Curated Bundles Grid */}
      <div className="space-y-12">
        {bundles.map((bundle) => {
          const includedProducts = INITIAL_PRODUCTS.filter((p) =>
            bundle.productIds.includes(p._id)
          );

          return (
            <div
              key={bundle.slug}
              className="luxury-card p-8 sm:p-12 overflow-hidden relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-raised)] to-[var(--bg-surface)] shadow-2xl"
            >
              {/* Image Column */}
              <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-square rounded border border-[var(--border-gold)] overflow-hidden bg-neutral-950">
                <Image
                  src={bundle.image}
                  alt={bundle.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[var(--bg-primary)]/90 backdrop-blur-md px-3 py-1 rounded text-xs text-[var(--accent-gold)] border border-[var(--border-gold)] font-semibold">
                  {bundle.badge}
                </div>
              </div>

              {/* Information Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="label-editorial text-[10px] text-[var(--accent-gold)]">
                    {bundle.tagline}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] mt-1">
                    {bundle.title}
                  </h2>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-2xl font-serif font-medium tabular-nums text-[var(--text-primary)]">
                      {formatPrice(bundle.price)}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)] line-through tabular-nums">
                      {formatPrice(bundle.compareAtPrice)}
                    </span>
                    <span className="text-xs text-[var(--accent-gold)] font-medium">
                      (Complimentary White-Glove Presentation Box)
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {bundle.description}
                </p>

                {/* Included Flacons List */}
                <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                  <span className="label-editorial text-[9px] text-[var(--text-secondary)]">
                    Included 50ml Creations:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {includedProducts.map((p) => (
                      <div
                        key={p._id}
                        className="p-3 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs space-y-1"
                      >
                        <span className="font-serif font-medium text-[var(--text-primary)] block">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-[var(--accent-gold)] block">
                          50ml • {p.concentration}
                        </span>
                        <p className="text-[10px] text-[var(--text-secondary)] truncate">
                          {p.notes.top[0]} & {p.notes.base[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => handleAddCuratedBundle(bundle)}
                    className="btn-gold btn-shine flex-1"
                  >
                    <FontAwesomeIcon icon={faShoppingBag} className="mr-2 w-3.5 h-3.5" />
                    Acquire The Curated Set
                  </button>
                  <Link href="/custom-bundle" className="btn-outline-gold text-center">
                    Customize Your Own Flacons
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Bundle Cross Link */}
      <div className="luxury-card p-8 sm:p-10 text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="font-serif text-2xl font-light">Prefer to Handpick Every Flacon?</h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Explore our Custom Wardrobe Atelier where you can select any 3, 5, or 7 fragrances and receive up to 20% privilege discounts.
        </p>
        <Link href="/custom-bundle" className="btn-gold">
          Launch Custom Bundle Builder
          <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
