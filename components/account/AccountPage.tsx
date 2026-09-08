'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSessionUser } from 'lib/authClient';
import AccountHeader from './AccountHeader';
import AccountNav from './AccountNav';
import styles from './account.module.css';

/**
 * The frame every account page sits in: the light masthead, the area's own
 * nav, then an eyebrow, a title and the page. It waits for the session and
 * turns a signed-out visitor away with a link. Shared so the five pages
 * differ only in their body.
 *
 * A static export has no server-side route protection and needs none: the
 * page renders a signed-out state client-side, and the *data* is protected
 * at the API, which is the only place protection is ever real.
 */
export default function AccountPage({
  eyebrow = 'Account',
  title,
  lede,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  /** Something to do, beside the title - the "+ New Studio request" pill. */
  action?: { href: string; label: string };
  children: ReactNode;
}) {
  const { user, isPending } = useSessionUser();

  return (
    <>
      <AccountHeader />
      <div className={styles.shell}>
        {isPending ? (
          <div className={styles.gate}>
            <p className={styles.quiet}>Checking your session...</p>
          </div>
        ) : !user ? (
          <div className={styles.gate}>
            <p className={styles.eyebrow}>Account</p>
            <h1 className={styles.title}>You're signed out</h1>
            <p className={styles.lede}>
              Signing in is only needed to generate with AI. Patterns, templates
              and library matches are open to everyone.{' '}
              <Link href="/sign-in?next=%2Faccount">Sign in</Link> or{' '}
              <Link href="/sign-up">create an account</Link>.
            </p>
          </div>
        ) : (
          <>
            <AccountNav />
            <div className={styles.head}>
              <div>
                <p className={styles.eyebrow}>{eyebrow}</p>
                <h1 className={styles.title}>{title}</h1>
                {lede ? <p className={styles.lede}>{lede}</p> : null}
              </div>
              {action ? (
                <Link href={action.href} prefetch={false} className={styles.cta}>
                  {action.label}
                </Link>
              ) : null}
            </div>
            {children}
          </>
        )}
      </div>
    </>
  );
}
