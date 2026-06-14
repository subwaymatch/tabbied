import type { Metadata } from 'next';
import PageHeader from 'components/PageHeader';
import { Container, Row, Col } from 'components/layout';
import Footer from 'components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Services - Tabbied',
};

export default function TermsOfServicePage() {
  return (
    <>
      <PageHeader title="Terms of Services" />

      <main style={{ padding: '4rem 0', minHeight: '50vh' }}>
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} md={10}>
              <p>Last updated: June 13, 2026.</p>

              <p style={{ marginTop: '1.5rem' }}>
                By using Tabbied, you agree to these terms. Tabbied is provided
                free of charge, on an &ldquo;as is&rdquo; basis, without
                warranties of any kind.
              </p>

              <h3 style={{ marginTop: '2rem' }}>Use of artwork</h3>
              <p style={{ marginTop: '1rem' }}>
                Artwork you generate with Tabbied is yours to use for personal
                and commercial projects. The Tabbied name, logo, and source code
                remain the property of their respective owners.
              </p>

              <h3 style={{ marginTop: '2rem' }}>Limitation of liability</h3>
              <p style={{ marginTop: '1rem' }}>
                Tabbied and its authors are not liable for any damages arising
                from the use of this tool.
              </p>

              <h3 style={{ marginTop: '2rem' }}>Contact</h3>
              <p style={{ marginTop: '1rem' }}>
                Questions about these terms can be raised via our{' '}
                <a href="https://github.com/subwaymatch/tabbied/">
                  GitHub repository
                </a>
                .
              </p>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </>
  );
}
