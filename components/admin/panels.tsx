'use client';

// The admin panels, one per page. Tables over the /api/admin reads, with the
// two actions the tier has - role and ban - going through better-auth's own
// admin endpoints via the client plugin.
import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { apiUrl } from 'lib/apiFetch';
import { authClient } from 'lib/authClient';
import { initials } from 'components/account/AccountHeader';
import { money, useAdminData, when } from './useAdminData';
import styles from './admin.module.css';

const Load = ({ error }: { error: string | null }) => (
  <p className={styles.quiet}>{error ?? 'Loading...'}</p>
);

const day = (value: string | Date) =>
  new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

// ---- overview ---------------------------------------------------------------

type Overview = {
  users: number;
  newUsersThisWeek: number;
  generationsThisWeek: number;
  sitesThisWeek: number;
  fallbackRate: number;
  aiCallsToday: number;
  aiCostToday: number;
  imagesThisWeek: number;
  /** Absent on rows from before the chart existed - read as no sign-ups. */
  signupsByDay?: { day: string; n: number }[];
};

/** The last fourteen UTC days, oldest first, each with its count or zero. */
function fortnight(signups: { day: string; n: number }[] = []) {
  const counts = new Map(signups.map((row) => [row.day, row.n]));
  const today = new Date();

  return Array.from({ length: 14 }, (_, offset) => {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - (13 - offset)));
    const key = date.toISOString().slice(0, 10);

    return {
      key,
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      short: String(date.getUTCDate()),
      n: counts.get(key) ?? 0,
    };
  });
}

function GrowthChart({ signups }: { signups?: { day: string; n: number }[] }) {
  const days = fortnight(signups);
  const total = days.reduce((sum, entry) => sum + entry.n, 0);
  const peak = Math.max(1, ...days.map((entry) => entry.n));

  return (
    <div className={`${styles.card} ${styles.chartCard}`}>
      <div className={styles.cardHead}>
        <div>
          <h2 className={styles.h3}>User growth</h2>
          <p className={styles.cardSub}>New accounts by day, last 14 days (UTC)</p>
        </div>
        <span className={styles.badge}>
          {total === 1 ? '+1 user' : `+${total} users`}
        </span>
      </div>
      <div className={styles.bars} role="img" aria-label={`New accounts per day: ${days.map((entry) => `${entry.label} ${entry.n}`).join(', ')}`}>
        {days.map((entry) => (
          <div key={entry.key} className={styles.barCol}>
            <div
              className={`${styles.bar} ${entry.n === 0 ? styles.barEmpty : ''}`}
              style={{ height: `${Math.round((entry.n / peak) * 100)}%` }}
              title={`${entry.label}: ${entry.n}`}
            />
          </div>
        ))}
      </div>
      <div className={styles.barLabels} aria-hidden="true">
        {/* Separated by a space so the row reads as fourteen numbers, not one
            long one - to a screen reader that ignores the hiding, and to a
            text query that would otherwise find "42" across "24 25". Flex
            drops the whitespace-only nodes, so nothing is drawn for them. */}
        {days.map((entry, index) => (
          <span key={entry.key} className={styles.barLabel}>
            {index > 0 ? ' ' : ''}
            {entry.short}
          </span>
        ))}
      </div>
    </div>
  );
}

export function OverviewPanel() {
  const { data, error } = useAdminData<Overview>('/api/admin/overview');

  if (!data) return <Load error={error} />;

  const stats: { label: string; value: string; note: string; dark?: boolean }[] = [
    { label: 'Total users', value: data.users.toLocaleString(), note: `+${data.newUsersThisWeek} this week` },
    { label: 'New users', value: data.newUsersThisWeek.toLocaleString(), note: 'In the last 7 days' },
    { label: 'Generations', value: data.generationsThisWeek.toLocaleString(), note: 'Direction sets this week' },
    { label: 'Sites made', value: data.sitesThisWeek.toLocaleString(), note: 'Full documents this week' },
    { label: 'Fallback rate', value: `${Math.round(data.fallbackRate * 100)}%`, note: 'Of this week\'s generations' },
    { label: 'AI calls today', value: data.aiCallsToday.toLocaleString(), note: 'Since 00:00 UTC' },
    { label: 'Images', value: data.imagesThisWeek.toLocaleString(), note: 'Generated this week' },
    { label: 'AI cost today', value: money(data.aiCostToday), note: 'Estimated from the ledger', dark: true },
  ];

  return (
    <>
      <ul className={styles.stats}>
        {stats.map((stat) => (
          <li key={stat.label} className={`${styles.stat} ${stat.dark ? styles.statDark : ''}`}>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statNote}>{stat.note}</p>
          </li>
        ))}
      </ul>

      <GrowthChart signups={data.signupsByDay} />

      <div className={styles.sectionHead}>
        <h2 className={styles.h2}>Recent users</h2>
        <Link href="/admin/users/" prefetch={false} className={styles.pill}>
          All users &rarr;
        </Link>
      </div>
      <UsersDirectory pageSize={8} compact />
    </>
  );
}

