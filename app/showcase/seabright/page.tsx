import type { Metadata } from 'next';
import { metro, wavelet, ring, quoit } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'seabright')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { metro, wavelet, ring, quoit };

export const metadata: Metadata = {
  title: "Seabright — Coastal skincare line",
  description: "Mineral-rich, reef-safe skincare made in small batches on the coast.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
