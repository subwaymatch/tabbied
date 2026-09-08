// Batch 7 - 24 motifs (gallery orders 700+).
//
// Where batch 6 was the *ordered* batch (nothing placed by a dice roll), batch
// 7 goes back to the hand-scattered feel of the eleven patterns Syung Hong
// drew by hand - Radius, Mixtape, Odessa, Symmetry, Veil, Blossom, Disque,
// Bloks, Terrain, Trigram and Ring (gallery orders 1-11). Those designs share
// a very particular way of working:
//
//   * one shape per cell, its outline rolled out of a small, deliberately
//     chosen library - four corner circles and a couple of triangles, not a
//     continuum;
//   * the roll is coarse. @pick over five clip paths, four rotations, three
//     heights. Nothing is sampled from a smooth range, so the field stays
//     legible as a set of *tiles* rather than dissolving into noise;
//   * the palette does the rest. A single ink sampled per cell, drawn from the
//     inks only, and a transition so a reseed morphs rather than snaps.
//
// House rules (inherited from every earlier batch):
//   * every rule paints through exactly one @random(${shapeFrequency}) gate,
//     so the frequency slider always thins the field; nested @random(k) blocks
//     inside that gate are how a design varies itself (Blossom's trick);
//   * reseed variation rides on a transition-able, *sampled* property -
//     background-color, transform, clip-path, opacity, border - and every rule
//     ends in a transition, so a redraw morphs;
//   * a randomized custom prop read more than once goes through @var(--x)
//     (a plain var() re-rolls at every occurrence);
//   * nothing paints var(--color0). Batch 6 established that a hole knocked
//     out in the background color is a fake hole - set the background slot to
//     transparent and it stops erasing anything. Every gap here is real
//     geometry: a clip-path hole, a mask, a border, or a gap between two
//     elements. generate-batch7.mjs enforces this, and validate-batch7.mjs
//     re-renders the whole batch over a checkerboard to prove it.

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
const pt = ' -webkit-transition: ease 450ms; transition: ease 450ms;';
const cp = (p) => `-webkit-clip-path: ${p}; clip-path: ${p};`;
const rot = (v) => `-webkit-transform: rotate(${v}); transform: rotate(${v});`;
const xf = (v) => `-webkit-transform: ${v}; transform: ${v};`;
const msk = (v) => `-webkit-mask: ${v}; mask: ${v};`;
const B = (css) => `:before { content: ''; position: absolute; ${css}${pt} }`;
const A = (css) => `:after { content: ''; position: absolute; ${css}${pt} }`;

const R2 = '@pick(0deg, 90deg)';
const R4 = '@pick(0deg, 90deg, 180deg, 270deg)';
const R8 = '@pick(0deg, 45deg, 90deg, 135deg, 180deg, 225deg, 270deg, 315deg)';

// ── the originals' own shape library ───────────────────────────────────────
// Radius picks between four corner circles and a centred one; Mixtape adds the
// four half-square triangles. Section A draws from the same short list rather
// than inventing a new outline per cell.
const CORNER = 'circle(100% at 0 0), circle(100% at 100% 0), circle(100% at 100% 100%), circle(100% at 0 100%)';
const TRI = 'polygon(0 0, 100% 0, 100% 100%), polygon(0 0, 100% 0, 0 100%), polygon(0 0, 100% 100%, 0 100%), polygon(100% 0, 100% 100%, 0 100%)';

// ── real holes, not painted-over ones ──────────────────────────────────────
// A polygon whose outer ring runs clockwise and whose inner ring runs
// counter-clockwise, joined by a zero-width slit: under the nonzero fill rule
// the inner ring is a genuine hole, so whatever sits behind the canvas shows
// through it.
const P = (pts) => pts.map(([x, y]) => `${(+x).toFixed(1)}% ${(+y).toFixed(1)}%`).join(', ');
const poly = (pts) => `polygon(${P(pts)})`;
const withHole = (inner) =>
  `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${P(inner)}, ${P([inner[0]])})`;

