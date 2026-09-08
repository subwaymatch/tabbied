// Per-pattern settings for the live css-doodle gallery thumbnails. Palettes
// and densities were derived from the raster thumbnails these replaced (since
// deleted); `color0` is always the background. Each
// thumbnail draws with a fresh random seed on every load, so only the look
// (palette / density / render size) is pinned here, not the placement.
import type { OptionValue } from 'tabbied';

export type ThumbnailConfig = {
  /** Palette override (color0 = background). Falls back to the pattern palette. */
  palette?: string[];
  /** Option overrides keyed by option id (grid / frequency / toggles). */
  options?: Record<string, OptionValue>;
  /**
   * Internal render size in px. The doodle is drawn at this resolution and then
   * scaled to fit the (square) card, so fixed-px features (border widths,
   * shadows) keep the proportions of the original 800px pattern. Defaults to
   * 800 x 800.
   */
  render?: { width: number; height: number };
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
    options: { grid: '3x3', frequency: 1 },
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
    // (color3) - matching the soft, tonal rings of the original.
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
  foliage: {
    palette: ['#ECFFEC', '#3FFFB2', '#3E8BFF', '#9EFFD8', '#FF3D8B', '#F5DD32'],
    options: { grid: '4x4', frequency: 0.9 },
  },
  metro: {
    options: { grid: '6x6', frequency: 0.95 },
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
  sparkle: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  vitrail: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  tesserae: {
    options: { grid: '6x6', frequency: 0.92 },
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
  circuit: {
    options: { grid: '8x8', frequency: 0.6 },
  },
  quilt: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  lantern: {
    options: { grid: '4x4', frequency: 0.85 },
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
  bauhaus: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  halftone: {
    options: { grid: '7x7', frequency: 0.95 },
  },
  elbow: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  grain: {
    options: { grid: '8x8', frequency: 0.95 },
  },
  misprint: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  tetro: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  notch: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  windowpane: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  spectrum: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  coil: {
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
  spiralblock: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  pennantbox: {
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
  quaver: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bowl: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cinch: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  loophole: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  quoit: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  lobe: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  dogtooth: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sail: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cleat: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  octagon: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  diadem: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  spark: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sliver: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  ell: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  chamfer: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  notchblock: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  frond: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  wavelet: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bobbin: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  quarterfall: {
    options: { grid: '4x4', frequency: 1 },
  },
  cornerbite: {
    options: { grid: '5x5', frequency: 1 },
  },
  chip: {
    options: { grid: '6x6', frequency: 1 },
  },
  shatter: {
    options: { grid: '5x5', frequency: 1 },
  },
  scramble: {
    options: { grid: '5x5', frequency: 1 },
  },
  cascade: {
    options: { grid: '5x5', frequency: 1 },
  },
  skewblock: {
    options: { grid: '8x8', frequency: 1 },
  },
  drift: {
    options: { grid: '8x8', frequency: 1 },
  },
  cupola: {
    options: { grid: '5x5', frequency: 1 },
  },
  lagoon: {
    options: { grid: '4x4', frequency: 1 },
  },
  scotia: {
    options: { grid: '5x5', frequency: 1 },
  },
  spandrel: {
    options: { grid: '5x5', frequency: 1 },
  },
  mullion: {
    options: { grid: '5x5', frequency: 1 },
  },
  cavetto: {
    options: { grid: '6x6', frequency: 1 },
  },
  moire: {
    options: { grid: '4x4', frequency: 1 },
  },
  schist: {
    options: { grid: '5x5', frequency: 1 },
  },
  kern: {
    options: { grid: '5x5', frequency: 1 },
  },
  quire: {
    options: { grid: '5x5', frequency: 1 },
  },
  karst: {
    options: { grid: '5x5', frequency: 1 },
  },
  miura: {
    options: { grid: '6x6', frequency: 1 },
  },
  waterbomb: {
    options: { grid: '5x5', frequency: 1 },
  },
  crease: {
    options: { grid: '6x6', frequency: 1 },
  },
  keyway: {
    options: { grid: '4x4', frequency: 1 },
  },
  gasket: {
    options: { grid: '4x4', frequency: 1 },
  },
  evolute: {
    options: { grid: '5x5', frequency: 1 },
  },
  linocut: {
    options: { grid: '5x5', frequency: 1 },
  },
  drypoint: {
    options: { grid: '5x5', frequency: 1 },
  },
  gravure: {
    options: { grid: '5x5', frequency: 1 },
  },
  parity: {
    options: { grid: '6x6', frequency: 1 },
  },
  hilbert: {
    options: { grid: '6x6', frequency: 1 },
  },
  hairpin: {
    options: { grid: '5x5', frequency: 1 },
  },
  matryoshka: {
    options: { grid: '5x5', frequency: 1 },
  },
  fractal: {
    options: { grid: '5x5', frequency: 1 },
  },
  subdivide: {
    options: { grid: '6x6', frequency: 1 },
  },
  epicentre: {
    options: { grid: '6x6', frequency: 1 },
  },
  pivot: {
    options: { grid: '6x6', frequency: 1 },
  },
  fulcrum: {
    options: { grid: '6x6', frequency: 1 },
  },
  centroid: {
    options: { grid: '6x6', frequency: 1 },
  },
  flux: {
    options: { grid: '6x6', frequency: 1 },
  },
  gyre: {
    options: { grid: '6x6', frequency: 1 },
  },
  maelstrom: {
    options: { grid: '6x6', frequency: 1 },
  },
  nutation: {
    options: { grid: '6x6', frequency: 1 },
  },
  gimbal: {
    options: { grid: '5x5', frequency: 1 },
  },
  dipole: {
    options: { grid: '6x6', frequency: 1 },
  },
  wedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  charcoal: {
    options: { grid: '5x5', frequency: 1 },
  },
  reedpen: {
    options: { grid: '5x5', frequency: 1 },
  },
  bilateral: {
    options: { grid: '6x6', frequency: 1 },
  },
  axial: {
    options: { grid: '6x6', frequency: 1 },
  },
  foldback: {
    options: { grid: '6x6', frequency: 1 },
  },
  ortho: {
    options: { grid: '6x6', frequency: 1 },
  },
  isometry: {
    options: { grid: '5x5', frequency: 1 },
  },
  dimetric: {
    options: { grid: '5x5', frequency: 1 },
  },
  recession: {
    options: { grid: '6x6', frequency: 1 },
  },
  raking: {
    options: { grid: '6x6', frequency: 1 },
  },
  thickset: {
    options: { grid: '6x6', frequency: 1 },
  },
  sunray: {
    options: { grid: '5x5', frequency: 1 },
  },
  spray: {
    options: { grid: '5x5', frequency: 1 },
  },
  frieze: {
    options: { grid: '6x6', frequency: 1 },
  },
  plait: {
    options: { grid: '6x6', frequency: 1 },
  },
  fenestrate: {
    options: { grid: '5x5', frequency: 1 },
  },
  perforate: {
    options: { grid: '5x5', frequency: 1 },
  },
  chain: {
    options: { grid: '5x5', frequency: 1 },
  },
  staple: {
    options: { grid: '5x5', frequency: 1 },
  },
  haunch: {
    options: { grid: '5x5', frequency: 1 },
  },
  arris: {
    options: { grid: '6x6', frequency: 1 },
  },
  abutment: {
    options: { grid: '5x5', frequency: 1 },
  },
  reeding: {
    options: { grid: '5x5', frequency: 1 },
  },
  fluting: {
    options: { grid: '5x5', frequency: 1 },
  },
  ridgeline: {
    options: { grid: '5x5', frequency: 1 },
  },
  thirdstop: {
    options: { grid: '5x5', frequency: 1 },
  },
  swapcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  seamband: {
    options: { grid: '5x5', frequency: 1 },
  },
  halfmast: {
    options: { grid: '5x5', frequency: 1 },
  },
  notchcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  corduroy: {
    options: { grid: '5x5', frequency: 1 },
  },
  ribline: {
    options: { grid: '5x5', frequency: 1 },
  },
  blindfold: {
    options: { grid: '5x5', frequency: 1 },
  },
  beamspread: {
    options: { grid: '5x5', frequency: 1 },
  },
  protractor: {
    options: { grid: '5x5', frequency: 1 },
  },
  rimband: {
    options: { grid: '5x5', frequency: 1 },
  },
  bangle: {
    options: { grid: '5x5', frequency: 1 },
  },
  ripplering: {
    options: { grid: '5x5', frequency: 1 },
  },
  tidering: {
    options: { grid: '5x5', frequency: 1 },
  },
  cornercut: {
    options: { grid: '5x5', frequency: 1 },
  },
  clipcorner: {
    options: { grid: '5x5', frequency: 1 },
  },
  bevelset: {
    options: { grid: '5x5', frequency: 1 },
  },
  mitre: {
    options: { grid: '5x5', frequency: 1 },
  },
  skewback: {
    options: { grid: '5x5', frequency: 1 },
  },
  nosing: {
    options: { grid: '5x5', frequency: 1 },
  },
  housing: {
    options: { grid: '5x5', frequency: 1 },
  },
  halving: {
    options: { grid: '5x5', frequency: 1 },
  },
  birdsmouth: {
    options: { grid: '5x5', frequency: 1 },
  },
  chase: {
    options: { grid: '5x5', frequency: 1 },
  },
  stylobate: {
    options: { grid: '5x5', frequency: 1 },
  },
  dieblock: {
    options: { grid: '5x5', frequency: 1 },
  },
  mutule: {
    options: { grid: '5x5', frequency: 1 },
  },
  modillion: {
    options: { grid: '5x5', frequency: 1 },
  },
  lobeform: {
    options: { grid: '5x5', frequency: 1 },
  },
  petalcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  doublebar: {
    options: { grid: '5x5', frequency: 1 },
  },
  slashbar: {
    options: { grid: '5x5', frequency: 1 },
  },
  gnomonwedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  quoinwedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  speckfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  pindot: {
    options: { grid: '5x5', frequency: 1 },
  },
  polkadot: {
    options: { grid: '5x5', frequency: 1 },
  },
  grainfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  sandfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotmatrix: {
    options: { grid: '5x5', frequency: 1 },
  },
  fanned: {
    options: { grid: '5x5', frequency: 1 },
  },
  bothways: {
    options: { grid: '5x5', frequency: 1 },
  },
  meetpart: {
    options: { grid: '5x5', frequency: 1 },
  },
  shearpair: {
    options: { grid: '5x5', frequency: 1 },
  },
  softedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  falloff: {
    options: { grid: '5x5', frequency: 1 },
  },
  dimmer: {
    options: { grid: '5x5', frequency: 1 },
  },
  fadein: {
    options: { grid: '5x5', frequency: 1 },
  },
  tinting: {
    options: { grid: '5x5', frequency: 1 },
  },
  shading: {
    options: { grid: '5x5', frequency: 1 },
  },
  toning: {
    options: { grid: '5x5', frequency: 1 },
  },
  glazing: {
    options: { grid: '5x5', frequency: 1 },
  },
  scumble: {
    options: { grid: '5x5', frequency: 1 },
  },
  gloaming: {
    options: { grid: '5x5', frequency: 1 },
  },
  rolloff: {
    options: { grid: '5x5', frequency: 1 },
  },
  decay: {
    options: { grid: '5x5', frequency: 1 },
  },
  subside: {
    options: { grid: '5x5', frequency: 1 },
  },
  tailoff: {
    options: { grid: '5x5', frequency: 1 },
  },
  stipplefade: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotfade: {
    options: { grid: '5x5', frequency: 1 },
  },
  grainfall: {
    options: { grid: '5x5', frequency: 1 },
  },
  spraydown: {
    options: { grid: '5x5', frequency: 1 },
  },
  dustfall: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotdrift: {
    options: { grid: '5x5', frequency: 1 },
  },
  peppering: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotwash: {
    options: { grid: '5x5', frequency: 1 },
  },
  drybrush: {
    options: { grid: '5x5', frequency: 1 },
  },
  streaking: {
    options: { grid: '5x5', frequency: 1 },
  },
  radiance: {
    options: { grid: '5x5', frequency: 1 },
  },
  fadedwedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  fadedbar: {
    options: { grid: '5x5', frequency: 1 },
  },
  stepramp: {
    options: { grid: '5x5', frequency: 1 },
  },
  twohalf: {
    options: { grid: '5x5', frequency: 1 },
  },
  sheared: {
    options: { grid: '5x5', frequency: 1 },
  },
  snipcorner: {
    options: { grid: '5x5', frequency: 1 },
  },
  angleoff: {
    options: { grid: '5x5', frequency: 1 },
  },
  cornerchip: {
    options: { grid: '5x5', frequency: 1 },
  },
  ringfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotset: {
    options: { grid: '5x5', frequency: 1 },
  },
  gritfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  overbar: {
    options: { grid: '5x5', frequency: 1 },
  },
  bothcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  roundcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  roundpair: {
    options: { grid: '5x5', frequency: 1 },
  },
  roundstep: {
    options: { grid: '5x5', frequency: 1 },
  },
  bight: {
    options: { grid: '5x5', frequency: 1 },
  },
  eyot: {
    options: { grid: '5x5', frequency: 1 },
  },
  strand: {
    options: { grid: '5x5', frequency: 1 },
  },
  sound: {
    options: { grid: '5x5', frequency: 1 },
  },
  spit: {
    options: { grid: '5x5', frequency: 1 },
  },
  bluff: {
    options: { grid: '5x5', frequency: 1 },
  },
  jerkinhead: {
    options: { grid: '5x5', frequency: 1 },
  },
  larmier: {
    options: { grid: '5x5', frequency: 1 },
  },
  rabbet: {
    options: { grid: '5x5', frequency: 1 },
  },
  rebate: {
    options: { grid: '5x5', frequency: 1 },
  },
  percale: {
    options: { grid: '5x5', frequency: 1 },
  },
  batiste: {
    options: { grid: '5x5', frequency: 1 },
  },
  fustian: {
    options: { grid: '5x5', frequency: 1 },
  },
  moleskin: {
    options: { grid: '5x5', frequency: 1 },
  },
  capstan: {
    options: { grid: '5x5', frequency: 1 },
  },
  mirrorblack: {
    options: { grid: '5x5', frequency: 1 },
  },
  bobbinet: {
    options: { grid: '3x3', frequency: 1 },
  },
  tulle: {
    options: { grid: '3x3', frequency: 1 },
  },
  maline: {
    options: { grid: '5x5', frequency: 1 },
  },
  ninon: {
    options: { grid: '5x5', frequency: 1 },
  },
  bowsprit: {
    options: { grid: '5x5', frequency: 1 },
  },
  jibboom: {
    options: { grid: '5x5', frequency: 1 },
  },
  casing: {
    options: { grid: '5x5', frequency: 1 },
  },
  alcove: {
    options: { grid: '5x5', frequency: 1 },
  },
  apse: {
    options: { grid: '5x5', frequency: 1 },
  },
  garret: {
    options: { grid: '5x5', frequency: 1 },
  },
  lucarne: {
    options: { grid: '5x5', frequency: 1 },
  },
  bench: {
    options: { grid: '5x5', frequency: 1 },
  },
  gully: {
    options: { grid: '5x5', frequency: 1 },
  },
  gorge: {
    options: { grid: '5x5', frequency: 1 },
  },
  guernsey: {
    options: { grid: '5x5', frequency: 1 },
  },
  wale: {
    options: { grid: '5x5', frequency: 1 },
  },
  raku: {
    options: { grid: '5x5', frequency: 1 },
  },
  grosgrain: {
    options: { grid: '5x5', frequency: 1 },
  },
  bengaline: {
    options: { grid: '5x5', frequency: 1 },
  },
  cendal: {
    options: { grid: '5x5', frequency: 1 },
  },
  giornata: {
    options: { grid: '5x5', frequency: 1 },
  },
  gesso: {
    options: { grid: '5x5', frequency: 1 },
  },
  arriccio: {
    options: { grid: '5x5', frequency: 1 },
  },
  basse: {
    options: { grid: '5x5', frequency: 1 },
  },
  combed: {
    options: { grid: '5x5', frequency: 1 },
  },
  mercerising: {
    options: { grid: '5x5', frequency: 1 },
  },
};
