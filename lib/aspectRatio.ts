// Aspect-ratio + grid helpers shared by the artwork editor.
//
// A doodle is rendered on a canvas whose dimensions follow the selected aspect
// ratio. The column×row grid adapts to the ratio so that each cell stays
// (near-)square — this keeps every preset looking the way it was authored
// regardless of orientation.
//
// A ratio is a "w:h" string. A handful of presets are offered as buttons; any
// other valid "w:h" string (e.g. a user-entered custom ratio) is supported too.

// Buttons shown in the aspect-ratio selector (portrait → square → landscape).
export const RATIO_PRESETS = ['1:2', '2:3', '1:1', '3:2', '2:1'] as const;

// A ratio identifier — a preset or any custom "w:h" string.
export type AspectRatioId = string;

export const DEFAULT_ASPECT_RATIO = '2:3';

// Guard rails for custom ratios so the canvas and grid stay sane.
const MAX_RATIO_TERM = 100;

// Density of the grid, measured as the number of cells along the canvas's
// longer edge. Level 0 is the coarsest. The 2:3 ratio reproduces the original
// 2x3 / 4x6 / 6x9 / 8x12 / 10x15 options exactly.
const LONG_EDGE_COUNTS = [3, 6, 9, 12, 15] as const;

export const GRID_LEVEL_COUNT = LONG_EDGE_COUNTS.length;

// Parse a "w:h" ratio into positive, finite [w, h], or null when malformed.
export function parseRatio(value: string): [number, number] | null {
  if (typeof value !== 'string') {
    return null;
  }

  const parts = value.split(':');

  if (parts.length !== 2) {
    return null;
  }

  const w = Number(parts[0]);
  const h = Number(parts[1]);

  if (!Number.isFinite(w) || !Number.isFinite(h)) {
    return null;
  }

  if (w <= 0 || h <= 0 || w > MAX_RATIO_TERM || h > MAX_RATIO_TERM) {
    return null;
  }

  return [w, h];
}

export function isValidRatio(value: string): boolean {
  return parseRatio(value) !== null;
}

// Falls back to the default ratio for malformed input so callers never crash on
// a hand-edited URL.
function resolveRatio(ratio: AspectRatioId): [number, number] {
  return parseRatio(ratio) ?? (parseRatio(DEFAULT_ASPECT_RATIO) as [
    number,
    number,
  ]);
}

// Canvas pixel dimensions for a ratio, fitted inside the original preview
// footprint of `baseWidth` × `baseWidth * 1.5`. Fitting (rather than fixing the
// width) keeps every ratio within today's bounds, so tall portraits don't clip
// the viewport and wide landscapes don't overflow horizontally. The 2:3 ratio
// fills the box exactly, reproducing the original sizing.
export function getCanvasSize(
  ratio: AspectRatioId,
  baseWidth: number
): { width: number; height: number } {
  const [rw, rh] = resolveRatio(ratio);
  const boxWidth = baseWidth;
  const boxHeight = baseWidth * 1.5;
  const scale = Math.min(boxWidth / rw, boxHeight / rh);

  return {
    width: Math.round(rw * scale),
    height: Math.round(rh * scale),
  };
}

// "colsxrows" grid string for a ratio at a given density level, with cells kept
// as square as the ratio allows. The longer edge gets LONG_EDGE_COUNTS[level]
// cells; the shorter edge is scaled down proportionally (min 1).
export function deriveGrid(ratio: AspectRatioId, level: number): string {
  const [rw, rh] = resolveRatio(ratio);
  const clampedLevel = Math.min(
    Math.max(level, 0),
    LONG_EDGE_COUNTS.length - 1
  );
  const longCount = LONG_EDGE_COUNTS[clampedLevel];

  let cols: number;
  let rows: number;

  if (rw >= rh) {
    // landscape or square: width is the longer (or equal) edge
    cols = longCount;
    rows = Math.max(1, Math.round((longCount * rh) / rw));
  } else {
    // portrait: height is the longer edge
    rows = longCount;
    cols = Math.max(1, Math.round((longCount * rw) / rh));
  }

  return `${cols}x${rows}`;
}

// The list of "colsxrows" options offered for a ratio (one per density level).
export function getGridOptions(ratio: AspectRatioId): string[] {
  return LONG_EDGE_COUNTS.map((_, level) => deriveGrid(ratio, level));
}

// Map an authored grid string (e.g. "8x12") back to a density level so a
// preset's preferred density survives an aspect-ratio change. Uses the larger
// dimension (the long-edge count) and snaps to the nearest level.
export function gridToLevel(grid: string): number {
  const parts = grid.split('x').map((part) => Number(part));

  if (parts.length !== 2 || parts.some((value) => Number.isNaN(value))) {
    return 0;
  }

  const longCount = Math.max(parts[0], parts[1]);

  let nearest = 0;
  let smallestDelta = Infinity;

  LONG_EDGE_COUNTS.forEach((count, level) => {
    const delta = Math.abs(count - longCount);

    if (delta < smallestDelta) {
      smallestDelta = delta;
      nearest = level;
    }
  });

  return nearest;
}
