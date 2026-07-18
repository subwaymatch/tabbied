'use client';

import { useEffect, useState } from 'react';
import {
  createPaletteId,
  deletePalette,
  isValidPaletteColor,
  setDraftPreview,
  upsertPalette,
  type BrandPalette,
} from 'lib/brandPalettes';

// A palette being created or edited in the dialog. Colors are background
// (color0) first, then the inks; `transparent` is tracked separately so the
// background color survives toggling transparency on and off.
export type PaletteDraft = {
  id: string;
  name: string;
  colors: string[];
  transparent: boolean;
  /** Whether the draft edits an existing palette (shows Delete). */
  existing: boolean;
};

// The palette a "New palette" dialog starts from — Tabbied's own inks over a
// near-white background, so the editor never opens empty.
const STARTER_COLORS = ['#f8f9fa', '#232529', '#3e8bff', '#3fffb2', '#ff3d8b'];

// How long to wait after the last edit before recoloring the page's artworks,
// so dragging a color or typing a hex doesn't rerender every artwork per frame.
const PREVIEW_DEBOUNCE_MS = 160;

const draftFromPalette = (palette: BrandPalette): PaletteDraft => ({
  id: palette.id,
  name: palette.name,
  colors: [...palette.colors],
  transparent: palette.transparentBackground === true,
  existing: true,
});

const newDraft = (): PaletteDraft => ({
  id: createPaletteId(),
  name: '',
  colors: [...STARTER_COLORS],
  transparent: false,
  existing: false,
});

// The draft resolved for the live page preview: a transparent background paints
// as an actual `transparent` fill, and any mid-edit invalid hex falls back to a
// neutral so the recolored artworks always get a paintable color.
export const resolveDraftColors = (draft: PaletteDraft): string[] =>
  draft.colors.map((color, index) =>
    index === 0 && draft.transparent
      ? 'transparent'
      : isValidPaletteColor(color)
        ? color
        : '#888888'
  );

/**
 * Shared new/edit-palette editor state, used by both the gallery bar and the
 * individual artwork page. Owns the draft, its mutations, and the debounced
 * live-preview broadcast (B1) so the page's own artworks recolor as the palette
 * is edited. `onSaved` lets each host react to a saved palette (e.g. mark it
 * active, or apply it to the open artwork).
 */
export function usePaletteEditor({
  onSaved,
}: {
  onSaved?: (palette: BrandPalette) => void;
} = {}) {
  const [draft, setDraft] = useState<PaletteDraft | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  // Broadcast the draft's colors to the shared preview channel, debounced. When
  // the draft closes, clear it immediately so the page snaps back to its normal
  // palette.
  useEffect(() => {
    if (!draft) {
      setDraftPreview(null);
      return;
    }

    const colors = resolveDraftColors(draft);
    const timer = setTimeout(() => setDraftPreview(colors), PREVIEW_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [draft]);

  // Clear the preview if the host unmounts mid-edit.
  useEffect(() => () => setDraftPreview(null), []);

  const openEditor = (palette?: BrandPalette) => {
    setDraftError(null);
    setDraft(palette ? draftFromPalette(palette) : newDraft());
  };

  const closeEditor = () => setDraft(null);

  const setDraftColor = (index: number, value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            colors: prev.colors.map((color, i) => (i === index ? value : color)),
          }
        : prev
    );
  };

  // Reorder just the ink colors (a Fisher-Yates shuffle); the background stays
  // put. This is the dialog's "shuffle" affordance — it rearranges the palette
  // you already chose rather than rolling new random colors.
  const shuffleDraftOrder = () => {
    setDraft((prev) => {
      if (!prev) return prev;

      const inks = prev.colors.slice(1);

      for (let i = inks.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [inks[i], inks[j]] = [inks[j], inks[i]];
      }

      return { ...prev, colors: [prev.colors[0], ...inks] };
    });
  };

  const saveDraft = () => {
    if (!draft) return;

    // The name is optional — a nameless palette just shows its colors.
    const invalid = draft.colors.find((color) => !isValidPaletteColor(color));

    if (invalid !== undefined) {
      setDraftError(`"${invalid}" is not a valid hex color.`);
      return;
    }

    const palette: BrandPalette = {
      id: draft.id,
      name: draft.name,
      colors: draft.colors,
      transparentBackground: draft.transparent,
    };

    upsertPalette(palette);
    onSaved?.(palette);
    setDraft(null);
  };

  const removeDraftPalette = () => {
    if (!draft) return;

    deletePalette(draft.id);
    setDraft(null);
  };

  return {
    draft,
    setDraft,
    draftError,
    openEditor,
    closeEditor,
    setDraftColor,
    shuffleDraftOrder,
    saveDraft,
    removeDraftPalette,
  };
}
