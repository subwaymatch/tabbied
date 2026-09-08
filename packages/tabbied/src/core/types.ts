import type { AspectRatioId } from './aspectRatio.js';

export type PatternOptionType = 'ButtonSelectGroup' | 'Slider' | 'ToggleSwitch';

export type OptionValue = string | number | boolean;

export type PatternOption = {
  id: string;
  displayName: string;
  type: PatternOptionType;
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
  /**
   * ToggleSwitch only: SVG-export limitation introduced when this option is
   * on (e.g. a shadow that exports as an SVG filter). Export UIs should
   * surface it before downloading. See PatternDefinition.svgExportNote for
   * always-on limitations.
   */
  svgExportNote?: string;
};

/**
 * Bounds for how many palette entries (including the color0 background) are
 * active at once. `palette` must hold `max` entries so every slot has an
 * authored default; the pattern's style references colors up to `max - 1` and
 * inactive slots alias back into the active inks (see expandPalette).
 */
export type PatternColors = {
  min: number;
  max: number;
  default: number;
};

/**
 * How a pattern is fitted into its container. See createPattern().
 *
 * No fit distorts the drawing: `grid` re-derives the cell grid so cells stay
 * near-square at any box shape, `cover` scales a render uniformly, and `fixed`
 * draws at an explicit canvas size. Every design supports all three, so `fit`
 * is a plain choice - an unset one takes DEFAULT_FIT_MODE.
 */
export type FitMode = 'grid' | 'cover' | 'fixed';

/**
 * Per-pattern sizing metadata, all of it about the adaptive `grid` fit and all
 * of it optional. `minCellPx`/`maxCellPx` bound the derived cell size -
 * designs with fixed-px strokes and shadows need a floor so cells never shrink
 * past the look they were authored for.
 */
export type PatternSizing = {
  minCellPx?: number;
  maxCellPx?: number;
  /**
   * The cell must be a whole multiple of this. A design that subdivides its
   * cell puts a boundary at `cell / n`, and an indivisible cell lands that
   * boundary on a fraction of a pixel - which the browser seams, however
   * exact the outer grid is. Only the three designs that mask with a nested
   * `@doodle` need it: subdivide (2), fractal (3), matryoshka (4). Defaults
   * to 2, which also keeps centred rules and strokes off half-pixels.
   */
  cellMultiple?: number;
};

export type PatternDefinition = {
  name: string;
  slug: string;
  /** Short blurb about the design (shown by the Tabbied site). */
  description?: string;
  palette?: string[];
  /** Adjustable color-count bounds. Absent means the palette size is fixed. */
  colors?: PatternColors;
  options: PatternOption[];
  code: {
    style: string;
    doodle: string;
  };
  /** How the pattern may be fitted into a container. See PatternSizing. */
  sizing?: PatternSizing;
  /** Initial aspect ratio when the Tabbied editor opens. Defaults to "2:3". */
  defaultAspectRatio?: AspectRatioId;
  /** Render the gallery title in white (for dark thumbnails). */
  galleryWhite?: boolean;
  /** Sort position in the gallery (ascending). Unset sorts last. */
  galleryOrder?: number;
  /**
   * False disables native SVG export - for designs that paint effects SVG
   * cannot represent (smooth conic-gradient sweeps). Defaults to true.
   */
  svgExport?: boolean;
  /**
   * A user-facing note about this design's SVG-export limitations (effects
   * exported as SVG filters that design tools import imperfectly, or
   * documented sub-pixel deviations from the on-screen rendering). Export
   * UIs should surface it before downloading. Options can carry their own
   * conditional note - see PatternOption.svgExportNote.
   */
  svgExportNote?: string;
};

/**
 * Whether a pattern can be exported as native SVG. False only for designs
 * whose definition opts out via `svgExport: false` (smooth conic-gradient
 * sweeps have no SVG equivalent). Lives here - not in the converter module -
 * so UI gating never pulls the converter into the bundle (exportSvg() loads
 * it on demand).
 */
export function supportsSvgExport(pattern: { svgExport?: boolean }): boolean {
  return pattern.svgExport !== false;
}
