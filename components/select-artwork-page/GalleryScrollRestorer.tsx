'use client';

import { useEffect } from 'react';
import {
  GALLERY_SCROLL_Y,
  GALLERY_SCROLL_RESTORE,
} from 'lib/galleryScroll';

// Persists the gallery's scroll position and restores it when the user returns
// via the editor's "Back to gallery" control. Rendered (invisibly) inside the
// gallery so it only tracks scrolling while the gallery is mounted.
export default function GalleryScrollRestorer() {
  useEffect(() => {
    // Restore only when arming flag is set (i.e. arrived via "Back to
    // gallery"); a fresh visit still starts at the top.
    try {
      if (sessionStorage.getItem(GALLERY_SCROLL_RESTORE)) {
        sessionStorage.removeItem(GALLERY_SCROLL_RESTORE);
        const y = Number(sessionStorage.getItem(GALLERY_SCROLL_Y) ?? '0');
        if (y > 0) {
          // The grid is fixed-aspect-ratio, so the document is already its full
          // height on mount; a frame's wait keeps the scroll out of layout.
          requestAnimationFrame(() => window.scrollTo(0, y));
        }
      }
    } catch {
      // Ignore unavailable sessionStorage — restoring is best-effort.
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(GALLERY_SCROLL_Y, String(window.scrollY));
        } catch {
          // Ignore unavailable sessionStorage.
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
