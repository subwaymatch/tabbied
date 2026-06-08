import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'components/layout';
import styles from './SelectArtwork.module.css';

type GalleryItem = {
  slug: string;
  name: string;
  thumb: string;
  /** Render the title in white for dark thumbnails. */
  white?: boolean;
};

const gallery: GalleryItem[] = [
  { slug: 'radius', name: 'Radius', thumb: 'thumb_radius', white: true },
  { slug: 'mixtape', name: 'Mixtape', thumb: 'thumb_mixtape' },
  { slug: 'odessa', name: 'Odessa', thumb: 'thumb_odessa', white: true },
  { slug: 'symmetry', name: 'Symmetry', thumb: 'thumb_symmetry' },
  { slug: 'veil', name: 'Veil', thumb: 'thumb_veil' },
  { slug: 'blossom', name: 'Blossom', thumb: 'thumb_blossom', white: true },
  { slug: 'disque', name: 'Disque', thumb: 'thumb_disque' },
  { slug: 'bloks', name: 'Bloks', thumb: 'thumb_bloks' },
  { slug: 'terrain', name: 'Terrain', thumb: 'thumb_terrain', white: true },
  { slug: 'trigram', name: 'Trigram', thumb: 'thumb_trigram', white: true },
  { slug: 'ring', name: 'Ring', thumb: 'thumb_ring', white: true },
];

export default function SelectArtwork() {
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
                      src={`/images/${item.thumb}.png`}
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
