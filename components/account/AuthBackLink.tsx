'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './AuthShell.module.css';

// The way out of the account forms, on its own so that reading `?next=` costs
// only this button.
//
// It follows the same `?next=` the form returns to on success - the page that
// sent the person here, a template they were customizing, the gallery, their
// account - so leaving and finishing land in the same place. With no `next`
// it is the homepage.

/** Same-origin paths only - never an open redirect. */
function safeBack(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
}

export default function AuthBackLink() {
  const back = safeBack(useSearchParams().get('next'));

  return (
    <Link href={back} prefetch={false} className={styles.back} aria-label="Go back">
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.5 5.5 8 12l6.5 6.5" />
      </svg>
    </Link>
  );
}
