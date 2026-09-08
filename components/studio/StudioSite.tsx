'use client';

// A site: the full document on its template, at its latest revision.
//
// The same shell as the direction preview, loading a different document. What
// this page is *for* - editing, revising, exporting - lands on it in turn; the
// canvas is the part everything else needs first.
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Problem, TemplateSpec } from 'tabbied-templates';
import type { SiteDocument } from 'lib/studioDocument';
import { apiFetch, ApiError } from 'lib/apiFetch';
import {
  buildPreviewDocument,
  packagedTemplateUrl,
  templateSpecUrl,
} from 'lib/studioPreview';
import PreviewFrame from './PreviewFrame';
import SiteChat from './SiteChat';
import SiteEditor from './SiteEditor';
import styles from './StudioPreview.module.css';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; site: SiteDocument; spec: TemplateSpec; html: string; problems: Problem[] };

export default function StudioSite() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('id');

  const [state, setState] = useState<State>({ status: 'loading' });
  // Bumped after any write that produced a revision, so the canvas reloads
  // from what the server now holds rather than from what the editor thinks.
  const [generation, setGeneration] = useState(0);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  const load = useCallback(async (): Promise<State> => {
    if (!siteId) {
      return { status: 'error', message: 'That site link is incomplete.' };
    }

    const site = await apiFetch<SiteDocument>(`/api/studio/sites/${siteId}`);

    const [specResponse, htmlResponse] = await Promise.all([
      fetch(templateSpecUrl(site.slug)),
      fetch(`${packagedTemplateUrl(site.slug)}index.html`),
    ]);

    if (!specResponse.ok || !htmlResponse.ok) {
      return { status: 'error', message: `The ${site.templateName} template is no longer available.` };
    }

    const spec = (await specResponse.json()) as TemplateSpec;
    const { html, problems } = buildPreviewDocument({
      html: await htmlResponse.text(),
      spec,
      edits: site.latest.edits,
      slug: site.slug,
    });

    return { status: 'ready', site, spec, html, problems };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `generation` is the reload signal
  }, [siteId, generation]);

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
              ? 'That site does not exist or was removed.'
              : 'Could not load this site.',
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
        <Link href="/account" className={styles.back}>
          Your sites
        </Link>
        .
      </p>
    );
  }

  if (state.status === 'loading') {
    return (
      <div className={styles.frame}>
        <div className={styles.skeleton} aria-hidden="true" />
        <p className={styles.loading}>Loading your site...</p>
      </div>
    );
  }

  const { site, spec, html, problems } = state;

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.meta}>
          <h1 className={styles.stance}>{site.title}</h1>
          <p className={styles.built}>
            {site.stance} · built on {site.templateName} · revision {site.latest.n}
            {site.latest.source === 'fallback' ? ' · brand copy only' : ''}
          </p>
        </div>

        <div className={styles.actions}>
          <Link
            href={`/studio/results/?g=${site.generationId}`}
            prefetch={false}
            className={styles.action}
          >
            All three
          </Link>
          <a
            href={`/downloads/${site.slug}-html.zip`}
            className={`${styles.action} ${styles.download}`}
            download
          >
            Download
          </a>
        </div>
      </div>

      {/* Two notices this page owns, distinct from the engine's. A fallback
          revision is the three-string rebrand, said out loud rather than passed
          off as the full document. Drift is the pinned template no longer
          matching the packaged one - the document still applies, but a person
          should hear it here, not from a missing headline. */}
      {site.latest.source === 'fallback' ? (
        <p className={styles.notice} role="status">
          The model didn't return a usable page, so only the brand name,
          headline and tagline have been applied.
        </p>
      ) : null}
      {site.templateChanged ? (
        <p className={styles.notice} role="status">
          The {site.templateName} template has been updated since this site was
          made. Anything that no longer fits is listed below.
        </p>
      ) : null}

      <div className={site.mine ? styles.workspace : undefined}>
        {site.mine ? (
          <div className={styles.side}>
            <SiteEditor
              site={site}
              spec={spec}
              frameRef={frameRef}
              onRevision={() => setGeneration((n) => n + 1)}
            />
            <SiteChat
              siteId={site.id}
              head={site.latest.n}
              onRevision={() => setGeneration((n) => n + 1)}
            />
          </div>
        ) : null}
        <PreviewFrame
          html={html}
          problems={problems}
          title={`${site.title} - built on the ${site.templateName} template`}
          frameRef={frameRef}
        />
      </div>
    </>
  );
}
