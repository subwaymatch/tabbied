// Batch 11 - shared vocabulary.
//
// Batch 11's constraint is not a motif, it is a *format*: every design in it
// must export as native SVG with no caveat at all. No `svgExport: false`, no
// `svgExportNote`, no converter warning, and pixel parity with the live render
// well inside the house budget. That rules a lot of CSS out, and the ban is
// enforced twice - by the lints in generate-batch11.mjs (which reject the
// unsafe declarations at authoring time) and by
// validate-svg-batch11.mjs (which runs the shipped converter over every
// design and fails on a throw, a warning or a pixel diff).
//
// What is off the table, and why (docs/svg-export.md has the full reasoning):
//
//   * box-shadow, filter: blur(), mix-blend-mode - these export as SVG
//     *filters*. Valid SVG that browsers render correctly, but design tools
//     import filters imperfectly, which is exactly what an svgExportNote
//     exists to warn about. The converter emits a warning for each.
//   * repeating-conic-gradient - the converter rejects it outright.
//   * conic-gradient with a nonzero span between two different colors - a
//     smooth angular sweep, which SVG has no primitive for. Hard-stop conic
//     sectors are fine and are how this batch draws every pie and fan.
//   * nested @doodle() images - they export cleanly but the *live* rendering
//     shows hairline seams from rasterizing the nested foreignObject, so the
//     export deviates from the screen by a documented ≤1px.
//   * @svg() payloads - supported, but the browser rasterizes an @svg mask
//     with different sub-pixel rounding than the inlined symbol.
//   * a border on a partially-rounded box - the converter throws, and mixed
//     border widths around rounded corners deviate by up to a pixel. A border
//     may go on a square box or on a full circle, never in between; no design
//     in the batch as it ships uses one.
//
// What is left is still a wide vocabulary: solid fills, border-radius shapes,
// clip paths, every linear and radial gradient (smooth or hard-stop, plain or
// repeating), CSS masks including mask-composite: intersect, hard-stop conic
// sectors, transforms, opacity and z-index. Each of those is parity-verified
// pixel-for-pixel by the existing catalog.
//
// The house rules inherited from batches 6-10 still apply and are enforced by
// generate-batch11.mjs:
//
//   * exactly one @random(${shapeFrequency}) gate per design, so the frequency
//     slider always thins the whole field;
//   * every design samples a transition-able ink per cell (a background-color
//     or border-color), so a reseed morphs rather than snapping;
//   * a randomized custom property read more than once goes through @var(--x);
//   * nothing paints var(--color0) - a hole knocked out in the background
//     colour stops being a hole the moment the background is transparent.

export { TAKEN, RESERVED } from '../pattern-defs-10.mjs';

// ── the frequency gate, transitions, prefixed shorthands ───────────────────
export const F = '@random(${shapeFrequency})';
export const TR = ' -webkit-transition: ease 450ms; transition: ease 450ms;';

export const cp = (p) => `-webkit-clip-path: ${p}; clip-path: ${p};`;
const xf = (v) => `-webkit-transform: ${v}; transform: ${v};`;
export const rot = (v) => xf(`rotate(${v})`);

/** One or more mask layers, composited the default way (add). */
export const msk = (...layers) => {
  const v = layers.join(', ');
  return `-webkit-mask: ${v}; mask: ${v};`;
};

/**
 * Mask layers intersected rather than added - the shape is what all the layers
 * agree on. `source-in` is the -webkit- spelling of `intersect`.
 */
export const mskI = (...layers) => {
  const v = layers.join(', ');
  return `-webkit-mask: ${v}; mask: ${v}; -webkit-mask-composite: source-in; mask-composite: intersect;`;
};

/** An absolutely-positioned pseudo-element, transitioned like its cell. */
export const B = (css) => `:before { content: ''; position: absolute; ${css}${TR} }`;
export const A = (css) => `:after { content: ''; position: absolute; ${css}${TR} }`;

/** Ink picker over color`s`..color(c-1). color0 is the background, never painted. */
export const ink = (c, s = 1) => {
  const a = [];
  for (let i = s; i <= c - 1; i++) a.push(`var(--color${i})`);
  return `@p(${a.join(', ')})`;
};

/** One specific ink slot, for designs that want a fixed figure/ground pair. */
export const c1 = 'var(--color1)';

export const R2 = '@pick(0deg, 90deg)';
export const R4 = '@pick(0deg, 90deg, 180deg, 270deg)';

// ── mask layers: the geometry is cut, the ink is a plain background ────────
// Every layer here paints in #000/transparent only. Keeping colour out of the
// mask means the ink stays a transitionable background-color, and it keeps the
// conic parser on the hard-stop path it supports (a span between two *different*
// colours is a smooth sweep, which the converter rejects).
//
// Layers are plain gradient strings so they compose: msk(a, b) adds them,
// mskI(a, b) intersects them.

