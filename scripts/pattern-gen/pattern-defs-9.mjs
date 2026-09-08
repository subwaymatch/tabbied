// Batch 9 - 22 motifs (gallery orders 1000+); 23 as authored, less Wireframe.
//
// Every batch before this one draws a *tile*: each cell is an independent
// motif, and the canvas is however many copies of it happen to fit. This batch
// works the other way round. Almost every design here reads the cell's address
// (@x, @y against @X, @Y) and uses it to place that cell inside one larger
// picture. Change the grid and you do not get more of the same motif, you get
// the same composition at a different resolution.
//
// That needs three things css-doodle gives you and the earlier batches never
// used: real maths on the cell's coordinates (@sqrt for distance from the
// centre of the sheet, @atan2 for its bearing, @sin for the wave fields),
// conic gradients, which are the only way to sweep a value round an angle, and
// SVG *stroke* - line art rather than filled shapes.
//
//   A. Radial fields      distance from the centre of the *canvas* drives the
//                         cell (Epicentre, Pivot, Fulcrum, Centroid).
//   B. Angular fields     @atan2 gives every cell its bearing from the centre,
//                         so the field points or swirls as a whole (Flux,
//                         Gyre, Maelstrom, Nutation, Gimbal, Dipole).
//   C. Conic              conic-gradient as a mask, so the wedge is a real
//                         hole (Wedge).
//   D. Line art           @svg with stroke and round caps (Charcoal, Reedpen).
//   E. Mirrors            the canvas folded about an axis (Bilateral, Axial,
//                         Foldback).
//   F. Perspective        skew and scale ramps that make a flat grid recede
//                         (Ortho, Isometry, Dimetric, Recession, Raking).
//   G. Weights            rule widths graded across the sheet (Thickset).
//
// House rules (inherited from every earlier batch, enforced by
// generate-batch9.mjs and validate-batch9.mjs):
//
//   * exactly one @random(${shapeFrequency}) gate per design, so the frequency
//     slider always thins the field;
//   * every design samples a transition-able ink per cell -
//     background-color, color, border-color or box-shadow - so a reseed
//     morphs. background-image is deliberately excluded from the validator's
//     reseed check: a design whose only variation lived in a gradient would
//     snap instead of morphing;
//   * a randomized custom prop read more than once goes through @var(--x);
//   * nothing paints var(--color0). A hole knocked out in the background
//     colour is a fake hole - set the background slot to transparent and it
//     stops erasing anything. Every gap here is a mask, a clip-path hole, or
//     a gap between elements, and validate-batch9.mjs re-renders the whole
//     batch over a checkerboard with the background slot set to #00000000 and
//     requires byte-identical cells;
//   * every cell must still paint something at the widest end of a ramp. A
//     field that fades to nothing at one edge leaves blank cells, and the
//     validator counts them.

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
const svgMask = (body) => msk(`@svg(${body})`);

const R2 = '@pick(0deg, 90deg)';
const R4 = '@pick(0deg, 90deg, 180deg, 270deg)';
const R8 = '@pick(0deg, 45deg, 90deg, 135deg, 180deg, 225deg, 270deg, 315deg)';

// A px length authored for a six-column grid and scaled down as the grid
// densifies - the idiom Ring and Terrain already use. Border and shadow widths
// take lengths only, never percentages.
const u = (v) => `calc(${v}px * 6 / @size-col)`;

// ── canvas coordinates ─────────────────────────────────────────────────────
// @x and @y are the 1-based column and row; @X and @Y are the totals. These
// put the origin at the middle of the *canvas*, so a design written against
// them holds its composition at any grid density.
//
// One hard constraint shapes how they are written. css-doodle's @calc honours
// operator precedence, but a *bare grouping paren* does not survive it -
// `@calc(90 - 74 * (2 * @x / @X - 1))` quietly evaluates the group to zero and
// the whole field goes flat. Only a function call's own parentheses are safe,
// so every grouping below is done with @abs(), @sqrt() or @atan2() rather than
// with brackets, and anything needing a signed value times a constant is
// multiplied out by hand (see sxTimes).
//
// The same rule kills the obvious tidy-up: routing these through a cell-level
// custom property and reading it back with @var() also comes out flat, so the
// expressions are inlined at every use even though it makes the CSS long.

