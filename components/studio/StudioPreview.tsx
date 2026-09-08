'use client';

// One direction, on the actual template - the three-string rebrand.
//
// Everything here happens in the browser and it has to: the edits engine works
// against a DOM, the packaged template is a static asset, and the generation is
// behind a capability id in the query string. Nothing about this page is
// prerenderable, which is why it is a client component behind a Suspense
// boundary rather than a route the export could try to build.
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { directionToEdits, type Problem, type TemplateSpec } from 'tabbied-templates';
import type { StoredDirection, StoredGeneration } from 'lib/studioDocument';
import { apiFetch, ApiError } from 'lib/apiFetch';
import {
  buildPreviewDocument,
  packagedTemplateUrl,
  templateSpecUrl,
} from 'lib/studioPreview';
import PreviewFrame from './PreviewFrame';
import styles from './StudioPreview.module.css';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; direction: StoredDirection; html: string; problems: Problem[] };

export default function StudioPreview() {
  const searchParams = useSearchParams();
  const generationId = searchParams.get('g');
  const index = Number(searchParams.get('i') ?? '0');

  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async (): Promise<State> => {
    if (!generationId || !Number.isInteger(index) || index < 0) {
      return { status: 'error', message: 'That preview link is incomplete.' };
    }

    const stored = await apiFetch<StoredGeneration>(`/api/studio/generations/${generationId}`);
    const direction = stored.result.directions[index];

    if (!direction) {
      return { status: 'error', message: 'That direction is no longer in this set.' };
    }

    // The spec and the package are plain static assets, so they are fetched
    // directly rather than through apiFetch - there is no API involved and no
    // session to carry.
    const [specResponse, htmlResponse] = await Promise.all([
      fetch(templateSpecUrl(direction.slug)),
      fetch(`${packagedTemplateUrl(direction.slug)}index.html`),
    ]);

    if (!specResponse.ok || !htmlResponse.ok) {
      return { status: 'error', message: `The ${direction.name} template is not available to preview.` };
    }

    const spec = (await specResponse.json()) as TemplateSpec;
    const { html, problems } = buildPreviewDocument({
      html: await htmlResponse.text(),
      spec,
      edits: directionToEdits(spec, { copy: direction.copy, palette: direction.palette }),
      slug: direction.slug,
    });

    return { status: 'ready', direction, html, problems };
  }, [generationId, index]);

  useEffect(() => {
    let live = true;

    setState({ status: 'loading' });

    load()
      .then((next) => {
        if (live) setState(next);
      })
      .catch((cause) => {
        if (!live) return;

        setState({
          status: 'error',
          message:
            cause instanceof ApiError && cause.status === 404
              ? 'That link has expired or never existed.'
              : 'Could not build this preview.',
        });
      });

    return () => {
      live = false;
    };
  }, [load]);

  if (state.status === 'error') {
    return (
      <p className={styles.notice} role="alert">
        {state.message}{' '}
        <Link href="/studio" className={styles.back}>
          Start again
        </Link>
        .
      </p>
    );
  }

  if (state.status === 'loading') {
    return (
      <div className={styles.frame}>
        <div className={styles.skeleton} aria-hidden="true" />
        <p className={styles.loading}>Building the preview...</p>
      </div>
    );
  }

  const { direction, html, problems } = state;

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.meta}>
          <h1 className={styles.stance}>{direction.stance}</h1>
          <p className={styles.built}>
            {direction.copy?.brandName ?? direction.name} · built on {direction.name}
          </p>
        </div>

        <div className={styles.actions}>
          <Link
            href={`/studio/results/?g=${generationId}`}
            prefetch={false}
            className={styles.action}
          >
            All three
          </Link>
          <a
            href={`/downloads/${direction.slug}-html.zip`}
            className={`${styles.action} ${styles.download}`}
            download
          >
            Download
          </a>
        </div>
      </div>

      <PreviewFrame
        html={html}
        problems={problems}
        title={`${direction.stance} - a preview built on the ${direction.name} template`}
      />
    </>
  );
}
