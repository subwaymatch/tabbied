// Batch 5 — 200 structurally-distinct motifs (gallery orders 410+).
//
// Every entry is its own shape / composition: a different primitive,
// subdivision, symmetry or tiling. Palettes may repeat across designs (they are
// different artworks), but no motif repeats — and none repeats a motif shipped
// in batches 1–4 or the originals (see TAKEN below, which the add() helper
// enforces).
//
// House rules (matching every earlier batch):
//   * reseed variation rides on a transition-able, *sampled* property —
//     background-color, transform, clip-path, opacity, border or border-radius
//     — never a gradient alone (gradients can't transition and would snap);
//   * a randomized custom prop used more than once is read via @var(--x);
//   * every rule paints through @random(${shapeFrequency}) and ends in a
//     transition so reseeds morph instead of snapping.

const isDark = (hex) => {
  const m = /^#([0-9a-f]{6})/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255 < 0.5;
};

// Ink picker over color1..color(c-1) (color0 is the background).
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
const R2 = '@pick(0deg, 90deg)';
const R4 = '@pick(0deg, 90deg, 180deg, 270deg)';
const R8 = '@pick(0deg, 45deg, 90deg, 135deg, 180deg, 225deg, 270deg, 315deg)';

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
    // originals + batches 1–4 (shipped and trimmed library names), so batch 5
    // never reuses a motif name/slug from anywhere in the project.
    'radius mixtape odessa symmetry veil blossom disque bloks terrain trigram ' +
    'ring maze pinwheel confetti foliage metro polka stitch weave ziggy pebble ' +
    'morse sparkle vitrail tesserae sprinkles glyph wander comet ziggurat curl ' +
    'baste prisma crescendo echo circuit daybreak shard quilt petal lantern ' +
    'plasma domino ivy neon bokeh shuffle aster aperture bauhaus halftone elbow ' +
    'bento grain misprint zipper notch awning polaroid carousel windowpane matte ' +
    'spectrum coil lens hourglass northstar bracket tetro merlon ibeam ' +
    'spiralblock tictac pennantbox crosshatch rungs picket lattice caltrop ' +
    'sawedge switchback battlement facetgrad prismfold ' +
    'arrowplay ascent asterisk bargello beveled brickwork bulge cartouche ' +
    'caustic chalice chevrondiamond compass crescent crosslet dart diamonddust ' +
    'diamondframe dune eyelet fanlight fishscale flight fourpane gablet halo ' +
    'harlequin herringbone hexagram hexbloom inset jewel junction keypad ' +
    'keywork kite maltese moonphase mosaicglass octant offset orb parquet ' +
    'passepartout pennant pinion pinwheelstar pinwheelweave plus portal pyramid ' +
    'quadrille quartz quasar range ribbonfold ricrac saltire scallop sector ' +
    'sextant skew spire stackbond starflake sunburst tally target trackline ' +
    'trapeze triquetra truchet tumble venn vinyl weft wicket zee zigline ' +
    'abacus amphora arcade argyle aurora azulejo balloon barcode basalt bee ' +
    'bowtie bramble bubbles bunting buoy button cairn checkers chime cirrus ' +
    'citrus cog constellation coral crater cumulus dial drizzle enso facade ' +
    'flutter gable gem gingham glitch gumball hatch hopscotch impasto incense ' +
    'inkblot jelly kilim kintsugi koi ladybird laundry levels lily links macaron ' +
    'massif matchstick meadow medusa memphis meridian mirror monolith mudcloth ' +
    'orbit origami paisley patina pendulum pleat pompom popsicle postage posy ' +
    'pulsar radar rainbow rake regatta ripple saguaro sash seigaiha shelf shibori ' +
    'shoji sigil signal sine sonata splat sprout stella strata trellis voltage wash'
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

let order = 410;
const all = [];
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 5: ${slug}`);
  const palette = PAL[palIdx % PAL.length];
  const c = palette.length;
  const { vars, rule } = build(c);
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
    thumb: { grid: cfg.tg ?? '5x5', frequency: cfg.tf ?? 0.92 },
    vars,
    rule,
  });
};

// ════════════════════════════════════════════════════════════════════════════
// A. Arcs, rings & circles
// ════════════════════════════════════════════════════════════════════════════

add('Lune', 0, 'Slim crescents bitten by an offset disc, the shadow swinging to a new diagonal each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { width: 84%; height: 84%; margin: 8%; border-radius: 50%; background: ${ink(c)}; ${rot('@var(--rot)')} :after { content: ''; position: absolute; @size: 100%; left: 32%; top: -32%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Hoop', 2, 'Clean open rings floating on the grid, each hoop re-inking on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { width: 86%; height: 86%; margin: 7%; border-radius: 50%; background: ${ink(c)}; :after { content: ''; position: absolute; inset: 28%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Pellet', 4, 'A field of small discs swelling and shrinking from cell to cell, re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: @rand(28%, 76%); ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Capsule', 8, 'Rounded pills laid in rows, each capsule tipping upright or flat and re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { width: 80%; height: 40%; margin: 30% 10%; border-radius: 999px; background: ${ink(c)}; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Quaver', 1, 'Quarter-disc fills tucked into a rotating corner, the wedge spinning to a new corner each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('circle(96% at 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pip', 9, 'Concentric dot-in-ring targets, the bullseye re-colouring against its halo on reseed.', (c) => ({
  vars: '',
  rule: `${F} { width: 84%; height: 84%; margin: 8%; border-radius: 50%; background: ${ink(c)}; :after { content: ''; position: absolute; inset: 32%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Wheelarc', 3, 'Three-quarter arcs leaving a gap that rolls around the rim each redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { width: 84%; height: 84%; margin: 8%; border-radius: 50%; background: ${ink(c)}; ${rot('@var(--rot)')} ${cp('polygon(0 0, 100% 0, 100% 100%, 50% 100%, 50% 50%, 0 50%)')} }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Iris', 14, 'A soft glowing eye — a bright pupil ringed by a luminous halo, pulsing colour on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 30%; margin: -15%; border-radius: 50%; background: ${ink(c)}; box-shadow: 0 0 calc(70px / @Y) calc(16px / @Y) ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.88 });

