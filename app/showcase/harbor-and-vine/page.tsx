import type { Metadata } from 'next';
import { quilt } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'harbor-and-vine')!;

export const metadata: Metadata = {
  title: "Harbor & Vine — Natural wine bar",
  description: "A harbourside bar pouring small-grower, low-intervention wine.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={quilt} />;
}