// Distance from the vertical / horizontal centreline: 0 in the middle of the
// canvas, about 1 at an edge.
const AX = '@abs(2 * @x / @X - 1 - 1 / @X)';
const AY = '@abs(2 * @y / @Y - 1 - 1 / @Y)';
// 0 at the centre of the canvas, 1 at the middle of an edge, ~1.41 at a corner.
const RAD = `@sqrt(${AX} * ${AX} + ${AY} * ${AY})`;
// Bearing from the centre, in degrees.
const ANG = '@atan2(2 * @y / @Y - 1 - 1 / @Y, 2 * @x / @X - 1 - 1 / @X) * 57.2958';
// A sweep across the sheet, left to right and top to bottom.
const RX = '@x / @X';
const RY = '@y / @Y';

// A percentage ramping from `a` to `b` along `t`. The sign is folded into the
// operator so the expression never contains `+ -`.
const ramp = (a, b, t) =>
  `@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t})%`;
// The same, unitless (for opacity and scale factors).
const rampN = (a, b, t) =>
  `@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t})`;

// ── conic masks ────────────────────────────────────────────────────────────
// The only way to sweep a value round an angle. As a mask the wedges are real
// holes, so the design survives a transparent background.
const pieMask = (deg, from = '0deg') =>
  msk(`conic-gradient(from ${from} at 50% 50%, #000 0 ${deg}, transparent ${deg} 360deg)`);

// ── stroke helpers ─────────────────────────────────────────────────────────
// @svg() as a mask, drawing with stroke rather than fill. `d` is fixed path
// data - calc() does not survive inside a path's `d`, so anything that has to
// vary per cell varies through a repeated element's own attributes instead.
//
// The cap matters. A round cap overhangs the end of a segment by half the
// stroke width, which reads as a rounded terminal on an open stroke - right
// for these designs, but wrong on a path that stops at a corner, where the
// overhang shows as a thorn poking out past the join. A design like that
// wants `butt` and a neighbouring miter join to fill the corner instead.
const strokePath = (d, w) =>
  svgMask(`viewBox: 0 0 100 100; path { d: ${d}; fill: none; stroke: #000; stroke-width: ${w}; stroke-linecap: round; }`);

