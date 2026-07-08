import { Container, Row, Col } from 'components/layout';
import type { GalleryItem } from 'lib/artwork';
import BrandPaletteBar from './BrandPaletteBar';
import GalleryCard from './GalleryCard';
import GalleryScrollRestorer from './GalleryScrollRestorer';
import styles from './SelectArtwork.module.css';

export default function SelectArtwork({
  gallery,
}: {
  gallery: GalleryItem[];
}) {
  return (
    <main className={styles.selectArtworkSection}>
      <GalleryScrollRestorer />
      <div className={styles.grayBackground}>
        <Container>
          <Row>
            <Col>
              <h1>First, pick a pre-made design from our gallery.</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <BrandPaletteBar />
            </Col>
          </Row>
        </Container>

        <Container fluidOnMobile>
          <Row noGutter className={styles.galleryGrid}>
            {/* Each card is a client component: its Link keeps prefetch off
                (with 150+ cards, viewport prefetching would fire an RSC
                payload request per card scrolled past — by far the page's
                largest source of Vercel edge requests; the editor pages are
                fully static, so on-click navigation stays fast) and its
                preview follows the selected brand palette. */}
            {gallery.map((item) => (
              <Col key={item.slug} md={3} sm={6} xs={6}>
                <GalleryCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </main>
  );
}
