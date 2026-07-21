import type { Metadata } from 'next';
import { bokeh } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'honeycomb')!;

export const metadata: Metadata = {
  title: "Honeycomb — Kids' learning app",
  description: "Bite-size, adaptive reading and number games for ages 4 to 9. No ads.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={bokeh} />;
}
