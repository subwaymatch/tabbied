'use client';

// The account's front page: what Studio has been asked for, and what today's
// spending looks like against the caps.
//
// Three reads, in parallel - sites, generations, usage - and one list made
// from the first two. A site and a generation are different things to the
// API (one is a full document on a template, the other is three directions
// to choose between) and the same thing to the person: a request they made
// and can go back to. So the history shows them together, newest first,
// each tagged with which kind it was.
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { GenerationSummary, SiteSummary } from 'lib/studioDocument';
import { apiFetch } from 'lib/apiFetch';
import AccountPage from './AccountPage';
import shell from './account.module.css';
import styles from './AccountOverview.module.css';

type Usage = {
  resetsAt: string;
  usage: { endpoint: string; label: string; used: number; cap: number }[];
};

type Loaded = {
  sites: SiteSummary[];
  generations: GenerationSummary[];
  usage: Usage | null;
};

type State = { status: 'loading' } | { status: 'error' } | ({ status: 'ready' } & Loaded);

/** One row of the history, whichever kind of request it was. */
type Request = {
  key: string;
  kind: 'site' | 'directions' | 'matched';
  title: string;
  at: Date;
  palette: string[];
  detail: string;
  href: string;
  action: string;
};

const KIND_LABEL: Record<Request['kind'], string> = {
  site: 'Make my website',
  directions: 'Three directions',
  matched: 'Matched from the library',
};

const KIND_CLASS: Record<Request['kind'], string> = {
  site: styles.tagSite,
  directions: styles.tagDirections,
  matched: styles.tagMatched,
};

