'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import StudioHeader from 'components/studio/StudioHeader';
import { apiFetch } from 'lib/apiFetch';
import { signIn, signUp } from 'lib/authClient';
import styles from './AuthForm.module.css';

// Sign-in and sign-up are the same form with two labels and one extra field,
// so they are one component: the states that matter (pending, error, "check
// your mail") are identical, and keeping them together is what stops the two
// pages drifting apart.

type Mode = 'sign-in' | 'sign-up';

const COPY = {
  'sign-in': {
    title: 'Sign in',
    lede: 'Studio generations are tied to an account, so your results are yours to come back to.',
    submit: 'Sign in',
    swapText: 'No account yet?',
    swapLabel: 'Create one',
    swapHref: '/sign-up',
  },
  'sign-up': {
    title: 'Create an account',
    lede: 'You need one to generate with AI. Browsing patterns, templates and library matches never asks for it.',
    submit: 'Create account',
    swapText: 'Already have one?',
    swapLabel: 'Sign in',
    swapHref: '/sign-in',
  },
} as const;

/** Where to land afterwards. Same-origin paths only - never an open redirect. */
function safeNext(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/studio';
}

// ---- providers --------------------------------------------------------------
//
// The Worker configures a provider or it does not (worker/auth.ts), and only
// it knows which. The form asks once and draws a button per answer, so a
// provider that is not set up is never a button that 500s on click - and with
// no Worker at all (the export served alone) the request fails quietly and
// the form is email and password, which always works.

type Provider = 'google' | 'apple' | 'github';

const PROVIDERS: Provider[] = ['google', 'apple', 'github'];
const PROVIDER_LABEL: Record<Provider, string> = {
  google: 'Google',
  apple: 'Apple',
  github: 'GitHub',
};

const isProvider = (value: string): value is Provider =>
  (PROVIDERS as string[]).includes(value);

function useProviders(): Provider[] {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    let live = true;

    apiFetch<{ providers: string[] }>('/api/auth-providers')
      .then(({ providers: configured }) => {
        if (live) setProviders(configured.filter(isProvider));
      })
      .catch(() => {
        // No Worker, or none configured: the form stays email and password.
      });

    return () => {
      live = false;
    };
  }, []);

  return providers;
}

function ProviderIcon({ provider }: { provider: Provider }) {
  switch (provider) {
    case 'google':
      return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.2z" />
          <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.2 15.4 46 24 46z" />
          <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5C2.9 17.2 2 20.5 2 24s.9 6.8 2.5 10l7.3-5.7z" />
          <path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.4 2 8.1 6.8 4.5 13.7l7.3 5.7c1.7-5.2 6.5-8.7 12.2-8.7z" />
        </svg>
      );
    case 'apple':
      return (
        <svg width="17" height="20" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
      );
    case 'github':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
  }
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const providers = useProviders();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result =
      mode === 'sign-up'
        ? await signUp.email({ name, email, password, callbackURL: '/verify-email/' })
        : await signIn.email({ email, password });

    setPending(false);

    if (result.error) {
      setError(result.error.message ?? 'That did not work. Try again.');
      return;
    }

    // A new account has no session until the address is confirmed, so there is
    // nowhere to send them yet - say so rather than bouncing to a page that
    // will tell them they are signed out.
    if (mode === 'sign-up') {
      setSent(true);
      return;
    }

    router.push(next);
  }

  /**
   * A provider round-trip. better-auth navigates the whole window to the
   * provider and back; the callback is absolute because in development the
   * Worker answers on another port and a relative path would land there.
   */
  async function social(provider: Provider) {
    setPending(true);
    setError(null);

    const result = await signIn.social({
      provider,
      callbackURL: `${window.location.origin}${next}`,
    });

    if (result.error) {
      setError(result.error.message ?? `Could not continue with ${PROVIDER_LABEL[provider]}.`);
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>Check your email</h1>
        <p className={styles.lede}>
          We sent a confirmation link to <strong>{email}</strong>. Follow it and
          you'll be signed in.
        </p>
        <p className={styles.swap}>
          <Link href="/studio">Back to Studio</Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.lede}>{copy.lede}</p>

      {providers.length > 0 ? (
        <>
          <div className={styles.providers}>
            {providers.map((provider) => (
              <button
                key={provider}
                type="button"
                className={styles.provider}
                disabled={pending}
                onClick={() => void social(provider)}
              >
                <ProviderIcon provider={provider} />
                Continue with {PROVIDER_LABEL[provider]}
              </button>
            ))}
          </div>
          <div className={styles.divider} aria-hidden="true">
            <span className={styles.dividerLabel}>or</span>
          </div>
        </>
      ) : null}

      <div className={styles.fields}>
        {mode === 'sign-up' ? (
          <label className={styles.field}>
            <span>Name</span>
            <input
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        ) : null}

        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Password</span>
          <input
            type="password"
            autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
            placeholder={'\u2022'.repeat(8)}
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
      </div>

      {mode === 'sign-in' ? (
        <Link href="/forgot-password" className={styles.aside}>
          Forgot your password?
        </Link>
      ) : null}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'One moment...' : copy.submit}
      </button>

      <p className={styles.swap}>
        {copy.swapText} <Link href={copy.swapHref}>{copy.swapLabel}</Link>
      </p>
    </form>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StudioHeader backHref="/" backLabel="Back to the homepage" title="Account" />
      {children}
    </>
  );
}
