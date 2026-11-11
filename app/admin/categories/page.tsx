'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faCheck, faTags } from '@fortawesome/free-solid-svg-icons';
import { INITIAL_CATEGORIES } from '@/lib/mock-data';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isCollection, setIsCollection] = useState(false);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const slug = newName.toLowerCase().replace(/\s+/g, '-');
    const newCat = {
      name: newName,
      slug,
      description: newDescription || `${newName} olfactory curations.`,
      order: categories.length + 1,
      isCollection,
    };

    setCategories([...categories, newCat]);
    setNewName('');
    setNewDescription('');
  };

  const removeCategory = (slug: string) => {
    setCategories(categories.filter((c) => c.slug !== slug));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Taxonomy Management</span>
          <h1 className="font-serif text-3xl font-light mt-1">Categories & Curated Collections</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Create Category */}
        <div className="lg:col-span-5 luxury-card p-6 space-y-4">
          <h2 className="font-serif text-xl font-medium border-b border-[var(--border-subtle)] pb-3">
            Add Category / Collection
          </h2>
          <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Category Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Rare Resins"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block mb-1 text-[var(--text-secondary)]">Description</label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Editorial category explanation..."
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCollection"
                checked={isCollection}
                onChange={(e) => setIsCollection(e.target.checked)}
                className="accent-[var(--accent-gold)]"
              />
              <label htmlFor="isCollection" className="text-xs text-[var(--text-primary)] cursor-pointer">
                Mark as Featured Curated Collection
              </label>
            </div>
            <button type="submit" className="btn-gold w-full py-2.5">
              <FontAwesomeIcon icon={faPlus} className="mr-1.5 w-3 h-3" />
              Add To Taxonomy
            </button>
          </form>
        </div>

        {/* Right Table */}
        <div className="lg:col-span-7 luxury-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-secondary)] uppercase tracking-wider text-[10px] bg-[var(--bg-raised)]/50">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {categories.map((c) => (
                <tr key={c.slug} className="hover:bg-[var(--bg-raised)]/40 transition-colors">
                  <td className="py-3 px-4 font-serif text-base font-medium">{c.name}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[var(--text-secondary)]">/{c.slug}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                        c.isCollection
                          ? 'border-[var(--border-gold)] text-[var(--accent-gold)] bg-[var(--accent-gold)]/10'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {c.isCollection ? 'Collection' : 'Category'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => removeCategory(c.slug)}
                      className="text-[var(--text-secondary)] hover:text-red-400 p-1"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="w-3.5 h-3.5" />
                    </button>
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
