import { Suspense } from 'react';
import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import { STUDIO_ENTRIES } from 'lib/studioDirections';
import StudioHeader from 'components/studio/StudioHeader';
import StudioResults from 'components/studio/StudioResults';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Your websites - Studio',
  description:
    'Three template sites matched to your description, each ready to preview and download.',
};

export default function StudioResultsPage() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      {/* No column rules here: they mark Studio's 720px writing measure, and
          the results grid is wider than that - drawn at this width they would
          fall through the middle of the cards. */}
      <StudioHeader
        backHref="/studio"
        backLabel="Back to the description"
        title="Your websites"
      />

      {/* The description arrives in the query string, so the matching component
          reads useSearchParams and needs a boundary to prerender behind. */}
      <Suspense>
        <StudioResults entries={STUDIO_ENTRIES} />
      </Suspense>
    </div>
  );
}
