'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faTrashAlt,
  faShoppingBag,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';

export default function WishlistPage() {
  const { wishlistSlugs, toggleWishlist } = useWishlist();
  const { addItem, setIsCartOpen } = useCart();

  const favoritedProducts = INITIAL_PRODUCTS.filter((p) =>
    wishlistSlugs.includes(p.slug)
  );

  const handleMoveToBag = (product: (typeof INITIAL_PRODUCTS)[0]) => {
    addItem({
      id: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      volume: 50,
      concentration: product.concentration,
    });
    toggleWishlist(product.slug);
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-4 flex items-center justify-between">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Personal Atelier</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light mt-1">
            Saved Fragrances ({wishlistSlugs.length})
          </h1>
        </div>
        <Link href="/fragrances" className="text-xs uppercase tracking-wider text-[var(--accent-gold)] hover:underline">
          Explore All Fragrances
        </Link>
      </div>

      {favoritedProducts.length === 0 ? (
        <div className="luxury-card p-16 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full border border-[var(--border-gold)] mx-auto flex items-center justify-center text-[var(--accent-gold)]">
            <FontAwesomeIcon icon={faHeart} className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-light">Your Wishlist is Empty</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Save your favorite transparent flacons to revisit or add directly to your bespoke discovery wardrobe.
          </p>
          <Link href="/fragrances" className="btn-gold btn-shine">
            Browse Scent Wardrobe
            <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritedProducts.map((product) => (
            <div key={product._id} className="luxury-card p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/5] rounded overflow-hidden bg-neutral-950 mb-3">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(product.slug)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-red-400 hover:text-red-300 flex items-center justify-center"
                    aria-label="Remove from wishlist"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="label-editorial text-[10px] text-[var(--accent-gold)]">
                    {product.concentration} • 50ml
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <Link href={`/fragrances/${product.slug}`}>
                  <h3 className="font-serif text-xl font-medium mt-1 text-[var(--text-primary)] hover:text-[var(--accent-gold)]">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">
                  {product.description}
                </p>
              </div>

              <button
                onClick={() => handleMoveToBag(product)}
                className="btn-gold btn-shine w-full text-xs py-2.5"
              >
                <FontAwesomeIcon icon={faShoppingBag} className="mr-2 w-3.5 h-3.5" />
                Move to Fragrance Bag
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
