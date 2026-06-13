// Batch 4 — 100 distinct geometric motifs (gallery orders 310+).
//
// Unlike a recolour set, every entry here is its own shape/composition: a
// different primitive, subdivision, symmetry or tiling. Palettes may repeat
// across designs (they are different artworks), but no motif repeats.
//
// House rules (matching batches 1–3 and the originals):
//   * reseed variation rides on a transition-able, sampled property —
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

// Ink picker over color1..color(max-1) (color0 is the background).
const ink = (c, s = 1) => {
  const a = [];
  for (let i = s; i <= c - 1; i++) a.push(`var(--color${i})`);
  return `@p(${a.join(', ')})`;
};

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
  ['#F4EFE4', '#7A1F3D', '#2F4156', '#C9A86A', '#88A872'],
  ['#141233', '#6C4AB6', '#3EECFF', '#FF3D8B', '#F5DD32', '#3FFFB2'],
  ['#0F2027', '#3FFFB2', '#3EECFF', '#2BB3A3', '#D89FFF', '#E9FFF9'],
  ['#0F2A1E', '#2F6B3C', '#4F9D5D', '#8CC084', '#C8E6C0', '#ECFFEC'],
  ['#F2F7EE', '#2F6B3C', '#4F9D5D', '#8CC084', '#C8E6C0'],
  ['#0E1230', '#3E8BFF', '#7AA7FF', '#B9D0FF', '#E9F1FF', '#FFFFFF'],
  ['#FCFBFF', '#60569E', '#9B8FD4', '#C9BFF2', '#3E8BFF', '#E6437D'],
  ['#F2E9DC', '#E63329', '#1D3D8F', '#F0C02E', '#1A1A1A'],
  ['#FAF7F0', '#232529', '#E63329', '#1D3D8F', '#F0C02E', '#3EECFF'],
  ['#10303A', '#2BB3A3', '#3EECFF', '#FF6B6B', '#FFD93D', '#F3EBDB'],
  ['#FBF7EE', '#FF4D6D', '#2E86AB', '#F5B82E', '#7E4A8C', '#2BB3A3'],
  ['#1D1F24', '#E8E6E1', '#F5B82E', '#3EECFF', '#FF4D6D', '#2E86AB'],
  ['#15171C', '#E8E6E1', '#F5B82E', '#3EECFF', '#FF3D8B'],
  ['#FFF8F2', '#FF7E9D', '#FFB35C', '#9D89F2', '#54C6B8', '#FF3D8B'],
  ['#FFF9F5', '#FF8FB8', '#FFC2D4', '#FF8A5C', '#D89FFF', '#F5C542'],
  ['#0B2540', '#3E8BFF', '#3EECFF', '#9EFFD8', '#ECFFEC', '#FFFFFF'],
];

// Reusable transition tail.
const TR = ' -webkit-transition: ease 450ms; transition: ease 450ms;';
// Pseudo-element transition.
const pt = ' -webkit-transition: ease 450ms; transition: ease 450ms;';

