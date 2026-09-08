'use client';

import { useEffect, useRef, useState, type DragEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError, apiUrl } from 'lib/apiFetch';
import { useSessionUser } from 'lib/authClient';
import styles from './StudioForm.module.css';

// Three ways out of this form, and the page leads with one.
//
// "Generate websites" is the one the title promises - three directions to
// choose between, each a complete site. It costs money and therefore needs an
// account. "Make my website" skips the choosing (the model picks and writes the
// one it would lead with); "Match from the library" is the shipped, free,
// offline path - a pure function of the text, available to everybody. The two
// are kept as quieter actions under the button rather than dropped: they are
// real paths with real users, and the difference between them is honest on its
// face.
const MAX_LENGTH = 600;

/** Short enough to be a slip rather than a description. */
const MIN_LENGTH = 10;

const PLACEHOLDER =
  "Tell us about your business, customers, location, preferred style, and colors. For example: We're a residential real estate team in Austin helping young families. We want a warm, modern look with earthy greens and a friendly, trustworthy feel.";

/** Where a description waits out a trip to the sign-in page. */
const DRAFT_KEY = 'studio.draft';

// Same rules as POST /api/uploads, applied before a byte is sent so a refusal
// is read beside the file rather than after the whole request.
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 8 * 1024 * 1024;

type Photo = {
  key: number;
  file: File;
  note: string;
  /** Why the API would refuse it, decided here; a problem photo is never sent. */
  problem: string | null;
  /** Already in the person's library - a retry after a later failure skips it. */
  uploaded: boolean;
};

function describeProblem(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return 'PNG, JPEG or WebP only';
  if (file.size > MAX_BYTES) return 'Over 8 MB';
  return null;
}

let nextKey = 1;

