import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AccountOverview from 'components/account/AccountOverview';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Account - Tabbied',
  // Account pages have nothing to offer a search engine and everything to
  // lose from being indexed under a half-dozen near-identical titles.
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <AccountOverview />
    </div>
  );
}