let order = 310;
export const batch4 = [];
const add = (name, palIdx, description, build, cfg = {}) => {
  const palette = PAL[palIdx % PAL.length];
  const c = palette.length;
  const { vars, rule } = build(c);
  batch4.push({
    name,
    slug: name.toLowerCase(),
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

// ── A. Arcs, circles & curves ────────────────────────────────────────────
add('Truchet', 0, 'Interlocking quarter-arc tiles that wire themselves into endless looping mazes, re-routing on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { overflow: hidden; -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :before { content: ''; position: absolute; @size: 100%; left: -50%; top: -50%; border: 9px solid ${ink(c)}; border-radius: 50%;${pt} } :after { content: ''; position: absolute; @size: 100%; left: 50%; top: 50%; border: 9px solid ${ink(c)}; border-radius: 50%;${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Crescent', 13, 'Clean crescent moons turning through their phases, the bite swinging to a new edge each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { width: 84%; height: 84%; margin: 8%; border-radius: 50%; background: ${ink(c)}; -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :after { content: ''; position: absolute; @size: 100%; left: 34%; top: 0; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Sector', 8, 'Pie sectors of changing sweep, each disc eating a different slice and spinning to a new bearing.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { width: 88%; height: 88%; margin: 6%; border-radius: 50%; background: ${ink(c)}; -webkit-clip-path: @pick(polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%), polygon(50% 50%, 100% 50%, 100% 100%, 0 100%, 0 50%), polygon(50% 50%, 50% 0, 100% 0, 100% 50%)); clip-path: @pick(polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%), polygon(50% 50%, 100% 50%, 100% 100%, 0 100%, 0 50%), polygon(50% 50%, 50% 0, 100% 0, 100% 50%)); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Eyelet', 21, 'Grommet rings with a punched centre, each eyelet re-threading its colours on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { width: 86%; height: 86%; margin: 7%; border-radius: 50%; background: ${ink(c)}; :before { content: ''; position: absolute; inset: 26%; border-radius: 50%; background: var(--color0);${pt} } :after { content: ''; position: absolute; inset: 39%; border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Fanlight', 2, 'Quarter fans of nested arcs spreading from a corner like a fanlight window, re-tinting on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { overflow: hidden; background: var(--color1); :after { content: ''; position: absolute; @size: 200%; left: -50%; top: -50%; border-radius: 50%; background: radial-gradient(circle at 100% 100%, transparent 26%, ${ink(c)} 26% 44%, transparent 44% 62%, ${ink(c)} 62% 80%, transparent 80%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot));${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.92 });

add('Scallop', 27, 'Rows of half-round scallops cresting like roof tiles, the shells fading and re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: radial-gradient(circle at 50% 100%, ${ink(c)} 0 47%, transparent 49%) 0 100% / 33.4% 60% repeat-x, var(--color0); opacity: @rand(0.7, 1); }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.92 });

add('Fishscale', 14, 'Overlapping scales tiling into shoals, every scale re-shading as the light shifts on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { :after { content: ''; position: absolute; left: 0; top: -6%; @size: 100%; border-radius: 0 0 999px 999px; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Spectrum', 1, 'Smooth colour wheels turning a quarter at a time, the spectrum sweeping to a new orientation each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { width: 88%; height: 88%; margin: 6%; border-radius: 50%; background: conic-gradient(from 0deg, ${ink(c)}, ${ink(c)}, ${ink(c)}, ${ink(c)}, ${ink(c)}); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Coil', 23, 'Colour-wheel rings with a hollow hub, the coil re-winding to a new angle on each redraw.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { width: 90%; height: 90%; margin: 5%; border-radius: 50%; background: conic-gradient(from 0deg, ${ink(c)}, ${ink(c)}, ${ink(c)}); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :after { content: ''; position: absolute; inset: 34%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Lens', 3, 'Two overlapping discs blending where they cross, the vesica re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { :before { content: ''; position: absolute; left: 8%; top: 18%; @size: 64%; border-radius: 50%; background: ${ink(c)}; mix-blend-mode: screen;${pt} } :after { content: ''; position: absolute; left: 28%; top: 18%; @size: 64%; border-radius: 50%; background: ${ink(c)}; mix-blend-mode: screen;${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Orb', 0, 'Shaded spheres with a soft highlight, each ball re-colouring smoothly on every seed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { width: 82%; height: 82%; margin: 9%; border-radius: 50%; background: ${ink(c)}; box-shadow: inset -8px -8px 18px rgba(0,0,0,0.35), inset 8px 8px 16px rgba(255,255,255,0.45); :after { content: ''; position: absolute; left: 24%; top: 18%; @size: 26%; border-radius: 50%; background: rgba(255,255,255,0.55); }${TR} }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Vinyl', 24, 'Spinning records with a re-coloured label, the disc turning a step on each redraw.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { width: 92%; height: 92%; margin: 4%; border-radius: 50%; background: var(--color1); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :before { content: ''; position: absolute; inset: 30%; border-radius: 50%; background: ${ink(c, 2)};${pt} } :after { content: ''; position: absolute; inset: 46%; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

// ── B. Triangles & polygons (non half-square) ──────────────────────────────
add('Pennant', 5, 'Triangular pennants strung point-down, the bunting flipping to new corners on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 180deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 100% 0, 50% 100%); clip-path: polygon(0 0, 100% 0, 50% 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Spire', 18, 'Slender isosceles spires standing in ranks, re-pointing up or down on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 180deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 100%, 0 100%); clip-path: polygon(50% 0, 100% 100%, 0 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Hexbloom', 15, 'A honeycomb of flat-top hexagons, each cell re-inking on every redraw.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); }${TR}`,
}));

add('Octant', 20, 'Octagons set in a grid with little squares minding the gaps — re-coloured tile by tile.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: var(--color0); :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%); clip-path: polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%);${pt} } }${TR}`,
}));

add('Gablet', 11, 'Little house pentagons lined up like a row of rooftops, re-tiling on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%); clip-path: polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%); }${TR}`,
}));

add('Trapeze', 22, 'Trapezoids alternating wide-up and wide-down, locking into a banded tessellation.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 180deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(22% 0, 78% 0, 100% 100%, 0 100%); clip-path: polygon(22% 0, 78% 0, 100% 100%, 0 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Skew', 6, 'Leaning parallelograms shearing one way then the other, a field of slanted blocks.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 180deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(28% 0, 100% 0, 72% 100%, 0 100%); clip-path: polygon(28% 0, 100% 0, 72% 100%, 0 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Kite', 26, 'Diamond kites tilted on the breeze, re-trimming their colours each seed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 90% 32%, 50% 100%, 10% 32%); clip-path: polygon(50% 0, 90% 32%, 50% 100%, 10% 32%); }${TR}`,
}));

add('Quartz', 4, 'Cells split into four triangles meeting at the centre, each shard re-inking on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: var(--color0); :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 100% 0, 50% 50%); clip-path: polygon(0 0, 100% 0, 50% 50%);${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(0 100%, 100% 100%, 50% 50%); clip-path: polygon(0 100%, 100% 100%, 50% 50%);${pt} } }${TR}`,
}));

