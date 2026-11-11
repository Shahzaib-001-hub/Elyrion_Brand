'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faEnvelope,
  faPhone,
  faCalendar,
  faCheck,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { formatEditorialDate } from '@/lib/format';

interface MockQuote {
  _id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  quantity: number;
  budget: string;
  deliveryDate: Date;
  customMessage?: string;
  logoUrl?: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'closed';
}

const INITIAL_QUOTES: MockQuote[] = [
  {
    _id: 'q_001',
    company: 'Rothschild & Sterling Family Office',
    contactName: 'Lady Beatrice Sterling',
    email: 'b.sterling@rothschildsterling.co.uk',
    phone: '+44 20 7946 0981',
    quantity: 45,
    budget: '£5,000 – £10,000',
    deliveryDate: new Date('2026-12-15'),
    customMessage:
      'We require 45 bottles of Oud Impérial engraved with our family crest for our annual gala dinner at Claridge’s. Black wax seals requested.',
    logoUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=200',
    status: 'reviewed',
  },
  {
    _id: 'q_002',
    company: 'Vanguard Aviation Executive Concierge',
    contactName: 'Alexander Hayes',
    email: 'a.hayes@vanguard-air.com',
    phone: '+44 20 7946 0412',
    quantity: 80,
    budget: '£10,000+',
    deliveryDate: new Date('2026-12-20'),
    customMessage:
      'Private jet amenity gifting sets. Looking for a mix of Bergamote Céleste and Santal Nuit in bespoke branded leather coffrets.',
    status: 'pending',
  },
];

export default function AdminCorporateQuotesPage() {
  const [quotes, setQuotes] = useState<MockQuote[]>(INITIAL_QUOTES);

  const updateStatus = (id: string, status: MockQuote['status']) => {
    setQuotes((prev) =>
      prev.map((q) => (q._id === id ? { ...q, status } : q))
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Concierge Inbox</span>
          <h1 className="font-serif text-3xl font-light mt-1">
            Corporate Gifting Inquiries ({quotes.length})
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        {quotes.map((quote) => (
          <div key={quote._id} className="luxury-card p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="label-editorial text-[10px] text-[var(--accent-gold)]">
                  Volume Inquiry: {quote.quantity} Units
                </span>
                <h3 className="font-serif text-2xl font-medium text-[var(--text-primary)] mt-0.5">
                  {quote.company}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Contact: <strong className="text-[var(--text-primary)]">{quote.contactName}</strong>
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--text-secondary)]">Status:</span>
                <select
                  value={quote.status}
                  onChange={(e) => updateStatus(quote._id, e.target.value as any)}
                  className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-2 rounded text-xs text-[var(--text-primary)]"
                >
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Reviewed by Concierge</option>
                  <option value="quoted">Proposal Dispatched</option>
                  <option value="closed">Closed / In Production</option>
                </select>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px] uppercase tracking-wider">
                  Email
                </span>
                <span className="font-mono text-[var(--text-primary)]">{quote.email}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px] uppercase tracking-wider">
                  Phone
                </span>
                <span className="font-mono text-[var(--text-primary)]">{quote.phone}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px] uppercase tracking-wider">
                  Target Budget
                </span>
                <span className="font-semibold text-[var(--accent-gold)]">{quote.budget}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px] uppercase tracking-wider">
                  Delivery Required By
                </span>
                <span className="text-[var(--text-primary)]">
                  {formatEditorialDate(quote.deliveryDate)}
                </span>
              </div>
            </div>

            {/* Custom Engraving / Message Notes */}
            {quote.customMessage && (
              <div className="p-4 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1">
                <span className="label-editorial text-[9px] text-[var(--accent-gold)]">
                  Client Bespoke Notes
                </span>
                <p className="leading-relaxed text-[var(--text-primary)]">{quote.customMessage}</p>
              </div>
            )}

            {/* Logo Preview */}
            {quote.logoUrl && (
              <div className="flex items-center gap-3 pt-2 text-xs">
                <span className="text-[var(--text-secondary)]">Company Crest Preview:</span>
                <div className="relative w-10 h-10 rounded border border-[var(--border-gold)] overflow-hidden">
                  <Image src={quote.logoUrl} alt="Logo" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
