'use client';

import dynamic from 'next/dynamic';
import type { GalleryItem } from 'lib/artwork';
import styles from './SelectArtwork.module.css';

// css-doodle registers a browser custom element on import, so the renderer can
// only run on the client. The square frame is rendered here (outside the lazy
// boundary) so the card reserves its space and nothing shifts when the doodle
// mounts.
const GalleryDoodleInner = dynamic(() => import('./GalleryDoodleInner'), {
  ssr: false,
});

export default function GalleryDoodle({ item }: { item: GalleryItem }) {
  return (
    <div className={styles.doodleThumb}>
      <GalleryDoodleInner item={item} />
    </div>
  );
}
