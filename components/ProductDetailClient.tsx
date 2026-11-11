'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faHeart as faHeartSolid,
  faShoppingBag,
  faShieldHalved,
  faTruckFast,
  faRotateLeft,
  faPlus,
  faMinus,
  faCheck,
  faLayerGroup,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductItem } from '@/lib/mock-data';

interface ProductDetailClientProps {
  product: ProductItem;
  reviews: any[];
  relatedProducts: ProductItem[];
}

export function ProductDetailClient({
  product,
  reviews,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState(reviews);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.slug);

  const handleAddToCart = () => {
    addItem(
      {
        id: product._id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
        price: product.price,
        volume: product.volume || 50,
        concentration: product.concentration || 'EDP',
      },
      quantity
    );
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewHeadline || !reviewComment) return;

    const newRev = {
      _id: `rev_user_${Date.now()}`,
      userName: reviewName,
      rating: reviewRating,
      headline: reviewHeadline,
      comment: reviewComment,
      verifiedPurchase: true,
      createdAt: new Date(),
    };

    setLocalReviews([newRev, ...localReviews]);
    setIsReviewModalOpen(false);
    setReviewHeadline('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 sm:space-y-24">
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--text-primary)]">
          Home
        </Link>
        <span>/</span>
        <Link href="/fragrances" className="hover:text-[var(--text-primary)]">
          Fragrances
        </Link>
        <span>/</span>
        <span className="text-[var(--accent-gold)]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Studio Bottle Gallery with Zoom */}
        <div className="space-y-4">
          <div
            className="relative aspect-[4/5] rounded border border-[var(--border-gold)] bg-neutral-950 overflow-hidden cursor-zoom-in group shadow-2xl"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={`${product.name} 50ml transparent flacon`}
              fill
              priority
              className={`object-cover transition-transform duration-500 ease-out ${
                isZoomed ? 'scale-150' : 'group-hover:scale-105'
              }`}
            />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center gap-1.5">
              <FontAwesomeIcon icon={faExpand} className="w-3 h-3 text-[var(--accent-gold)]" />
              <span>{isZoomed ? 'Tap to Reset' : 'Hover / Tap to Zoom'}</span>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[11px] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
              50ml Transparent Crystal Flacon
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`relative w-20 h-24 rounded border overflow-hidden transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]/40 scale-105'
                      : 'border-[var(--border-subtle)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Olfactory Details & Purchasing */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="label-editorial text-[10px] text-[var(--accent-gold)] border border-[var(--border-gold)] px-2.5 py-0.5 rounded">
                {product.concentration}
              </span>
              <span className="label-editorial text-[10px] text-[var(--text-secondary)] border border-[var(--border-subtle)] px-2.5 py-0.5 rounded uppercase">
                {product.gender}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-light text-[var(--text-primary)]">
              {product.name}
            </h1>

            {/* Rating Stars & Aggregate */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-[var(--accent-gold)] text-xs">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="w-3 h-3" />
                ))}
              </div>
              <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                {product.rating?.average.toFixed(2)} ({localReviews.length} Verified Client Reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-1 border-t border-[var(--border-subtle)]">
            <span className="font-serif text-3xl font-medium tabular-nums text-[var(--text-primary)]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-[var(--text-secondary)] line-through tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xs text-[var(--text-secondary)]">
              (Includes 20% UK VAT • Complimentary Delivery)
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {product.description}
          </p>

          {/* Volume Specification Selector */}
          <div className="space-y-2 pt-2">
            <label className="label-editorial text-[var(--text-secondary)]">Flacon Size & Origin</label>
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded border border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-xs text-[var(--text-primary)] font-medium">
                50ml / 1.7 FL. OZ. (Signature Flacon)
              </div>
              <div className="px-4 py-2 rounded border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                Hand-poured in London, UK
              </div>
            </div>
          </div>

          {/* Add to Bag Controls */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-[var(--border-gold)] rounded bg-[var(--bg-primary)] h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  aria-label="Decrease quantity"
                >
                  <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                </button>
                <span className="w-10 text-center text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  aria-label="Increase quantity"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className="btn-gold btn-shine flex-1 h-12 text-sm"
              >
                <FontAwesomeIcon icon={faShoppingBag} className="mr-2 w-4 h-4" />
                Add To Fragrance Bag
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.slug)}
                className={`w-12 h-12 rounded border flex items-center justify-center transition-colors ${
                  isFavorited
                    ? 'border-red-500 text-red-500 bg-red-500/10'
                    : 'border-[var(--border-gold)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)]'
                }`}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FontAwesomeIcon
                  icon={isFavorited ? faHeartSolid : faHeartRegular}
                  className="w-4 h-4"
                />
              </button>
            </div>

            {addedAlert && (
              <div className="p-3 bg-[var(--bg-raised)] border border-[var(--border-gold)] rounded text-xs text-[var(--accent-gold)] flex items-center gap-2 animate-fadeIn">
                <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
                <span>{quantity}x {product.name} added to your bag.</span>
              </div>
            )}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faTruckFast} className="text-[var(--accent-gold)] w-3.5 h-3.5 shrink-0" />
              <span>Complimentary Tracked Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[var(--accent-gold)] w-3.5 h-3.5 shrink-0" />
              <span>IFRA Certified Safe Formulation</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faRotateLeft} className="text-[var(--accent-gold)] w-3.5 h-3.5 shrink-0" />
              <span>Includes 2ml Testing Vial</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE OLFACTORY PYRAMID VISUALIZER */}
      <div className="luxury-card p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="label-editorial text-[var(--accent-gold)]">Composition Breakdown</span>
          <h2 className="font-serif text-3xl font-light">The Fragrance Pyramid</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Crafted with high natural essence maceration for 14+ hour projection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Top */}
          <div className="p-6 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center space-y-3">
            <span className="label-editorial text-[10px] text-[var(--accent-gold)]">
              Opening (0 – 20 min)
            </span>
            <h3 className="font-serif text-xl">Top Notes</h3>
            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              {product.notes.top.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Heart */}
          <div className="p-6 rounded bg-[var(--bg-primary)] border border-[var(--border-gold)] text-center space-y-3 shadow-lg">
            <span className="label-editorial text-[10px] text-[var(--accent-gold)] font-bold">
              The Soul (2 – 6 hrs)
            </span>
            <h3 className="font-serif text-xl text-[var(--accent-gold)]">Heart Notes</h3>
            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              {product.notes.heart.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded bg-[var(--bg-surface)] border border-[var(--border-gold)] text-[var(--accent-gold)] font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Base */}
          <div className="p-6 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center space-y-3">
            <span className="label-editorial text-[10px] text-[var(--accent-gold)]">
              The Trail (6 – 16 hrs)
            </span>
            <h3 className="font-serif text-xl">Base Notes</h3>
            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              {product.notes.base.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. PAIRS WELL WITH / DISCOVERY BUNDLE RECOMMENDATION */}
      <div className="luxury-card p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-raised)] to-[var(--bg-surface)]">
        <div className="space-y-2">
          <span className="label-editorial text-[var(--accent-gold)] flex items-center gap-1.5">
            <FontAwesomeIcon icon={faLayerGroup} className="w-3.5 h-3.5" />
            Curated Discovery Trio
          </span>
          <h3 className="font-serif text-2xl font-light">Pairs Exquisitely In A Discovery Set</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-lg">
            Add {product.name} to a 3-piece bespoke bundle and unlock 10% privilege savings plus complimentary gift boxing.
          </p>
        </div>
        <div>
          <Link href="/custom-bundle" className="btn-outline-gold whitespace-nowrap">
            Build Your Own Trio
          </Link>
        </div>
      </div>

      {/* 4. VERIFIED CLIENT REVIEWS */}
      <div className="space-y-8 pt-8 border-t border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="label-editorial text-[var(--accent-gold)]">Client Testimony</span>
            <h2 className="font-serif text-3xl font-light">Client Reviews</h2>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="btn-outline-gold text-xs"
          >
            Leave An Olfactory Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localReviews.map((rev) => (
            <div key={rev._id} className="luxury-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-[var(--accent-gold)] text-xs">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="w-3 h-3" />
                  ))}
                </div>
                {rev.verifiedPurchase && (
                  <span className="text-[10px] text-[var(--accent-gold)] border border-[var(--border-gold)] px-2 py-0.5 rounded">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
              <h4 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                &ldquo;{rev.headline}&rdquo;
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {rev.comment}
              </p>
              <div className="pt-2 text-[11px] text-[var(--text-secondary)]">
                — {rev.userName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-gold)] rounded p-8 space-y-4">
            <h3 className="font-serif text-2xl font-medium">Review {product.name}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Lord Julian Sterling"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-2.5 rounded text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Rating (1 to 5 Stars)</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-2.5 rounded text-[var(--text-primary)]"
                >
                  <option value={5}>5 Stars - Pure Olfactory Masterpiece</option>
                  <option value={4}>4 Stars - Exceptional Quality & Sillage</option>
                  <option value={3}>3 Stars - Satisfactory</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Headline</label>
                <input
                  type="text"
                  required
                  value={reviewHeadline}
                  onChange={(e) => setReviewHeadline(e.target.value)}
                  placeholder="e.g. Magnificent longevity on skin"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-2.5 rounded text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Your Review</label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the note progression, dry-down, and projection..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-2.5 rounded text-[var(--text-primary)]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold flex-1">
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="btn-outline-gold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