// Centred rectangular hole inset `x`% horizontally and `y`% vertically.
const rectHole = (x, y) => [
  [x, y],
  [x, 100 - y],
  [100 - x, 100 - y],
  [100 - x, y],
];

// A square with a quarter-circle bite taken out of one corner. A single closed
// loop, so the winding doesn't matter and mirroring is free. `r` is the bite's
// radius in percent of the cell - at 100 the arc springs from one cell corner
// and lands exactly on the next, leaving no straight stub between them.
const coveBite = (r, corner = 'tl', steps = 16) => {
  const pts = [[100, 0], [100, 100], [0, 100], [0, r]];
  for (let i = 0; i <= steps; i++) {
    const a = (Math.PI / 2) * (i / steps);
    pts.push([r * Math.sin(a), r * Math.cos(a)]);
  }
  const flipX = corner === 'tr' || corner === 'br';
  const flipY = corner === 'bl' || corner === 'br';
  return poly(pts.map(([x, y]) => [flipX ? 100 - x : x, flipY ? 100 - y : y]));
};

// ── masks that cut real gaps ───────────────────────────────────────────────
// A ring with a genuinely transparent bore: the fill stays a plain,
// transition-able background-color and the mask cuts the hole.
const ringMask = (bore) =>
  msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${bore}, #000 ${bore})`);

// Hard-edged stripes cut out of whatever the element paints: `on` inks, then
// the strip up to `off` is cut away, repeating along `angle`.
const slotMask = (angle, on, off) =>
  msk(`repeating-linear-gradient(${angle}, #000 0 ${on}, transparent ${on} ${off})`);

// ── palette bank ───────────────────────────────────────────────────────────
// color0 = background. Spans neon, jewel, earth, pastel, mono, retro and
// forest families so the gallery stays varied; palettes may repeat across
// designs (they are different patterns).
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
  // Twenty new colorways mixed in for this batch.
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

