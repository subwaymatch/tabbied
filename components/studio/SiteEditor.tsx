'use client';

// The editor: every slot the template declares, as a form, applied into the
// live page as it is typed and saved as the next revision.
//
// Live edits go through the same engine the page was built with. A text
// change plans one operation and runs it against the iframe's document; a
// palette change plans the properties and the pattern-host rewrites, then asks
// the runtime inside the iframe to draw its patterns again, since a rewritten
// attribute is not a re-render. Nothing here writes markup - `writeText`
// builds text nodes - so a person typing into these fields cannot put HTML
// into the page any more than the model could.
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import {
  applyPlan,
  isImageSlot,
  isTextSlot,
  planEdits,
  type EditsDocument,
  type ImageSlot,
  type TemplateSpec,
  type TextSlot,
} from 'tabbied-templates';
import type { SiteDocument } from 'lib/studioDocument';
import { apiFetch, ApiError, apiUrl } from 'lib/apiFetch';
import styles from './SiteEditor.module.css';

type Upload = { id: string; src: string; note: string | null };

type Frame = HTMLIFrameElement & {
  contentWindow: (Window & { __tabbied?: { rehydrate: () => void } }) | null;
};

/** `hero.title` -> `hero`; the section headings the form is grouped under. */
const sectionOf = (id: string) => id.split('.')[0] ?? id;

const prettify = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

