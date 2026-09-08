import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import StudioHeader from 'components/studio/StudioHeader';
import StudioPreview from 'components/studio/StudioPreview';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Preview - Studio',
  description:
    'A generated direction applied to the template it was built on, ready to download.',
};

export default function StudioPreviewPage() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <StudioHeader
        backHref="/studio"
        backLabel="Back to the description"
        title="Preview"
      />

      {/* The generation id and the direction index arrive in the query string,
          so everything below reads useSearchParams and needs a boundary to
          prerender behind. */}
      <Suspense>
        <StudioPreview />
      </Suspense>
    </div>
  );
}
