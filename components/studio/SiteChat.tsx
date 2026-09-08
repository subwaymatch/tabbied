'use client';

// Changes by request, and the history they make.
//
// A request goes to the model with the page as it currently reads and comes
// back as a diff, stored as the next revision with the request beside it. The
// history is the list of those revisions; restoring one writes it again as a
// new head rather than deleting anything after it, so "go back" never loses
// the way forward.
import { useCallback, useEffect, useState } from 'react';
import type { EditsDocument } from 'tabbied-templates';
import type { StoredRevision } from 'lib/studioDocument';
import { apiFetch, ApiError } from 'lib/apiFetch';
import styles from './SiteChat.module.css';

type HistoryRow = Pick<StoredRevision, 'n' | 'instruction' | 'source' | 'createdAt'>;

const when = (value: string | Date) =>
  new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const describe = (row: HistoryRow) => {
  if (row.instruction) return row.instruction;
  switch (row.source) {
    case 'manual':
      return 'Edited by hand';
    case 'fallback':
      return 'Brand copy only';
    default:
      return row.n === 1 ? 'First draft' : 'Generated';
  }
};

export default function SiteChat({
  siteId,
  head,
  onRevision,
}: {
  siteId: string;
  /** The current head's number; the list reloads when it moves. */
  head: number;
  onRevision: () => void;
}) {
  const [instruction, setInstruction] = useState('');
  const [busy, setBusy] = useState<'asking' | number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);

  useEffect(() => {
    let live = true;

    apiFetch<{ revisions: HistoryRow[] }>(`/api/studio/sites/${siteId}/revisions`)
      .then(({ revisions }) => {
        if (live) setHistory(Array.isArray(revisions) ? revisions : []);
      })
      .catch(() => {});

    return () => {
      live = false;
    };
  }, [siteId, head]);

  const ask = useCallback(async () => {
    const trimmed = instruction.trim();
    if (trimmed.length < 3) return;

    setBusy('asking');
    setError(null);
    setNote(null);

    try {
      const { note: reply } = await apiFetch<{ revision: number; note: string }>(
        `/api/studio/sites/${siteId}/revise`,
        { method: 'POST', body: JSON.stringify({ instruction: trimmed }) }
      );
      setNote(reply);
      setInstruction('');
      onRevision();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not make that change.');
    } finally {
      setBusy(null);
    }
  }, [instruction, onRevision, siteId]);

  const restore = useCallback(
    async (n: number) => {
      setBusy(n);
      setError(null);

      try {
        const { edits } = await apiFetch<{ edits: EditsDocument }>(
          `/api/studio/sites/${siteId}/revisions/${n}`
        );
        await apiFetch(`/api/studio/sites/${siteId}/revisions`, {
          method: 'POST',
          body: JSON.stringify({ edits }),
        });
        setNote(`Restored revision ${n} as the newest.`);
        onRevision();
      } catch (cause) {
        setError(cause instanceof ApiError ? cause.message : 'Could not restore that.');
      } finally {
        setBusy(null);
      }
    },
    [onRevision, siteId]
  );

  return (
    <section className={styles.panel} aria-label="Ask for changes">
      <form
        className={styles.ask}
        onSubmit={(event) => {
          event.preventDefault();
          void ask();
        }}
      >
        <label className={styles.label} htmlFor="site-chat-instruction">
          Ask for a change
        </label>
        <textarea
          id="site-chat-instruction"
          className={styles.input}
          rows={2}
          placeholder="Make the headline warmer. Mention weekend viewings."
          value={instruction}
          maxLength={600}
          onChange={(event) => setInstruction(event.target.value)}
          disabled={busy !== null}
        />
        <div className={styles.row}>
          <span className={styles.count}>{instruction.length}/600</span>
          <button
            type="submit"
            className={styles.send}
            disabled={busy !== null || instruction.trim().length < 3}
          >
            {busy === 'asking' ? 'Changing...' : 'Change it'}
          </button>
        </div>
      </form>

      {note ? (
        <p className={styles.note} role="status">
          {note}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <h3 className={styles.historyTitle}>History</h3>
      <ol className={styles.history}>
        {history.map((row) => (
          <li key={row.n} className={styles.revision}>
            <span className={styles.n}>{row.n}</span>
            <span className={styles.what}>
              <span className={styles.desc}>{describe(row)}</span>
              <span className={styles.when}>{when(row.createdAt)}</span>
            </span>
            {row.n !== head ? (
              <button
                type="button"
                className={styles.restore}
                disabled={busy !== null}
                onClick={() => void restore(row.n)}
              >
                {busy === row.n ? 'Restoring...' : 'Restore'}
              </button>
            ) : (
              <span className={styles.current}>Current</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
