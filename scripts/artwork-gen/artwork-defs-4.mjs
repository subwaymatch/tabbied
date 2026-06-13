// Batch 4 (gallery orders 210+): 100 geometric, well-aligned designs.
//
// The brief: shapes that are geometric and/or grid-aligned — half-square
// triangles, quarter discs, chevrons, staircases, stripes, diamonds,
// concentric rings, conic wedges — snapped to cell edges and rotated only to
// quantized angles (0/45/90/...). No continuous @rand rotation or scattered
// placement, so the field reads as organized rather than confetti.
//
// Each design is a vetted "motif" template instantiated across a pool of
// harmonious palettes. Conventions follow batches 1–3 and the originals:
//   * reseed variation rides on transition-able properties (background-color,
//     transform, clip-path, opacity, border-radius, border-width) — never on a
//     gradient alone, which can't transition and isn't sampled by the validator;
//   * a randomized custom prop referenced more than once is emitted at cell
//     level and read via @var(--x) (a plain var(--x) re-rolls per reference);
//   * every rule paints through an @random(${shapeFrequency}) gate and ends in
//     a transition so reseeds morph instead of snapping.

// Perceived-luminance test so dark-background designs get galleryWhite titles.
const isDark = (hex) => {
  const m = /^#([0-9a-f]{6})/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5;
};

// Ink picker over color1..color(max-1) (color0 is always the background), so
// every design references the full palette and the color-count slider bites.
const ink = (cmax, start = 1) => {
  const a = [];
  for (let i = start; i <= cmax - 1; i++) a.push(`var(--color${i})`);
  return `@p(${a.join(', ')})`;
};

// Harmonious palettes (color0 = background). Mixed across families for variety.
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

