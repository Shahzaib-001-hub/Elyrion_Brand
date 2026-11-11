'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faBox,
  faReceipt,
  faChartPie,
  faTriangleExclamation,
  faArrowTrendUp,
  faPlus,
  faCheck,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { formatPrice } from '@/lib/format';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';

const REVENUE_DATA = [
  { month: 'Jun', revenue: 18400, orders: 82 },
  { month: 'Jul', revenue: 22100, orders: 94 },
  { month: 'Aug', revenue: 26800, orders: 112 },
  { month: 'Sep', revenue: 31200, orders: 134 },
  { month: 'Oct', revenue: 38900, orders: 165 },
  { month: 'Nov', revenue: 44250, orders: 188 },
];

export default function AdminDashboardPage() {
  const [stockList, setStockList] = useState(INITIAL_PRODUCTS);
  const [restockInput, setRestockInput] = useState<Record<string, number>>({});
  const [restockedSuccess, setRestockedSuccess] = useState<string | null>(null);

  const lowStockItems = stockList.filter((p) => p.stock < 35);

  const handleRestock = (id: string) => {
    const qty = restockInput[id] || 25;
    setStockList((prev) =>
      prev.map((p) => (p._id === id ? { ...p, stock: p.stock + qty } : p))
    );
    setRestockedSuccess(id);
    setTimeout(() => setRestockedSuccess(null), 2500);
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Operational Telemetry</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light mt-1">
            Executive Performance Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/new" className="btn-gold text-xs py-2">
            <FontAwesomeIcon icon={faPlus} className="mr-1.5 w-3 h-3" />
            Create New Fragrance
          </Link>
        </div>
      </div>

      {/* 4 Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="luxury-card p-6 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="label-editorial text-[10px]">Gross Revenue</span>
            <FontAwesomeIcon icon={faCoins} className="text-[var(--accent-gold)] w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-medium text-[var(--text-primary)] tabular-nums">
            £148,250
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-2.5 h-2.5" />
            <span>+18.4% vs last cycle</span>
          </p>
        </div>

        <div className="luxury-card p-6 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="label-editorial text-[10px]">Dispatched Orders</span>
            <FontAwesomeIcon icon={faBox} className="text-[var(--accent-gold)] w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-medium text-[var(--text-primary)] tabular-nums">
            624
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-2.5 h-2.5" />
            <span>+12.1% growth</span>
          </p>
        </div>

        <div className="luxury-card p-6 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="label-editorial text-[10px]">Average Order Value</span>
            <FontAwesomeIcon icon={faReceipt} className="text-[var(--accent-gold)] w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-medium text-[var(--text-primary)] tabular-nums">
            £237.58
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">Driven by 3x50ml Discovery Bundles</p>
        </div>

        <div className="luxury-card p-6 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="label-editorial text-[10px]">Conversion Resonance</span>
            <FontAwesomeIcon icon={faChartPie} className="text-[var(--accent-gold)] w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-medium text-[var(--text-primary)] tabular-nums">
            3.42%
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-2.5 h-2.5" />
            <span>+0.6% after Mood Quiz</span>
          </p>
        </div>
      </div>

      {/* Revenue & Growth Interactive Chart */}
      <div className="luxury-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <span className="label-editorial text-[var(--accent-gold)]">Revenue Trajectory</span>
            <h2 className="font-serif text-2xl font-light">6-Month Revenue & Order Trajectory</h2>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">Values in GBP (£)</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#B9B3A6" fontSize={11} tickLine={false} />
              <YAxis stroke="#B9B3A6" fontSize={11} tickLine={false} tickFormatter={(val) => `£${val / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14141B',
                  borderColor: 'rgba(201,169,110,0.3)',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#F5F1E8',
                }}
                formatter={(value: any) => [`£${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#C9A96E" strokeWidth={2} fillOpacity={1} fill="url(#goldGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column: Low Stock Inventory & Top Performing Creations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="luxury-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2 text-amber-400">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4" />
              <h2 className="font-serif text-xl font-medium text-[var(--text-primary)]">
                Flacon Inventory Thresholds
              </h2>
            </div>
            <span className="text-xs text-amber-400 font-medium">
              {lowStockItems.length} Fragrances Low
            </span>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] space-y-3">
            {lowStockItems.map((prod) => (
              <div key={prod._id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div>
                  <h3 className="font-serif text-base font-medium">{prod.name}</h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    SKU: {prod.sku} • In Stock: <span className="text-amber-400 font-bold">{prod.stock}</span> flacons
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    defaultValue={25}
                    onChange={(e) =>
                      setRestockInput({ ...restockInput, [prod._id]: Number(e.target.value) })
                    }
                    className="w-16 bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-1.5 rounded text-center text-xs"
                  />
                  <button
                    onClick={() => handleRestock(prod._id)}
                    className="px-2.5 py-1.5 bg-[var(--accent-gold)] text-black font-semibold rounded text-[11px] hover:opacity-90"
                  >
                    {restockedSuccess === prod._id ? (
                      <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                    ) : (
                      'Restock'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Fragrances */}
        <div className="luxury-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <h2 className="font-serif text-xl font-medium">Top Performing Olfactory Art</h2>
            <Link href="/admin/products" className="text-xs text-[var(--accent-gold)] hover:underline">
              View All SKUs
            </Link>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] space-y-3">
            {stockList.slice(0, 4).map((prod, idx) => (
              <div key={prod._id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-lg font-bold text-[var(--accent-gold)] w-4 text-center">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-medium">{prod.name}</h3>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {prod.concentration} • {formatPrice(prod.price)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-semibold tabular-nums text-[var(--text-primary)] block">
                    {formatPrice(prod.price * (45 - idx * 6))}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {45 - idx * 6} Flacons Sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
