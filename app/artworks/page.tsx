import type { Metadata } from 'next';
import MainHeader from 'components/main-page/MainHeader';
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
      <MainHeader />

      <SelectArtwork gallery={gallery} />

      <Footer />
    </>
  );
}