/** "Today, 6:42 PM" · "Yesterday, 9:18 PM" · "Aug 31, 2:14 PM". */
function when(value: Date): string {
  const now = new Date();
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const time = value.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  if (sameDay(value, now)) return `Today, ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(value, yesterday)) return `Yesterday, ${time}`;

  const day = value.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(value.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' }),
  });

  return `${day}, ${time}`;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

function toRequests({ sites, generations }: Loaded): Request[] {
  const rows: Request[] = [
    ...sites.map<Request>((site) => ({
      key: `site:${site.id}`,
      kind: 'site',
      title: site.title,
      at: new Date(site.updatedAt),
      palette: site.palette,
      detail: `${site.stance ? `${site.stance} · ` : ''}${site.templateName} · ${plural(site.revisions, 'revision')}`,
      href: `/studio/site/?id=${site.id}`,
      action: 'Open site',
    })),
    ...generations.map<Request>((generation) => ({
      key: `generation:${generation.id}`,
      kind: generation.source === 'matched-fallback' ? 'matched' : 'directions',
      title: generation.description,
      at: new Date(generation.createdAt),
      palette: generation.directions[0]?.palette ?? [],
      detail:
        generation.directions.map((direction) => direction.name).join(' · ') +
        (generation.sites > 0 ? ` · ${plural(generation.sites, 'site')} made` : ''),
      href: `/studio/results/?g=${generation.id}`,
      action: 'View results',
    })),
  ];

  return rows.sort((a, b) => b.at.getTime() - a.at.getTime());
}

export default function AccountOverview() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [newestFirst, setNewestFirst] = useState(true);

  useEffect(() => {
    let live = true;

    Promise.all([
      apiFetch<{ sites: SiteSummary[] }>('/api/studio/sites'),
      apiFetch<{ generations: GenerationSummary[] }>('/api/studio/generations'),
      // Usage failing should not take the history with it.
      apiFetch<Usage>('/api/account/usage').catch(() => null),
    ])
      .then(([{ sites }, { generations }, usage]) => {
        if (live) setState({ status: 'ready', sites, generations, usage });
      })
      .catch(() => {
        if (live) setState({ status: 'error' });
      });

    return () => {
      live = false;
    };
  }, []);

  const requests = useMemo(
    () => (state.status === 'ready' ? toRequests(state) : []),
    [state]
  );
  const ordered = newestFirst ? requests : [...requests].reverse();

  const ready = state.status === 'ready' ? state : null;
  const revisions = ready?.sites.reduce((sum, site) => sum + site.revisions, 0) ?? 0;

  return (
    <AccountPage
      eyebrow="Studio history"
      title="Your recent requests"
      lede="Return to any website you made or matched with Studio."
      action={{ href: '/studio', label: '+ New Studio request' }}
    >
      <div className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Studio requests</p>
          <div className={styles.figure}>
            <span className={styles.figureValue}>
              {ready ? requests.length : <span className={styles.skeleton} style={{ width: 48, height: 40, display: 'inline-block' }} />}
            </span>
            <span className={styles.figureNote}>All time</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.dark}`}>
          <div className={styles.darkHead}>
            <p className={styles.cardLabel}>Today's AI usage</p>
            {ready?.usage ? (
              <span className={styles.resets}>
                Resets{' '}
                {new Date(ready.usage.resetsAt).toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            ) : null}
          </div>
          {ready?.usage ? (
            <ul className={styles.meters}>
              {ready.usage.usage.map((row) => (
                <li key={row.endpoint}>
                  <div className={styles.meterHead}>
                    <span>{row.label}</span>
                    <strong>
                      {row.used} / {row.cap}
                    </strong>
                  </div>
                  <div className={styles.meterBar} aria-hidden="true">
                    <span style={{ width: `${Math.min(100, (row.used / row.cap) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.darkQuiet}>
              {state.status === 'loading' ? 'Reading today\'s usage...' : 'Usage is not available right now.'}
            </p>
          )}
        </div>
      </div>

      {ready ? (
        <ul className={styles.counts}>
          <li className={styles.count}>
            <span className={styles.countValue}>{ready.sites.length}</span>
            Websites made
          </li>
          <li className={styles.count}>
            <span className={styles.countValue}>{ready.generations.length}</span>
            Direction sets
          </li>
          <li className={styles.count}>
            <span className={styles.countValue}>{revisions}</span>
            Revisions saved
          </li>
        </ul>
      ) : null}

      <div className={styles.recentsHead}>
        <h2 className={shell.h2}>Recents</h2>
        <button
          type="button"
          className={styles.sort}
          onClick={() => setNewestFirst((value) => !value)}
          aria-label={newestFirst ? 'Sorted newest first. Show oldest first' : 'Sorted oldest first. Show newest first'}
        >
          <span>{newestFirst ? 'Newest first' : 'Oldest first'}</span>
          <span className={styles.sortGlyph} aria-hidden="true">
            &#9662;
          </span>
        </button>
      </div>

      <div className={shell.panel}>
        <div className={`${shell.tableHead} ${styles.columns}`} aria-hidden="true">
          <div>Recent</div>
          <div>Request type</div>
          <div>Details</div>
          <div />
        </div>

        {state.status === 'loading' ? (
          [0, 1].map((i) => (
            <div key={i} className={`${shell.row} ${styles.columns}`} aria-hidden="true">
              <div>
                <div className={styles.skeleton} style={{ width: '60%', marginBottom: 8 }} />
                <div className={styles.skeleton} style={{ width: '30%', height: 12 }} />
              </div>
              <div className={styles.skeleton} style={{ width: 120, height: 28, borderRadius: 999 }} />
              <div className={styles.skeleton} style={{ width: '70%' }} />
              <div />
            </div>
          ))
        ) : state.status === 'error' ? (
          <p className={shell.empty}>Could not load your history right now.</p>
        ) : ordered.length === 0 ? (
          <p className={shell.empty}>
            Nothing yet. Describe your business in <Link href="/studio">Studio</Link> and
            the results will be here to come back to.
          </p>
        ) : (
          ordered.map((request) => (
            <div key={request.key} className={`${shell.row} ${styles.columns}`}>
              <div>
                <p className={shell.rowTitle}>{request.title}</p>
                <p className={shell.rowMeta}>{when(request.at)}</p>
              </div>
              <div>
                <span className={`${styles.tag} ${KIND_CLASS[request.kind]}`}>
                  {KIND_LABEL[request.kind]}
                </span>
              </div>
              <p className={styles.detail}>
                {request.palette.length > 0 ? (
                  <span className={styles.swatches} aria-hidden="true">
                    {request.palette.slice(0, 4).map((color, index) => (
                      <span key={`${color}-${index}`} style={{ background: color }} />
                    ))}
                  </span>
                ) : null}
                {request.detail}
              </p>
              <Link href={request.href} prefetch={false} className={shell.rowAction}>
                {request.action} &rarr;
              </Link>
            </div>
          ))
        )}
      </div>

      <p className={shell.footnote}>
        Daily caps reset at midnight UTC. Matching from the library is always free and
        never counted.
      </p>
    </AccountPage>
  );
}
