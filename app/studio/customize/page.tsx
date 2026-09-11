import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import StudioCustomize from 'components/studio/StudioCustomize';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Customize a template - Tabbied',
  robots: { index: false, follow: false },
};

export default function StudioCustomizePage() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      {/* The template slug arrives in the query string, so the component reads
          useSearchParams and needs a boundary to prerender behind. */}
      <Suspense>
        <StudioCustomize />
      </Suspense>
    </div>
  );
}