export default function SiteEditor({
  site,
  spec,
  frameRef,
  onRevision,
}: {
  site: SiteDocument;
  spec: TemplateSpec;
  frameRef: RefObject<HTMLIFrameElement | null>;
  /** Called after any write that produced a new revision. */
  onRevision: () => void;
}) {
  const [draft, setDraft] = useState<EditsDocument>(site.latest.edits);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<'words' | 'colours' | 'pictures'>('words');
  // The person's reference pictures, loaded when the Pictures tab opens, and
  // which of them the next picture should draw from.
  const [library, setLibrary] = useState<Upload[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open !== 'pictures' || library !== null) return;

    apiFetch<{ uploads: Upload[] }>('/api/uploads')
      .then(({ uploads }) => setLibrary(uploads))
      .catch(() => setLibrary([]));
  }, [open, library]);

  const addReference = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('file', file);

      // Raw fetch: apiFetch fixes a JSON content-type, and multipart needs the
      // boundary fetch writes for itself.
      const response = await fetch(apiUrl('/api/uploads'), {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      const body = (await response.json()) as Upload & { error?: string };

      if (!response.ok) throw new ApiError(body.error ?? 'Upload failed.', response.status);

      setLibrary((previous) => [body, ...(previous ?? [])]);
      setSelected((previous) => new Set(previous).add(body.id));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not add that picture.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  // A new revision from the server resets the draft to what it holds.
  useEffect(() => {
    setDraft(site.latest.edits);
    setDirty(false);
  }, [site.latest.edits]);

  const textSlots = useMemo(() => spec.slots.filter(isTextSlot), [spec]);
  const imageSlots = useMemo(() => spec.slots.filter(isImageSlot), [spec]);
  const sections = useMemo(() => {
    const grouped = new Map<string, TextSlot[]>();
    for (const slot of textSlots) {
      const key = sectionOf(slot.id);
      grouped.set(key, [...(grouped.get(key) ?? []), slot]);
    }
    return [...grouped.entries()];
  }, [textSlots]);

  const palette = draft.edits.palette ?? spec.palette.colors;

  const frameDocument = useCallback(() => {
    const frame = frameRef.current as Frame | null;
    return frame?.contentDocument ?? null;
  }, [frameRef]);

  /** Plan and run a partial document against the live page. */
  const applyLive = useCallback(
    (edits: EditsDocument['edits'], rehydrate = false) => {
      const doc = frameDocument();
      if (!doc) return;

      applyPlan(doc, planEdits(spec, { specVersion: spec.specVersion, slug: spec.site.slug, edits }));

      if (rehydrate) {
        (frameRef.current as Frame | null)?.contentWindow?.__tabbied?.rehydrate();
      }
    },
    [frameDocument, frameRef, spec]
  );

  const setText = (slot: TextSlot, value: string) => {
    setDraft((previous) => ({
      ...previous,
      edits: { ...previous.edits, text: { ...previous.edits.text, [slot.id]: value } },
    }));
    setDirty(true);
    applyLive({ text: { [slot.id]: value } });
  };

  const setColour = (index: number, value: string) => {
    const next = [...palette];
    next[index] = value;
    setDraft((previous) => ({ ...previous, edits: { ...previous.edits, palette: next } }));
    setDirty(true);
    applyLive({ palette: next }, true);
  };

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      await apiFetch<{ revision: number }>(`/api/studio/sites/${site.id}/revisions`, {
        method: 'POST',
        body: JSON.stringify({ edits: draft }),
      });
      setDirty(false);
      onRevision();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }, [draft, onRevision, site.id]);

  const generate = async (slot: ImageSlot) => {
    setGenerating(slot.id);
    setError(null);

    try {
      // A picture is written as a revision on the server, so unsaved words go
      // first or they would be lost under it.
      if (dirty) {
        await apiFetch(`/api/studio/sites/${site.id}/revisions`, {
          method: 'POST',
          body: JSON.stringify({ edits: draft }),
        });
      }

      await apiFetch<{ key: string }>(`/api/studio/sites/${site.id}/images`, {
        method: 'POST',
        body: JSON.stringify({ slot: slot.id, referenceIds: [...selected].slice(0, 4) }),
      });
      setDirty(false);
      onRevision();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not make a picture.');
    } finally {
      setGenerating(null);
    }
  };

  const valueOf = (slot: TextSlot) => draft.edits.text?.[slot.id] ?? slot.value;
  const imageOf = (slot: ImageSlot) => draft.edits.images?.[slot.id]?.src;

  const tabs = [
    ['words', 'Words'],
    ['colours', 'Colours'],
    ['pictures', 'Pictures'],
  ] as const;

  return (
    <aside className={styles.editor} aria-label="Edit this site">
      <div className={styles.tabs} role="tablist">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={open === key}
            className={`${styles.tab} ${open === key ? styles.tabOn : ''}`}
            onClick={() => setOpen(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        {open === 'words'
          ? sections.map(([section, slots]) => (
              <section key={section} className={styles.section}>
                <h3 className={styles.sectionTitle}>{prettify(section)}</h3>
                {slots.map((slot) => {
                  const value = valueOf(slot);
                  const over = slot.maxChars != null && value.length > slot.maxChars;
                  const Field = slot.multiline ? 'textarea' : 'input';

                  return (
                    <label key={slot.id} className={styles.field}>
                      <span className={styles.label}>
                        {slot.label ?? prettify(slot.id.slice(section.length + 1) || slot.id)}
                        {slot.maxChars != null ? (
                          <span className={`${styles.count} ${over ? styles.countOver : ''}`}>
                            {value.length}/{slot.maxChars}
                          </span>
                        ) : null}
                      </span>
                      <Field
                        className={styles.input}
                        value={value}
                        rows={slot.multiline ? 3 : undefined}
                        onChange={(event) => setText(slot, event.target.value)}
                      />
                    </label>
                  );
                })}
              </section>
            ))
          : null}

        {open === 'colours' ? (
          <section className={styles.section}>
            <p className={styles.hint}>
              Background first, then inks. The page keeps its text readable by
              deriving the rest from these.
            </p>
            <div className={styles.swatches}>
              {palette.map((colour, index) => (
                <label key={index} className={styles.swatch}>
                  <input
                    type="color"
                    value={colour}
                    onChange={(event) => setColour(index, event.target.value)}
                    aria-label={index === 0 ? 'Background colour' : `Ink ${index}`}
                  />
                  <span>{index === 0 ? 'Ground' : `Ink ${index}`}</span>
                  <code>{colour}</code>
                </label>
              ))}
            </div>
          </section>
        ) : null}

        {open === 'pictures' ? (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Draw from</h3>
            <p className={styles.hint}>
              Your own pictures - a product, the shopfront, a look. Tick up to
              four and the next picture is made from them.
            </p>
            <div className={styles.library}>
              {(library ?? []).map((item) => (
                <label key={item.id} className={`${styles.ref} ${selected.has(item.id) ? styles.refOn : ''}`}>
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={(event) =>
                      setSelected((previous) => {
                        const next = new Set(previous);
                        if (event.target.checked) next.add(item.id);
                        else next.delete(item.id);
                        return next;
                      })
                    }
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={apiUrl(item.src)} alt={item.note ?? ''} />
                </label>
              ))}
              <label className={styles.add}>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={uploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void addReference(file);
                  }}
                />
                <span>{uploading ? 'Adding...' : '+ Add'}</span>
              </label>
            </div>

            <h3 className={styles.sectionTitle}>On the page</h3>
            {imageSlots.length === 0 ? (
              <p className={styles.hint}>This template has no picture slots.</p>
            ) : (
              imageSlots.map((slot) => {
                const src = imageOf(slot);
                return (
                  <div key={slot.id} className={styles.picture}>
                    <div className={styles.thumb}>
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src.startsWith('/api/') ? apiUrl(src) : src} alt="" />
                      ) : (
                        <span className={styles.thumbEmpty}>Template's own</span>
                      )}
                    </div>
                    <div className={styles.pictureMeta}>
                      <span className={styles.label}>{slot.label ?? prettify(sectionOf(slot.id))}</span>
                      <span className={styles.alt}>{slot.alt}</span>
                      <button
                        type="button"
                        className={styles.small}
                        disabled={generating !== null}
                        onClick={() => void generate(slot)}
                      >
                        {generating === slot.id ? 'Making...' : src ? 'Make another' : 'Make a picture'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        ) : null}
      </div>

      <div className={styles.foot}>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          className={styles.save}
          disabled={!dirty || saving}
          onClick={() => void save()}
        >
          {saving ? 'Saving...' : dirty ? 'Save as a new revision' : 'Saved'}
        </button>
      </div>
    </aside>
  );
}
