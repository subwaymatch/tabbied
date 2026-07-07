import Link from 'next/link';
import { Container, Row, Col } from 'components/layout';
import HeroClient from './HeroClient';
import styles from './Hero.module.css';

// Server-rendered hero: the blue section, headline and CTA are in the static
// HTML (no layout shift), while the animated css-doodle backdrop mounts
// client-side into the absolutely-positioned slot behind them.
export default function MainHero() {
  return (
    <div className={styles.heroSection}>
      <div className={styles.doodleBackground}>
        <HeroClient />
      </div>

      <div className={styles.contentBackground} />

      <Container>
        <Row align="center">
          <Col
            lg={{ span: 6, offset: 3 }}
            md={{ span: 6, offset: 3 }}
            sm={{ span: 8, offset: 2 }}
            xs={{ span: 12, offset: 0 }}
          >
            <div className={styles.heroContent}>
              <p className={styles.heroText}>
                Doodle with <br className={styles.lineBreak} />
                generated patterns
              </p>

              <div className={styles.heroActions}>
                <Link
                  href="/artworks/"
                  className={styles.actionBtn}
                  prefetch={false}
                >
                  Make your art
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
