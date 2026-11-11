'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGift,
  faCheck,
  faBuilding,
  faCertificate,
  faTruckFast,
  faUpload,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

export default function CorporateGiftingPage() {
  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    quantity: 25,
    budget: '£3,000 – £5,000',
    deliveryDate: '',
    customMessage: '',
    logoUrl: '',
    logoPublicId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      // 1. Fetch signed upload credentials from our API
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'elyrion/corporate-logos' }),
      });
      const signData = await signRes.json();

      // 2. Perform direct signed upload to Cloudinary (or mock fallback if credentials mock)
      if (signData.signature && signData.signature !== 'mock_signature_dev') {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('api_key', signData.apiKey);
        uploadFormData.append('timestamp', signData.timestamp);
        uploadFormData.append('signature', signData.signature);
        uploadFormData.append('folder', signData.folder);

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
          {
            method: 'POST',
            body: uploadFormData,
          }
        );

        if (cloudinaryRes.ok) {
          const cData = await cloudinaryRes.json();
          setFormData((prev) => ({
            ...prev,
            logoPublicId: cData.public_id,
            logoUrl: cData.secure_url,
          }));
          return;
        }
      }

      // Local mock preview if API secret is in dev mode
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          logoUrl: event.target?.result as string,
          logoPublicId: `corporate_logo_${Date.now()}`,
        }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('Logo upload error, using local preview', err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/corporate-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit quote inquiry.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded border border-[var(--border-gold)] bg-[var(--bg-surface)] text-[var(--accent-gold)] text-xs">
          <FontAwesomeIcon icon={faGift} className="w-3.5 h-3.5" />
          <span className="label-editorial text-[9px]">Private Concierge Service</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-light">
          Corporate & Executive Gifting
        </h1>
        <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
          Bespoke olfactory gifts that honor your most valued clients, board members, and executive teams. Transparent 50ml flacons adorned with custom laser engraving, tailored silk ribboning, and personalized calligraphy.
        </p>
      </div>

      {/* Services Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="luxury-card p-8 space-y-3">
          <div className="w-10 h-10 rounded border border-[var(--border-gold)] flex items-center justify-center text-[var(--accent-gold)]">
            <FontAwesomeIcon icon={faCertificate} className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-xl font-medium">Bespoke Laser Engraving</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Personalize each transparent glass flacon with recipient monograms, names, or your company crest etched directly into the crystal glass.
          </p>
        </div>

        <div className="luxury-card p-8 space-y-3">
          <div className="w-10 h-10 rounded border border-[var(--border-gold)] flex items-center justify-center text-[var(--accent-gold)]">
            <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-xl font-medium">Tailored Packaging & Seals</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Hand-stamped gold wax seals, heavy linen coffrets, and bespoke grosgrain ribbons matched to your brand’s signature Pantone colors.
          </p>
        </div>

        <div className="luxury-card p-8 space-y-3">
          <div className="w-10 h-10 rounded border border-[var(--border-gold)] flex items-center justify-center text-[var(--accent-gold)]">
            <FontAwesomeIcon icon={faTruckFast} className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-xl font-medium">Global White-Glove Dispatch</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Direct individual dispatch to international client addresses or consolidated palleted delivery to your headquarters with dedicated tracking.
          </p>
        </div>
      </div>

      {/* Bulk Pricing Tiers Table */}
      <div className="luxury-card p-8 sm:p-10 space-y-6">
        <div className="border-b border-[var(--border-subtle)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="label-editorial text-[var(--accent-gold)]">Transparent Investment</span>
            <h3 className="font-serif text-2xl font-light">Corporate Volume Privilege Tiers</h3>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">Minimum corporate commitment: 10 units</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Volume Tier</th>
                <th className="py-3 px-4">Privilege Discount</th>
                <th className="py-3 px-4">Bespoke Inclusions</th>
                <th className="py-3 px-4">Turnaround Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
              <tr>
                <td className="py-4 px-4 font-medium">10 – 24 Units</td>
                <td className="py-4 px-4 font-bold text-[var(--accent-gold)]">15% Off Total</td>
                <td className="py-4 px-4 text-[var(--text-secondary)]">
                  Complimentary flacon monogramming & branded greeting cards
                </td>
                <td className="py-4 px-4 text-[var(--text-secondary)]">5 – 7 Business Days</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium">25 – 49 Units</td>
                <td className="py-4 px-4 font-bold text-[var(--accent-gold)]">20% Off Total</td>
                <td className="py-4 px-4 text-[var(--text-secondary)]">
                  Custom embossed gold wax seal + tailored grosgrain ribbons
                </td>
                <td className="py-4 px-4 text-[var(--text-secondary)]">7 – 10 Business Days</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium">50+ Units</td>
                <td className="py-4 px-4 font-bold text-[var(--accent-gold)]">25% Off Total</td>
                <td className="py-4 px-4 text-[var(--text-secondary)]">
                  Full custom linen coffret + dedicated Mayfair concierge manager
                </td>
                <td className="py-4 px-4 text-[var(--text-secondary)]">10 – 14 Business Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Request Form */}
      <div className="luxury-card p-8 sm:p-12 max-w-3xl mx-auto shadow-2xl">
        {submitted ? (
          <div className="text-center py-12 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full border border-[var(--border-gold)] mx-auto flex items-center justify-center text-[var(--accent-gold)]">
              <FontAwesomeIcon icon={faCheck} className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-3xl font-medium">Inquiry Received</h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Your bespoke corporate gifting request has been delivered to the Elyrion Concierge. A dedicated account director will review your requirements and provide a detailed dossier within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  company: '',
                  contactName: '',
                  email: '',
                  phone: '',
                  quantity: 25,
                  budget: '£3,000 – £5,000',
                  deliveryDate: '',
                  customMessage: '',
                  logoUrl: '',
                  logoPublicId: '',
                });
              }}
              className="btn-outline-gold mt-4"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-[var(--border-subtle)] pb-4 text-center">
              <span className="label-editorial text-[var(--accent-gold)]">Inquiry Form</span>
              <h2 className="font-serif text-3xl font-light mt-1">Request A Bespoke Quote</h2>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-500/50 rounded text-red-200 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Sterling Capital Partners"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Contact Person *</label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. e.vance@sterling.com"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Telephone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +44 20 7946 0192"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Estimated Quantity (Units) *</label>
                <input
                  type="number"
                  min={10}
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Target Budget Tier *</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                >
                  <option value="£1,500 – £3,000">£1,500 – £3,000</option>
                  <option value="£3,000 – £5,000">£3,000 – £5,000</option>
                  <option value="£5,000 – £10,000">£5,000 – £10,000</option>
                  <option value="£10,000+">£10,000+ (Imperial Concierge)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 text-[var(--text-secondary)]">Desired Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              {/* Optional Company Logo for Engraving */}
              <div className="sm:col-span-2">
                <label className="block mb-1 text-[var(--text-secondary)]">
                  Company Crest / Logo (Optional for engraving preview)
                </label>
                <div className="border border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-gold)] rounded p-4 text-center cursor-pointer relative bg-[var(--bg-primary)]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {isUploadingLogo ? (
                    <div className="flex items-center justify-center gap-2 text-[var(--accent-gold)] text-xs">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" />
                      <span>Optimizing Crest Asset...</span>
                    </div>
                  ) : formData.logoUrl ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden border border-[var(--border-gold)]">
                        <Image src={formData.logoUrl} alt="Logo preview" fill className="object-contain" />
                      </div>
                      <span className="text-xs text-[var(--accent-gold)] font-medium">
                        ✓ Logo Attached Successfully
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-[var(--text-secondary)] space-y-1">
                      <FontAwesomeIcon icon={faUpload} className="w-4 h-4 text-[var(--accent-gold)] mx-auto" />
                      <p>Click or drag your high-res SVG / PNG company logo here</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 text-[var(--text-secondary)]">
                  Bespoke Notes / Custom Engraving Instructions
                </label>
                <textarea
                  rows={4}
                  value={formData.customMessage}
                  onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                  placeholder="Specify fragrance selections, personalized card calligraphy text, or international delivery locations..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold btn-shine w-full py-3"
            >
              {isSubmitting ? 'Transmitting to Concierge...' : 'Submit Bespoke Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
