'use client';

import { useState } from 'react';
import { TabbiedArtwork } from 'tabbied/react';
import { artworks } from 'tabbied/artworks';
import type { GalleryItem } from 'lib/artwork';
import { galleryThumbnails } from './galleryThumbnails';
import styles from './SelectArtwork.module.css';

const DEFAULT_RENDER = { width: 800, height: 800 };

// Each card redraws every 2.5–4s; the random spread keeps the cards out of
// phase so the gallery shimmers card by card instead of strobing in unison.
const REDRAW_INTERVAL_MS = 2500;
const REDRAW_STAGGER_MS = 1500;

export default function GalleryDoodleInner({
  item,
  paused = false,
  onReady,
}: {
  item: GalleryItem;
  /** Skip reseed ticks (set while the card is outside the viewport). */
  paused?: boolean;
  /** Called once the doodle has been measured and first painted. */
  onReady?: () => void;
}) {
  const config = galleryThumbnails[item.slug];

  const [redrawInterval] = useState(
    () => REDRAW_INTERVAL_MS + Math.random() * REDRAW_STAGGER_MS
  );

  // Thumbnails show the design at its default color count: the active slice
  // of the palette (TabbiedArtwork expands it so the style's higher color
  // slots alias back into the active inks, mirroring what the editor renders
  // when it opens).
  const baseColors = config?.palette ?? item.palette;
  const defaultCount = item.colors?.default ?? baseColors.length;

  // No seed prop: a fresh random seed per mount keeps the gallery dynamic —
  // every visit draws a new variation of each design — and redrawInterval
  // rotates it from there (paused while the card is out of view, and skipped
  // for reduced motion / hidden tabs). The cover fit reproduces the
  // fixed-resolution + transform-scale technique, so fixed-px strokes and
  // shadows keep the proportions of the original 800px artwork at any card
  // size. onReady fires on first paint, letting the parent drop its shimmer.
  return (
    <TabbiedArtwork
      artwork={artworks[item.slug]}
      palette={baseColors.slice(0, defaultCount)}
      options={config?.options}
      fit="cover"
      coverRender={{ ...DEFAULT_RENDER, ...config?.render }}
      redrawInterval={redrawInterval}
      paused={paused}
      onReady={onReady}
      className={styles.doodleThumbInner}
    />
  );
}
