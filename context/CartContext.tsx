'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export interface CartItem {
  id: string; // product id or composite id
  slug: string;
  name: string;
  image: string;
  price: number; // in minor units (pence)
  quantity: number;
  volume: number; // 50ml
  concentration: string;
  bundleTag?: string; // e.g. "Bespoke Trio (10% Off)"
}

export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  finalTotal: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon | null) => void;
  freeShippingThreshold: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'elyrion_cart_v1';
const FREE_SHIPPING_THRESHOLD = 15000; // £150.00
const STANDARD_SHIPPING_COST = 1000; // £10.00

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items, isInitialized]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: AppliedCoupon | null) => {
    setAppliedCoupon(coupon);
  };

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const discountTotal = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * appliedCoupon.discountValue) / 100);
    }
    if (appliedCoupon.discountType === 'fixed') {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const shippingTotal = useMemo(() => {
    if (items.length === 0) return 0;
    if (appliedCoupon?.discountType === 'free_shipping') return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return STANDARD_SHIPPING_COST;
  }, [items.length, appliedCoupon, subtotal]);

  const finalTotal = useMemo(
    () => Math.max(0, subtotal - discountTotal + shippingTotal),
    [subtotal, discountTotal, shippingTotal]
  );

  const freeShippingProgress = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [subtotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        subtotal,
        discountTotal,
        shippingTotal,
        finalTotal,
        appliedCoupon,
        applyCoupon,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
