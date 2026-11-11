'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
        aria-label="Toggle theme"
      >
        <span className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <FontAwesomeIcon
        icon={isDark ? faSun : faMoon}
        className="w-4 h-4 transition-transform duration-300 hover:rotate-45"
      />
    </button>
  );
}
