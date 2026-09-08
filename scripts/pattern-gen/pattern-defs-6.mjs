// Batch 6 - 19 *ordered*, background-independent motifs (gallery orders 620+).
//
// Two rules separate this batch from everything before it.
//
// 1. Nothing is placed at random. Where earlier batches lean on scatter
//    (Confetti, Shard and Sprinkles roll a fresh position, size and angle for
//    every cell), every shape here sits on the cell grid, and what varies from
//    cell to cell varies by *rule* - `@match` on the cell's column/row/index,
//    `@pn()` cycling a value in order, or `@calc()` ramping a size, angle or
//    bore across the canvas. Redraws re-ink the pattern (colors are still
//    sampled per cell) but never rearrange it, so a reseed reads as a new
//    colorway of the same design.
//
// 2. Nothing is painted in the background color. A design that knocks a hole
//    out of its shapes with `var(--color0)` looks right only while the
//    background is opaque: set the background slot to transparent (the editor
//    writes `#rrggbb00`) and those "holes" stop erasing anything, because
//    painting transparent over ink leaves the ink. So every gap here is real
//    geometry - a clip-path hole, a mask, a border, or a gap between two
//    shapes - and the style half never references `var(--color0)` at all
//    (generate-batch6.mjs enforces this). Each design renders identically over
//    any background, including none.
//
// House rules (matching every earlier batch):
//   * reseed variation rides on a transition-able, *sampled* property -
//     background-color or border-color - so recolors morph;
//   * a randomized custom prop used more than once is read via @var(--x);
//   * every rule paints through @random(${shapeFrequency}) - including the
//     @match branches, so the frequency slider still thins the field - and
//     ends in a transition.

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
const B = (css) => `:before { content: ''; position: absolute; ${css}${pt} }`;
const A = (css) => `:after { content: ''; position: absolute; ${css}${pt} }`;

// ── real holes, not painted-over ones ──────────────────────────────────────
// A polygon whose outer ring runs clockwise and whose inner ring runs
// counter-clockwise, joined by a zero-width slit: under the nonzero fill rule
// the inner ring is a genuine hole, so whatever is behind the canvas shows
// through it.
const P = (pts) => pts.map(([x, y]) => `${(+x).toFixed(1)}% ${(+y).toFixed(1)}%`).join(', ');
const withHole = (inner) =>
  `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${P(inner)}, ${P([inner[0]])})`;

// Centered rectangular hole inset `x`% horizontally and `y`% vertically.
const rectHole = (x, y) => [
  [x, y],
  [x, 100 - y],
  [100 - x, 100 - y],
  [100 - x, y],
];

// Centered slot with semicircular ends (upright).
const stadiumHole = (x, y, steps = 10) => {
  const rx = 50 - x;
  const top = y + rx;
  const bottom = 100 - y - rx;
  const pts = [[50 - rx, top]];
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI - (Math.PI * i) / steps;
    pts.push([50 + rx * Math.cos(a), bottom + rx * Math.sin(a)]);
  }
  for (let i = 0; i <= steps; i++) {
    const a = -(Math.PI * i) / steps;
    pts.push([50 + rx * Math.cos(a), top + rx * Math.sin(a)]);
  }
  return pts;
};

// Lay a hole on its side. Swapping x/y mirrors the ring, which flips its
// winding, so the point order has to be reversed to keep it a hole.
const transposeRing = (pts) => pts.map(([x, y]) => [y, x]).reverse();

// A square with a quarter-circle bite taken out of one corner. A single closed
// loop, so the winding doesn't matter and mirroring is free.
const coveBite = (r, corner = 'tl', steps = 14) => {
  const pts = [[100, 0], [100, 100], [0, 100], [0, r]];
  for (let i = 0; i <= steps; i++) {
    const a = (Math.PI / 2) * (i / steps);
    pts.push([r * Math.sin(a), r * Math.cos(a)]);
  }
  const flipX = corner === 'tr' || corner === 'br';
  const flipY = corner === 'bl' || corner === 'br';
  return `polygon(${P(
    pts.map(([x, y]) => [flipX ? 100 - x : x, flipY ? 100 - y : y])
  )})`;
};

// A ring with a genuinely transparent bore: the fill stays a plain,
// transition-able background-color and the mask cuts the hole. `bore` is a
// percentage of the cell's short side, so the ring holds its proportions at
// any canvas size (unlike a px border).
const ringMask = (bore) =>
  `-webkit-mask: radial-gradient(circle closest-side at 50% 50%, transparent ${bore}, #000 ${bore}); mask: radial-gradient(circle closest-side at 50% 50%, transparent ${bore}, #000 ${bore});`;

// Palette bank (color0 = background). Spans neon, jewel, earth, pastel, mono,
// retro and forest families so the gallery stays varied; palettes may repeat.
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
];

