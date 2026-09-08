import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import AccountPage from 'components/account/AccountPage';
import SettingsPanel from 'components/account/SettingsPanel';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Settings - Tabbied',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <AccountPage
        title="Settings"
        lede="Your name, your password, and the one thing that cannot be undone."
      >
        <SettingsPanel />
      </AccountPage>
    </div>
  );
}
