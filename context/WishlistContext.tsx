'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WishlistContextType {
  wishlistSlugs: string[];
  toggleWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'elyrion_wishlist_v1';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        setWishlistSlugs(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read wishlist from storage', e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistSlugs));
    } catch (e) {
      console.warn('Could not save wishlist to storage', e);
    }
  }, [wishlistSlugs, isInitialized]);

  const toggleWishlist = (slug: string) => {
    setWishlistSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const isInWishlist = (slug: string) => wishlistSlugs.includes(slug);

  return (
    <WishlistContext.Provider
      value={{
        wishlistSlugs,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistSlugs.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
