// Deterministic first paint, random afterwards.
//
// Three fields on the homepage are grids of randomly shaped cells that reshuffle
// on a timer: the hero skyline, the margin columns beside it, and the drifting
// squares behind the story section. `Math.random()` at render time would make
// the prerendered HTML disagree with the first client render and blow up
// hydration, so the *initial* grid comes from a fixed seed - server and client
// build the same one - and the timers that introduce real randomness only start
// after mount, where drift no longer matters.
//
// The palettes and shape vocabulary below are the homepage's own; the pattern
// catalog has its own palettes and neither should follow the other.

export type Rand = () => number;

/** mulberry32: small, fast, and bit-identical in Node and the browser. */
export function seededRandom(seed: number): Rand {
  let a = seed >>> 0;

  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rand: Rand, list: readonly T[]): T =>
  list[Math.floor(rand() * list.length)];

// ── Palettes ─────────────────────────────────────────────────────────────────
// The dark sections cycle through these four, which is what makes the hero read
// as a live pattern engine rather than a static header: the skyline recolors and
// the stat numbers follow it.

export const PALETTE_CYCLE = ['Mint', 'Ocean', 'Sunset', 'Lilac'] as const;

export type PaletteName = (typeof PALETTE_CYCLE)[number];

/** The two accent colors a palette lends to the stat numbers and gradient text. */
export const PALETTE_ACCENTS: Record<PaletteName, readonly [string, string]> = {
  Mint: ['#3fffb2', '#3eecff'],
  Ocean: ['#2f8bff', '#3eecff'],
  Sunset: ['#ff6b4a', '#ffb84a'],
  Lilac: ['#b98aff', '#ff8ad1'],
};

/** Gradient endpoints for the skyline cells, indexed by grid position. */
const PALETTE_STOPS: Record<PaletteName, readonly (readonly [string, string])[]> = {
  Mint: [
    ['oklch(0.2 0.03 200)', 'oklch(0.15 0.02 200)'],
    ['oklch(0.28 0.06 195)', 'oklch(0.2 0.04 195)'],
    ['oklch(0.35 0.09 190)', 'oklch(0.25 0.05 190)'],
    ['#3fffb2', 'oklch(0.45 0.13 175)'],
    ['#3eecff', 'oklch(0.5 0.14 190)'],
    ['oklch(0.32 0.07 195)', 'oklch(0.22 0.04 195)'],
  ],
  Ocean: [
    ['oklch(0.2 0.03 230)', 'oklch(0.15 0.02 230)'],
    ['oklch(0.28 0.06 235)', 'oklch(0.2 0.04 235)'],
    ['oklch(0.35 0.09 220)', 'oklch(0.25 0.05 220)'],
    ['#2f8bff', 'oklch(0.45 0.15 250)'],
    ['#3eecff', 'oklch(0.5 0.14 200)'],
    ['oklch(0.32 0.07 225)', 'oklch(0.22 0.04 225)'],
  ],
  Sunset: [
    ['oklch(0.22 0.04 30)', 'oklch(0.16 0.03 30)'],
    ['oklch(0.3 0.07 40)', 'oklch(0.22 0.05 40)'],
    ['oklch(0.38 0.1 50)', 'oklch(0.26 0.06 50)'],
    ['#ff6b4a', 'oklch(0.5 0.16 35)'],
    ['#ffb84a', 'oklch(0.55 0.15 65)'],
    ['oklch(0.34 0.08 45)', 'oklch(0.24 0.05 45)'],
  ],
  Lilac: [
    ['oklch(0.22 0.04 290)', 'oklch(0.16 0.03 290)'],
    ['oklch(0.3 0.07 300)', 'oklch(0.22 0.05 300)'],
    ['oklch(0.38 0.1 310)', 'oklch(0.26 0.06 310)'],
    ['#b98aff', 'oklch(0.5 0.16 295)'],
    ['#ff8ad1', 'oklch(0.55 0.15 335)'],
    ['oklch(0.34 0.08 305)', 'oklch(0.24 0.05 305)'],
  ],
};

