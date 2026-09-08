import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import StudioHeader from 'components/studio/StudioHeader';
import SiteShare from 'components/studio/SiteShare';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Shared site - Studio',
  description: 'A website made in Tabbied Studio.',
  robots: { index: false, follow: false },
};

export default function SharePage() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <StudioHeader backHref="/studio" backLabel="Make your own in Studio" title="Shared" />
      <Suspense>
        <SiteShare />
      </Suspense>
    </div>
  );
}
