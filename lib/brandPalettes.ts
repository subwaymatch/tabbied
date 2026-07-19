// Custom palettes: user-defined color palettes, persisted in localStorage, that
// can be applied globally to the /artworks gallery previews (and exported /
// imported as JSON so a brand's colors travel between machines and projects).
// (Named `brandPalettes` internally for storage-key stability; the UI calls
// them "custom palettes".)
//
// The whole feature state lives under one localStorage key so cross-tab sync
// is a single `storage` event. Same-tab consumers subscribe through
// useSyncExternalStore via subscribe/getSnapshot below.
'use client';

import { useSyncExternalStore } from 'react';
import {
  findLibraryPalette,
  isLibraryPaletteId,
  type LibraryPalette,
} from './paletteLibrary';

export type BrandPalette = {
  id: string;
  name: string;
  /** Colors, background (color0) first, then the inks. */
  colors: string[];
  /**
   * Render with a transparent background: the stored background color is kept
   * (so the toggle is reversible) but color0 resolves to transparent wherever
   * the palette is applied.
   */
  transparentBackground?: boolean;
};

export type BrandPaletteState = {
  palettes: BrandPalette[];
  /** null = artwork default palettes. */
  activePaletteId: string | null;
};

export const STORAGE_KEY = 'tabbied.brandPalettes.v1';

/** Palette size bounds: a background plus at least one ink. */
export const MIN_PALETTE_COLORS = 2;
export const MAX_PALETTE_COLORS = 12;

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const DEFAULT_STATE: BrandPaletteState = {
  palettes: [],
  activePaletteId: null,
};

export const isValidPaletteColor = (value: unknown): value is string =>
  typeof value === 'string' && HEX_COLOR.test(value.trim());

const isValidPalette = (value: unknown): value is BrandPalette => {
  if (typeof value !== 'object' || value === null) return false;

  const palette = value as Partial<BrandPalette>;

  return (
    typeof palette.id === 'string' &&
    palette.id.length > 0 &&
    // The name is optional — an empty string is valid (the palette then shows
    // as just its colors) — but it must still be a string when present.
    typeof palette.name === 'string' &&
    Array.isArray(palette.colors) &&
    palette.colors.length >= MIN_PALETTE_COLORS &&
    palette.colors.length <= MAX_PALETTE_COLORS &&
    palette.colors.every(isValidPaletteColor)
  );
};

const normalizePalette = (palette: BrandPalette): BrandPalette => ({
  id: palette.id,
  name: palette.name.trim(),
  colors: palette.colors.map((color) => color.trim().toLowerCase()),
  transparentBackground: palette.transparentBackground === true,
});

