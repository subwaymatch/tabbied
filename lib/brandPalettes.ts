// Brand palettes: user-defined color palettes, persisted in localStorage, that
// can be applied globally to the /artworks gallery previews (and exported /
// imported as JSON so a brand's colors travel between machines and projects).
//
// The whole feature state lives under one localStorage key so cross-tab sync
// is a single `storage` event. Same-tab consumers subscribe through
// useSyncExternalStore via subscribe/getSnapshot below.
'use client';

import { useSyncExternalStore } from 'react';

export type BrandPalette = {
  id: string;
  name: string;
  /** Colors, background (color0) first, then the inks. */
  colors: string[];
};

export type BrandPaletteState = {
  palettes: BrandPalette[];
  /** null = artwork default palettes. */
  activePaletteId: string | null;
  /** Render previews with a transparent background (color0). */
  transparentBackground: boolean;
};

export const STORAGE_KEY = 'tabbied.brandPalettes.v1';

/** Palette size bounds: a background plus at least one ink. */
export const MIN_PALETTE_COLORS = 2;
export const MAX_PALETTE_COLORS = 12;

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const DEFAULT_STATE: BrandPaletteState = {
  palettes: [],
  activePaletteId: null,
  transparentBackground: false,
};

export const isValidPaletteColor = (value: unknown): value is string =>
  typeof value === 'string' && HEX_COLOR.test(value.trim());

const isValidPalette = (value: unknown): value is BrandPalette => {
  if (typeof value !== 'object' || value === null) return false;

  const palette = value as Partial<BrandPalette>;

  return (
    typeof palette.id === 'string' &&
    palette.id.length > 0 &&
    typeof palette.name === 'string' &&
    palette.name.trim().length > 0 &&
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
    const activePaletteId =
      typeof parsed.activePaletteId === 'string' &&
      palettes.some((palette) => palette.id === parsed.activePaletteId)
        ? parsed.activePaletteId
        : null;

    return {
      palettes,
      activePaletteId,
      transparentBackground: parsed.transparentBackground === true,
    };
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
// Mutations
// ---------------------------------------------------------------------------

export const upsertPalette = (palette: BrandPalette) => {
  const state = getBrandPaletteState();
  const normalized = normalizePalette(palette);

  if (!isValidPalette(normalized)) {
    throw new Error('Invalid palette: a name and 2–12 hex colors are required.');
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
      id !== null && state.palettes.some((palette) => palette.id === id)
        ? id
        : null,
  });
};

export const setTransparentBackground = (transparent: boolean) => {
  writeState({ ...getBrandPaletteState(), transparentBackground: transparent });
};

// ---------------------------------------------------------------------------
// JSON import / export
// ---------------------------------------------------------------------------

export type BrandPaletteExport = {
  version: 1;
  palettes: Array<Pick<BrandPalette, 'name' | 'colors'>>;
};

/** All saved palettes as a portable JSON document. */
export const exportPalettesJson = (): string => {
  const { palettes } = getBrandPaletteState();
  const doc: BrandPaletteExport = {
    version: 1,
    palettes: palettes.map(({ name, colors }) => ({ name, colors })),
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
      ...(typeof candidate === 'object' && candidate !== null
        ? candidate
        : {}),
    } as BrandPalette;

    if (!isValidPalette(withId)) {
      throw new Error(
        'Each palette needs a "name" and a "colors" array of 2–12 hex colors (background first).'
      );
    }

    incoming.push(normalizePalette({ ...withId, id: createPaletteId() }));
  }

  if (incoming.length === 0) {
    throw new Error('No palettes found in the file.');
  }

  const state = getBrandPaletteState();
  const signature = (palette: Pick<BrandPalette, 'name' | 'colors'>) =>
    `${palette.name.toLowerCase()}|${palette.colors.join(',')}`;
  const existing = new Set(state.palettes.map(signature));

  const fresh = incoming.filter((palette) => !existing.has(signature(palette)));

  if (fresh.length > 0) {
    writeState({ ...state, palettes: [...state.palettes, ...fresh] });
  }

  return { imported: fresh.length, skipped: incoming.length - fresh.length };
};

// ---------------------------------------------------------------------------
// Applying a brand palette to an artwork preview
// ---------------------------------------------------------------------------

/**
 * The palette to hand to <TabbiedArtwork> for a preview: the brand colors
 * (when a brand palette is active) or the artwork's own colors, with the
 * background slot forced to 'transparent' when the toggle is on.
 * Returns undefined when nothing overrides the artwork defaults.
 */
export const previewPalette = (
  artworkColors: string[],
  state: BrandPaletteState
): string[] | undefined => {
  const active = state.palettes.find(
    (palette) => palette.id === state.activePaletteId
  );
  const base = active ? active.colors : artworkColors;

  if (!active && !state.transparentBackground) return undefined;

  return state.transparentBackground
    ? ['transparent', ...base.slice(1)]
    : [...base];
};
