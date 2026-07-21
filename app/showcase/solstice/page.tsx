import type { Metadata } from 'next';
import { petal } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'solstice')!;

export const metadata: Metadata = {
  title: "Solstice — Yoga & wellness retreat",
  description: "Seven-day coastal yoga and breath-work retreats for small groups.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={petal} />;
}
