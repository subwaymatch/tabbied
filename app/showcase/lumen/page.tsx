import type { Metadata } from 'next';
import { spectrum, prisma, bokeh, spark } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'lumen')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { spectrum, prisma, bokeh, spark };

export const metadata: Metadata = {
  title: "Lumen — Design & technology conference",
  description: "Three days on the edges of design, code, and craft. Lisbon, June 2026.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
