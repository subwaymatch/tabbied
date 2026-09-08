'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from '@base-ui-components/react/menu';
import LogoMark from 'components/main-page/LogoMark';
import StudioSpark from 'components/main-page/StudioSpark';
import { signOut, useSessionUser } from 'lib/authClient';
import styles from './AccountHeader.module.css';

// The account pages' masthead: the site's three destinations and, on the
// right, the person - their initials, opening a menu that names the account
// and lets them leave it. Signed out (a shared link, an expired session) it
// offers the door instead.

const LINKS = [
  ['/patterns', 'Patterns'],
  ['/templates', 'Templates'],
] as const;

/** Two letters for the circle: first and last name, or the start of the email. */
export function initials(name: string, email: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const text =
    parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : (parts[0] ?? email).slice(0, 2);

  return text.toUpperCase();
}

export default function AccountHeader() {
  const { user, isPending } = useSessionUser();
  const router = useRouter();
  const pathname = usePathname() ?? '';

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="Tabbied home" prefetch={false}>
        <LogoMark size={14} />
      </Link>

      <nav className={styles.links} aria-label="Main">
        {LINKS.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            prefetch={false}
            aria-current={pathname.startsWith(href) ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
        <Link href="/studio" prefetch={false} className={styles.studio}>
          <StudioSpark size={11} />
          Studio
        </Link>
      </nav>

      {user ? (
        <Menu.Root>
          <Menu.Trigger className={styles.avatar} aria-label="Account menu">
            {initials(user.name, user.email)}
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner className={styles.positioner} side="bottom" align="end" sideOffset={10}>
              <Menu.Popup className={styles.menu}>
                <div className={styles.menuEmail}>{user.email}</div>
                <Menu.Separator className={styles.menuRule} />
                <Menu.Item className={styles.menuItem} render={<Link href="/account/" prefetch={false} />}>
                  Account
                </Menu.Item>
                <Menu.Item className={styles.menuItem} render={<Link href="/studio" prefetch={false} />}>
                  Studio
                </Menu.Item>
                <Menu.Item className={styles.menuItem} render={<Link href="/patterns" prefetch={false} />}>
                  Patterns
                </Menu.Item>
                <Menu.Item className={styles.menuItem} render={<Link href="/templates" prefetch={false} />}>
                  Templates
                </Menu.Item>
                <Menu.Separator className={styles.menuRule} />
                <Menu.Item
                  className={styles.menuItem}
                  onClick={async () => {
                    await signOut();
                    router.push('/');
                  }}
                >
                  Sign out
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      ) : isPending ? (
        <span className={styles.avatarGhost} aria-hidden="true" />
      ) : (
        <Link href="/sign-in?next=%2Faccount" className={styles.signIn} prefetch={false}>
          Sign in
        </Link>
      )}
    </header>
  );
}