add('Hourglass', 9, 'Bowtie hourglasses pinching at the waist, swivelling upright or sideways on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 100% 0, 50% 50%, 100% 100%, 0 100%, 50% 50%); clip-path: polygon(0 0, 100% 0, 50% 50%, 100% 100%, 0 100%, 50% 50%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Arrowplay', 1, 'Play-button triangles all pointing one of four ways, re-aiming on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(15% 0, 100% 50%, 15% 100%); clip-path: polygon(15% 0, 100% 50%, 15% 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Dart', 13, 'Concave darts notched at the tail, chaining into arrowed rows that re-aim on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 100% 50%, 0 100%, 35% 50%); clip-path: polygon(0 0, 100% 50%, 0 100%, 35% 50%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Tumble', 17, 'Isometric tumbling blocks, three faces of each cube re-shading as the stack shifts.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 120deg, 240deg); @random(\${shapeFrequency}) { -webkit-clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); background: conic-gradient(from 90deg, ${ink(c)} 0 120deg, ${ink(c)} 120deg 240deg, ${ink(c)} 240deg 360deg); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Sextant', 14, 'Discs sliced into six pie wedges, the wheel ratcheting round a notch on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 60deg, 120deg, 180deg); @random(\${shapeFrequency}) { width: 88%; height: 88%; margin: 6%; border-radius: 50%; background: conic-gradient(from 0deg, ${ink(c)} 0 60deg, ${ink(c)} 60deg 120deg, ${ink(c)} 120deg 180deg, ${ink(c)} 180deg 240deg, ${ink(c)} 240deg 300deg, ${ink(c)} 300deg 360deg); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Triquetra', 16, 'Three-bladed triskelions spinning between quantized angles, a field of pinned propellers.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 120deg, 240deg); @random(\${shapeFrequency}) { width: 88%; height: 88%; margin: 6%; border-radius: 50%; background: conic-gradient(from 0deg, ${ink(c)} 0 60deg, var(--color0) 60deg 120deg, ${ink(c)} 120deg 180deg, var(--color0) 180deg 240deg, ${ink(c)} 240deg 300deg, var(--color0) 300deg 360deg); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

// ── C. Stars & radial ──────────────────────────────────────────────────────
add('Northstar', 0, 'Four-point compass stars, each re-inking and the field twinkling on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%); clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%); }${TR}`,
}));

add('Hexagram', 13, 'Six-point stars locked in a grid, each star re-shading on every redraw.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 63% 25%, 91% 25%, 68% 50%, 91% 75%, 63% 75%, 50% 100%, 37% 75%, 9% 75%, 32% 50%, 9% 25%, 37% 25%); clip-path: polygon(50% 0, 63% 25%, 91% 25%, 68% 50%, 91% 75%, 63% 75%, 50% 100%, 37% 75%, 9% 75%, 32% 50%, 9% 25%, 37% 25%); }${TR}`,
}));

add('Compass', 2, 'A four-arm compass rose with bright and shadowed flukes, re-bearing on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: var(--color0); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(50% 8%, 58% 50%, 50% 50%); clip-path: polygon(50% 8%, 58% 50%, 50% 50%);${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(92% 50%, 50% 58%, 50% 50%); clip-path: polygon(92% 50%, 50% 58%, 50% 50%);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Sunburst', 8, 'Centred sunbursts of triangular rays, the wheel turning a step on every seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 45deg, 90deg); @random(\${shapeFrequency}) { width: 92%; height: 92%; margin: 4%; border-radius: 50%; background: conic-gradient(${ink(c)} 0 12.5%, var(--color0) 0 25%, ${ink(c)} 0 37.5%, var(--color0) 0 50%, ${ink(c)} 0 62.5%, var(--color0) 0 75%, ${ink(c)} 0 87.5%, var(--color0) 0); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Diamonddust', 18, 'Tiny upright diamonds set like studs, the whole field re-inking on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { :after { content: ''; position: absolute; inset: 22%; background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);${pt} } }${TR}`,
}));

add('Starflake', 1, 'Eight-pointed quilt stars, each ray re-colouring as the block resettles on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: var(--color1); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :after { content: ''; position: absolute; inset: 0; background: ${ink(c, 2)}; -webkit-clip-path: polygon(50% 0, 63% 37%, 100% 50%, 63% 63%, 50% 100%, 37% 63%, 0 50%, 37% 37%); clip-path: polygon(50% 0, 63% 37%, 100% 50%, 63% 63%, 50% 100%, 37% 63%, 0 50%, 37% 37%);${pt} } }${TR}`,
}));

add('Pinwheelstar', 19, 'A pinwheel of four right triangles spinning around the centre — the broken-dishes quilt block.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: var(--color0); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 50% 0, 50% 50%); clip-path: polygon(0 0, 50% 0, 50% 50%);${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(100% 0, 100% 50%, 50% 50%); clip-path: polygon(100% 0, 100% 50%, 50% 50%);${pt} } }${TR}`,
}));

