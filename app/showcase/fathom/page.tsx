import type { Metadata } from 'next';
import { lattice, wavelet, ring, quoit } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'fathom')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { lattice, wavelet, ring, quoit };

export const metadata: Metadata = {
  title: "Fathom — Ocean research nonprofit",
  description: "Funding open ocean expeditions and publishing every reading as open data.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
