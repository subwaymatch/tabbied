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

// resolveFitMode runs on every render/update/resize tick, so an unsupported
// fit warns once per artwork+fit pair instead of flooding the console.
const warnedFits = new Set<string>();

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
  const warnKey = `${definition.slug}|${requested}`;

  if (typeof console !== 'undefined' && !warnedFits.has(warnKey)) {
    warnedFits.add(warnKey);
    console.warn(
      `[tabbied] fit "${requested}" is not supported by "${definition.slug}" — using "${fallback}" instead`
    );
  }

  return fallback;
}

// "cols × rows" for an arbitrary box at a target cell size, keeping cells
// near-square. Generalizes deriveGrid() from the five preset aspect ratios to
// any measured container: respect the artwork's cell-size bounds (px-effect
// designs need a floor) — though never a cell larger than the box's short
// edge — then css-doodle's hard 64×64 cap.
//
// cols and rows are chosen *jointly*: the floor/ceil candidates on each axis
// are scored by how square the resulting cells are (squareness dominating,
// closeness to the target size breaking ties). Rounding each axis on its own
// could pair a rounded-up axis with a rounded-down one, stretching cells up
// to ~2× at small counts — a 1×1 grid across a 3:2 card turns a square motif
// into a visibly distorted one.
export function deriveGridForBox(
  width: number,
  height: number,
  targetCellPx: number,
  sizing?: ArtworkSizing
): { cols: number; rows: number } {
  if (width <= 0 || height <= 0) {
    return { cols: 1, rows: 1 };
  }

  const minCell = sizing?.minCellPx ?? DEFAULT_MIN_CELL_PX;
  const maxCell = sizing?.maxCellPx ?? DEFAULT_MAX_CELL_PX;
  const bounded = Math.min(Math.max(targetCellPx, minCell), maxCell);
  const cell = Math.max(
    // A cell floor above the short edge would force cells far from square
    // (e.g. a 200px floor in a 5000×100 banner); squareness wins there.
    Math.min(bounded, width, height),
    width / MAX_GRID_EDGE,
    height / MAX_GRID_EDGE
  );

  const axisCandidates = (span: number): number[] => {
    const low = Math.max(1, Math.floor(span / cell));
    const high = Math.max(1, Math.min(Math.ceil(span / cell), MAX_GRID_EDGE));

    return low === high ? [low] : [low, high];
  };

  let best = { cols: 1, rows: 1, score: Infinity };

  for (const cols of axisCandidates(width)) {
    for (const rows of axisCandidates(height)) {
      const cellW = width / cols;
      const cellH = height / rows;
      const score =
        4 * Math.abs(Math.log(cellW / cellH)) +
        Math.abs(Math.log(cellW / cell)) +
        Math.abs(Math.log(cellH / cell));

      if (score < best.score) {
        best = { cols, rows, score };
      }
    }
  }

  return { cols: best.cols, rows: best.rows };
}

// Parse a "colsxrows" grid option value (e.g. "6x9").
export function parseGridValue(
  value: string
): { cols: number; rows: number } | null {
  const match = /^\s*(\d+)\s*x\s*(\d+)\s*$/i.exec(value);

  if (!match) {
    return null;
  }

  const cols = Number(match[1]);
  const rows = Number(match[2]);

  return cols > 0 && rows > 0 ? { cols, rows } : null;
}

// The render box `cover` uses for a grid-driven artwork: the largest box of
// the host's aspect ratio that fits inside the base coverRender box. Matching
// the host's shape (instead of cropping a fixed-shape render into it) lets the
// grid tile it edge-to-edge with whole cells, so nothing is cut off mid-cell;
// staying inside the base box keeps the render resolution — and with it the
// look of fixed-px strokes and shadows — in the authored range.
export function adaptCoverRenderToBox(
  hostWidth: number,
  hostHeight: number,
  base: CoverRender
): CoverRender {
  if (hostWidth <= 0 || hostHeight <= 0) {
    return base;
  }

  const scale = Math.min(base.width / hostWidth, base.height / hostHeight);

  return {
    width: Math.max(1, Math.round(hostWidth * scale)),
    height: Math.max(1, Math.round(hostHeight * scale)),
  };
}

// Target cell size (in render px) that reproduces the authored/pinned grid's
// cell area on the base render box — so a host shaped like the base box keeps
// exactly the grid it asked for, and other shapes tile at the same visual
// density.
export function coverCellPx(
  gridValue: string,
  base: CoverRender
): number | null {
  const grid = parseGridValue(gridValue);

  if (!grid) {
    return null;
  }

  return Math.sqrt((base.width / grid.cols) * (base.height / grid.rows));
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
