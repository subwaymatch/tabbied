import type { Metadata } from 'next';
import { maze, switchback, elbow, lattice } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'northwind')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { maze, switchback, elbow, lattice };

export const metadata: Metadata = {
  title: "Northwind — Outdoor apparel brand",
  description: "Hard-wearing layers for long days above the treeline, guaranteed for life.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
