'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faTimes,
  faSlidersH,
  faCheck,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { ProductCard } from '@/components/ProductCard';
import { ProductItem, INITIAL_PRODUCTS } from '@/lib/mock-data';

export default function FragrancesPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedConcentration, setSelectedConcentration] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const moodsList = ['Opulent', 'Mysterious', 'Sensual', 'Regal', 'Fresh', 'Serene'];

  // Load from API with fallback
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedGender !== 'all') params.append('gender', selectedGender);
        if (selectedMood !== 'all') params.append('mood', selectedMood);
        if (inStockOnly) params.append('inStock', 'true');
        if (sortBy) params.append('sort', sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.products) setProducts(data.products);
        }
      } catch (err) {
        console.warn('Using client filtered fallback');
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(load, 200);
    return () => clearTimeout(timer);
  }, [search, selectedGender, selectedMood, inStockOnly, sortBy]);

  // Client filtering fallback if offline
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedConcentration !== 'all') {
      list = list.filter((p) => p.concentration === selectedConcentration);
    }

    return list;
  }, [products, selectedConcentration]);

  const hasActiveFilters =
    search ||
    selectedGender !== 'all' ||
    selectedMood !== 'all' ||
    selectedConcentration !== 'all' ||
    inStockOnly;

  const resetFilters = () => {
    setSearch('');
    setSelectedGender('all');
    setSelectedMood('all');
    setSelectedConcentration('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="label-editorial text-[var(--accent-gold)]">Haute Parfumerie Flacons</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light">
          The Fragrance Collection
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Transparent 50ml flacons hand-poured in London. Explore rare formulations distilled from Grasse harvests, dark Cambodian ouds, and crisp botanicals.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="luxury-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, moods, names..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] rounded py-2 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 w-3 h-3 text-[var(--text-secondary)]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick Gender Chips */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs">
          {[
            { label: 'All', value: 'all' },
            { label: 'Unisex', value: 'unisex' },
            { label: 'Feminine', value: 'women' },
            { label: 'Masculine', value: 'men' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedGender(tab.value)}
              className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider text-[11px] ${
                selectedGender === tab.value
                  ? 'bg-[var(--accent-gold)] text-black font-semibold'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort and Mobile Filter Button */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden px-3 py-2 border border-[var(--border-gold)] rounded text-xs flex items-center gap-2 text-[var(--accent-gold)]"
          >
            <FontAwesomeIcon icon={faFilter} className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--text-secondary)] uppercase tracking-wider text-[10px] hidden sm:inline">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] rounded py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className={`lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'} space-y-6`}>
          <div className="luxury-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <span className="font-serif text-lg">Filter Portfolio</span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[var(--accent-gold)] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <span className="label-editorial text-[var(--text-secondary)]">Gender Archetype</span>
              <div className="space-y-1.5 text-xs">
                {['all', 'unisex', 'women', 'men'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer text-[var(--text-primary)]">
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedGender === g}
                      onChange={() => setSelectedGender(g)}
                      className="accent-[var(--accent-gold)]"
                    />
                    <span className="capitalize">{g === 'all' ? 'All Archetypes' : g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mood Filter */}
            <div className="space-y-2">
              <span className="label-editorial text-[var(--text-secondary)]">Emotional Mood</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedMood('all')}
                  className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                    selectedMood === 'all'
                      ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[var(--accent-gold)]/10'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  All
                </button>
                {moodsList.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                      selectedMood === mood
                        ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 font-semibold'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Concentration */}
            <div className="space-y-2">
              <span className="label-editorial text-[var(--text-secondary)]">Concentration</span>
              <div className="space-y-1.5 text-xs">
                {['all', 'EDP', 'Parfum'].map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer text-[var(--text-primary)]">
                    <input
                      type="radio"
                      name="concentration"
                      checked={selectedConcentration === c}
                      onChange={() => setSelectedConcentration(c)}
                      className="accent-[var(--accent-gold)]"
                    />
                    <span>{c === 'all' ? 'All Concentrations' : c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span>In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[var(--accent-gold)] w-4 h-4 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[var(--text-secondary)]">Active Filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-raised)] border border-[var(--border-gold)] text-[var(--accent-gold)]">
                  &ldquo;{search}&rdquo;
                  <button onClick={() => setSearch('')}>
                    <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {selectedGender !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-raised)] border border-[var(--border-gold)] text-[var(--accent-gold)] capitalize">
                  {selectedGender}
                  <button onClick={() => setSelectedGender('all')}>
                    <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {selectedMood !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-raised)] border border-[var(--border-gold)] text-[var(--accent-gold)]">
                  Mood: {selectedMood}
                  <button onClick={() => setSelectedMood('all')}>
                    <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="luxury-card h-96 animate-pulse bg-neutral-900/40" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="luxury-card p-12 text-center space-y-4">
              <p className="font-serif text-2xl">No Fragrances Found</p>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                No bespoke creations currently match your selected filters. Reset filters to view our full collection.
              </p>
              <button onClick={resetFilters} className="btn-outline-gold">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
