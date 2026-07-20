'use client';

import { useEffect, useRef, useState, type UIEvent } from 'react';

/**
 * Incremental reveal for a long palette list: render `pageSize` rows, grow by a
 * page whenever the list scrolls near its end, and keep filling until the
 * container overflows (so a tall viewport always has more to scroll toward).
 * Shared by the gallery rail and the embedded palette browser, which both list
 * hundreds of palettes and don't want to mount them all at once.
 */
export function usePaletteReveal<T>(items: T[], pageSize: number) {
  const [count, setCount] = useState(pageSize);
  const listRef = useRef<HTMLDivElement>(null);

  const shown = items.slice(0, count);
  const hasMore = shown.length < items.length;

  // Fill until the list overflows its box, so there's always something to
  // scroll toward the rest on a tall viewport.
  useEffect(() => {
    const el = listRef.current;
    if (el && hasMore && el.scrollHeight <= el.clientHeight) {
      setCount((c) => c + pageSize);
    }
  }, [count, hasMore, items.length, pageSize]);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    if (
      el.scrollTop + el.clientHeight > el.scrollHeight - 160 &&
      count < items.length
    ) {
      setCount((c) => c + pageSize);
    }
  };

  // Jump back to the first page — callers reset when the query changes so the
  // filtered list starts from the top.
  const reset = () => setCount(pageSize);

  return { shown, hasMore, listRef, onScroll, reset };
}
