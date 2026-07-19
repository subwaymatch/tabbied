'use client';

import { useEffect, useMemo, useRef, useState, type UIEvent } from 'react';
import { Search, X } from 'lucide-react';
import type { BrandPalette } from 'lib/brandPalettes';
import type { LibraryPalette } from 'lib/paletteLibrary';
import PaletteRow from './PaletteRow';
import styles from './PaletteBrowser.module.css';

const PAGE = 16;

type MergedEntry =
  | { kind: 'custom'; palette: BrandPalette }
  | { kind: 'library'; palette: LibraryPalette };

/**
 * The embedded "Browse all palettes" browser: one merged, searchable, infinitely
 * scrolling list (custom palettes first, then the read-only library) with a
 * "+ New Palette" at the bottom. Swaps into the gallery rail or the editor's
 * options panel (variant) rather than opening a separate dialog.
 */
export default function PaletteBrowser({
  variant,
  palettes,
  library,
  activeId,
  deleteConfirmingId,
  onApply,
  onEditCustom,
  onEditLibrary,
  onDelete,
  onNewPalette,
  onClose,
}: {
  variant: 'rail' | 'panel';
  palettes: BrandPalette[];
  library: LibraryPalette[];
  activeId: string | null;
  deleteConfirmingId: string | null;
  onApply: (id: string) => void;
  onEditCustom: (palette: BrandPalette) => void;
  onEditLibrary: (palette: LibraryPalette) => void;
  onDelete: (id: string) => void;
  onNewPalette: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(PAGE);
  const listRef = useRef<HTMLDivElement>(null);

  const merged = useMemo<MergedEntry[]>(() => {
    const q = query.trim().toLowerCase();
    const match = (name: string) => !q || name.toLowerCase().includes(q);

    return [
      ...palettes
        .filter((p) => match(p.name || 'untitled'))
        .map((palette) => ({ kind: 'custom' as const, palette })),
      ...library
        .filter((p) => match(p.name))
        .map((palette) => ({ kind: 'library' as const, palette })),
    ];
  }, [palettes, library, query]);

  const shown = merged.slice(0, count);
  const hasMore = shown.length < merged.length;

  // Keep loading until the list overflows its container, so it always fills the
  // available height and stays scrollable (otherwise the initial batch might fit
  // on a tall viewport, leaving nothing to scroll and no way to reach the rest).
  useEffect(() => {
    const el = listRef.current;
    if (el && hasMore && el.scrollHeight <= el.clientHeight) {
      setCount((c) => c + PAGE);
    }
  }, [count, hasMore, merged.length]);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    if (
      el.scrollTop + el.clientHeight > el.scrollHeight - 120 &&
      count < merged.length
    ) {
      setCount((c) => c + PAGE);
    }
  };

  return (
    <div
      className={
        variant === 'panel'
          ? `${styles.browser} ${styles.panel}`
          : `${styles.browser} ${styles.rail}`
      }
    >
      <div className={styles.head}>
        <div className={styles.headRow}>
          <span className={styles.headTitle}>All palettes</span>
          <span className={styles.count}>{merged.length} palettes</span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close palette browser"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
        <label className={styles.search}>
          <Search size={14} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search palettes"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCount(PAGE);
            }}
            aria-label="Search palettes"
          />
        </label>
      </div>

      <div ref={listRef} className={styles.list} onScroll={onScroll}>
        {shown.map((entry) => {
          const { kind, palette } = entry;
          const active = palette.id === activeId;

          return (
            <PaletteRow
              key={palette.id}
              colors={palette.colors}
              transparentBackground={
                kind === 'custom' ? palette.transparentBackground : false
              }
              name={palette.name || 'Untitled'}
              active={active}
              meta={`${palette.colors.length} colors`}
              showEdit
              showDelete={kind === 'custom'}
              editLabel={`Edit ${palette.name || 'palette'}${
                kind === 'library' ? ' (saves as a copy)' : ''
              }`}
              editTitle={
                kind === 'library'
                  ? 'Edit palette (saves as a copy)'
                  : 'Edit palette'
              }
              deleteLabel={`Delete ${palette.name || 'palette'}`}
              deleteConfirming={deleteConfirmingId === palette.id}
              onClick={() => {
                if (active) {
                  if (kind === 'library') onEditLibrary(palette);
                  else onEditCustom(palette);
                  return;
                }
                onApply(palette.id);
              }}
              onEdit={() =>
                kind === 'library'
                  ? onEditLibrary(palette)
                  : onEditCustom(palette)
              }
              onDelete={
                kind === 'custom' ? () => onDelete(palette.id) : undefined
              }
            />
          );
        })}

        {hasMore && <div className={styles.more}>Scroll for more…</div>}
        {merged.length === 0 && (
          <div className={styles.empty}>No palettes match your search.</div>
        )}
      </div>

      <div className={styles.foot}>
        <button type="button" className={styles.newPalette} onClick={onNewPalette}>
          <span className={styles.newStrip} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>+ New Palette</span>
        </button>
      </div>
    </div>
  );
}
