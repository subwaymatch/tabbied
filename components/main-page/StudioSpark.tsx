import styles from './StudioSpark.module.css';

/**
 * The four-pointed mark that stands for Studio wherever it is named - the nav,
 * the mobile panel, the footer, and Studio's own masthead. Decorative: the word
 * "Studio" always sits beside it, so it is hidden from assistive tech.
 */
export default function StudioSpark({ size = 12 }: { size?: number }) {
  return (
    <span
      className={styles.spark}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
