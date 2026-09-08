import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AuthForm, { AuthShell } from 'components/account/AuthForm';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Sign in - Tabbied',
  // Account pages have nothing to offer a search engine and everything to
  // lose from being indexed under a half-dozen near-identical titles.
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <div className={`${styles.rule} ${styles.ruleLeft}`} aria-hidden="true" />
      <div className={`${styles.rule} ${styles.ruleRight}`} aria-hidden="true" />

      <AuthShell>
        {/* AuthForm reads ?next= to return people where they were sent from. */}
        <Suspense>
          <AuthForm mode="sign-in" />
        </Suspense>
      </AuthShell>
    </div>
  );
}
