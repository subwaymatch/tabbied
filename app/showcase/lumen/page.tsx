import type { Metadata } from 'next';
import { spectrum } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'lumen')!;

export const metadata: Metadata = {
  title: "Lumen — Design & technology conference",
  description: "Three days on the edges of design, code, and craft. Lisbon, June 2026.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={spectrum} />;
}
