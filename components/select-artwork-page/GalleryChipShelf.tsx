'use client';

import { useMemo } from 'react';
import { Check, ChevronRight, Pencil, X } from 'lucide-react';
import PaletteStrip from 'components/palette/PaletteStrip';
import type { BrandPalette } from 'lib/brandPalettes';
import type { LibraryPalette } from 'lib/paletteLibrary';
import styles from './GalleryChipShelf.module.css';

/**
 * Mobile (7a): the merged palette list as a horizontal, scrollable chip shelf.
 * Custom chips carry a ✕ (single-click delete); library chips a pencil
 * (edit-as-copy). A trailing "All ›" pill opens the embedded palette browser.
 */
export default function GalleryChipShelf({
  palettes,
  library,
  selectedId,
  onApply,
  onEditCustom,
  onEditLibrary,
  onDelete,
  onBrowse,
}: {
  palettes: BrandPalette[];
  library: LibraryPalette[];
  selectedId: string | null;
  onApply: (id: string) => void;
  onEditCustom: (palette: BrandPalette) => void;
  onEditLibrary: (palette: LibraryPalette) => void;
  onDelete: (id: string) => void;
  onBrowse: () => void;
}) {
  const merged = useMemo(
    () => [
      ...palettes.map((palette) => ({ kind: 'custom' as const, palette })),
      ...library.map((palette) => ({ kind: 'library' as const, palette })),
    ],
    [palettes, library]
  );

  return (
    <div className={styles.shelf}>
      {merged.map(({ kind, palette }) => {
        const active = palette.id === selectedId;

        return (
          <button
            key={palette.id}
            type="button"
            className={active ? `${styles.chip} ${styles.chipActive}` : styles.chip}
            title={palette.name || 'Untitled'}
            onClick={() => {
              if (active) {
                if (kind === 'library') onEditLibrary(palette);
                else onEditCustom(palette);
                return;
              }
              onApply(palette.id);
            }}
          >
            <PaletteStrip
              className={styles.strip}
              colors={palette.colors}
              transparentBackground={
                kind === 'custom' ? palette.transparentBackground : false
              }
            />
            <span className={styles.name}>{palette.name || 'Untitled'}</span>
            {active && (
              <span className={styles.check}>
                <Check size={13} />
              </span>
            )}
            {kind === 'custom' ? (
              <span
                role="button"
                tabIndex={0}
                className={styles.trailing}
                aria-label={`Delete ${palette.name || 'palette'}`}
                title="Delete palette"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(palette.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    onDelete(palette.id);
                  }
                }}
              >
                <X size={12} strokeWidth={2} />
              </span>
            ) : (
              <span
                role="button"
                tabIndex={0}
                className={styles.trailing}
                aria-label={`Edit ${palette.name} (saves as a copy)`}
                title="Edit palette (saves as a copy)"
                onClick={(event) => {
                  event.stopPropagation();
                  onEditLibrary(palette);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    onEditLibrary(palette);
                  }
                }}
              >
                <Pencil size={12} />
              </span>
            )}
          </button>
        );
      })}

      <button type="button" className={styles.allPill} onClick={onBrowse}>
        All <ChevronRight size={13} />
      </button>
    </div>
  );
}
