import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AccountPage from 'components/account/AccountPage';
import UsagePanel from 'components/account/UsagePanel';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Usage - Tabbied',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <AccountPage
        title="Usage"
        lede="What you have spent today against each cap, and the recent ledger."
      >
        <UsagePanel />
      </AccountPage>
    </div>
  );
}
