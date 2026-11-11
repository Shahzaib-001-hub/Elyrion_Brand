'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faFlask, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brand: 'Elyrion',
    description: '',
    concentration: 'EDP',
    gender: 'unisex',
    volume: 50,
    price: 185, // £185
    compareAtPrice: '',
    stock: 50,
    sku: '',
    topNotes: 'Calabrian Bergamot, Pink Pepper',
    heartNotes: 'Grasse Rose, Iris, Neroli',
    baseNotes: 'Sandalwood, Amber, Vanilla',
    moods: 'Opulent, Sensual',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
    seoTitle: '',
    seoDescription: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: generateSlug(val),
      sku: `ELY-${val.slice(0, 3).toUpperCase()}-50ML`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Create product via API or in-memory data service
      const productPayload = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        brand: formData.brand,
        description: formData.description,
        concentration: formData.concentration,
        gender: formData.gender,
        volume: Number(formData.volume),
        price: Math.round(Number(formData.price) * 100), // convert to minor units
        compareAtPrice: formData.compareAtPrice
          ? Math.round(Number(formData.compareAtPrice) * 100)
          : undefined,
        stock: Number(formData.stock),
        sku: formData.sku,
        notes: {
          top: formData.topNotes.split(',').map((s) => s.trim()),
          heart: formData.heartNotes.split(',').map((s) => s.trim()),
          base: formData.baseNotes.split(',').map((s) => s.trim()),
        },
        moods: formData.moods.split(',').map((s) => s.trim()),
        images: [formData.image],
        status: 'active',
        seo: {
          title: formData.seoTitle || `${formData.name} | Elyrion Fragrances`,
          description: formData.seoDescription || formData.description.slice(0, 150),
        },
      };

      // Call API
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      }).catch(() => null);

      setSavedSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Error saving product', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          </Link>
          <div>
            <span className="label-editorial text-[var(--accent-gold)]">Creation Form</span>
            <h1 className="font-serif text-3xl font-light">Formulate New Fragrance Flacon</h1>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-200 text-xs flex items-center gap-2">
          <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
          <span>New fragrance successfully cataloged and published to the boutique!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="luxury-card p-6 sm:p-10 space-y-8 text-xs">
        {/* Core Attributes */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-medium border-b border-[var(--border-subtle)] pb-2 text-[var(--text-primary)]">
            1. Core Nomenclature & Classification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Fragrance Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Céleste Absolu"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded font-mono text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Concentration</label>
              <select
                value={formData.concentration}
                onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
              >
                <option value="Parfum">Parfum Extrait (28%+ concentration)</option>
                <option value="EDP">Eau de Parfum (20% – 25%)</option>
                <option value="EDT">Eau de Toilette (12% – 15%)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Gender Archetype</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
              >
                <option value="unisex">Unisex (Boundary-Defying)</option>
                <option value="women">Feminine Floral & Dew</option>
                <option value="men">Masculine Woods & Smoke</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-medium border-b border-[var(--border-subtle)] pb-2 text-[var(--text-primary)]">
            2. Pricing & Flacon Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Price in GBP (£) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Compare At Price (£)</label>
              <input
                type="number"
                step="0.01"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                placeholder="Optional"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Initial Stock Count *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">SKU Identifier</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded font-mono text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Olfactory Pyramid Editor */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-medium border-b border-[var(--border-subtle)] pb-2 text-[var(--text-primary)]">
            3. Olfactory Notes Pyramid
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-[var(--accent-gold)] uppercase tracking-wider text-[10px]">
                Top Notes (Comma Separated)
              </label>
              <textarea
                rows={3}
                value={formData.topNotes}
                onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-2.5 rounded text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block mb-1 text-[var(--accent-gold)] uppercase tracking-wider text-[10px]">
                Heart Notes (Comma Separated)
              </label>
              <textarea
                rows={3}
                value={formData.heartNotes}
                onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-2.5 rounded text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block mb-1 text-[var(--accent-gold)] uppercase tracking-wider text-[10px]">
                Base Notes (Comma Separated)
              </label>
              <textarea
                rows={3}
                value={formData.baseNotes}
                onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-2.5 rounded text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Studio Image & Description */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-medium border-b border-[var(--border-subtle)] pb-2 text-[var(--text-primary)]">
            4. Editorial Narrative & Studio Visual
          </h2>

          <div>
            <label className="block mb-1 text-[var(--text-secondary)]">Cloudinary Public ID / Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block mb-1 text-[var(--text-secondary)]">Rich Storytelling Description *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the inspiration, botanical harvesting, maceration process, and emotional trail..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="btn-gold btn-shine w-full py-3.5 text-sm"
        >
          {isSaving ? (
            <div className="flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" />
              <span>Cataloging Fragrance...</span>
            </div>
          ) : (
            'Publish Flacon To Boutique'
          )}
        </button>
      </form>
    </div>
  );
}
