'use client';

// The customizer: a site's latest revision on its template, and the two things
// a person changes about it in this release - its colours and its patterns.
//
// Everything a person does here is planned and applied by the edits engine
// against the iframe's document, live, the same engine the canvas was drawn
// with. A colour change plans the properties and the pattern-host rewrites,
// then asks the runtime inside the iframe to draw its patterns again, since a
// rewritten attribute is not a re-render. A shuffle swaps every field's design
// the same way. Saving posts the whole document as the next revision, and the
// download rebuilds the packaged zip with that document in it.
//
// What is deliberately not here: editing words and pictures. The Worker still
// holds the routes for both (revise, images), and the document still carries
// whatever text Studio wrote for a generated site; the rail's Content tab says
// they are not edited here yet, which is the first release's scope.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  applyPlan,
  isPatternSlot,
  planEdits,
  type EditsDocument,
  type PatternEdit,
  type PatternSlot,
  type Problem,
  type TemplateSpec,
} from 'tabbied-templates';
import type { DesignChoice } from 'lib/designCatalog';
import type { SiteDocument } from 'lib/studioDocument';
import { apiFetch, ApiError } from 'lib/apiFetch';
import { archiveNameFor, buildCustomisedArchive, saveArchive } from 'lib/studioDownload';
import { designOn, patternsChanged, shuffleDesigns } from 'lib/studioPatterns';
import {
  buildPreviewDocument,
  packagedTemplateUrl,
  templateSpecUrl,
} from 'lib/studioPreview';
import Toaster, { toaster } from 'components/Toaster';
import CustomizerBar, { type SaveState } from './CustomizerBar';
import { PreviewNotices } from './PreviewFrame';
import SiteRail from './SiteRail';
import styles from './SiteWorkspace.module.css';

type Loaded = {
  site: SiteDocument;
  spec: TemplateSpec;
  /** The packaged page as fetched, so the canvas can be rebuilt without a round trip. */
  packaged: string;
  html: string;
  problems: Problem[];
};

type State = { status: 'loading' } | { status: 'error'; message: string } | ({ status: 'ready' } & Loaded);

type Frame = HTMLIFrameElement & {
  contentWindow: (Window & { __tabbied?: { rehydrate: () => void } }) | null;
};

/** How long the canvas dims while a shuffle draws, so the change reads as one. */
const SHUFFLE_BEAT_MS = 700;

const sameColours = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((colour, index) => colour.toLowerCase() === b[index].toLowerCase());

