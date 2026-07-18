'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { GalleryItem } from 'lib/artwork';
import {
  copyLibraryPalette,
  deletePalette,
  getBrandPaletteState,
  setActivePalette,
  useBrandPalettes,
  type BrandPalette,
} from 'lib/brandPalettes';
import { PALETTE_LIBRARY, type LibraryPalette } from 'lib/paletteLibrary';
import { usePaletteEditor } from 'components/palette/usePaletteEditor';
import { usePaletteImportExport } from 'components/palette/usePaletteImportExport';
import { useConfirmDelete } from 'components/palette/useConfirmDelete';
import PaletteEditorDialog from 'components/palette/PaletteEditorDialog';
import GalleryRail from './GalleryRail';
import GalleryCard from './GalleryCard';
import GalleryScrollRestorer from './GalleryScrollRestorer';
import styles from './SelectArtwork.module.css';

const PER_PAGE = 12;
const ROWS_PER_SECTION = 4;

// Wait after the last palette pick before recoloring the grid, so rapidly
// clicking through palettes recolors the (up to 12) thumbnails once, not once
// per click (the rail highlight still updates instantly).
const APPLY_DEBOUNCE_MS = 150;

// The page numbers to render: first, last, and the current page ±1, with `null`
// standing in for a collapsed range (an ellipsis).
const paginationWindow = (page: number, pageCount: number): (number | null)[] => {
  const nums: number[] = [];

  for (let p = 1; p <= pageCount; p += 1) {
    if (p === 1 || p === pageCount || Math.abs(p - page) <= 1) nums.push(p);
  }

  const out: (number | null)[] = [];
  let last = 0;

  nums.forEach((p) => {
    if (last && p - last > 1) out.push(null);
    out.push(p);
    last = p;
  });

  return out;
};

