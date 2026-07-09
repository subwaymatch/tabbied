'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Menu } from '@base-ui-components/react/menu';
import {
  ArrowDownToLine,
  ChevronDown,
  ImageDown,
  Link as LinkIcon,
  CodeXml,
} from 'lucide-react';
import { Container, Row, Col } from 'components/layout';
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

  // Whether this editor was opened from the gallery (a marker the gallery
  // card sets on click, consumed here on mount). history.length alone can't
  // tell — for a deep-linked editor the previous entry could be anything.
  const [cameFromGallery, setCameFromGallery] = useState(false);

  // Brief "Copied" confirmation for the clipboard export options.
  const [copied, setCopied] = useState<string | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCameFromGallery(consumeGalleryNavigation());
  }, []);

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    },
    []
  );

  const flashCopied = (message: string) => {
    setCopied(message);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(null), 1800);
  };

  // Go back through history so the gallery's previous scroll position is
  // restored (armed below; the gallery does the actual restore on mount).
  // Modified clicks (open in new tab) fall through to the href.
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

    // A back navigation keeps the gallery entry (and its scroll) in place —
    // but only when the previous entry is actually the gallery; otherwise
    // navigate there normally (and leave the scroll-restore flag unarmed).
    if (cameFromGallery) {
      armGalleryScrollRestore();
      router.back();
    } else {
      router.push('/artworks');
    }
  };

  return (
    <header className={styles.header}>
      <Container>
        <Row align="center">
          <Col md={4} xs={6}>
            <NextLink href="/artworks" prefetch={false} onClick={handleBack}>
              ← Back to gallery
            </NextLink>
          </Col>

          <Col md={4} className={styles.titleColumn}>
            <h1 className="align-center">{artworkName}</h1>
          </Col>

          <Col md={4} xs={6}>
            <div className={styles.actions}>
              {copied && (
                <span className={styles.copied} role="status" aria-live="polite">
                  {copied}
                </span>
              )}

              {/* aria-labels keep the buttons named on small screens, where
                  the text labels are hidden and only the icons remain. */}
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
                  <ArrowDownToLine className={styles.reactIcon} size={18} />
                  <span className={styles.label}>Export</span>
                  <ChevronDown className={styles.chevronIcon} size={16} />
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner
                    className={styles.menuPositioner}
                    side="bottom"
                    align="end"
                    sideOffset={6}
                  >
                    <Menu.Popup className={styles.menuPopup}>
                      <Menu.Item
                        className={styles.menuItem}
                        onClick={onExportPng}
                      >
                        <ImageDown size={16} /> Download PNG
                      </Menu.Item>
                      <Menu.Item
                        className={styles.menuItem}
                        onClick={() => {
                          void onCopyLink();
                          flashCopied('Link copied');
                        }}
                      >
                        <LinkIcon size={16} /> Copy shareable link
                      </Menu.Item>
                      <Menu.Item
                        className={styles.menuItem}
                        onClick={() => {
                          void onCopyReactComponent();
                          flashCopied('React component copied');
                        }}
                      >
                        <CodeXml size={16} /> Copy React component
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
