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
import GithubIcon from './GithubIcon';
import styles from './GalleryRail.module.css';

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
