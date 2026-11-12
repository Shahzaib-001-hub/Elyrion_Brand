import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandMagicSparkles,
  faArrowRight,
  faFlask,
  faAward,
  faLayerGroup,
  faGift,
  faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons';
import { getProducts, getCuratedBundles } from '@/lib/data-service';
import { ProductCard } from '@/components/ProductCard';
import { HeroShowcase } from '@/components/HeroShowcase';
import { formatPrice } from '@/lib/format';

export const revalidate = 60; // 1 minute ISR

export default async function HomePage() {
  const allProducts = await getProducts({ status: 'active' });
  const featuredProducts = allProducts.slice(0, 4);
  const curatedBundles = await getCuratedBundles();
  const spotlightBundle = curatedBundles[0];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* 1. DYNAMIC WATERMARK HERO SHOWCASE (Matches user reference design) */}
      <HeroShowcase products={allProducts as any} />

      {/* 2. THE THREE PILLARS OF CRAFTSMANSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="luxury-card p-8 space-y-4">
            <div className="w-12 h-12 rounded border border-[var(--border-gold)] flex items-center justify-center text-[var(--accent-gold)]">
              <FontAwesomeIcon icon={faFlask} className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-medium">Transparent Flacons</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              We reject opaque, painted bottles. Our transparent crystal glass showcases the natural, unadulterated hue of pure oil macerations without synthetic colorants.
            </p>
          </div>

          <div className="luxury-card p-8 space-y-4">
            <div className="w-12 h-12 rounded border border-[var(--border-gold)] flex items-center justify-center text-[var(--accent-gold)]">
              <FontAwesomeIcon icon={faAward} className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-medium">Grasse Harvests</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Centifolia roses hand-picked at dawn in Grasse, wild Cambodian ouds aged over a decade, and sun-drenched Calabrian bergamots blended in small numbered batches.
            </p>
          </div>

          <div className="luxury-card p-8 space-y-4">
            <div className="w-12 h-12 rounded border border-[var(--border-gold)] flex items-center justify-center text-[var(--accent-gold)]">
              <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-medium">Artisanal London Atelier</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every single 50ml bottle is hand-poured, fitted with a bespoke champagne gold collar, and inspected by master nose artisans in our Mayfair atelier.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CREATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
          <div>
            <span className="label-editorial text-[var(--accent-gold)]">The Curated Edit</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] mt-1">
              Signature Parfums
            </h2>
          </div>
          <Link
            href="/fragrances"
            className="text-xs uppercase tracking-[0.18em] text-[var(--accent-gold)] hover:underline flex items-center gap-2 group"
          >
            <span>View All 8 Fragrances</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={String(product._id)} product={product as any} />
          ))}
        </div>
      </section>

      {/* 4. "CREATE YOUR MOOD" INTERACTIVE QUIZ CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded overflow-hidden border border-[var(--border-gold)] bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-raised)] to-[var(--bg-surface)] p-8 sm:p-14 lg:p-20 shadow-2xl">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[var(--border-gold)] bg-[var(--bg-primary)] text-[var(--accent-gold)] text-xs">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-3.5 h-3.5" />
              <span className="label-editorial text-[9px]">Olfactory Resonance AI</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light leading-tight">
              Which aura will you wear tonight?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Take our guided 3-step interactive journey: occasion, emotional aura, and seasonal intensity. Our algorithmic matcher calculates note affinities and reveals your signature scent profile.
            </p>
            <div className="pt-2">
              <Link href="/quiz" className="btn-gold btn-shine">
                Start The Mood Quiz
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPOTLIGHT BUNDLE & BESPOKE BUNDLE BUILDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Curated Set Preview */}
          <div className="luxury-card p-8 sm:p-10 space-y-6">
            <span className="label-editorial text-[var(--accent-gold)]">
              {spotlightBundle?.badge || 'Discovery Collection'}
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light">
              {spotlightBundle?.title || 'The Royal Sovereign Trio'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {spotlightBundle?.description ||
                'Experience three 50ml flacons: Oud Impérial, Santal Nuit, and Ambre Noir Réserve housed in an embossed presentation coffret.'}
            </p>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-serif font-medium text-[var(--text-primary)] tabular-nums">
                {formatPrice(spotlightBundle?.price || 52000)}
              </span>
              <span className="text-sm text-[var(--text-secondary)] line-through tabular-nums">
                {formatPrice(spotlightBundle?.compareAtPrice || 64500)}
              </span>
            </div>
            <div>
              <Link href="/bundles" className="btn-gold w-full sm:w-auto">
                Acquire The Discovery Set
              </Link>
            </div>
          </div>

          {/* Build Your Own Bundle Callout */}
          <div className="luxury-card p-8 sm:p-10 space-y-6 bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-primary)]">
            <span className="label-editorial text-[var(--accent-gold)]">Custom Wardrobe</span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light">
              Build Your Own Bundle
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Curate your personal collection of transparent 50ml flacons. Select 3 for 10% off, 5 for 15% off, or 7 for 20% off with complimentary express shipping.
            </p>
            <div className="space-y-2 py-2">
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>Tier 1: 3 Bottles</span>
                <span className="text-[var(--accent-gold)] font-semibold">10% Savings</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>Tier 2: 5 Bottles</span>
                <span className="text-[var(--accent-gold)] font-semibold">15% Savings</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>Tier 3: 7 Bottles</span>
                <span className="text-[var(--accent-gold)] font-semibold">20% Savings</span>
              </div>
            </div>
            <div>
              <Link href="/custom-bundle" className="btn-outline-gold w-full sm:w-auto">
                Enter The Bundle Atelier
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FRAGRANCE PYRAMID EXPLAINER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">The Architecture of Scent</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light mt-1">
            The Olfactory Pyramid
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-xl mx-auto mt-2">
            Every Elyrion creation is built across three melodic movements that harmonize with body warmth over 12+ hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="luxury-card p-6 text-center space-y-2">
            <span className="label-editorial text-[10px] text-[var(--accent-gold)]">First 15 Minutes</span>
            <h4 className="font-serif text-xl">Top Notes</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Volatile and sparkling essences: Sicilian bergamot, green fig leaves, and pink peppercorns that create an instant, breathtaking greeting.
            </p>
          </div>

          <div className="luxury-card p-6 text-center space-y-2 border-[var(--accent-gold)]/40">
            <span className="label-editorial text-[10px] text-[var(--accent-gold)]">2 to 6 Hours</span>
            <h4 className="font-serif text-xl">Heart Notes</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              The true character of the parfum: Grasse Centifolia rose, smoky leather, Mysore sandalwood, and white imperial tea.
            </p>
          </div>

          <div className="luxury-card p-6 text-center space-y-2">
            <span className="label-editorial text-[10px] text-[var(--accent-gold)]">6 to 18 Hours</span>
            <h4 className="font-serif text-xl">Base Notes</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Deep, fixative foundations: Royal Cambodian oud, black amber, Madagascar Bourbon vanilla, and smoked birch that leave an unforgettable memory.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CORPORATE GIFTING CONCIERGE CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="luxury-card p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-raised)]">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-[var(--accent-gold)]">
              <FontAwesomeIcon icon={faGift} className="w-4 h-4" />
              <span className="label-editorial text-[10px]">Corporate Concierge</span>
            </div>
            <h3 className="font-serif text-3xl font-light">
              Bespoke Corporate & Executive Gifting
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Impress VIP clients and executive partners with personalized flacon engraving, custom embossed wax seals, and bespoke ribboning. Volume pricing available for orders of 10+ units.
            </p>
          </div>
          <div>
            <Link href="/corporate-gifting" className="btn-gold whitespace-nowrap">
              Request Gifting Dossier
            </Link>
          </div>
        </div>
      </section>

      {/* 8. PRESS ACCLAIM & EDITORIAL REVIEWS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <span className="label-editorial text-[var(--accent-gold)]">Critical Acclaim</span>
        <div className="luxury-card p-8 sm:p-12 space-y-4">
          <FontAwesomeIcon icon={faQuoteLeft} className="w-6 h-6 text-[var(--accent-gold)] opacity-50 mx-auto" />
          <blockquote className="font-serif text-xl sm:text-2xl font-light italic leading-relaxed text-[var(--text-primary)] max-w-2xl mx-auto">
            &ldquo;Elyrion has redefined quiet luxury in British perfumery. The clarity of the transparent glass paired with the ferocious depth of Oud Impérial is an instant modern classic.&rdquo;
          </blockquote>
          <p className="label-editorial text-[10px] text-[var(--accent-gold)]">
            — The Mayfair Olfactory Review, Autumn 2026
          </p>
        </div>
      </section>
    </div>
  );
}
