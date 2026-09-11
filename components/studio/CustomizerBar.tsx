'use client';

// The customizer's top bar: the way back, Save, Download, and the person.
//
// Download is a menu because there are two packages and they are not the
// same thing. The static package is rebuilt in the browser with the site's
// colours and patterns in it (lib/studioDownload.ts); the React package is the
// template's source, which the customizer's document cannot be applied to,
// and the menu says so rather than implying otherwise.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu } from '@base-ui-components/react/menu';
import { initials } from 'components/account/AccountHeader';
import { signOut, useSessionUser } from 'lib/authClient';
import styles from './CustomizerBar.module.css';

export type SaveState = 'clean' | 'dirty' | 'saving' | 'saved';

const SAVE_LABEL: Record<SaveState, string> = {
  clean: 'No changes to save',
  dirty: 'Save changes',
  saving: 'Saving...',
  saved: 'Saved to your custom sites',
};

export default function CustomizerBar({
  mine,
  saveState,
  onSave,
  downloading,
  onDownloadHtml,
  reactHref,
}: {
  /** The viewer owns the site: Save is shown and the way back is the account. */
  mine: boolean;
  saveState: SaveState;
  onSave: () => void;
  downloading: boolean;
  onDownloadHtml: () => void;
  reactHref: string;
}) {
  const { user, isPending } = useSessionUser();
  const router = useRouter();

  return (
    <header className={styles.bar}>
      <Link
        href={mine ? '/account/sites/' : '/templates'}
        prefetch={false}
        className={styles.back}
        aria-label={mine ? 'Back to your sites' : 'Back to the templates'}
      >
        <span className={styles.backCircle} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 5.5 8 12l6.5 6.5" />
          </svg>
        </span>
        <span className={styles.backLabel}>{mine ? 'My account' : 'Templates'}</span>
      </Link>

      <div className={styles.actions}>
        {mine ? (
          <button
            type="button"
            className={styles.save}
            disabled={saveState !== 'dirty'}
            onClick={onSave}
          >
            {SAVE_LABEL[saveState]}
          </button>
        ) : null}

        <Menu.Root>
          <Menu.Trigger className={styles.download} disabled={downloading}>
            {downloading ? 'Preparing...' : 'Download'}
            <span className={styles.chevron} aria-hidden="true">
              &#9662;
            </span>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner className={styles.positioner} side="bottom" align="end" sideOffset={10}>
              <Menu.Popup className={styles.menu}>
                <div className={styles.menuHead}>Includes your colours and patterns</div>
                <Menu.Item className={styles.option} onClick={onDownloadHtml}>
                  <span className={styles.optionTitle}>Static HTML and CSS</span>
                  <span className={styles.optionNote}>One folder, drop on any host</span>
                </Menu.Item>
                <Menu.Separator className={styles.menuRule} />
                <div className={styles.menuHead}>The template as authored</div>
                <Menu.Item
                  className={styles.option}
                  render={<a href={reactHref} download />}
                >
                  <span className={styles.optionTitle}>React project</span>
                  <span className={styles.optionNote}>
                    Source components; your colours and patterns are not applied here yet
                  </span>
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        {user ? (
          <Menu.Root>
            <Menu.Trigger className={styles.avatar} aria-label="Account menu">
              {initials(user.name, user.email)}
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner className={styles.positioner} side="bottom" align="end" sideOffset={10}>
                <Menu.Popup className={styles.menu}>
                  <div className={styles.menuEmail}>{user.email}</div>
                  <Menu.Separator className={styles.menuRule} />
                  <Menu.Item className={styles.menuItem} render={<Link href="/account/" prefetch={false} />}>
                    My account
                  </Menu.Item>
                  <Menu.Item className={styles.menuItem} render={<Link href="/account/sites/" prefetch={false} />}>
                    Custom sites
                  </Menu.Item>
                  <Menu.Item className={styles.menuItem} render={<Link href="/account/settings/" prefetch={false} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Separator className={styles.menuRule} />
                  <Menu.Item
                    className={styles.menuItem}
                    onClick={async () => {
                      await signOut();
                      router.push('/');
                    }}
                  >
                    Sign out
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        ) : isPending ? (
          <span className={styles.avatarGhost} aria-hidden="true" />
        ) : (
          <Link href="/sign-in?next=%2Faccount" className={styles.signIn} prefetch={false}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
