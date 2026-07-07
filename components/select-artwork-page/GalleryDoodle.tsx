'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { GalleryItem } from 'lib/artwork';
import { galleryThumbnails } from './galleryThumbnails';
import styles from './SelectArtwork.module.css';

// css-doodle registers a browser custom element on import, so the renderer can
// only run on the client. The square frame is rendered here (outside the lazy
// boundary) so the card reserves its space and nothing shifts when the doodle
// mounts.
const GalleryDoodleInner = dynamic(() => import('./GalleryDoodleInner'), {
  ssr: false,
});

// How far outside the viewport a card starts rendering its doodle. Generous
// enough that scrolling at a normal pace never catches an unmounted card,
// small enough that the initial load only renders the first screenful or two.
const MOUNT_MARGIN = '400px';

// Whether a hex background reads as dark, so the loading shimmer can sweep a
// light band over dark cards and a dark band over light ones. Defaults to
// "light" when the color can't be parsed (e.g. a transparent #rrggbbaa).
export const isDarkColor = (hex: string): boolean => {
  const match = /^#([0-9a-f]{6})/i.exec(hex ?? '');

  if (!match) {
    return false;
  }

  const int = parseInt(match[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  // Perceived luminance (sRGB-weighted), normalized to 0-1.
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5;
};

export default function GalleryDoodle({
  item,
  palette,
}: {
  item: GalleryItem;
  /** Preview palette override (color0 first) — e.g. an active brand palette. */
  palette?: string[];
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  // The gallery holds 100+ live doodles; rendering and reseeding all of them
  // at once chokes the main thread. Each card mounts its doodle only once it
  // approaches the viewport (and then stays mounted), and keeps its reseed
  // animation running only while it remains nearby — so the total work is
  // bounded by the viewport, not by the size of the gallery.
  const [hasApproached, setHasApproached] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = frameRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Multiple transitions can be batched into one callback (fast
        // scrolling); the last entry is the current state.
        const intersecting = entries[entries.length - 1].isIntersecting;

        setInView(intersecting);
        if (intersecting) {
          setHasApproached(true);
        }
      },
      { rootMargin: MOUNT_MARGIN }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // The card title is overlaid on the doodle, and a random seed can paint busy
  // cells right behind it. Fading the artwork's own background color (color0)
  // to transparent keeps the title legible without looking like a foreign
  // scrim. `#RRGGBB00` (not `transparent`) avoids fading through gray.
  const background =
    palette?.[0] ?? galleryThumbnails[item.slug]?.palette?.[0] ?? item.palette[0];
  const gradient = /^#[0-9a-f]{6}$/i.test(background ?? '')
    ? `linear-gradient(to bottom, ${background}, ${background}00)`
    : undefined;

  // Transparent-background previews sit on a checkerboard, the usual "this is
  // transparent" affordance.
  const transparent = background === 'transparent';

  return (
    <div
      ref={frameRef}
      className={
        transparent
          ? `${styles.doodleThumb} ${styles.thumbChecker}`
          : styles.doodleThumb
      }
    >
      {hasApproached && (
        <GalleryDoodleInner
          item={item}
          palette={palette}
          paused={!inView}
          onReady={() => setReady(true)}
        />
      )}
      {/* Loading shimmer in the artwork's own background color, shown (and
          server-rendered, so it animates before any JS runs) until the doodle
          first paints, then faded out. */}
      <div
        className={[
          styles.thumbShimmer,
          isDarkColor(background) ? styles.thumbShimmerDark : '',
          ready ? styles.thumbShimmerHidden : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={
          /^#[0-9a-f]{6,8}$/i.test(background ?? '')
            ? { backgroundColor: background }
            : undefined
        }
        aria-hidden="true"
      />
      {gradient && (
        <div className={styles.titleGradient} style={{ background: gradient }} />
      )}
    </div>
  );
}
