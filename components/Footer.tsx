'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faXTwitter,
  faPinterestP,
  faFacebookF,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faCheck, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-normal tracking-[0.22em] text-[var(--text-primary)]">
                ELYRION
              </span>
              <span className="block label-editorial text-[9px] text-[var(--accent-gold)] tracking-[0.25em] -mt-1">
                HAUTE PARFUMERIE • LONDON
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-[var(--text-secondary)]">
              Elyrion is an artisanal British perfume house dedicated to high-art olfactory architecture. Hand-poured in London using rare Grasse botanical essences and preserved in transparent crystal-grade 50ml glass flacons.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-colors"
                aria-label="Follow Elyrion on Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-colors"
                aria-label="Follow Elyrion on X"
              >
                <FontAwesomeIcon icon={faXTwitter} className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-colors"
                aria-label="Follow Elyrion on Pinterest"
              >
                <FontAwesomeIcon icon={faPinterestP} className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-colors"
                aria-label="Follow Elyrion on Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 1: Haute Parfumerie */}
          <div>
            <h4 className="label-editorial text-[var(--text-primary)] mb-4">The Collections</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/fragrances?gender=unisex" className="hover:text-[var(--accent-gold)] transition-colors">
                  Unisex Parfums
                </Link>
              </li>
              <li>
                <Link href="/fragrances?gender=women" className="hover:text-[var(--accent-gold)] transition-colors">
                  Feminine Florals
                </Link>
              </li>
              <li>
                <Link href="/fragrances?gender=men" className="hover:text-[var(--accent-gold)] transition-colors">
                  Masculine Woods
                </Link>
              </li>
              <li>
                <Link href="/fragrances/oud-imperial" className="hover:text-[var(--accent-gold)] transition-colors">
                  Oud Impérial 50ml
                </Link>
              </li>
              <li>
                <Link href="/fragrances/rose-saphir" className="hover:text-[var(--accent-gold)] transition-colors">
                  Rose Saphir 50ml
                </Link>
              </li>
              <li>
                <Link href="/fragrances/santal-nuit" className="hover:text-[var(--accent-gold)] transition-colors">
                  Santal Nuit 50ml
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Experiences */}
          <div>
            <h4 className="label-editorial text-[var(--text-primary)] mb-4">Olfactory Curations</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/quiz" className="hover:text-[var(--accent-gold)] transition-colors">
                  Create Your Mood Quiz
                </Link>
              </li>
              <li>
                <Link href="/custom-bundle" className="hover:text-[var(--accent-gold)] transition-colors">
                  Build Your Own Bundle
                </Link>
              </li>
              <li>
                <Link href="/bundles" className="hover:text-[var(--accent-gold)] transition-colors">
                  Curated Discovery Trios
                </Link>
              </li>
              <li>
                <Link href="/corporate-gifting" className="hover:text-[var(--accent-gold)] transition-colors">
                  Corporate Concierge
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[var(--accent-gold)] transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The Gazette / Newsletter */}
          <div>
            <h4 className="label-editorial text-[var(--text-primary)] mb-4">The Gazette</h4>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Subscribe to receive private invitations to limited batch harvests and master perfumer insights.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[var(--bg-raised)] border border-[var(--border-gold)] rounded text-[var(--accent-gold)] text-xs flex items-center gap-2">
                <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
                <span>You have been entered into our private salon circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email..."
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] rounded py-2 px-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-gold)]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[var(--cta-bg)] text-[var(--cta-text)] font-semibold text-xs tracking-wider uppercase rounded hover:opacity-95 transition-opacity"
                >
                  Join The Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} Elyrion Fragrances Ltd. Registered in England & Wales. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>IFRA Compliant Formulation</span>
            <span>Hand-Blended in the UK</span>
            <Link href="/admin" className="hover:text-[var(--accent-gold)] flex items-center gap-1">
              <FontAwesomeIcon icon={faShieldAlt} className="w-3 h-3 text-[var(--accent-gold)]" />
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
