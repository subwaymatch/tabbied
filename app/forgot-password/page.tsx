import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AuthShell from 'components/account/AuthShell';
import { ForgotPasswordForm } from 'components/account/PasswordForms';

export const metadata: Metadata = {
  title: 'Reset your password - Tabbied',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <AuthShell className={plexMono.variable}>
        <ForgotPasswordForm />
      </AuthShell>
    </Suspense>
  );
}
