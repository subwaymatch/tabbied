// Sizing strategies for rendering an artwork into an arbitrary container.
//
// The generated pattern depends only on the seed and grid (see
// doodleSource.ts), so an artwork can be drawn at any size; what varies per
// strategy is how the cell grid and the css-doodle canvas relate to the
// container. See createArtwork() for how each FitMode is applied.
import type { ArtworkDefinition, ArtworkSizing, FitMode } from './types.js';

// Options with this id hold a "colsxrows" grid string; the adaptive `grid`
// fit overrides it with a grid derived from the measured container.
export const GRID_OPTION_ID = 'grid';

// Authored density levels (see aspectRatio.ts): long-edge cell counts
// [3, 6, 9, 12, 15] against the editor's 360×540 base box give these target
// cell sizes. Most presets default to "10x15" (level 4), so the 36px default
// reproduces today's authored look.
export const DENSITY_CELL_PX = [180, 90, 60, 45, 36] as const;

export const DEFAULT_CELL_PX = DENSITY_CELL_PX[4];

// css-doodle caps grids at 64×64 cells (parse_grid).
export const MAX_GRID_EDGE = 64;

// Bounds applied to the requested cell size when an artwork doesn't declare
// its own (sizing.minCellPx / sizing.maxCellPx).
const DEFAULT_MIN_CELL_PX = 24;
const DEFAULT_MAX_CELL_PX = 220;

/** Render resolution (and optional top-crop) for the cover/contain fits. */
export type CoverRender = { width: number; height: number; cropTop?: number };

// The gallery's proven default: render at a fixed 800×800 and scale into the
// container, preserving the proportions of fixed-px strokes and shadows.
export const DEFAULT_COVER_RENDER: CoverRender = { width: 800, height: 800 };

// Canvas size for fit:"fixed" when no width/height is given — the editor's
// original 2:3 preview footprint.
export const DEFAULT_FIXED_SIZE = { width: 360, height: 540 };

export const FIT_MODES: readonly FitMode[] = [
  'grid',
  'stretch',
  'cover',
  'contain',
  'fixed',
];

export function hasGridOption(definition: ArtworkDefinition): boolean {
  return definition.options.some((option) => option.id === GRID_OPTION_ID);
}

// The fits an artwork supports. Declared sizing.allowed wins; otherwise every
// fit is available except that the adaptive `grid` fit needs a "colsxrows"
// grid option to drive (grid-less compositions like Symmetry letterbox a
// fixed-ratio design instead, so they cover/contain).
export function allowedFitModes(definition: ArtworkDefinition): FitMode[] {
  if (definition.sizing?.allowed) {
    return definition.sizing.allowed;
  }

  return hasGridOption(definition)
    ? [...FIT_MODES]
    : FIT_MODES.filter((mode) => mode !== 'grid');
}

export function defaultFitMode(definition: ArtworkDefinition): FitMode {
  return (
    definition.sizing?.default ??
    (hasGridOption(definition) ? 'grid' : 'cover')
  );
}

// Resolve a requested fit against the artwork's capabilities, falling back to
// the artwork's default (with a console warning) rather than rendering a
// strategy the design can't support.
export function resolveFitMode(
  definition: ArtworkDefinition,
  requested?: FitMode
): FitMode {
  if (!requested) {
    return defaultFitMode(definition);
  }

  if (allowedFitModes(definition).includes(requested)) {
    return requested;
  }

  const fallback = defaultFitMode(definition);

  if (typeof console !== 'undefined') {
    console.warn(
      `[tabbied] fit "${requested}" is not supported by "${definition.slug}" — using "${fallback}" instead`
    );
  }

  return fallback;
}

// "cols × rows" for an arbitrary box at a target cell size, keeping cells
// near-square. Generalizes deriveGrid() from the five preset aspect ratios to
// any measured container: respect the artwork's cell-size bounds (px-effect
// designs need a floor), then css-doodle's hard 64×64 cap — raising the
// *effective* cell size when capped keeps cells near-square instead of
// letting one axis distort.
export function deriveGridForBox(
  width: number,
  height: number,
  targetCellPx: number,
  sizing?: ArtworkSizing
): { cols: number; rows: number } {
  const minCell = sizing?.minCellPx ?? DEFAULT_MIN_CELL_PX;
  const maxCell = sizing?.maxCellPx ?? DEFAULT_MAX_CELL_PX;
  const bounded = Math.min(Math.max(targetCellPx, minCell), maxCell);
  const cell = Math.max(bounded, width / MAX_GRID_EDGE, height / MAX_GRID_EDGE);

  return {
    cols: Math.max(1, Math.round(width / cell)),
    rows: Math.max(1, Math.round(height / cell)),
  };
}

// Scale + offsets that fit a fixed-resolution render into a host box. This is
// the gallery-thumbnail technique: scaling the rendered element (instead of
// rendering at the host's pixel size) preserves the authored proportions of
// fixed-px strokes and shadows, and DOM scaling stays vector-crisp.
//
// `cropTop` keeps only the top fraction of the render visible for `cover`
// (anchored to the top edge — e.g. Symmetry's gallery card shows just its
// top half); without it the render is centered on both axes.
export function fitRenderToBox(
  hostWidth: number,
  hostHeight: number,
  render: CoverRender,
  mode: 'cover' | 'contain'
): { scale: number; translateX: number; translateY: number } {
  const cropTop = render.cropTop ?? 1;
  const visibleHeight = render.height * cropTop;
  const scale =
    mode === 'cover'
      ? Math.max(hostWidth / render.width, hostHeight / visibleHeight)
      : Math.min(hostWidth / render.width, hostHeight / render.height);

  return {
    scale,
    translateX: (hostWidth - render.width * scale) / 2,
    translateY:
      mode === 'cover' && cropTop < 1
        ? 0
        : (hostHeight - render.height * scale) / 2,
  };
}