export const createPaletteId = (): string =>
  `bp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const listeners = new Set<() => void>();

// The parsed snapshot is cached so getSnapshot returns a stable reference
// between writes (useSyncExternalStore compares by identity).
let cache: BrandPaletteState | null = null;

const readState = (): BrandPaletteState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw) as Partial<BrandPaletteState>;
    const palettes = Array.isArray(parsed.palettes)
      ? parsed.palettes.filter(isValidPalette).map(normalizePalette)
      : [];
    // The active id may name a saved palette or a curated library palette
    // (both can be applied to the gallery previews), so accept either.
    const activePaletteId =
      typeof parsed.activePaletteId === 'string' &&
      (palettes.some((palette) => palette.id === parsed.activePaletteId) ||
        isLibraryPaletteId(parsed.activePaletteId))
        ? parsed.activePaletteId
        : null;

    return { palettes, activePaletteId };
  } catch {
    // Corrupt storage (hand-edited, quota weirdness) falls back to defaults
    // rather than breaking the gallery.
    return DEFAULT_STATE;
  }
};

const emit = () => {
  cache = null;

  for (const listener of listeners) listener();
};

const writeState = (next: BrandPaletteState) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private-mode / quota failures: the in-memory snapshot still updates so
    // the UI works for the session.
    cache = next;
    for (const listener of listeners) listener();
    return;
  }

  emit();
};

export const getBrandPaletteState = (): BrandPaletteState =>
  cache ?? (cache = readState());

const getServerSnapshot = (): BrandPaletteState => DEFAULT_STATE;

export const subscribeBrandPalettes = (listener: () => void): (() => void) => {
  listeners.add(listener);

  // Cross-tab updates arrive as `storage` events; attach once per subscriber
  // set. (Same-tab writes go through emit() directly — storage events don't
  // fire in the tab that wrote.)
  if (listeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
};

const handleStorage = (event: StorageEvent) => {
  if (event.key === null || event.key === STORAGE_KEY) emit();
};

/** React hook: the current brand-palette state, live across components/tabs. */
export function useBrandPalettes(): BrandPaletteState {
  return useSyncExternalStore(
    subscribeBrandPalettes,
    getBrandPaletteState,
    getServerSnapshot
  );
}

// ---------------------------------------------------------------------------
// Live draft preview (transient — never persisted)
// ---------------------------------------------------------------------------
// While the palette editor dialog is open, the page's own artworks recolor to
// the palette being edited. That live value is broadcast on its own channel
// (separate from the persisted store, so it never touches localStorage) and
// consumed by the gallery cards and the artwork preview. `null` = no draft
// open, so consumers fall back to their normal palette.
let draftPreview: string[] | null = null;
const draftPreviewListeners = new Set<() => void>();

export const setDraftPreview = (colors: string[] | null) => {
  draftPreview = colors;
  for (const listener of draftPreviewListeners) listener();
};

const subscribeDraftPreview = (listener: () => void): (() => void) => {
  draftPreviewListeners.add(listener);
  return () => draftPreviewListeners.delete(listener);
};

const getDraftPreview = (): string[] | null => draftPreview;
const getDraftPreviewServerSnapshot = (): string[] | null => null;

/** React hook: the live draft-preview colors, or null when no editor is open. */
export function useDraftPreview(): string[] | null {
  return useSyncExternalStore(
    subscribeDraftPreview,
    getDraftPreview,
    getDraftPreviewServerSnapshot
  );
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const upsertPalette = (palette: BrandPalette) => {
  const state = getBrandPaletteState();
  const normalized = normalizePalette(palette);

  if (!isValidPalette(normalized)) {
    throw new Error('Invalid palette: 2–12 hex colors are required.');
  }

  const existing = state.palettes.findIndex((p) => p.id === normalized.id);
  const palettes =
    existing >= 0
      ? state.palettes.map((p, i) => (i === existing ? normalized : p))
      : [...state.palettes, normalized];

  writeState({ ...state, palettes });
};

export const deletePalette = (id: string) => {
  const state = getBrandPaletteState();

  writeState({
    ...state,
    palettes: state.palettes.filter((palette) => palette.id !== id),
    activePaletteId: state.activePaletteId === id ? null : state.activePaletteId,
  });
};

export const setActivePalette = (id: string | null) => {
  const state = getBrandPaletteState();

  writeState({
    ...state,
    activePaletteId:
      id !== null &&
      (state.palettes.some((palette) => palette.id === id) ||
        isLibraryPaletteId(id))
        ? id
        : null,
  });
};

// A curated library palette adapted to the BrandPalette shape (library palettes
// never carry a transparent background) so the same resolvers/renderers apply.
const libraryAsBrand = (library: LibraryPalette): BrandPalette => ({
  id: library.id,
  name: library.name,
  colors: [...library.colors],
});

/**
 * The active palette resolved from the saved palettes first, then the curated
 * library — or null when the artwork's own colors apply.
 */
export const resolveActivePalette = (
  state: BrandPaletteState
): BrandPalette | null => {
  if (state.activePaletteId === null) return null;

  const saved = state.palettes.find(
    (palette) => palette.id === state.activePaletteId
  );

  if (saved) return saved;

  const library = findLibraryPalette(state.activePaletteId);

  return library ? libraryAsBrand(library) : null;
};


// ---------------------------------------------------------------------------
// JSON import / export
// ---------------------------------------------------------------------------

export type BrandPaletteExport = {
  version: 1;
  palettes: Array<
    Pick<BrandPalette, 'name' | 'colors' | 'transparentBackground'>
  >;
};

/** All saved palettes as a portable JSON document. */
export const exportPalettesJson = (): string => {
  const { palettes } = getBrandPaletteState();
  const doc: BrandPaletteExport = {
    version: 1,
    palettes: palettes.map(({ name, colors, transparentBackground }) => ({
      name,
      colors,
      ...(transparentBackground ? { transparentBackground: true } : {}),
    })),
  };

  return JSON.stringify(doc, null, 2);
};

// Accepts the export document, a bare array of palettes, or a single palette
// object — with or without ids (imported palettes always get fresh ids).
// Exact duplicates (same name + colors as a saved palette) are skipped.
export const importPalettesJson = (
  json: string
): { imported: number; skipped: number } => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Not valid JSON.');
  }

  const candidates: unknown[] = Array.isArray(parsed)
    ? parsed
    : typeof parsed === 'object' &&
        parsed !== null &&
        Array.isArray((parsed as BrandPaletteExport).palettes)
      ? (parsed as BrandPaletteExport).palettes
      : [parsed];

  const incoming: BrandPalette[] = [];

  for (const candidate of candidates) {
    const withId = {
      id: createPaletteId(),
      // Name is optional: a palette omitting it imports as nameless (colors
      // only). A `name` in the candidate overrides this default.
      name: '',
      ...(typeof candidate === 'object' && candidate !== null
        ? candidate
        : {}),
    } as BrandPalette;

    if (!isValidPalette(withId)) {
      throw new Error(
        'Each palette needs a "colors" array of 2–12 hex colors (background first); "name" is optional.'
      );
    }

    incoming.push(normalizePalette({ ...withId, id: createPaletteId() }));
  }

  if (incoming.length === 0) {
    throw new Error('No palettes found in the file.');
  }

  const state = getBrandPaletteState();
  const signature = (
    palette: Pick<BrandPalette, 'name' | 'colors' | 'transparentBackground'>
  ) =>
    `${palette.name.toLowerCase()}|${palette.colors.join(',')}|${
      palette.transparentBackground === true
    }`;
  const existing = new Set(state.palettes.map(signature));

  const fresh = incoming.filter((palette) => !existing.has(signature(palette)));

  if (fresh.length > 0) {
    writeState({ ...state, palettes: [...state.palettes, ...fresh] });
  }

  return { imported: fresh.length, skipped: incoming.length - fresh.length };
};

// ---------------------------------------------------------------------------
// Applying a brand palette to an artwork
// ---------------------------------------------------------------------------

/** The palette's colors with color0 resolved for rendering. */
export const resolvePaletteColors = (palette: BrandPalette): string[] =>
  palette.transparentBackground
    ? ['transparent', ...palette.colors.slice(1)]
    : [...palette.colors];

/**
 * The palette to hand to <TabbiedArtwork> for a gallery preview: the active
 * brand palette's colors, or undefined when the artwork defaults apply.
 */
export const previewPalette = (
  state: BrandPaletteState
): string[] | undefined => {
  const active = resolveActivePalette(state);

  return active ? resolvePaletteColors(active) : undefined;
};
