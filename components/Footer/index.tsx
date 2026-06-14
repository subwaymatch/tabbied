import Link from 'next/link';
import { Container, Row, Col } from 'components/layout';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footerSection}>
      <Container>
        <Row>
          <Col lg={{ span: 3, offset: 1 }} md={{ span: 4 }}>
            <h5>Tabbied</h5>

            <p>Copyright {new Date().getFullYear()}.</p>

            {/* The Product Hunt badge used to live in the homepage header; it
                now sits in the footer. */}
            <a
              href="https://www.producthunt.com/posts/tabbied?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-tabbied"
              className={styles.productHuntBadge}
              target="_blank"
              rel="noreferrer"
              aria-label="Tabbied on Product Hunt"
            />
          </Col>

          <Col lg={{ span: 4 }} md={{ span: 5 }}>
            <h5>About Us</h5>

            <p>
              Tabbied lets you easily create timeless and beautifully generated
              patterns or artwork to use for wall art, websites, print materials
              and more.
            </p>
            <p>
              This free tool was built by{' '}
              <a href="https://www.syunghong.com/">Sy Hong</a> and{' '}
              <a href="https://www.behance.net/yejoopark">Ye Joo Park</a>.
            </p>
          </Col>

          <Col lg={{ span: 3, offset: 1 }} md={{ span: 3 }}>
            <h5>Links</h5>

            <ul className={styles.linkList}>
              <li>
                <Link href="/privacy-policy" prefetch={false}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" prefetch={false}>
                  Terms of Services
                </Link>
              </li>
              <li>
                <a href="https://github.com/subwaymatch/tabbied/">
                  GitHub
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