add('Bowl', 11, 'Half-discs nested like stacked bowls, the cup swinging to a new edge each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { width: 88%; height: 88%; margin: 6%; border-radius: 0 0 999px 999px; background: ${ink(c)}; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Cinch', 20, 'Twin arcs pinched at the waist into a bowtie of curves, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { overflow: hidden; ${rot('@var(--rot)')} :before { content: ''; position: absolute; @size: 130%; left: -65%; top: -15%; border-radius: 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; @size: 130%; right: -65%; top: -15%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Rondure', 6, 'Plump discs packed tight with a small punched centre, re-inking ring and core on reseed.', (c) => ({
  vars: '',
  rule: `${F} { width: 94%; height: 94%; margin: 3%; border-radius: 50%; background: ${ink(c)}; :after { content: ''; position: absolute; inset: 40%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Loophole', 17, 'Squared rings with rounded inner cut-outs, each frame re-glazing on reseed.', (c) => ({
  vars: '',
  rule: `${F} { width: 90%; height: 90%; margin: 5%; border-radius: 22%; background: ${ink(c)}; :after { content: ''; position: absolute; inset: 26%; border-radius: 40%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Halfpenny', 23, 'Coins half-sunk past the edge, the visible arc rotating to a new side each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { overflow: hidden; ${rot('@var(--rot)')} :after { content: ''; position: absolute; @size: 150%; left: -25%; top: 55%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Mandorla', 38, 'Pointed almond eyes formed where two circles cross, the lens re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 90% 50%, 50% 100%, 10% 50%)')} border-radius: 50%; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.92 });

add('Roundel', 19, 'Bold target roundels of two concentric tones, re-banding their colours on each seed.', (c) => ({
  vars: '',
  rule: `${F} { width: 92%; height: 92%; margin: 4%; border-radius: 50%; background: ${ink(c)}; :before { content: ''; position: absolute; inset: 22%; border-radius: 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; inset: 42%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Gibbous', 24, 'Discs gnawed by a curved bite from the side, the crescent shadow sliding on reseed.', (c) => ({
  vars: '',
  rule: `${F} { width: 84%; height: 84%; margin: 8%; border-radius: 50%; background: ${ink(c)}; :after { content: ''; position: absolute; @size: 100%; left: @pick(-46%, -24%, 24%, 46%); top: 0; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Cresset', 32, 'A bright bead set in a deep ring socket, each lamp re-lighting its colour on reseed.', (c) => ({
  vars: '',
  rule: `${F} { width: 86%; height: 86%; margin: 7%; border-radius: 50%; background: ${ink(c)}; :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 30%; margin: -15%; border-radius: 50%; background: ${ink(c)}; box-shadow: 0 0 calc(40px / @Y) ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Quoit', 41, 'Flat throwing rings overlapping in a loose stack, each quoit re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { width: 96%; height: 64%; margin: 18% 2%; border-radius: 999px; background: ${ink(c)}; ${rot('@var(--rot)')} :after { content: ''; position: absolute; inset: 22%; border-radius: 999px; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Pebbledot', 7, 'Soft rounded blobs scattered dense, each pebble re-rounding and re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `${F} { width: 86%; height: 86%; margin: 7%; background: ${ink(c)}; border-radius: @rand(38%, 50%) @rand(38%, 50%) @rand(38%, 50%) @rand(38%, 50%); }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Bezel', 30, 'Gem-set discs ringed by a contrasting bezel, the stone re-cutting its colour on reseed.', (c) => ({
  vars: '',
  rule: `${F} { width: 88%; height: 88%; margin: 6%; border-radius: 50%; background: ${ink(c)}; border: calc(20px / @Y) solid var(--color0); box-sizing: border-box; :after { content: ''; position: absolute; inset: 34%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Lobe', 45, 'Quarter-round leaves curling from one corner, the petal spinning to a new corner each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { width: 92%; height: 92%; margin: 4%; background: ${ink(c)}; border-radius: 0 100% 0 100%; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Discus', 13, 'Tilted ovals catching the throw mid-spin, each discus re-angling and re-inking on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { width: 92%; height: 50%; margin: 25% 4%; border-radius: 50%; background: ${ink(c)}; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

// ════════════════════════════════════════════════════════════════════════════
// B. Triangles, chevrons & wedges
// ════════════════════════════════════════════════════════════════════════════

add('Prow', 5, 'Bold triangles aimed like ships’ prows, each one swinging to a new heading on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 6%, 94% 94%, 6% 94%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Fin', 10, 'Right-angle fins filling a corner, the blade spinning to a new corner each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Caret', 18, 'Thick chevrons stacking into arrowed columns, re-pointing and re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 4%, 50% 42%, 100% 4%, 100% 36%, 50% 74%, 0 36%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Needle', 31, 'Slender spikes radiating at shifting angles, each needle re-aiming on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 64% 100%, 36% 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pinnacle', 16, 'Sharp peaks rising from the baseline, the summits re-shading like a far range on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 8%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pennon', 21, 'Long triangular pennants pointing off the grid, each flag re-aiming and re-inking on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 50%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Cusp', 33, 'Notched arrowheads with a bitten base, the barb rotating to a new quarter each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 100% 100%, 50% 66%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Spearhead', 13, 'Slim spear blades on the diagonal, each head re-angling and re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 78% 46%, 50% 100%, 22% 46%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pediment', 34, 'Low wide gable triangles like temple pediments, re-shading on each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 26%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Splittri', 6, 'Squares sliced corner to corner into two colours, the seam flipping diagonal on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${rot('@var(--rot)')} :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')}${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Dogtooth', 28, 'Interlocking hound’s-tooth notches re-keying their teeth on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 60% 0, 60% 40%, 100% 40%, 100% 100%, 40% 100%, 40% 60%, 0 60%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Wingtri', 9, 'Paired triangles flaring open like wings, each pair re-spreading its colours on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 46% 50%, 0 100%)')}${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(100% 0, 54% 50%, 100% 100%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Fang', 36, 'Triangles hanging from the top edge like fangs, each tooth re-pointing on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 50% 72%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Zagtile', 22, 'Triangles flipping point-up and point-down across the field into a running zigzag on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 100%, 50% 0, 100% 100%)')} } @match((@x + @y) % 2 == 0) { ${cp('polygon(0 0, 50% 100%, 100% 0)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Burgee', 42, 'Swallow-tailed signal flags, each burgee re-aiming and re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 50%, 0 100%, 28% 50%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Vee', 44, 'Solid V notches biting into the field, the wedge re-aiming on each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 24% 0, 50% 46%, 76% 0, 100% 0, 50% 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Delta', 19, 'Triangles with a punched-out core like outlined deltas, re-inking the frame on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 6%, 94% 94%, 6% 94%)')} ${rot('@var(--rot)')} :after { content: ''; position: absolute; inset: 30%; background: var(--color0); ${cp('polygon(50% 6%, 94% 94%, 6% 94%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Sail', 40, 'Right-triangle sails with one curved leech, the canvas re-trimming on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 100%, 0 100%)')} border-radius: 0 0 0 70%; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pinnate', 25, 'Rows of leaflet triangles alternating up the stem, re-shading frond by frond on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 50%, 100% 0, 100% 100%)')} } @match(@y % 2 == 0) { ${cp('polygon(100% 50%, 0 0, 0 100%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

add('Cleat', 37, 'Double chevrons stacked like cleats, the brackets re-pointing on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 30% 0, 50% 30%, 70% 0, 100% 0, 100% 30%, 50% 60%, 100% 60%, 100% 90%, 50% 100%, 0 90%, 0 60%, 50% 60%, 0 30%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.92 });

add('Trishard', 1, 'Scattered triangular shards in random spin and shade, re-shattering on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(@rand(0%, 30%) @rand(0%, 30%), @rand(70%, 100%) @rand(0%, 40%), @rand(20%, 100%) @rand(70%, 100%))')} opacity: @rand(0.7, 1); }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Quadrant', 3, 'Triangles pointing in to the centre from each edge, the arrow re-aiming on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 50% 50%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

// ════════════════════════════════════════════════════════════════════════════
// C. Polygons, diamonds & stars
// ════════════════════════════════════════════════════════════════════════════

add('Lozenge', 8, 'Plain diamonds packed point to point, each lozenge re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 4%, 96% 50%, 50% 96%, 4% 50%)')} opacity: @rand(0.78, 1); }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Trapezoid', 12, 'Stacked trapezoids tapering in alternating directions, re-shading on each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp('polygon(22% 14%, 78% 14%, 100% 86%, 0 86%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Hextile', 14, 'A honeycomb of solid hexagons, each cell re-glazing its colour on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 74%, 5% 26%)')} opacity: @rand(0.8, 1); }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

add('Penta', 30, 'Upright pentagons tiling in rows, each one re-inking on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 4%, 96% 40%, 78% 96%, 22% 96%, 4% 40%)')} opacity: @rand(0.8, 1); }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Sixstar', 0, 'Six-point stars from two crossed triangles, the colours swapping between blades on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(50% 4%, 93% 78%, 7% 78%)')}${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(50% 96%, 7% 22%, 93% 22%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Octagon', 27, 'Clean octagons with grouted gaps, each tile re-glazing on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(30% 4%, 70% 4%, 96% 30%, 96% 70%, 70% 96%, 30% 96%, 4% 70%, 4% 30%)')} opacity: @rand(0.82, 1); }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pinhex', 15, 'Hollow hexagon rings nested in the comb, re-tinting their frames on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 74%, 5% 26%)')} :after { content: ''; position: absolute; inset: 28%; background: var(--color0); ${cp('polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 74%, 5% 26%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.92 });

add('Diadem', 32, 'Diamonds set with a smaller diamond core, re-jewelling their two tones on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 4%, 96% 50%, 50% 96%, 4% 50%)')} :after { content: ''; position: absolute; inset: 30%; background: ${ink(c)}; ${cp('polygon(50% 4%, 96% 50%, 50% 96%, 4% 50%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Crystal', 38, 'Tall faceted gems standing upright, each crystal re-cutting its colour on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 2%, 88% 30%, 88% 72%, 50% 98%, 12% 72%, 12% 30%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Facetbox', 11, 'Squares split into four triangular facets, the panes re-lighting on each seed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 50% 50%)')}${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(0 100%, 100% 100%, 50% 50%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Starlet', 13, 'Four-point stars sparkling at shifting angles, re-pointing on each seed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Slant', 23, 'Thin slanted bars leaning in one shear, each stroke re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp('polygon(38% 0, 70% 0, 62% 100%, 30% 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Gemcut', 9, 'Diamonds scored with a bright facet line, the cut re-catching the light on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 4%, 96% 50%, 50% 96%, 4% 50%)')} :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(50% 4%, 96% 50%, 50% 50%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Spark', 46, 'Eight-point sparks burning at the centre of each cell, re-pointing on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Diadot', 41, 'A net of tiny centred diamonds, each pip re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: @rand(40%, 72%); ${xf('translate(-50%, -50%)')} background: ${ink(c)}; ${cp('polygon(50% 0, 100% 50%, 50% 100%, 0 50%)')}${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Pentafan', 35, 'Pentagons nested two-deep, the inner face re-colouring against its frame on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 4%, 96% 40%, 78% 96%, 22% 96%, 4% 40%)')} :after { content: ''; position: absolute; inset: 28%; background: ${ink(c)}; ${cp('polygon(50% 4%, 96% 40%, 78% 96%, 22% 96%, 4% 40%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.92 });

add('Shield', 19, 'Heraldic shields with a smaller inner escutcheon, re-blazoning their tinctures on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(8% 6%, 92% 6%, 92% 58%, 50% 96%, 8% 58%)')} :after { content: ''; position: absolute; inset: 26%; background: ${ink(c)}; ${cp('polygon(8% 6%, 92% 6%, 92% 58%, 50% 96%, 8% 58%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Diaper', 2, 'A diamond lattice of fine outlines, each rhombus re-inking its frame on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 100% 50%, 50% 100%, 0 50%)')} :after { content: ''; position: absolute; inset: 12%; background: var(--color0); ${cp('polygon(50% 0, 100% 50%, 50% 100%, 0 50%)')}${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Sunwheel', 0, 'A square crossed with a turned square into an eight-point sun, re-spinning on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; inset: 16%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; inset: 16%; background: ${ink(c)}; ${xf('rotate(45deg)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Rhomboid', 21, 'Full slanted squares leaning together, each parallelogram re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(28% 0, 100% 0, 72% 100%, 0 100%)')} opacity: @rand(0.8, 1); }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Trianglet', 24, 'A scatter of tiny centred triangles in varying size and spin, re-seeding their shower each redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: @rand(40%, 78%); ${xf('translate(-50%, -50%) rotate(@var(--rot))')} background: ${ink(c)}; ${cp('polygon(50% 0, 100% 100%, 0 100%)')}${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Hexdot', 16, 'Small hexagon studs centred in each cell, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: @rand(46%, 78%); ${xf('translate(-50%, -50%)')} background: ${ink(c)}; ${cp('polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 74%, 5% 26%)')}${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

// ════════════════════════════════════════════════════════════════════════════
// D. Lines, bars, stripes & ticks
// ════════════════════════════════════════════════════════════════════════════

add('Barline', 23, 'Tall bars of varying width standing in columns, each post re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { width: @pick(16%, 30%, 46%, 62%); height: 100%; margin: 0 auto; background: ${ink(c)}; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Tickmark', 27, 'Short ticks flicking to one of four headings, re-aiming and re-inking on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { width: 14%; height: 56%; margin: 22% 43%; border-radius: 99px; background: ${ink(c)}; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Plumb', 17, 'Plumb lines weighted with a bob, each line re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 48%; top: 6%; width: 4%; height: 66%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 50%; top: 70%; @size: 26%; margin-left: -13%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Rail', 4, 'Pairs of parallel rails running the cell, the track re-tinting and turning on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${rot('@var(--rot)')} :before { content: ''; position: absolute; left: 28%; top: 6%; width: 8%; height: 88%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; right: 28%; top: 6%; width: 8%; height: 88%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Comb', 29, 'Fine comb teeth combing the field, the rows turning a quarter-turn on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: repeating-linear-gradient(90deg, ${ink(c)} 0 16%, var(--color0) 16% 44%); ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Stave', 22, 'Ruled stave lines with a single note dot drifting to a new pitch on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: repeating-linear-gradient(0deg, ${ink(c)} 0 6%, var(--color0) 6% 26%); :after { content: ''; position: absolute; left: @pick(22%, 50%, 74%); top: @pick(18%, 46%, 70%); @size: 22%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pulsebar', 14, 'A level-meter of bars rising to random heights, each re-reading on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 18%; bottom: 0; width: 64%; height: @rand(24%, 96%); background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Crossbar', 19, 'Bold plus-bars crossing at the centre, each arm re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 45%; top: 12%; width: 10%; height: 76%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 12%; top: 45%; width: 76%; height: 10%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Hashmark', 28, 'Diagonal hatching that flips its lean a quarter-turn on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: repeating-linear-gradient(45deg, ${ink(c)} 0 16%, var(--color0) 16% 40%); ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Slat', 11, 'Single broad slats lying across each cell, turning upright or flat on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${rot('@var(--rot)')} :after { content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: @pick(30%, 50%, 70%); ${xf('translateY(-50%)')} background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Sliver', 33, 'Thin slivers strewn at every angle, re-scattering their spin on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { width: 8%; height: 80%; margin: 10% 46%; border-radius: 99px; background: ${ink(c)}; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Notchbar', 6, 'Broken bars split by a centre gap, the two stubs re-tinting and turning on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${rot('@var(--rot)')} :before { content: ''; position: absolute; left: 8%; top: 44%; width: 36%; height: 12%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; right: 8%; top: 44%; width: 36%; height: 12%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Halfink', 40, 'Cells split left and right into two inks, the pair re-pairing on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :after { content: ''; position: absolute; right: 0; top: 0; width: 50%; height: 100%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Quarterbar', 3, 'A bar tucked along one quarter of the cell, swinging to a new side on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${rot('@var(--rot)')} :after { content: ''; position: absolute; left: 8%; top: 8%; width: 34%; height: 84%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Ledger', 18, 'Fine ruled lines with one bold rule sliding to a new row on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: repeating-linear-gradient(0deg, ${ink(c)} 0 5%, var(--color0) 5% 28%); :after { content: ''; position: absolute; left: 0; top: @pick(22%, 48%, 72%); width: 100%; height: 12%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Warp', 13, 'Vertical threads crossed by a single horizontal weft that re-shuttles on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: repeating-linear-gradient(90deg, ${ink(c)} 0 12%, var(--color0) 12% 30%); :after { content: ''; position: absolute; left: 0; top: @pick(28%, 50%, 70%); width: 100%; height: 14%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Gridline', 31, 'Thin crosshairs ruling every cell, the lines re-inking on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 50%; top: 0; width: 6%; height: 100%; margin-left: -3%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: 6%; margin-top: -3%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Dotdash', 9, 'A dot and a dash per cell like keyed code, re-keying their colours on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${rot('@var(--rot)')} :before { content: ''; position: absolute; left: 12%; top: 42%; width: 34%; height: 16%; border-radius: 99px; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; right: 16%; top: 40%; @size: 20%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

// ════════════════════════════════════════════════════════════════════════════
// E. Grid splits & corner cuts
// ════════════════════════════════════════════════════════════════════════════

add('Ell', 5, 'L-shaped brackets locking the grid together, each one spinning to a new corner on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 48% 0, 48% 52%, 100% 52%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Tee', 10, 'T-blocks budding off the grid, the stem turning to a new quarter on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 36%, 68% 36%, 68% 100%, 32% 100%, 32% 36%, 0 36%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Chamfer', 21, 'Squares with one chamfered corner, the bevel rotating to a new edge on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 70% 0, 100% 30%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Halfblock', 8, 'Each cell half-filled along an edge, the fill flipping to a new side on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 50%, 0 50%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Quarterblock', 12, 'A single quarter of each cell inked, the block hopping corner to corner on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 50% 0, 50% 50%, 0 50%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Step', 16, 'Staircase blocks notched into an L of steps, re-orienting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 50% 0, 50% 50%, 100% 50%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Frameblock', 32, 'Square frames sitting inside square frames, the two tones swapping on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :after { content: ''; position: absolute; inset: 26%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Crux', 19, 'Plus-signs fattening and thinning their arms on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(polygon(36% 0, 64% 0, 64% 36%, 100% 36%, 100% 64%, 64% 64%, 64% 100%, 36% 100%, 36% 64%, 0 64%, 0 36%, 36% 36%), polygon(43% 0, 57% 0, 57% 43%, 100% 43%, 100% 57%, 57% 57%, 57% 100%, 43% 100%, 43% 57%, 0 57%, 0 43%, 43% 43%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Triband', 24, 'A central band striping each cell into thirds, the inks re-sorting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :after { content: ''; position: absolute; left: 34%; top: 0; width: 32%; height: 100%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Offsetbox', 7, 'A small block hopping to a random corner of each cell on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: @pick(8%, 52%); top: @pick(8%, 52%); @size: 40%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Insetstep', 14, 'Concentric squares stepping inward, every ring re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; inset: 20%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; inset: 40%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Cornerpunch', 41, 'Squares with a round bite taken from one corner, the bite rotating on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${rot('@var(--rot)')} :after { content: ''; position: absolute; left: -30%; top: -30%; @size: 80%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Splithz', 36, 'Cells split top and bottom into two inks, re-pairing on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :after { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Pinhole', 0, 'A small square punched from the centre of each ink tile, re-inking the field on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :after { content: ''; position: absolute; inset: 34%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Edgeband', 30, 'A band hugging one edge of each cell, the strip sliding to a new side on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(polygon(0 0, 100% 0, 100% 28%, 0 28%), polygon(0 72%, 100% 72%, 100% 100%, 0 100%), polygon(0 0, 28% 0, 28% 100%, 0 100%), polygon(72% 0, 100% 0, 100% 100%, 72% 100%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Doubinset', 17, 'Double frames — a square inside a ring inside a square — re-tinting layer by layer on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; inset: 18%; background: var(--color0);${pt} } :after { content: ''; position: absolute; inset: 34%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Notchblock', 2, 'Big blocks missing a rectangular corner notch, re-orienting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 58% 100%, 58% 58%, 0 58%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Celleye', 34, 'Square donuts with a round eye punched out, re-inking the ring on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :after { content: ''; position: absolute; inset: 30%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

// ════════════════════════════════════════════════════════════════════════════
// F. Tiles, bricks & weaves
// ════════════════════════════════════════════════════════════════════════════

add('Bond', 11, 'Running-bond brickwork, the courses re-glazing brick by brick on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; width: 90%; height: 84%; margin: 8% 5%; border-radius: 6%; } @match(@y % 2 == 0) { margin-left: 26%; }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

add('Plaid', 22, 'Tartan plaid woven from overlapping translucent bands, re-dyeing on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; left: 0; top: 30%; width: 100%; height: 26%; opacity: 0.55; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 30%; top: 0; width: 26%; height: 100%; opacity: 0.55; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Tatami', 16, 'Tatami mats with seams turning a quarter-turn between mats, re-shading on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :after { content: ''; position: absolute; left: 0; top: 32%; width: 100%; height: 7%; background: var(--color0);${pt} } } @match((@x + @y) % 2 == 0) { :after { left: 32%; top: 0; width: 7%; height: 100%; } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

add('Pinweave', 1, 'Over-and-under plain weave, warp and weft re-threading their colours on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 0; top: 34%; width: 100%; height: 32%; background: ${ink(c)};${pt} } } @match((@x + @y) % 2 == 0) { :after { left: 34%; top: 0; width: 32%; height: 100%; } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

add('Tweed', 13, 'A diagonal tweed of short dashes leaning one way then the other, re-weaving on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${rot('@var(--rot)')} :after { content: ''; position: absolute; left: 50%; top: 50%; width: 24%; height: 92%; ${xf('translate(-50%, -50%) rotate(45deg)')} background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Crazy', 9, 'Crazy paving of irregular four-sided stones, re-cutting their edges on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(@rand(0%, 20%) @rand(0%, 20%), @rand(80%, 100%) @rand(0%, 30%), @rand(80%, 100%) @rand(80%, 100%), @rand(0%, 30%) @rand(80%, 100%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Boxweave', 6, 'Crossing bands woven over and under, re-tinting at each crossing on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 32%; top: 0; width: 36%; height: 100%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 0; top: 32%; width: 100%; height: 36%; background: ${ink(c)};${pt} } } @match((@x + @y) % 2 == 0) { :before { z-index: 2; } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Kasuri', 23, 'Ikat-style frayed dashes jittering in place, re-fraying on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: @rand(34%, 52%); top: @rand(6%, 18%); width: 14%; height: @rand(58%, 86%); background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Caneweave', 19, 'Caned lattice of crossed diagonals, the canes re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 50%; top: 50%; width: 132%; height: 10%; ${xf('translate(-50%, -50%) rotate(45deg)')} background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 50%; top: 50%; width: 132%; height: 10%; ${xf('translate(-50%, -50%) rotate(-45deg)')} background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pavers', 34, 'Bevelled pavers with a lit corner and a centre stud, re-laying their colours on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.2); ${cp('polygon(0 0, 100% 0, 0 100%)')}${pt} } :after { content: ''; position: absolute; inset: 36%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Mosaictile', 45, 'Small grouted mosaic tiles, each tessera re-glazing on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: var(--color0); :after { content: ''; position: absolute; inset: 9%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Logcabin', 37, 'Log-cabin quilt blocks built outward from one corner, re-logging their tones on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; left: 0; top: 0; width: 64%; height: 64%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 0; top: 0; width: 34%; height: 34%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Flagstone', 12, 'Rounded irregular flagstones fitted edge to edge, re-cutting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: @rand(10%, 46%) @rand(10%, 46%) @rand(10%, 46%) @rand(10%, 46%); ${cp('polygon(@rand(0%, 16%) @rand(0%, 16%), @rand(84%, 100%) @rand(0%, 16%), @rand(84%, 100%) @rand(84%, 100%), @rand(0%, 16%) @rand(84%, 100%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Basket', 27, 'Basket-weave bands crossing in pairs, the over-under re-keying on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 0; top: 20%; width: 100%; height: 24%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 0; top: 56%; width: 100%; height: 24%; background: ${ink(c)};${pt} } } @match((@x + @y) % 2 == 0) { :before { left: 20%; top: 0; width: 24%; height: 100%; } :after { left: 56%; top: 0; width: 24%; height: 100%; } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

add('Cointile', 8, 'Overlapping coins shingled in offset rows, each disc re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: 50%; } @match(@y % 2 == 0) { ${xf('translateX(50%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

add('Quiltsquare', 25, 'Half-square quilt patches with a corner block, re-piecing on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${rot('@var(--rot)')} :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')}${pt} } :after { content: ''; position: absolute; left: 0; top: 0; width: 40%; height: 40%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Twill', 3, 'A diagonal twill rib stepping across the weave, re-shading on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; } @match((@x + @y) % 3 == 0) { background: var(--color0); }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Draughts', 0, 'A two-tone checkerboard, the light and dark squares re-dyeing on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; } @match((@x + @y) % 2 == 0) { background: ${ink(c)}; }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Pinwheeltile', 5, 'A pinwheel tessellation of two-tone triangles spinning across the grid, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')} } @match((@x + @y) % 2 == 0) { ${cp('polygon(100% 0, 100% 100%, 0 100%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Brokenbond', 20, 'A broken bond of bricks in random lengths, re-coursing on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; width: @rand(58%, 96%); height: 78%; margin: 11% auto; border-radius: 6%; }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

// ════════════════════════════════════════════════════════════════════════════
// G. Op-art, facets & 3-D shading
// ════════════════════════════════════════════════════════════════════════════

add('Bevel', 5, 'Raised bevelled buttons catching light on two edges, re-facing their colour on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.24); ${cp('polygon(0 0, 100% 0, 80% 20%, 20% 20%, 20% 80%, 0 100%)')}${pt} } :after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.28); ${cp('polygon(100% 0, 100% 100%, 0 100%, 20% 80%, 80% 80%, 80% 20%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Emboss', 14, 'Shaded spheres bulging off the grid, each ball re-lighting its colour on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; inset: 12%; border-radius: 50%; background: ${ink(c)}; box-shadow: inset calc(-14px / @Y) calc(-14px / @Y) calc(26px / @Y) rgba(0,0,0,0.4), inset calc(10px / @Y) calc(10px / @Y) calc(20px / @Y) rgba(255,255,255,0.4);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Convex', 21, 'Puffed pillow tiles bulging at the centre, re-inking on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; box-shadow: inset calc(14px / @Y) calc(14px / @Y) calc(30px / @Y) rgba(255,255,255,0.32), inset calc(-14px / @Y) calc(-14px / @Y) calc(30px / @Y) rgba(0,0,0,0.38); }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Cube', 13, 'Isometric tumbling cubes built from three lit faces, re-shading face by face on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 52%, 96% 28%, 96% 72%, 50% 96%)')} :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(50% 4%, 96% 28%, 50% 52%, 4% 28%)')}${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(4% 28%, 50% 52%, 50% 96%, 4% 72%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.92 });

add('Swellbox', 18, 'Squares swelling from small to large across the field, re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: calc(90% * (0.25 + 0.75 * (@x + @y) / (@X + @Y))); ${xf('translate(-50%, -50%)')} background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '7x7', tf: 0.95 });

add('Facetdiamond', 9, 'Cut diamonds catching light on the top facet and shadow below, re-cutting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%)')} :before { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.22); ${cp('polygon(50% 2%, 98% 50%, 50% 50%)')}${pt} } :after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.24); ${cp('polygon(50% 98%, 2% 50%, 50% 50%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Tilt', 1, 'Leaning panels with a lit strip down one side, re-aiming and re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(20% 0, 100% 0, 80% 100%, 0 100%)')} ${rot('@var(--rot)')} :after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.18); ${cp('polygon(20% 0, 56% 0, 36% 100%, 0 100%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Zigzagfold', 16, 'A pleated accordion of sheared panels alternating their lean, re-shading on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; } @match(@x % 2 == 0) { background: ${ink(c)}; ${cp('polygon(0 0, 100% 20%, 100% 100%, 0 80%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.98 });

add('Dome', 24, 'Shaded half-domes capping each cell, the hood turning to a new edge on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${rot('@var(--rot)')} :after { content: ''; position: absolute; left: 10%; bottom: 6%; width: 80%; height: 80%; border-radius: 50% 50% 0 0; background: ${ink(c)}; box-shadow: inset calc(10px / @Y) calc(-8px / @Y) calc(20px / @Y) rgba(0,0,0,0.36), inset calc(-8px / @Y) calc(8px / @Y) calc(16px / @Y) rgba(255,255,255,0.42);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.92 });

add('Pyramid3d', 8, 'Square pyramids seen from above, four lit-and-shadowed faces re-shading on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.28); ${cp('polygon(0 0, 100% 0, 50% 50%)')}${pt} } :after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.3); ${cp('polygon(0 100%, 100% 100%, 50% 50%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Sunken', 11, 'Recessed wells pressed into the surface, re-inking the floor on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; box-shadow: inset calc(-14px / @Y) calc(-14px / @Y) calc(26px / @Y) rgba(255,255,255,0.28), inset calc(14px / @Y) calc(14px / @Y) calc(26px / @Y) rgba(0,0,0,0.42); }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Glint', 23, 'A glossy diagonal glint sweeping each tile, re-aiming on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${rot('@var(--rot)')} :after { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Tube', 14, 'Glossy cylinders lined up like pipes, turning upright or flat on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; --tone: ${ink(c)}; ${F} { ${rot('@var(--rot)')} :after { content: ''; position: absolute; inset: 8% 22%; border-radius: 30%; background: linear-gradient(90deg, rgba(0,0,0,0.36), @var(--tone) 30%, rgba(255,255,255,0.45) 50%, @var(--tone) 70%, rgba(0,0,0,0.36));${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Step3d', 17, 'Stepped corners climbing toward the light like ziggurat stairs, re-inking on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; left: 0; top: 0; width: 66%; height: 66%; background: rgba(255,255,255,0.2);${pt} } :after { content: ''; position: absolute; left: 0; top: 0; width: 33%; height: 33%; background: rgba(255,255,255,0.36);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Diamond3d', 19, 'Raised gems lit on the upper facet and shaded below, re-cutting their colour on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: var(--color0); :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; filter: brightness(1.25); ${cp('polygon(50% 4%, 96% 50%, 50% 50%, 4% 50%)')}${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; filter: brightness(0.8); ${cp('polygon(50% 50%, 96% 50%, 50% 96%, 4% 50%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Lozengegrad', 38, 'Diamonds half in light and half in shadow, the cut turning a quarter-turn on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%)')} ${rot('@var(--rot)')} :after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.26); ${cp('polygon(50% 2%, 98% 50%, 50% 98%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

// ════════════════════════════════════════════════════════════════════════════
// H. Organic — leaves, blooms, waves & drops
// ════════════════════════════════════════════════════════════════════════════

add('Bud', 15, 'Plump buds tilting at every angle, each one re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { width: 58%; height: 74%; margin: 13% 21%; background: ${ink(c)}; border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Bloom', 25, 'Four-petal blooms from two crossed ellipses, re-colouring petal by petal on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 30%; top: 8%; width: 40%; height: 84%; border-radius: 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 8%; top: 30%; width: 84%; height: 40%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.92 });

add('Billow', 17, 'Soft cloud puffs drifting across the grid, re-shading on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 14%; top: 38%; @size: 46%; border-radius: 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 40%; top: 28%; @size: 56%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Raindrop', 33, 'Teardrops falling at shifting angles, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { width: 60%; height: 60%; margin: 20%; background: ${ink(c)}; border-radius: 0 50% 50% 50%; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Frond', 15, 'Single leaves veined down the middle, the blade turning to a new quarter on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { width: 84%; height: 84%; margin: 8%; background: ${ink(c)}; border-radius: 0 100% 0 100%; ${rot('@var(--rot)')} :after { content: ''; position: absolute; left: 8%; top: 48%; width: 84%; height: 5%; background: var(--color0); ${xf('rotate(45deg)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pondring', 14, 'Ripples spreading in concentric rings around a centre drop, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { width: 90%; height: 90%; margin: 5%; border-radius: 50%; border: calc(7px / @Y) solid ${ink(c)}; box-sizing: border-box; :before { content: ''; position: absolute; left: 50%; top: 50%; @size: 18%; margin: -9%; border-radius: 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; inset: 28%; border-radius: 50%; border: calc(7px / @Y) solid ${ink(c)}; box-sizing: border-box;${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.92 });

add('Scale', 8, 'Fish-scale shells shingled in offset rows, re-glazing scale by scale on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: 0 0 50% 50%; } @match(@y % 2 == 0) { ${xf('translateX(50%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

add('Sprig', 16, 'Two-leaf sprigs unfurling from the centre, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 28%; top: 30%; @size: 42%; border-radius: 0 100%; background: ${ink(c)}; ${xf('rotate(-30deg)')}${pt} } :after { content: ''; position: absolute; right: 28%; top: 30%; @size: 42%; border-radius: 100% 0; background: ${ink(c)}; ${xf('rotate(30deg)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Tendril', 19, 'Curling tendrils hooking around a corner, re-aiming their spiral on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { overflow: hidden; ${rot('@var(--rot)')} :after { content: ''; position: absolute; @size: 120%; left: 12%; top: 12%; border: calc(9px / @Y) solid ${ink(c)}; border-radius: 50%; ${cp('polygon(0 0, 62% 0, 62% 62%, 0 62%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pod', 11, 'Seed pods split down the middle, re-tinting on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${rot('@var(--rot)')} :after { content: ''; position: absolute; left: 50%; top: 50%; width: 34%; height: 82%; margin: -41% -17%; border-radius: 50%; background: ${ink(c)};${pt} } :before { content: ''; position: absolute; left: 50%; top: 50%; width: 6%; height: 60%; margin: -30% -3%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Berry', 9, 'Clusters of three berries bunched together, re-ripening their colours on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 18%; top: 16%; @size: 40%; border-radius: 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 44%; top: 40%; @size: 44%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Wavelet', 0, 'Cresting waves curling along the rows, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 100%, 0 50%, 50% 50%, 50% 0, 100% 0, 100% 100%)')} border-radius: 0 0 60% 0; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Cattail', 16, 'Reedmace cattails standing in a marsh, the heads re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 47%; top: 8%; width: 6%; height: 84%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 38%; top: 16%; width: 24%; height: 40%; border-radius: 99px; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Heart', 32, 'Plump hearts dotting the grid, re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 96%, 8% 52%, 8% 26%, 28% 8%, 50% 24%, 72% 8%, 92% 26%, 92% 52%)')} opacity: @rand(0.8, 1); }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Clover', 15, 'Three-leaf clovers turning to a new heading, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${rot('@var(--rot)')} :before { content: ''; position: absolute; left: 18%; top: 14%; @size: 44%; border-radius: 50% 50% 50% 0; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 40%; top: 14%; @size: 44%; border-radius: 50% 50% 0 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Palmette', 24, 'Fanned palmette fronds opening upward, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 30%; bottom: 8%; width: 40%; height: 80%; border-radius: 50% 50% 0 0; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 14%; bottom: 8%; width: 72%; height: 50%; border-radius: 50% 50% 0 0; background: ${ink(c)}; opacity: 0.7;${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Mistwave', 3, 'Layered mist banks rolling in soft bands, re-shading on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; left: 0; top: 24%; width: 100%; height: 30%; border-radius: 0 0 50% 50% / 0 0 100% 100%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 0; top: 56%; width: 100%; height: 40%; border-radius: 0 0 50% 50% / 0 0 100% 100%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Grassblade', 16, 'Tufts of grass blades fanning from the base, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 40%; bottom: 0; width: 8%; height: 86%; border-radius: 99px; background: ${ink(c)}; ${xf('rotate(-16deg)')} transform-origin: bottom;${pt} } :after { content: ''; position: absolute; left: 52%; bottom: 0; width: 8%; height: 78%; border-radius: 99px; background: ${ink(c)}; ${xf('rotate(18deg)')} transform-origin: bottom;${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Lotus', 38, 'Lotus petals fanning in three, re-tinting petal by petal on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 36%; top: 14%; width: 28%; height: 76%; border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 14%; top: 22%; width: 28%; height: 64%; border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%; background: ${ink(c)}; ${xf('rotate(-32deg)')} transform-origin: bottom;${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Driftleaf', 12, 'Leaves drifting down at random angles, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { width: 76%; height: 76%; margin: 12%; background: ${ink(c)}; border-radius: 0 100% 0 100%; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Acorn', 11, 'Acorns capped and round, each nut re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 30%; top: 36%; width: 40%; height: 50%; border-radius: 30% 30% 50% 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 26%; top: 22%; width: 48%; height: 24%; border-radius: 50% 50% 30% 30%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Thistle', 46, 'Spiky thistle heads on stout bases, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 34%; bottom: 8%; width: 32%; height: 42%; border-radius: 0 0 50% 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 28%; top: 12%; width: 44%; height: 44%; background: ${ink(c)}; ${cp('polygon(50% 0, 60% 30%, 92% 18%, 68% 48%, 100% 60%, 64% 64%, 72% 100%, 50% 72%, 28% 100%, 36% 64%, 0 60%, 32% 48%, 8% 18%, 40% 30%)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

// ════════════════════════════════════════════════════════════════════════════
// I. Dots, scatter & texture
// ════════════════════════════════════════════════════════════════════════════

add('Scatterdot', 0, 'Dots jittering to a new spot in each cell on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: @rand(10%, 66%); top: @rand(10%, 66%); @size: 28%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Twinkle', 13, 'Four-point twinkles winking at shifting sizes and angles, re-sparkling on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: @rand(30%, 72%); ${xf('translate(-50%, -50%) rotate(@var(--rot))')} background: ${ink(c)}; ${cp('polygon(50% 0, 58% 42%, 100% 50%, 58% 58%, 50% 100%, 42% 58%, 0 50%, 42% 42%)')}${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Bubble', 2, 'Hollow soap-bubble rings drifting at random sizes, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: @rand(36%, 82%); ${xf('translate(-50%, -50%)')} border-radius: 50%; border: calc(8px / @Y) solid ${ink(c)}; box-sizing: border-box;${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Spore', 14, 'Glowing spores haloed in soft light, each one re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 24%; margin: -12%; border-radius: 50%; background: ${ink(c)}; box-shadow: 0 0 calc(38px / @Y) ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.9 });

add('Freckle', 9, 'Pairs of freckles dappling each cell, re-scattering on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: @rand(8%, 40%); top: @rand(10%, 50%); @size: 30%; border-radius: 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: @rand(50%, 78%); top: @rand(42%, 78%); @size: 24%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pixel', 23, 'A one-bit pixel field flickering cells on and off, re-inking on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; opacity: @pick(0, 1, 1, 1); }${TR}`,
}), { grid: '10x15', tg: '8x8', tf: 0.98 });

add('Fuzz', 28, 'Television fuzz fizzing at random opacity, re-noising on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; opacity: @rand(0.12, 1); }${TR}`,
}), { grid: '10x15', tg: '8x8', tf: 0.98 });

add('Granule', 11, 'Coarse grains scattered in size and shape, re-milling on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: @rand(18%, 60%); top: @rand(18%, 60%); @size: @rand(10%, 38%); border-radius: @rand(0%, 50%); background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Dapple', 15, 'Soft blurred dapples of light, each blot re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 54%; margin: -27%; border-radius: 50%; background: ${ink(c)}; filter: blur(calc(8px / @Y)); opacity: @rand(0.5, 1);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Beadrow', 4, 'Beads sliding along a strung thread, each bead re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 0; top: 48%; width: 100%; height: 5%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: @pick(18%, 44%, 70%); top: 50%; @size: 30%; margin: -15% 0 0 0; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Dotwave', 18, 'Dots swelling row by row down the field, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: calc(86% * (0.2 + 0.8 * @y / @Y)); ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Polkapair', 25, 'Alternating large and small polka dots in two tones, re-dotting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: 50%; } @match((@x + @y) % 2 == 0) { background: ${ink(c)}; ${xf('scale(0.55)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.98 });

add('Ringdot', 21, 'Dots ringed by a haloing band, the eye re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 40%; margin: -20%; border-radius: 50%; background: ${ink(c)}; box-shadow: 0 0 0 calc(7px / @Y) var(--color0), 0 0 0 calc(15px / @Y) ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.92 });

add('Chaff', 33, 'Tilted confetti squares strewn at random, re-scattering on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { :after { content: ''; position: absolute; left: @rand(14%, 62%); top: @rand(14%, 62%); @size: 28%; background: ${ink(c)}; ${xf('rotate(@var(--rot))')}${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Stipple', 29, 'A fine stipple of dots that turns a quarter-turn on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: radial-gradient(${ink(c)} 22%, var(--color0) 24%) 0 0 / 40% 40%; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Halfdot', 8, 'Half-moon dots facing a new way on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 64%; margin: -32%; border-radius: 999px 999px 0 0; background: ${ink(c)}; ${xf('rotate(@var(--rot))')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Sequin', 31, 'Shiny sequins glinting on the grid, each disc re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 64%; margin: -32%; border-radius: 50%; background: ${ink(c)}; box-shadow: inset calc(8px / @Y) calc(8px / @Y) calc(14px / @Y) rgba(255,255,255,0.55), inset calc(-6px / @Y) calc(-6px / @Y) calc(12px / @Y) rgba(0,0,0,0.3);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Mote', 17, 'Bright motes paired with a faint shadow twin for depth, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 22%; top: 22%; @size: 50%; border-radius: 50%; background: ${ink(c)}; opacity: 0.3;${pt} } :after { content: ''; position: absolute; left: 40%; top: 40%; @size: 34%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

// ════════════════════════════════════════════════════════════════════════════
// J. Symbols, glyphs & frames
// ════════════════════════════════════════════════════════════════════════════

add('Arrow', 5, 'Block arrows pointing to a new heading on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 35%, 55% 35%, 55% 12%, 100% 50%, 55% 88%, 55% 65%, 0 65%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Chevarrow', 19, 'Chevron arrows flicking to a new quarter on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 18%, 36% 50%, 0 82%, 28% 82%, 64% 50%, 28% 18%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Mesh', 6, 'A ruled mesh of crossing lines turning a quarter-turn on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: repeating-linear-gradient(0deg, transparent 0 30%, ${ink(c)} 30% 42%, transparent 42% 72%), repeating-linear-gradient(90deg, transparent 0 30%, ${ink(c)} 30% 42%, transparent 42% 72%); ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Snowflake', 0, 'Six-spoke flakes spinning to a new angle on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${rot('@var(--rot)')} background: ${ink(c)}; ${cp('polygon(46% 6%, 54% 6%, 54% 94%, 46% 94%)')} :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(46% 6%, 54% 6%, 54% 94%, 46% 94%)')} ${xf('rotate(60deg)')}${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; ${cp('polygon(46% 6%, 54% 6%, 54% 94%, 46% 94%)')} ${xf('rotate(120deg)')}${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.9 });

add('Frame', 32, 'Square picture-frames ringing each cell, re-inking on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 90%, 90% 90%, 90% 10%, 10% 10%, 10% 90%, 0 90%)')} opacity: @rand(0.78, 1); }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Windowframe', 17, 'Four-light window panes mullioned by a cross, re-glazing on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; :before { content: ''; position: absolute; left: 45%; top: 6%; width: 10%; height: 88%; background: var(--color0);${pt} } :after { content: ''; position: absolute; left: 6%; top: 45%; width: 88%; height: 10%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Crosshair', 23, 'Targeting crosshairs ringing a centre, the reticle re-inking on reseed.', (c) => ({
  vars: '',
  rule: `${F} { width: 84%; height: 84%; margin: 8%; border-radius: 50%; border: calc(7px / @Y) solid ${ink(c)}; box-sizing: border-box; :before { content: ''; position: absolute; left: 46%; top: -12%; width: 8%; height: 124%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: -12%; top: 46%; width: 124%; height: 8%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.92 });

add('Quincunx', 13, 'Five-spot quincunx dots like dice, re-rolling their colours and turning on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: radial-gradient(circle at 26% 26%, ${ink(c)} 16%, transparent 18%), radial-gradient(circle at 74% 26%, ${ink(c)} 16%, transparent 18%), radial-gradient(circle at 50% 50%, ${ink(c)} 16%, transparent 18%), radial-gradient(circle at 26% 74%, ${ink(c)} 16%, transparent 18%), radial-gradient(circle at 74% 74%, ${ink(c)} 16%, transparent 18%); ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Bolt', 29, 'Lightning bolts striking a new way on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(52% 4%, 24% 56%, 46% 56%, 38% 96%, 78% 40%, 54% 40%, 64% 4%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Tag', 21, 'Punched price tags swinging to a new angle, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(16% 16%, 70% 16%, 96% 50%, 70% 84%, 16% 84%)')} ${rot('@var(--rot)')} :after { content: ''; position: absolute; left: 22%; top: 44%; @size: 12%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Bracketpair', 10, 'Square brackets opening left or right, re-inking on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp('polygon(20% 8%, 80% 8%, 80% 22%, 34% 22%, 34% 78%, 80% 78%, 80% 92%, 20% 92%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Rune', 36, 'Angular runes re-carving themselves into new glyphs on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('@pick(polygon(20% 10%, 32% 10%, 32% 48%, 70% 48%, 70% 90%, 58% 90%, 58% 60%, 20% 60%), polygon(20% 10%, 80% 10%, 80% 22%, 50% 22%, 50% 90%, 38% 90%, 38% 22%, 20% 22%), polygon(12% 18%, 88% 18%, 88% 30%, 56% 30%, 84% 82%, 72% 88%, 46% 36%, 46% 82%, 34% 82%, 34% 28%, 12% 28%))')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Keyhole', 40, 'Keyholes punched into the field, re-inking on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: var(--color0); :before { content: ''; position: absolute; left: 50%; top: 22%; @size: 38%; margin-left: -19%; border-radius: 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 42%; top: 46%; width: 16%; height: 36%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Trace', 1, 'Circuit traces wired to a pad, re-routing on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${rot('@var(--rot)')} :before { content: ''; position: absolute; left: 8%; top: 46%; width: 78%; height: 8%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 74%; top: 38%; @size: 24%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Diamondeye', 38, 'Diamond frames around a punched eye, re-inking on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%)')} :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 32%; margin: -16%; ${cp('polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%)')} background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Ringlink', 24, 'Interlocking chain links turning a quarter-turn on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${rot('@var(--rot)')} :before { content: ''; position: absolute; left: 6%; top: 30%; width: 56%; height: 40%; border-radius: 99px; border: calc(8px / @Y) solid ${ink(c)}; box-sizing: border-box;${pt} } :after { content: ''; position: absolute; right: 6%; top: 30%; width: 56%; height: 40%; border-radius: 99px; border: calc(8px / @Y) solid ${ink(c)}; box-sizing: border-box;${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Bobbin', 11, 'Thread bobbins pinched at the waist, turning upright or flat on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp('polygon(12% 8%, 88% 8%, 88% 28%, 60% 42%, 60% 58%, 88% 72%, 88% 92%, 12% 92%, 12% 72%, 40% 58%, 40% 42%, 12% 28%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Sprocket', 16, 'Toothed sprockets with a punched hub, re-spinning on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 58% 12%, 72% 8%, 76% 24%, 92% 26%, 88% 42%, 100% 50%, 88% 58%, 92% 74%, 76% 76%, 72% 92%, 58% 88%, 50% 100%, 42% 88%, 28% 92%, 24% 76%, 8% 74%, 12% 58%, 0 50%, 12% 42%, 8% 26%, 24% 24%, 28% 8%, 42% 12%)')} ${rot('@var(--rot)')} :after { content: ''; position: absolute; inset: 36%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Hexnut', 19, 'Hex nuts with a round bore, re-glazing on reseed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 74%, 5% 26%)')} :after { content: ''; position: absolute; inset: 34%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Star5', 9, 'Five-point stars turning to a new angle on reseed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 2%, 61% 38%, 98% 38%, 68% 60%, 79% 96%, 50% 74%, 21% 96%, 32% 60%, 2% 38%, 39% 38%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Checkmark', 15, 'Bold check-marks ticking a new way on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(40% 70%, 82% 18%, 94% 30%, 42% 92%, 8% 58%, 20% 46%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Pinmark', 8, 'Map pins dropped across the grid, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `${F} { :before { content: ''; position: absolute; left: 50%; top: 12%; @size: 50%; margin-left: -25%; border-radius: 50% 50% 50% 0; background: ${ink(c)}; ${xf('rotate(-45deg)')}${pt} } :after { content: ''; position: absolute; left: 50%; top: 30%; @size: 16%; margin-left: -8%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

// Curated keep-set: the motif library above is the full set that was authored
// and render-tested, but only these are published to the gallery.
const KEEP = new Set([
  'quaver', 'bowl', 'cinch', 'loophole', 'quoit', 'lobe', 'dogtooth', 'sail',
  'cleat', 'octagon', 'diadem', 'spark', 'sliver', 'ell', 'chamfer',
  'notchblock', 'frond', 'wavelet', 'bobbin',
]);

export const batch5 = all.filter((d) => KEEP.has(d.slug));