add('Asterisk', 24, 'Radiating asterisk spokes, the burst re-angling a notch on every redraw.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 30deg, 60deg); @random(\${shapeFrequency}) { width: 90%; height: 90%; margin: 5%; border-radius: 50%; background: conic-gradient(from 0deg, ${ink(c)} 0 8%, var(--color0) 8% 25%, ${ink(c)} 25% 33%, var(--color0) 33% 50%, ${ink(c)} 50% 58%, var(--color0) 58% 75%, ${ink(c)} 75% 83%, var(--color0) 83%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

// ── D. Crosses, plus, L-shapes & tetrominoes ───────────────────────────────
add('Plus', 20, 'Plump plus signs filling the grid, each cross re-inking on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(35% 0, 65% 0, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%, 0 35%, 35% 35%); clip-path: polygon(35% 0, 65% 0, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%, 0 35%, 35% 35%); }${TR}`,
}));

add('Saltire', 3, 'Diagonal X saltires crossing the grid, the strokes re-colouring on each seed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 18%, 18% 0, 50% 32%, 82% 0, 100% 18%, 68% 50%, 100% 82%, 82% 100%, 50% 68%, 18% 100%, 0 82%, 32% 50%); clip-path: polygon(0 18%, 18% 0, 50% 32%, 82% 0, 100% 18%, 68% 50%, 100% 82%, 82% 100%, 50% 68%, 18% 100%, 0 82%, 32% 50%); }${TR}`,
}));

add('Bracket', 5, 'L-shaped brackets clicking into corners, each elbow re-orienting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 42% 0, 42% 58%, 100% 58%, 100% 100%, 0 100%); clip-path: polygon(0 0, 42% 0, 42% 58%, 100% 58%, 100% 100%, 0 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Tetro', 1, 'T-blocks dropping into place, every tetromino turning to a new orientation each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 100% 0, 100% 50%, 66% 50%, 66% 100%, 33% 100%, 33% 50%, 0 50%); clip-path: polygon(0 0, 100% 0, 100% 50%, 66% 50%, 66% 100%, 33% 100%, 33% 50%, 0 50%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Maltese', 13, 'Maltese crosses with flared arms, re-shading on every redraw.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 50%, 22% 0, 78% 0, 50% 50%, 100% 22%, 100% 78%, 50% 50%, 78% 100%, 22% 100%, 50% 50%, 0 78%, 0 22%); clip-path: polygon(50% 50%, 22% 0, 78% 0, 50% 50%, 100% 22%, 100% 78%, 50% 50%, 78% 100%, 22% 100%, 50% 50%, 0 78%, 0 22%); }${TR}`,
}));

add('Crosslet', 21, 'Slim crosses with a tinted square at every intersection, re-inking on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: var(--color0); :before { content: ''; position: absolute; left: 42%; top: 8%; width: 16%; height: 84%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 8%; top: 42%; width: 84%; height: 16%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.92 });

add('Zee', 6, 'S- and Z-blocks zig-zagging across the grid, each re-flipping on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 66% 0, 66% 50%, 100% 50%, 100% 100%, 34% 100%, 34% 50%, 0 50%); clip-path: polygon(0 0, 66% 0, 66% 50%, 100% 50%, 100% 100%, 34% 100%, 34% 50%, 0 50%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Merlon', 23, 'Squared U-notches like castle merlons, each turning to a new wall on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 66% 100%, 66% 45%, 34% 45%, 34% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 66% 100%, 66% 45%, 34% 45%, 34% 100%, 0 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Ibeam', 24, 'Capital I-beams standing and lying down, the girders re-colouring each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(15% 0, 85% 0, 85% 28%, 64% 28%, 64% 72%, 85% 72%, 85% 100%, 15% 100%, 15% 72%, 36% 72%, 36% 28%, 15% 28%); clip-path: polygon(15% 0, 85% 0, 85% 28%, 64% 28%, 64% 72%, 85% 72%, 85% 100%, 15% 100%, 15% 72%, 36% 72%, 36% 28%, 15% 28%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Pinion', 14, 'Cogged squares with notched corners meshing across the grid, re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(20% 0, 40% 12%, 60% 12%, 80% 0, 88% 20%, 100% 40%, 100% 60%, 88% 80%, 80% 100%, 60% 88%, 40% 88%, 20% 100%, 12% 80%, 0 60%, 0 40%, 12% 20%); clip-path: polygon(20% 0, 40% 12%, 60% 12%, 80% 0, 88% 20%, 100% 40%, 100% 60%, 88% 80%, 80% 100%, 60% 88%, 40% 88%, 20% 100%, 12% 80%, 0 60%, 0 40%, 12% 20%); }${TR}`,
}));