/** One sector of a circle, opening from `at`. */
export const pieL = (deg, { from = '0deg', at = '50% 50%' } = {}) =>
  `conic-gradient(from ${from} at ${at}, #000 0 ${deg}, transparent ${deg} 360deg)`;

/** Everything outside a disc: a hole bored through the middle. */
const boreL = (r, at = '50% 50%') =>
  `radial-gradient(circle closest-side at ${at}, transparent ${r}, #000 ${r})`;

/** The band between two radii. */
export const bandL = (inner, outer, at = '50% 50%') =>
  `radial-gradient(circle closest-side at ${at}, transparent ${inner}, #000 ${inner} ${outer}, transparent ${outer})`;

/**
 * A band around an arbitrary centre. `closest-side` collapses to a zero
 * radius once the centre reaches an edge, so off-centre rings size themselves
 * to the farthest corner instead and read their stops as a fraction of that.
 */
export const bandAt = (inner, outer, at) =>
  `radial-gradient(circle at ${at}, transparent ${inner}, #000 ${inner} ${outer}, transparent ${outer})`;

/** Parallel slots: `on` inked out of every `period`, at `angle`. */
export const slotL = (angle, on, period) =>
  `repeating-linear-gradient(${angle}, #000 0 ${on}, transparent ${on} ${period})`;

/** Concentric rings, all the way out. The first stop must sit at 0. */
export const ringsL = (on, period, at = '50% 50%') =>
  `repeating-radial-gradient(circle at ${at}, #000 0 ${on}, transparent ${on} ${period})`;

// Declaration-level shorthands for the common single-layer cases.
export const pie1 = (deg, opts) => msk(pieL(deg, opts));
export const slot1 = (angle, on, period) => msk(slotL(angle, on, period));

/** A sector with its apex bored out - an annular sector. */
export const arcSector = (deg, bore, { from = '0deg', at = '50% 50%' } = {}) =>
  mskI(pieL(deg, { from, at }), boreL(bore, at));

// ── clip paths: polygons written as percentages ────────────────────────────
const P = (pts) =>
  pts.map(([x, y]) => `${(+x).toFixed(1)}% ${(+y).toFixed(1)}%`).join(', ');
export const poly = (pts) => `polygon(${P(pts)})`;

