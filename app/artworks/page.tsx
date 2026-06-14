import type { Metadata } from 'next';
import PageHeader from 'components/PageHeader';
import SelectArtwork from 'components/select-artwork-page/SelectArtwork';
import Footer from 'components/Footer';
import { getGalleryItems } from 'lib/artwork';

export const metadata: Metadata = {
  title: 'Make your art - Tabbied',
};

export default async function SelectArtworkPage() {
  const gallery = await getGalleryItems();

  return (
    <>
      <PageHeader title="Make your art" />

      <SelectArtwork gallery={gallery} />

      <Footer />
    </>
  );
}