add('Chalice', 9, 'Goblet silhouettes alternating upright and inverted, a stippled stemware grid.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 180deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(20% 0, 80% 0, 62% 45%, 62% 82%, 85% 82%, 85% 100%, 15% 100%, 15% 82%, 38% 82%, 38% 45%); clip-path: polygon(20% 0, 80% 0, 62% 45%, 62% 82%, 85% 82%, 85% 100%, 15% 100%, 15% 82%, 38% 82%, 38% 45%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

// ── E. Squares, frames & windows ───────────────────────────────────────────
add('Quadrille', 4, 'Each cell split into four colour quadrants, a little mosaic that re-inks on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; :before { content: ''; position: absolute; left: 0; top: 0; @size: 50%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; right: 0; bottom: 0; @size: 50%; background: ${ink(c)};${pt} } }${TR}`,
}));

add('Passepartout', 0, 'Open square frames nested two deep — picture mats that re-colour, not fill, on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; :before { content: ''; position: absolute; inset: 16%; background: var(--color0);${pt} } :after { content: ''; position: absolute; inset: 32%; background: ${ink(c)};${pt} } }${TR}`,
}));

add('Spiralblock', 18, 'A squared-off spiral coiling into each cell, re-winding its tint on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 25% 100%, 25% 40%, 60% 40%, 60% 75%, 40% 75%, 40% 60%, 0 60%); clip-path: polygon(0 0, 100% 0, 100% 100%, 25% 100%, 25% 40%, 60% 40%, 60% 75%, 40% 75%, 40% 60%, 0 60%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Fourpane', 6, 'Window cells quartered by a clean cross of muntins, panes re-glazing on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: var(--color1); :before { content: ''; position: absolute; left: 6%; top: 6%; width: 40%; height: 40%; background: ${ink(c, 2)};${pt} } :after { content: ''; position: absolute; right: 6%; bottom: 6%; width: 40%; height: 40%; background: ${ink(c, 2)};${pt} } }${TR}`,
}));

add('Offset', 24, 'Solid blocks with a hard drop-shadow twin behind them, popping in 2.5-D on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: var(--color0); :before { content: ''; position: absolute; left: 26%; top: 26%; @size: 60%; background: var(--color1);${pt} } :after { content: ''; position: absolute; left: 12%; top: 12%; @size: 60%; background: ${ink(c, 2)};${pt} } }${TR}`,
}));

add('Beveled', 21, 'Squares with bright bevels on two sides and shadow on the others, re-lighting each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; border-top: 14px solid rgba(255,255,255,0.5); border-left: 14px solid rgba(255,255,255,0.3); border-right: 14px solid rgba(0,0,0,0.28); border-bottom: 14px solid rgba(0,0,0,0.4); box-sizing: border-box; -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Tictac', 1, 'A miniature nine-square grid in every cell, the centre patch re-inking on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; :after { content: ''; position: absolute; inset: 34%; background: ${ink(c)};${pt} } }${TR}`,
}));

add('Inset', 13, 'A square dropped into a recessed well, the inner panel re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; :after { content: ''; position: absolute; inset: 24%; border-radius: 8%; background: ${ink(c)}; box-shadow: inset 0 0 0 6px rgba(0,0,0,0.18);${pt} } }${TR}`,
}));

add('Pennantbox', 22, 'Squares with a triangular corner folded down like a turned page, re-folding each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :after { content: ''; position: absolute; right: 0; top: 0; @size: 44%; background: var(--color0); -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%); clip-path: polygon(0 0, 100% 0, 100% 100%);${pt} } }${TR}`,
}));

add('Keypad', 17, 'Rounded keycaps pressed in a tidy grid, each cap re-inking on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { width: 84%; height: 84%; margin: 8%; border-radius: 22%; background: ${ink(c)}; box-shadow: inset 0 -7px 0 rgba(0,0,0,0.22), inset 0 4px 0 rgba(255,255,255,0.3); }${TR}`,
}));

add('Cartouche', 26, 'Rounded-end nameplates lying in rows, each lozenge re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { width: 92%; height: 56%; margin: 22% 4%; border-radius: 999px; background: ${ink(c)}; }${TR}`,
}));

add('Portal', 2, 'Arched doorways topped with a semicircle, the openings re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { :after { content: ''; position: absolute; left: 14%; bottom: 0; width: 72%; height: 88%; border-radius: 999px 999px 0 0; background: ${ink(c)};${pt} } }${TR}`,
}));

// ── F. Lines & strokes ─────────────────────────────────────────────────────
add('Crosshatch', 0, 'Cells crossed by both diagonals into an X-hatch, the strokes re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: linear-gradient(45deg, transparent 43%, ${ink(c)} 43% 57%, transparent 57%), linear-gradient(-45deg, transparent 43%, ${ink(c)} 43% 57%, transparent 57%); :after { content: ''; position: absolute; left: 44%; top: 44%; @size: 12%; background: ${ink(c)};${pt} } }${TR}`,
}));

add('Rungs', 18, 'Ladder rungs stacked across the cell, turning upright or flat on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: repeating-linear-gradient(0deg, ${ink(c)} 0 14%, var(--color0) 14% 28%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Target', 13, 'Concentric square outlines drawing the eye inward, the rings re-tinting on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; :before { content: ''; position: absolute; inset: 18%; background: var(--color0);${pt} } :after { content: ''; position: absolute; inset: 30%; background: ${ink(c)}; box-shadow: 0 0 0 12px var(--color0), 0 0 0 24px ${ink(c)};${pt} } }${TR}`,
}));

