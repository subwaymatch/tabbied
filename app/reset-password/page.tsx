import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AuthShell from 'components/account/AuthShell';
import { ResetPasswordForm } from 'components/account/PasswordForms';

export const metadata: Metadata = {
  title: 'Choose a new password - Tabbied',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <AuthShell className={plexMono.variable}>
        <ResetPasswordForm />
      </AuthShell>
    </Suspense>
  );
}
