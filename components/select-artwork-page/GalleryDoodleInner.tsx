'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import 'css-doodle';
import type { GalleryItem } from 'lib/artwork';
import { buildDoodleSource, expandPalette } from 'lib/doodleSource';
import { randomSeed } from 'lib/seed';
import { galleryThumbnails } from './galleryThumbnails';
import styles from './SelectArtwork.module.css';

const DEFAULT_RENDER = { width: 800, height: 800, cropTop: 1 };

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
  const containerRef = useRef<HTMLDivElement>(null);
  const doodleRef = useRef<any>(null);
  const [width, setWidth] = useState(0);

  const config = galleryThumbnails[item.slug];
  const render = { ...DEFAULT_RENDER, ...(config?.render ?? {}) };
  // Thumbnails show the design at its default color count: the active slice of
  // the palette, expanded so the style's higher color slots alias back into it
  // (mirroring what the editor renders when it opens).
  const baseColors = config?.palette ?? item.palette;
  const defaultCount = item.colors?.default ?? baseColors.length;
  const totalColors = Math.max(
    item.colors?.max ?? baseColors.length,
    baseColors.length
  );
  const palette = expandPalette(
    baseColors.slice(0, defaultCount),
    totalColors
  );
  const optionValues = item.options.map(
    (option) => config?.options?.[option.id] ?? option.default
  );

  const { styleCode, doodleCode } = buildDoodleSource({
    code: item.code,
    options: item.options,
    palette,
    optionValues,
    width: `${render.width}px`,
    height: `${render.height}px`,
  });

  // A fresh seed per mount keeps the gallery dynamic: every visit draws a new
  // variation of each design (this component is ssr:false, so there is no
  // server markup to mismatch).
  const [seed, setSeed] = useState(() => randomSeed());
  const name = `thumb-${item.slug}`;

  // Keep redrawing while the page is open by rotating the seed; the effect
  // below pushes each new seed through update(). Skipped under
  // prefers-reduced-motion, and ticks are dropped while the tab is hidden or
  // the card is out of view (the ref keeps the timers and their stagger phase
  // alive across pause flips instead of resetting them).
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tick = () => {
      if (document.visibilityState === 'visible' && !pausedRef.current) {
        setSeed(randomSeed());
      }
    };

    const interval = REDRAW_INTERVAL_MS + Math.random() * REDRAW_STAGGER_MS;
    // Land the *first* redraw anywhere in [0, interval) rather than a full
    // interval after load, so the gallery starts moving right away (sometimes
    // almost immediately) instead of sitting still until every timer fires.
    let intervalTimer: ReturnType<typeof setInterval>;
    const firstTimer = setTimeout(() => {
      tick();
      intervalTimer = setInterval(tick, interval);
    }, Math.random() * interval);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  // Measure the square card so the fixed-resolution doodle can be scaled to fit.
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      setWidth(Math.round(entries[0].contentRect.width));
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // A non-zero measurement is what flips the doodle visible below, so report
  // readiness then (once) — the parent uses it to drop its loading shimmer.
  const reportedReady = useRef(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (width > 0 && !reportedReady.current) {
      reportedReady.current = true;
      onReadyRef.current?.();
    }
  }, [width]);

  // css-doodle renders its text content on mount, so only push changes that
  // happen afterwards (css-doodle >= 0.5 no longer re-reads the text on a
  // bare update()); skipping the mount avoids regenerating every thumbnail
  // twice. Seed rotations go through update() too — it swaps the generated
  // stylesheet in place, so designs with CSS transitions morph into the next
  // variation instead of snapping (the seed rides on the unobserved
  // `data-seed` attribute; changing the observed `seed` attribute would make
  // css-doodle rebuild every cell element, killing transitions).
  const renderedSource = useRef<string | null>(null);

  useEffect(() => {
    const source = JSON.stringify([doodleCode, seed]);

    if (renderedSource.current !== null && renderedSource.current !== source) {
      doodleRef.current?.update?.(doodleCode);
    }

    renderedSource.current = source;
  }, [doodleCode, seed]);

  // Cover-fit the (possibly cropped) render into the square card. Scaling the
  // whole element — rather than rendering at the card's pixel size — preserves
  // the original 800px proportions of fixed-px strokes and shadows.
  const visibleHeight = render.height * (render.cropTop ?? 1);
  const scale = width
    ? Math.max(width / render.width, width / visibleHeight)
    : 0;
  const translateX = (width - render.width * scale) / 2;

  return (
    <div ref={containerRef} className={styles.doodleThumbInner}>
      <style>{`css-doodle#${name} { ${styleCode} }`}</style>
      <css-doodle
        id={name}
        data-seed={seed}
        use="var(--rule)"
        ref={doodleRef}
        style={{
          width: `${render.width}px`,
          height: `${render.height}px`,
          transformOrigin: 'top left',
          transform: `translateX(${translateX}px) scale(${scale})`,
          // Hide the unscaled 800px element until it has been measured.
          visibility: scale ? 'visible' : 'hidden',
        }}
      >
        {doodleCode}
      </css-doodle>
    </div>
  );
}
