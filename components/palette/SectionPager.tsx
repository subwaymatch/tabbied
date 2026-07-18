'use client';

import { ChevronRight } from 'lucide-react';
import styles from './SectionPager.module.css';

/**
 * A compact prev / "n/total" / next pager for a paginated palette section
 * (Your Palettes / Palette Library). Renders nothing when there's a single
 * page. Pages are 0-indexed.
 */
export default function SectionPager({
  page,
  pageCount,
  onPageChange,
  label,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  label: string;
}) {
  if (pageCount <= 1) return null;

  return (
    <span className={styles.pager}>
      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page <= 0}
        aria-label={`Previous ${label}`}
      >
        <ChevronRight size={13} className={styles.prevIcon} />
      </button>
      <span className={styles.label}>
        {page + 1}/{pageCount}
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(Math.min(pageCount - 1, page + 1))}
        disabled={page >= pageCount - 1}
        aria-label={`More ${label}`}
      >
        <ChevronRight size={13} />
      </button>
    </span>
  );
}
