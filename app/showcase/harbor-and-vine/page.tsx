import type { Metadata } from 'next';
import { quilt, lattice, tesserae, domino } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'harbor-and-vine')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { quilt, lattice, tesserae, domino };

export const metadata: Metadata = {
  title: "Harbor & Vine — Natural wine bar",
  description: "A harbourside bar pouring small-grower, low-intervention wine.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