// Every motif name used anywhere in the project so far - the shipped patterns,
// the gallery thumbnail table and batches 1-6's definition files (including
// entries that were trimmed before shipping). add() refuses to reuse one.
const TAKEN = new Set(
  (
    'abacus acorn amphora annulus aperture arcade argyle arrow arrowplay ' +
    'ascent aster asterisk aurora awning azulejo balloon barcode bargello ' +
    'barline basalt basket baste battlement bauhaus beadrow bee bento berry ' +
    'bevel beveled bezel bias billow bloks bloom blossom bobbin bokeh bolt ' +
    'bond bowl bowtie boxweave bracket bracketpair bramble brickwork ' +
    'brokenbond bubble bubbles bud bulge bunting buoy burgee button ' +
    'buttonhole cairn caltrop caneweave capsule caret carousel cartouche ' +
    'cattail caustic celleye chaff chalice chamfer checkers checkmark ' +
    'chevarrow chevrondiamond chime cinch circuit cirrus citrus cleat clover ' +
    'cog coil cointile comb comet compass confetti constellation convex coral ' +
    'cornerpunch cove crater crazy crescendo crescent cresset crossbar ' +
    'crosshair crosshatch crosslet crux crystal cube cumulus curl cusp damier ' +
    'dapple dart daybreak delta diadem diadot dial diamond3d diamonddust ' +
    'diamondeye diamondframe diaper diminuendo discus disque dogtooth dome ' +
    'domino dotdash dotwave doubinset draughts driftleaf drizzle dune echo ' +
    'edgeband elbow ell emboss enso eyelet facade facetbox facetdiamond ' +
    'facetgrad fang fanlight fin fishscale flagstone flight flutter foliage ' +
    'fourpane frame frameblock freckle frond fuzz gable gablet gem gemcut ' +
    'gibbous gingham glint glitch glyph grain granule grassblade gridline ' +
    'gumball gutter halfblock halfdot halfink halfpenny halftone halo ' +
    'harlequin hashmark hatch heart herringbone hexagram hexbloom hexdot ' +
    'hexnut hextile hoop hopscotch hourglass hurdle ibeam impasto incense ' +
    'inkblot inset insetstep iris isocube ivy jelly jewel junction kasuri ' +
    'kerf keyhole keypad keywork kilim kintsugi kite koi ladybird lantern ' +
    'lattice laundry ledger lens levels lily links lintel lobe logcabin ' +
    'loophole lotus louvre lozenge lozengegrad lune lunette macaron maltese ' +
    'mandorla massif matchstick matte maze meadow medusa memphis meridian ' +
    'merlon mesh metro mirror misprint mistwave mixtape monolith moonphase ' +
    'morse mortise mosaicglass mosaictile mote mudcloth needle neon northstar ' +
    'notch notchbar notchblock octagon octant odessa offset offsetbox ogee ' +
    'orb orbit origami ovolo paisley palmette parquet passepartout patina ' +
    'pavers pebble pebbledot pediment pellet pendulum pennant pennantbox ' +
    'pennon penta pentafan petal picket pinhex pinhole pinion pinmark ' +
    'pinnacle pinnate pinweave pinwheel pinwheelstar pinwheeltile ' +
    'pinwheelweave pip pixel plaid plasma pleat plumb plus pod polaroid polka ' +
    'polkapair pompom pondring popsicle portal postage posy prisma prismfold ' +
    'prow pulsar pulsebar pyramid pyramid3d quadrant quadrille quarterbar ' +
    'quarterblock quartz quasar quaver quilt quiltsquare quincunx quoit radar ' +
    'radius rafter rail rainbow raindrop rake range regatta rhomboid ' +
    'ribbonfold ricrac ring ringdot ringlink ripple rondure roundel rune ' +
    'rungs saguaro sail saltire sash sawedge scale scallop scatterdot sector ' +
    'seigaiha sequin sextant shard shelf shibori shield shoji shuffle sigil ' +
    'signal sine sixstar skew slant slat sliver snowflake sonata spark ' +
    'sparkle spearhead spectrum spiralblock spire splat splithz splittri ' +
    'spore sprig sprinkles sprocket sprout stackbond star5 starflake starlet ' +
    'stave stella step step3d stipple stitch strata sunburst sunken sunwheel ' +
    'swellbox switchback symmetry tag tally taper target tatami tee tendril ' +
    'terrain tesserae tetro thistle tickmark tictac tilt torsion trace ' +
    'trackline trapeze trapezoid trellis trianglet triband trigram triquetra ' +
    'trishard truchet tube tumble tweed twill twinkle vee veil venn vinyl ' +
    'vitrail voltage wander warp wash wavelet weave weft wheelarc wicket ' +
    'windowframe windowpane wingtri zagtile zee ziggurat ziggy zigline ' +
    'zigzagfold zipper'
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

let order = 700;
const all = [];

// cfg:
//   grid   default "columns x rows" for the editor       (default '8x12')
//   freq   default frequency                             (default 1)
//   tg/tf  gallery-thumbnail grid / frequency            (default '5x5' / 1)
//   min    sizing.minCellPx floor, for px-scaled details
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 7: ${slug}`);
  const palette = PAL[palIdx % PAL.length];
  const c = palette.length;
  const { vars, rule } = build(c);
  const code = `${vars} ${rule}`;
  if (/var\(\s*--color0\s*\)/.test(code)) {
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
    gridDefault: cfg.grid ?? '8x12',
    freqDefault: cfg.freq ?? 1,
    ...(cfg.min ? { minCellPx: cfg.min } : {}),
    thumb: { grid: cfg.tg ?? '5x5', frequency: cfg.tf ?? 1 },
    vars,
    rule,
  });
};

// ══════════════════════════════════════════════════════════════════════════
// A. After Radius, Mixtape and Veil - one shape per cell, its outline rolled
//    out of a short, deliberately chosen library.
// ══════════════════════════════════════════════════════════════════════════

add('Quarterfall', 3, 'Radius hollowed out: the same rolled quarter-discs, but half of them keep only their outer band, so filled corners and open ones fall through the grid together.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('circle(100% at 0 0)')} ${rot('@var(--rot)')} @random(0.5) { ${msk('radial-gradient(circle farthest-side at 0% 0%, transparent 54%, #000 54%)')} } }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Cornerbite', 51, 'Full squares with a quarter-circle bitten out of one corner - a deep bite on most, a shallow nick on the rest, the corner rolling a quarter turn at a time.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(coveBite(66, 'tl'))} ${rot('@var(--rot)')} @random(0.35) { ${cp(coveBite(30, 'tl'))} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Chip', 12, 'Squares with two opposite corners knocked off, a few left whole - the chamfer turning a quarter at a time.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(34% 0, 100% 0, 100% 66%, 66% 100%, 0 100%, 0 34%)')} ${rot('@var(--rot)')} @random(0.35) { ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Shatter', 33, "Mixtape's whole library at once - corner circles, half-square triangles, a centred disc - and one cell in five raked through with cut slots.", (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(`@pick(${CORNER}, ${TRI}, circle(50% at 50% 50%))`)} @random(0.2) { ${slotMask('45deg', '7%', '17%')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Scramble', 19, 'Each square gives up one of its four quadrants, so the field reads as a wall of L-shapes turning every which way.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(polygon(0 0, 50% 0, 50% 50%, 100% 50%, 100% 100%, 0 100%), polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%), polygon(50% 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%), polygon(0 0, 100% 0, 100% 100%, 50% 100%, 50% 50%, 0 50%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Cascade', 34, 'A three-tread staircase cut from every square, the flight turning to face a new quarter each cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 34% 0, 34% 34%, 67% 34%, 67% 67%, 100% 67%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Skewblock', 22, 'Parallelograms leaning one way or the other, packing into a field that shears as you read across it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(26% 0, 101% 0, 75% 101%, 0 101%)')} ${xf('scaleX(@pick(1, -1))')} }${TR}`,
}), { grid: '10x15', tg: '8x8' });

