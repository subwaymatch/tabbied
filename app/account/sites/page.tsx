import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AccountPage from 'components/account/AccountPage';
import YourSites from 'components/account/YourSites';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Your sites - Tabbied',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <AccountPage
        title="Your sites"
        lede="Every website Studio has made for you, newest first. Open one to keep editing it."
          action={{ href: '/studio', label: '+ New Studio request' }}
      >
        <YourSites />
      </AccountPage>
    </div>
  );
}
