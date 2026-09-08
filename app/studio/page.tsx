import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import { TEMPLATE_COUNT } from 'lib/siteCounts';
import StudioHeader from 'components/studio/StudioHeader';
import StudioForm from 'components/studio/StudioForm';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Studio - Tabbied',
  description: `Describe your business and Studio matches it to three of Tabbied's ${TEMPLATE_COUNT} template sites, each one complete and ready to download.`,
};

export default function StudioPage() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <div className={`${styles.rule} ${styles.ruleLeft}`} aria-hidden="true" />
      <div className={`${styles.rule} ${styles.ruleRight}`} aria-hidden="true" />

      <StudioHeader backHref="/" backLabel="Back to the homepage" />

      <StudioForm templateCount={TEMPLATE_COUNT} />
    </div>
  );
}
