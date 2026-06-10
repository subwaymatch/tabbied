import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'components/layout';
import { getGalleryItems } from 'lib/artwork';
import GalleryDoodle from 'components/select-artwork-page/GalleryDoodle';
import styles from './BrowseArtwork.module.css';

// The homepage shows the first handful of designs (galleryOrder 1–7); the full
// set lives behind the "View All" card on the select-artwork page.
const BROWSE_COUNT = 7;

export default async function BrowseArtworkSection() {
  const gallery = (await getGalleryItems()).slice(0, BROWSE_COUNT);

  return (
    <div id="section-browse-artwork" className={styles.browseArtworkSection}>
      <Container>
        <Row>
          <Col md={12}>
            <span className={styles.subheading}>Browse artwork</span>
            <h3 className="section-title">Pick a design and start doodling</h3>
          </Col>
        </Row>
      </Container>

      <Container fluidOnMobile>
        <Row noGutter>
          {gallery.map((item) => (
            <Col key={item.slug} md={3} sm={6}>
              {/* The seed param matches the select-artwork links: the editor
                  only mirrors customizations into the URL (making them
                  shareable and refresh-safe) when the URL already carries a
                  query param. */}
              <Link href={`/artwork/${item.slug}?seed=0000`}>
                <div className={styles.galleryCard}>
                  <h4 className={item.white ? styles.white : undefined}>
                    {item.name}
                  </h4>
                  <GalleryDoodle item={item} />
                </div>
              </Link>
            </Col>
          ))}

          <Col md={3} sm={6}>
            <Link href="/select-artwork/">
              <div className={styles.galleryCard}>
                <Image
                  src="/images/thumb_empty.png"
                  alt="View All"
                  width={800}
                  height={800}
                />
                <div className={styles.center}>
                  <span className={styles.text}>View All &#8594;</span>
                </div>
              </div>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
