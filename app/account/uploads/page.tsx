import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AccountPage from 'components/account/AccountPage';
import UploadsPanel from 'components/account/UploadsPanel';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Pictures - Tabbied',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <AccountPage
        title="Pictures"
        lede="Your reference pictures. Studio draws on them when it makes imagery for a site."
      >
        <UploadsPanel />
      </AccountPage>
    </div>
  );
}
