import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AccountPage from 'components/account/AccountPage';
import YourSites from 'components/account/YourSites';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Custom sites - Tabbied',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <AccountPage
        title="Custom sites"
        lede="Every template you have customized and every website Studio has made for you, newest first. Open one to keep changing it."
        action={{ href: '/templates', label: '+ Create new site' }}
      >
        <YourSites />
      </AccountPage>
    </div>
  );
}
