'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faShoppingBag,
  faArrowRight,
  faStar,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { ProductItem } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface HeroShowcaseProps {
  products: ProductItem[];
}

export function HeroShowcase({ products }: HeroShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addItem, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!products || products.length === 0) return null;

  const currentProduct = products[selectedIndex];
  const prevIndex = (selectedIndex - 1 + products.length) % products.length;
  const nextIndex = (selectedIndex + 1) % products.length;

  const prevProduct = products[prevIndex];
  const nextProduct = products[nextIndex];

  const handleSelect = (index: number) => {
    if (index === selectedIndex) return;
    setIsAnimating(true);
    setSelectedIndex(index);
    setTimeout(() => setIsAnimating(false), 350);
  };

  const handlePrev = () => {
    handleSelect(prevIndex);
  };

  const handleNext = () => {
    handleSelect(nextIndex);
  };

  const handleQuickAdd = () => {
    addItem({
      id: currentProduct._id,
      slug: currentProduct.slug,
      name: currentProduct.name,
      image: currentProduct.images[0],
      price: currentProduct.price,
      volume: currentProduct.volume || 50,
      concentration: currentProduct.concentration || 'Parfum',
    });
    setIsCartOpen(true);
  };

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-[96vh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-surface)] to-[var(--bg-primary)] pt-6 pb-12 select-none">
      {/* 1. GIANT BOLD BACKGROUND WATERMARK: "ELYRION" */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-[58%] flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span
          className="font-sans font-black uppercase text-[17vw] tracking-[0.14em] text-[var(--text-primary)] opacity-[0.045] dark:opacity-[0.06] whitespace-nowrap leading-none select-none"
          style={{ letterSpacing: '0.12em' }}
        >
          ELYRION
        </span>
      </div>

      {/* Top Editorial Eyebrow & Navigation Chevrons */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-pulse" />
          <span className="label-editorial text-[10px] text-[var(--accent-gold)] tracking-[0.22em]">
            Signature 50ml Flacon Edition
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors flex items-center justify-center text-xs"
            aria-label="Previous fragrance"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
          </button>
          <span className="text-xs text-[var(--text-secondary)] font-mono tabular-nums px-1">
            0{selectedIndex + 1} / 0{products.length}
          </span>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors flex items-center justify-center text-xs"
            aria-label="Next fragrance"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. MAIN CENTER STAGE: CIRCLE PORTAL & 3D BOTTLE LAYERING */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 my-auto w-full max-w-6xl mx-auto px-4">
        <div className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
          {/* THE CIRCULAR PORTAL RING (Matching the user's reference image) */}
          <div className="absolute w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] rounded-full border-[8px] sm:border-[14px] border-white/90 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(201,169,110,0.2)] bg-gradient-to-b from-white/10 via-transparent to-black/30 dark:from-white/5 pointer-events-none flex items-center justify-center">
            {/* Subtle inner gold accent hairline */}
            <div className="w-[94%] h-[94%] rounded-full border border-[rgba(201,169,110,0.35)]" />
          </div>

          {/* LEFT FLANKING BOTTLE (Previous product in background) */}
          <div
            onClick={handlePrev}
            className="absolute left-2 sm:left-10 md:left-14 top-1/2 -translate-y-1/2 w-28 sm:w-44 md:w-52 aspect-[3/4] opacity-40 hover:opacity-75 transition-all duration-500 cursor-pointer scale-75 sm:scale-85 z-10 flex flex-col items-center group"
            title={`View ${prevProduct.name}`}
          >
            <div className="relative w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
              <Image
                src={prevProduct.images[0]}
                alt={prevProduct.name}
                fill
                className="object-contain filter brightness-90 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              {prevProduct.name}
            </span>
          </div>

          {/* CENTER HERO BOTTLE (Active product in full focus) */}
          <div
            className={`relative w-48 sm:w-64 md:w-80 lg:w-96 aspect-[3/4] z-20 flex items-center justify-center transition-all duration-500 ease-out ${
              isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
            }`}
          >
            <div className="relative w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)] group">
              <Image
                src={currentProduct.images[0]}
                alt={currentProduct.name}
                fill
                priority
                className="object-contain filter brightness-105 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Soft floor shadow */}
              <div className="absolute -bottom-4 inset-x-12 h-6 bg-radial from-black/80 via-black/30 to-transparent blur-md rounded-full pointer-events-none" />
            </div>
          </div>

          {/* RIGHT FLANKING BOTTLE (Next product in background) */}
          <div
            onClick={handleNext}
            className="absolute right-2 sm:right-10 md:right-14 top-1/2 -translate-y-1/2 w-28 sm:w-44 md:w-52 aspect-[3/4] opacity-40 hover:opacity-75 transition-all duration-500 cursor-pointer scale-75 sm:scale-85 z-10 flex flex-col items-center group"
            title={`View ${nextProduct.name}`}
          >
            <div className="relative w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
              <Image
                src={nextProduct.images[0]}
                alt={nextProduct.name}
                fill
                className="object-contain filter brightness-90 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              {nextProduct.name}
            </span>
          </div>
        </div>

        {/* 3. PRODUCT METADATA (Name, Price & Quick Actions underneath the ring) */}
        <div className="text-center space-y-3 mt-4 z-20">
          <div className="space-y-1">
            <span className="label-editorial text-[10px] text-[var(--accent-gold)] tracking-[0.2em]">
              {currentProduct.concentration} • 50ML TRANSPARENT FLACON
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-[var(--text-primary)] uppercase">
              {currentProduct.name}
            </h2>
          </div>

          {/* Price & Rating in Bold Color */}
          <div className="flex items-center justify-center gap-3">
            <span className="font-sans font-bold text-xl sm:text-2xl text-[var(--accent-gold)] tabular-nums tracking-wide">
              {formatPrice(currentProduct.price)}
            </span>
            {currentProduct.compareAtPrice && currentProduct.compareAtPrice > currentProduct.price && (
              <span className="text-xs text-[var(--text-secondary)] line-through tabular-nums">
                {formatPrice(currentProduct.compareAtPrice)}
              </span>
            )}
            <div className="flex items-center gap-1 text-[11px] text-[var(--accent-gold)] pl-2 border-l border-[var(--border-subtle)]">
              <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-[var(--accent-gold)]" />
              <span className="tabular-nums font-semibold">
                {currentProduct.rating?.average.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Key Olfactory Accords */}
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto truncate px-4">
            Notes: {currentProduct.notes.top[0]} • {currentProduct.notes.heart[0]} • {currentProduct.notes.base[0]}
          </p>

          {/* Action CTAs */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleQuickAdd}
              className="btn-gold btn-shine px-6 py-2.5 text-xs font-bold"
            >
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2 w-3.5 h-3.5" />
              Add To Bag
            </button>
            <Link
              href={`/fragrances/${currentProduct.slug}`}
              className="btn-outline-gold px-5 py-2.5 text-xs"
            >
              Inspect Scent
              <FontAwesomeIcon icon={faArrowRight} className="ml-1.5 w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. HORIZONTAL PRODUCT THUMBNAIL SELECTOR STRIP (Matching the reference layout) */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 w-full pt-6">
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto py-2 no-scrollbar">
          {products.map((product, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={product._id}
                onClick={() => handleSelect(idx)}
                className={`group relative flex flex-col items-center transition-all duration-300 p-1.5 rounded-md ${
                  isSelected
                    ? 'scale-115 -translate-y-1'
                    : 'opacity-50 hover:opacity-90 hover:scale-105'
                }`}
                aria-label={`Select ${product.name}`}
              >
                {/* Mini Flacon Thumbnail */}
                <div
                  className={`relative w-12 h-14 sm:w-16 sm:h-18 rounded border transition-all ${
                    isSelected
                      ? 'border-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]/40 bg-[var(--bg-raised)] shadow-lg'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                  }`}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                {/* Active Indicator dot */}
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] mt-1.5 animate-fadeIn" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
