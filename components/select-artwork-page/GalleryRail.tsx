'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import LogoDoodle from 'components/main-page/LogoDoodle';
import PaletteRow from 'components/palette/PaletteRow';
import PaletteBrowser from 'components/palette/PaletteBrowser';
import SectionPager from 'components/palette/SectionPager';
import type { BrandPalette } from 'lib/brandPalettes';
import type { LibraryPalette } from 'lib/paletteLibrary';
import styles from './GalleryRail.module.css';

// lucide-react dropped its GitHub brand glyph, so the mark is inlined.
function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const PER_PAGE = 12;

export default function GalleryRail({
  search,
  onSearchChange,
  palettes,
  library,
  selectedId,
  palettesPage,
  onPalettesPageChange,
  onApply,
  onEditCustom,
  onEditLibrary,
  onDelete,
  deleteConfirmingId,
  onNewPalette,
  browserOpen,
  onOpenBrowser,
  onCloseBrowser,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  palettes: BrandPalette[];
  library: LibraryPalette[];
  selectedId: string | null;
  palettesPage: number;
  onPalettesPageChange: (page: number) => void;
  onApply: (id: string) => void;
  onEditCustom: (palette: BrandPalette) => void;
  onEditLibrary: (palette: LibraryPalette) => void;
  onDelete: (id: string) => void;
  deleteConfirmingId: string | null;
  onNewPalette: () => void;
  browserOpen: boolean;
  onOpenBrowser: () => void;
  onCloseBrowser: () => void;
}) {
  // One merged list: custom palettes first, then the read-only library.
  const merged = useMemo(
    () => [
      ...palettes.map((palette) => ({ kind: 'custom' as const, palette })),
      ...library.map((palette) => ({ kind: 'library' as const, palette })),
    ],
    [palettes, library]
  );

  const pageCount = Math.max(1, Math.ceil(merged.length / PER_PAGE));
  const clampedPage = Math.min(palettesPage, pageCount - 1);
  const rows = merged.slice(clampedPage * PER_PAGE, clampedPage * PER_PAGE + PER_PAGE);

  return (
    <aside className={styles.sidebar}>
      <Link href="/" aria-label="Tabbied" className={styles.logo} prefetch={false}>
        <LogoDoodle size={32} />
      </Link>

      {browserOpen ? (
        <PaletteBrowser
          variant="rail"
          palettes={palettes}
          library={library}
          activeId={selectedId}
          deleteConfirmingId={deleteConfirmingId}
          onApply={onApply}
          onEditCustom={onEditCustom}
          onEditLibrary={onEditLibrary}
          onDelete={onDelete}
          onNewPalette={onNewPalette}
          onClose={onCloseBrowser}
        />
      ) : (
        <>
          <label className={styles.search}>
            <Search size={14} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search designs"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              aria-label="Search designs"
            />
          </label>

          <div className={styles.previewHeader}>
            <span className={styles.previewLabel}>Preview colors</span>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Palettes</span>
              {merged.length > PER_PAGE && (
                <SectionPager
                  page={clampedPage}
                  pageCount={pageCount}
                  onPageChange={onPalettesPageChange}
                  label="palettes"
                />
              )}
            </div>

            {rows.map(({ kind, palette }) => {
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
                  showEdit={kind === 'library'}
                  showDelete={kind === 'custom'}
                  editLabel={`Edit ${palette.name} (saves as a copy)`}
                  editTitle="Edit palette (saves as a copy)"
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
                  onEdit={
                    kind === 'library' ? () => onEditLibrary(palette) : undefined
                  }
                  onDelete={
                    kind === 'custom' ? () => onDelete(palette.id) : undefined
                  }
                />
              );
            })}

            {palettes.length === 0 && (
              <p className={styles.emptyNote}>
                No palettes yet. Create your first one below.
              </p>
            )}

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

            <button
              type="button"
              className={styles.browseAll}
              onClick={onOpenBrowser}
            >
              Browse all palettes <ChevronRight size={13} />
            </button>
          </div>
        </>
      )}

      <div className={styles.footer}>
        <a
          href="https://github.com/subwaymatch/tabbied/"
          target="_blank"
          rel="noreferrer"
          aria-label="Tabbied on GitHub"
          className={styles.footerLink}
        >
          <GithubIcon size={18} />
        </a>
        <Link href="/docs/react" prefetch={false} className={styles.footerDocs}>
          Docs
        </Link>
      </div>
    </aside>
  );
}
