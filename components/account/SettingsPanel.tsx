'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient, useSessionUser } from 'lib/authClient';
import styles from './account.module.css';

type Linked = { providerId: string };

/** Name, password, what is connected, and the one irreversible thing. */
export default function SettingsPanel() {
  const router = useRouter();
  const { user } = useSessionUser();
  const [name, setName] = useState(user?.name ?? '');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [linked, setLinked] = useState<Linked[] | null>(null);
  const [busy, setBusy] = useState<'name' | 'password' | 'delete' | null>(null);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  useEffect(() => {
    authClient
      .listAccounts({ query: {} })
      .then((result) => setLinked((result.data as Linked[] | null) ?? []))
      .catch(() => setLinked([]));
  }, []);

  const say = (kind: 'ok' | 'error', text: string) => setMessage({ kind, text });

  return (
    <div className={styles.settings}>
      {message ? (
        <p className={message.kind === 'ok' ? styles.ok : styles.error} role={message.kind === 'ok' ? 'status' : 'alert'}>
          {message.text}
        </p>
      ) : null}

      <form
        className={styles.card}
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy('name');
          setMessage(null);
          const result = await authClient.updateUser({ name: name.trim() });
          setBusy(null);
          if (result.error) say('error', result.error.message ?? 'Could not save your name.');
          else say('ok', 'Name saved.');
        }}
      >
        <h2 className={styles.h3}>Name</h2>
        <label className={styles.fieldRow}>
          <span>What to call you</span>
          <input type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit" className={styles.button} disabled={busy !== null || name.trim() === (user?.name ?? '')}>
          {busy === 'name' ? 'Saving...' : 'Save name'}
        </button>
      </form>

      <form
        className={styles.card}
        onSubmit={async (event) => {
          event.preventDefault();
          if (next !== confirm) {
            say('error', 'The new passwords do not match.');
            return;
          }
          setBusy('password');
          setMessage(null);
          const result = await authClient.changePassword({
            currentPassword: current,
            newPassword: next,
            revokeOtherSessions: true,
          });
          setBusy(null);
          if (result.error) say('error', result.error.message ?? 'Could not change the password.');
          else {
            setCurrent('');
            setNext('');
            setConfirm('');
            say('ok', 'Password changed. Other sessions were signed out.');
          }
        }}
      >
        <h2 className={styles.h3}>Password</h2>
        <label className={styles.fieldRow}>
          <span>Current password</span>
          <input type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
        </label>
        <label className={styles.fieldRow}>
          <span>New password</span>
          <input type="password" autoComplete="new-password" required minLength={8} value={next} onChange={(e) => setNext(e.target.value)} />
        </label>
        <label className={styles.fieldRow}>
          <span>New password, again</span>
          <input type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <button type="submit" className={styles.button} disabled={busy !== null}>
          {busy === 'password' ? 'Changing...' : 'Change password'}
        </button>
      </form>

      <div className={styles.card}>
        <h2 className={styles.h3}>Signed in with</h2>
        {linked === null ? (
          <p className={styles.quiet}>Loading...</p>
        ) : (
          <ul className={styles.providers}>
            {linked.map((account) => (
              <li key={account.providerId}>
                {account.providerId === 'credential'
                  ? 'Email and password'
                  : account.providerId.charAt(0).toUpperCase() + account.providerId.slice(1)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.card}>
      <h2 className={styles.h3}>Delete this account</h2>
      <p className={styles.quiet}>
        Removes your account, your sites and their revisions, your pictures and your usage
        history. There is no undo.
      </p>
      <button
        type="button"
        className={`${styles.button} ${styles.danger}`}
        disabled={busy !== null}
        onClick={async () => {
          const password = window.prompt('Type your password to delete your account. This cannot be undone.');
          if (!password) return;
          setBusy('delete');
          setMessage(null);
          const result = await authClient.deleteUser({ password });
          setBusy(null);
          if (result.error) say('error', result.error.message ?? 'Could not delete the account.');
          else router.push('/');
        }}
      >
        {busy === 'delete' ? 'Deleting...' : 'Delete my account'}
      </button>
      </div>
    </div>
  );
}
