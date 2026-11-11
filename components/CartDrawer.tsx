'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrashAlt, faPlus, faMinus, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discountTotal,
    shippingTotal,
    finalTotal,
    freeShippingThreshold,
    freeShippingProgress,
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="cart-drawer-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-gold)] text-[var(--text-primary)] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <h2 id="cart-drawer-title" className="font-serif text-2xl font-medium tracking-wide">
                Your Fragrance Bag
              </h2>
              <span className="text-xs uppercase tracking-wider text-[var(--accent-gold)]">
                {items.length} {items.length === 1 ? 'Creation' : 'Creations'} Selected
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close cart"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="px-6 py-3 bg-[var(--bg-raised)] border-b border-[var(--border-subtle)] text-xs">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-medium text-[var(--text-secondary)]">
                {remainingForFreeShipping > 0
                  ? `Add ${formatPrice(remainingForFreeShipping)} for Complimentary Tracked Delivery`
                  : '✓ Qualified for Complimentary UK Express Delivery'}
              </span>
              <span className="tabular-nums text-[var(--accent-gold)] font-semibold">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-gold)] transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[var(--border-subtle)] space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full border border-[var(--border-gold)] flex items-center justify-center mb-4 text-[var(--accent-gold)] opacity-70">
                  <span className="font-serif text-2xl italic">E</span>
                </div>
                <p className="font-serif text-xl mb-2">Your Bag is Empty</p>
                <p className="text-xs text-[var(--text-secondary)] max-w-xs mb-6">
                  Explore our collection of transparent glass flacons and rare botanical extracts.
                </p>
                <Link
                  href="/fragrances"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-gold"
                >
                  Explore Fragrances
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  <div className="relative w-20 h-24 bg-neutral-900 rounded border border-[var(--border-subtle)] overflow-hidden shrink-0">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=300'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/fragrances/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-lg font-medium hover:text-[var(--accent-gold)] transition-colors leading-snug"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[var(--text-secondary)] hover:text-red-400 p-1 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {item.volume}ml Flacon • {item.concentration}
                      </div>
                      {item.bundleTag && (
                        <span className="inline-block mt-1 text-[10px] tracking-wider uppercase text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-1.5 py-0.5 rounded border border-[var(--border-gold)]">
                          {item.bundleTag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[var(--border-subtle)] rounded bg-[var(--bg-primary)]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          aria-label="Decrease quantity"
                        >
                          <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          aria-label="Increase quantity"
                        >
                          <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold tabular-nums text-[var(--accent-gold)]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-[var(--bg-raised)] border-t border-[var(--border-subtle)] space-y-4">
              <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-[var(--text-primary)] font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-[var(--accent-gold)]">
                    <span>Privilege Savings</span>
                    <span className="tabular-nums font-medium">-{formatPrice(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tracked UK Shipping</span>
                  <span className="tabular-nums text-[var(--text-primary)]">
                    {shippingTotal === 0 ? 'Complimentary' : formatPrice(shippingTotal)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between text-base font-semibold text-[var(--text-primary)]">
                  <span className="font-serif">Estimated Total</span>
                  <span className="tabular-nums text-[var(--accent-gold)]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-gold w-full btn-shine"
                >
                  <FontAwesomeIcon icon={faLock} className="mr-2 w-3.5 h-3.5" />
                  Secure Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-outline-gold w-full text-center"
                >
                  Review Bag & Privilege Codes
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3" />
                </Link>
              </div>

              <p className="text-[10px] text-center text-[var(--text-secondary)] uppercase tracking-widest">
                Hand-poured in London • Compliant with IFRA Standards
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
