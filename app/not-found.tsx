import type { Metadata } from 'next';
import Link from 'next/link';
import MainHeader from 'components/main-page/MainHeader';
import { Container, Row, Col } from 'components/layout';
import Footer from 'components/Footer';

export const metadata: Metadata = {
  title: 'Page not found - Tabbied',
};

export default function NotFound() {
  return (
    <>
      <MainHeader />

      <main style={{ padding: '6rem 0', minHeight: '50vh' }}>
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} md={10}>
              <h3 className="section-title">Page not found</h3>

              <p style={{ marginTop: '1.5rem' }}>
                The page you are looking for doesn&apos;t exist - it may have
                moved, or the link may be misspelled.
              </p>

              <p style={{ marginTop: '1.5rem' }}>
                <Link href="/patterns/">Browse the pattern gallery</Link> or head{' '}
                <Link href="/">back to the homepage</Link>.
              </p>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </>
  );
}
