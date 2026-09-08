// Batch 8 - 10 motifs (gallery orders 900+).
//
// Where batch 7 works in the idiom of the hand-drawn originals - a clip-path
// polygon typed out by hand, a border-radius, a pseudo-element - this batch is
// organised around the generators css-doodle ships with, and each design here
// is one of them:
//
//   * @shape() walks a polar or parametric equation and hands back a
//     clip-path, so an outline can be *computed* rather than listed point by
//     point (Evolute);
//   * mask: @svg(...) builds a mask out of inline SVG, complete with
//     `rect*4 { x: calc(@n(-1) * 25) }` repetition, while the paint stays a
//     plain sampled background-color (Linocut, Drypoint);
//   * a CSS gradient mask handles the two-dimensional screens (Gravure);
//   * @match against @x, @y and @i computes the pattern from the cell's
//     address instead of rolling for it (Parity, Hilbert, Hairpin);
//   * mask: @doodle(...) renders a whole second doodle and uses it as the
//     mask (Matryoshka, Fractal, Subdivide).
//
// Three things about masks, all learned the hard way and all worth keeping
// written down:
//
//   * a mask reads *alpha*, not luminance, so a white shape is exactly as
//     opaque as a black one and cannot be used to punch a hole. Every hole is
//     a real gap or an evenodd sub-path;
//   * a mask clips the element's own box-shadows along with everything else;
//   * inside @svg's `*N` repetition only the linear @n(-1) counter is
//     available - @nx/@ny are @multiple-only - and parenthesised or modulo
//     arithmetic does not survive the trip, which is why the grids above are
//     CSS gradient masks rather than SVG.
//
// House rules (inherited from every earlier batch):
//   * exactly one @random(${shapeFrequency}) gate per design, so the frequency
//     slider always thins the field;
//   * every design samples a transition-able ink per cell, so a reseed morphs.
//     validate-batch8.mjs deliberately ignores background-image when it checks
//     that a reseed changed something: a design whose only variation lived in
//     a gradient or an @svg would snap instead;
//   * a randomized custom prop read more than once goes through @var(--x);
//   * nothing paints var(--color0). A hole knocked out in the background
//     colour is a fake hole - set the background slot to transparent and it
//     stops erasing anything. validate-batch8.mjs re-renders the batch over a
//     checkerboard with the background slot set to #00000000 and requires
//     byte-identical cells.

const isDark = (hex) => {
  const m = /^#([0-9a-f]{6})/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255 < 0.5;
};

// Ink picker over color1..color(c-1) (color0 is the background - never painted).
const ink = (c, s = 1) => {
  const a = [];
  for (let i = s; i <= c - 1; i++) a.push(`var(--color${i})`);
  return `@p(${a.join(', ')})`;
};

// ── shared snippets ────────────────────────────────────────────────────────
const F = '@random(${shapeFrequency})';
const TR = ' -webkit-transition: ease 450ms; transition: ease 450ms;';
const cp = (p) => `-webkit-clip-path: ${p}; clip-path: ${p};`;
const rot = (v) => `-webkit-transform: rotate(${v}); transform: rotate(${v});`;
const xf = (v) => `-webkit-transform: ${v}; transform: ${v};`;
const msk = (v) => `-webkit-mask: ${v}; mask: ${v};`;

const R2 = '@pick(0deg, 90deg)';
const R4 = '@pick(0deg, 90deg, 180deg, 270deg)';

// ── the shape maker ────────────────────────────────────────────────────────
const sh = (spec) => cp(`@shape(${spec})`);

// A parametric curve, x and y in terms of `t`.
const para = (x, y, { points = 240, rotate, scale, frame } = {}) =>
  [
    `points: ${points}`,
    `x: ${x}`,
    `y: ${y}`,
    rotate === undefined ? null : `rotate: ${rotate}`,
    scale === undefined ? null : `scale: ${scale}`,
    frame === undefined ? null : `frame: ${frame}`,
  ]
    .filter(Boolean)
    .join('; ');

// ── masks ──────────────────────────────────────────────────────────────────
// @svg() returns a data-URI usable as a mask, so the SVG decides the holes
// while the paint stays a plain, sampled background-color.
const svgMask = (body) => msk(`@svg(${body})`);

