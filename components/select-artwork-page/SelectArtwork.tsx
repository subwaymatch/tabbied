'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { GalleryItem } from 'lib/artwork';
import {
  deletePalette,
  getBrandPaletteState,
  setActivePalette,
  useBrandPalettes,
  type BrandPalette,
} from 'lib/brandPalettes';
import { PALETTE_LIBRARY, type LibraryPalette } from 'lib/paletteLibrary';
import { usePaletteEditor } from 'components/palette/usePaletteEditor';
import PaletteEditorDialog from 'components/palette/PaletteEditorDialog';
import GalleryRail from './GalleryRail';
import GalleryCard from './GalleryCard';
import GalleryScrollRestorer from './GalleryScrollRestorer';
import styles from './SelectArtwork.module.css';

const PER_PAGE = 20;
const RAIL_PER_PAGE = 12;

// Wait after the last palette pick before recoloring the grid, so rapidly
// clicking through palettes recolors the thumbnails once, not once per click.
const APPLY_DEBOUNCE_MS = 150;

// Page numbers to render: the first two, last two, and current ±2, with `null`
// standing in for a collapsed range (an ellipsis).
const paginationWindow = (page: number, pageCount: number): (number | null)[] => {
  const nums: number[] = [];

  for (let p = 1; p <= pageCount; p += 1) {
    if (p <= 2 || p > pageCount - 2 || Math.abs(p - page) <= 2) nums.push(p);
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
  // The gallery page lives in the URL (?page=N) so it's shareable, survives a
  // refresh, and works with back/forward. It's read from the URL client-side
  // (not useSearchParams) so the page keeps its server-rendered first paint
  // instead of deopting to client-only rendering. Starts at 1 for SSR.
  const [page, setPage] = useState(1);
  const [palettesPage, setPalettesPage] = useState(0);
  const [browserOpen, setBrowserOpen] = useState(false);

  // Read the page from the URL on mount and on back/forward.
  useEffect(() => {
    const readPage = () => {
      const raw = new URLSearchParams(window.location.search).get('page');
      const n = raw ? parseInt(raw, 10) : 1;
      setPage(Number.isFinite(n) && n >= 1 ? n : 1);
    };

    readPage();
    window.addEventListener('popstate', readPage);

    return () => window.removeEventListener('popstate', readPage);
  }, []);

  // Write ?page=N to the URL (dropping it for page 1). replace: for changes that
  // aren't a deliberate page navigation (e.g. a search resetting to page 1).
  const writePageToUrl = (nextPage: number, replace = false) => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    if (nextPage <= 1) params.delete('page');
    else params.set('page', String(nextPage));

    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;

    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  };

  // The rail's highlighted palette. Local so it updates instantly on click,
  // while the applied palette (which recolors the grid, read from the store by
  // each card) is written after a short debounce.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const applyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      // Saving/creating jumps the rail to the palette's page and applies it.
      const state = getBrandPaletteState();
      const index = state.palettes.findIndex((p) => p.id === palette.id);

      if (index >= 0) setPalettesPage(Math.floor(index / RAIL_PER_PAGE));
      applyPalette(palette.id, true);
    },
  });

  // Delete a custom palette on the first click of its ✕ (no confirm step).
  const removePalette = (id: string) => {
    deletePalette(id);
    if (selectedId === id) applyPalette(null, true);
  };

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

  const goToPage = (nextPage: number) => {
    const clamped = Math.min(Math.max(1, nextPage), pageCount);
    setPage(clamped);
    writePageToUrl(clamped);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    // A new search resets to page 1 — clear the page param (not a page nav).
    setPage(1);
    writePageToUrl(1, true);
  };

  const onEditCustom = (palette: BrandPalette) => editor.openEditor(palette);
  const onEditLibrary = (palette: LibraryPalette) =>
    editor.openEditorAsCopy(palette);

  const hasResults = filtered.length > 0;

  return (
    <main className={styles.gallery}>
      <GalleryScrollRestorer />

      <GalleryRail
        search={search}
        onSearchChange={onSearchChange}
        palettes={savedPalettes}
        library={PALETTE_LIBRARY}
        selectedId={selectedId}
        palettesPage={palettesPage}
        onPalettesPageChange={setPalettesPage}
        onApply={(id) => applyPalette(id)}
        onEditCustom={onEditCustom}
        onEditLibrary={onEditLibrary}
        onDelete={removePalette}
        onNewPalette={() => editor.openEditor()}
        browserOpen={browserOpen}
        onOpenBrowser={() => setBrowserOpen(true)}
        onCloseBrowser={() => setBrowserOpen(false)}
      />

      <div className={styles.mainColumn}>
        <div className={styles.mainHeader}>
          <h1 className={styles.title}>Pick a design</h1>
          <span className={styles.count}>{filtered.length} designs</span>
        </div>

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
                  onClick={() => goToPage(clampedPage - 1)}
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
                      onClick={() => goToPage(p)}
                      aria-current={p === clampedPage ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className={styles.pageArrow}
                  onClick={() => goToPage(clampedPage + 1)}
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
        onRandomize={editor.randomizeDraft}
        setDraftColor={editor.setDraftColor}
      />
    </main>
  );
}
