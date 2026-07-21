import type { Metadata } from 'next';
import { windowpane } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'ember-and-oak')!;

export const metadata: Metadata = {
  title: "Ember & Oak — Wood-fire restaurant",
  description: "A single wood-fired hearth and a menu that changes with the market.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={windowpane} />;
}
