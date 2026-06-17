'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { RefreshCw, ArrowDownToLine } from 'lucide-react';
import { Container, Row, Col } from 'components/layout';
import { armGalleryScrollRestore } from 'lib/galleryScroll';
import styles from './EditArtworkHeader.module.css';

type EditArtworkHeaderProps = {
  artworkName: string;
  onRedraw: () => void;
  onExport: () => void;
};

export default function EditArtworkHeader({
  artworkName,
  onRedraw,
  onExport,
}: EditArtworkHeaderProps) {
  const router = useRouter();

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
    armGalleryScrollRestore();

    // A back navigation keeps the gallery entry (and its scroll) in place; with
    // no in-app history to return to, fall back to a normal push.
    if (window.history.length > 1) {
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
            <Link href="/artworks" prefetch={false} onClick={handleBack}>
              ← Back to gallery
            </Link>
          </Col>

          <Col md={4} className={styles.titleColumn}>
            <h1 className="align-center">{artworkName}</h1>
          </Col>

          <Col md={4} xs={6}>
            <div className="align-right">
              {/* aria-labels keep the buttons named on small screens, where
                  the text labels are hidden and only the icons remain. */}
              <button
                className={styles.btn}
                onClick={onRedraw}
                aria-label="Redraw"
              >
                <RefreshCw className={styles.reactIcon} size={18} />
                <span className={styles.label}>Redraw</span>
              </button>
              <button
                className={`${styles.btn} ${styles.btnExport}`}
                onClick={onExport}
                aria-label="Export"
              >
                <ArrowDownToLine className={styles.reactIcon} size={18} />
                <span className={styles.label}>Export</span>
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
