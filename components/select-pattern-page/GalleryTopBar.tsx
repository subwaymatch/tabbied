import Link from 'next/link';
import { LogoMark } from 'components/logo';
import styles from './GalleryTopBar.module.css';

/**
 * The gallery's own slim masthead: a way back to the homepage on the left and
 * the page's name in the middle. The shared site header is deliberately not
 * used here - this page owns its chrome, because the palette rail underneath
 * has to start at the top of the viewport.
 *
 * The mark goes without the wordmark: the bar already names the page in its
 * middle, and the two set beside each other read as one long label.
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
        <LogoMark size={18} />
      </Link>

      <span className={styles.label}>{label}</span>
    </div>
  );
}