add('Picket', 11, 'A picket fence of vertical pales, the slats fading and re-colouring as the light moves on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: repeating-linear-gradient(90deg, ${ink(c)} 0 30%, var(--color0) 30% 50%); opacity: @rand(0.55, 1); }${TR}`,
}));

add('Trackline', 24, 'Parallel diagonal hatch lines slanting one way then the other on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: repeating-linear-gradient(45deg, ${ink(c)} 0 10%, var(--color0) 10% 24%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Junction', 23, 'A clean grid of crossing rules studded with a node at each junction, re-weighting on reseed.', (c) => ({
  vars: '',
  rule: `margin: -0.5px; @random(\${shapeFrequency}) { border-top: @pick(5px, 9px) solid ${ink(c)}; border-left: @pick(5px, 9px) solid ${ink(c)}; } @random(0.3) { :after { content: ''; position: absolute; left: 0; top: 0; @size: 18%; margin: -9%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '10x15', tg: '7x7', tf: 0.95 });

add('Wicket', 6, 'Croquet hoops — squared arches springing from the baseline, re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { :after { content: ''; position: absolute; left: 18%; bottom: 0; width: 64%; height: 78%; border: 12px solid ${ink(c)}; border-bottom: none; border-radius: 60% 60% 0 0; box-sizing: border-box;${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.92 });

add('Zigline', 1, 'A single bold zigzag stroke threading the grid, re-routing its direction each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 20%, 50% 60%, 100% 20%, 100% 40%, 50% 80%, 0 40%); clip-path: polygon(0 20%, 50% 60%, 100% 20%, 100% 40%, 50% 80%, 0 40%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Keywork', 20, 'A Greek-key meander stroke turning at right angles, re-orienting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 100% 0, 100% 20%, 20% 20%, 20% 100%, 0 100%, 0 60%, 60% 60%, 60% 40%, 0 40%); clip-path: polygon(0 0, 100% 0, 100% 20%, 20% 20%, 20% 100%, 0 100%, 0 60%, 60% 60%, 60% 40%, 0 40%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Tally', 25, 'Bundles of upright tally strokes with the odd diagonal cross-out, re-counting each seed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: repeating-linear-gradient(90deg, ${ink(c)} 0 12%, var(--color0) 12% 25%); } @random(0.25) { :after { content: ''; position: absolute; inset: 10% 0; background: ${ink(c)}; -webkit-clip-path: polygon(0 78%, 100% 12%, 100% 26%, 0 92%); clip-path: polygon(0 78%, 100% 12%, 100% 26%, 0 92%);${pt} } }${TR}`,
}));

// ── G. Diamonds & lozenges ─────────────────────────────────────────────────
add('Lattice', 5, 'A diamond lattice of crossing diagonals with a coloured pip in each lozenge — argyle, re-pipped on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; :after { content: ''; position: absolute; inset: 26%; background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);${pt} } }${TR}`,
}));

add('Caltrop', 14, 'Four-pointed caltrop diamonds biting into a grid, each re-shading on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 12%, 62% 38%, 88% 50%, 62% 62%, 50% 88%, 38% 62%, 12% 50%, 38% 38%); clip-path: polygon(50% 12%, 62% 38%, 88% 50%, 62% 62%, 50% 88%, 38% 62%, 12% 50%, 38% 38%); }${TR}`,
}));

add('Diamondframe', 17, 'Open diamond outlines, a rotated windowpane that re-tints rather than fills on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); :after { content: ''; position: absolute; inset: 0; background: var(--color0); -webkit-clip-path: polygon(50% 18%, 82% 50%, 50% 82%, 18% 50%); clip-path: polygon(50% 18%, 82% 50%, 50% 82%, 18% 50%);${pt} } }${TR}`,
}));

add('Harlequin', 9, 'Two-tone harlequin diamonds — the classic motley, re-colouring on every redraw.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); }${TR}`,
}));

add('Chevrondiamond', 8, 'Diamonds split top-and-bottom into two shades, re-inking each half on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(50% 50%, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 50%, 100% 50%, 50% 100%, 0 50%);${pt} } }${TR}`,
}));

add('Jewel', 13, 'Faceted gem diamonds with a bright table and shadowed pavilion, re-cut on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: var(--color0); :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(50% 5%, 80% 35%, 50% 50%, 20% 35%); clip-path: polygon(50% 5%, 80% 35%, 50% 50%, 20% 35%);${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(20% 35%, 50% 50%, 80% 35%, 50% 95%); clip-path: polygon(20% 35%, 50% 50%, 80% 35%, 50% 95%);${pt} } }${TR}`,
}));

// ── H. Chevrons, zigzags & steps (distinct shapes) ─────────────────────────
add('Flight', 19, 'Flying-geese blocks — a big triangle flanked by two small ones, re-aiming on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 100%, 0 100%); clip-path: polygon(50% 0, 100% 100%, 0 100%);${pt} } }${TR}`,
}));