// A whole second doodle, used as the mask. Only its alpha matters, so the
// inner doodle paints in #000 and #0000 and the cell's own sampled ink shows
// through wherever the inner grid is opaque.
const inner = (grid, body) => `@doodle(@grid: ${grid} / 100%; ${body})`;
const innerMask = (grid, body) => {
  const d = inner(grid, body);
  return `-webkit-mask: ${d}; mask: ${d}; -webkit-mask-size: 100% 100%; mask-size: 100% 100%;`;
};

// ── palette bank ───────────────────────────────────────────────────────────
// color0 = background. Palettes may repeat across designs (they are different
// patterns).
const PAL = [
  ['#0B1F3A', '#3E8BFF', '#3EECFF', '#97F4FF', '#9EFFD8', '#FFFFFF'],
  ['#101A2E', '#3E8BFF', '#3EECFF', '#FF3D8B', '#3FFFB2', '#F5DD32'],
  ['#0E2438', '#275AA6', '#3E8BFF', '#3EECFF', '#97F4FF', '#E9F1FF'],
  ['#0B2540', '#1B4075', '#3E8BFF', '#3EECFF', '#9EFFD8', '#ECFFEC'],
  ['#E9F1FF', '#1B4075', '#3E8BFF', '#3EECFF', '#FF3D8B', '#3FFFB2'],
  ['#FFFFFF', '#3E8BFF', '#1B4075', '#3EECFF', '#FF3D8B', '#3FFFB2'],
  ['#ECFFEC', '#3FFFB2', '#3E8BFF', '#9EFFD8', '#FF3D8B', '#F5DD32'],
  ['#2B1B3D', '#FF8A5C', '#FFC15E', '#FF5E78', '#FFD27D', '#FFF1D6'],
  ['#241024', '#E84393', '#B388EB', '#FF8FB8', '#F5C542', '#FFF1F6'],
  ['#1A0E12', '#FF6B6B', '#FFD93D', '#4ECDC4', '#FF8A5C', '#FFF1D6'],
  ['#FBF3E4', '#D96C47', '#E3A92E', '#7FA886', '#2F4156', '#F4E3C8'],
  ['#2B1E1A', '#E2543E', '#E3A92E', '#88A872', '#F3EBDB', '#7FA886'],
  ['#F4EFE4', '#7A1F3D', '#2F4156', '#C9A86A', '#88A872', '#D98E5A'],
  ['#141233', '#6C4AB6', '#3EECFF', '#FF3D8B', '#F5DD32', '#3FFFB2'],
  ['#0F2027', '#3FFFB2', '#3EECFF', '#2BB3A3', '#D89FFF', '#E9FFF9'],
  ['#0F2A1E', '#2F6B3C', '#4F9D5D', '#8CC084', '#C8E6C0', '#ECFFEC'],
  ['#F2F7EE', '#2F6B3C', '#4F9D5D', '#8CC084', '#C8E6C0', '#1F4D2A'],
  ['#0E1230', '#3E8BFF', '#7AA7FF', '#B9D0FF', '#E9F1FF', '#FFFFFF'],
  ['#FCFBFF', '#60569E', '#9B8FD4', '#C9BFF2', '#3E8BFF', '#E6437D'],
  ['#FAF7F0', '#232529', '#E63329', '#1D3D8F', '#F0C02E', '#3EECFF'],
  ['#10303A', '#2BB3A3', '#3EECFF', '#FF6B6B', '#FFD93D', '#F3EBDB'],
  ['#FBF7EE', '#FF4D6D', '#2E86AB', '#F5B82E', '#7E4A8C', '#2BB3A3'],
  ['#1D1F24', '#E8E6E1', '#F5B82E', '#3EECFF', '#FF4D6D', '#2E86AB'],
  ['#15171C', '#E8E6E1', '#F5B82E', '#3EECFF', '#FF3D8B', '#9EFFD8'],
  ['#FFF8F2', '#FF7E9D', '#FFB35C', '#9D89F2', '#54C6B8', '#FF3D8B'],
  ['#FFF9F5', '#FF8FB8', '#FFC2D4', '#FF8A5C', '#D89FFF', '#F5C542'],
  ['#0B2540', '#3E8BFF', '#3EECFF', '#9EFFD8', '#ECFFEC', '#FFFFFF'],
  ['#161616', '#F5F5F0', '#9A9A9A', '#5A5A5A', '#C8C8C8', '#3A3A3A'],
  ['#F5F5F0', '#161616', '#5A5A5A', '#9A9A9A', '#3A3A3A', '#C8C8C8'],
  ['#11151A', '#FF5252', '#FFB300', '#26C6DA', '#66BB6A', '#EEEEEE'],
  ['#FDF6E3', '#073642', '#268BD2', '#D33682', '#859900', '#CB4B16'],
  ['#1B2A4A', '#F7C548', '#F25F5C', '#247BA0', '#70C1B3', '#FFFFFF'],
  ['#2D132C', '#801336', '#C72C41', '#EE4540', '#F0C419', '#FFE9C7'],
  ['#0D1B2A', '#1B98E0', '#E0FBFC', '#FF7B00', '#FFD23F', '#EAEAEA'],
  ['#F0EAD6', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'],
  ['#1E1B18', '#C99E10', '#7D6608', '#E8C547', '#F5EFD6', '#9C7A2B'],
  ['#FFF4E6', '#3D348B', '#7678ED', '#F7B801', '#F18701', '#F35B04'],
  ['#08141E', '#0F8B8D', '#143642', '#EC9A29', '#A8201A', '#EFE6DD'],
  ['#231942', '#5E548E', '#9F86C0', '#BE95C4', '#E0B1CB', '#F7ECFF'],
  ['#FDFCFB', '#E2D1F9', '#C9B6E4', '#A06CD5', '#6247AA', '#102B3F'],
  ['#0A0908', '#49111C', '#A9927D', '#F2F4F3', '#5E503F', '#C6AC8F'],
  ['#022B3A', '#1F7A8C', '#BFDBF7', '#E1E5F2', '#FF8C42', '#FFF8F0'],
  ['#FFFCF2', '#252422', '#403D39', '#CCC5B9', '#EB5E28', '#A8763E'],
  ['#12100E', '#D62246', '#F06449', '#EDE6E3', '#36C9C6', '#F4D35E'],
  ['#001219', '#005F73', '#0A9396', '#94D2BD', '#EE9B00', '#CA6702'],
  ['#FEFAE0', '#606C38', '#283618', '#DDA15E', '#BC6C25', '#A3B18A'],
  ['#10002B', '#5A189A', '#9D4EDD', '#C77DFF', '#E0AAFF', '#FFD6FF'],
  ['#FFFFFF', '#06AED5', '#086788', '#F0C808', '#FFF1D0', '#DD1C1A'],
  ['#101820', '#FEE715', '#F2F2F2', '#8A8D91', '#00A6A6', '#FF6B35'],
  ['#FDF0D5', '#003049', '#C1121F', '#780000', '#669BBC', '#8D99AE'],
  ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#F5F5F5', '#53BF9D'],
  ['#F7F7FF', '#2D3142', '#4F5D75', '#BFC0C0', '#EF8354', '#3D5A80'],
  ['#221E22', '#EFD9CE', '#DEC0F1', '#B79CED', '#957FEF', '#7161EF'],
  ['#FFF3B0', '#335C67', '#E09F3E', '#9E2A2B', '#540B0E', '#2E4057'],
  ['#0B132B', '#1C2541', '#3A506B', '#5BC0BE', '#6FFFE9', '#F2F4F3'],
  ['#F6F4D2', '#3E5622', '#F19C79', '#A44A3F', '#8FA96B', '#CBDFBD'],
  ['#2C061F', '#DF57BC', '#F7B5CA', '#F9F9F9', '#FFBF69', '#8E44AD'],
  ['#EAE0CC', '#1B1B1E', '#C6AC8F', '#5E503F', '#A9927D', '#EB5E28'],
  ['#04030F', '#3D0E61', '#7B2CBF', '#C77DFF', '#E0AAFF', '#FAF0FF'],
  ['#FFFFFC', '#BEB7A4', '#FF7F11', '#FF3F00', '#1B1B1E', '#3A7CA5'],
  ['#0F1A20', '#F4D35E', '#EE964B', '#F95738', '#EFE6DD', '#4C8FBD'],
  ['#F3F9D2', '#274001', '#8AA624', '#547326', '#BDD358', '#C9A227'],
  ['#181818', '#EC4E20', '#FF9505', '#016FB9', '#FFFFFF', '#C2E7DA'],
  ['#FAEFE0', '#E56399', '#7F96FF', '#5FA8B5', '#320A28', '#DE6B48'],
  ['#01161E', '#124559', '#598392', '#AEC3B0', '#EFF6E0', '#F4B860'],
  ['#FFF8E7', '#D62828', '#F77F00', '#FCBF49', '#003049', '#3E8FB0'],
  ['#191D32', '#282F44', '#8A5B78', '#B3679B', '#E5D0CC', '#F2C9E1'],
  ['#F5F3F4', '#0B090A', '#BA181B', '#E5383B', '#660708', '#A4161A'],
];

// Every motif name used anywhere in the project so far, including the designs
// that were authored for batch 7 and cut before it shipped - a name should
// never come to mean two different things.
const TAKEN = new Set(
  (
    'abacus accordion acorn agate ampersand amphora analemma annulet ' +
    'annulus aperture apogee arabesque arcade argyle armilla arpeggio ' +
    'arrow arrowplay asanoha ascender ascent aster asterisk astragal ' +
    'atoll aurora awning azimuth azulejo balloon barcode bargello barline ' +
    'barrulet basalt basket baste battlement bauhaus beadrow bee bento ' +
    'berry bevel beveled bezant bezel bias billet billow blockfall bloks ' +
    'bloom blossom bobbin bokeh bolt bond boro bowl bowtie boxweave ' +
    'bracket bracketpair bract braid bramble brickwork bristle brocade ' +
    'brokenbond bubble bubbles bud bulge bunting buoy burgee bushing ' +
    'button buttonhole cadenza cairn caltrop calyx caneweave capsule ' +
    'caret carousel cartouche cascade cattail caustic cavetto celleye ' +
    'chaff chalice chamfer checkers checkmark chenille chert chevarrow ' +
    'chevrondiamond chevronel chime chip churn cinch circuit cirque ' +
    'cirrus citrus cleat clef clover cobble cog coil cointile colophon ' +
    'comb comet compass confetti constellation contour convex coral ' +
    'corbel cornerbite cornerpunch cornice corolla corona counter cove ' +
    'crank crater crazy crease crescendo crescent cresset crossbar ' +
    'crosshair crosshatch crosslet crotchet crux crystal cube cumulus ' +
    'cupola curl cusp damask damier dapple dart datum daybreak delta ' +
    'dentil diadem diadot dial diamond3d diamonddust diamondeye ' +
    'diamondframe diaper diminuendo discus disque dogtooth dome domino ' +
    'dotdash dotwave doubinset draughts drift driftleaf drizzle dropcap ' +
    'dune echo ecliptic eddy edgeband elbow ell emboss enso ermine ' +
    'estuary eyelet facade facetbox facetdiamond facetgrad fang fanleaf ' +
    'fanlight fermata fillet fin fishscale flagstone flange fleck flight ' +
    'flint flurry flutter flywheel foldout foliage folio fourpane frame ' +
    'frameblock freckle frond froth fusil fuzz gable gablet gasket gauze ' +
    'gem gemcut geode gibbous gingham girih glint glitch glyph gnomon ' +
    'grain granule grassblade graticule gravel gridline gumball gutter ' +
    'gyron hachure halfblock halfdot halfink halfmoon halfpenny halftone ' +
    'halo harlequin hashmark hatch heart herringbone hexagram hexbloom ' +
    'hexdot hexnut hextile hoop hopscotch houndstooth hourglass hurdle ' +
    'ibeam ichimatsu ikat impasto incense inkblot inset insetstep iris ' +
    'isobar isocube isopleth ivy jacquard jali jelly jewel jumble ' +
    'junction karst kasuri kerf kern keyhole keypad keystone keyway ' +
    'keywork khatam kikko kilim kintsugi kirigami kite koi kufic ladybird ' +
    'lagoon lantern lattice laundry ledger lens lentil levels ligature ' +
    'lily links lintel lobe logcabin loophole lotus louvre loxodrome ' +
    'lozenge lozengegrad lozengy lune lunette macaron madras maltese ' +
    'mandorla mascle massif matchstick matte maze meadow meander medusa ' +
    'memphis meridian merlon mesh metro mica minim mirror misprint ' +
    'mistwave miura mixtape moire monolith moonphase moraine morse ' +
    'mortise mosaicglass mosaictile mote mudcloth mullion muqarna nacre ' +
    'nadir needle neon northstar notch notchbar notchblock obelisk ' +
    'octagon octant oculus odessa offset offsetbox ogee orb orbit origami ' +
    'ostinato ovolo oxbow paisley palisade palmette papercut parallax ' +
    'parquet passepartout patina pavers pawl pebble pebbledot pediment ' +
    'pellet pendulum pennant pennantbox pennon penta pentafan penumbra ' +
    'petal picket pieslice pinhex pinhole pinion pinmark pinnacle pinnate ' +
    'pinnule pinweave pinwheel pinwheelstar pinwheeltile pinwheelweave ' +
    'pip pique piston pixel plaid plasma pleat plumb plus pod polaroid ' +
    'polka polkapair pompom pondring popsicle portal postage posy potent ' +
    'prisma prismfold prow pulsar pulsebar pylon pyramid pyramid3d pyrite ' +
    'quadrant quadrille quarterbar quarterblock quarterfall quartz quasar ' +
    'quaver quilling quilt quiltsquare quincunx quire quoit raceme radar ' +
    'radius rafter rail rainbow raindrop rake range ratchet reef regatta ' +
    'register rhomboid rhumb ribbonfold ricrac riffle rill ring ringdot ' +
    'ringlink ripple rivet rondure roundel rune rungs rustre saguaro sail ' +
    'saltire sandbar sash sashiko sawedge sayagata scale scallop ' +
    'scatterdot schist scotia scramble sebka sector seersucker seigaiha ' +
    'selvedge semibreve sepal sequin serif sextant shard shatter shelf ' +
    'shibori shield shingle shippo shoal shoji shuffle sickle sigil ' +
    'signal silo silt sine sixstar skerry skew skewblock slant slat ' +
    'sliptile sliver snowflake soffit sonata spandrel spark sparkle ' +
    'spathe spearhead spectrum spill spiralblock spire splat spline ' +
    'splinter splithz splittri spore sprig sprinkles sprocket sprout ' +
    'squall squinch staccato stackbond stamen star5 starflake starlet ' +
    'stave stella step step3d stipple stipule stitch strata sunburst ' +
    'sunken sunwheel surf swellbox switchback symmetry syzygy tag tally ' +
    'talus taper target tatami tatewaku teardrop tee tendril terrain ' +
    'tesserae tetro thistle tickmark tictac tilt tittle torsion torteau ' +
    'trace trackline transom trapeze trapezoid traverse trellis tremolo ' +
    'triad trianglet triband trigram triquetra trishard truchet tube ' +
    'tumble turret tweed twill twinkle umbel uroko vair vee veil venn ' +
    'vinyl vitrail voltage volute vortex voussoir wander waning warp wash ' +
    'washer waterbomb wavelet waypoint weave weft wheelarc whorl wicket ' +
    'windowframe windowpane wingtri wreath yagasuri zagtile zee zellige ' +
    'zenith ziggurat ziggy zigline zigzagfold zipper'
  )
    .split(/\s+/)
    .filter(Boolean)
);

// JS reserved words can't be emitted as `export const <slug>` by the package
// codegen, so they're banned as slugs.
const RESERVED = new Set(
  ('do if in for let new try var case else enum eval null this true void with ' +
    'await break catch class const false super throw while yield delete export ' +
    'import public return static switch typeof default extends finally package ' +
    'private continue debugger function arguments interface protected implements ' +
    'instanceof').split(/\s+/)
);

let order = 900;
const all = [];

// cfg:
//   grid   default "columns x rows" for the editor       (default '6x9')
//   freq   default frequency                             (default 1)
//   tg/tf  gallery-thumbnail grid / frequency            (default '5x5' / 1)
//   min    sizing.minCellPx floor, for px-scaled details
// Documented sub-pixel deviations from the live render (docs/svg-export.md,
// tier 2). The export is the *correct* drawing in both cases; it is the
// browser's rasterization of the mask that differs, so the user is told
// before the download rather than after.
const NESTED_SEAM_NOTE =
  "The nested mask is exported as clean vector shapes \u2014 the faint seams visible on screen come from browser rasterization and won't appear in the SVG, so it can differ from the screen by a hair.";
const SVG_MASK_NOTE =
  "The stripe mask can sit up to a pixel away from the on-screen rendering, and its internal coordinates use calc(), which some design tools don't evaluate.";

const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 8: ${slug}`);
  const palette = PAL[palIdx % PAL.length];
  const c = palette.length;
  const { vars, rule } = build(c);
  if (/var\(\s*--color0\s*\)/.test(`${vars} ${rule}`)) {
    throw new Error(
      `${slug}: painting var(--color0) breaks on a transparent background - cut the shape instead`
    );
  }
  all.push({
    name,
    slug,
    order: order++,
    ...(isDark(palette[0]) ? { white: true } : {}),
    description,
    palette,
    colors: { min: 2, max: c, default: c },
    gridDefault: cfg.grid ?? '6x9',
    freqDefault: cfg.freq ?? 1,
    ...(cfg.min ? { minCellPx: cfg.min } : {}),
    // SVG-export tier (docs/svg-export.md). It belongs in the definition, not
    // hand-added to the generated JSON: the generator rewrites every file it
    // owns, so metadata that only exists downstream is silently dropped the
    // next time anyone regenerates the batch.
    ...(cfg.svgExport === false ? { svgExport: false } : {}),
    ...(cfg.svgExportNote ? { svgExportNote: cfg.svgExportNote } : {}),
    thumb: { grid: cfg.tg ?? '5x5', frequency: cfg.tf ?? 1 },
    vars,
    rule,
  });
};

// ══════════════════════════════════════════════════════════════════════════
// A. Computed outlines - @shape() walking an equation into a clip-path.
// ══════════════════════════════════════════════════════════════════════════

add('Evolute', 11, 'The evolute of an ellipse: an astroid stretched, so its four cusps stop being square.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('1.3 * cos(t)^3', '0.75 * sin(t)^3', { scale: 0.9 }))} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

// ══════════════════════════════════════════════════════════════════════════
// B. SVG masks - inline SVG decides the holes; the paint stays a sampled
//    background-color.
// ══════════════════════════════════════════════════════════════════════════

add('Linocut', 32, 'Linocut gouges: broad chisel strokes with rounded ends.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*4 { x: calc(@n(-1) * 25 + 5); y: 6; width: 14; height: 88; rx: 7; fill: #000 }')} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Drypoint', 34, 'Drypoint: lines that thicken steadily across the plate, the way the needle digs in as it goes.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*6 { x: calc(@n(-1) * 16.6 + 2); y: -1; width: calc(2 + @n(-1) * 1.8); height: 102; fill: #000 }')} ${rot(R2)} }${TR}`,
}), { tg: '5x5', svgExportNote: SVG_MASK_NOTE });

