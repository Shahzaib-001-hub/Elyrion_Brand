'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTruckFast, faCheck, faSearch, faSave } from '@fortawesome/free-solid-svg-icons';
import { formatPrice, formatEditorialDate } from '@/lib/format';

interface AdminOrder {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  itemsCount: number;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  createdAt: Date;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    _id: 'ord_1',
    orderNumber: 'ELY-98231',
    customerEmail: 'ambassador@mayfair.co.uk',
    customerName: 'Lord Julian Sterling',
    itemsCount: 1,
    total: 21000,
    status: 'shipped',
    trackingNumber: 'RM-774920192-GB',
    createdAt: new Date('2026-11-09T14:20:00Z'),
  },
  {
    _id: 'ord_2',
    orderNumber: 'ELY-98232',
    customerEmail: 'eleanor.vane@kensington.com',
    customerName: 'Lady Eleanor Vane',
    itemsCount: 2,
    total: 31500,
    status: 'processing',
    trackingNumber: 'PENDING_RM_DISPATCH',
    createdAt: new Date('2026-11-10T09:15:00Z'),
  },
  {
    _id: 'ord_3',
    orderNumber: 'ELY-98233',
    customerEmail: 'charles.mont@oxford.ac.uk',
    customerName: 'Prof. Charles Montgomery',
    itemsCount: 3,
    total: 52000,
    status: 'delivered',
    trackingNumber: 'RM-551982001-GB',
    createdAt: new Date('2026-11-04T11:00:00Z'),
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status } : o))
    );
  };

  const updateTracking = (id: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, trackingNumber } : o))
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Order Fulfillment</span>
          <h1 className="font-serif text-3xl font-light mt-1">
            Dispatch & Logistics Hub ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="luxury-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ref, client name or email..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] rounded py-2 pl-9 pr-3 text-xs text-[var(--text-primary)]"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-[var(--text-secondary)] w-3 h-3" />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-[var(--text-secondary)]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-2 rounded text-xs text-[var(--text-primary)]"
          >
            <option value="all">All Dispatches</option>
            <option value="processing">Processing in Atelier</option>
            <option value="shipped">Shipped via Royal Mail</option>
            <option value="delivered">Delivered to Residence</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-secondary)] uppercase tracking-wider text-[10px] bg-[var(--bg-raised)]/50">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date Placed</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Dispatch Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filtered.map((order) => (
                <tr key={order._id} className="hover:bg-[var(--bg-raised)]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[var(--accent-gold)]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-serif text-sm font-medium text-[var(--text-primary)] block">
                      {order.customerName}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">{order.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    {formatEditorialDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-4 font-semibold tabular-nums text-[var(--text-primary)]">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={order.trackingNumber}
                      onChange={(e) => updateTracking(order._id, e.target.value)}
                      className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] px-2 py-1 rounded font-mono text-[11px] text-[var(--text-primary)] w-40"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value as any)}
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border bg-[var(--bg-primary)] font-semibold ${
                        order.status === 'delivered'
                          ? 'text-emerald-400 border-emerald-500/40'
                          : order.status === 'shipped'
                          ? 'text-[var(--accent-gold)] border-[var(--border-gold)]'
                          : 'text-amber-400 border-amber-500/40'
                      }`}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
