'use client';

// Name, password, what is connected, and the one irreversible thing.
//
// Confirmations are toasts and validation is inline, which is the split the
// 2026 design draws and also the right one: "Name saved." is worth a glance
// and gone, while "the new passwords do not match" has to stay on screen
// beside the fields it is about.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toaster, { toaster } from 'components/Toaster';
import { authClient, useSessionUser } from 'lib/authClient';
import styles from './account.module.css';

type Linked = { providerId: string };

export default function SettingsPanel() {
  const router = useRouter();
  const { user } = useSessionUser();
  const [name, setName] = useState(user?.name ?? '');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [linked, setLinked] = useState<Linked[] | null>(null);
  const [busy, setBusy] = useState<'name' | 'password' | 'delete' | null>(null);
  const [passwordNote, setPasswordNote] = useState<string | null>(null);
  // The delete card has two steps: asking, then the password the API needs.
  const [confirming, setConfirming] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteNote, setDeleteNote] = useState<string | null>(null);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  useEffect(() => {
    authClient
      .listAccounts({ query: {} })
      .then((result) => setLinked((result.data as Linked[] | null) ?? []))
      .catch(() => setLinked([]));
  }, []);

  const nameDirty = name.trim() !== '' && name.trim() !== (user?.name ?? '');

  return (
    <div className={styles.settings}>
      <form
        className={styles.card}
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy('name');
          const result = await authClient.updateUser({ name: name.trim() });
          setBusy(null);
          toaster.add({
            title: result.error
              ? (result.error.message ?? 'Could not save your name.')
              : 'Name saved.',
          });
        }}
      >
        <h2 className={styles.h3}>Name</h2>
        <label className={styles.fieldRow}>
          <span>What to call you</span>
          <input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <button type="submit" className={styles.button} disabled={busy !== null || !nameDirty}>
          {busy === 'name' ? 'Saving...' : 'Save name'}
        </button>
      </form>

      <form
        className={styles.card}
        onSubmit={async (event) => {
          event.preventDefault();
          setPasswordNote(null);

          if (next !== confirm) {
            setPasswordNote('The new passwords do not match.');
            return;
          }

          if (next.length < 8) {
            setPasswordNote('Use at least 8 characters.');
            return;
          }

          setBusy('password');
          const result = await authClient.changePassword({
            currentPassword: current,
            newPassword: next,
            revokeOtherSessions: true,
          });
          setBusy(null);

          if (result.error) {
            setPasswordNote(result.error.message ?? 'Could not change the password.');
            return;
          }

          setCurrent('');
          setNext('');
          setConfirm('');
          toaster.add({
            title: 'Password changed.',
            description: 'Other sessions were signed out.',
          });
        }}
      >
        <h2 className={styles.h3}>Password</h2>
        <label className={styles.fieldRow}>
          <span>Current password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
          />
        </label>
        <label className={styles.fieldRow}>
          <span>New password</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={next}
            onChange={(event) => setNext(event.target.value)}
          />
        </label>
        <label className={styles.fieldRow}>
          <span>New password, again</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </label>
        <button type="submit" className={styles.button} disabled={busy !== null}>
          {busy === 'password' ? 'Changing...' : 'Change password'}
        </button>
        {passwordNote ? (
          <p className={`${styles.note} ${styles.noteBad}`} role="alert">
            {passwordNote}
          </p>
        ) : null}
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
        {user ? <p className={styles.note}>{user.email}</p> : null}
      </div>

      <div className={styles.card}>
        <h2 className={styles.h3}>Delete this account</h2>
        <p className={styles.quiet}>
          Removes your account, your sites and their revisions, your pictures and your usage
          history. There is no undo.
        </p>

        {confirming ? (
          <>
            <label className={styles.fieldRow}>
              <span>Type your password to confirm</span>
              <input
                type="password"
                autoComplete="current-password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
              />
            </label>
            <div className={styles.confirmRow}>
              <button
                type="button"
                className={`${styles.button} ${styles.destroy}`}
                disabled={busy !== null || deletePassword === ''}
                onClick={async () => {
                  setBusy('delete');
                  setDeleteNote(null);
                  const result = await authClient.deleteUser({ password: deletePassword });
                  setBusy(null);

                  if (result.error) {
                    setDeleteNote(result.error.message ?? 'Could not delete the account.');
                    return;
                  }

                  router.push('/');
                }}
              >
                {busy === 'delete' ? 'Deleting...' : 'Yes, delete everything'}
              </button>
              <button
                type="button"
                className={styles.keep}
                onClick={() => {
                  setConfirming(false);
                  setDeletePassword('');
                  setDeleteNote(null);
                }}
              >
                Keep my account
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className={`${styles.button} ${styles.danger}`}
            disabled={busy !== null}
            onClick={() => setConfirming(true)}
          >
            Delete my account
          </button>
        )}

        {deleteNote ? (
          <p className={`${styles.note} ${styles.noteBad}`} role="alert">
            {deleteNote}
          </p>
        ) : null}
      </div>

      <Toaster />
    </div>
  );
}
