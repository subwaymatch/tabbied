import type { Metadata } from 'next';
import { windowpane, chamfer, awning, merlon } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'ember-and-oak')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { windowpane, chamfer, awning, merlon };

export const metadata: Metadata = {
  title: "Ember & Oak — Wood-fire restaurant",
  description: "A single wood-fired hearth and a menu that changes with the market.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