export default function StudioSite({ designs }: { designs: readonly DesignChoice[] }) {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('id');

  const [state, setState] = useState<State>({ status: 'loading' });
  const [draft, setDraft] = useState<EditsDocument | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('clean');
  const [downloading, setDownloading] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    let live = true;

    setState({ status: 'loading' });

    (async (): Promise<State> => {
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
      const packaged = await htmlResponse.text();
      const { html, problems } = buildPreviewDocument({
        html: packaged,
        spec,
        edits: site.latest.edits,
        slug: site.slug,
      });

      return { status: 'ready', site, spec, packaged, html, problems };
    })()
      .then((next) => {
        if (!live) return;

        setState(next);

        if (next.status === 'ready') {
          setDraft(next.site.latest.edits);
          setSaveState('clean');
        }
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
  }, [siteId]);

  const ready = state.status === 'ready' ? state : null;
  const spec = ready?.spec ?? null;

  const patternSlots = useMemo<PatternSlot[]>(() => spec?.slots.filter(isPatternSlot) ?? [], [spec]);

  /** Plan and run a partial document against the live page. */
  const applyLive = useCallback(
    (edits: EditsDocument['edits'], rehydrate: boolean) => {
      if (!spec) return;

      const frame = frameRef.current as Frame | null;
      const doc = frame?.contentDocument;

      if (!doc) return;

      applyPlan(doc, planEdits(spec, { specVersion: spec.specVersion, slug: spec.site.slug, edits }));

      if (rehydrate) frame?.contentWindow?.__tabbied?.rehydrate();
    },
    [spec]
  );

  const touch = (next: EditsDocument) => {
    setDraft(next);
    setSaveState('dirty');
  };

  if (state.status === 'error') {
    return (
      <p className={styles.notice} role="alert">
        {state.message}{' '}
        <Link href="/account/sites/" className={styles.back} prefetch={false}>
          Custom sites
        </Link>
        .
      </p>
    );
  }

  if (!ready || !draft || !spec) {
    return (
      <div className={styles.stage}>
        <div className={styles.frame}>
          <div className={styles.skeleton} aria-hidden="true" />
          <p className={styles.loading}>Loading your site...</p>
        </div>
      </div>
    );
  }

  const { site, packaged } = ready;
  const palette = draft.edits.palette ?? spec.palette.colors;
  const coloursChanged = !sameColours(palette, spec.palette.colors);
  const fieldsChanged = patternsChanged(patternSlots, draft.edits.patterns);

  const setColour = (index: number, value: string) => {
    const next = [...palette];
    next[index] = value;
    touch({ ...draft, edits: { ...draft.edits, palette: next } });
    applyLive({ palette: next }, true);
  };

  const resetColours = () => {
    const { palette: _dropped, ...rest } = draft.edits;
    touch({ ...draft, edits: rest });
    // The authored colours, written back as inline properties: the same
    // values the class rule holds, so the page reads as it did.
    applyLive({ palette: spec.palette.colors }, true);
    toaster.add({ title: 'Colours back to the template defaults' });
  };

  const shuffle = () => {
    if (shuffling) return;

    const patterns = shuffleDesigns(patternSlots, draft.edits.patterns, designs);

    setShuffling(true);
    touch({ ...draft, edits: { ...draft.edits, patterns } });
    applyLive({ patterns }, true);

    window.setTimeout(() => setShuffling(false), SHUFFLE_BEAT_MS);
  };

  const resetPatterns = () => {
    const { patterns: _dropped, ...rest } = draft.edits;
    const next = { ...draft, edits: rest };

    touch(next);
    // A swap removed the field's authored options and seed, which a partial
    // plan cannot put back; the canvas is rebuilt from the package instead.
    const rebuilt = buildPreviewDocument({ html: packaged, spec, edits: next, slug: site.slug });
    setState({ ...ready, html: rebuilt.html, problems: rebuilt.problems });
    toaster.add({ title: `Back to ${site.templateName}'s own patterns` });
  };

  const save = async () => {
    setSaveState('saving');

    try {
      const { revision } = await apiFetch<{ revision: number }>(
        `/api/studio/sites/${site.id}/revisions`,
        { method: 'POST', body: JSON.stringify({ edits: draft }) }
      );

      setState({
        ...ready,
        site: {
          ...site,
          revisions: revision,
          palette,
          latest: {
            ...site.latest,
            n: revision,
            edits: draft,
            source: 'manual',
            instruction: null,
          },
        },
      });
      setSaveState('saved');
      toaster.add({ title: 'Saved. Find it under Custom sites.' });
    } catch (cause) {
      setSaveState('dirty');
      toaster.add({ title: cause instanceof ApiError ? cause.message : 'Could not save.' });
    }
  };

  const rename = async (title: string) => {
    try {
      await apiFetch<{ title: string }>(`/api/studio/sites/${site.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      });
      setState({ ...ready, site: { ...site, title } });
      toaster.add({ title: 'Site name saved' });
    } catch (cause) {
      toaster.add({ title: cause instanceof ApiError ? cause.message : 'Could not rename the site.' });
    }
  };

  const downloadHtml = async () => {
    setDownloading(true);

    try {
      const { bytes, problems } = await buildCustomisedArchive({ slug: site.slug, spec, edits: draft });
      const shell = problems.some((problem) => problem.level === 'error' && problem.path === 'runtime');

      saveArchive(bytes, `${archiveNameFor(site.title)}-html.zip`);
      toaster.add({
        title: shell
          ? 'Downloaded, but the package has changed shape and its patterns may not draw.'
          : `Downloaded ${site.title} as static HTML and CSS`,
      });
    } catch (cause) {
      toaster.add({ title: cause instanceof Error ? cause.message : 'Could not build the download.' });
    } finally {
      setDownloading(false);
    }
  };

  const patternEdit = (slot: PatternSlot): PatternEdit | undefined => draft.edits.patterns?.[slot.id];

  return (
    <>
      <CustomizerBar
        mine={site.mine}
        saveState={saveState}
        onSave={() => void save()}
        downloading={downloading}
        onDownloadHtml={() => void downloadHtml()}
        reactHref={`/downloads/${site.slug}-react.zip`}
      />

      {/* Two notices this page owns, distinct from the engine's. A fallback
          revision is the three-string rebrand, said out loud rather than passed
          off as the full document. Drift is the pinned template no longer
          matching the packaged one - the document still applies, but a person
          should hear it here, not from a missing headline. */}
      {site.latest.source === 'fallback' ? (
        <p className={styles.notice} role="status">
          The model didn&apos;t return a usable page, so only the brand name,
          headline and tagline have been applied.
        </p>
      ) : null}
      {site.templateChanged ? (
        <p className={styles.notice} role="status">
          The {site.templateName} template has been updated since this site was
          made. Anything that no longer fits is listed below.
        </p>
      ) : null}
      <PreviewNotices problems={ready.problems} />

      <div className={site.mine && !expanded ? styles.shell : styles.shellWide}>
        {site.mine && !expanded ? (
          <div className={styles.rail}>
            <SiteRail
              title={site.title}
              onRename={(title) => void rename(title)}
              spec={spec}
              designs={designs}
              palette={palette}
              coloursChanged={coloursChanged}
              onColour={setColour}
              onResetColours={resetColours}
              patternSlots={patternSlots}
              designOn={(slot) => designOn(slot, patternEdit(slot))}
              patternsChanged={fieldsChanged}
              shuffling={shuffling}
              onShuffle={shuffle}
              onResetPatterns={resetPatterns}
            />
          </div>
        ) : null}

        <div className={styles.stage}>
          <div className={styles.frame}>
            <div className={styles.chrome}>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.pill}>
                {site.title} on {site.templateName}
                {site.latest.n > 1 ? ` (revision ${site.latest.n})` : ''}
              </span>
              {site.mine ? (
                <button
                  type="button"
                  className={styles.expand}
                  title={expanded ? 'Collapse view' : 'Expand view'}
                  aria-label={expanded ? 'Collapse view' : 'Expand view'}
                  aria-pressed={expanded}
                  onClick={() => setExpanded((value) => !value)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {expanded ? (
                      <>
                        <path d="M20 10h-6V4" />
                        <path d="M13.5 10.5 21 3" />
                        <path d="M4 14h6v6" />
                        <path d="M10.5 13.5 3 21" />
                      </>
                    ) : (
                      <>
                        <path d="M14 4h6v6" />
                        <path d="M20 4l-7.5 7.5" />
                        <path d="M10 20H4v-6" />
                        <path d="M4 20l7.5-7.5" />
                      </>
                    )}
                  </svg>
                </button>
              ) : null}
            </div>

            <div className={styles.canvas}>
              <iframe
                ref={frameRef}
                className={styles.iframe}
                title={`${site.title} - built on the ${site.templateName} template`}
                srcDoc={ready.html}
                // `allow-same-origin` is required, not lazy: without it the
                // document gets an opaque origin and the same-origin runtime
                // import is blocked as cross-origin, so the page renders with
                // every pattern missing. What stays denied is what this page
                // actually has: the packaged template's `<form action="#">`
                // and its `<a href="#">` links cannot navigate the top frame,
                // submit, or open a popup. See PreviewFrame for the whole
                // reasoning, which holds until user-supplied markup or images
                // enter this document.
                sandbox="allow-scripts allow-same-origin"
              />
              {shuffling ? (
                <div className={styles.veil} role="status">
                  Drawing new patterns...
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
}
