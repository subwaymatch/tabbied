// Shared keys + helper for restoring the gallery's scroll position when the
// user returns from an artwork editor via "Back to gallery".
//
// The App Router does not restore window scroll on these back/forward SPA
// navigations (and the browser's native restoration only applies to full
// document loads), so the gallery persists its own scroll position and the
// editor header arms a one-shot restore before navigating back.
export const GALLERY_SCROLL_Y = 'tabbied:gallery-scroll-y';
export const GALLERY_SCROLL_RESTORE = 'tabbied:gallery-scroll-restore';

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