add('Drift', 26, 'Triangles all leaning the same way within a row and flipping on the next, with the odd contrary tile drifting through.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 101% 0, 0 101%)')} @match(@y % 2 == 1) { ${cp('polygon(101% 0, 101% 101%, 0 101%)')} } @random(0.28) { ${cp('polygon(0 0, 101% 0, 101% 101%)')} } }${TR}`,
}), { grid: '10x15', tg: '8x8' });

// ══════════════════════════════════════════════════════════════════════════
// B. After Bloks and Ring - turned blocks under the Shadow switch, and rings
//    breached so the gap walks around the rim.
// ══════════════════════════════════════════════════════════════════════════

add('Cupola', 17, 'Domed blocks turning to face all four quarters, each one rolled a quarter turn from its neighbour.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; border-radius: 100% 100% 0 0; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Lagoon', 38, 'Thick rings breached on one side, the gap swinging round the rim from cell to cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { width: 82%; height: 82%; margin: 9%; border-radius: 50%; background: ${ink(c)}; ${ringMask('56%')} ${cp('polygon(0 0, 100% 0, 100% 42%, 56% 42%, 56% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

// ══════════════════════════════════════════════════════════════════════════
// C. Mouldings & openings - the profiles a mason cuts, and the holes a wall is
//    built around.
// ══════════════════════════════════════════════════════════════════════════

add('Scotia', 11, 'The scotia - a quarter-round hollow scooped out of the block, its arc springing from one corner of the cell and landing on the next.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(coveBite(100, 'tl'))} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Spandrel', 6, 'The spandrel - the triangle of wall left over where an arch meets its square frame.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%)')} ${msk('radial-gradient(circle farthest-side at 50% 100%, transparent 74%, #000 74%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Mullion', 4, 'Tall lights divided by mullions - three panes to an opening, the divisions cut, not drawn.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`inset: 6%; background: ${ink(c)}; ${slotMask('90deg', '28%', '34%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Cavetto', 55, 'A hollow quarter-round run along the edge of every block, turning corner by corner.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; border-radius: 0 0 0 100%; ${rot('@var(--rot)')} @random(0.3) { border-radius: 0 0 100% 100%; } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ══════════════════════════════════════════════════════════════════════════
// D. Rulings - what happens when two sets of parallel lines meet.
// ══════════════════════════════════════════════════════════════════════════

add('Moire', 23, 'Two rulings laid over each other a few degrees apart, so the beat between them draws its own pattern.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${slotMask('0deg', '5%', '11%')}`)} ${A(`inset: 0; background: ${ink(c)}; ${slotMask('@pick(6deg, 84deg, 96deg)', '5%', '11%')} opacity: 0.75;`)} }${TR}`,
}), { grid: '4x6', tg: '4x4' });

