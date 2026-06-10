import type { AspectRatioId } from './aspectRatio.js';

export type ArtworkOptionType = 'ButtonSelectGroup' | 'Slider' | 'ToggleSwitch';

export type OptionValue = string | number | boolean;

export type ArtworkOption = {
  id: string;
  displayName: string;
  type: ArtworkOptionType;
  default: OptionValue;
  replace: string;
  /** ButtonSelectGroup choices. */
  options?: string[];
  /** Slider bounds. */
  min?: number;
  max?: number;
  step?: number;
  /** ToggleSwitch "on" snippet. */
  code?: string;
};

/**
 * Bounds for how many palette entries (including the color0 background) are
 * active at once. `palette` must hold `max` entries so every slot has an
 * authored default; the artwork's style references colors up to `max - 1` and
 * inactive slots alias back into the active inks (see expandPalette).
 */
export type ArtworkColors = {
  min: number;
  max: number;
  default: number;
};

/** How an artwork is fitted into its container. See createArtwork(). */
export type FitMode = 'grid' | 'stretch' | 'cover' | 'contain' | 'fixed';

/**
 * Per-artwork sizing metadata. Everything is optional: artworks with a
 * "colsxrows" grid option default to the adaptive `grid` fit, grid-less
 * compositions (Symmetry) to `cover`. `minCellPx`/`maxCellPx` bound the
 * adaptive cell size — designs with fixed-px strokes and shadows need a floor
 * so cells never shrink past the look they were authored for.
 */
export type ArtworkSizing = {
  allowed?: FitMode[];
  default?: FitMode;
  minCellPx?: number;
  maxCellPx?: number;
  /** Render resolution (and optional top-crop) for the cover/contain fits. */
  coverRender?: { width: number; height: number; cropTop?: number };
};

export type ArtworkDefinition = {
  name: string;
  slug: string;
  /** Short blurb about the design (shown by the Tabbied site). */
  description?: string;
  palette?: string[];
  /** Adjustable color-count bounds. Absent means the palette size is fixed. */
  colors?: ArtworkColors;
  options: ArtworkOption[];
  code: {
    style: string;
    doodle: string;
  };
  /** How the artwork may be fitted into a container. See ArtworkSizing. */
  sizing?: ArtworkSizing;
  /** Initial aspect ratio when the Tabbied editor opens. Defaults to "2:3". */
  defaultAspectRatio?: AspectRatioId;
  /**
   * Forces a single aspect ratio and hides the editor's selector — for designs
   * whose layout is tuned to one ratio. Currently unused: Symmetry letterboxes
   * its composition into a centered 2:3 box instead.
   */
  lockAspectRatio?: AspectRatioId;
  /** Render the gallery title in white (for dark thumbnails). */
  galleryWhite?: boolean;
  /** Sort position in the gallery (ascending). Unset sorts last. */
  galleryOrder?: number;
};
