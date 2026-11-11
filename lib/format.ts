/**
 * Formats minor unit prices (e.g. 14500 pence) to a luxury currency string (£145.00).
 */
export function formatPrice(
  amountInMinorUnits: number,
  currency: string = 'GBP',
  locale: string = 'en-GB'
): string {
  const amount = amountInMinorUnits / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculates percentage discount savings.
 */
export function calculateSavingsPercent(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Format date in luxury editorial style (e.g. "12 November 2026")
 */
export function formatEditorialDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
