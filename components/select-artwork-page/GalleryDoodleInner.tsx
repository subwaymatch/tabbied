'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import 'css-doodle';
import type { GalleryItem } from 'lib/artwork';
import { buildDoodleSource } from 'lib/doodleSource';
import { randomSeed } from 'lib/seed';
import { galleryThumbnails } from './galleryThumbnails';
import styles from './SelectArtwork.module.css';

const DEFAULT_RENDER = { width: 800, height: 800, cropTop: 1 };

export default function GalleryDoodleInner({ item }: { item: GalleryItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const doodleRef = useRef<any>(null);
  const [width, setWidth] = useState(0);

  const config = galleryThumbnails[item.slug];
  const render = { ...DEFAULT_RENDER, ...(config?.render ?? {}) };
  const palette = config?.palette ?? item.palette;
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
  const [seed] = useState(() => randomSeed());
  const name = `thumb-${item.slug}`;

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

  // css-doodle renders its text content on mount, so only push the source on
  // later changes (css-doodle >= 0.5 no longer re-reads the text on a bare
  // update()). Skipping the mount avoids regenerating every thumbnail twice.
  const renderedCode = useRef<string | null>(null);

  useEffect(() => {
    if (renderedCode.current !== null && renderedCode.current !== doodleCode) {
      doodleRef.current?.update?.(doodleCode);
    }

    renderedCode.current = doodleCode;
  }, [doodleCode]);

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
        seed={seed}
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
