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
} from 'lucide-react';
import {
  armGalleryScrollRestore,
  consumeGalleryNavigation,
} from 'lib/galleryScroll';
import ShuffleMenuButton from './ShuffleMenuButton';
import styles from './EditArtworkHeader.module.css';

type EditArtworkHeaderProps = {
  artworkName: string;
  /** Shuffle everything (new layout + new colors). */
  onShuffleAll: () => void;
  /** Shuffle the layout only (reseed). */
  onShuffleLayout: () => void;
  /** Shuffle the colors only (reroll the palette). */
  onShuffleColors: () => void;
  /** Download the current artwork as a PNG. */
  onExportPng: () => void;
  /** Copy the current (fully-encoded) URL to the clipboard. */
  onCopyLink: () => void | Promise<void>;
  /** Copy a ready-to-paste <TabbiedArtwork> snippet to the clipboard. */
  onCopyReactComponent: () => void | Promise<void>;
};

export default function EditArtworkHeader({
  artworkName,
  onShuffleAll,
  onShuffleLayout,
  onShuffleColors,
  onExportPng,
  onCopyLink,
  onCopyReactComponent,
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

    event.preventDefault();

    if (cameFromGallery) {
      armGalleryScrollRestore();
      router.back();
    } else {
      router.push('/artworks');
    }
  };

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
          onShuffleAll={onShuffleAll}
          onShuffleLayout={onShuffleLayout}
          onShuffleColors={onShuffleColors}
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
