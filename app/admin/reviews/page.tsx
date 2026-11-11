'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface AdminReview {
  _id: string;
  fragranceName: string;
  clientName: string;
  rating: number;
  headline: string;
  comment: string;
  verified: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

const INITIAL_REVIEWS: AdminReview[] = [
  {
    _id: 'rev_1',
    fragranceName: 'Oud Impérial',
    clientName: 'Lord Sterling',
    rating: 5,
    headline: 'Unparalleled depth and longevity',
    comment:
      'The smoky Cambodian oud in Oud Impérial is the finest distillation I have experienced outside of the Arabian Gulf. It develops with magnificent warmth throughout an entire evening.',
    verified: true,
    status: 'approved',
  },
  {
    _id: 'rev_2',
    fragranceName: 'Rose Saphir',
    clientName: 'Sophia Montgomery',
    rating: 5,
    headline: 'Ethereal morning rose',
    comment:
      'Unlike cloying commercial roses, Rose Saphir is crisp, dewy, and grounded by iris. Truly an haute parfumerie masterpiece.',
    verified: true,
    status: 'approved',
  },
  {
    _id: 'rev_3',
    fragranceName: 'Santal Nuit',
    clientName: 'Julian H.',
    rating: 4,
    headline: 'Subtle and intimate sandalwood',
    comment:
      'Very quiet and refined. Stays close to the skin for over 10 hours without overpowering.',
    verified: true,
    status: 'approved',
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_REVIEWS);

  const setStatus = (id: string, status: AdminReview['status']) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <span className="label-editorial text-[var(--accent-gold)]">Public Reputation</span>
        <h1 className="font-serif text-3xl font-light mt-1">Client Reviews Moderation</h1>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev._id} className="luxury-card p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-medium text-[var(--text-primary)]">
                    {rev.fragranceName}
                  </span>
                  {rev.verified && (
                    <span className="text-[10px] text-[var(--accent-gold)] border border-[var(--border-gold)] px-1.5 py-0.5 rounded">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-xs text-[var(--text-secondary)]">Client: {rev.clientName}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex text-[var(--accent-gold)] text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="w-3 h-3" />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setStatus(rev._id, 'approved')}
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                      rev.status === 'approved'
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30 font-semibold'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setStatus(rev._id, 'rejected')}
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                      rev.status === 'rejected'
                        ? 'border-red-500/40 text-red-400 bg-red-950/30 font-semibold'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Rejected
                  </button>
                  <button
                    onClick={() => deleteReview(rev._id)}
                    className="p-1.5 text-[var(--text-secondary)] hover:text-red-400"
                    title="Delete Review"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-base font-medium text-[var(--text-primary)]">
                &ldquo;{rev.headline}&rdquo;
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
