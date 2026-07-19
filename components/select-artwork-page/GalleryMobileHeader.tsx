'use client';

import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import LogoDoodle from 'components/main-page/LogoDoodle';
import PaletteBrowser from 'components/palette/PaletteBrowser';
import type { BrandPalette } from 'lib/brandPalettes';
import type { LibraryPalette } from 'lib/paletteLibrary';
import GalleryChipShelf from './GalleryChipShelf';
import GithubIcon from './GithubIcon';
import styles from './GalleryMobileHeader.module.css';

/**
 * Mobile (7a) gallery chrome: a compact logo + GitHub header, the design search,
 * a "Preview colors" row with "New Palette", and the palettes as a horizontal
 * chip shelf (or the embedded browser when "All ›" is tapped). Rendered above
 * the design grid; hidden by CSS on the two-column desktop layout.
 */
export default function GalleryMobileHeader({
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
  browserOpen,
  onOpenBrowser,
  onCloseBrowser,
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
  browserOpen: boolean;
  onOpenBrowser: () => void;
  onCloseBrowser: () => void;
}) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link href="/" aria-label="Tabbied" className={styles.logo} prefetch={false}>
          <LogoDoodle size={30} />
        </Link>
        <span className={styles.spacer} />
        <a
          href="https://github.com/subwaymatch/tabbied/"
          target="_blank"
          rel="noreferrer"
          aria-label="Tabbied on GitHub"
          className={styles.github}
        >
          <GithubIcon size={18} />
        </a>
      </header>

      <label className={styles.search}>
        <Search size={15} aria-hidden="true" />
        <input
          type="text"
          placeholder="Search designs"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search designs"
        />
      </label>

      {browserOpen ? (
        <div className={styles.browserPanel}>
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
        </div>
      ) : (
        <>
          <div className={styles.previewRow}>
            <span className={styles.previewLabel}>Preview colors</span>
            <span className={styles.spacer} />
            <button
              type="button"
              className={styles.newPalette}
              onClick={onNewPalette}
            >
              <Plus size={14} /> New Palette
            </button>
          </div>

          <GalleryChipShelf
            palettes={palettes}
            library={library}
            selectedId={selectedId}
            onApply={onApply}
            onEditCustom={onEditCustom}
            onEditLibrary={onEditLibrary}
            onDelete={onDelete}
            onBrowse={onOpenBrowser}
          />
        </>
      )}
    </div>
  );
}
