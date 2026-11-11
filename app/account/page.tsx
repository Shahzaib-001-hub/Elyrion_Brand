'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBox,
  faHeart,
  faSignOutAlt,
  faLocationDot,
  faShieldHalved,
  faSpinner,
  faCheck,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { formatPrice, formatEditorialDate } from '@/lib/format';
import { useWishlist } from '@/context/WishlistContext';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';

export default function AccountPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Orders mock state
  const [orders, setOrders] = useState<any[]>([]);

  const { wishlistSlugs, wishlistCount } = useWishlist();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
        // Load mock orders
        setOrders([
          {
            orderNumber: 'ELY-98231',
            date: new Date('2026-11-09T14:20:00Z'),
            status: 'shipped',
            total: 21000,
            tracking: 'RM-774920192-GB',
            items: [
              {
                name: 'Oud Impérial',
                volume: 50,
                concentration: 'Parfum',
                image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400',
              },
            ],
          },
        ]);
      }
    } catch (e) {
      console.warn('Auth check error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
      } else {
        setAuthError(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Register error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[var(--accent-gold)] w-6 h-6" />
      </div>
    );
  }

  // If not logged in, show luxury login / registration
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="label-editorial text-[var(--accent-gold)]">Private Client Salon</span>
          <h1 className="font-serif text-3xl font-light">Client Sign In</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Access your order history, saved addresses, and private olfactory privileges.
          </p>
        </div>

        <div className="luxury-card p-6 sm:p-8 space-y-6">
          {/* Mode Switch Tabs */}
          <div className="flex border-b border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
              }}
              className={`flex-1 py-3 text-center uppercase tracking-wider font-medium border-b-2 transition-colors ${
                authMode === 'login'
                  ? 'border-[var(--accent-gold)] text-[var(--accent-gold)]'
                  : 'border-transparent text-[var(--text-secondary)]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setAuthError('');
              }}
              className={`flex-1 py-3 text-center uppercase tracking-wider font-medium border-b-2 transition-colors ${
                authMode === 'register'
                  ? 'border-[var(--accent-gold)] text-[var(--accent-gold)]'
                  : 'border-transparent text-[var(--text-secondary)]'
              }`}
            >
              Register
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded text-red-200 text-xs">
              {authError}
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lord.sterling@mayfair.com"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-gold btn-shine w-full py-3"
              >
                {authLoading ? 'Signing in...' : 'Enter Private Salon'}
              </button>

              {/* 1-click quick demo buttons */}
              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
                <span className="label-editorial text-[9px] text-[var(--text-secondary)] block text-center">
                  Quick Access Profiles
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('concierge@elyrion.com');
                      setPassword('ElyrionLuxury2026!');
                    }}
                    className="p-2 border border-[var(--border-gold)] rounded text-[10px] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 text-center"
                  >
                    Super Admin Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('client@mayfair.com');
                      setPassword('ElyrionClient123!');
                    }}
                    className="p-2 border border-[var(--border-subtle)] rounded text-[10px] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] text-center"
                  >
                    VIP Client Profile
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lord Julian Sterling"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@mayfair.com"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] p-3 rounded text-[var(--text-primary)]"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-gold btn-shine w-full py-3"
              >
                {authLoading ? 'Registering...' : 'Create Client Profile'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Authenticated Client Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Private Salon Profile</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light mt-1">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {currentUser.email} • Role:{' '}
            <span className="text-[var(--accent-gold)] uppercase tracking-wider font-semibold">
              {currentUser.role}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role !== 'customer' && (
            <Link href="/admin" className="btn-outline-gold text-xs py-2">
              <FontAwesomeIcon icon={faShieldHalved} className="mr-2 w-3.5 h-3.5 text-[var(--accent-gold)]" />
              Staff Hub
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-[var(--border-subtle)] rounded text-xs text-[var(--text-secondary)] hover:text-red-400 hover:border-red-400/50 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="luxury-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-editorial text-[10px] text-[var(--text-secondary)]">Orders</span>
            <FontAwesomeIcon icon={faBox} className="text-[var(--accent-gold)] w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-medium">{orders.length}</div>
          <p className="text-xs text-[var(--text-secondary)]">Lifetime orders placed</p>
        </div>

        <Link href="/account/wishlist" className="luxury-card p-6 space-y-2 hover:border-[var(--accent-gold)] transition-colors">
          <div className="flex items-center justify-between">
            <span className="label-editorial text-[10px] text-[var(--text-secondary)]">Wishlist</span>
            <FontAwesomeIcon icon={faHeart} className="text-red-400 w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-medium">{wishlistCount}</div>
          <p className="text-xs text-[var(--text-secondary)]">Saved creations</p>
        </Link>

        <div className="luxury-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-editorial text-[10px] text-[var(--text-secondary)]">Concierge Status</span>
            <FontAwesomeIcon icon={faUser} className="text-[var(--accent-gold)] w-4 h-4" />
          </div>
          <div className="font-serif text-2xl font-medium text-[var(--accent-gold)]">
            VIP Connoisseur
          </div>
          <p className="text-xs text-[var(--text-secondary)]">Complimentary UK White-Glove Dispatch</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="luxury-card p-6 sm:p-8 space-y-6">
        <h2 className="font-serif text-2xl font-light border-b border-[var(--border-subtle)] pb-4">
          Recent Olfactory Dispatches
        </h2>

        {orders.length === 0 ? (
          <p className="text-xs text-[var(--text-secondary)] py-6 text-center">
            No order dispatches recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)] space-y-4">
            {orders.map((ord) => (
              <div key={ord.orderNumber} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="relative w-14 h-16 rounded border border-[var(--border-subtle)] overflow-hidden bg-neutral-950 shrink-0">
                    <Image src={ord.items[0]?.image} alt={ord.items[0]?.name} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-[var(--accent-gold)] font-bold">
                      {ord.orderNumber}
                    </span>
                    <h3 className="font-serif text-lg font-medium">{ord.items[0]?.name}</h3>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Placed on {formatEditorialDate(ord.date)} • Tracking:{' '}
                      <span className="font-mono text-[var(--text-primary)]">{ord.tracking}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <div>
                    <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)] block">
                      {formatPrice(ord.total)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {ord.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Addresses */}
      <div className="luxury-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <h2 className="font-serif text-2xl font-light">Saved Residences & Delivery Addresses</h2>
          <span className="text-xs text-[var(--accent-gold)]">Primary Residence</span>
        </div>
        <div className="p-4 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1">
          <div className="font-serif text-base text-[var(--text-primary)] font-medium">
            {currentUser.name}
          </div>
          <p>14 Berkeley Square, Mayfair</p>
          <p>London, W1J 6BQ, United Kingdom</p>
        </div>
      </div>
    </div>
  );
}
