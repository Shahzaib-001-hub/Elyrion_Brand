'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faFlask,
  faTags,
  faWandMagicSparkles,
  faLayerGroup,
  faGift,
  faTicket,
  faBox,
  faStar,
  faArrowLeft,
  faShieldHalved,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const adminNav = [
    { name: 'Dashboard', href: '/admin', icon: faChartLine },
    { name: 'Products & Stock', href: '/admin/products', icon: faFlask },
    { name: 'Categories', href: '/admin/categories', icon: faTags },
    { name: 'Moods & Quiz', href: '/admin/moods', icon: faWandMagicSparkles },
    { name: 'Bundles & Tiers', href: '/admin/bundles', icon: faLayerGroup },
    { name: 'Corporate Quotes', href: '/admin/corporate-quotes', icon: faGift },
    { name: 'Coupons & Popups', href: '/admin/coupons', icon: faTicket },
    { name: 'Orders & Dispatch', href: '/admin/orders', icon: faBox },
    { name: 'Reviews Moderation', href: '/admin/reviews', icon: faStar },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col lg:flex-row">
      {/* Mobile Bar */}
      <div className="lg:hidden p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faShieldHalved} className="text-[var(--accent-gold)] w-4 h-4" />
          <span className="font-serif text-lg tracking-wider font-semibold">Elyrion Admin Hub</span>
        </div>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 text-[var(--text-secondary)]"
        >
          <FontAwesomeIcon icon={isMobileNavOpen ? faTimes : faBars} className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`w-full lg:w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-6 flex flex-col justify-between shrink-0 ${
          isMobileNavOpen ? 'block' : 'hidden lg:flex'
        }`}
      >
        <div className="space-y-8">
          {/* Brand & Badge */}
          <div>
            <Link href="/admin" className="block">
              <span className="font-serif text-2xl tracking-[0.2em] font-normal text-[var(--text-primary)]">
                ELYRION
              </span>
              <span className="label-editorial text-[9px] text-[var(--accent-gold)] block -mt-1">
                Atelier Administration
              </span>
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[var(--accent-gold)]/10 border border-[var(--border-gold)] text-[10px] text-[var(--accent-gold)] uppercase tracking-wider font-semibold">
              <FontAwesomeIcon icon={faShieldHalved} className="w-2.5 h-2.5" />
              Role: Super Admin
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {adminNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded transition-all ${
                    active
                      ? 'bg-[var(--accent-gold)] text-black font-semibold shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)]'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className={`w-3.5 h-3.5 ${active ? 'text-black' : 'text-[var(--accent-gold)]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Store Link */}
        <div className="pt-8 border-t border-[var(--border-subtle)] mt-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Return to Boutique</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
