import type { Metadata } from 'next';
import { prisma } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'facet')!;

export const metadata: Metadata = {
  title: "Facet — Fine jewelry brand",
  description: "Fine jewelry built around a single remarkable, traceable stone.",
};

export default function Page() {
  return <ShowcaseSite site={site} artwork={prisma} />;
}
