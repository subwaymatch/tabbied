import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AuthForm from 'components/account/AuthForm';
import AuthShell from 'components/account/AuthShell';

export const metadata: Metadata = {
  title: 'Sign in - Tabbied',
  // Account pages have nothing to offer a search engine and everything to
  // lose from being indexed under a half-dozen near-identical titles.
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <AuthShell className={plexMono.variable}>
        <AuthForm mode="sign-in" />
      </AuthShell>
    </Suspense>
  );
}
