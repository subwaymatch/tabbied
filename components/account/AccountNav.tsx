'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './account.module.css';

const LINKS = [
  ['/account/', 'Overview'],
  ['/account/sites/', 'Your sites'],
  ['/account/uploads/', 'Pictures'],
  ['/account/usage/', 'Usage'],
  ['/account/settings/', 'Settings'],
] as const;

/** The account area's own navigation - one row under the masthead, current page marked. */
export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Account">
      {LINKS.map(([href, label]) => {
        const current = pathname === href || pathname === href.replace(/\/$/, '');
        return (
          <Link
            key={href}
            href={href}
            prefetch={false}
            className={`${styles.navLink} ${current ? styles.navOn : ''}`}
            aria-current={current ? 'page' : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