const TAKEN = new Set(
  (
    // Every motif name used anywhere in the project so far: the shipped
    // patterns, the gallery thumbnail table, and batches 1-5's definition
    // files (including entries that were trimmed before shipping).
    'abacus acorn amphora aperture arcade argyle arrow arrowplay ascent aster ' +
    'asterisk aurora awning azulejo balloon barcode bargello barline basalt ' +
    'basket baste battlement bauhaus beadrow bee bento berry bevel beveled ' +
    'bezel billow bloks bloom blossom bobbin bokeh bolt bond bowl bowtie ' +
    'boxweave bracket bracketpair bramble brickwork brokenbond bubble bubbles ' +
    'bud bulge bunting buoy burgee button cairn caltrop caneweave capsule ' +
    'caret carousel cartouche cattail caustic celleye chaff chalice chamfer ' +
    'checkers checkmark chevarrow chevrondiamond chime cinch circuit cirrus ' +
    'citrus cleat clover cog coil cointile comb comet compass confetti ' +
    'constellation convex coral cornerpunch crater crazy crescendo crescent ' +
    'cresset crossbar crosshair crosshatch crosslet crux crystal cube cumulus ' +
    'curl cusp dapple dart daybreak delta diadem diadot dial diamond3d ' +
    'diamonddust diamondeye diamondframe diaper discus disque dogtooth dome ' +
    'domino dotdash dotwave doubinset draughts driftleaf drizzle dune echo ' +
    'edgeband elbow ell emboss enso eyelet facade facetbox facetdiamond ' +
    'facetgrad fang fanlight fin fishscale flagstone flight flutter foliage ' +
    'fourpane frame frameblock freckle frond fuzz gable gablet gem gemcut ' +
    'gibbous gingham glint glitch glyph grain granule grassblade gridline ' +
    'gumball halfblock halfdot halfink halfpenny halftone halo harlequin ' +
    'hashmark hatch heart herringbone hexagram hexbloom hexdot hexnut hextile ' +
    'hoop hopscotch hourglass ibeam impasto incense inkblot inset insetstep ' +
    'iris ivy jelly jewel junction kasuri keyhole keypad keywork kilim ' +
    'kintsugi kite koi ladybird lantern lattice laundry ledger lens levels ' +
    'lily links lobe logcabin loophole lotus lozenge lozengegrad lune macaron ' +
    'maltese mandorla massif matchstick matte maze meadow medusa memphis ' +
    'meridian merlon mesh metro mirror misprint mistwave mixtape monolith ' +
    'moonphase morse mosaicglass mosaictile mote mudcloth needle neon ' +
    'northstar notch notchbar notchblock octagon octant odessa offset ' +
    'offsetbox orb orbit origami paisley palmette parquet passepartout patina ' +
    'pavers pebble pebbledot pediment pellet pendulum pennant pennantbox ' +
    'pennon penta pentafan petal picket pinhex pinhole pinion pinmark ' +
    'pinnacle pinnate pinweave pinwheel pinwheelstar pinwheeltile ' +
    'pinwheelweave pip pixel plaid plasma pleat plumb plus pod polaroid polka ' +
    'polkapair pompom pondring popsicle portal postage posy prisma prismfold ' +
    'prow pulsar pulsebar pyramid pyramid3d quadrant quadrille quarterbar ' +
    'quarterblock quartz quasar quaver quilt quiltsquare quincunx quoit radar ' +
    'radius rail rainbow raindrop rake range regatta rhomboid ribbonfold ' +
    'ricrac ring ringdot ringlink ripple rondure roundel rune rungs saguaro ' +
    'sail saltire sash sawedge scale scallop scatterdot sector seigaiha ' +
    'sequin sextant shard shelf shibori shield shoji shuffle sigil signal ' +
    'sine sixstar skew slant slat sliver snowflake sonata spark sparkle ' +
    'spearhead spectrum spiralblock spire splat splithz splittri spore sprig ' +
    'sprinkles sprocket sprout stackbond star5 starflake starlet stave stella ' +
    'step step3d stipple stitch strata sunburst sunken sunwheel swellbox ' +
    'switchback symmetry tag tally target tatami tee tendril terrain tesserae ' +
    'tetro thistle tickmark tictac tilt trace trackline trapeze trapezoid ' +
    'trellis trianglet triband trigram triquetra trishard truchet tube tumble ' +
    'tweed twill twinkle vee veil venn vinyl vitrail voltage wander warp wash ' +
    'wavelet weave weft wheelarc wicket windowframe windowpane wingtri ' +
    'zagtile zee ziggurat ziggy zigline zigzagfold zipper'
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

let order = 620;
const all = [];
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 6: ${slug}`);
  const palette = PAL[palIdx % PAL.length];
  const c = palette.length;
  const { vars, rule } = build(c);
  const code = `${vars} ${rule}`;
  if (/@rand\s*\(|@r\s*\(/.test(code)) {
    throw new Error(`${slug}: batch 6 is the ordered batch - @rand() is not allowed`);
  }
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

// ════════════════════════════════════════════════════════════════════════════
// A. Ribs & bands
// ════════════════════════════════════════════════════════════════════════════

add('Louvre', 44, 'Angled shutter slats set at one constant tilt, so the whole canvas rakes the same way and only the finish changes. The gaps between slats are open, not painted.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 22%, 100% 0, 100% 78%, 0 100%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Kerf', 21, 'Saw slots cut clean through solid blocks, the kerf biting from the top on one row and the bottom on the next.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 44% 0, 44% 58%, 56% 58%, 56% 0, 100% 0, 100% 100%, 0 100%)')} @match(@y % 2 == 1) { ${cp('polygon(0 0, 100% 0, 100% 100%, 56% 100%, 56% 42%, 44% 42%, 44% 100%, 0 100%)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// B. Checkers, bonds & tilings
// ════════════════════════════════════════════════════════════════════════════

add('Damier', 19, 'A strict checkerboard - filled squares keyed to their neighbours, the open squares holding a single pip so the field still reads when the ground drops away.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; @even { background: transparent; ${A(`inset: 30%; background: ${ink(c)};`)} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Bias', 5, 'Every square cut corner to corner, the seam flipping with the checker so the field reads as one running diagonal.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')}`)} @even { :after { ${cp('polygon(100% 0, 100% 100%, 0 100%)')} } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Hurdle', 25, 'Woven hurdle fencing: flat laths lying across the grain on one square and along it on the next.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 2%; top: 22%; width: 96%; height: 56%; background: ${ink(c)};`)} @even { :after { left: 22%; top: 2%; width: 56%; height: 96%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Isocube', 39, 'Tumbling blocks: one hexagon per cell shaded as a lit top and two falling sides, stacking into an isometric wall.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)')} ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(50% 0, 100% 25%, 50% 50%, 0 25%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(50% 50%, 100% 25%, 100% 75%, 50% 100%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// C. Frames & architecture
// ════════════════════════════════════════════════════════════════════════════

add('Lintel', 34, 'A post-and-lintel opening cut from every block, the doorways lining up into a colonnaded wall.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 72% 100%, 72% 28%, 28% 28%, 28% 100%, 0 100%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Lunette', 45, 'Half-round lunette windows, each pair of panes parted by an open glazing bar rather than a painted one.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 5%; top: 18%; width: 43%; height: 78%; border-radius: 999px 0 0 0; background: ${ink(c)};`)} ${A(`left: 52%; top: 18%; width: 43%; height: 78%; border-radius: 0 999px 0 0; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// D. Rounds & arcs
// ════════════════════════════════════════════════════════════════════════════

add('Annulus', 36, 'Rings that thicken row by row down the canvas - the same circle, walked through its whole range, bored right through.', (c) => ({
  vars: '',
  rule: `${F} { width: 92%; height: 92%; margin: 4%; border-radius: 50%; background: ${ink(c)}; ${ringMask('@calc(66 - 46 * @y / @Y)%')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Ovolo', 5, 'Quarter-round mouldings turning one corner clockwise per cell, so the field marches through all four faces.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: 100% 0 0 0; ${rot('@pn(0deg, 90deg, 180deg, 270deg)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Cove', 36, 'A deep circular scoop cut out of every block, the cove swapping to the opposite corner on alternate rows.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(coveBite(66, 'tl'))} @match(@y % 2 == 1) { ${cp(coveBite(66, 'br'))} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// E. Joinery & plates
// ════════════════════════════════════════════════════════════════════════════

add('Mortise', 30, 'A mortise cut square through each block, standing upright in one column and lying flat in the next.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(withHole(rectHole(34, 18)))} @match(@x % 2 == 1) { ${cp(withHole(rectHole(18, 34)))} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Rafter', 18, 'One diagonal member per cell, meeting end to end into unbroken raking stripes.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 58%, 58% 0, 100% 0, 100% 42%, 42% 100%, 0 100%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// F. Cloth
// ════════════════════════════════════════════════════════════════════════════

add('Ogee', 19, 'An ogee lattice - every tile rounded on one pair of opposite corners, flipping with the checker to draw the onion curve.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: 100% 0 100% 0; @even { border-radius: 0 100% 0 100%; } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Buttonhole', 24, 'Worked buttonholes cut right through the placket, upright in one column and crosswise in the next.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(withHole(stadiumHole(30, 14)))} @match(@x % 2 == 1) { ${cp(withHole(transposeRing(stadiumHole(30, 14))))} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// G. Print & measures
// ════════════════════════════════════════════════════════════════════════════

add('Gutter', 28, 'Two text columns with a clean gutter between them, the page grid repeated spread after spread.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 6%; top: 8%; width: 38%; height: 84%; background: ${ink(c)};`)} ${A(`left: 56%; top: 8%; width: 38%; height: 84%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// H. Ramps & optical order
// ════════════════════════════════════════════════════════════════════════════

add('Diminuendo', 18, 'A field of squares fading out row by row on a straight ramp, top to bottom, without a single step out of place.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; opacity: @calc(0.14 + 0.86 * @y / @Y); background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Taper', 12, 'Squares growing steadily from left to right, each column exactly one step larger than the last.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(14 + 72 * @x / @X)%; height: @calc(14 + 72 * @x / @X)%; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Torsion', 13, 'One square per cell, each turned a fixed fraction further than its neighbour, so the grid twists a full quarter-turn corner to corner.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 12%; background: ${ink(c)}; ${rot('@calc(90 * (@x + @y) / (@X + @Y))deg')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

export const batch6 = all;
