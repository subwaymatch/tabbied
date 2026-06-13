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
  herringbone: {
    options: { grid: '6x6', frequency: 0.95 },
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
  kite: {
    options: { grid: '4x4', frequency: 0.85 },
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
  compass: {
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
  tally: {
    options: { grid: '6x6', frequency: 0.85 },
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
  facet: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  sailcloth: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  flagstone: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  pennon: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  sierra: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  galleon: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  spinnaker: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  patchwork: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  tangram: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  halfcut: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  counterpane: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  kerchief: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bandana: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  diagonal: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  twill: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  corduroy: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  cabana: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  pinstripe: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  venetian: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  furrow: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  deckchair: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  chevron: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  arrowhead: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  fletch: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  sawtooth: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  dart: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  bolt: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  wigwam: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  stairwell: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  battlement: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  ascent: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  crenel: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  stepwell: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  meander: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  scallop: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  fishscale: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  cusp: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  drift: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  lune: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  crook: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  serpentine: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  spinner: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  windmill: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  carousel: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  cartwheel: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  propeller: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  sundial: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  turbine: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  bullseye: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  roundel: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  vinyl: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  halo: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  onion: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  tunnel: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  iris: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  capsule: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  pillbox: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  lozenge: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  tablet: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  lintel: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  plinth: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  pylon: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  quadrant: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cornerstone: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  primary: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  albers: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  klee: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  schema: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  module: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  harlequin: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  rhombus: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  caltrop: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  jester: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  pip: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  diamondback: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  windowpane: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  mullion: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  casement: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  grille: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  transom: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  fretwork: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  halfmoon: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  dome: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  sunburst: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  igloo: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  hemisphere: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  sundown: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  nesting: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  framework: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  matte: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  vortex: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  boxcar: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  inset: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  telescope: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  equalizer: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  skyline: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  cityscape: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  histogram: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  citadel: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  columns: {
    options: { grid: '5x5', frequency: 0.9 },
  },
};
