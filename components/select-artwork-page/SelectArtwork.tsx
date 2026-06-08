import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'components/layout';
import type { GalleryItem } from 'lib/artwork';
import styles from './SelectArtwork.module.css';

export default function SelectArtwork({
  gallery,
}: {
  gallery: GalleryItem[];
}) {
  return (
    <main className={styles.selectArtworkSection}>
      <div className={styles.grayBackground}>
        <Container>
          <Row>
            <Col>
              <h2>First, pick a pre-made design from our gallery.</h2>
            </Col>
          </Row>
        </Container>

        <Container fluidOnMobile>
          <Row noGutter>
            {gallery.map((item) => (
              <Col key={item.slug} md={3} sm={6}>
                <Link href={`/artwork/${item.slug}?seed=0000`}>
                  <div className={styles.galleryCard}>
                    <h4 className={item.white ? styles.white : undefined}>
                      {item.name}
                    </h4>
                    <Image
                      src={`/images/thumb_${item.slug}.png`}
                      alt={item.name}
                      width={800}
                      height={800}
                    />
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </main>
  );
}
