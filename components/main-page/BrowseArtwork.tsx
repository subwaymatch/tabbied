import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'components/layout';
import styles from './BrowseArtwork.module.css';

const gallery = [
  { slug: 'radius', name: 'Radius', thumb: 'thumb_radius', white: true },
  { slug: 'mixtape', name: 'Mixtape', thumb: 'thumb_mixtape' },
  { slug: 'odessa', name: 'Odessa', thumb: 'thumb_odessa', white: true },
  { slug: 'symmetry', name: 'Symmetry', thumb: 'thumb_symmetry' },
  { slug: 'veil', name: 'Veil', thumb: 'thumb_veil' },
  { slug: 'blossom', name: 'Blossom', thumb: 'thumb_blossom', white: true },
  { slug: 'disque', name: 'Disque', thumb: 'thumb_disque' },
];

export default function BrowseArtworkSection() {
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
              <Link href={`/artwork/${item.slug}/`}>
                <div className={styles.galleryCard}>
                  <h4 className={item.white ? styles.white : undefined}>
                    {item.name}
                  </h4>
                  <Image
                    src={`/images/${item.thumb}.png`}
                    alt={item.name}
                    width={800}
                    height={800}
                  />
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
