'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { formatPrice } from '@/lib/format';
import { ProductItem } from '@/lib/mock-data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-gold)] rounded shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3 flex-1">
            <FontAwesomeIcon icon={faSearch} className="text-[var(--accent-gold)] w-4 h-4" />
            <input
              ref={inputRef}
              type="text"
              id="search-modal-title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by fragrance, note (oud, rose, cedar), or mood..."
              className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none text-base font-sans"
            />
          </div>
          {isLoading && (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[var(--accent-gold)] mr-2 w-4 h-4" />
          )}
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close search"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-[var(--border-subtle)]">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-sm text-[var(--text-secondary)]">
              <p className="label-editorial text-[var(--accent-gold)] mb-2">Popular Inquiries</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['Oud Impérial', 'Rose Saphir', 'Santal Nuit', 'Bergamot', 'Parfum'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 text-xs border border-[var(--border-subtle)] rounded hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3 py-2">
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/fragrances/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2 rounded hover:bg-[var(--bg-raised)] transition-colors group"
                >
                  <div className="relative w-14 h-14 bg-neutral-900 rounded overflow-hidden shrink-0 border border-[var(--border-subtle)]">
                    <Image
                      src={product.images[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=300'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
                        {product.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--accent-gold)] border border-[var(--border-gold)] px-1.5 py-0.5 rounded">
                        {product.concentration}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      Notes: {product.notes.top.slice(0, 2).join(', ')} • {product.notes.heart[0]} • {product.notes.base[0]}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                      {formatPrice(product.price)}
                    </span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ml-3 w-3 h-3 text-[var(--accent-gold)] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
              No bespoke fragrances match &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
