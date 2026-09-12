'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Logo } from 'components/logo';
import styles from './AuthShell.module.css';

// The frame around the five account forms: a bar with the way back and the
// lockup, and one card centred under it.
//
// The back arrow follows `?next=` where there is one, which is the page that
// sent the person here - a template they were customizing, the gallery, their
// account. With no `next` it is the homepage. It is deliberately the same
// destination the form returns to on success, so leaving and finishing land
// in the same place.

/** Same-origin paths only - never an open redirect. */
function safeBack(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
}

export default function AuthShell({
  children,
  className,
}: {
  children: React.ReactNode;
  /** The route's font variables - the eyebrow is the mono. */
  className?: string;
}) {
  const back = safeBack(useSearchParams().get('next'));

  return (
    <div className={[styles.shell, className].filter(Boolean).join(' ')}>
      <header className={styles.bar}>
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

        <Link href="/" prefetch={false} className={styles.home} aria-label="Tabbied home">
          <Logo />
        </Link>
      </header>

      <main className={styles.wrap}>
        <div className={styles.column}>{children}</div>
      </main>
    </div>
  );
}
