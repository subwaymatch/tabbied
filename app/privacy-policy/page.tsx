import type { Metadata } from 'next';
import PageHeader from 'components/PageHeader';
import { Container, Row, Col } from 'components/layout';
import Footer from 'components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - Tabbied',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" />

      <main style={{ padding: '4rem 0', minHeight: '50vh' }}>
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} md={10}>
              <p>Last updated: June 13, 2026.</p>

              <p style={{ marginTop: '1.5rem' }}>
                Tabbied is a free tool for generating artwork in your browser.
                Artwork is generated client-side, and we do not require an
                account to use the tool.
              </p>

              <h3 style={{ marginTop: '2rem' }}>Information we collect</h3>
              <p style={{ marginTop: '1rem' }}>
                We may collect anonymous, aggregated usage analytics to help us
                understand how the tool is used and improve it. We do not sell
                your personal information.
              </p>

              <h3 style={{ marginTop: '2rem' }}>Contact</h3>
              <p style={{ marginTop: '1rem' }}>
                If you have any questions about this Privacy Policy, please reach
                out via our{' '}
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