add('Schist', 12, 'Schistosity: parallel planes of mica that split the rock into sheets.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; background: ${ink(c)}; ${slotMask('@pick(4deg, 8deg, 172deg, 176deg)', '9%', '21%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ══════════════════════════════════════════════════════════════════════════
// E. Type & print - the shapes a compositor thinks in.
// ══════════════════════════════════════════════════════════════════════════

add('Kern', 45, 'Two letters tucked into each other\'s space until the gap between them reads even.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 54% 0, 6% 100%, 0 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(58% 0, 100% 0, 100% 100%, 46% 100%)')}`)} ${xf('scaleX(@pick(1, -1))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Quire', 56, 'Folded sheets nested inside one another, the way a gathering is made up before it is sewn.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 4%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 22%, 22% 22%, 22% 100%, 0 100%)')}`)} ${A(`inset: 32%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 30%, 30% 30%, 30% 100%, 0 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ══════════════════════════════════════════════════════════════════════════
// F. Stone - what a rock looks like when you cut it open.
// ══════════════════════════════════════════════════════════════════════════

add('Karst', 60, 'Limestone pavement: solid clints with the grikes weathered clean through between them.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(polygon(0 0, 88% 0, 100% 88%, 12% 100%), polygon(10% 0, 100% 6%, 92% 100%, 0 90%), polygon(0 8%, 90% 0, 100% 92%, 8% 100%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ══════════════════════════════════════════════════════════════════════════
// G. Folded paper & machined parts - a sheet creased, and a part bored.
// ══════════════════════════════════════════════════════════════════════════

add('Miura', 58, 'The Miura fold: a tessellation of parallelograms that opens and closes in one pull.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(18% 0, 101% 0, 83% 101%, 0 101%)')} @match(@y % 2 == 1) { ${cp('polygon(0 0, 83% 0, 101% 101%, 18% 101%)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Waterbomb', 32, 'The waterbomb base: a square creased on both diagonals and collapsed to a triangle.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 50% 50%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 100%, 100% 100%, 50% 50%)')}`)} ${rot(R4)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Crease', 53, 'A crease pattern: the mountain and valley lines drawn before anything is folded.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(100% 0, 100% 100%, 0 100%)')} opacity: 0.7;`)} ${rot(R4)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Keyway', 50, 'A shaft with its keyway cut: a bore with one square notch broached out of the wall.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${A(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${ringMask('62%')} ${cp(withHole(rectHole(42, 4)))} ${rot('@var(--rot)')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Gasket', 33, 'A gasket blank: the sealing face with its bore and a ring of bolt holes punched round it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${ringMask('42%')} ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 42%, #000 42%), radial-gradient(circle at 50% 50%, transparent 12%, #000 12%) 0 0 / 25% 25%')} -webkit-mask-composite: source-in; mask-composite: intersect;`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

if (all.length !== 24) {
  throw new Error(`batch 7 must hold exactly 24 designs, found ${all.length}`);
}

export const batch7 = all;
