import type { Metadata } from 'next';
import PageHeader from 'components/PageHeader';
import { Container, Row, Col } from 'components/layout';
import Footer from 'components/Footer';

export const metadata: Metadata = {
  title: 'React Component - Tabbied',
};

export default function ReactDocsPage() {
  return (
    <>
      <PageHeader title="React Component" />

      <main style={{ padding: '4rem 0', minHeight: '50vh' }}>
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} md={10}>
              <h3 className="section-title">Documentation coming soon</h3>
              <p style={{ marginTop: '1.5rem', color: 'var(--gray-medium)' }}>
                Docs for the <code>tabbied</code> React component are on the way.
                In the meantime, you can explore the package on{' '}
                <a href="https://github.com/subwaymatch/tabbied-site-nextjs/">
                  GitHub
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
