'use client';

// A results card's Preview, without leaving the page.
//
// It shows the same artefact the full preview route shows - the packaged
// download with the card's direction applied by the edits engine - for the
// same reason: the live /template/<slug>/ page mounts its patterns through
// React and ignores an attribute written from outside, while the package has
// no framework left in it. The card's link still points at the full page, so
// a middle-click, a copied URL and a browser with scripting off all land
// somewhere real; this is what a plain click gets.
import { useEffect, useState } from 'react';
import { Dialog } from '@base-ui-components/react/dialog';
import { directionToEdits, type Problem, type TemplateSpec } from 'tabbied-templates';
import type { DirectionCopy } from 'lib/studioDocument';
import { buildPreviewDocument, packagedTemplateUrl, templateSpecUrl } from 'lib/studioPreview';
import styles from './PreviewDialog.module.css';

/** What the dialog needs from the card it opened from. */
export type PreviewTarget = {
  slug: string;
  /** The template's name. */
  name: string;
  /** The direction's stance, when it has one; the name otherwise. */
  stance?: string;
  palette: string[];
  copy?: DirectionCopy | null;
  /** The full-page version of this same preview. */
  href: string;
  downloadHref: string;
};

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; html: string; problems: Problem[] };

async function build(target: PreviewTarget): Promise<State> {
  // Plain static assets, fetched directly - no API, no session.
  const [specResponse, htmlResponse] = await Promise.all([
    fetch(templateSpecUrl(target.slug)),
    fetch(`${packagedTemplateUrl(target.slug)}index.html`),
  ]);

  if (!specResponse.ok || !htmlResponse.ok) {
    return { status: 'error' };
  }

  const spec = (await specResponse.json()) as TemplateSpec;
  const { html, problems } = buildPreviewDocument({
    html: await htmlResponse.text(),
    spec,
    edits: directionToEdits(spec, { copy: target.copy ?? null, palette: target.palette }),
    slug: target.slug,
  });

  return { status: 'ready', html, problems };
}

export default function PreviewDialog({
  target,
  onClose,
}: {
  target: PreviewTarget | null;
  onClose: () => void;
}) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!target) return;

    let live = true;
    setState({ status: 'loading' });

    build(target)
      .then((next) => {
        if (live) setState(next);
      })
      .catch(() => {
        if (live) setState({ status: 'error' });
      });

    return () => {
      live = false;
    };
  }, [target]);

  const engine =
    state.status === 'ready'
      ? state.problems.filter((problem) => problem.level === 'error')
      : [];

  return (
    <Dialog.Root
      open={target !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          {target ? (
            <>
              <div className={styles.bar}>
                <div className={styles.meta}>
                  <Dialog.Title className={styles.title}>
                    {target.stance ?? target.name}
                  </Dialog.Title>
                  <p className={styles.built}>
                    {target.copy?.brandName
                      ? `${target.copy.brandName} · built on ${target.name}`
                      : `Built on ${target.name}`}
                  </p>
                </div>
                <div className={styles.actions}>
                  <a href={target.href} className={`${styles.action} ${styles.open}`}>
                    Open full page
                  </a>
                  <a
                    href={target.downloadHref}
                    className={`${styles.action} ${styles.download}`}
                    download
                  >
                    Download
                  </a>
                  <Dialog.Close className={styles.close} aria-label="Close preview">
                    &times;
                  </Dialog.Close>
                </div>
              </div>

              {engine.length > 0 ? (
                <p className={styles.notice} role="status">
                  {engine.length === 1
                    ? 'One part of this direction could not be placed on the template: '
                    : `${engine.length} parts of this direction could not be placed on the template: `}
                  {engine.map((problem) => problem.path).join(', ')}.
                </p>
              ) : null}

              <div className={styles.body}>
                {state.status === 'ready' ? (
                  <iframe
                    className={styles.iframe}
                    title={`${target.stance ?? target.name} - a preview built on the ${target.name} template`}
                    srcDoc={state.html}
                    // Same reasoning as PreviewFrame: `allow-same-origin` is
                    // what lets the document import the same-origin pattern
                    // runtime; the package's own `href="#"` links and its
                    // form still cannot navigate this page, submit, or open
                    // a popup.
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : state.status === 'error' ? (
                  <p className={styles.status} role="alert">
                    This preview could not be built here.{' '}
                    <a href={target.href}>Open the full page</a> instead.
                  </p>
                ) : (
                  <>
                    <div className={styles.skeleton} aria-hidden="true" />
                    <p className={styles.status}>Building the preview...</p>
                  </>
                )}
              </div>
            </>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
