'use client';

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

export default function GalleryDoodle({ item }: { item: GalleryItem }) {
  // The card title is overlaid on the doodle, and a random seed can paint busy
  // cells right behind it. Fading the artwork's own background color (color0)
  // to transparent keeps the title legible without looking like a foreign
  // scrim. `#RRGGBB00` (not `transparent`) avoids fading through gray.
  const background =
    galleryThumbnails[item.slug]?.palette?.[0] ?? item.palette[0];
  const gradient = /^#[0-9a-f]{6}$/i.test(background ?? '')
    ? `linear-gradient(to bottom, ${background}, ${background}00)`
    : undefined;

  return (
    <div className={styles.doodleThumb}>
      <GalleryDoodleInner item={item} />
      {gradient && (
        <div className={styles.titleGradient} style={{ background: gradient }} />
      )}
    </div>
  );
}
