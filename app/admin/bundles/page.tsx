'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faLayerGroup, faSave, faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { INITIAL_CURATED_BUNDLES, INITIAL_TIER_RULES } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';

export default function AdminBundlesPage() {
  const [curatedBundles, setCuratedBundles] = useState(INITIAL_CURATED_BUNDLES);
  const [tierRules, setTierRules] = useState(INITIAL_TIER_RULES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateTier = (index: number, key: string, value: any) => {
    const updated = [...tierRules];
    (updated[index] as any)[key] = value;
    setTierRules(updated);
  };

  const handleSaveAll = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Bundles & Dynamic Tiers</span>
          <h1 className="font-serif text-3xl font-light mt-1">Discovery Sets & Custom Tiers</h1>
        </div>
        <button onClick={handleSaveAll} className="btn-gold text-xs py-2">
          <FontAwesomeIcon icon={faSave} className="mr-1.5 w-3 h-3" />
          Save Configurations
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-200 text-xs flex items-center gap-2">
          <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
          <span>Bundle configurations saved successfully.</span>
        </div>
      )}

      {/* 1. Build Your Own Bundle Tier Configuration */}
      <div className="luxury-card p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-2xl font-light border-b border-[var(--border-subtle)] pb-3">
          Build Your Own Bundle Tier Discount Rules
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Configure how many 50ml flacons customers must add to unlock automated percentage discounts. Validated server-side at checkout.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {tierRules.map((tier, idx) => (
            <div key={idx} className="p-4 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 text-xs">
              <span className="label-editorial text-[10px] text-[var(--accent-gold)]">
                Tier 0{idx + 1} Threshold
              </span>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Required Flacons</label>
                <input
                  type="number"
                  value={tier.itemCount}
                  onChange={(e) => handleUpdateTier(idx, 'itemCount', Number(e.target.value))}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2 rounded text-[var(--text-primary)] font-semibold"
                />
              </div>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={tier.discountPercent}
                  onChange={(e) => handleUpdateTier(idx, 'discountPercent', Number(e.target.value))}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2 rounded text-[var(--accent-gold)] font-bold"
                />
              </div>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Badge Display Label</label>
                <input
                  type="text"
                  value={tier.label}
                  onChange={(e) => handleUpdateTier(idx, 'label', e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2 rounded text-[var(--text-primary)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Curated Discovery Bundles */}
      <div className="luxury-card p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-2xl font-light border-b border-[var(--border-subtle)] pb-3">
          Admin Curated Discovery Coffrets
        </h2>

        <div className="divide-y divide-[var(--border-subtle)] space-y-4">
          {curatedBundles.map((b) => (
            <div key={b.slug} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--accent-gold)] border border-[var(--border-gold)] px-2 py-0.5 rounded">
                  {b.badge}
                </span>
                <h3 className="font-serif text-xl font-medium mt-1">{b.title}</h3>
                <p className="text-[11px] text-[var(--text-secondary)]">{b.tagline}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Flacon count: {b.productIds.length} flacons • Inventory: {b.stock} units
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-lg font-serif font-medium text-[var(--text-primary)] block tabular-nums">
                  {formatPrice(b.price)}
                </span>
                <span className="text-xs text-[var(--text-secondary)] line-through tabular-nums">
                  {formatPrice(b.compareAtPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
