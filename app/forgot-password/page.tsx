import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import { AuthShell } from 'components/account/AuthForm';
import { ForgotPasswordForm } from 'components/account/PasswordForms';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Reset your password - Tabbied',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <div className={`${styles.rule} ${styles.ruleLeft}`} aria-hidden="true" />
      <div className={`${styles.rule} ${styles.ruleRight}`} aria-hidden="true" />

      <AuthShell>
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </AuthShell>
    </div>
  );
}
