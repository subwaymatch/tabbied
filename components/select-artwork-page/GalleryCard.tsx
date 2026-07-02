'use client';

import Link from 'next/link';
import type { GalleryItem } from 'lib/artwork';
import { previewPalette, useBrandPalettes } from 'lib/brandPalettes';
import { markGalleryNavigation } from 'lib/galleryScroll';
import GalleryDoodle, { isDarkColor } from './GalleryDoodle';
import { galleryThumbnails } from './galleryThumbnails';
import styles from './SelectArtwork.module.css';

// One gallery card: title + live thumbnail. Client-side because the preview
// follows the brand-palette selection (localStorage), which also decides the
// title color — the authored white/dark flag only applies to artwork colors.
export default function GalleryCard({ item }: { item: GalleryItem }) {
  const brandState = useBrandPalettes();

  const thumbConfig = galleryThumbnails[item.slug];
  const baseColors = thumbConfig?.palette ?? item.palette;
  const defaultCount = item.colors?.default ?? baseColors.length;
  const palette = previewPalette(
    baseColors.slice(0, defaultCount),
    brandState
  );

  // A transparent background previews over a light checkerboard, so the title
  // renders dark there (isDarkColor treats non-hex as light).
  const white = palette ? isDarkColor(palette[0]) : item.white;

  return (
    <Link
      href={`/artworks/${item.slug}?seed=0000`}
      prefetch={false}
      onClick={markGalleryNavigation}
    >
      <div className={styles.galleryCard}>
        <h4 className={white ? styles.white : undefined}>{item.name}</h4>
        <GalleryDoodle item={item} palette={palette} />
      </div>
    </Link>
  );
}
