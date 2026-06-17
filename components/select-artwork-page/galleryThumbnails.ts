// Per-artwork settings for the live css-doodle gallery thumbnails. Palettes
// and densities were derived from the original raster thumbnails
// (public/images/thumb_*.png); `color0` is always the background. Each
// thumbnail draws with a fresh random seed on every load, so only the look
// (palette / density / render size) is pinned here, not the placement.
import type { OptionValue } from 'tabbied';

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
  origami: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  gable: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  pleat: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  gingham: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  trellis: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  posy: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  meadow: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  cairn: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  lily: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  ripple: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  aurora: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  orbit: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  constellation: {
    options: { grid: '6x6', frequency: 0.8 },
  },
  memphis: {
    options: { grid: '5x5', frequency: 0.5 },
  },
  glitch: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  barcode: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  postage: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  kilim: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  azulejo: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  shoji: {
    options: { grid: '6x6', frequency: 0.4 },
  },
  mudcloth: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  gumball: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  jelly: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  balloon: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  tetro: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  notch: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  awning: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  strata: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  pendulum: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  radar: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  voltage: {
    options: { grid: '5x5', frequency: 0.6 },
  },
  koi: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  bramble: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  drizzle: {
    options: { grid: '6x6', frequency: 0.85 },
  },
  cumulus: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  rainbow: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  arcade: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  facade: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  dial: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  levels: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  citrus: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  sash: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  wash: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  kintsugi: {
    options: { grid: '5x5', frequency: 0.7 },
  },
  enso: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  bunting: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  sprout: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  links: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  regatta: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  massif: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  abacus: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  hatch: {
    options: { grid: '6x6', frequency: 0.85 },
  },
  crater: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  monolith: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  basalt: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  cog: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  inkblot: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  checkers: {
    options: { grid: '6x6', frequency: 0.5 },
  },
  hopscotch: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  shibori: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  polaroid: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  button: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  bowtie: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  medusa: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  coral: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  stella: {
    options: { grid: '5x5', frequency: 0.75 },
  },
  ladybird: {
    options: { grid: '5x5', frequency: 0.7 },
  },
  flutter: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  sonata: {
    options: { grid: '6x6', frequency: 0.8 },
  },
  chime: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  cirrus: {
    options: { grid: '6x6', frequency: 0.85 },
  },
  meridian: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  pulsar: {
    options: { grid: '5x5', frequency: 0.7 },
  },
  signal: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  laundry: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  amphora: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  saguaro: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  seigaiha: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  impasto: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  patina: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  sine: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  gem: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  macaron: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  shelf: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  rake: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  matchstick: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  incense: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  splat: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  popsicle: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  paisley: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  buoy: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  sigil: {
    options: { grid: '5x5', frequency: 0.75 },
  },
  bubbles: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  bee: {
    options: { grid: '5x5', frequency: 0.7 },
  },
  mirror: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  pompom: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  carousel: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  windowpane: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  matte: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  spectrum: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  coil: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  lens: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  hourglass: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  northstar: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  bracket: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  merlon: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  ibeam: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  spiralblock: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  tictac: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  pennantbox: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  crosshatch: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  rungs: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  picket: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  lattice: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  caltrop: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  sawedge: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  switchback: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  battlement: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  facetgrad: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  prismfold: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  lune: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  hoop: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  pellet: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  capsule: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  quaver: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pip: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  wheelarc: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  iris: {
    options: { grid: '4x4', frequency: 0.88 },
  },
  bowl: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cinch: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  rondure: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  loophole: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  halfpenny: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  mandorla: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  roundel: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  gibbous: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  cresset: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  quoit: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  pebbledot: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  bezel: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  lobe: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  discus: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  prow: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  fin: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  caret: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  needle: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pinnacle: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pennon: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cusp: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  spearhead: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pediment: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  splittri: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  dogtooth: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  wingtri: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  fang: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  zagtile: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  burgee: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  vee: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  delta: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sail: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pinnate: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  cleat: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  trishard: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  quadrant: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  lozenge: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  trapezoid: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  hextile: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  penta: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sixstar: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  octagon: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pinhex: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  diadem: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  crystal: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  facetbox: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  starlet: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  slant: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  gemcut: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  spark: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  diadot: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  pentafan: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  shield: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  diaper: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  sunwheel: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  rhomboid: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  trianglet: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  hexdot: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  barline: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  tickmark: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  plumb: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  rail: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  comb: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  stave: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pulsebar: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  crossbar: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  hashmark: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  slat: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sliver: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  notchbar: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  halfink: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  quarterbar: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  ledger: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  warp: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  gridline: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  dotdash: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  ell: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  tee: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  chamfer: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  halfblock: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  quarterblock: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  step: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  frameblock: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  crux: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  triband: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  offsetbox: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  insetstep: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cornerpunch: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  splithz: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  pinhole: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  edgeband: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  doubinset: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  notchblock: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  celleye: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bond: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  plaid: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  tatami: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  pinweave: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  tweed: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  crazy: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  boxweave: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  kasuri: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  caneweave: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pavers: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  mosaictile: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  logcabin: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  flagstone: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  basket: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  cointile: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  quiltsquare: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  twill: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  draughts: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  pinwheeltile: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  brokenbond: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  bevel: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  emboss: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  convex: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cube: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  swellbox: {
    options: { grid: '7x7', frequency: 0.95 },
  },
  facetdiamond: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  tilt: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  zigzagfold: {
    options: { grid: '6x6', frequency: 0.98 },
  },
  dome: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  pyramid3d: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sunken: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  glint: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  tube: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  step3d: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  diamond3d: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  lozengegrad: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bud: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bloom: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  billow: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  raindrop: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  frond: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pondring: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  scale: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  sprig: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  tendril: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pod: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  berry: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  wavelet: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cattail: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  heart: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  clover: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  palmette: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  mistwave: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  grassblade: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  lotus: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  driftleaf: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  acorn: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  thistle: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  scatterdot: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  twinkle: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  bubble: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  spore: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  freckle: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pixel: {
    options: { grid: '8x8', frequency: 0.98 },
  },
  granule: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  dapple: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  beadrow: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  dotwave: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  polkapair: {
    options: { grid: '5x5', frequency: 0.98 },
  },
  ringdot: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  chaff: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  stipple: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  halfdot: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sequin: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  mote: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  arrow: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  chevarrow: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  mesh: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  snowflake: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  frame: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  windowframe: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  crosshair: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  quincunx: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bolt: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  tag: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bracketpair: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  rune: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  keyhole: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  trace: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  diamondeye: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  ringlink: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bobbin: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sprocket: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  hexnut: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  star5: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  checkmark: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pinmark: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  fuzz: {
    options: { grid: '8x8', frequency: 0.98 },
  },
};
