import type { Metadata } from 'next';
import SelectArtwork from 'components/select-artwork-page/SelectArtwork';
import { getGalleryItems } from 'lib/artwork';

export const metadata: Metadata = {
  title: 'Make your art - Tabbied',
};

export default async function SelectArtworkPage() {
  const gallery = await getGalleryItems();

  return <SelectArtwork gallery={gallery} />;
}
