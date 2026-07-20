'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import useMediaQuery from 'lib/useMediaQuery';
import type { GalleryItem } from 'lib/artwork';
import {
  deletePalette,
  setActivePalette,
  useBrandPalettes,
  type BrandPalette,
} from 'lib/brandPalettes';
import {
  DEFAULT_PALETTE_ID,
  PALETTE_LIBRARY,
  type LibraryPalette,
} from 'lib/paletteLibrary';
import { usePaletteEditor } from 'components/palette/usePaletteEditor';
import PaletteEditorDialog from 'components/palette/PaletteEditorDialog';
import GalleryRail from './GalleryRail';
import GalleryMobileHeader from './GalleryMobileHeader';
import GalleryChipShelf from './GalleryChipShelf';
import GalleryCard from './GalleryCard';
import GalleryScrollRestorer from './GalleryScrollRestorer';
import styles from './SelectArtwork.module.css';

const PER_PAGE = 20;

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

  // Below the two-column breakpoint the fixed rail is replaced by the mobile
  // header (7a). Rendering it only on mobile keeps its ~120 palette chips out of
  // the desktop DOM; the `&&` placeholder holds the slot so the grid (a later
  // sibling) never remounts when this toggles.
  const isMobile = useMediaQuery('(max-width: 991.98px)');

  const [search, setSearch] = useState('');
  // The gallery page lives in the URL (?page=N) so it's shareable, survives a
  // refresh, and works with back/forward. It's read from the URL client-side
  // (not useSearchParams) so the page keeps its server-rendered first paint
  // instead of deopting to client-only rendering. Starts at 1 for SSR.
  const [page, setPage] = useState(1);
  // Mobile only: the "All ›" chip-shelf pill swaps in the embedded browser.
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
  const [selectedId, setSelectedId] = useState<string | null>(DEFAULT_PALETTE_ID);
  const applyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (applyTimer.current) return;
    // A null active id means "the shared default palette" now (never per-artwork
    // colors), so highlight the default chip rather than nothing.
    setSelectedId(brandState.activePaletteId ?? DEFAULT_PALETTE_ID);
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
    // Saving/creating applies the palette; the rail shows the full list, so a
    // freshly saved custom palette is already at the top — no page to jump to.
    onSaved: (palette) => applyPalette(palette.id, true),
  });

  // Delete a custom palette on the first click of its ✕ (no confirm step).
  // Deleting the active palette reverts previews to the shared default.
  const removePalette = (id: string) => {
    deletePalette(id);
    if (selectedId === id) applyPalette(DEFAULT_PALETTE_ID, true);
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

      {!isMobile && (
      <GalleryRail
        search={search}
        onSearchChange={onSearchChange}
        palettes={savedPalettes}
        library={PALETTE_LIBRARY}
        selectedId={selectedId}
        onApply={(id) => applyPalette(id)}
        onEditCustom={onEditCustom}
        onEditLibrary={onEditLibrary}
        onDelete={removePalette}
        onNewPalette={() => editor.openEditor()}
      />
      )}

      {isMobile && (
      <GalleryMobileHeader
        search={search}
        onSearchChange={onSearchChange}
        onNewPalette={() => editor.openEditor()}
        palettes={savedPalettes}
        library={PALETTE_LIBRARY}
        selectedId={selectedId}
        onApply={(id) => applyPalette(id)}
        onEditCustom={onEditCustom}
        onEditLibrary={onEditLibrary}
        onDelete={removePalette}
        browserOpen={browserOpen}
        onCloseBrowser={() => setBrowserOpen(false)}
      />
      )}

      {/* Mobile only: the palette chip shelf lives here — a direct child of the
          document-scrolled gallery — so `position: sticky` keeps it pinned to
          the top of the viewport across the whole grid scroll (nested inside the
          header wrapper it could only stick within that short box). */}
      {isMobile && !browserOpen && (
        <GalleryChipShelf
          className={styles.mobileShelf}
          palettes={savedPalettes}
          library={PALETTE_LIBRARY}
          selectedId={selectedId}
          onApply={(id) => applyPalette(id)}
          onEditCustom={onEditCustom}
          onEditLibrary={onEditLibrary}
          onDelete={removePalette}
          onBrowse={() => setBrowserOpen(true)}
        />
      )}

      <div className={styles.mainColumn}>
        <div className={styles.mainHeader}>
          <div className={styles.mainHeading}>
            <h1 className={styles.title}>Pick a design</h1>
            <span className={styles.count}>{filtered.length} designs</span>
          </div>
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
