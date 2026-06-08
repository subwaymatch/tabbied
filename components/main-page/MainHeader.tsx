'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container, Row, Col } from 'components/layout';
import styles from './MainHeader.module.css';

const sections = [
  { id: 'section-how-it-works', label: 'How it works' },
  { id: 'section-browse-artwork', label: 'Browse artwork' },
  { id: 'section-example-uses', label: 'Example uses' },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function MainHeader() {
  return (
    <header className={styles.headerSection}>
      <Container>
        <Row align="center">
          <Col md={3} xs={4}>
            <Link href="/" className={styles.logoImageWrapper}>
              <Image
                src="/images/logo_tabbied_v3.svg"
                alt="Tabbied"
                width={52}
                height={52}
              />
            </Link>
          </Col>

          <Col md={6} className={styles.navColumn}>
            <div className="align-center">
              <ul className={styles.pageNavigation}>
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          <Col md={3} xs={8}>
            <div className="align-right">
              <a
                href="https://www.producthunt.com/posts/tabbied?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-tabbied"
                style={{
                  background:
                    'url("https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=279660&theme=light&period=daily") no-repeat center center',
                  display: 'inline-block',
                  width: '238px',
                  height: '49px',
                  lineHeight: 0,
                  marginTop: '10px',
                }}
                target="_blank"
                rel="noreferrer"
                aria-label="Tabbied on Product Hunt"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
