'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTicket, faTrashAlt, faCheck, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { INITIAL_COUPONS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed' | 'free_shipping'>('percentage');
  const [newValue, setNewValue] = useState(10);
  const [newMinSpend, setNewMinSpend] = useState(150);

  // Popups toggle state
  const [popupActive, setPopupActive] = useState(true);
  const [popupHeading, setPopupHeading] = useState('10% Off Your First Flacon');
  const [popupDelay, setPopupDelay] = useState(6);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    const newC = {
      code: newCode.toUpperCase().trim(),
      discountType: newType,
      discountValue: newType === 'percentage' ? Number(newValue) : Number(newValue) * 100,
      minSpend: Number(newMinSpend) * 100,
      active: true,
    };

    setCoupons([newC, ...coupons]);
    setNewCode('');
  };

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Privilege Engine</span>
          <h1 className="font-serif text-3xl font-light mt-1">
            Privilege Vouchers & Promotional Popups
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Create Coupon */}
        <div className="lg:col-span-5 luxury-card p-6 space-y-4">
          <h2 className="font-serif text-xl font-medium border-b border-[var(--border-subtle)] pb-3">
            Issue New Privilege Code
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Privilege Code *</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="e.g. PRIVILEGE15"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded font-mono uppercase text-[var(--text-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Discount Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-2.5 rounded text-[var(--text-primary)]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (£)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Discount Value</label>
                <input
                  type="number"
                  min={0}
                  value={newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-2.5 rounded text-[var(--accent-gold)] font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Minimum Spend (£)</label>
              <input
                type="number"
                min={0}
                value={newMinSpend}
                onChange={(e) => setNewMinSpend(Number(e.target.value))}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-3 rounded text-[var(--text-primary)]"
              />
            </div>

            <button type="submit" className="btn-gold w-full py-2.5">
              <FontAwesomeIcon icon={faPlus} className="mr-1.5 w-3 h-3" />
              Issue Privilege Code
            </button>
          </form>
        </div>

        {/* Right: Active Coupons List */}
        <div className="lg:col-span-7 luxury-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-secondary)] uppercase tracking-wider text-[10px] bg-[var(--bg-raised)]/50">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Spend</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-[var(--bg-raised)]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[var(--accent-gold)] text-sm">
                    {c.code}
                  </td>
                  <td className="py-3 px-4">
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}% Off`
                      : c.discountType === 'fixed'
                      ? `${formatPrice(c.discountValue)} Off`
                      : 'Free Shipping'}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[var(--text-secondary)]">
                    {c.minSpend ? formatPrice(c.minSpend) : 'No Minimum'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleCoupon(c.code)}
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                        c.active
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
                          : 'border-red-500/40 text-red-400 bg-red-950/30'
                      }`}
                    >
                      {c.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Popups Engine Configuration */}
      <div className="luxury-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2 text-[var(--accent-gold)]">
            <FontAwesomeIcon icon={faBullhorn} className="w-4 h-4" />
            <h2 className="font-serif text-2xl font-light text-[var(--text-primary)]">
              Exit-Intent & Timed Modal Engine
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>Enabled:</span>
            <input
              type="checkbox"
              checked={popupActive}
              onChange={(e) => setPopupActive(e.target.checked)}
              className="accent-[var(--accent-gold)] w-4 h-4"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block mb-1 text-[var(--text-secondary)]">Modal Headline</label>
            <input
              type="text"
              value={popupHeading}
              onChange={(e) => setPopupHeading(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-2.5 rounded text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label className="block mb-1 text-[var(--text-secondary)]">Trigger Delay (Seconds)</label>
            <input
              type="number"
              value={popupDelay}
              onChange={(e) => setPopupDelay(Number(e.target.value))}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-2.5 rounded text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label className="block mb-1 text-[var(--text-secondary)]">Attached Coupon</label>
            <input
              type="text"
              disabled
              value="ELYRION10"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-2.5 rounded text-[var(--accent-gold)] font-mono font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
