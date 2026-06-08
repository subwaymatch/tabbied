import Image from 'next/image';
import { Container, Row, Col } from 'components/layout';
import styles from './ExampleUses.module.css';

const uses = [
  { src: 'uses_wall_art', alt: 'Wall Art' },
  { src: 'uses_notebook', alt: 'Stationery' },
  { src: 'uses_tshirt', alt: 'Tshirt' },
  { src: 'uses_packaging', alt: 'Packaging' },
];

export default function ExampleUsesSection() {
  return (
    <div id="section-example-uses" className={styles.exampleUsesSection}>
      <Container>
        <Row>
          <Col>
            <span className={styles.subheading}>Example uses</span>
            <h3 className="section-title">Use it for just about anything</h3>
          </Col>
        </Row>
      </Container>

      <Container fluidOnMobile>
        <Row noGutter>
          {uses.map((use) => (
            <Col key={use.src} md={4} sm={6}>
              <div className={styles.imageWrapper}>
                <Image
                  src={`/images/${use.src}.jpg`}
                  alt={use.alt}
                  width={748}
                  height={808}
                />
              </div>
            </Col>
          ))}

          <Col md={8}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/uses_devices.jpg"
                alt="Devices"
                width={779}
                height={421}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
