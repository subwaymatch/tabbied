'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { SiteSummary } from 'lib/studioDocument';
import { apiFetch } from 'lib/apiFetch';
import shell from './account.module.css';
import styles from './YourSites.module.css';

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; sites: SiteSummary[] };

const when = (value: string | Date) =>
  new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

/** The sites this person has made, newest first. Session-scoped on the API side. */
export default function YourSites() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let live = true;

    apiFetch<{ sites: SiteSummary[] }>('/api/studio/sites')
      .then(({ sites }) => {
        if (live) setState({ status: 'ready', sites });
      })
      .catch(() => {
        if (live) setState({ status: 'error' });
      });

    return () => {
      live = false;
    };
  }, []);

  return (
    <div className={shell.panel}>
      <div className={`${shell.tableHead} ${styles.columns}`} aria-hidden="true">
        <div>Site</div>
        <div>Direction · template</div>
        <div>Revisions</div>
        <div />
      </div>

      {state.status === 'loading' ? (
        <p className={shell.empty}>Loading your sites...</p>
      ) : state.status === 'error' ? (
        <p className={shell.empty}>Could not load your sites right now.</p>
      ) : state.sites.length === 0 ? (
        <p className={shell.empty}>
          No sites yet. Generate three directions in <Link href="/studio">Studio</Link> and
          make one.
        </p>
      ) : (
        state.sites.map((site) => (
          <div key={site.id} className={`${shell.row} ${styles.columns}`}>
            <Link href={`/studio/site/?id=${site.id}`} prefetch={false} className={styles.link}>
              <span className={styles.swatches} aria-hidden="true">
                {site.palette.slice(0, 4).map((color, index) => (
                  <span key={`${color}-${index}`} style={{ background: color }} />
                ))}
              </span>
              <span>
                <span className={styles.title}>{site.title}</span>
                <span className={shell.rowMeta} style={{ display: 'block' }}>
                  Updated {when(site.updatedAt)}
                </span>
              </span>
            </Link>
            <span className={shell.rowValue}>
              {site.stance ? `${site.stance} · ` : ''}
              {site.templateName}
            </span>
            <span className={shell.rowValue}>
              {site.revisions === 1 ? '1 revision' : `${site.revisions} revisions`}
            </span>
            <Link href={`/studio/site/?id=${site.id}`} prefetch={false} className={shell.rowAction}>
              Open &rarr;
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
