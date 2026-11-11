'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faGem, faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';

export function SalesPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check frequency cap in sessionStorage
    try {
      const dismissed = sessionStorage.getItem('elyrion_popup_dismissed');
      if (dismissed) return;
    } catch (e) {
      return;
    }

    // Timed trigger after 6 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 6000);

    // Exit-intent trigger
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      dialogRef.current?.focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('elyrion_popup_dismissed', 'true');
    } catch (e) {}
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText('ELYRION10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sales-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={handleDismiss}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-gold)] rounded shadow-2xl p-8 text-center text-[var(--text-primary)]"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close dialog"
        >
          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full border border-[var(--border-gold)] mx-auto mb-4 flex items-center justify-center text-[var(--accent-gold)]">
          <FontAwesomeIcon icon={faGem} className="w-5 h-5" />
        </div>

        <span className="label-editorial text-[var(--accent-gold)] block mb-1">
          Private Invitation
        </span>
        <h3 id="sales-popup-title" className="font-serif text-3xl font-medium tracking-wide mb-3">
          10% Off Your First Flacon
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto mb-6">
          Step into our high-art olfactory universe. Receive a 10% welcome privilege on your order of any handcrafted 50ml creation plus complimentary UK tracked courier delivery.
        </p>

        {/* Coupon Code Pill */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-[var(--bg-primary)] border border-dashed border-[var(--border-gold)] px-4 py-2 rounded font-mono text-sm tracking-widest text-[var(--accent-gold)] font-bold">
            ELYRION10
          </div>
          <button
            onClick={copyCoupon}
            className="px-3 py-2 text-xs border border-[var(--border-subtle)] rounded hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            aria-label="Copy coupon code"
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="w-3 h-3 text-[var(--accent-gold)]" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="space-y-3">
          <Link
            href="/fragrances"
            onClick={handleDismiss}
            className="btn-gold w-full btn-shine"
          >
            Explore The Collection
          </Link>
          <button
            onClick={handleDismiss}
            className="text-[11px] text-[var(--text-secondary)] hover:underline uppercase tracking-wider"
          >
            No thank you, continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
