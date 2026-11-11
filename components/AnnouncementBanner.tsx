'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Promotional Announcement"
      className="bg-[var(--bg-raised)] border-b border-[var(--border-subtle)] text-[var(--text-secondary)] text-[11px] py-2 px-4 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center font-medium tracking-wide">
          <span className="text-[var(--accent-gold)] font-semibold uppercase tracking-[0.16em]">
            Privilege Offer:
          </span>{' '}
          Complimentary Royal Mail Tracked 24 on orders over £150 with code{' '}
          <strong className="text-[var(--text-primary)] font-bold tracking-wider">ELYRION10</strong> for 10% off.{' '}
          <Link href="/fragrances" className="underline hover:text-[var(--accent-gold)] ml-1">
            Discover Scents
          </Link>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 text-xs"
          aria-label="Dismiss banner"
        >
          <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}
