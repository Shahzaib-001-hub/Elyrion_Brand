import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { SalesPopup } from '@/components/SalesPopup';

config.autoAddCss = false;

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Elyrion Fragrances',
    default: 'Elyrion Fragrances | Haute Parfumerie & Artisanal Perfumes',
  },
  description:
    'Step into the ethereal world of Elyrion Fragrances. Handcrafted in the UK using rare botanical essences, transparent flacons, and timeless olfactory art.',
  keywords: [
    'luxury perfume',
    'haute parfumerie',
    'artisanal fragrances',
    'oud',
    'amber',
    'niche perfumes',
    'transparent glass bottle',
    'Elyrion',
  ],
  authors: [{ name: 'Elyrion Parfums London' }],
  openGraph: {
    title: 'Elyrion Fragrances | Haute Parfumerie',
    description: 'Bespoke, artisanal fragrances handcrafted in the UK.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Elyrion Fragrances',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <WishlistProvider>
            <CartProvider>
              <AnnouncementBanner />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <SalesPopup />
            </CartProvider>
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
