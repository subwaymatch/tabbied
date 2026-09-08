import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import StudioHeader from 'components/studio/StudioHeader';
import StudioSite from 'components/studio/StudioSite';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Your site - Studio',
  description: 'A generated website on the template it was built on.',
  robots: { index: false, follow: false },
};

export default function StudioSitePage() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <StudioHeader backHref="/account" backLabel="Back to your sites" title="Your site" />

      {/* The site id arrives in the query string, so everything below reads
          useSearchParams and needs a boundary to prerender behind. */}
      <Suspense>
        <StudioSite />
      </Suspense>
    </div>
  );
}
