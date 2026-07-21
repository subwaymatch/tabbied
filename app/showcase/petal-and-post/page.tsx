import type { Metadata } from 'next';
import { frond, foliage, blossom, petal } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'petal-and-post')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { frond, foliage, blossom, petal };

export const metadata: Metadata = {
  title: "Petal & Post, Florist & stationery studio",
  description: "Seasonal blooms and hand-printed letterpress cards, delivered locally.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