// ── graded rules ───────────────────────────────────────────────────────────
// A border width authored for a six-column grid, ramping from `a` to `b`.
// border-width takes a length, never a percentage, so the ramp is computed as
// a bare number and then multiplied into px.
const wRamp = (a, b, t) =>
  `calc(@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t}) * 1px * 6 / @size-col)`;

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
// authored for batches 7 and 8 and cut before they shipped - a name should
// never come to mean two different things.
const TAKEN = new Set(
  (
    'abacus abjad abugida accordion acorn agate airy ammann amoeba ' +
    'ampersand amphora analemma anchor annulet annulus aperiodic aperture ' +
    'apogee aquatint arabesque arcade argyle armilla arpeggio arrow ' +
    'arrowplay asanoha ascender ascent aster asterisk asterism astragal ' +
    'astroid atoll aureole aurora automaton awning azimuth azulejo ' +
    'balloon bandelet barcode bargello barline barrulet basalt basket ' +
    'baste battlement bauhaus beacon beadrow beatnote bee benchmark bento ' +
    'berry bevel beveled bezant bezel bias bifolium billet billow bleed ' +
    'blockfall bloks bloom blossom blot bobbin bokeh bolt bond boro boss ' +
    'bourdon bowl bowtie boxweave bracket bracketpair bract braid braille ' +
    'bramble brickwork brise bristle brocade brokenbond bubble bubbles ' +
    'bud bulge bunting buoy burgee burin burnish bushing button ' +
    'buttonhole cadence cadenza cairn caltrop calyx came caneweave cantor ' +
    'capsule cardioid caret carillon carousel cartouche cascade cattail ' +
    'caustic cavetto celleye chaff chalice chamfer checkers checkmark ' +
    'chenille chert chevarrow chevrondiamond chevronel chime chine chip ' +
    'chrysanth churn cinch cinquefoil circuit cirque cirrus citrus cleat ' +
    'clef clover cobble cog cogwheel coil cointile collatz collotype ' +
    'colophon comb comet compass confetti constellation contour convex ' +
    'coral corbel cornerbite cornerpunch cornerstone cornice corolla ' +
    'corona corpuscle counter cove crank crater crazy crease crescendo ' +
    'crescent cresset crossbar crosshair crosshatch crosslet crotchet ' +
    'crumble crux crystal cube cumulus cuneiform cupola curd curl cusp ' +
    'cusping cymbal dagger damask damier damping dapple dart datum ' +
    'daybreak deckle delaunay delta deltoid demotic dentil diadem diadot ' +
    'dial diamond3d diamonddust diamondeye diamondframe diaper diminuendo ' +
    'dingbat discus disque dogtooth dome domino dotdash dotwave doubinset ' +
    'dragon draughts drift driftleaf drizzle dropcap drypoint dune echo ' +
    'ecliptic eddy edgeband elbow ell emboss engrave enso epicycle ' +
    'epitrochoid ermine erode estuary evolute eyelet facade facetbox ' +
    'facetdiamond facetgrad fang fanleaf fanlight fanvault farey fermata ' +
    'fibonacci fiducial fillet fin fishscale flagstone flange fleck ' +
    'fleuron flight flint flurry flutter flywheel foldout foliage folio ' +
    'folium fourpane foxing fractal frame frameblock fray freckle fresnel ' +
    'fretwork frond froth fusil futhark fuzz gable gablet gasket gauge ' +
    'gauze gem gemcut geode gibbous gingham girih glider glint glitch ' +
    'globule glory glyph gnomon gong grain granule grassblade graticule ' +
    'gravel gravure gridline grille grisaille grit gumball gutter gyroid ' +
    'gyron hachure hairpin halation halfblock halfdot halfink halfmoon ' +
    'halfpenny halftone halo harlequin harmonic hashmark hatch heart ' +
    'helicoid helio heptafoil herringbone hexafoil hexagram hexbloom ' +
    'hexdot hexnut hextile hieratic hilbert hoop hopscotch houndstooth ' +
    'hourglass hurdle hypotrochoid ibeam ichimatsu ideogram ikat impasto ' +
    'impost incense indent inkblot inlay inset insetstep intaglio ' +
    'involute iris isobar isocube isopleth ivy jacquard jali jalousie ' +
    'jelly jewel jumble junction karst kasuri kerf kern keyhole keyline ' +
    'keypad keystone keyway keywork khatam kikko kilim kintsugi kirigami ' +
    'kite knell koch koi kufic ladybird lagoon lantern lattice laundry ' +
    'lava ledger lemniscate lens lentil levels lierne ligature lily ' +
    'limacon links linocut lintel listel litho lobe logcabin logogram ' +
    'loophole lotus louvre loxodrome lozenge lozengegrad lozengy lsystem ' +
    'lune lunette macaron macrocosm madras magma maltese mandorla margin ' +
    'marquetry mascle massif matchstick matryoshka matte maze meadow ' +
    'meander medusa memphis meridian merlon mesh meter metro mezzotint ' +
    'mica microcosm minim mirror misprint mistwave mitosis miura mixtape ' +
    'modulo moire monolith monotype moonphase moraine morse mortise ' +
    'mosaicglass mosaictile mote mouchette mudcloth mullion muqarna nacre ' +
    'nadir necking needle neon nephroid nestbox nimbus northstar notch ' +
    'notchbar notchblock obelisk obelus octagon octant oculus odessa ' +
    'offset offsetbox ogee ogham ogive ooze orb orbit organelle origami ' +
    'orphan oscillo ostinato overtone ovolo oxbow paisley palisade ' +
    'palmette papercut parallax parhelion parity parquet passepartout ' +
    'patina pavers pawl peal peano pebble pebbledot pediment pellet ' +
    'pendulum pennant pennantbox pennon penrose penta pentafan pentafoil ' +
    'penumbra petal phasor picket pictogram pieslice pilcrow pinhex ' +
    'pinhole pinion pinmark pinnacle pinnate pinnule pinweave pinwheel ' +
    'pinwheelstar pinwheeltile pinwheelweave pip pique piston pixel plaid ' +
    'plasma pleat plumb plus pod polaroid polka polkapair pompom pondring ' +
    'popsicle portal postage posy potent prisma prismfold protoplast prow ' +
    'pulp pulsar pulsebar punchcard pylon pyramid pyramid3d pyrite ' +
    'quadrant quadrifolium quadrille quadtree quake quarry quarterbar ' +
    'quarterblock quarterfall quartz quasar quasi quatrefoil quaver ' +
    'quilling quilt quiltsquare quincunx quire quoit raceme radar radius ' +
    'rafter rail rainbow raindrop rake range raster ratchet readout ' +
    'recurse reef regatta register reglet residue resonance respond ' +
    'rhodonea rhomboid rhumb ribbonfold ricrac riffle rill ring ringdot ' +
    'ringlink ripple rivet roe rondure rosace roulette roundel ruling ' +
    'rune rungs rustre saguaro sail saltire sandbar sash sashiko sawedge ' +
    'sayagata scale scallop scatterdot schist scotia scramble sebka ' +
    'sector seersucker seigaiha selvedge semaphore semibreve sepal sequin ' +
    'serif serigraph sextant shard shatter shelf shibori shield shingle ' +
    'shippo shoal shoji shuffle sickle sierpinski sigil signal silo silt ' +
    'sine sixstar skerry skew skewblock slant slat sliptile sliver ' +
    'smoulder snowflake soffit sonata soufflet spandrel spark sparkle ' +
    'spathe spawn spearhead speckle spectro spectrum spill spiralblock ' +
    'spire spirograph splat spline splinter splithz splittri spore sprig ' +
    'springer sprinkles sprocket sprout squall squinch squircle staccato ' +
    'stackbond stamen star5 starfish starflake starlet stave stella step ' +
    'step3d stipple stipule stitch strata subdivide sunburst sundog ' +
    'sunken sunwheel superellipse surf swellbox switchback syllabary ' +
    'symmetry syzygy tag tally talus taper tapioca target tatami tatewaku ' +
    'teardrop tee telegraph telemetry tendril terrain tesserae tetro ' +
    'thistle ticker tickmark tictac tierceron tilt tittle tocsin torsion ' +
    'torteau torus trace tracery trackline transom trapeze trapezoid ' +
    'traverse trefoil trellis tremolo tremor triad trianglet triband ' +
    'trifolium trigram triquetra trishard truchet tube tumble turret ' +
    'tweed twill twinkle ulam umbel uroko vacuole vair vee veil venetian ' +
    'venn vesicle vinyl vitrail voltage volute volution voronoi vortex ' +
    'voussoir wander waning warp wash washer waterbomb waveform wavefront ' +
    'wavelet waypoint weave webbing weft wheelarc whorl wicket widow ' +
    'wigwag windowframe windowpane wingtri woodcut wreath yagasuri ' +
    'zagtile zee zellige zenith ziggurat ziggy zigline zigzagfold zipper'
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

let order = 1000;
const all = [];

// cfg:
//   grid   default "columns x rows" for the editor       (default '8x12')
//   freq   default frequency                             (default 1)
//   tg/tf  gallery-thumbnail grid / frequency            (default '6x6' / 1)
//   min    sizing.minCellPx floor, for px-scaled details
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 9: ${slug}`);
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
    gridDefault: cfg.grid ?? '8x12',
    freqDefault: cfg.freq ?? 1,
    ...(cfg.min ? { minCellPx: cfg.min } : {}),
    // SVG-export tier (docs/svg-export.md). It belongs in the definition, not
    // hand-added to the generated JSON: the generator rewrites every file it
    // owns, so metadata that only exists downstream is silently dropped the
    // next time anyone regenerates the batch.
    ...(cfg.svgExport === false ? { svgExport: false } : {}),
    ...(cfg.svgExportNote ? { svgExportNote: cfg.svgExportNote } : {}),
    thumb: { grid: cfg.tg ?? '6x6', frequency: cfg.tf ?? 1 },
    vars,
    rule,
  });
};

// ══════════════════════════════════════════════════════════════════════════
// A. Radial fields - distance from the centre of the *canvas* drives the cell.
// ══════════════════════════════════════════════════════════════════════════

add('Epicentre', 1, 'Discs at their largest in the middle of the sheet and shrinking all the way to the corners.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(94, 16, RAD)}; height: ${ramp(94, 16, RAD)}; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Pivot', 13, 'A square field given a twist that accumulates with the radius - flat in the middle, wrung out at the rim.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 12%; background: ${ink(c)}; ${xf(`rotate(@calc(60 * ${RAD})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Fulcrum', 40, 'Wedges tipping further off the horizontal the further they stand from the balance point.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 8%, 100% 100%, 0 100%)')} ${xf(`rotate(@calc(-40 + 56 * ${RAD})deg)`)} }${TR}`,
}), { tg: '6x6' });

