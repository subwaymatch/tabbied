'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { Menu } from '@base-ui-components/react/menu';
import {
  ArrowDownToLine,
  ArrowLeft,
  ChevronDown,
  ImageDown,
  Link as LinkIcon,
  CodeXml,
  Shuffle,
} from 'lucide-react';
import {
  armGalleryScrollRestore,
  consumeGalleryNavigation,
} from 'lib/galleryScroll';
import ShuffleMenuButton from './ShuffleMenuButton';
import type { ShuffleAction } from './shuffleActions';
import styles from './EditArtworkHeader.module.css';

type EditArtworkHeaderProps = {
  artworkName: string;
  /** The current default shuffle scope (shared with the mobile panel). */
  shuffleAction: ShuffleAction;
  /** Run a shuffle scope without changing the default. */
  onRunShuffle: (id: ShuffleAction) => void;
  /** Make a shuffle scope the new default (persisted). */
  onSelectShuffle: (id: ShuffleAction) => void;
  /** Download the current artwork as a PNG. */
  onExportPng: () => void;
  /** Copy the current (fully-encoded) URL to the clipboard. */
  onCopyLink: () => void | Promise<void>;
  /** Copy a ready-to-paste <TabbiedArtwork> snippet to the clipboard. */
  onCopyReactComponent: () => void | Promise<void>;
  /** Mobile (7d): render icon buttons that open inline shuffle/export panels. */
  mobile: boolean;
  /** Mobile: whether an inline panel (shuffle/export/palettes) is open. */
  mobilePanelOpen: boolean;
  /** Mobile: open the inline shuffle panel. */
  onOpenShufflePanel: () => void;
  /** Mobile: open the inline export panel. */
  onOpenExportPanel: () => void;
  /** Mobile: close whichever inline panel is open. */
  onCloseMobilePanel: () => void;
};

export default function EditArtworkHeader({
  artworkName,
  shuffleAction,
  onRunShuffle,
  onSelectShuffle,
  onExportPng,
  onCopyLink,
  onCopyReactComponent,
  mobile,
  mobilePanelOpen,
  onOpenShufflePanel,
  onOpenExportPanel,
  onCloseMobilePanel,
}: EditArtworkHeaderProps) {
  const router = useRouter();

  // Whether this editor was opened from the gallery (a marker the gallery card
  // sets on click, consumed here on mount).
  const [cameFromGallery, setCameFromGallery] = useState(false);

  useEffect(() => {
    setCameFromGallery(consumeGalleryNavigation());
  }, []);

  // Go back through history so the gallery's previous scroll position is
  // restored. Modified clicks (open in new tab) fall through to the href.
  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    // Mobile: an open inline panel is closed first, before leaving the editor.
    if (mobile && mobilePanelOpen) {
      event.preventDefault();
      onCloseMobilePanel();
      return;
    }

    event.preventDefault();

    if (cameFromGallery) {
      armGalleryScrollRestore();
      router.back();
    } else {
      router.push('/artworks');
    }
  };

  if (mobile) {
    return (
      <header className={`${styles.header} ${styles.headerMobile}`}>
        <NextLink
          href="/artworks"
          prefetch={false}
          onClick={handleBack}
          className={styles.backIcon}
          aria-label={mobilePanelOpen ? 'Back to editor' : 'Back to gallery'}
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </NextLink>

        <h1 className={styles.titleMobile}>{artworkName}</h1>

        <button
          type="button"
          className={styles.iconButton}
          onClick={onOpenShufflePanel}
          aria-label="Shuffle options"
          title="Shuffle"
        >
          <Shuffle size={17} />
        </button>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.iconButtonExport}`}
          onClick={onOpenExportPanel}
          aria-label="Export options"
          title="Export"
        >
          <ArrowDownToLine size={17} />
        </button>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <NextLink
        href="/artworks"
        prefetch={false}
        onClick={handleBack}
        className={styles.back}
      >
        <ArrowLeft size={16} aria-hidden="true" /> Gallery
      </NextLink>

      <div className={styles.titleWrap}>
        <h1 className={styles.title}>{artworkName}</h1>
      </div>

      <div className={styles.actions}>
        <ShuffleMenuButton
          action={shuffleAction}
          onRun={onRunShuffle}
          onSelect={onSelectShuffle}
        />

        {/* Export is a dropdown: a PNG download plus clipboard exports. */}
        <Menu.Root>
          <Menu.Trigger
            className={`${styles.btn} ${styles.btnExport}`}
            aria-label="Export"
          >
            <ArrowDownToLine className={styles.reactIcon} size={16} />
            <span className={styles.label}>Export</span>
            <ChevronDown className={styles.chevronIcon} size={15} />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner
              className={styles.menuPositioner}
              side="bottom"
              align="end"
              sideOffset={6}
            >
              <Menu.Popup className={styles.menuPopup}>
                <Menu.Item className={styles.menuItem} onClick={onExportPng}>
                  <ImageDown size={15} /> Download PNG
                </Menu.Item>
                <Menu.Item
                  className={styles.menuItem}
                  onClick={() => void onCopyLink()}
                >
                  <LinkIcon size={15} /> Copy shareable link
                </Menu.Item>
                <Menu.Item
                  className={styles.menuItem}
                  onClick={() => void onCopyReactComponent()}
                >
                  <CodeXml size={15} /> Copy React component
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
    </header>
  );
}
