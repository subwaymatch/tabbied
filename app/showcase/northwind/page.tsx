import type { Metadata } from 'next';
import { maze } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'northwind')!;

export const metadata: Metadata = {
  title: "Northwind — Outdoor apparel brand",
  description: "Hard-wearing layers for long days above the treeline, guaranteed for life.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={maze} />;
}
