import type { Metadata } from 'next';
import { petal, blossom, spark, confetti } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'solstice')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { petal, blossom, spark, confetti };

export const metadata: Metadata = {
  title: "Solstice, Yoga & wellness retreat",
  description: "Seven-day coastal yoga and breath-work retreats for small groups.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