add('Bargello', 1, 'Stacked nested chevrons in graded bands, the flame stitch re-flowing on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 180deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 50% 30%, 100% 0, 100% 30%, 50% 60%, 0 30%); clip-path: polygon(0 0, 50% 30%, 100% 0, 100% 30%, 50% 60%, 0 30%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :after { content: ''; position: absolute; left: 0; top: 40%; width: 100%; height: 60%; background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 50% 50%, 100% 0, 100% 30%, 50% 80%, 0 30%); clip-path: polygon(0 0, 50% 50%, 100% 0, 100% 30%, 50% 80%, 0 30%);${pt} } }${TR}`,
}));

add('Pyramid', 11, 'Stepped pyramids built of stacked tiers, climbing up or down on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 180deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 100%, 20% 66%, 35% 66%, 35% 33%, 50% 33%, 50% 0, 50% 33%, 65% 33%, 65% 66%, 80% 66%, 100% 100%); clip-path: polygon(0 100%, 20% 66%, 35% 66%, 35% 33%, 50% 33%, 50% 0, 65% 33%, 65% 66%, 80% 66%, 100% 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Ricrac', 9, 'A fat ric-rac zigzag ribbon woven across the grid, re-weaving its turns each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 30%, 30% 0, 50% 20%, 70% 0, 100% 30%, 70% 60%, 100% 100%, 70% 100%, 50% 80%, 30% 100%, 0 100%, 30% 60%); clip-path: polygon(0 30%, 30% 0, 50% 20%, 70% 0, 100% 30%, 70% 60%, 100% 100%, 70% 100%, 50% 80%, 30% 100%, 0 100%, 30% 60%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Sawedge', 24, 'A row of saw teeth biting along one edge, the blade re-facing on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 100% 0, 100% 55%, 83% 100%, 66% 55%, 50% 100%, 33% 55%, 16% 100%, 0 55%); clip-path: polygon(0 0, 100% 0, 100% 55%, 83% 100%, 66% 55%, 50% 100%, 33% 55%, 16% 100%, 0 55%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Switchback', 0, 'A bold L-turn switchback stroke, the trail doubling back to a new corner each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 35% 0, 35% 65%, 100% 65%, 100% 100%, 0 100%); clip-path: polygon(0 0, 35% 0, 35% 65%, 100% 65%, 100% 100%, 0 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Battlement', 3, 'Crenellated battlements marching along the top edge, re-toothing on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 35%, 20% 35%, 20% 0, 40% 0, 40% 35%, 60% 35%, 60% 0, 80% 0, 80% 35%, 100% 35%, 100% 100%, 0 100%); clip-path: polygon(0 35%, 20% 35%, 20% 0, 40% 0, 40% 35%, 60% 35%, 60% 0, 80% 0, 80% 35%, 100% 35%, 100% 100%, 0 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Ascent', 18, 'Right-triangle ramps climbing in four directions, an op-art slope field re-tilting each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 100%, 100% 100%, 100% 0); clip-path: polygon(0 100%, 100% 100%, 100% 0); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

// ── I. Bricks, weaves & herringbone ────────────────────────────────────────
add('Brickwork', 11, 'Running-bond bricks offset row by row, each course re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { width: 96%; height: 70%; margin: 15% 2%; border-radius: 6%; background: ${ink(c)}; } @match(y % 2 == 0) { :after { content: ''; position: absolute; left: -50%; top: 15%; width: 96%; height: 70%; border-radius: 6%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.95 });

add('Parquet', 12, 'Basket-weave parquet — pairs of planks alternating upright and flat, re-laid on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: repeating-linear-gradient(0deg, ${ink(c)} 0 24%, var(--color0) 24% 28%, ${ink(c)} 28% 52%, var(--color0) 52% 56%, ${ink(c)} 56% 80%, var(--color0) 80% 84%, ${ink(c)} 84% 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Herringbone', 23, 'Slanted planks zig-zagging into a herringbone, each lath re-tilting on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(45deg, 135deg); @random(\${shapeFrequency}) { background: ${ink(c)}; width: 140%; height: 40%; margin: 30% -20%; -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}), { grid: '8x12', tg: '6x6', tf: 0.95 });

add('Stackbond', 5, 'Stack-bond tiles in tidy columns with grouted gaps, re-glazing tile by tile on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { width: 88%; height: 88%; margin: 6%; border-radius: 10%; background: ${ink(c)}; }${TR}`,
}));

add('Pinwheelweave', 1, 'A parquet pinwheel — four planks circling a small square, re-spinning on each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: var(--color0); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :before { content: ''; position: absolute; left: 6%; top: 6%; width: 60%; height: 26%; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; right: 6%; top: 6%; width: 26%; height: 60%; background: ${ink(c)};${pt} } }${TR}`,
}));

