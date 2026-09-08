import Link from 'next/link';
import styles from './GalleryTopBar.module.css';

/**
 * The gallery's own slim masthead: a way back to the homepage on the left and
 * the page's name in the middle. The shared site header is deliberately not
 * used here - this page owns its chrome, because the palette rail underneath
 * has to start at the top of the viewport.
 *
 * The mark is the same four cells as the homepage logo, with one omitted: at
 * 15px a filled quartet turns into a blob, and the gap reads as a corner.
 */
export default function GalleryTopBar({ label }: { label: string }) {
  return (
    <div className={styles.bar}>
      <Link
        href="/"
        prefetch={false}
        className={styles.back}
        aria-label="Tabbied"
      >
        <span className={styles.mark} aria-hidden="true">
          <span />
          <span className={styles.markGap} />
          <span />
          <span />
        </span>
      </Link>

      <span className={styles.label}>{label}</span>
    </div>
  );
}
