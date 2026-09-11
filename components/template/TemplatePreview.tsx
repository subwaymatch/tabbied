'use client';

// A template in a frame, with the two things to do with it.
//
// Customize is a link, not a call: /studio/customize/ makes the site (and
// handles signing in first), so this page holds no session logic beyond the
// avatar. Download is a menu because there are two packages and both are the
// template as authored - the note in the menu says so, since the customizer's
// download menu says something different.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu } from '@base-ui-components/react/menu';
import { initials } from 'components/account/AccountHeader';
import { signOut, useSessionUser } from 'lib/authClient';
import { plexMono } from 'lib/fonts';
import styles from './TemplatePreview.module.css';

export default function TemplatePreview({
  slug,
  name,
  topic,
}: {
  slug: string;
  name: string;
  topic: string;
}) {
  const { user, isPending } = useSessionUser();
  const router = useRouter();

  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <header className={styles.bar}>
        <Link href="/templates" prefetch={false} className={styles.back} aria-label="All templates">
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
          <span className={styles.backLabel}>Websites</span>
        </Link>

        <div className={styles.meta}>
          <span className={styles.name}>{name}</span>
          <span className={styles.topic}>{topic}</span>
        </div>

        <div className={styles.actions}>
          <Link
            href={`/studio/customize/?slug=${slug}`}
            prefetch={false}
            className={styles.customize}
          >
            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16.4 3.9a1.9 1.9 0 0 1 2.7 2.7L8.2 17.5l-3.7 1 1-3.7z" />
            </svg>
            Customize
          </Link>

          <Menu.Root>
            <Menu.Trigger className={styles.download}>
              Download
              <span className={styles.chevron} aria-hidden="true">
                &#9662;
              </span>
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner className={styles.positioner} side="bottom" align="end" sideOffset={10}>
                <Menu.Popup className={styles.menu}>
                  <div className={styles.menuHead}>Free, no account needed</div>
                  <Menu.Item
                    className={styles.option}
                    render={<a href={`/downloads/${slug}-html.zip`} download />}
                  >
                    <span className={styles.optionTitle}>Static HTML and CSS</span>
                    <span className={styles.optionNote}>One folder, drop on any host</span>
                  </Menu.Item>
                  <Menu.Item
                    className={styles.option}
                    render={<a href={`/downloads/${slug}-react.zip`} download />}
                  >
                    <span className={styles.optionTitle}>React project</span>
                    <span className={styles.optionNote}>Components, ready for a repo</span>
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
          ) : null}
        </div>
      </header>

      <div className={styles.stage}>
        <div className={styles.frame}>
          <div className={styles.chrome}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.pill}>tabbied.com/template/{slug}/</span>
            <a className={styles.open} href={`/template/${slug}/`}>
              Open the page
            </a>
          </div>
          <iframe
            className={styles.iframe}
            src={`/template/${slug}/`}
            title={`${name} - the ${topic.toLowerCase()} template`}
          />
        </div>
      </div>
    </div>
  );
}
