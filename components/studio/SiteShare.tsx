'use client';

// A site, read-only, at one revision - the thing a person sends to someone.
//
// No editor, no chrome beyond a title and the download: the id is the
// capability, as with any generation link, and the revision number pins what
// the recipient sees so a later edit does not change what was shared.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Problem, TemplateSpec } from 'tabbied-templates';
import type { SiteDocument, StoredRevision } from 'lib/studioDocument';
import { apiFetch } from 'lib/apiFetch';
import { buildPreviewDocument, packagedTemplateUrl, templateSpecUrl } from 'lib/studioPreview';
import PreviewFrame from './PreviewFrame';
import styles from './StudioPreview.module.css';

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; site: SiteDocument; revision: number; html: string; problems: Problem[] };

export default function SiteShare() {
  const params = useSearchParams();
  const id = params.get('id');
  const n = Number(params.get('n') ?? '');

  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let live = true;

    (async () => {
      if (!id) throw new Error('no id');

      const site = await apiFetch<SiteDocument>(`/api/studio/sites/${id}`);
      const revision =
        Number.isInteger(n) && n >= 1 && n !== site.latest.n
          ? await apiFetch<StoredRevision>(`/api/studio/sites/${id}/revisions/${n}`)
          : site.latest;

      const [specResponse, htmlResponse] = await Promise.all([
        fetch(templateSpecUrl(site.slug)),
        fetch(`${packagedTemplateUrl(site.slug)}index.html`),
      ]);
      if (!specResponse.ok || !htmlResponse.ok) throw new Error('template');

      const spec = (await specResponse.json()) as TemplateSpec;
      const built = buildPreviewDocument({
        html: await htmlResponse.text(),
        spec,
        edits: revision.edits,
        slug: site.slug,
      });

      if (live) setState({ status: 'ready', site, revision: revision.n, ...built });
    })().catch(() => {
      if (live) setState({ status: 'error' });
    });

    return () => {
      live = false;
    };
  }, [id, n]);

  if (state.status === 'error') {
    return (
      <p className={styles.notice} role="alert">
        That link does not lead anywhere.{' '}
        <Link href="/studio" className={styles.back}>
          Make your own
        </Link>
        .
      </p>
    );
  }

  if (state.status === 'loading') {
    return (
      <div className={styles.frame}>
        <div className={styles.skeleton} aria-hidden="true" />
      </div>
    );
  }

  const { site, revision, html, problems } = state;

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.meta}>
          <h1 className={styles.stance}>{site.title}</h1>
          <p className={styles.built}>
            {site.stance} · built on {site.templateName} · revision {revision}
          </p>
        </div>
        <div className={styles.actions}>
          <a href={`/downloads/${site.slug}-html.zip`} className={`${styles.action} ${styles.download}`} download>
            Download the template
          </a>
        </div>
      </div>

      <PreviewFrame html={html} problems={problems} title={`${site.title} - shared`} />
    </>
  );
}
