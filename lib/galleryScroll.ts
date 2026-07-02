// Shared keys + helper for restoring the gallery's scroll position when the
// user returns from an artwork editor via "Back to gallery".
//
// The App Router does not restore window scroll on these back/forward SPA
// navigations (and the browser's native restoration only applies to full
// document loads), so the gallery persists its own scroll position and the
// editor header arms a one-shot restore before navigating back.
export const GALLERY_SCROLL_Y = 'tabbied:gallery-scroll-y';
export const GALLERY_SCROLL_RESTORE = 'tabbied:gallery-scroll-restore';

export const GALLERY_NAVIGATION = 'tabbied:navigated-from-gallery';

// Called from the editor's back control just before navigating, so the gallery
// knows to restore (rather than reset) its scroll on the next mount.
export function armGalleryScrollRestore(): void {
  try {
    sessionStorage.setItem(GALLERY_SCROLL_RESTORE, '1');
  } catch {
    // sessionStorage can throw in private mode / sandboxed frames; restoring
    // the scroll position is best-effort, so a failure here is non-fatal.
  }
}

// Called when a gallery card is clicked, so the editor it opens knows the
// previous history entry really is the gallery.
export function markGalleryNavigation(): void {
  try {
    sessionStorage.setItem(GALLERY_NAVIGATION, '1');
  } catch {
    // Best-effort, same as above.
  }
}

// One-shot read of the marker (consumed on the editor's mount). Without it,
// "Back to gallery" must not use history.back() — the previous entry could be
// anything (a search result, another site) when the editor was deep-linked.
export function consumeGalleryNavigation(): boolean {
  try {
    const marked = sessionStorage.getItem(GALLERY_NAVIGATION) === '1';

    sessionStorage.removeItem(GALLERY_NAVIGATION);

    return marked;
  } catch {
    return false;
  }
}
