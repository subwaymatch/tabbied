import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllArtworkIds, getArtwork } from 'lib/artwork';
import EditArtwork from 'components/edit-artwork-page/EditArtwork';

// Replicates the old `getStaticPaths` with `fallback: false` — only the
// artwork ids known at build time are rendered, anything else 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = await getAllArtworkIds();

  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getArtwork(id);

  return {
    title: `Customize ${artwork.name}`,
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtwork(id);

  return (
    <Suspense>
      <EditArtwork artwork={artwork} />
    </Suspense>
  );
}