add('Centroid', 3, 'A plain grid of squares, lit from the middle: only the opacity carries the field.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; opacity: ${rampN(1, 0.22, RAD)}; }${TR}`,
}), { tg: '6x6' });

// ══════════════════════════════════════════════════════════════════════════
// B. Angular fields - @atan2 gives every cell its bearing from the middle of
//    the sheet, so the whole canvas points or swirls as one thing.
// ══════════════════════════════════════════════════════════════════════════

add('Flux', 43, 'The same field turned a quarter: every mark lies across the radius instead of along it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 8%; top: 40%; width: 84%; height: 20%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(${ANG} + 90)deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Gyre', 15, 'A slow rotation about the middle of the sheet: every mark tangent to its own circle.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 4%; top: 36%; width: 92%; height: 28%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(${ANG} + 90)deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Maelstrom', 41, 'A spiral: the bearing plus a turn that grows with the radius, so the arms wind in.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 2%; top: 38%; width: 96%; height: 24%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(${ANG} + 70 * ${RAD})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Nutation', 4, 'The nod on top of the spin: the bearing with a ripple added to it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 6%; top: 40%; width: 88%; height: 20%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(${ANG} + 26 * @sin(6 * ${RAD}))deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Gimbal', 19, 'Two rings on crossed axes, both swung to the cell\'s own bearing.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; border-radius: 50%; border: ${u(3)} solid ${ink(c)}; box-sizing: border-box;`)} ${A(`left: 26%; top: 4%; width: 48%; height: 92%; border-radius: 50%; border: ${u(3)} solid ${ink(c)}; box-sizing: border-box; ${xf(`rotate(@calc${ANG}deg)`)}`)} }${TR}`,
}), { tg: '5x5', min: 34 });

