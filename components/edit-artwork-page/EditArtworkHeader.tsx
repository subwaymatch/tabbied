'use client';

import Link from 'next/link';
import { Shuffle, ArrowDownToLine } from 'lucide-react';
import { Container, Row, Col } from 'components/layout';
import styles from './EditArtworkHeader.module.css';

type EditArtworkHeaderProps = {
  onRedraw: () => void;
  onExport: () => void;
};

export default function EditArtworkHeader({
  onRedraw,
  onExport,
}: EditArtworkHeaderProps) {
  return (
    <header className={styles.header}>
      <Container>
        <Row align="center">
          <Col md={4} xs={6}>
            <Link href="/select-artwork">← Back to gallery</Link>
          </Col>

          <Col md={4} className={styles.titleColumn}>
            <h1 className="align-center">Make your art</h1>
          </Col>

          <Col md={4} xs={6}>
            <div className="align-right">
              <button className={styles.btn} onClick={onRedraw}>
                <Shuffle className={styles.reactIcon} size={18} />
                <span className={styles.label}>Redraw</span>
              </button>
              <button
                className={`${styles.btn} ${styles.btnExport}`}
                onClick={onExport}
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
