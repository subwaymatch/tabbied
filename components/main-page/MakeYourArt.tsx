import Link from 'next/link';
import { Container, Row, Col } from 'components/layout';
import styles from './MakeYourArt.module.css';

export default function MakeYourArt() {
  return (
    <div className={styles.makeYourArtSection}>
      <Container>
        <Row>
          <Col>
            <div className={styles.center}>
              <div className={styles.messageWrapper}>
                <p className={styles.message}>
                  Create your beautiful design in under a minute.
                </p>
              </div>

              <Link
                href="/select-artwork"
                className={styles.actionBtn}
                prefetch={false}
              >
                Make your art
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