add('Weft', 28 % 28, 'Over-under basket weave — horizontal and vertical bands interlacing, re-threaded on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: var(--color0); :before { content: ''; position: absolute; left: 0; top: 28%; width: 100%; height: 44%; background: ${ink(c)};${pt} } } @match((x + y) % 2 == 0) { :before { left: 28%; top: 0; width: 44%; height: 100%; } }${TR}`,
}));

// ── J. Op-art & gradient facets ────────────────────────────────────────────
add('Facetgrad', 0, 'Each tile a two-stop diagonal gradient, the facets re-lighting and re-aiming on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: linear-gradient(135deg, ${ink(c)}, ${ink(c)}); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Bulge', 18, 'A grid of discs swelling from small to large across the field, re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: calc(88% * (0.25 + 0.75 * (@x + @y) / (@X + @Y))); -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '8x12', tg: '7x7', tf: 0.95 });

add('Prismfold', 8, 'Folded paper facets catching the light, each panel a soft gradient that re-tilts on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: var(--color0); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, ${ink(c)}, rgba(0,0,0,0.15)); -webkit-clip-path: polygon(0 0, 100% 0, 50% 50%); clip-path: polygon(0 0, 100% 0, 50% 50%);${pt} } :after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, ${ink(c)}, rgba(255,255,255,0.15)); -webkit-clip-path: polygon(0 100%, 100% 100%, 50% 50%); clip-path: polygon(0 100%, 100% 100%, 50% 50%);${pt} } }${TR}`,
}));

add('Halo', 14, 'Glowing dots haloed in soft light, each bloom re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 36%; margin: -18%; border-radius: 50%; background: ${ink(c)}; box-shadow: 0 0 calc(120px / @Y) ${ink(c)}, 0 0 calc(260px / @Y) ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '5x5', tf: 0.9 });

add('Moonphase', 1, 'A waxing-to-waning strip of phases — discs eaten away by an offset shadow that slides on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { width: 80%; height: 80%; margin: 10%; border-radius: 50%; background: ${ink(c)}; :after { content: ''; position: absolute; @size: 100%; left: @pick(-60%, -30%, 0%, 30%, 60%); top: 0; border-radius: 50%; background: var(--color0);${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Ribbonfold', 22, 'Pleated ribbon catching highlights and shadows in alternating bands, re-folding on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: repeating-linear-gradient(90deg, ${ink(c)} 0 10%, rgba(0,0,0,0.28) 10% 12%, ${ink(c)} 12% 22%, rgba(255,255,255,0.3) 22% 24%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Quasar', 13, 'A bright core ringed by a glowing halo, pulsing to a new colour on each seed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { :after { content: ''; position: absolute; left: 50%; top: 50%; @size: 30%; margin: -15%; border-radius: 50%; background: ${ink(c)}; box-shadow: 0 0 0 calc(40px / @Y) ${ink(c)}, 0 0 calc(200px / @Y) calc(40px / @Y) ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.85 });

add('Caustic', 0, 'Concentric ripple rings spreading from the corner like light on water, re-tinting each seed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { overflow: hidden; background: var(--color0); :after { content: ''; position: absolute; @size: 200%; left: -50%; top: -50%; border-radius: 50%; background: repeating-radial-gradient(circle at 100% 100%, ${ink(c)} 0 7%, var(--color0) 7% 14%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot));${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.92 });

add('Mosaicglass', 20, 'Stained-glass shards leaded into the grid, each pane a clean triangle re-glazing on reseed.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; border: 3px solid var(--color0); box-sizing: border-box; -webkit-clip-path: polygon(0 0, 100% 0, 0 100%); clip-path: polygon(0 0, 100% 0, 0 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); }${TR}`,
}));

add('Venn', 9, 'Three overlapping discs mixing where they meet, the rosette re-colouring on reseed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { width: 52%; height: 52%; margin: 12% 24% 36% 24%; border-radius: 50%; background: ${ink(c)}; mix-blend-mode: screen; :before { content: ''; position: absolute; left: -58%; top: 78%; @size: 100%; border-radius: 50%; background: ${ink(c)}; mix-blend-mode: screen;${pt} } :after { content: ''; position: absolute; left: 58%; top: 78%; @size: 100%; border-radius: 50%; background: ${ink(c)}; mix-blend-mode: screen;${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.9 });

add('Range', 18, 'Layered triangular mountain ranges, near and far peaks re-shading on each seed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: var(--color0); :before { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(0 100%, 30% 38%, 56% 100%); clip-path: polygon(0 100%, 30% 38%, 56% 100%);${pt} } :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: polygon(44% 100%, 74% 24%, 100% 100%); clip-path: polygon(44% 100%, 74% 24%, 100% 100%);${pt} } }${TR}`,
}));

add('Dune', 8, 'Layered rounded dunes cresting in overlapping bands, the ridgelines re-shading on each seed.', (c) => ({
  vars: '',
  rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; :before { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 66%; border-radius: 50% 50% 0 0 / 32% 32% 0 0; background: ${ink(c)};${pt} } :after { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 33%; border-radius: 50% 50% 0 0 / 60% 60% 0 0; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '6x9', tg: '4x4', tf: 0.92 });
