'use client';

import { useEffect, useState } from 'react';
import styles from './ReactDocs.module.css';

export type DocsSection = { id: string; label: string };

// "On this page" navigation with a scroll-spy highlight. Renders as a sticky
// sidebar on desktop and a horizontally scrollable pill row on smaller
// screens (see ReactDocs.module.css).
export default function DocsNav({ sections }: { sections: DocsSection[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) {
      return;
    }

    // The active section is the last heading above the top quarter of the
    // viewport — cheap to compute on the observer's intersection edges.
    const observer = new IntersectionObserver(
      () => {
        const line = window.innerHeight * 0.25;
        let current: string | null = headings[0].id;

        for (const heading of headings) {
          if (heading.getBoundingClientRect().top <= line) {
            current = heading.id;
          }
        }

        setActiveId(current);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: [0, 1] }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className={styles.docsNav} aria-label="On this page">
      <p className={styles.docsNavTitle}>On this page</p>
      <ul className={styles.docsNavList}>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={
                activeId === id
                  ? `${styles.docsNavLink} ${styles.docsNavLinkActive}`
                  : styles.docsNavLink
              }
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