add('Dipole', 10, 'Two poles instead of one, and the field between them bending from one to the other.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 6%; top: 42%; width: 88%; height: 16%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(@atan2(2 * @y / @Y - 1 - 1 / @Y, 2 * @x / @X - 1.6 - 1 / @X) * 28.6 + @atan2(2 * @y / @Y - 1 - 1 / @Y, 2 * @x / @X - 0.4 - 1 / @X) * 28.6)deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

// ══════════════════════════════════════════════════════════════════════════
// C. Conic - conic-gradient is the only thing in CSS that sweeps a value round
//    an angle, and as a mask its wedge is a real hole.
// ══════════════════════════════════════════════════════════════════════════

add('Wedge', 2, 'A single wedge cut out of each cell, its angle rolled from a short list.', (c) => ({
  vars: '',
  rule: `--from: ${R8}; ${F} { background: ${ink(c)}; ${pieMask('@pick(70deg, 120deg, 180deg, 250deg)', '@var(--from)')} }${TR}`,
  // The two @pick() stop positions roll independently, so most cells get a
  // smooth black-to-transparent conic fade rather than a hard-stop sector -
  // and SVG has no angular gradient. See docs/svg-export.md, tier 1.
}), { grid: '6x9', tg: '5x5', svgExport: false });

// ══════════════════════════════════════════════════════════════════════════
// D. Line art - @svg used as a mask, drawing with stroke rather than fill.
// ══════════════════════════════════════════════════════════════════════════

add('Charcoal', 43, 'Charcoal: broad, blunt strokes that almost close the paper up.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; path*3 { d: M-10 90 L90 -10; fill: none; stroke: #000; stroke-width: 22; stroke-linecap: round; transform: translate(calc(@n(-1) * 36) 0) }')} ${rot(R2)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Reedpen', 62, 'A reed pen: three strokes of the same length, laid down side by side.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${strokePath('M20 14 V86 M50 14 V86 M80 14 V86', 10)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ══════════════════════════════════════════════════════════════════════════
// E. Mirrors - @match on the cell's own address folds the canvas about an
//    axis, so the composition is symmetrical however many cells it has.
// ══════════════════════════════════════════════════════════════════════════

add('Bilateral', 1, 'The sheet folded down its middle: everything past the centreline is the mirror of what came before it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 62% 100%, 0 100%)')} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Axial', 40, 'A single fold about the horizontal, with the shape running off both edges.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 101% 0, 101% 46%, 40% 101%, 0 101%)')} @match(@y > @Y / 2) { ${xf('scaleY(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Foldback', 54, 'Arcs folded back on themselves at the centreline of the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; background: ${ink(c)}; border-radius: 0 100% 0 0;`)} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } @match(@y > @Y / 2) { ${xf('scaleY(-1)')} } }${TR}`,
}), { tg: '6x6' });