// ---- users ------------------------------------------------------------------

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

const FILTERS = ['All users', 'Active', 'Banned', 'Admins', 'Unverified'] as const;
type Filter = (typeof FILTERS)[number];

const matchesFilter = (row: UserRow, filter: Filter) =>
  filter === 'All users'
    ? true
    : filter === 'Active'
      ? !row.banned && row.emailVerified
      : filter === 'Banned'
        ? Boolean(row.banned)
        : filter === 'Admins'
          ? row.role === 'admin'
          : !row.emailVerified;

/** Active, banned, or not yet verified - in that order of what matters. */
function Status({ row }: { row: UserRow }) {
  if (row.banned) return <span className={`${styles.status} ${styles.statusBanned}`}>Banned</span>;
  if (!row.emailVerified) return <span className={`${styles.status} ${styles.statusQuiet}`}>Unverified</span>;
  return <span className={styles.status}>Active</span>;
}

/**
 * The directory: search goes to the API (it is what knows every row), the
 * filter, the sort and the pages are the browser's over what came back.
 * The overview shows the first handful of it; the users page all of it.
 */
export function UsersDirectory({ pageSize = 10, compact = false }: { pageSize?: number; compact?: boolean }) {
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All users');
  const [statusSort, setStatusSort] = useState<0 | 1 | 2>(0);
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { data, error, reload } = useAdminData<{ users: UserRow[] }>(
    `/api/admin/users?q=${encodeURIComponent(query)}&limit=${compact ? pageSize : 200}`
  );

  const rows = useMemo(() => {
    const filtered = (data?.users ?? []).filter((row) => matchesFilter(row, filter));
    if (!statusSort) return filtered;
    const rank = (row: UserRow) => (row.banned ? 2 : row.emailVerified ? 0 : 1);
    return [...filtered].sort((a, b) => (statusSort === 1 ? rank(b) - rank(a) : rank(a) - rank(b)) || a.name.localeCompare(b.name));
  }, [data, filter, statusSort]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const start = current * pageSize;
  const slice = rows.slice(start, start + pageSize);

  const act = async (id: string, action: () => Promise<{ error?: { message?: string } | null }>) => {
    setBusy(id);
    setMessage(null);
    const result = await action();
    setBusy(null);
    if (result.error) setMessage(result.error.message ?? 'That did not work.');
    else reload();
  };

  return (
    <>
      {compact ? null : (
        <div className={styles.sectionHead} style={{ marginTop: 0 }}>
          <p className={styles.quiet} style={{ margin: 0 }}>
            {data ? (rows.length === 1 ? '1 user' : `${rows.length} users`) : '...'}
          </p>
          <div className={styles.toolbar}>
            <button
              type="button"
              className={styles.pill}
              onClick={() => {
                setFilter(FILTERS[(FILTERS.indexOf(filter) + 1) % FILTERS.length]);
                setPage(0);
              }}
              aria-label={`Showing ${filter.toLowerCase()}. Next filter`}
            >
              <span>{filter}</span>
              <span className={styles.pillGlyph} aria-hidden="true">
                &#9662;
              </span>
            </button>
            <form
              className={styles.search}
              onSubmit={(event) => {
                event.preventDefault();
                setQuery(draft.trim());
                setPage(0);
              }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="oklch(0.55 0.01 260)" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4 4" />
              </svg>
              <input
                type="search"
                placeholder="Search users"
                aria-label="Search users by email or name"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
            </form>
          </div>
        </div>
      )}

      {message ? (
        <p className={styles.error} role="alert">
          {message}
        </p>
      ) : null}

      <div className={`${styles.panel} ${styles.scroll}`}>
        <div className={`${styles.tableHead} ${styles.userCols}`} aria-hidden="true">
          <div>User</div>
          <div>Role</div>
          <div>Registered</div>
          <div>Sites</div>
          <div>Generations</div>
          <button
            type="button"
            className={styles.sortHead}
            data-on={statusSort ? '' : undefined}
            onClick={() => {
              setStatusSort(((statusSort + 1) % 3) as 0 | 1 | 2);
              setPage(0);
            }}
            title="Sort by status"
          >
            <span>Status</span>
            <span>{statusSort === 0 ? '⇅' : statusSort === 1 ? '▲' : '▼'}</span>
          </button>
          <div />
        </div>

        {!data ? (
          <p className={styles.empty}>{error ?? 'Loading...'}</p>
        ) : slice.length === 0 ? (
          <p className={styles.empty}>No users match this view.</p>
        ) : (
          slice.map((row) => (
            <div key={row.id} className={`${styles.row} ${styles.userCols}`}>
              <div className={styles.person}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(row.name, row.email)}
                </span>
                <div className={styles.personText}>
                  <p className={styles.personName}>{row.name}</p>
                  <Link href={`/admin/users/?id=${row.id}`} prefetch={false} className={styles.personEmail}>
                    {row.email}
                  </Link>
                </div>
              </div>
              <div className={styles.cell} data-label="Role">{row.role === 'admin' ? 'Admin' : 'Member'}</div>
              <div className={`${styles.cell} ${styles.cellDim}`} data-label="Registered">{day(row.createdAt)}</div>
              <div className={styles.cell} data-label="Sites">{row.sites}</div>
              <div className={styles.cell} data-label="Generations">{row.generations}</div>
              <Status row={row} />
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.small}
                  disabled={busy !== null}
                  onClick={() =>
                    void act(row.id, () =>
                      authClient.admin.setRole({ userId: row.id, role: row.role === 'admin' ? 'user' : 'admin' })
                    )
                  }
                >
                  {row.role === 'admin' ? 'Remove admin' : 'Make admin'}
                </button>
                <button
                  type="button"
                  className={styles.small}
                  disabled={busy !== null}
                  onClick={() =>
                    void act(row.id, () =>
                      row.banned
                        ? authClient.admin.unbanUser({ userId: row.id })
                        : authClient.admin.banUser({ userId: row.id, banReason: 'Banned from the admin page' })
                    )
                  }
                >
                  {row.banned ? 'Unban' : 'Ban'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {compact || !data ? null : (
        <div className={styles.pager}>
          <p className={styles.quiet} style={{ margin: 0, fontSize: 13 }}>
            {rows.length ? `Showing ${start + 1}-${start + slice.length} of ${rows.length}` : 'Nothing to show'}
          </p>
          <div className={styles.pages}>
            <button type="button" className={styles.page} disabled={current === 0} onClick={() => setPage(current - 1)} aria-label="Previous page">
              &larr;
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.page} ${i === current ? styles.pageOn : ''}`}
                aria-current={i === current ? 'page' : undefined}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button type="button" className={styles.page} disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)} aria-label="Next page">
              &rarr;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function UsersPanel() {
  return <UsersDirectory />;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.h3}>{title}</h2>
      {children}
    </div>
  );
}

export function UserDetailPanel({ id }: { id: string }) {
  const { data, error } = useAdminData<{
    user: UserRow & { banReason: string | null; banExpires: string | null };
    sites: { id: string; slug: string; title: string; updatedAt: string }[];
    generations: { id: string; description: string; source: string; model: string; createdAt: string }[];
    usageToday: { endpoint: string; calls: number; cost: number; cap: number | null }[];
  }>(`/api/admin/users/${id}`);

  if (!data) return <Load error={error} />;

  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <div className={styles.person}>
          <span className={styles.avatar} aria-hidden="true">
            {initials(data.user.name, data.user.email)}
          </span>
          <div className={styles.personText}>
            <p className={styles.personName}>{data.user.name}</p>
            <span className={styles.personEmail}>{data.user.email}</span>
          </div>
        </div>
        <p className={styles.quiet} style={{ marginTop: 16, marginBottom: 0 }}>
          Joined {when(data.user.createdAt)} · {data.user.role === 'admin' ? 'Admin' : 'Member'} ·{' '}
          {data.user.emailVerified ? 'verified' : 'unverified'}
          {data.user.banned ? ` · banned${data.user.banReason ? `: ${data.user.banReason}` : ''}` : ''}
        </p>
      </div>

      <Section title="Today">
        {data.usageToday.length === 0 ? (
          <p className={styles.quiet} style={{ margin: 0 }}>No AI calls today.</p>
        ) : (
          <ul className={styles.plain}>
            {data.usageToday.map((u) => (
              <li key={u.endpoint}>
                {u.endpoint}: {u.calls}
                {u.cap ? ` / ${u.cap}` : ''} · {money(u.cost)}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Sites">
        {data.sites.length === 0 ? (
          <p className={styles.quiet} style={{ margin: 0 }}>None.</p>
        ) : (
          <ul className={styles.plain}>
            {data.sites.map((s) => (
              <li key={s.id}>
                <Link href={`/studio/site/?id=${s.id}`} prefetch={false}>{s.title}</Link> · {s.slug} · {when(s.updatedAt)}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Generations">
        {data.generations.length === 0 ? (
          <p className={styles.quiet} style={{ margin: 0 }}>None.</p>
        ) : (
          <ul className={styles.plain}>
            {data.generations.map((g) => (
              <li key={g.id}>
                <Link href={`/admin/generations/?id=${g.id}`} prefetch={false}>{g.description.slice(0, 80)}</Link> · {g.source} · {when(g.createdAt)}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

// ---- usage ------------------------------------------------------------------

export function UsagePanel() {
  const [days, setDays] = useState(14);
  const { data, error } = useAdminData<{
    days: number;
    byDay: { day: string; endpoint: string; calls: number; promptTokens: number; completionTokens: number; images: number; cost: number }[];
    topUsers: { userId: string; email: string; calls: number; cost: number }[];
  }>(`/api/admin/usage?days=${days}`);

  return (
    <>
      <div className={styles.toolbar} style={{ marginBottom: 18 }}>
        {[7, 14, 30, 90].map((n) => (
          <button key={n} type="button" className={`${styles.pill} ${n === days ? styles.pillOn : ''}`} onClick={() => setDays(n)}>
            {n} days
          </button>
        ))}
      </div>
      {!data ? (
        <Load error={error} />
      ) : (
        <>
          <div className={`${styles.panel} ${styles.scroll}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Endpoint</th>
                  <th>Calls</th>
                  <th>Prompt tokens</th>
                  <th>Output tokens</th>
                  <th>Images</th>
                  <th>Cost (est.)</th>
                </tr>
              </thead>
              <tbody>
                {data.byDay.map((r, i) => (
                  <tr key={i}>
                    <td>{r.day}</td>
                    <td>{r.endpoint}</td>
                    <td>{r.calls}</td>
                    <td>{r.promptTokens.toLocaleString()}</td>
                    <td>{r.completionTokens.toLocaleString()}</td>
                    <td>{r.images}</td>
                    <td>{money(r.cost)}</td>
                  </tr>
                ))}
                {data.byDay.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.empty}>Nothing in this window.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Top users</h2>
          </div>
          <div className={styles.card}>
            {data.topUsers.length === 0 ? (
              <p className={styles.quiet} style={{ margin: 0 }}>No AI calls in this window.</p>
            ) : (
              <ul className={styles.plain}>
                {data.topUsers.map((u) => (
                  <li key={u.userId}>
                    <Link href={`/admin/users/?id=${u.userId}`} prefetch={false}>{u.email}</Link> · {u.calls} calls · {money(u.cost)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
}

// ---- generations ------------------------------------------------------------

export function GenerationsPanel() {
  const { data, error } = useAdminData<{ generations: { id: string; userEmail: string; description: string; source: string; model: string; createdAt: string; sites: number }[] }>('/api/admin/generations?limit=100');
  if (!data) return <Load error={error} />;
  return (
    <div className={`${styles.panel} ${styles.scroll}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>When</th>
            <th>Who</th>
            <th>Description</th>
            <th>Source</th>
            <th>Model</th>
            <th>Sites</th>
          </tr>
        </thead>
        <tbody>
          {data.generations.map((g) => (
            <tr key={g.id}>
              <td>{when(g.createdAt)}</td>
              <td>{g.userEmail}</td>
              <td className={styles.wide}>
                <Link href={`/admin/generations/?id=${g.id}`} prefetch={false}>{g.description.slice(0, 90)}</Link>
              </td>
              <td>{g.source}</td>
              <td>{g.model}</td>
              <td>{g.sites}</td>
            </tr>
          ))}
          {data.generations.length === 0 ? (
            <tr>
              <td colSpan={6} className={styles.empty}>No generations yet.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export function GenerationDetailPanel({ id }: { id: string }) {
  const { data, error } = useAdminData<{ id: string; userEmail: string; description: string; source: string; model: string; responseId: string | null; createdAt: string; result: unknown; sites: { id: string; title: string; slug: string; revisions: number }[] }>(`/api/admin/generations/${id}`);
  if (!data) return <Load error={error} />;
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <p className={styles.quiet}>
          {data.userEmail} · {when(data.createdAt)} · {data.source} · {data.model}
          {data.responseId ? ` · ${data.responseId}` : ''}
        </p>
        <p style={{ margin: '0 0 12px', font: '400 16px / 1.6 var(--a-sans)' }}>{data.description}</p>
        <p className={styles.quiet} style={{ margin: 0 }}>
          <Link href={`/studio/results/?g=${data.id}`} prefetch={false}>Open the results page</Link>
        </p>
      </div>
      <Section title="Sites made from it">
        {data.sites.length === 0 ? (
          <p className={styles.quiet} style={{ margin: 0 }}>None.</p>
        ) : (
          <ul className={styles.plain}>
            {data.sites.map((s) => (
              <li key={s.id}>
                <Link href={`/studio/site/?id=${s.id}`} prefetch={false}>{s.title}</Link> · {s.slug} · {s.revisions} revisions
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section title="Document">
        <pre className={styles.pre}>{JSON.stringify(data.result, null, 2)}</pre>
      </Section>
    </div>
  );
}

// ---- templates, uploads, quotas, mail ---------------------------------------

export function TemplatesPanel() {
  const { data, error } = useAdminData<{ templates: { slug: string; name: string; copyRoles: string[]; slots: Record<string, number>; patterns: string[]; sites: number }[] }>('/api/admin/templates');
  if (!data) return <Load error={error} />;
  return (
    <div className={`${styles.panel} ${styles.scroll}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Template</th>
            <th>Sites</th>
            <th>Brand roles</th>
            <th>Text</th>
            <th>Images</th>
            <th>Patterns</th>
          </tr>
        </thead>
        <tbody>
          {data.templates.map((t) => (
            <tr key={t.slug}>
              <td>
                <Link href={`/template/${t.slug}/`} prefetch={false}>{t.name}</Link>
              </td>
              <td>{t.sites}</td>
              <td>{t.copyRoles.length ? t.copyRoles.join(', ') : ' - '}</td>
              <td>{t.slots.text ?? 0}</td>
              <td>{t.slots.image ?? 0}</td>
              <td className={styles.wide}>{t.patterns.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UploadsPanel() {
  const [busy, setBusy] = useState<string | null>(null);
  const { data, error, reload } = useAdminData<{ uploads: { id: string; src: string; bytes: number; note: string | null; createdAt: string; userEmail: string }[] }>('/api/admin/uploads?limit=100');
  if (!data) return <Load error={error} />;
  if (data.uploads.length === 0) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>No uploads.</p>
      </div>
    );
  }
  return (
    <ul className={styles.grid}>
      {data.uploads.map((u) => (
        <li key={u.id} className={styles.thumb}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={apiUrl(u.src)} alt={u.note ?? ''} />
          <div className={styles.thumbFoot}>
            <span className={styles.quiet} title={u.userEmail}>{u.userEmail}</span>
            <button
              type="button"
              className={styles.small}
              disabled={busy !== null}
              onClick={async () => {
                setBusy(u.id);
                await fetch(apiUrl(`/api/admin/uploads/${u.id}`), { method: 'DELETE', credentials: 'include' });
                setBusy(null);
                reload();
              }}
            >
              {busy === u.id ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function QuotasPanel() {
  const { data, error } = useAdminData<{ caps: Record<string, { calls: number; label: string }>; editable: boolean }>('/api/admin/quotas');
  if (!data) return <Load error={error} />;
  return (
    <>
      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Daily cap</th>
              <th>Label</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.caps).map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{v.calls}</td>
                <td>{v.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.footnote}>
        Read-only. The caps live in <code>worker/lib/quota.ts</code> and the burst windows in the routes; editing them here would mean a settings table read on every call.
      </p>
    </>
  );
}

export function MailPanel() {
  const { data, error } = useAdminData<{ mail: { email: string; subject: string; url: string; createdAt: string }[] }>('/api/admin/mail');
  if (!data) return <Load error={error ?? 'Only available in development.'} />;
  return (
    <div className={`${styles.panel} ${styles.scroll}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>When</th>
            <th>To</th>
            <th>Subject</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {data.mail.map((m, i) => (
            <tr key={i}>
              <td>{when(m.createdAt)}</td>
              <td>{m.email}</td>
              <td>{m.subject}</td>
              <td>
                <a href={m.url}>Open</a>
              </td>
            </tr>
          ))}
          {data.mail.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.empty}>Nothing yet.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
