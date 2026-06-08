import type { Metadata } from 'next';
import PageHeader from 'components/PageHeader';
import SelectArtwork from 'components/select-artwork-page/SelectArtwork';

export const metadata: Metadata = {
  title: 'Make your art - Tabbied',
};

export default function SelectArtworkPage() {
  return (
    <>
      <PageHeader title="Make your art" />

      <SelectArtwork />
    </>
  );
}