// ══════════════════════════════════════════════════════════════════════════
// F. Perspective - a skew or scale that builds across the sheet turns a flat
//    grid into a receding one.
// ══════════════════════════════════════════════════════════════════════════

add('Ortho', 29, 'No perspective at all - the same square everywhere, and only the weight of the line changing.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 6%; border-style: solid; border-color: ${ink(c)}; border-width: calc(@calc(1 + 7 * ${RY}) * 1px * 6 / @size-col); box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Isometry', 12, 'The isometric grid: everything skewed thirty degrees, one way or the other.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; background: ${ink(c)}; ${xf('skewY(@pick(-30deg, 30deg))')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Dimetric', 18, 'Two of the three axes foreshortened equally, which is what dimetric means.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 10%; background: ${ink(c)}; ${xf('skewY(-20deg) scaleX(1.1)')}`)} @match(@x % 2 == 1) { :after { ${xf('skewY(20deg) scaleX(1.1)')} } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Recession', 25, 'Marks receding into the distance: smaller, fainter and closer together as they go.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(12, 92, RY)}; height: ${ramp(12, 92, RY)}; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)}; opacity: ${rampN(0.35, 1, RY)};`)} }${TR}`,
}), { tg: '6x6' });

add('Raking', 38, 'A raking light: parallel bars whose lean builds steadily down the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 26%; top: -20%; width: 48%; height: 140%; background: ${ink(c)}; ${xf(`skewX(@calc(-42 + 84 * ${RY})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

// ══════════════════════════════════════════════════════════════════════════
// G. Weights - rule width graded across the sheet, with nothing else moving.
// ══════════════════════════════════════════════════════════════════════════

add('Thickset', 2, 'Heavy throughout, and heavier still as it goes: frames that all but close up.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 2%; border-style: solid; border-color: ${ink(c)}; border-width: ${wRamp(4, 15, RY)}; box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 34 });

// 23 as authored, less Wireframe (retired) - the count is asserted so a
// definition cannot be lost to a bad edit without the generator saying so.
if (all.length !== 22) {
  throw new Error(`batch 9 must hold exactly 22 designs, found ${all.length}`);
}

export const batch9 = all;
