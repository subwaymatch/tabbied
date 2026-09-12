import { Cormorant_Garamond, EB_Garamond, IBM_Plex_Mono } from 'next/font/google';

/**
 * The mono that carries every label, eyebrow and figure in the 2026 design.
 *
 * Declared here and applied per route rather than in the root layout, so only
 * the routes that use it preload it - the docs and legal pages are still the
 * older light theme and never ask for it. next/font memoises by call site, so
 * importing this from several pages emits one font, not one per page.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

/**
 * The editor's plate caption, and only that - a serif is what makes the stage
 * read as a print of the pattern rather than a preview of it. Loaded on the
 * editor route alone.
 */
export const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
  display: 'swap',
});

/**
 * The wordmark, and only the wordmark. Unlike the two above it is applied in
 * the root layout rather than per route: the lockup sits in the masthead of
 * every page that has one, so loading it per route would be the same file
 * requested from a dozen call sites with a preload missing from whichever one
 * was forgotten. One weight, one size, latin only.
 */
export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-cormorant',
  display: 'swap',
});
