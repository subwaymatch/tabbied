import type { Metadata } from 'next';
import { metro } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'seabright')!;

export const metadata: Metadata = {
  title: "Seabright — Coastal skincare line",
  description: "Mineral-rich, reef-safe skincare made in small batches on the coast.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={metro} />;
}
