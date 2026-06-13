'use client';

import Link from 'next/link';
import { RefreshCw, ArrowDownToLine } from 'lucide-react';
import { Container, Row, Col } from 'components/layout';
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
  return (
    <header className={styles.header}>
      <Container>
        <Row align="center">
          <Col md={4} xs={6}>
            <Link href="/artworks" prefetch={false}>
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
