'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { BrandPalette } from 'lib/brandPalettes';
import type { LibraryPalette } from 'lib/paletteLibrary';
import { mergePalettes } from 'lib/paletteList';
import PaletteRow from './PaletteRow';
import { usePaletteReveal } from './usePaletteReveal';
import styles from './PaletteBrowser.module.css';

const PAGE = 16;

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
  onApply: (id: string) => void;
  onEditCustom: (palette: BrandPalette) => void;
  onEditLibrary: (palette: LibraryPalette) => void;
  onDelete: (id: string) => void;
  onNewPalette: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');

  const merged = useMemo(
    () => mergePalettes(palettes, library, query),
    [palettes, library, query]
  );

  const { shown, hasMore, listRef, onScroll, reset } = usePaletteReveal(
    merged,
    PAGE
  );

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
              reset();
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
