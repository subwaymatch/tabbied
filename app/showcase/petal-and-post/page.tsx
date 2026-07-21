import type { Metadata } from 'next';
import { frond } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'petal-and-post')!;

export const metadata: Metadata = {
  title: "Petal & Post — Florist & stationery studio",
  description: "Seasonal blooms and hand-printed letterpress cards, delivered locally.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={frond} />;
}
