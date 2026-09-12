import { Suspense } from 'react';
import Link from 'next/link';
import { Logo } from 'components/logo';
import AuthBackLink from './AuthBackLink';
import styles from './AuthShell.module.css';

// The frame around the five account forms: a bar with the way back and the
// lockup, and one card centred under it.
//
// A server component, deliberately. Only two things here read the query
// string - the back link and the form - and each sits in its own Suspense
// boundary, so the bar, the lockup and the card's frame are in the exported
// HTML. Reading `?next=` in the shell itself bailed the whole route out to
// client rendering (`BAILOUT_TO_CLIENT_SIDE_RENDERING` in the export), which
// paints the sign-in page blank until the bundle lands.

export default function AuthShell({
  children,
  className,
}: {
  children: React.ReactNode;
  /** The route's font variables - the eyebrow is the mono. */
  className?: string;
}) {
  return (
    <div className={[styles.shell, className].filter(Boolean).join(' ')}>
      <header className={styles.bar}>
        {/* The fallback holds the circle's place, so the bar does not reflow
            when the link arrives. */}
        <Suspense fallback={<span className={styles.back} aria-hidden="true" />}>
          <AuthBackLink />
        </Suspense>

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
