'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faShoppingBag,
  faHeart,
  faUser,
  faBars,
  faTimes,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchModal } from '@/components/SearchModal';
import { CartDrawer } from '@/components/CartDrawer';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Fragrances', href: '/fragrances' },
    { name: 'Discovery Sets', href: '/bundles' },
    { name: 'Build A Bundle', href: '/custom-bundle' },
    { name: 'Create Your Mood', href: '/quiz' },
    { name: 'Corporate Gifting', href: '/corporate-gifting' },
  ];

  const isActive = (path: string) => {
    if (path === '/fragrances' && pathname.startsWith('/fragrances')) return true;
    return pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 navbar-glass transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex flex-col items-center text-center group">
                <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.22em] text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
                  ELYRION
                </span>
                <span className="label-editorial text-[9px] text-[var(--accent-gold)] tracking-[0.25em] -mt-0.5">
                  HAUTE PARFUMERIE • LONDON
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.18em] transition-all duration-200 py-1 relative ${
                    isActive(link.href)
                      ? 'text-[var(--accent-gold)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.name}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--accent-gold)] animate-fadeIn" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
                aria-label="Search fragrances"
              >
                <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/account/wishlist"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
                aria-label="Wishlist"
              >
                <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--accent-gold)] text-black text-[10px] font-bold flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--accent-gold)] text-black text-[10px] font-bold flex items-center justify-center leading-none animate-scale">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Customer Account / Admin Link */}
              <Link
                href="/account"
                className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
                aria-label="My Account"
                title="Account & Orders"
              >
                <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              </Link>

              {/* Admin Portal Quick Pill */}
              <Link
                href="/admin"
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-medium border border-[var(--border-gold)] rounded text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 transition-colors"
                title="Admin Control Hub"
              >
                <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3" />
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-6 space-y-4 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-sm uppercase tracking-[0.18em] py-2 border-b border-[var(--border-subtle)]/40 ${
                  isActive(link.href) ? 'text-[var(--accent-gold)] font-semibold' : 'text-[var(--text-secondary)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.18em] text-[var(--text-primary)] hover:text-[var(--accent-gold)] flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                Client Account & Orders
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.18em] text-[var(--accent-gold)] border border-[var(--border-gold)] px-2.5 py-1 rounded"
              >
                Admin Hub
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Persistent Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
