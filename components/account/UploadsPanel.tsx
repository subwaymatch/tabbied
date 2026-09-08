'use client';

import { useEffect, useRef, useState } from 'react';
import { apiFetch, ApiError, apiUrl } from 'lib/apiFetch';
import styles from './account.module.css';

type Upload = { id: string; src: string; note: string | null; bytes: number; createdAt: string };

/** The person's reference pictures: add, look, remove. */
export default function UploadsPanel() {
  const [uploads, setUploads] = useState<Upload[] | null>(null);
  const [busy, setBusy] = useState<string | 'adding' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    apiFetch<{ uploads: Upload[] }>('/api/uploads')
      .then(({ uploads }) => setUploads(uploads))
      .catch(() => setUploads([]));
  }, []);

  const add = async (file: File) => {
    setBusy('adding');
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const response = await fetch(apiUrl('/api/uploads'), { method: 'POST', credentials: 'include', body: form });
      const body = (await response.json()) as Upload & { error?: string };
      if (!response.ok) throw new ApiError(body.error ?? 'Upload failed.', response.status);
      setUploads((previous) => [body, ...(previous ?? [])]);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not add that picture.');
    } finally {
      setBusy(null);
      if (input.current) input.current.value = '';
    }
  };

  const remove = async (id: string) => {
    setBusy(id);
    setError(null);
    try {
      await apiFetch(`/api/uploads/${id}`, { method: 'DELETE' });
      setUploads((previous) => (previous ?? []).filter((upload) => upload.id !== id));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not remove it.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <label className={styles.addButton}>
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={busy !== null}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void add(file);
          }}
        />
        {busy === 'adding' ? 'Adding...' : 'Add a picture'}
      </label>
      <p className={styles.quiet}>PNG, JPEG or WebP, up to 8 MB. Up to 60 pictures.</p>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {uploads === null ? (
        <p className={styles.quiet}>Loading...</p>
      ) : uploads.length === 0 ? (
        <p className={styles.quiet}>No pictures yet. They become references for the pictures Studio makes.</p>
      ) : (
        <ul className={styles.grid}>
          {uploads.map((upload) => (
            <li key={upload.id} className={styles.cell}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={apiUrl(upload.src)} alt={upload.note ?? ''} />
              <div className={styles.cellFoot}>
                <span className={styles.quiet}>{(upload.bytes / 1024).toFixed(0)} KB</span>
                <button
                  type="button"
                  className={styles.small}
                  disabled={busy !== null}
                  onClick={() => void remove(upload.id)}
                >
                  {busy === upload.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
