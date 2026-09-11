import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TEMPLATE_SITES } from 'components/template/templateData';
import { NEW_TEMPLATE_SITES } from 'lib/templateSites';
import TemplatePreview from 'components/template/TemplatePreview';

// A template, framed: the live page in a browser chrome under a bar with the
// two things a person does with a template - customize it, or download it as
// it is. The page itself stays at /template/<slug>/, unframed, which is what
// the packager derives the download from; this route adds chrome *around*
// it, so nothing here can end up inside a download.

type Entry = { slug: string; name: string; topic: string };

const ENTRIES: Entry[] = [
  ...TEMPLATE_SITES.map((site) => ({ slug: site.slug, name: site.brand, topic: site.topic })),
  ...NEW_TEMPLATE_SITES.map((site) => ({ slug: site.slug, name: site.name, topic: site.topic })),
];

export const dynamicParams = false;

export function generateStaticParams() {
  return ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = ENTRIES.find((candidate) => candidate.slug === slug);

  return {
    title: entry ? `${entry.name} - Template preview - Tabbied` : 'Template preview - Tabbied',
    description: entry
      ? `${entry.name}, a ${entry.topic.toLowerCase()} website template built on a Tabbied pattern. Customize its colours and patterns, or download it as it is.`
      : undefined,
  };
}

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = ENTRIES.find((candidate) => candidate.slug === slug);

  if (!entry) notFound();

  return <TemplatePreview slug={entry.slug} name={entry.name} topic={entry.topic} />;
}
