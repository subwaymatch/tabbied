import Link from 'next/link';
import { Container, Row, Col } from 'components/layout';
import type { GalleryItem } from 'lib/artwork';
import GalleryDoodle from './GalleryDoodle';
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
            {/* prefetch={false}: with 150+ cards, viewport prefetching would
                fire an RSC payload request per card scrolled past — by far the
                page's largest source of Vercel edge requests. The editor pages
                are fully static, so on-click navigation stays fast. */}
            {gallery.map((item) => (
              <Col key={item.slug} md={3} sm={6} xs={6}>
                <Link href={`/artworks/${item.slug}?seed=0000`} prefetch={false}>
                  <div className={styles.galleryCard}>
                    <h4 className={item.white ? styles.white : undefined}>
                      {item.name}
                    </h4>
                    <GalleryDoodle item={item} />
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
