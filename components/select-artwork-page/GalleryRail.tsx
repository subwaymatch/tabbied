'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import LogoDoodle from 'components/main-page/LogoDoodle';
import PaletteRow from 'components/palette/PaletteRow';
import { usePaletteReveal } from 'components/palette/usePaletteReveal';
import type { BrandPalette } from 'lib/brandPalettes';
import type { LibraryPalette } from 'lib/paletteLibrary';
import { mergePalettes } from 'lib/paletteList';
import styles from './GalleryRail.module.css';

// How many rows to reveal per batch. The full merged list is hundreds of
// palettes, so it renders incrementally (like the old browser) and grows as the
// rail scrolls — cheap first paint, no wall of DOM.
const PAGE = 24;

/**
 * The gallery's desktop palette rail: the Tabbied logo, one search that filters
 * both the palette list and the design grid, the full merged palette list
 * (custom first, then the read-only library) in a single scrolling column, and
 * a pinned "+ New Palette". The list is the whole point of the rail, so it's
 * shown from the start — no "Preview colors" step and no separate browser.
 */
export default function GalleryRail({
  search,
  onSearchChange,
  palettes,
  library,
  selectedId,
  onApply,
  onEditCustom,
  onEditLibrary,
  onDelete,
  onNewPalette,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  palettes: BrandPalette[];
  library: LibraryPalette[];
  selectedId: string | null;
  onApply: (id: string) => void;
  onEditCustom: (palette: BrandPalette) => void;
  onEditLibrary: (palette: LibraryPalette) => void;
  onDelete: (id: string) => void;
  onNewPalette: () => void;
}) {
  // The same query filters both the palette list (here) and the design grid
  // (owned by the parent), so there's a single search for the whole page.
  const merged = useMemo(
    () => mergePalettes(palettes, library, search),
    [palettes, library, search]
  );

  const { shown, listRef, onScroll, reset } = usePaletteReveal(merged, PAGE);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <Link href="/" aria-label="Tabbied" className={styles.logo} prefetch={false}>
          <LogoDoodle size={32} />
        </Link>

        <label className={styles.search}>
          <Search size={14} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search palettes & designs"
            value={search}
            onChange={(event) => {
              onSearchChange(event.target.value);
              reset();
            }}
            aria-label="Search palettes and designs"
          />
        </label>
      </div>

      <div ref={listRef} className={styles.list} onScroll={onScroll}>
        {shown.map(({ kind, palette }) => {
          const active = palette.id === selectedId;

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
                kind === 'library' ? onEditLibrary(palette) : onEditCustom(palette)
              }
              onDelete={
                kind === 'custom' ? () => onDelete(palette.id) : undefined
              }
            />
          );
        })}

        {merged.length === 0 && (
          <p className={styles.empty}>No palettes match your search.</p>
        )}
      </div>

      <div className={styles.foot}>
        <button
          type="button"
          className={styles.newPalette}
          onClick={onNewPalette}
        >
          <span className={styles.newStrip} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className={styles.newLabel}>+ New Palette</span>
        </button>
      </div>
    </aside>
  );
}