// ── palettes ───────────────────────────────────────────────────────────────
// Six slots each (a background plus five inks), in the house style: no ink
// repeats its background, and every palette carries at least one ink with real
// contrast against color0 so a design always reads. Designs that want fewer
// inks slice the front of the list, so color0 stays the background either way.
export const PAL = [
  ['#0B1F3A', '#3E8BFF', '#3EECFF', '#97F4FF', '#9EFFD8', '#FFFFFF'],
  ['#F7F9FC', '#0B1F3A', '#3E8BFF', '#3EECFF', '#FF3D8B', '#9EFFD8'],
  ['#101A2E', '#3E8BFF', '#3EECFF', '#FF3D8B', '#3FFFB2', '#F5DD32'],
  ['#FFFDF7', '#232529', '#E63329', '#1D3D8F', '#F0C02E', '#3EECFF'],
  ['#12100E', '#D62246', '#F06449', '#EDE6E3', '#36C9C6', '#F4D35E'],
  ['#F4EFE4', '#7A1F3D', '#2F4156', '#C9A86A', '#88A872', '#D98E5A'],
  ['#001219', '#005F73', '#0A9396', '#94D2BD', '#EE9B00', '#CA6702'],
  ['#FEFAE0', '#606C38', '#283618', '#DDA15E', '#BC6C25', '#A3B18A'],
  ['#10002B', '#5A189A', '#9D4EDD', '#C77DFF', '#E0AAFF', '#FFD6FF'],
  ['#FFFFFF', '#06AED5', '#086788', '#F0C808', '#DD1C1A', '#4C4C4C'],
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
  ['#0E2438', '#275AA6', '#3E8BFF', '#3EECFF', '#97F4FF', '#E9F1FF'],
  ['#E9F1FF', '#1B4075', '#3E8BFF', '#3EECFF', '#FF3D8B', '#3FFFB2'],
  ['#ECFFEC', '#3FFFB2', '#3E8BFF', '#9EFFD8', '#FF3D8B', '#F5DD32'],
  ['#2B1B3D', '#FF8A5C', '#FFC15E', '#FF5E78', '#FFD27D', '#FFF1D6'],
  ['#241024', '#E84393', '#B388EB', '#FF8FB8', '#F5C542', '#FFF1F6'],
  ['#1A0E12', '#FF6B6B', '#FFD93D', '#4ECDC4', '#FF8A5C', '#FFF1D6'],
  ['#FBF3E4', '#D96C47', '#E3A92E', '#7FA886', '#2F4156', '#B4552F'],
  ['#2B1E1A', '#E2543E', '#E3A92E', '#88A872', '#F3EBDB', '#7FA886'],
  ['#141233', '#6C4AB6', '#3EECFF', '#FF3D8B', '#F5DD32', '#3FFFB2'],
  ['#0F2027', '#3FFFB2', '#3EECFF', '#2BB3A3', '#D89FFF', '#E9FFF9'],
  ['#0F2A1E', '#2F6B3C', '#4F9D5D', '#8CC084', '#C8E6C0', '#ECFFEC'],
  ['#F2F7EE', '#2F6B3C', '#4F9D5D', '#8CC084', '#1F4D2A', '#C8E6C0'],
  ['#0E1230', '#3E8BFF', '#7AA7FF', '#B9D0FF', '#E9F1FF', '#FFFFFF'],
  ['#FCFBFF', '#60569E', '#9B8FD4', '#C9BFF2', '#3E8BFF', '#E6437D'],
  ['#10303A', '#2BB3A3', '#3EECFF', '#FF6B6B', '#FFD93D', '#F3EBDB'],
  ['#FBF7EE', '#FF4D6D', '#2E86AB', '#F5B82E', '#7E4A8C', '#2BB3A3'],
  ['#1D1F24', '#E8E6E1', '#F5B82E', '#3EECFF', '#FF4D6D', '#2E86AB'],
  ['#15171C', '#E8E6E1', '#F5B82E', '#3EECFF', '#FF3D8B', '#9EFFD8'],
  ['#FFF8F2', '#FF7E9D', '#FFB35C', '#9D89F2', '#54C6B8', '#FF3D8B'],
  ['#FFF9F5', '#FF8FB8', '#FFC2D4', '#FF8A5C', '#D89FFF', '#F5C542'],
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
  ['#FFF1E6', '#5C3D2E', '#B85C38', '#E0C097', '#2D2424', '#A26B4E'],
  ['#0C1B33', '#7B9EA8', '#DDE8B9', '#F2E7C9', '#B95F89', '#2E4756'],
  ['#F2EFEA', '#3A5A40', '#588157', '#A3B18A', '#344E41', '#DAD7CD'],
  ['#1C1C1C', '#F2542D', '#F5DFBB', '#0E9594', '#127475', '#EDEDED'],
  ['#FFFBF0', '#2B2D42', '#8D99AE', '#EF233C', '#D90429', '#5C6784'],
  ['#131A26', '#F5A65B', '#F2D492', '#849B87', '#D8E2DC', '#B3654E'],
  ['#F8F4E3', '#40434E', '#7D8491', '#D8973C', '#BD632F', '#273043'],
  ['#0A100D', '#B9BAA3', '#D6D5C9', '#A22C29', '#902923', '#E5E5DC'],
  ['#FFF0F3', '#590D22', '#A4133C', '#C9184A', '#FF758F', '#FFB3C1'],
  ['#03071E', '#370617', '#9D0208', '#DC2F02', '#F48C06', '#FFBA08'],
  ['#EDF6F9', '#006D77', '#83C5BE', '#E29578', '#FFDDD2', '#00343C'],
  ['#1F2421', '#216869', '#49A078', '#9CC5A1', '#DCE1DE', '#8FC0A9'],
  ['#FFFFF0', '#233D4D', '#FE7F2D', '#FCCA46', '#A1C181', '#619B8A'],
  ['#171A21', '#E5E5E5', '#B4C5E4', '#7D82B8', '#EF798A', '#F7A9A8'],
];

const isDark = (hex) => {
  const m = /^#([0-9a-f]{6})/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return (
    (0.2126 * ((n >> 16) & 255) +
      0.7152 * ((n >> 8) & 255) +
      0.0722 * (n & 255)) /
      255 <
    0.5
  );
};

/**
 * Builds the per-section `add()` used by every definition file. Each section
 * gets its own collector; pattern-defs-11.mjs concatenates them in order and
 * numbers the whole batch.
 *
 * cfg:
 *   pal    palette index into PAL                         (required)
 *   inks   how many ink slots the design uses, 1-5        (default 5)
 *   grid   default "columns x rows" for the editor        (default '6x9')
 *   freq   default frequency                              (default 1)
 *   tg/tf  gallery-thumbnail grid / frequency             (default '5x5' / 1)
 *   min    sizing.minCellPx floor, for px-scaled details
 */
export function section(title) {
  const all = [];
  const add = (name, description, build, cfg) => {
    const slug = name.toLowerCase();
    if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
    const palette = PAL[cfg.pal % PAL.length].slice(0, (cfg.inks ?? 5) + 1);
    const c = palette.length;
    const { vars = '', rule } = build(c);
    all.push({
      name,
      slug,
      section: title,
      ...(isDark(palette[0]) ? { white: true } : {}),
      description,
      palette,
      colors: { min: 2, max: c, default: c },
      gridDefault: cfg.grid ?? '6x9',
      freqDefault: cfg.freq ?? 1,
      ...(cfg.min ? { minCellPx: cfg.min } : {}),
      thumb: { grid: cfg.tg ?? '5x5', frequency: cfg.tf ?? 1 },
      vars,
      rule,
    });
  };
  return { add, all, title };
}
