'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from 'lib/apiFetch';
import styles from './account.module.css';

type Usage = {
  resetsAt: string;
  usage: { endpoint: string; label: string; used: number; cap: number }[];
  recent: {
    endpoint: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    imageCount: number;
    createdAt: string;
  }[];
};

const when = (value: string) =>
  new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

/** Today's spend against the caps, and the recent ledger. */
export default function UsagePanel() {
  const [data, setData] = useState<Usage | null | 'error'>(null);

  useEffect(() => {
    apiFetch<Usage>('/api/account/usage')
      .then(setData)
      .catch(() => setData('error'));
  }, []);

  if (data === null) return <p className={styles.quiet}>Loading...</p>;
  if (data === 'error') return <p className={styles.quiet}>Could not load your usage.</p>;

  return (
    <>
      <div className={styles.card}>
        <h2 className={styles.h3}>Today, against the caps</h2>
        <ul className={styles.meters}>
        {data.usage.map((row) => (
          <li key={row.endpoint} className={styles.meter}>
            <div className={styles.meterHead}>
              <span>{row.label}</span>
              <span className={styles.quiet}>
                {row.used} / {row.cap} today
              </span>
            </div>
            <div className={styles.bar} aria-hidden="true">
              <span style={{ width: `${Math.min(100, (row.used / row.cap) * 100)}%` }} />
            </div>
          </li>
        ))}
        </ul>
        <p className={styles.quiet} style={{ marginTop: 18 }}>
          Caps reset at {when(data.resetsAt)}.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.h2}>Recent</h2>
      </div>
      {data.recent.length === 0 ? (
        <div className={styles.panel}>
          <p className={styles.empty}>Nothing yet. AI calls will be listed here as they happen.</p>
        </div>
      ) : (
        <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>When</th>
              <th>What</th>
              <th>Model</th>
              <th>Tokens</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((row, index) => (
              <tr key={index}>
                <td>{when(row.createdAt)}</td>
                <td>{row.endpoint}</td>
                <td>{row.model}</td>
                <td>
                  {row.imageCount > 0
                    ? `${row.imageCount} image${row.imageCount === 1 ? '' : 's'}`
                    : `${row.promptTokens + row.completionTokens}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </>
  );
}