add('Gravure', 19, 'Photogravure cells: a grid of square wells with the walls left standing between them.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 15%, transparent 15% 20%), repeating-linear-gradient(90deg, #000 0 15%, transparent 15% 20%)')} -webkit-mask-composite: source-in; mask-composite: intersect; }${TR}`,
}), { tg: '5x5' });

// ══════════════════════════════════════════════════════════════════════════
// C. Rule-driven fields - @match against the cell's own address, so the
//    pattern is computed rather than rolled.
// ══════════════════════════════════════════════════════════════════════════

add('Parity', 12, 'A checker that keeps changing its mind: the parity of the column decides the shape, the parity of the row decides the turn.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')} @match(@x % 2 == 0) { ${cp('polygon(100% 0, 100% 100%, 0 100%)')} } @match(@y % 2 == 0) { ${xf('scaleY(-1)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Hilbert', 51, 'The Hilbert curve\'s four orientations, cycling by cell index so the path always joins up.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(14% 14%, 34% 14%, 34% 66%, 66% 66%, 66% 14%, 86% 14%, 86% 86%, 14% 86%)')} ${xf('rotate(@calc(@i % 4 * 90)deg)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Hairpin', 39, 'A hairpin bend - the road doubling back on itself - turning a quarter with every column.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(10% 10%, 90% 10%, 90% 46%, 34% 46%, 34% 56%, 90% 56%, 90% 90%, 10% 90%, 10% 56%, 66% 56%, 66% 46%, 10% 46%)')} ${xf('rotate(@calc(@x % 4 * 90)deg)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ══════════════════════════════════════════════════════════════════════════
// D. Nested doodles - a whole second doodle used as the mask.
// ══════════════════════════════════════════════════════════════════════════

add('Matryoshka', 18, 'A doodle inside a doodle: each cell holds a whole second grid, and only some of its cells are open.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('4', 'background: @p(#000, #000, #0000);')} }${TR}`,
}), { tg: '5x5', svgExportNote: NESTED_SEAM_NOTE });

add('Fractal', 50, 'Self-similar all the way down: the inner grid uses the same open-or-shut rule as the outer one.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('3', 'background: #000; @nth(5) { background: #0000; }')} }${TR}`,
}), { tg: '5x5', svgExportNote: NESTED_SEAM_NOTE });

add('Subdivide', 7, 'Quartered, then quartered again: a mask that keeps three of every four squares.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('2', 'background: @p(#000, #000, #000, #0000);')} ${rot(R4)} }${TR}`,
}), { grid: '8x12', tg: '6x6', svgExportNote: NESTED_SEAM_NOTE });

if (all.length !== 10) {
  throw new Error(`batch 8 must hold exactly 10 designs, found ${all.length}`);
}

export const batch8 = all;
