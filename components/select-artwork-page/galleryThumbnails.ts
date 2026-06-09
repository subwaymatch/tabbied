// Per-artwork settings used to reproduce the original raster gallery thumbnails
// (public/images/thumb_*.png) as live css-doodle. Palettes and densities were
// derived from the source images; `color0` is always the background. Because
// css-doodle is seeded-random the exact placement can't be reproduced, so a
// fixed seed that lands "close enough" to the original is pinned per design.
import type { OptionValue } from 'lib/doodleSource';

export type ThumbnailConfig = {
  /** Palette override (color0 = background). Falls back to the artwork palette. */
  palette?: string[];
  /** Option overrides keyed by option id (grid / frequency / toggles). */
  options?: Record<string, OptionValue>;
  /** Fixed seed so each thumbnail is deterministic. */
  seed: string;
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
    options: { grid: '4x4', frequency: 0.42 },
    seed: 'radius7',
  },
  mixtape: {
    palette: ['#80FBB8', '#232529', '#4D8CF7', '#4D8CF7', '#3E8BFF', '#232529'],
    options: { grid: '3x3', frequency: 0.34 },
    seed: 'mxA',
  },
  odessa: {
    palette: ['#1B4075', '#3EECFF', '#D89FFF', '#3E8BFF', '#3FFFB2'],
    options: { grid: '4x4', frequency: 0.6 },
    seed: 'odessa5',
  },
  symmetry: {
    palette: ['#97F4FF', '#97F4FF', '#00FFF3', '#00A1FF', '#FF8DFF', '#FF007E'],
    options: { circularity: 1 },
    render: { width: 800, height: 1200, cropTop: 0.5 },
    seed: 'symm2',
  },
  veil: {
    palette: ['#9EFFD8', '#3E8BFF', '#326DC9', '#1B4075', '#3EECFF', '#3E8BFF'],
    options: { grid: '8x8', frequency: 0.42 },
    seed: 'veil4',
  },
  blossom: {
    palette: ['#367DE6', '#3EECFF', '#3FFFB2', '#FF3D8B', '#3FFFB2', '#FF3D8B'],
    options: { grid: '3x3', frequency: 0.6 },
    seed: 'blossom6',
  },
  disque: {
    palette: ['#3EECFF', '#232529', '#1B4075', '#FF3D8B', '#E9F1FF', '#367DE6'],
    options: { grid: '4x4', frequency: 0.55 },
    seed: 'disque8',
  },
  bloks: {
    palette: ['#3FFFB2', '#ECFFEC', '#9EFFD8', '#ECFFEC', '#9EFFD8', '#FFFFFF'],
    options: { grid: '3x3', frequency: 1, shadow: true },
    seed: 'bloks1',
  },
  terrain: {
    palette: ['#232529', '#3E434B', '#3E8BFF', '#3FFFB2', '#275AA6', '#3EECFF'],
    options: { grid: '4x4', frequency: 0.85 },
    // Shape size is a fixed px formula (÷ column count); rendering smaller makes
    // the shapes read large against the card, matching the bold original.
    render: { width: 360, height: 360 },
    seed: 'terrain9',
  },
  trigram: {
    palette: ['#275AA6', '#3E8BFF', '#3EECFF', '#97F4FF', '#FFFFFF'],
    options: { grid: '4x4', frequency: 0.5, roundedCorners: true },
    seed: 'trigram4',
  },
  ring: {
    // Muted maroon rings (color1/color2) over the dark, semi-transparent
    // crescent (color3) — matching the soft, tonal rings of the original.
    palette: ['#FF3D8B', '#C9447A', '#A33261', '#232529'],
    options: { grid: '3x3', frequency: 0.75 },
    seed: 'ringB',
  },
};
