'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faShieldHalved,
  faCheck,
  faTruckFast,
  faCreditCard,
  faSpinner,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discountTotal,
    shippingTotal,
    finalTotal,
    appliedCoupon,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'United Kingdom',
    shippingMethod: 'Complimentary Royal Mail Tracked 24',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif text-3xl font-light">Your Fragrance Bag is Empty</h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link href="/fragrances" className="btn-gold">
          Browse Fragrances
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: formData.email,
          shippingAddress: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            street: formData.street,
            apartment: formData.apartment,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          items,
          couponCode: appliedCoupon?.code,
          shippingMethod: formData.shippingMethod,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push(`/checkout/success?orderNumber=${data.orderNumber}`);
      } else {
        setErrorMessage(data.error || 'Payment processing failed. Please check your details.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back to Cart link */}
      <Link
        href="/cart"
        className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-gold)] flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
        <span>Return to Bag</span>
      </Link>

      <div className="border-b border-[var(--border-subtle)] pb-4">
        <span className="label-editorial text-[var(--accent-gold)]">Secure Encryption</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light mt-1">
          Bespoke Checkout & White-Glove Dispatch
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Shipping and Payment */}
        <div className="lg:col-span-7 space-y-8">
          {errorMessage && (
            <div className="p-4 bg-red-950/40 border border-red-500/50 rounded text-red-200 text-xs">
              {errorMessage}
            </div>
          )}

          {/* 1. Client Contact */}
          <div className="luxury-card p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl font-medium border-b border-[var(--border-subtle)] pb-3">
              1. Client Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block mb-1 text-[var(--text-secondary)]">Email Address for Dispatch Tracking *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. lord.sterling@mayfair.co.uk"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1 text-[var(--text-secondary)]">Telephone for White-Glove Courier *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +44 20 7946 0912"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Destination */}
          <div className="luxury-card p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl font-medium border-b border-[var(--border-subtle)] pb-3">
              2. Delivery Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block mb-1 text-[var(--text-secondary)]">Full Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Lord Julian Sterling"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1 text-[var(--text-secondary)]">Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="e.g. 14 Berkeley Square"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Suite / Apartment</label>
                <input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  placeholder="Apartment 4B (Optional)"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="London"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="W1J 6BQ"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                >
                  <option value="United Kingdom">United Kingdom (Direct Atelier Dispatch)</option>
                  <option value="France">France</option>
                  <option value="United States">United States</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Switzerland">Switzerland</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="luxury-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="font-serif text-xl font-medium">3. Secure Payment</h2>
              <div className="flex items-center gap-1.5 text-xs text-[var(--accent-gold)]">
                <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
                <span>256-Bit TLS Stripe Security</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded bg-[var(--bg-primary)] border border-[var(--border-gold)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--accent-gold)]">
                    <FontAwesomeIcon icon={faCreditCard} className="w-4 h-4" />
                    <span className="font-semibold uppercase tracking-wider text-[11px]">
                      Stripe Card Element & Wallets
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">Demo Enabled</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    disabled
                    value={formData.cardNumber}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2.5 rounded font-mono text-xs text-[var(--text-primary)]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      disabled
                      value={formData.cardExp}
                      className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2.5 rounded font-mono text-xs text-[var(--text-primary)]"
                    />
                    <input
                      type="text"
                      disabled
                      value={formData.cardCvc}
                      className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2.5 rounded font-mono text-xs text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                By clicking &ldquo;Complete Purchase&rdquo;, you authorize the transaction for {formatPrice(finalTotal)}. Your transaction will be processed via Stripe Payments.
              </p>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="luxury-card p-6 sm:p-8 space-y-6 sticky top-28">
            <h2 className="font-serif text-2xl font-light border-b border-[var(--border-subtle)] pb-3">
              Review Bag ({items.length})
            </h2>

            {/* Items mini list */}
            <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <div className="relative w-14 h-16 rounded border border-[var(--border-subtle)] overflow-hidden bg-neutral-950 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base font-medium truncate text-[var(--text-primary)]">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Qty: {item.quantity} • {item.volume}ml Flacon
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-[var(--accent-gold)]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums text-[var(--text-primary)]">{formatPrice(subtotal)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-[var(--accent-gold)]">
                  <span>Privilege Savings ({appliedCoupon?.code})</span>
                  <span className="tabular-nums">-{formatPrice(discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tracked 24 Delivery</span>
                <span className="tabular-nums text-[var(--text-primary)]">
                  {shippingTotal === 0 ? 'Complimentary' : formatPrice(shippingTotal)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]/80">
                <span>UK VAT (20% Included)</span>
                <span className="tabular-nums">{formatPrice(Math.round(subtotal * 0.2))}</span>
              </div>
              <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-between text-base font-semibold text-[var(--text-primary)]">
                <span className="font-serif">Total Charged</span>
                <span className="tabular-nums text-[var(--accent-gold)] font-serif text-2xl">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-gold btn-shine w-full py-3.5 text-sm"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" />
                  <span>Securing Order with Concierge...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5" />
                  <span>Complete Purchase • {formatPrice(finalTotal)}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