/** Flat colors the margin cells and the pattern demo draw from. */
export const PALETTE_POOLS: Record<PaletteName, readonly string[]> = {
  Mint: ['#3fffb2', '#3eecff', 'oklch(0.32 0.04 250)', 'oklch(0.5 0.1 195)', 'oklch(0.65 0.16 185)', '#eef0f6'],
  Ocean: ['#2f8bff', '#3eecff', 'oklch(0.3 0.08 250)', 'oklch(0.45 0.12 230)', 'oklch(0.65 0.12 210)', '#eef0f6'],
  Sunset: ['#ff6b4a', '#ffb84a', 'oklch(0.32 0.06 30)', 'oklch(0.55 0.15 40)', 'oklch(0.7 0.16 70)', '#eef0f6'],
  Lilac: ['#b98aff', '#ff8ad1', 'oklch(0.32 0.06 300)', 'oklch(0.55 0.15 320)', 'oklch(0.68 0.14 340)', '#eef0f6'],
};

/**
 * A skyline cell's fill is a function of where it sits and which palette is up,
 * so only its silhouette is random. That is what keeps the grid reading as one
 * composition while individual cells flip shape underneath it.
 */
export function stopForCell(palette: PaletteName, col: number, row: number) {
  const stops = PALETTE_STOPS[palette];
  const [from, to] = stops[(col * 5 + row * 3) % stops.length];

  return `linear-gradient(135deg,${from},${to})`;
}

// ── Silhouettes ──────────────────────────────────────────────────────────────
// The design's "geometric" vocabulary: full squares, right triangles, and
// quarter-rounds. Every shape tiles its cell edge to edge, which is what lets
// the grid stay seamless however the cells land.

const TRIANGLE_CLIPS = [
  'polygon(0 0,100% 0,0 100%)',
  'polygon(100% 0,100% 100%,0 0)',
  'polygon(100% 100%,0 100%,100% 0)',
  'polygon(0 100%,0 0,100% 100%)',
] as const;

const QUARTER_RADII = [
  '100% 0 0 0',
  '0 100% 0 0',
  '0 0 100% 0',
  '0 0 0 100%',
] as const;

/** Weighted so quarter-rounds appear as often as the two straight-edged shapes. */
const SHAPES = ['square', 'triangle', 'quarter', 'quarter', 'square', 'triangle'] as const;

export type Silhouette = { radius: string; clip: string };

export function randomSilhouette(rand: Rand): Silhouette {
  switch (pick(rand, SHAPES)) {
    case 'triangle':
      return { radius: '0', clip: pick(rand, TRIANGLE_CLIPS) };
    case 'quarter':
      return { radius: pick(rand, QUARTER_RADII), clip: 'none' };
    default:
      return { radius: '0', clip: 'none' };
  }
}

/** A two-stop gradient in the current palette, for cells that carry their own fill. */
export function randomFill(rand: Rand, palette: PaletteName): string {
  const pool = PALETTE_POOLS[palette];
  const from = pick(rand, pool);
  const to = pick(rand, pool);

  return rand() < 0.5
    ? `linear-gradient(${Math.floor(rand() * 360)}deg,${from},${to})`
    : `radial-gradient(circle at 30% 30%,${from},${to})`;
}

export type MarginCell = Silhouette & { bg: string };

/** Roughly one cell in six is left empty so the margin columns breathe. */
export function randomMarginCell(rand: Rand, palette: PaletteName): MarginCell {
  if (rand() < 0.18) {
    return { radius: '0', clip: 'none', bg: 'transparent' };
  }

  return { ...randomSilhouette(rand), bg: randomFill(rand, palette) };
}

// ── Timings ──────────────────────────────────────────────────────────────────
// "Calm" in the source design: slow enough that the page is never distracting
// while you read it, quick enough that it is obviously alive.

export const TIMING = {
  /** How often a handful of skyline/margin cells change shape. */
  cell: 2200,
  /** How often the whole page steps to the next palette. */
  palette: 6600,
  /** How often the pattern-library demo advances one control. */
  demo: 4200,
} as const;

/** Replaces `count` random entries of `list` using `make`, returning a new array. */
export function reshuffle<T>(list: T[], count: number, make: () => T): T[] {
  const next = list.slice();

  for (let i = 0; i < count; i++) {
    next[Math.floor(Math.random() * next.length)] = make();
  }

  return next;
}
