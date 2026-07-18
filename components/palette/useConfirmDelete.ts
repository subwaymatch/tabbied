'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A click-twice-to-confirm delete affordance shared by the gallery rail rows
 * and the editor's palette chips. The first request arms a per-id confirmation
 * (the caller styles the control as "click again to delete"); a second request
 * for the same id within the window commits. Any other id, or the timeout,
 * resets the confirmation.
 */
export function useConfirmDelete(
  onDelete: (id: string) => void,
  timeoutMs = 2500
) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const request = (id: string) => {
    if (pendingId !== id) {
      if (timer.current) clearTimeout(timer.current);
      setPendingId(id);
      timer.current = setTimeout(() => setPendingId(null), timeoutMs);
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    setPendingId(null);
    onDelete(id);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setPendingId(null);
  };

  return { pendingId, request, reset };
}