export default function StudioForm({ templateCount }: { templateCount: number }) {
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [over, setOver] = useState(false);
  const [pending, setPending] = useState<'directions' | 'make' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { user, isPending: sessionPending } = useSessionUser();

  // A description typed before signing in comes back after it. sessionStorage
  // is per tab and gone when it closes, which is the right lifetime for a
  // draft nobody asked to keep.
  useEffect(() => {
    try {
      const draft = window.sessionStorage.getItem(DRAFT_KEY);
      if (draft) {
        setText(draft);
        window.sessionStorage.removeItem(DRAFT_KEY);
      }
    } catch {
      // Storage blocked: the field simply starts empty.
    }
  }, []);

  const trimmed = text.trim().slice(0, MAX_LENGTH);
  const ready = trimmed.length >= MIN_LENGTH;
  const busy = pending !== null;

  const signInFirst = () => {
    try {
      window.sessionStorage.setItem(DRAFT_KEY, text);
    } catch {
      // Nothing to do - they retype it.
    }
    router.push(`/sign-in?next=${encodeURIComponent('/studio')}`);
  };

  // The matcher path needs no server at all: the description travels in the
  // query string and the results page scores it in the browser.
  const match = () => router.push(`/studio/results/?q=${encodeURIComponent(trimmed)}`);

  const addFiles = (list: FileList | File[] | null) => {
    const added = Array.from(list ?? []).map<Photo>((file) => ({
      key: nextKey++,
      file,
      note: '',
      problem: describeProblem(file),
      uploaded: false,
    }));
    if (added.length) setPhotos((current) => [...current, ...added]);
  };

  const drop = (event: DragEvent) => {
    event.preventDefault();
    setOver(false);
    addFiles(event.dataTransfer.files);
  };

  /**
   * The photos go to the person's library (POST /api/uploads) with what they
   * said each one shows, and become references when Studio makes imagery for
   * the site. One request per file; a file that is already there is skipped,
   * so a retry after a failure part-way does not double up.
   */
  async function uploadPhotos() {
    for (const photo of photos) {
      if (photo.problem || photo.uploaded) continue;

      const form = new FormData();
      form.append('file', photo.file);
      if (photo.note.trim()) form.append('note', photo.note.trim());

      const response = await fetch(apiUrl('/api/uploads'), {
        method: 'POST',
        credentials: 'include',
        body: form,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new ApiError(body?.error ?? `Could not upload ${photo.file.name}.`, response.status);
      }

      setPhotos((current) =>
        current.map((entry) => (entry.key === photo.key ? { ...entry, uploaded: true } : entry))
      );
    }
  }

  /**
   * The two paid paths. `directions` is three sites to choose between;
   * `make` is one request, one site - the model picks the direction it
   * would lead with and writes every word of it.
   */
  async function generate(kind: 'directions' | 'make') {
    if (!user) {
      signInFirst();
      return;
    }

    setPending(kind);
    setError(null);

    try {
      await uploadPhotos();

      if (kind === 'make') {
        const { siteId } = await apiFetch<{ siteId: string }>('/api/studio/make', {
          method: 'POST',
          body: JSON.stringify({ description: trimmed }),
        });
        router.push(`/studio/site/?id=${siteId}`);
      } else {
        const { id } = await apiFetch<{ id: string }>('/api/studio/directions', {
          method: 'POST',
          body: JSON.stringify({ description: trimmed }),
        });
        router.push(`/studio/results/?g=${id}`);
      }
    } catch (cause) {
      // The API writes its errors to be read - a quota notice, a rate-limit
      // notice - so they are shown as-is rather than flattened to "failed".
      setError(cause instanceof ApiError ? cause.message : 'Something went wrong. Try again.');
      setPending(null);
    }
  }

  const label =
    pending === 'directions'
      ? 'Generating your directions...'
      : pending === 'make'
        ? 'Making your website...'
        : 'Generate websites';

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        if (ready && !busy) void generate('directions');
      }}
    >
      <h1 className={styles.title}>Describe your business, get three websites</h1>
      <p className={styles.lede}>
        Each one is a complete, ready-to-use site in its own brand direction,
        built with tabbied's generative patterns in place of stock
        photography.
      </p>

      <label className={styles.label} htmlFor="studio-description">
        Your business
      </label>
      <textarea
        id="studio-description"
        className={styles.textarea}
        placeholder={PLACEHOLDER}
        maxLength={MAX_LENGTH}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      {/* Photos are optional and go with the paid paths: the library needs a
          session, so signed out the dropzone is the sign-in door. */}
      <input
        ref={fileInput}
        className={styles.fileInput}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = '';
        }}
      />
      <button
        type="button"
        className={styles.drop}
        data-over={over || undefined}
        disabled={busy}
        onClick={() => {
          if (!user && !sessionPending) {
            signInFirst();
            return;
          }
          fileInput.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={drop}
      >
        <span className={styles.dropIcon} aria-hidden="true">
          &uarr;
        </span>
        <span>
          <span className={styles.dropTitle}>Add photos for your website</span>
          <span className={styles.dropSub}>
            {!user && !sessionPending
              ? 'Optional \u00b7 Sign in to upload your team, work, products, or space'
              : 'Optional \u00b7 Upload your team, work, products, or space'}
          </span>
        </span>
      </button>

      {photos.length > 0 ? (
        <>
          <p className={styles.photosHint}>
            Tell us what each image shows, so we can place it well.
          </p>
          <ul className={styles.photos}>
            {photos.map((photo) => (
              <li key={photo.key} className={styles.photo}>
                <span className={styles.photoName} title={photo.file.name}>
                  {photo.file.name}
                </span>
                {photo.problem ? (
                  <span className={styles.photoProblem}>{photo.problem}</span>
                ) : (
                  <input
                    className={styles.photoNote}
                    type="text"
                    maxLength={200}
                    placeholder="e.g. our team at the Austin office"
                    aria-label={`What ${photo.file.name} shows`}
                    value={photo.note}
                    disabled={photo.uploaded}
                    onChange={(event) =>
                      setPhotos((current) =>
                        current.map((entry) =>
                          entry.key === photo.key ? { ...entry, note: event.target.value } : entry
                        )
                      )
                    }
                  />
                )}
                <button
                  type="button"
                  className={styles.photoRemove}
                  aria-label={`Remove ${photo.file.name}`}
                  disabled={busy}
                  onClick={() =>
                    setPhotos((current) => current.filter((entry) => entry.key !== photo.key))
                  }
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {/* Disabled until the session resolves, not merely while generating:
          `useSession` reports no user while it is still checking, and acting
          on that sends a signed-in person to the sign-in page for clicking
          too soon after load. */}
      <button
        type="submit"
        className={styles.submit}
        disabled={!ready || busy || sessionPending}
      >
        {busy ? <span className={styles.spinner} aria-hidden="true" /> : null}
        <span>{label}</span>
      </button>

      <p className={styles.alternatives}>
        Or skip the choosing:{' '}
        <button
          type="button"
          className={styles.textAction}
          disabled={!ready || busy || sessionPending}
          onClick={() => void generate('make')}
        >
          Make my website
        </button>
        , or{' '}
        <button
          type="button"
          className={styles.textAction}
          disabled={!ready || busy}
          onClick={match}
        >
          Match from the library
        </button>
        .
      </p>

      <p className={styles.note}>
        {/* Says plainly what each path does and what it costs you. */}
        All three draw on the {templateCount} template sites in the library.{' '}
        <strong>Generate websites</strong> shows you three directions to choose
        from. <strong>Make my website</strong> has a model pick the best fit and
        write every word of it. <strong>Match from the library</strong> is
        instant and needs no account; the other two need one
        {sessionPending || user ? null : (
          <>
            , so <Link href="/sign-up">create one</Link> first
          </>
        )}
        . Photos are optional and stay in your account.
      </p>
    </form>
  );
}
