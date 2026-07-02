'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog } from '@base-ui-components/react/dialog';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import { Container, Row, Col } from 'components/layout';
import LogoDoodle from './LogoDoodle';
import styles from './MainHeader.module.css';

// lucide-react dropped its GitHub brand glyph, so the mark is inlined here.
function GithubIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const navItems = [
  { href: '/artworks', label: 'Browse Artworks' },
  { href: '/docs/react', label: 'Docs' },
];

// The site is a static export with `trailingSlash: true`, so the live pathname
// is "/artworks/" while a nav href is "/artworks". Strip any trailing slash
// (keeping "/" itself) before comparing so the active item resolves either way.
function normalizePath(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

// The shared site header — logo, page navigation, and GitHub link — reused on
// every route except the individual artwork editor (which has its own header).
export default function MainHeader() {
  const currentPath = normalizePath(usePathname() ?? '/');

  return (
    <header className={styles.headerSection}>
      <Container>
        <Row align="center">
          <Col xs={4} className={styles.logoColumn}>
            <Link
              href="/"
              className={styles.logoImageWrapper}
              aria-label="Tabbied"
              prefetch={false}
            >
              <LogoDoodle />
            </Link>
          </Col>

          {/* Grows to fill all space between the logo and the GitHub icon so
              the nav lays out on a single row (see MainHeader.module.css). */}
          <Col className={styles.navColumn}>
            <ul className={styles.pageNavigation}>
              {navItems.map((item) => {
                const isActive = currentPath === item.href;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      className={isActive ? styles.active : undefined}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Col>

          <Col xs={8} className={styles.actionsColumn}>
            <div className={styles.actions}>
              {/* Desktop keeps the GitHub icon in the header; below 992px it
                  moves into the drawer (see Dialog below). */}
              <a
                href="https://github.com/subwaymatch/tabbied/"
                className={`${styles.githubLink} ${styles.headerGithub}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Tabbied on GitHub"
              >
                <GithubIcon size={24} />
              </a>

              {/* Hamburger opens a slide-in drawer — the only way to reach the
                  nav (and GitHub) below 992px, where .navColumn is hidden. The
                  trigger is hidden again at >=992px where the inline nav shows. */}
              <Dialog.Root>
                <Dialog.Trigger
                  className={styles.menuTrigger}
                  aria-label="Open navigation menu"
                >
                  <MenuIcon size={26} aria-hidden="true" />
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Backdrop className={styles.drawerBackdrop} />
                  <Dialog.Popup className={styles.drawerPopup}>
                    <div className={styles.drawerHeader}>
                      <Dialog.Title className={styles.drawerTitle}>
                        Menu
                      </Dialog.Title>
                      <Dialog.Close
                        className={styles.drawerClose}
                        aria-label="Close menu"
                      >
                        <CloseIcon size={24} aria-hidden="true" />
                      </Dialog.Close>
                    </div>

                    <nav className={styles.drawerNav}>
                      {navItems.map((item) => {
                        const isActive = currentPath === item.href;

                        return (
                          <Dialog.Close
                            key={item.label}
                            className={
                              isActive
                                ? `${styles.drawerLink} ${styles.drawerLinkActive}`
                                : styles.drawerLink
                            }
                            render={
                              <Link
                                href={item.href}
                                prefetch={false}
                                aria-current={isActive ? 'page' : undefined}
                              />
                            }
                          >
                            {item.label}
                          </Dialog.Close>
                        );
                      })}
                    </nav>

                    <Dialog.Close
                      className={styles.drawerGithub}
                      render={
                        <a
                          href="https://github.com/subwaymatch/tabbied/"
                          target="_blank"
                          rel="noreferrer"
                        />
                      }
                    >
                      <GithubIcon size={22} />
                      <span>GitHub</span>
                    </Dialog.Close>
                  </Dialog.Popup>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
