import type { Metadata } from 'next';
import { lattice } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'fathom')!;

export const metadata: Metadata = {
  title: "Fathom — Ocean research nonprofit",
  description: "Funding open ocean expeditions and publishing every reading as open data.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={lattice} />;
}
