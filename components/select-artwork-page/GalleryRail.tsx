'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Check, Download, Plus, Search, Upload, X } from 'lucide-react';
import LogoDoodle from 'components/main-page/LogoDoodle';
import PaletteStrip from 'components/palette/PaletteStrip';
import SectionPager from 'components/palette/SectionPager';
import type { BrandPalette } from 'lib/brandPalettes';
import type { LibraryPalette } from 'lib/paletteLibrary';
import styles from './GalleryRail.module.css';

// lucide-react dropped its GitHub brand glyph, so the mark is inlined (matching
// the shared site header).
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

const PER_PAGE = 4;

export default function GalleryRail({
  search,
  onSearchChange,
  onImport,
  onExport,
  fileInput,
  savedPalettes,
  library,
  selectedId,
  savedPage,
  onSavedPageChange,
  libPage,
  onLibPageChange,
  onSelectSaved,
  onDeleteSaved,
  pendingDeleteId,
  onSelectLibrary,
  onCopyLibrary,
  onNewPalette,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onImport: () => void;
  onExport: () => void;
  fileInput: ReactNode;
  savedPalettes: BrandPalette[];
  library: LibraryPalette[];
  selectedId: string | null;
  savedPage: number;
  onSavedPageChange: (page: number) => void;
  libPage: number;
  onLibPageChange: (page: number) => void;
  onSelectSaved: (palette: BrandPalette) => void;
  onDeleteSaved: (id: string) => void;
  pendingDeleteId: string | null;
  onSelectLibrary: (palette: LibraryPalette) => void;
  onCopyLibrary: (palette: LibraryPalette) => void;
  onNewPalette: () => void;
}) {
  const savedPageCount = Math.max(1, Math.ceil(savedPalettes.length / PER_PAGE));
  const clampedSavedPage = Math.min(savedPage, savedPageCount - 1);
  const savedRows = savedPalettes.slice(
    clampedSavedPage * PER_PAGE,
    clampedSavedPage * PER_PAGE + PER_PAGE
  );

  const libPageCount = Math.max(1, Math.ceil(library.length / PER_PAGE));
  const clampedLibPage = Math.min(libPage, libPageCount - 1);
  const libRows = library.slice(
    clampedLibPage * PER_PAGE,
    clampedLibPage * PER_PAGE + PER_PAGE
  );

  return (
    <aside className={styles.sidebar}>
      <Link href="/" aria-label="Tabbied" className={styles.logo} prefetch={false}>
        <LogoDoodle size={32} />
      </Link>

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
        <button
          type="button"
          className={styles.iconButton}
          onClick={onImport}
          title="Import palettes"
          aria-label="Import palettes"
        >
          <Upload size={14} />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onExport}
          title="Export palettes"
          aria-label="Export palettes"
        >
          <Download size={14} />
        </button>
        {fileInput}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Your Palettes</span>
          <SectionPager
            page={clampedSavedPage}
            pageCount={savedPageCount}
            onPageChange={onSavedPageChange}
            label="saved palettes"
          />
        </div>

        {savedRows.map((palette) => {
          const active = palette.id === selectedId;
          const confirming = pendingDeleteId === palette.id;
          const label = palette.name || 'Untitled';

          return (
            <button
              key={palette.id}
              type="button"
              className={styles.row}
              onClick={() => onSelectSaved(palette)}
              title={active ? 'Edit this palette' : 'Preview every design in this palette'}
            >
              <PaletteStrip
                colors={palette.colors}
                transparentBackground={palette.transparentBackground}
              />
              <span
                className={active ? `${styles.rowName} ${styles.rowNameActive}` : styles.rowName}
              >
                {label}
              </span>
              {active && (
                <span className={styles.rowCheck}>
                  <Check size={14} />
                </span>
              )}
              <span
                role="button"
                tabIndex={0}
                aria-label={`Delete ${label}`}
                title={confirming ? 'Click again to delete' : 'Delete palette'}
                className={
                  confirming ? `${styles.rowDelete} ${styles.rowDeleteConfirm}` : styles.rowDelete
                }
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteSaved(palette.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    onDeleteSaved(palette.id);
                  }
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </span>
            </button>
          );
        })}

        {savedPalettes.length === 0 && (
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

        <div className={`${styles.sectionHeader} ${styles.libraryHeader}`}>
          <span className={styles.sectionLabel}>Palette Library</span>
          <SectionPager
            page={clampedLibPage}
            pageCount={libPageCount}
            onPageChange={onLibPageChange}
            label="palettes"
          />
        </div>

        {libRows.map((palette) => {
          const active = palette.id === selectedId;

          return (
            <button
              key={palette.id}
              type="button"
              className={styles.row}
              onClick={() => onSelectLibrary(palette)}
              title="Preview every design in this palette"
            >
              <PaletteStrip colors={palette.colors} />
              <span
                className={active ? `${styles.rowName} ${styles.rowNameActive}` : styles.rowName}
              >
                {palette.name}
              </span>
              {active && (
                <span className={styles.rowCheck}>
                  <Check size={14} />
                </span>
              )}
              <span
                role="button"
                tabIndex={0}
                aria-label={`Save a copy of ${palette.name}`}
                title="Save a copy to your palettes"
                className={styles.rowCopy}
                onClick={(event) => {
                  event.stopPropagation();
                  onCopyLibrary(palette);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    onCopyLibrary(palette);
                  }
                }}
              >
                <Plus size={14} />
              </span>
            </button>
          );
        })}
      </div>

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
