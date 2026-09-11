'use client';

// The one door into the customizer from a template: /studio/customize/?slug=.
//
// A gallery card, a template preview and the account's "Create new site" all
// link here rather than each holding the make-a-site call, so there is one
// implementation of it and one place the sign-in detour lives. Signed out,
// the person is sent to sign in with this page as the way back; signed in, a
// site is made from the template and the customizer opens on it. Each visit
// is a new copy - that is what "Create new site" means - so the call is made
// once per mount and never on a re-render.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch, ApiError } from 'lib/apiFetch';
import { useSessionUser } from 'lib/authClient';
import styles from './StudioPreview.module.css';

const SLUG = /^[a-z0-9-]{1,80}$/;

export default function StudioCustomize() {
  const params = useSearchParams();
  const slug = params.get('slug') ?? '';
  const router = useRouter();
  const { user, isPending } = useSessionUser();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const valid = SLUG.test(slug);

  useEffect(() => {
    if (!valid || isPending || started.current) return;

    if (!user) {
      const next = encodeURIComponent(`/studio/customize/?slug=${slug}`);
      router.replace(`/sign-in?next=${next}`);
      return;
    }

    started.current = true;

    apiFetch<{ id: string }>('/api/studio/sites', {
      method: 'POST',
      body: JSON.stringify({ slug }),
    })
      .then(({ id }) => router.replace(`/studio/site/?id=${id}`))
      .catch((cause) => {
        setError(cause instanceof ApiError ? cause.message : 'Could not start from this template.');
      });
  }, [valid, isPending, user, slug, router]);

  if (!valid) {
    return (
      <p className={styles.notice} role="alert">
        That template link is incomplete.{' '}
        <Link href="/templates" className={styles.back} prefetch={false}>
          All templates
        </Link>
        .
      </p>
    );
  }

  if (error) {
    return (
      <p className={styles.notice} role="alert">
        {error}{' '}
        <Link href={`/templates/${slug}/`} className={styles.back} prefetch={false}>
          Back to the template
        </Link>
        .
      </p>
    );
  }

  return (
    <p className={styles.notice} role="status">
      {isPending || !user ? 'Checking your session...' : 'Making your copy of the template...'}
    </p>
  );
}
