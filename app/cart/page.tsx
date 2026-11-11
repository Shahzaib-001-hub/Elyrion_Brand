'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faTrashAlt,
  faPlus,
  faMinus,
  faArrowRight,
  faLock,
  faTicket,
  faCheck,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discountTotal,
    shippingTotal,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    freeShippingThreshold,
    freeShippingProgress,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim(),
          subtotal,
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        applyCoupon({
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          discountAmount: data.discountAmount,
        });
        setCouponSuccess(data.message || 'Privilege code applied.');
        setCouponInput('');
      } else {
        setCouponError(data.message || 'Invalid or expired privilege coupon.');
      }
    } catch (err) {
      setCouponError('Error validating coupon. Please try again.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full border border-[var(--border-gold)] mx-auto flex items-center justify-center text-[var(--accent-gold)]">
          <FontAwesomeIcon icon={faShoppingBag} className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light">Your Fragrance Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Explore our collection of transparent glass flacons, handcrafted with pure botanical extracts in Mayfair, London.
        </p>
        <div>
          <Link href="/fragrances" className="btn-gold btn-shine">
            Discover The Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <span className="label-editorial text-[var(--accent-gold)]">Private Selection</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light mt-1">
          Your Fragrance Bag ({items.length} {items.length === 1 ? 'Creation' : 'Creations'})
        </h1>
      </div>

      {/* Free Shipping Progress Ribbon */}
      <div className="luxury-card p-4 space-y-2">
        <div className="flex justify-between text-xs text-[var(--text-secondary)]">
          <span>
            {remainingForFreeShipping > 0
              ? `Add ${formatPrice(remainingForFreeShipping)} more to qualify for complimentary tracked express delivery`
              : '✓ Your order qualifies for complimentary Royal Mail Tracked 24 Delivery'}
          </span>
          <span className="text-[var(--accent-gold)] font-semibold">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-[var(--bg-primary)] h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-gold)] transition-all duration-300"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* 2-Column Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table */}
        <div className="lg:col-span-8 luxury-card p-6 divide-y divide-[var(--border-subtle)] space-y-6">
          {items.map((item) => (
            <div key={item.id} className="pt-6 first:pt-0 flex flex-col sm:flex-row gap-5 items-start">
              <div className="relative w-24 h-28 rounded border border-[var(--border-subtle)] overflow-hidden bg-neutral-950 shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between w-full h-full space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/fragrances/${item.slug}`}
                      className="font-serif text-xl font-medium hover:text-[var(--accent-gold)] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {item.volume}ml Flacon • {item.concentration}
                    </p>
                    {item.bundleTag && (
                      <span className="inline-block mt-1 text-[10px] text-[var(--accent-gold)] border border-[var(--border-gold)] px-2 py-0.5 rounded">
                        {item.bundleTag}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[var(--text-secondary)] hover:text-red-400 p-1"
                    aria-label={`Remove ${item.name}`}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center border border-[var(--border-subtle)] rounded bg-[var(--bg-primary)]">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <span className="text-base font-semibold tabular-nums text-[var(--accent-gold)]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary and Privilege Voucher */}
        <div className="lg:col-span-4 space-y-6">
          <div className="luxury-card p-6 space-y-6">
            <h3 className="font-serif text-xl font-medium border-b border-[var(--border-subtle)] pb-3">
              Order Summary
            </h3>

            {/* Privilege Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
                Privilege Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. ELYRION10"
                  className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] px-3 py-2 text-xs uppercase tracking-wider rounded text-[var(--text-primary)]"
                />
                <button
                  type="submit"
                  disabled={isValidatingCoupon || !couponInput.trim()}
                  className="px-4 py-2 border border-[var(--border-gold)] rounded text-xs uppercase tracking-wider text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-black transition-colors disabled:opacity-40"
                >
                  {isValidatingCoupon ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin w-3 h-3" />
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>

              {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
              {couponSuccess && (
                <p className="text-[11px] text-[var(--accent-gold)] flex items-center gap-1">
                  <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" />
                  <span>{couponSuccess}</span>
                </p>
              )}
              {appliedCoupon && (
                <div className="p-2.5 rounded bg-[var(--bg-primary)] border border-[var(--border-gold)] flex items-center justify-between text-xs text-[var(--accent-gold)]">
                  <span>Privilege Code: <strong>{appliedCoupon.code}</strong></span>
                  <button
                    type="button"
                    onClick={() => applyCoupon(null)}
                    className="text-xs text-[var(--text-secondary)] hover:text-red-400 underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums text-[var(--text-primary)] font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-[var(--accent-gold)]">
                  <span>Privilege Savings</span>
                  <span className="tabular-nums font-semibold">-{formatPrice(discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Royal Mail Tracked 24</span>
                <span className="tabular-nums text-[var(--text-primary)]">
                  {shippingTotal === 0 ? 'Complimentary' : formatPrice(shippingTotal)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]/80">
                <span>Includes 20% UK VAT</span>
                <span className="tabular-nums">{formatPrice(Math.round(subtotal * 0.2))}</span>
              </div>
              <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-between text-base font-semibold text-[var(--text-primary)]">
                <span className="font-serif">Total</span>
                <span className="tabular-nums text-[var(--accent-gold)] font-serif text-xl">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="btn-gold btn-shine w-full text-center">
              <FontAwesomeIcon icon={faLock} className="mr-2 w-3.5 h-3.5" />
              Proceed to Secure Checkout
            </Link>

            <p className="text-[10px] text-center text-[var(--text-secondary)] leading-relaxed">
              Every creation is packed in black silk paper and accompanied by a complimentary 2ml testing vial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