export default function SelectArtwork({ gallery }: { gallery: GalleryItem[] }) {
  const brandState = useBrandPalettes();
  const savedPalettes = brandState.palettes;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [savedPage, setSavedPage] = useState(0);
  const [libPage, setLibPage] = useState(0);

  // The rail's highlighted palette. Kept local so it updates instantly on click,
  // while the applied palette (which recolors the grid, read from the store by
  // each card) is written after a short debounce.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const applyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Follow the store's active palette (initial hydration, cross-tab changes, or
  // a selection made in the editor), unless a pick is mid-debounce.
  useEffect(() => {
    if (applyTimer.current) return;
    setSelectedId(brandState.activePaletteId);
  }, [brandState.activePaletteId]);

  useEffect(
    () => () => {
      if (applyTimer.current) clearTimeout(applyTimer.current);
    },
    []
  );

  const applyPalette = (id: string | null, immediate = false) => {
    setSelectedId(id);

    if (applyTimer.current) {
      clearTimeout(applyTimer.current);
      applyTimer.current = null;
    }

    if (immediate) {
      setActivePalette(id);
      return;
    }

    applyTimer.current = setTimeout(() => {
      setActivePalette(id);
      applyTimer.current = null;
    }, APPLY_DEBOUNCE_MS);
  };

  const editor = usePaletteEditor({
    onSaved: (palette) => {
      const state = getBrandPaletteState();
      const index = state.palettes.findIndex((p) => p.id === palette.id);

      if (index >= 0) setSavedPage(Math.floor(index / ROWS_PER_SECTION));
      applyPalette(palette.id, true);
    },
  });

  const { status, exportPalettes, openFilePicker, fileInput } =
    usePaletteImportExport();

  const confirmDelete = useConfirmDelete((id) => {
    deletePalette(id);
    if (selectedId === id) applyPalette(null, true);
  });

  const filtered = useMemo(
    () =>
      gallery.filter(
        (item) =>
          !search || item.name.toLowerCase().includes(search.toLowerCase())
      ),
    [gallery, search]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const clampedPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (clampedPage - 1) * PER_PAGE,
    (clampedPage - 1) * PER_PAGE + PER_PAGE
  );
  const pages = paginationWindow(clampedPage, pageCount);

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onSelectSaved = (palette: BrandPalette) => {
    // Clicking the already-active palette opens it for editing (matching the
    // editor's chips); otherwise it selects and applies it.
    if (selectedId === palette.id) {
      editor.openEditor(palette);
      return;
    }

    applyPalette(palette.id);
  };

  const onSelectLibrary = (palette: LibraryPalette) => {
    // A curated palette is read-only, so clicking the active one toggles back
    // to each design's own colors.
    applyPalette(selectedId === palette.id ? null : palette.id);
  };

  const onCopyLibrary = (palette: LibraryPalette) => {
    const preCopyCount = getBrandPaletteState().palettes.length;
    const copy = copyLibraryPalette(palette);

    setSavedPage(Math.floor(preCopyCount / ROWS_PER_SECTION));
    applyPalette(copy.id, true);
  };

  const hasResults = filtered.length > 0;

  return (
    <main className={styles.gallery}>
      <GalleryScrollRestorer />

      <GalleryRail
        search={search}
        onSearchChange={onSearchChange}
        onImport={openFilePicker}
        onExport={exportPalettes}
        fileInput={fileInput}
        savedPalettes={savedPalettes}
        library={PALETTE_LIBRARY}
        selectedId={selectedId}
        savedPage={savedPage}
        onSavedPageChange={setSavedPage}
        libPage={libPage}
        onLibPageChange={setLibPage}
        onSelectSaved={onSelectSaved}
        onDeleteSaved={confirmDelete.request}
        pendingDeleteId={confirmDelete.pendingId}
        onSelectLibrary={onSelectLibrary}
        onCopyLibrary={onCopyLibrary}
        onNewPalette={() => editor.openEditor()}
      />

      <div className={styles.mainColumn}>
        <div className={styles.mainHeader}>
          <h1 className={styles.title}>Pick a design</h1>
          <span className={styles.count}>{filtered.length} designs</span>
        </div>

        {status && (
          <p
            className={
              status.error
                ? `${styles.status} ${styles.statusError}`
                : styles.status
            }
            role="status"
          >
            {status.message}
          </p>
        )}

        {hasResults ? (
          <>
            <div className={styles.grid}>
              {visible.map((item) => (
                <GalleryCard key={item.slug} item={item} />
              ))}
            </div>

            {pageCount > 1 && (
              <nav className={styles.pagination} aria-label="Pages">
                <button
                  type="button"
                  className={styles.pageArrow}
                  onClick={() => setPage(Math.max(1, clampedPage - 1))}
                  disabled={clampedPage <= 1}
                  aria-label="Previous page"
                >
                  <ArrowLeft size={15} />
                </button>

                {pages.map((p, index) =>
                  p === null ? (
                    <span
                      key={`gap-${index}`}
                      className={styles.pageGap}
                      aria-hidden="true"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className={
                        p === clampedPage
                          ? `${styles.pageNumber} ${styles.pageNumberCurrent}`
                          : styles.pageNumber
                      }
                      onClick={() => setPage(p)}
                      aria-current={p === clampedPage ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className={styles.pageArrow}
                  onClick={() => setPage(Math.min(pageCount, clampedPage + 1))}
                  disabled={clampedPage >= pageCount}
                  aria-label="Next page"
                >
                  <ArrowRight size={15} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className={styles.noResults}>
            <p>No designs match your search.</p>
            <button
              type="button"
              className={styles.clearSearch}
              onClick={() => onSearchChange('')}
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <PaletteEditorDialog
        draft={editor.draft}
        setDraft={editor.setDraft}
        draftError={editor.draftError}
        onClose={editor.closeEditor}
        onSave={editor.saveDraft}
        onDelete={editor.removeDraftPalette}
        onShuffleOrder={editor.shuffleDraftOrder}
        setDraftColor={editor.setDraftColor}
      />
    </main>
  );
}
