import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'components/layout';
import styles from './PageHeader.module.css';

export default function PageHeader({ title }: { title: string }) {
  return (
    <header className={styles.headerSection}>
      <Container>
        <Row align="center">
          <Col xs={3}>
            <Link href="/" className={styles.logoImageWrapper}>
              <Image
                src="/images/logo_tabbied_v3.svg"
                alt="Tabbied"
                width={52}
                height={52}
              />
            </Link>
          </Col>

          <Col xs={6}>
            <div className="align-center">
              <h2>{title}</h2>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
