'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faCheck,
  faFlask,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { INITIAL_PRODUCTS, ProductItem } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesGender = filterGender === 'all' || p.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id
          ? { ...p, status: p.status === 'active' ? 'draft' : 'active' }
          : p
      )
    );
  };

  const updateStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Artisanal Catalog</span>
          <h1 className="font-serif text-3xl font-light mt-1">Fragrances & Flacon Inventory</h1>
        </div>
        <Link href="/admin/products/new" className="btn-gold text-xs py-2">
          <FontAwesomeIcon icon={faPlus} className="mr-1.5 w-3 h-3" />
          Add New Fragrance
        </Link>
      </div>

      {/* Search and Filter toolbar */}
      <div className="luxury-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU or note..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] rounded py-2 pl-9 pr-3 text-xs text-[var(--text-primary)]"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-[var(--text-secondary)] w-3 h-3" />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-[var(--text-secondary)]">Gender:</span>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-2 rounded text-xs text-[var(--text-primary)]"
          >
            <option value="all">All Genders</option>
            <option value="unisex">Unisex</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-secondary)] uppercase tracking-wider text-[10px] bg-[var(--bg-raised)]/50">
                <th className="py-3 px-4">Fragrance</th>
                <th className="py-3 px-4">SKU / Volume</th>
                <th className="py-3 px-4">Concentration</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filtered.map((prod) => (
                <tr key={prod._id} className="hover:bg-[var(--bg-raised)]/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 rounded border border-[var(--border-subtle)] overflow-hidden bg-neutral-950 shrink-0">
                        <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-serif text-base font-medium text-[var(--text-primary)] block">
                          {prod.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          {prod.notes.top[0]} • {prod.notes.base[0]}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    <div className="font-mono text-[11px] text-[var(--text-primary)]">{prod.sku}</div>
                    <div>{prod.volume}ml Flacon</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--accent-gold)] border border-[var(--border-gold)] px-2 py-0.5 rounded">
                      {prod.concentration}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold tabular-nums text-[var(--text-primary)]">
                    {formatPrice(prod.price)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateStock(prod._id, -5)}
                        className="w-5 h-5 rounded border border-[var(--border-subtle)] text-center hover:bg-[var(--bg-primary)]"
                      >
                        -
                      </button>
                      <span className={`w-8 text-center font-bold tabular-nums ${prod.stock < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {prod.stock}
                      </span>
                      <button
                        onClick={() => updateStock(prod._id, 10)}
                        className="w-5 h-5 rounded border border-[var(--border-subtle)] text-center hover:bg-[var(--bg-primary)]"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStatus(prod._id)}
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border transition-colors ${
                        prod.status === 'active'
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
                          : 'border-amber-500/40 text-amber-400 bg-amber-950/30'
                      }`}
                    >
                      {prod.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/fragrances/${prod.slug}`}
                        target="_blank"
                        className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
                        title="View Live Page"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