// ── Motif templates ────────────────────────────────────────────────────────
// Each returns { vars, rule }. `c` is colors.max for that artwork.
const T = {
  // Half-square triangles: one diagonal per cell, snapped to a corner.
  hst: (c) => ({
    vars: '',
    rule: `--tri: @p(polygon(0 0, 100% 0, 100% 100%), polygon(0 0, 100% 0, 0 100%), polygon(0 0, 100% 100%, 0 100%), polygon(100% 0, 100% 100%, 0 100%)); margin: -0.5px; @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: @var(--tri); clip-path: @var(--tri); } -webkit-transition: ease 500ms; transition: ease 500ms;`,
  }),
  // Two-tone half-square: a solid ground with a triangle of a second ink cut
  // across it, so each block splits along one diagonal.
  twotone: (c) => ({
    vars: '',
    rule: `--cut: @p(polygon(0 0, 100% 0, 100% 100%), polygon(0 0, 100% 0, 0 100%), polygon(0 0, 100% 100%, 0 100%), polygon(100% 0, 100% 100%, 0 100%)); @random(\${shapeFrequency}) { background: ${ink(c)}; :after { content: ''; position: absolute; inset: 0; background: ${ink(c)}; -webkit-clip-path: @var(--cut); clip-path: @var(--cut); -webkit-transition: ease 500ms; transition: ease 500ms; } } -webkit-transition: ease 500ms; transition: ease 500ms;`,
  }),
  // Diagonal stripe bands; warp/weft direction rides on a quantized rotation so
  // it animates on reseed (the gradient itself can't transition).
  stripes: (c) => ({
    vars: '',
    rule: `--rot: @pick(0deg, 90deg); @random(\${shapeFrequency}) { background: repeating-linear-gradient(45deg, ${ink(c)} 0 16%, var(--color0) 16% 32%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
  // Thick six-point chevrons; vertical orientations weighted so columns chain
  // into zigzag ribbons.
  chevron: (c) => ({
    vars: '',
    rule: `--rot: @pick(0deg, 0deg, 180deg, 180deg, 90deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 0, 50% 50%, 100% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(0 0, 50% 50%, 100% 0, 100% 50%, 50% 100%, 0 50%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
  // Three-step staircases climbing in one of four directions.
  staircase: (c) => ({
    vars: '',
    rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(0 100%, 0 66.6%, 33.3% 66.6%, 33.3% 33.3%, 66.6% 33.3%, 66.6% 0, 100% 0, 100% 100%); clip-path: polygon(0 100%, 0 66.6%, 33.3% 66.6%, 33.3% 33.3%, 66.6% 33.3%, 66.6% 0, 100% 0, 100% 100%); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
  // Solid ground with a corner-anchored quarter disc; the corner is chosen by
  // rotating the cell so neighbours join into winding drunkard's-path curves.
  quarter: (c) => ({
    vars: '',
    rule: `--rot: @pick(0deg, 90deg, 180deg, 270deg); @random(\${shapeFrequency}) { background: var(--color1); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :after { content: ''; position: absolute; left: 0; top: 0; @size: 100%; background: ${ink(c, 2)}; -webkit-clip-path: circle(100% at 0 0); clip-path: circle(100% at 0 0); -webkit-transition: ease 400ms; transition: ease 400ms; } } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
  // Discs split into four quarter wedges; the spin rides on a quantized cell
  // rotation. Each quarter rolls its own ink for a colour-wheel effect.
  spinner: (c) => ({
    vars: '',
    rule: `--rot: @pick(0deg, 45deg, 90deg, 135deg); @random(\${shapeFrequency}) { width: 86%; height: 86%; margin: 7%; border-radius: 50%; background: conic-gradient(from 0deg, ${ink(c)} 0deg 90deg, ${ink(c)} 90deg 180deg, ${ink(c)} 180deg 270deg, ${ink(c)} 270deg 360deg); -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
  // Concentric target rings — three nested discs, each re-inking on reseed.
  bullseye: (c) => ({
    vars: '',
    rule: `@random(\${shapeFrequency}) { width: 92%; height: 92%; margin: 4%; border-radius: 50%; background: ${ink(c)}; :before { content: ''; position: absolute; inset: 22%; border-radius: 50%; background: ${ink(c)}; -webkit-transition: ease 500ms; transition: ease 500ms; } :after { content: ''; position: absolute; inset: 42%; border-radius: 50%; background: ${ink(c)}; -webkit-transition: ease 500ms; transition: ease 500ms; } } -webkit-transition: ease 500ms; transition: ease 500ms;`,
  }),
  // Rounded capsules standing in their columns; some stretch tall across rows.
  capsule: (c) => ({
    vars: '',
    rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; width: 60%; height: @pick(100%, 100%, 200%, 300%); margin-left: 20%; border-radius: 999px; -webkit-transition: ease 400ms; transition: ease 400ms; } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
  // Bauhaus corner-forms: every primitive is one border-radius value, so circle,
  // half-round, leaf and square all interpolate into one another.
  quadrant: (c) => ({
    vars: `--form: @p('50% 50% 50% 50%', '100% 100% 0% 0%', '0% 0% 100% 100%', '100% 0% 0% 100%', '0% 100% 100% 0%', '0% 0% 0% 0%', '100% 0% 100% 0%', '0% 100% 0% 100%');`,
    rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; border-radius: var(--form); } -webkit-transition: ease 600ms; transition: ease 600ms;`,
  }),
  // Argyle diamonds with a smaller diamond pip nested inside each.
  harlequin: (c) => ({
    vars: '',
    rule: `@random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); :after { content: ''; position: absolute; inset: 30%; background: ${ink(c)}; -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); -webkit-transition: ease 400ms; transition: ease 400ms; } } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
  // Windowpane lattice: independent top/left rules draw a grid of mullions with
  // the occasional node where they cross. Stroke weight flips on reseed.
  windowpane: (c) => ({
    vars: '',
    rule: `margin: -0.5px; @random(\${shapeFrequency}) { border-top: @pick(6px, 10px) solid ${ink(c)}; } @random(\${shapeFrequency}) { border-left: @pick(6px, 10px) solid ${ink(c)}; } @random(0.18) { :after { content: ''; position: absolute; @size: 26%; left: 37%; top: 37%; border-radius: @pick(0, 50%); background: ${ink(c)}; -webkit-transition: ease 400ms; transition: ease 400ms; } } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
  // Half discs snapped to one of the four cell edges, like overlapping fans.
  halfmoon: (c) => ({
    vars: '',
    rule: `--half: @pick(circle(50% at 50% 100%), circle(50% at 50% 0), circle(50% at 0 50%), circle(50% at 100% 50%)); @random(\${shapeFrequency}) { :after { content: ''; position: absolute; @size: 100%; background: ${ink(c)}; -webkit-clip-path: @var(--half); clip-path: @var(--half); -webkit-transition: ease 400ms; transition: ease 400ms; } } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
  // Nested concentric squares; some cells turn 45° into a diamond-in-square for
  // an op-art shimmer.
  nesting: (c) => ({
    vars: '',
    rule: `--rot: @pick(0deg, 0deg, 45deg); @random(\${shapeFrequency}) { background: ${ink(c)}; -webkit-transform: rotate(@var(--rot)); transform: rotate(@var(--rot)); :before { content: ''; position: absolute; inset: 20%; background: ${ink(c)}; -webkit-transition: ease 500ms; transition: ease 500ms; } :after { content: ''; position: absolute; inset: 38%; background: ${ink(c)}; -webkit-transition: ease 500ms; transition: ease 500ms; } } -webkit-transition: ease 500ms; transition: ease 500ms;`,
  }),
  // Bars rising from the baseline like an equalizer / skyline; heights step and
  // a few bars round their tops.
  equalizer: (c) => ({
    vars: '',
    rule: `@random(\${shapeFrequency}) { :after { content: ''; position: absolute; left: 16%; bottom: 0; width: 68%; height: @pick(35%, 60%, 85%, 100%); background: ${ink(c)}; border-radius: @pick(0px, 0px, 999px 999px 0 0); -webkit-transition: ease 400ms; transition: ease 400ms; } } -webkit-transition: ease 400ms; transition: ease 400ms;`,
  }),
};

// Per-template render defaults (grid / frequency) and thumbnail tuning.
const CFG = {
  hst: { grid: '8x12', freq: 1, tg: '6x6', tf: 0.92 },
  twotone: { grid: '8x12', freq: 1, tg: '5x5', tf: 0.95 },
  stripes: { grid: '8x12', freq: 1, tg: '5x5', tf: 0.9 },
  chevron: { grid: '8x12', freq: 1, tg: '5x5', tf: 0.9 },
  staircase: { grid: '8x12', freq: 1, tg: '6x6', tf: 0.92 },
  quarter: { grid: '8x12', freq: 1, tg: '6x6', tf: 0.95 },
  spinner: { grid: '6x9', freq: 1, tg: '4x4', tf: 0.9 },
  bullseye: { grid: '6x9', freq: 0.9, tg: '4x4', tf: 0.85 },
  capsule: { grid: '6x9', freq: 1, tg: '4x4', tf: 0.9 },
  quadrant: { grid: '8x12', freq: 1, tg: '5x5', tf: 0.95 },
  harlequin: { grid: '8x12', freq: 1, tg: '5x5', tf: 0.95 },
  windowpane: { grid: '10x15', freq: 1, tg: '6x6', tf: 0.9 },
  halfmoon: { grid: '6x9', freq: 1, tg: '4x4', tf: 0.9 },
  nesting: { grid: '6x9', freq: 1, tg: '5x5', tf: 0.92 },
  equalizer: { grid: '8x12', freq: 1, tg: '5x5', tf: 0.9 },
};

// [name, description] per artwork, grouped by motif family.
const FAMILIES = [
  ['hst', [
    ['Facet', 'A full-bleed mosaic of half-square triangles, every facet melting into its next orientation on reseed.'],
    ['Sailcloth', 'Triangular sails cut to the four corners, tacking to new headings each redraw.'],
    ['Flagstone', 'Angular flagstones paving the grid, each split along a single clean diagonal.'],
    ['Pennon', 'A field of little pennants pointing off corner to corner, re-flagging on every seed.'],
    ['Sierra', 'Mountain-like triangles ridge across the canvas, peaks flipping with each redraw.'],
    ['Galleon', 'Big triangular sails leaning into the wind, swapping inks and tack as they turn.'],
    ['Spinnaker', 'Billowing triangle sails snap between their four corners, the regatta reshuffling on reseed.'],
  ]],
  ['twotone', [
    ['Patchwork', 'Two-tone half-square patches, each block trading colours across its diagonal.'],
    ['Tangram', 'Squares cleaved into two triangles of different inks, recombining like tangram tiles.'],
    ['Halfcut', 'Every tile sliced once on the diagonal, the two halves re-inking on each seed.'],
    ['Counterpane', 'A pieced quilt of split squares, light and dark halves shuffling on reseed.'],
    ['Kerchief', 'Folded-kerchief triangles in two tones, refolding to new corners each redraw.'],
    ['Bandana', 'Bold two-colour bandana patches, each diagonal fold re-cutting on reseed.'],
    ['Diagonal', 'Clean diagonal splits march the grid, the halves trading hue and direction.'],
  ]],
  ['stripes', [
    ['Twill', 'Diagonal twill banding that switches warp for weft cell by cell.'],
    ['Corduroy', 'Ribbed corduroy wales running this way and that, re-combing on every seed.'],
    ['Cabana', 'Crisp cabana stripes pivoting between horizontal and vertical runs.'],
    ['Pinstripe', 'Fine pinstripes tilt and turn, the suiting re-pressing itself on reseed.'],
    ['Venetian', 'Venetian-blind slats rotate a quarter turn here and there as light shifts.'],
    ['Furrow', 'Ploughed furrows of colour, rows turning crosswise patch by patch.'],
    ['Deckchair', 'Striped deckchair canvas, panels swivelling between upright and sideways.'],
  ]],
  ['chevron', [
    ['Chevron', 'Thick chevron bands lock into zigzag ribbons, mostly steady with colourful breaks.'],
    ['Arrowhead', 'Arrowheads aligning into columns, pointing up or sideways on each redraw.'],
    ['Fletch', 'Feathered fletching notches stack into flights, re-aiming on reseed.'],
    ['Sawtooth', 'A sawtooth ribbon of chevrons biting across the grid in quantized turns.'],
    ['Dart', 'Sharp darts chained into zigzags, the seams re-folding with every seed.'],
    ['Bolt', 'Angular lightning chevrons crackle in straight, quantized jolts.'],
    ['Wigwam', 'Nested tent chevrons pitch across the field, re-staking on reseed.'],
  ]],
  ['staircase', [
    ['Stairwell', 'Stepped staircases climbing in four directions, an op-art stairfield.'],
    ['Battlement', 'Crenellated battlement steps marching the wall, re-toothing each redraw.'],
    ['Ascent', 'Rising staircases re-orienting their climb on every seed.'],
    ['Crenel', 'Castle-notch steps interlocking into a stepped skyline.'],
    ['Stepwell', 'Inverted stepwell stairs descending in turns, re-cutting on reseed.'],
    ['Meander', 'Greek-key staircases threading a quantized maze across the grid.'],
  ]],
  ['quarter', [
    ['Scallop', 'Corner quarter-discs join into scalloped curves wandering over solid ground.'],
    ['Fishscale', 'Overlapping quarter scales tile into shoals, re-curving on reseed.'],
    ['Cusp', 'Quarter arcs meet at cusps, the curves rerouting corner to corner.'],
    ['Drift', 'Quarter moons drift over a coloured ground, joining into snaking paths.'],
    ['Lune', 'Crescent quarter discs swing to new corners each redraw.'],
    ['Crook', 'Hooked quarter curves chain into crooks and loops on reseed.'],
    ['Serpentine', 'Quarter-circle bends link into serpentine ribbons across the grid.'],
  ]],
  ['spinner', [
    ['Spinner', 'Four-wedge discs spin to quantized angles, a field of paper spinners mid-turn.'],
    ['Windmill', 'Quartered windmill sails catch the wind, re-colouring on every seed.'],
    ['Carousel', 'Carousel discs of four wedges turn in steps, lights re-mixing on reseed.'],
    ['Cartwheel', 'Cartwheel discs roll a quarter turn at a time across the grid.'],
    ['Propeller', 'Two-blade propeller discs feather to new angles on each redraw.'],
    ['Sundial', 'Quartered sundials cast their gnomon to quantized hours on reseed.'],
    ['Turbine', 'Turbine discs of bright wedges pinwheel in stepped rotations.'],
  ]],
  ['bullseye', [
    ['Bullseye', 'Concentric target rings, each band re-inking on every redraw.'],
    ['Roundel', 'Stacked roundels in bold inks, the rings cycling colour on reseed.'],
    ['Vinyl', 'Spinning records with re-coloured labels and grooves on each seed.'],
    ['Halo', 'Haloed discs of nested rings, each circle picking a new hue.'],
    ['Onion', 'Layered onion rings nesting to the centre, re-shading on reseed.'],
    ['Tunnel', 'Concentric tunnels of rings drawing the eye inward, re-mixing per seed.'],
    ['Iris', 'Camera-iris rings dilating through re-coloured bands on each redraw.'],
  ]],
  ['capsule', [
    ['Capsule', 'Rounded capsules standing in their columns, some stretching tall across rows.'],
    ['Pillbox', 'Pill-shaped tablets line up by column, re-dosing colour on reseed.'],
    ['Lozenge', 'Rounded lozenges stack into bars, heights and inks shifting per seed.'],
    ['Tablet', 'Smooth tablets queue in tidy columns, lengthening and re-colouring on redraw.'],
    ['Lintel', 'Capsule lintels span the grid in stacked rounded bars.'],
    ['Plinth', 'Rounded plinths rise in columns, re-stacking their heights on reseed.'],
    ['Pylon', 'Tall rounded pylons march in ranks, re-inking with every seed.'],
  ]],
  ['quadrant', [
    ['Quadrant', 'Bauhaus corner-forms: circles, half-rounds and squares morphing through one radius.'],
    ['Cornerstone', 'Quarter-round cornerstones and discs interchanging on each redraw.'],
    ['Primary', 'Primary-coloured rounds and squares trade silhouettes fluidly on reseed.'],
    ['Albers', 'Hard-edge forms in homage to Albers, each radius melting to the next.'],
    ['Klee', 'Playful Klee-like primitives shift between disc, leaf and block.'],
    ['Schema', 'A schema of basic forms cycling their corners on every seed.'],
    ['Module', 'Modular corner-forms snap between rounded and square footprints.'],
  ]],
  ['harlequin', [
    ['Harlequin', 'Harlequin diamonds with a nested pip, the lattice re-colouring on reseed.'],
    ['Rhombus', 'Tessellating rhombi in two inks, each diamond re-shading per seed.'],
    ['Caltrop', 'Sharp caltrop diamonds interlocking across the grid.'],
    ['Jester', 'A jester motley of nested diamonds shuffling colour on redraw.'],
    ['Pip', 'Diamonds carrying a centre pip, both faces re-inking on each seed.'],
    ['Diamondback', 'A diamondback lattice of pointed lozenges re-skinning on reseed.'],
  ]],
  ['windowpane', [
    ['Windowpane', 'A lattice of mullions with the odd crossing node, re-weighting on reseed.'],
    ['Mullion', 'Window mullions rule the grid, bars thickening and thinning per seed.'],
    ['Casement', 'Casement panes framed by stepping bars, nodes lighting at crossings.'],
    ['Grille', 'A clean grille of lines, joints studded here and there on reseed.'],
    ['Transom', 'Transom bars partition the field, re-gauging their weight each redraw.'],
    ['Fretwork', 'Open fretwork of crossing lines with small bosses at the junctions.'],
  ]],
  ['halfmoon', [
    ['Halfmoon', 'Half discs snapped to the four edges, swinging like overlapping fans.'],
    ['Dome', 'Domes anchored to a cell edge, re-facing on every redraw.'],
    ['Sunburst', 'Edge-mounted half suns rising and setting in quantized turns.'],
    ['Igloo', 'Rounded igloo half-domes facing new edges each seed.'],
    ['Hemisphere', 'Bold hemispheres clipped to an edge, re-orienting on reseed.'],
    ['Sundown', 'Half suns dropping past the cell edge, re-aiming with each redraw.'],
  ]],
  ['nesting', [
    ['Nesting', 'Nested concentric squares, some pivoting 45° into a diamond-in-square.'],
    ['Framework', 'Squares framed within squares, the layers re-inking on reseed.'],
    ['Matte', 'Picture-matte frames stacked inward, re-colouring per seed.'],
    ['Vortex', 'Nested squares half-turning into an op-art vortex on each redraw.'],
    ['Boxcar', 'Boxed-in squares lined up like boxcars, layers shifting hue on reseed.'],
    ['Inset', 'Inset squares receding to the centre, re-shading with every seed.'],
    ['Telescope', 'Telescoping square frames drawing inward, re-mixing colour on reseed.'],
  ]],
  ['equalizer', [
    ['Equalizer', 'Bars rising from the baseline like an equalizer, levels stepping on reseed.'],
    ['Skyline', 'A blocky skyline of bars at stepped heights, re-building each redraw.'],
    ['Cityscape', 'City towers of varying height line the baseline, re-zoning on reseed.'],
    ['Histogram', 'A histogram of coloured columns re-sampling its bins per seed.'],
    ['Citadel', 'Citadel towers stand in ranks, heights and inks shifting on redraw.'],
    ['Columns', 'Upright columns of stepped height, re-coursing colour on reseed.'],
  ]],
];

let order = 210;
export const batch4 = [];
for (const [t, items] of FAMILIES) {
  const cfg = CFG[t];
  for (const [name, description] of items) {
    const idx = batch4.length;
    const palette = PAL[idx % PAL.length];
    const max = palette.length;
    const { vars, rule } = T[t](max);
    batch4.push({
      name,
      slug: name.toLowerCase(),
      order: order++,
      ...(isDark(palette[0]) ? { white: true } : {}),
      description,
      palette,
      colors: { min: 2, max, default: max },
      gridDefault: cfg.grid,
      freqDefault: cfg.freq,
      thumb: { grid: cfg.tg, frequency: cfg.tf },
      vars,
      rule,
    });
  }
}
