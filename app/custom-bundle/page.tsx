'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faPlus,
  faMinus,
  faCheck,
  faShoppingBag,
  faAward,
} from '@fortawesome/free-solid-svg-icons';
import { INITIAL_PRODUCTS, INITIAL_TIER_RULES, ProductItem } from '@/lib/mock-data';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function BuildYourOwnBundlePage() {
  const { addItem, setIsCartOpen } = useCart();
  const [selectedBottles, setSelectedBottles] = useState<Record<string, number>>({});

  const tierRules = INITIAL_TIER_RULES;
  const eligibleProducts = INITIAL_PRODUCTS.filter((p) => p.status === 'active');

  const addBottle = (id: string) => {
    setSelectedBottles((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeBottle = (id: string) => {
    setSelectedBottles((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const totalBottles = useMemo(
    () => Object.values(selectedBottles).reduce((sum, qty) => sum + qty, 0),
    [selectedBottles]
  );

  // Active discount tier
  const activeTier = useMemo(() => {
    const qualified = [...tierRules]
      .sort((a, b) => b.itemCount - a.itemCount)
      .find((t) => totalBottles >= t.itemCount);
    return qualified || null;
  }, [totalBottles, tierRules]);

  // Next discount tier
  const nextTier = useMemo(() => {
    const remaining = [...tierRules]
      .sort((a, b) => a.itemCount - b.itemCount)
      .find((t) => totalBottles < t.itemCount);
    return remaining || null;
  }, [totalBottles, tierRules]);

  // Calculations
  const rawSubtotal = useMemo(() => {
    return Object.entries(selectedBottles).reduce((sum, [id, qty]) => {
      const prod = eligibleProducts.find((p) => p._id === id);
      return sum + (prod ? prod.price * qty : 0);
    }, 0);
  }, [selectedBottles, eligibleProducts]);

  const discountAmount = useMemo(() => {
    if (!activeTier) return 0;
    return Math.round((rawSubtotal * activeTier.discountPercent) / 100);
  }, [rawSubtotal, activeTier]);

  const bundleTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleAddBundleToBag = () => {
    if (totalBottles < 3) return;

    // Add each selected bottle with discounted price and bundle tag
    Object.entries(selectedBottles).forEach(([id, qty]) => {
      const prod = eligibleProducts.find((p) => p._id === id);
      if (!prod) return;

      const unitDiscountedPrice = activeTier
        ? Math.round(prod.price * (1 - activeTier.discountPercent / 100))
        : prod.price;

      addItem(
        {
          id: `${prod._id}_bundle_${Date.now()}`,
          slug: prod.slug,
          name: prod.name,
          image: prod.images[0],
          price: unitDiscountedPrice,
          volume: 50,
          concentration: prod.concentration,
          bundleTag: activeTier ? activeTier.label : 'Custom Fragrance Wardrobe',
        },
        qty
      );
    });

    setIsCartOpen(true);
    setSelectedBottles({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-32">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[var(--border-gold)] bg-[var(--bg-surface)] text-[var(--accent-gold)] text-xs">
          <FontAwesomeIcon icon={faLayerGroup} className="w-3.5 h-3.5" />
          <span className="label-editorial text-[9px]">Custom Wardrobe Atelier</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-light">
          Build Your Own Bundle
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Curate an extraordinary personal collection of transparent 50ml flacons. Mix and match across all unisex, feminine, and masculine creations to unlock automated tier savings.
        </p>
      </div>

      {/* TIER UNLOCK PROGRESS BAR */}
      <div className="luxury-card p-6 sm:p-8 space-y-4 max-w-3xl mx-auto bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-raised)] to-[var(--bg-surface)]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-serif text-lg text-[var(--text-primary)]">
            {totalBottles} {totalBottles === 1 ? 'Flacon' : 'Flacons'} Selected
          </span>
          {nextTier ? (
            <span className="text-[var(--accent-gold)] font-medium">
              Add {nextTier.itemCount - totalBottles} more for {nextTier.discountPercent}% Savings!
            </span>
          ) : (
            <span className="text-[var(--accent-gold)] font-bold flex items-center gap-1.5">
              <FontAwesomeIcon icon={faAward} className="w-3.5 h-3.5" />
              Maximum 20% Imperial Privilege Unlocked!
            </span>
          )}
        </div>

        {/* Milestone Bar */}
        <div className="relative w-full bg-black/40 h-3 rounded-full overflow-hidden p-0.5 border border-[var(--border-subtle)]">
          <div
            className="h-full bg-[var(--accent-gold)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, (totalBottles / 7) * 100)}%` }}
          />
        </div>

        {/* Tier Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          {tierRules.map((tier) => {
            const isReached = totalBottles >= tier.itemCount;
            return (
              <div
                key={tier.itemCount}
                className={`p-2 rounded border transition-colors ${
                  isReached
                    ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-semibold'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider">{tier.itemCount} Bottles</div>
                <div className="text-sm font-serif font-medium">{tier.discountPercent}% Off</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRODUCT SELECTION GRID */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <h2 className="font-serif text-2xl font-light">Eligible 50ml Creations</h2>
          <span className="text-xs text-[var(--text-secondary)]">
            Select 3 or more to unlock savings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eligibleProducts.map((product) => {
            const count = selectedBottles[product._id] || 0;
            return (
              <div
                key={product._id}
                className={`luxury-card p-4 flex flex-col justify-between space-y-4 transition-all ${
                  count > 0 ? 'border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]/50' : ''
                }`}
              >
                <div className="relative aspect-square rounded overflow-hidden bg-neutral-950">
                  <Image
                    src={product.images[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-[var(--accent-gold)] border border-[var(--border-subtle)]">
                    {product.concentration}
                  </div>
                  {count > 0 && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--accent-gold)] text-black text-xs font-bold flex items-center justify-center">
                      {count}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-xl font-medium text-[var(--text-primary)]">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] truncate">
                    {product.notes.top[0]} • {product.notes.heart[0]} • {product.notes.base[0]}
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-[var(--text-primary)] mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Counter Selector */}
                <div className="pt-2">
                  {count === 0 ? (
                    <button
                      type="button"
                      onClick={() => addBottle(product._id)}
                      className="w-full py-2 border border-[var(--border-gold)] rounded text-xs uppercase tracking-wider text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-black transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                      Add to Wardrobe
                    </button>
                  ) : (
                    <div className="flex items-center justify-between border border-[var(--accent-gold)] rounded bg-[var(--bg-primary)] h-9 px-2">
                      <button
                        type="button"
                        onClick={() => removeBottle(product._id)}
                        className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-red-400"
                        aria-label="Decrease bottle count"
                      >
                        <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-bold tabular-nums text-[var(--accent-gold)]">
                        {count} in Bundle
                      </span>
                      <button
                        type="button"
                        onClick={() => addBottle(product._id)}
                        className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        aria-label="Increase bottle count"
                      >
                        <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STICKY BOTTOM SUMMARY DRAWER */}
      {totalBottles > 0 && (
        <aside
          aria-label="Custom Bundle Summary Bar"
          className="fixed bottom-0 left-0 right-0 z-40 navbar-glass border-t border-[var(--border-gold)] p-4 sm:p-6 shadow-2xl animate-fadeIn"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded border border-[var(--border-gold)] flex items-center justify-center text-[var(--accent-gold)] shrink-0 hidden sm:flex">
                <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-medium">
                    Custom Wardrobe ({totalBottles} Flacons)
                  </span>
                  {activeTier && (
                    <span className="text-[10px] uppercase tracking-wider text-black bg-[var(--accent-gold)] px-2 py-0.5 rounded font-bold">
                      {activeTier.discountPercent}% Savings Unlocked
                    </span>
                  )}
                </div>
                <div className="text-xs text-[var(--text-secondary)] flex items-center gap-3">
                  {discountAmount > 0 ? (
                    <>
                      <span className="line-through tabular-nums">{formatPrice(rawSubtotal)}</span>
                      <span className="text-[var(--accent-gold)] font-bold text-sm tabular-nums">
                        {formatPrice(bundleTotal)}
                      </span>
                      <span className="text-emerald-400">
                        (You save {formatPrice(discountAmount)})
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                      {formatPrice(rawSubtotal)} (Add {3 - totalBottles} more for 10% discount)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setSelectedBottles({})}
                className="text-xs text-[var(--text-secondary)] hover:text-red-400 underline px-2 py-2"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={totalBottles < 3}
                onClick={handleAddBundleToBag}
                className="btn-gold btn-shine flex-1 md:flex-initial"
              >
                <FontAwesomeIcon icon={faShoppingBag} className="mr-2 w-3.5 h-3.5" />
                {totalBottles < 3
                  ? `Select ${3 - totalBottles} More Bottles`
                  : `Add Bespoke Bundle to Bag (${formatPrice(bundleTotal)})`}
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
