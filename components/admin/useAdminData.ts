'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch, ApiError } from 'lib/apiFetch';

/** One fetch, three states, a reload - what every admin panel needs and nothing else. */
export function useAdminData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    setError(null);
    apiFetch<T>(path)
      .then((body) => {
        if (live) setData(body);
      })
      .catch((cause) => {
        if (live) setError(cause instanceof ApiError ? cause.message : 'Could not load.');
      });
    return () => {
      live = false;
    };
  }, [path, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);

  return { data, error, reload };
}

export const when = (value: string | Date) =>
  new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export const money = (value: number) => `$${value.toFixed(value < 1 ? 3 : 2)}`;
