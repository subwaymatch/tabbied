'use client';

// The three small pages around a password: asking for a reset link, using
// it, and the landing for the email-verification link. Each is one form and
// one message, in the sign-in form's own clothes.
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient, useSessionUser } from 'lib/authClient';
import styles from './AuthForm.module.css';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>Check your email</h1>
        <p className={styles.lede}>
          If there is an account for <strong>{email}</strong>, a reset link is on
          its way.
        </p>
        <p className={styles.swap}>
          <Link href="/sign-in">Back to sign in</Link>
        </p>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);

        const result = await authClient.requestPasswordReset({
          email,
          redirectTo: '/reset-password/',
        });

        setPending(false);

        if (result.error) {
          setError(result.error.message ?? 'That did not work. Try again.');
          return;
        }

        setSent(true);
      }}
    >
      <h1 className={styles.title}>Reset your password</h1>
      <p className={styles.lede}>Enter your email and we'll send a link.</p>
      <label className={styles.field}>
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'One moment...' : 'Send the link'}
      </button>
      <p className={styles.swap}>
        <Link href="/sign-in">Back to sign in</Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get('token');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>That link is incomplete</h1>
        <p className={styles.lede}>Ask for a new one and follow it from the email.</p>
        <p className={styles.swap}>
          <Link href="/forgot-password">Request a reset link</Link>
        </p>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);

        const result = await authClient.resetPassword({ newPassword: password, token });

        setPending(false);

        if (result.error) {
          setError(result.error.message ?? 'That link may have expired. Ask for a new one.');
          return;
        }

        router.push('/sign-in');
      }}
    >
      <h1 className={styles.title}>Choose a new password</h1>
      <p className={styles.lede}>At least eight characters.</p>
      <label className={styles.field}>
        <span>New password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'One moment...' : 'Set the password'}
      </button>
    </form>
  );
}

/** Where the verification link lands. better-auth has already acted by now. */
export function VerifyEmailNotice() {
  const problem = useSearchParams().get('error');
  const { user, isPending } = useSessionUser();

  if (problem) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>That link didn't work</h1>
        <p className={styles.lede}>
          It may have expired or already been used. Sign in to request another.
        </p>
        <p className={styles.swap}>
          <Link href="/sign-in">Sign in</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Email confirmed</h1>
      <p className={styles.lede}>
        {isPending
          ? 'Signing you in...'
          : user
            ? `You're signed in as ${user.email}.`
            : 'Your address is confirmed. Sign in to continue.'}
      </p>
      <p className={styles.swap}>
        {user ? <Link href="/studio">Go to Studio</Link> : <Link href="/sign-in">Sign in</Link>}
      </p>
    </div>
  );
}
