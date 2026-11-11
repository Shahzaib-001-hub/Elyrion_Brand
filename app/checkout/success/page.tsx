'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faEnvelope,
  faTruckFast,
  faArrowRight,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import confetti from 'canvas-confetti';

interface SuccessPageProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = use(searchParams);
  const orderNumber = resolvedParams.orderNumber || 'ELY-88912';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Trigger celebratory gold confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E8D3A2', '#C9A96E', '#A8844A', '#FFFFFF'],
      });
    } catch (e) {}
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 animate-fadeIn">
      {/* Gold Seal Icon */}
      <div className="w-20 h-20 rounded-full border border-[var(--border-gold)] mx-auto flex items-center justify-center text-[var(--accent-gold)] shadow-xl bg-[var(--bg-surface)]">
        <FontAwesomeIcon icon={faCheckCircle} className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="label-editorial text-[var(--accent-gold)]">Order Confirmed</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light">
          Thank you for choosing Elyrion
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          Your handcrafted creations are now being prepared in our London atelier. Each flacon is hand-polished, packaged in our signature black linen coffret, and sealed with gold wax.
        </p>
      </div>

      {/* Order Reference Box */}
      <div className="luxury-card p-6 sm:p-8 space-y-4 max-w-md mx-auto text-left">
        <div className="flex justify-between items-center text-xs border-b border-[var(--border-subtle)] pb-3">
          <span className="text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">Order Reference</span>
          <span className="font-mono text-[var(--accent-gold)] font-bold text-sm tracking-wider">
            {orderNumber}
          </span>
        </div>

        <div className="space-y-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Confirmation & VAT receipt dispatched to your email.</span>
          </div>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTruckFast} className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Complimentary Royal Mail Tracked 24 Dispatch (Est. 1-2 Business Days).</span>
          </div>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faShieldAlt} className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Complimentary 2ml testing vial included with your flacons.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link href="/account" className="btn-gold btn-shine w-full sm:w-auto">
          View In Client Account
        </Link>
        <Link href="/fragrances" className="btn-outline-gold w-full sm:w-auto">
          Explore More Creations
          <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
