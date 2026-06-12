// Per-artwork settings for the live css-doodle gallery thumbnails. Palettes
// and densities were derived from the original raster thumbnails
// (public/images/thumb_*.png); `color0` is always the background. Each
// thumbnail draws with a fresh random seed on every load, so only the look
// (palette / density / render size) is pinned here, not the placement.
import type { OptionValue } from 'lib/doodleSource';

export type ThumbnailConfig = {
  /** Palette override (color0 = background). Falls back to the artwork palette. */
  palette?: string[];
  /** Option overrides keyed by option id (grid / frequency / toggles). */
  options?: Record<string, OptionValue>;
  /**
   * Internal render size in px. The doodle is drawn at this resolution and then
   * scaled to fit the (square) card, so fixed-px features (border widths,
   * shadows) keep the proportions of the original 800px artwork. Defaults to
   * 800 x 800. `cropTop` keeps only the top fraction of the render (Symmetry
   * shows just its top half).
   */
  render?: { width: number; height: number; cropTop?: number };
};

export const galleryThumbnails: Record<string, ThumbnailConfig> = {
  radius: {
    palette: ['#3E8BFF', '#3B3F45', '#3FFFB2', '#3EECFF', '#97F4FF', '#FF3D8B'],
    // Frequency is high enough that a random seed virtually always paints
    // multiple cells (the e2e smoke test counts painted cells on this design).
    options: { grid: '4x4', frequency: 0.5 },
  },
  mixtape: {
    palette: ['#80FBB8', '#232529', '#4D8CF7', '#4D8CF7', '#3E8BFF', '#232529'],
    options: { grid: '3x3', frequency: 0.34 },
  },
  odessa: {
    palette: ['#1B4075', '#3EECFF', '#D89FFF', '#3E8BFF', '#3FFFB2'],
    options: { grid: '4x4', frequency: 0.6 },
  },
  symmetry: {
    palette: ['#97F4FF', '#97F4FF', '#00FFF3', '#00A1FF', '#FF8DFF', '#FF007E'],
    options: { circularity: 1 },
    // Crop a hair above the horizon (0.5) so the top edge of the mirrored
    // pink shapes — which sit exactly on the 50% line — stays out of frame.
    render: { width: 800, height: 1200, cropTop: 0.48 },
  },
  veil: {
    palette: ['#9EFFD8', '#3E8BFF', '#326DC9', '#1B4075', '#3EECFF', '#3E8BFF'],
    options: { grid: '8x8', frequency: 0.42 },
  },
  blossom: {
    palette: ['#367DE6', '#3EECFF', '#3FFFB2', '#FF3D8B', '#3FFFB2', '#FF3D8B'],
    options: { grid: '3x3', frequency: 0.6 },
  },
  disque: {
    palette: ['#3EECFF', '#232529', '#1B4075', '#FF3D8B', '#E9F1FF', '#367DE6'],
    options: { grid: '4x4', frequency: 0.55 },
  },
  bloks: {
    palette: ['#3FFFB2', '#ECFFEC', '#9EFFD8', '#ECFFEC', '#9EFFD8', '#FFFFFF'],
    options: { grid: '3x3', frequency: 1, shadow: true },
  },
  terrain: {
    palette: ['#232529', '#3E434B', '#3E8BFF', '#3FFFB2', '#275AA6', '#3EECFF'],
    options: { grid: '4x4', frequency: 0.85 },
    // Shape size is a fixed px formula (÷ column count); rendering smaller makes
    // the shapes read large against the card, matching the bold original.
    render: { width: 360, height: 360 },
  },
  trigram: {
    palette: ['#275AA6', '#3E8BFF', '#3EECFF', '#97F4FF', '#FFFFFF'],
    options: { grid: '4x4', frequency: 0.5, roundedCorners: true },
  },
  ring: {
    // Muted maroon rings (color1/color2) over the dark offset crescent
    // (color3) — matching the soft, tonal rings of the original.
    palette: ['#FF3D8B', '#C9447A', '#A33261', '#232529'],
    options: { grid: '3x3', frequency: 0.75 },
  },
  maze: {
    palette: ['#E9F1FF', '#232529', '#3E8BFF', '#FF3D8B', '#3FFFB2', '#3EECFF'],
    options: { grid: '7x7', frequency: 0.95, thickness: 9 },
  },
  pinwheel: {
    palette: ['#232529', '#3E8BFF', '#3EECFF', '#FF3D8B', '#3FFFB2', '#F5DD32'],
    options: { grid: '3x3', frequency: 0.9 },
  },
  confetti: {
    options: { grid: '4x4', frequency: 0.95 },
  },
  foliage: {
    palette: ['#ECFFEC', '#3FFFB2', '#3E8BFF', '#9EFFD8', '#FF3D8B', '#F5DD32'],
    options: { grid: '4x4', frequency: 0.9 },
  },
  metro: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  polka: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  stitch: {
    palette: ['#9EFFD8', '#FF3D8B', '#3E8BFF', '#1B4075', '#232529', '#F5DD32'],
    options: { grid: '4x4', frequency: 0.8 },
  },
  weave: {
    options: { grid: '4x4', frequency: 0.75 },
  },
  ziggy: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  lunar: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  pebble: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  morse: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  sparkle: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  vitrail: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  tesserae: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  sprinkles: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  glyph: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  wander: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  comet: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  ziggurat: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  curl: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  baste: {
    options: { grid: '7x7', frequency: 0.9 },
  },
  prisma: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  crescendo: {
    options: { grid: '6x6' },
  },
  echo: {
    options: { rings: 6 },
  },
  circuit: {
    options: { grid: '8x8', frequency: 0.6 },
  },
  daybreak: {
    options: { rays: 48 },
  },
  shard: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  quilt: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  petal: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  lantern: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  plasma: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  domino: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  ivy: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  neon: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  bokeh: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  shuffle: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  aster: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  aperture: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  argyle: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bauhaus: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  halftone: {
    options: { grid: '7x7', frequency: 0.95 },
  },
  elbow: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  bento: {
    options: { grid: '4x4', frequency: 0.95 },
  },
  grain: {
    options: { grid: '8x8', frequency: 0.95 },
  },
  misprint: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  zipper: {
    options: { grid: '6x6', frequency: 0.95 },
  },
};
