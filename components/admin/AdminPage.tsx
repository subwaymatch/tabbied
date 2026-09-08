'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoMark from 'components/main-page/LogoMark';
import { initials } from 'components/account/AccountHeader';
import { plexMono } from 'lib/fonts';
import { apiFetch } from 'lib/apiFetch';
import { useSessionUser } from 'lib/authClient';
import styles from './admin.module.css';

// The admin frame: a sidebar naming the sections, a topbar with the one
// action that spans them, and the page. The role check here decides only
// what to *render*; every /api/admin route reads the role itself and answers
// 404 to anyone else, so a person who defeats this sees an empty page and
// nothing more.

const LINKS = [
  ['/admin/', 'Overview'],
  ['/admin/users/', 'Users'],
  ['/admin/usage/', 'AI usage'],
  ['/admin/generations/', 'Generations'],
  ['/admin/templates/', 'Templates'],
  ['/admin/uploads/', 'Uploads'],
  ['/admin/quotas/', 'Quotas'],
  ['/admin/mail/', 'Mail'],
] as const;

type UserRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string | null;
  banned: boolean | null;
  createdAt: string;
  sites: number;
  generations: number;
};

/** A CSV cell: quoted when it has to be, doubled quotes inside. */
const cell = (value: unknown) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * Every user the directory can list, as a file. Built here rather than by the
 * API because the API already answers the same rows as JSON, and one more
 * representation of them is not worth one more route to gate.
 */
async function exportUsers() {
  const { users } = await apiFetch<{ users: UserRow[] }>('/api/admin/users?limit=200');
  const header = ['id', 'name', 'email', 'verified', 'role', 'banned', 'joined', 'sites', 'generations'];
  const lines = users.map((user) =>
    [
      user.id,
      user.name,
      user.email,
      user.emailVerified,
      user.role ?? 'user',
      Boolean(user.banned),
      user.createdAt,
      user.sites,
      user.generations,
    ]
      .map(cell)
      .join(',')
  );
  const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `tabbied-users-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage({
  eyebrow = 'Admin',
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { user, isPending } = useSessionUser();
  const [exporting, setExporting] = useState<'busy' | 'failed' | null>(null);

  if (isPending) {
    return (
      <div className={styles.wrap}>
        <p className={styles.quiet}>Checking your session...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>Not found</h1>
        <p className={styles.quiet}>
          <Link href="/">Home</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.shell} ${plexMono.variable}`}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo} aria-label="Tabbied home" prefetch={false}>
          <LogoMark size={14} />
        </Link>

        <nav className={styles.nav} aria-label="Admin">
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

        <div className={styles.sideFoot}>
          <span className={styles.sideAvatar} aria-hidden="true">
            {initials(user.name, user.email)}
          </span>
          <div>
            <p className={styles.sideName}>{user.name}</p>
            <p className={styles.sideRole}>Administrator</p>
          </div>
        </div>
      </aside>

      <div className={styles.mainCol}>
        <div className={styles.topbar}>
          <span className={styles.topbarTitle}>Tabbied Admin</span>
          <button
            type="button"
            className={styles.button}
            disabled={exporting === 'busy'}
            onClick={() => {
              setExporting('busy');
              exportUsers()
                .then(() => setExporting(null))
                .catch(() => setExporting('failed'));
            }}
          >
            {exporting === 'busy'
              ? 'Exporting...'
              : exporting === 'failed'
                ? 'Export failed - try again'
                : 'Export users'}
          </button>
        </div>

        <main className={styles.main}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          {lede ? <p className={styles.lede}>{lede}</p> : null}
          {children}
        </main>
      </div>
    </div>
  );
}
