// Batch 10 - 200 motifs (gallery orders 1100+).
//
// Batch 9 asked what happens when the *canvas* is the unit rather than the
// cell. This one sits between the two: most of these motifs are bigger than a
// cell and smaller than the sheet. A super-tile spans four cells; a chain runs
// from one cell into the next; a wedge opens out past its own edges. The grid
// stops being a frame around each drawing and becomes the thing the drawing is
// assembled from.
//
// It opens with the family this batch was asked for. Wedge - a conic-gradient
// mask cutting one sector out of a solid cell - turned out to be the most
// liked design in batch 9, because of the way the sector *spreads*: a shape
// that starts at a point and opens. Section A is thirty-six variations on
// that: sectors from the centre, from a corner, from an edge, annular ones
// with the apex bored out, nested ones, paired ones, whole fans, and sectors
// whose angle is driven by where the cell sits on the sheet. Every one of them
// is a real hole, because a conic mask cuts rather than paints.
//
//   A. Spread            one sector, opening from a point (36 designs).
//   B. Super-tiles       a motif that spans two or three cells each way, so
//                        the drawing is larger than the cell it starts in.
//   C. Interlock         figure and ground both inked, each shape keying into
//                        the ones beside it.
//   D. Counterform       the drawing is the hole; the ink is what is left.
//   E. Stacks            layered plates, offset, reading as depth without any
//                        perspective in them.
//   F. Chains            links that run from cell to cell.
//   G. Corners           everything built off the corner of the cell rather
//                        than its middle.
//   H. Bands             mouldings and banding, run across the sheet.
//
// House rules (inherited from every earlier batch, enforced by
// generate-batch10.mjs and validate-batch10.mjs):
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
//     stops erasing anything. Every gap here is a mask, a clip-path hole or a
//     gap between elements, and validate-batch10.mjs re-renders the whole
//     batch over a checkerboard with the background slot set to #00000000 and
//     requires byte-identical cells.

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
const sh = (spec) => cp(`@shape(${spec})`);
const svgMask = (body) => msk(`@svg(${body})`);

const R2 = '@pick(0deg, 90deg)';
const R4 = '@pick(0deg, 90deg, 180deg, 270deg)';
const R8 = '@pick(0deg, 45deg, 90deg, 135deg, 180deg, 225deg, 270deg, 315deg)';

// A px length authored for a six-column grid, scaled down as the grid
// densifies. Border and shadow widths take lengths only, never percentages.
const u = (v) => `calc(${v}px * 6 / @size-col)`;

// A sweep across the sheet, for the few designs that grade their spread.
const RX = '@x / @X';
const RY = '@y / @Y';
const ramp = (a, b, t) =>
  `@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t})%`;
const rampDeg = (a, b, t) =>
  `@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t})deg`;

// ── A: the spread ──────────────────────────────────────────────────────────
// One sector of a circle, opening from a point. conic-gradient is the only
// thing in CSS that sweeps a value round an angle, and used as a *mask* the
// sector is cut rather than painted - so the part that is not the wedge is a
// genuine hole and the design survives a transparent background.
//
// `at` moves the apex: 50% 50% puts it in the middle of the cell, 0% 100% in a
// corner, 50% 100% on an edge. Moving the apex is most of what separates one
// design in this section from the next.
const pie = (deg, { from = '0deg', at = '50% 50%' } = {}) =>
  msk(`conic-gradient(from ${from} at ${at}, #000 0 ${deg}, transparent ${deg} 360deg)`);

// A fan: `on` degrees of ink every `period` degrees, all the way round.
const fan = (on, period, { from = '0deg', at = '50% 50%' } = {}) =>
  msk(`repeating-conic-gradient(from ${from} at ${at}, #000 0 ${on}, transparent ${on} ${period})`);

// A sector with its apex bored out - an annular sector. Two masks intersected:
// the conic decides the angle, the radial decides the inner and outer radius.
const arcSector = (deg, bore, { from = '0deg', at = '50% 50%' } = {}) =>
  `-webkit-mask: conic-gradient(from ${from} at ${at}, #000 0 ${deg}, transparent 0), radial-gradient(circle closest-side at ${at}, transparent ${bore}, #000 0); mask: conic-gradient(from ${from} at ${at}, #000 0 ${deg}, transparent 0), radial-gradient(circle closest-side at ${at}, transparent ${bore}, #000 0); -webkit-mask-composite: source-in; mask-composite: intersect;`;

// A fan with its hub bored out.
const arcFan = (on, period, bore, { from = '0deg', at = '50% 50%' } = {}) =>
  `-webkit-mask: repeating-conic-gradient(from ${from} at ${at}, #000 0 ${on}, transparent ${on} ${period}), radial-gradient(circle closest-side at ${at}, transparent ${bore}, #000 0); mask: repeating-conic-gradient(from ${from} at ${at}, #000 0 ${on}, transparent ${on} ${period}), radial-gradient(circle closest-side at ${at}, transparent ${bore}, #000 0); -webkit-mask-composite: source-in; mask-composite: intersect;`;

// ── other masks ────────────────────────────────────────────────────────────
const ringMask = (bore) =>
  msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${bore}, #000 ${bore})`);
const slotMask = (angle, on, off) =>
  msk(`repeating-linear-gradient(${angle}, #000 0 ${on}, transparent ${on} ${off})`);

// ── real holes, cut by hand ────────────────────────────────────────────────
const P = (pts) => pts.map(([x, y]) => `${(+x).toFixed(1)}% ${(+y).toFixed(1)}%`).join(', ');
const poly = (pts) => `polygon(${P(pts)})`;
const withHole = (inner) =>
  `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${P(inner)}, ${P([inner[0]])})`;
const rectHole = (x, y) => [
  [x, y],
  [x, 100 - y],
  [100 - x, 100 - y],
  [100 - x, y],
];
const roundHole = (r, steps = 28) =>
  Array.from({ length: steps }, (_, i) => {
    const a = (-2 * Math.PI * i) / steps;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
  });
const diamondHole = (x, y) => [
  [50, 50 - y],
  [50 - x, 50],
  [50, 50 + y],
  [50 + x, 50],
];
const ringPoly = (outer, inner) =>
  `polygon(${P(outer)}, ${P([outer[0]])}, ${P(inner)}, ${P([inner[0]])})`;
const SQUARE = [[0, 0], [100, 0], [100, 100], [0, 100]];
const DIAMOND = [[50, 0], [100, 50], [50, 100], [0, 50]];

// ── super-tiles ────────────────────────────────────────────────────────────
// A motif spread over an n x n block of cells: each cell draws its own quarter
// (or ninth) of the drawing, chosen by where it sits in the block. `q(n)` is
// the cell's position within the block, counting from zero.
const qx = (n) => `@x % ${n}`;
const qy = (n) => `@y % ${n}`;

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
export const TAKEN = new Set(
  (
    'abacus abjad abugida accordion acorn agate airy alias ambit ammann ' +
    'amoeba ampersand amphora analemma anamorph anchor annulet annulus ' +
    'antinode aperiodic aperture apex apogee aquatint arabesque arcade ' +
    'architrave argyle armature armilla arpeggio arrow arrowplay asanoha ' +
    'ascendant ascender ascent aster asterisk asterism astragal astroid ' +
    'atoll attenuate augment aureole aurora automaton awning axial axis ' +
    'axle axonometry azimuth azulejo balloon bandelet barcode bargello ' +
    'barline barrulet barycentre basalt basket baste batter battlement ' +
    'bauhaus bayer beacon beadrow beat beatnote bee benchmark bento berry ' +
    'bevel beveled bezant bezel bias bifolium bilateral billet billow ' +
    'binding blade bleed blockfall bloks bloom blossom blot bobbin bokeh ' +
    'boldface bolt bond boro boss bourdon bowl bowtie boxweave bracket ' +
    'bracketpair bract braid braille bramble brickwork brise bristle ' +
    'brocade brokenbond bubble bubbles bud bulge bullseye bunting buoy ' +
    'burgee burin burnish bushing butterfly button buttonhole cabinet ' +
    'cadence cadenza cairn caldera caltrop calyx camber came caneweave ' +
    'canopy cant cantor capsule cardioid caret carillon carousel cartoon ' +
    'cartouche cascade catenary cattail caustic cavalier cavetto celleye ' +
    'centroid chaff chalice chamfer charcoal chatter checkers checkmark ' +
    'chenille chert chevarrow chevrondiamond chevronel chime chine chip ' +
    'chiral chrono chrysanth churn cinch cinquefoil circuit cirque cirrus ' +
    'citrus cleat clef clover cobble cog cogwheel coil cointile collatz ' +
    'collotype colophon comb comet compass condensed confetti ' +
    'constellation contour converge convex coral corbel cord cornerbite ' +
    'cornerpunch cornerstone cornice corolla corona corpuscle counter ' +
    'counterpart cove crank crater crazy crease crescendo crescent ' +
    'cresset crossbar crosshair crosshatch crosslet crotchet crumble crux ' +
    'crystal cube cumulus cuneiform cupola curd curl curlicue cusp ' +
    'cusping cyclone cymbal cynosure dado dagger damask damier damping ' +
    'dapple dart datum daybreak deckle decline delaunay delta deltoid ' +
    'demibold demotic dentil descent diadem diadot dial diamond3d ' +
    'diamonddust diamondeye diamondframe diaper dihedral dimetric ' +
    'diminish diminuendo dingbat dipole diptych discus disque dither ' +
    'divergent dogtooth dome domino dotdash dotwave doubinset dragon ' +
    'draughts drift driftleaf drizzle dropcap drypoint dune echo ecliptic ' +
    'eddy edgeband edging elbow ell emboss enantiomer engrave enso ' +
    'epicentre epicycle epitrochoid ermine erode escapement estuary ' +
    'evolute expanded extended eyelet facade facetbox facetdiamond ' +
    'facetgrad fang fanleaf fanlight fanvault farey fermata fibonacci ' +
    'fiducial filament fillet fin fishscale flabellum flagstone flange ' +
    'flare fleck fleuron flight flint flurry flutter flux flywheel ' +
    'foldback foldout foliage folio folium foreshorten fourpane foxing ' +
    'fractal frame frameblock fray freckle fresnel fretwork fringe frond ' +
    'froth frustum fulcrum fusil futhark fuzz gable gablet galloon gasket ' +
    'gauge gauze gem gemcut geode gibbous gimbal gingham girih glide ' +
    'glider glint glitch globule glory glyph gnomon gong gore gradation ' +
    'grade graduate grain granule graphite grassblade graticule gravel ' +
    'gravure gridline grille grisaille grit groundline gumball gusset ' +
    'gutter gyre gyroid gyron hachure hairline hairpin halation halfblock ' +
    'halfdot halfink halfmoon halfpenny halftone halo harlequin harmonic ' +
    'hashmark hatch heart hearth helicoid helio hem heptafoil herringbone ' +
    'hexafoil hexagram hexbloom hexdot hexnut hextile hieratic hilbert ' +
    'hinge hoop hopscotch horizon houndstooth hourglass hub hurdle ' +
    'hyperbola hypotrochoid ibeam ichimatsu ideogram ikat impasto ' +
    'impeller impost incense incline indent inkblot inlay inset insetstep ' +
    'intaglio interval involute iris isobar isocube isometry isopleth ivy ' +
    'jacquard jali jalousie jelly jewel judder jumble junction kaleido ' +
    'karst kasuri kerb kerf kern kernel keyhole keyline keypad keystone ' +
    'keyway keywork khatam kikko kilim kintsugi kirigami kite knell koch ' +
    'koi kufic ladybird lagoon lantern lapse lattice laundry lava ledger ' +
    'lemniscate lens lentil levels lierne ligature lightface lily limacon ' +
    'linework links linocut lintel listel litho lobe locus lodestone ' +
    'logcabin logogram loophole lotus louvre loxodrome lozenge ' +
    'lozengegrad lozengy lsystem lune lunette macaron macrocosm madras ' +
    'maelstrom magma maltese mandorla margin marquee marquetry mascle ' +
    'massif matchstick matryoshka matte maze meadow meander medusa ' +
    'memphis meridian merlon mesh meter metro mezzotint mica microcosm ' +
    'minim mirror misprint mistwave mitosis miura mixtape modulo moire ' +
    'moment monolith monotype moonphase moraine morse mortise mosaicglass ' +
    'mosaictile mote mouchette mount mudcloth mullion muqarna nacre nadir ' +
    'navel necking needle neon nephroid nestbox nib nimbus nodal ' +
    'northstar notch notchbar notchblock nozzle nucleus nutation obelisk ' +
    'obelus oblique octagon octant octave oculus odessa offset offsetbox ' +
    'ogee ogham ogive omphalos ooze orb orbit organelle origami orphan ' +
    'ortho oscillate oscillo ostinato outline overtone ovolo oxbow ' +
    'paisley palindrome palisade palmette papercut parabola parallax ' +
    'parasol parhelion parity parquet passement passepartout patina ' +
    'pavers pavilion pawl peal peano pebble pebbledot pediment pellet ' +
    'pendulum pennant pennantbox pennon penrose penta pentafan pentafoil ' +
    'penumbra petal phaseshift phasor picket pictogram pictureplane ' +
    'pierglass pieslice pilcrow pinhex pinhole pinion pinmark pinnacle ' +
    'pinnate pinnule pinweave pinwheel pinwheelstar pinwheeltile ' +
    'pinwheelweave pip piping pique piston pivot pixel plaid plasma pleat ' +
    'plumb plus pod polaroid pole polka polkapair polyptych pompom ' +
    'pondring popsicle portal postage posy potent pounce precession ' +
    'prisma prismfold progress propeller protoplast prow pulp pulsar ' +
    'pulsate pulsebar punchcard pylon pyramid pyramid3d pyrite quadrant ' +
    'quadrifolium quadrille quadtree quake quarry quarterbar quarterblock ' +
    'quarterfall quartz quasar quasi quatrefoil quaver quill quilling ' +
    'quilt quiltsquare quincunx quire quoit raceme radar radial radiant ' +
    'radius rafter rail rainbow raindrop rake raking ramp range raster ' +
    'ratchet readout recession recurse reedpen reef reflect regatta ' +
    'register reglet residue resonance respond rhodonea rhomboid rhumb ' +
    'ribbonfold ricrac riffle rill ring ringdot ringlink ripple rivet roe ' +
    'roman rondure rorschach rosace rotor roulette roundel ruling rune ' +
    'rungs rustre saguaro sail saltire sandbar sanguine sash sashiko ' +
    'sawedge sayagata scale scallop scatterdot schist scotia scramble ' +
    'scribe sebka sector seersucker segment seigaiha selvedge semaphore ' +
    'semibreve sepal sequence sequin serif serigraph serpentine sextant ' +
    'shard shatter shelf shibori shield shimmer shingle shippo shoal ' +
    'shoji shuffle sickle sierpinski sigil signal silo silt silverpoint ' +
    'sine sinkhole sinuous sixstar skeleton skerry sketch skew skewblock ' +
    'skirting slant slat slice sliptile sliver slope smoulder snowflake ' +
    'soffit solenoid sonata soufflet soutache spandrel spark sparkle ' +
    'spathe spawn spearhead speckle spectro spectrum specular spill spin ' +
    'spindrift spiralblock spire spirograph splat splay spline splinter ' +
    'splithz splittri spore sprig springer sprinkles sprocket sprout ' +
    'squall squinch squircle staccato stackbond stamen standing star5 ' +
    'starfish starflake starlet station stator stave stella step step3d ' +
    'stereo stipple stipule stitch strata streamline stylus subdivide ' +
    'sunburst sundial sundog sunken sunwheel superellipse superpose surf ' +
    'swell swellbox swirl switchback syllabary symmetral symmetry syzygy ' +
    'tag tally talus taper tapioca target tatami tatewaku teardrop tee ' +
    'telegraph telemetry tendril terrain tesserae tessitura tetro ' +
    'thickset thistle throb ticker tickmark tictac tierceron tilt tittle ' +
    'tocsin torque torsion torteau torus trace tracery trackline transom ' +
    'trapeze trapezoid traverse trefoil trellis tremble tremolo tremor ' +
    'triad trianglet triband trifolium trigram trimetric triptych ' +
    'triquetra trishard truchet tube tumble turbine turret tweed twill ' +
    'twinkle ulam umbel umbrella underdraw undulate uroko vacuole vair ' +
    'vane vanish vector vee veil venetian venn vertex vesicle vinyl ' +
    'vitrail voltage volute volution voronoi vortex voussoir wander ' +
    'waning warble warp wash washer waterbomb waveform wavefront wavelet ' +
    'waypoint weave webbing wedge weft wellhead wellspring welt wheelarc ' +
    'whirligig whisker whorl wicket widow wigwag windowframe windowpane ' +
    'windrose wingtri wireframe woodcut wreath yagasuri zagtile zee ' +
    'zellige zenith ziggurat ziggy zigline zigzagfold zipper'
  )
    .split(/\s+/)
    .filter(Boolean)
);

// JS reserved words can't be emitted as `export const <slug>` by the package
// codegen, so they're banned as slugs.
export const RESERVED = new Set(
  ('do if in for let new try var case else enum eval null this true void with ' +
    'await break catch class const false super throw while yield delete export ' +
    'import public return static switch typeof default extends finally package ' +
    'private continue debugger function arguments interface protected implements ' +
    'instanceof').split(/\s+/)
);

let order = 1100;
const all = [];

// cfg:
//   grid   default "columns x rows" for the editor       (default '6x9')
//   freq   default frequency                             (default 1)
//   tg/tf  gallery-thumbnail grid / frequency            (default '5x5' / 1)
//   min    sizing.minCellPx floor, for px-scaled details
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 10: ${slug}`);
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


// ════════════════════════════════════════════════════════════════════════════
// A. Spread - one sector of a circle, opening from a point. Thirty-six ways to
//    move the apex, change the angle, bore out the middle, pair the sectors up
//    or open them into a whole fan.
// ════════════════════════════════════════════════════════════════════════════

add('Sunray', 33, 'A broad sector opening from one corner, so the light comes in across the whole cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${pie('42deg', { from: '20deg', at: '0% 100%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Spray', 32, 'A wide spray thrown from one edge, the cone opening to nearly a half-circle.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${pie('96deg', { from: '312deg', at: '50% 100%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// B. Super-tiles - the motif spans a two-by-two block of cells. Each cell
//    draws the same quarter and the flips assemble it, so what you see is one
//    drawing four cells wide rather than four copies of a small one.
//
//    The flips have to be done as four separate @match branches, each setting
//    the whole transform, because two branches that each set `transform`
//    would overwrite one another. `@x % 2 + @y % 2 == 0` is how the both-even
//    corner is reached without needing a && in the expression.
// ════════════════════════════════════════════════════════════════════════════

const quad = `${xf('scale(1, 1)')} @match(@x % 2 == 0) { ${xf('scale(-1, 1)')} } @match(@y % 2 == 0) { ${xf('scale(1, -1)')} } @match(@x % 2 + @y % 2 == 0) { ${xf('scale(-1, -1)')} }`;

add('Frieze', 12, 'A running frieze two cells deep: the upper half of the motif in one row, the lower in the next.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 22%, 100% 0, 100% 78%, 0 100%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// C. Interlock - figure and ground both inked, so no background shows through
//    at all and each shape keys into the ones beside it.
// ════════════════════════════════════════════════════════════════════════════

const both = (c, a, b) => `${B(`inset: 0; background: ${ink(c)}; ${cp(a)}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp(b)}`)}`;

add('Plait', 49, 'Three strands plaited, the one on top changing every row.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 100% 60%, 100% 100%, 0 40%)', 'polygon(0 60%, 100% 0, 100% 40%, 0 100%)')} @even { :before { z-index: 2; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// D. Counterform - the drawing is the hole. The cell is solid and the motif is
//    cut out of it, so what you read is the shape of what is missing.
// ════════════════════════════════════════════════════════════════════════════

add('Fenestrate', 18, 'Windowed: four small openings cut where the panes would be.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 60%, #000 60%) 0 0 / 50% 50%')} }${TR}`,
}), { tg: '5x5' });

add('Perforate', 31, 'A field of small perforations on a square pitch.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 48%, #000 48%) 0 0 / 25% 25%')} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// E. Stacks - layered plates, offset from one another. No projection and no
//    shading: the depth comes from nothing but the offset and the order the
//    plates are painted in.
// ════════════════════════════════════════════════════════════════════════════

const plates = (c, dx, dy, w = 66) =>
  `${B(`left: 6%; top: 6%; width: ${w}%; height: ${w}%; background: ${ink(c)};`)} ${A(`left: ${6 + dx}%; top: ${6 + dy}%; width: ${w}%; height: ${w}%; background: ${ink(c)};`)}`;

// ════════════════════════════════════════════════════════════════════════════
// F. Chains - links that run out of one cell and into the next, so the row is
//    continuous rather than a set of separate marks.
// ════════════════════════════════════════════════════════════════════════════

add('Chain', 1, 'Oval links running edge to edge, each one overlapping its neighbours.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`left: -20%; top: 22%; width: 140%; height: 56%; border-radius: 999px; background: ${ink(c)}; ${ringMask('72%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Staple', 53, 'A staple driven into the board, both legs showing.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(14% 16%, 86% 16%, 86% 88%, 68% 88%, 68% 36%, 32% 36%, 32% 88%, 14% 88%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// G. Corners - everything anchored at a corner of the cell rather than in the
//    middle of it, so the drawing happens where four cells meet.
// ════════════════════════════════════════════════════════════════════════════

add('Haunch', 58, 'The haunch of an arch: the corner filled with a curve rather than a bracket.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%)')} ${msk('radial-gradient(circle farthest-side at 100% 100%, transparent 74%, #000 74%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Arris', 66, 'The arris: the sharp edge where two faces meet, taken off with a small chamfer.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(26% 0, 100% 0, 100% 100%, 0 100%, 0 26%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Abutment', 27, 'An abutment: the mass at the end of the arch that takes the thrust.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 46% 0, 68% 44%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// H. Bands - mouldings and banding run across the sheet. The whole vocabulary
//    of a moulded edge, one profile per design.
// ════════════════════════════════════════════════════════════════════════════

const bandOf = (c, tops) =>
  tops.map(([t, h], i) => (i === 0
    ? B(`left: 0; top: ${t}%; width: 100%; height: ${h}%; background: ${ink(c)};`)
    : A(`left: 0; top: ${t}%; width: 100%; height: ${h}%; background: ${ink(c)};`))).join(' ');

add('Reeding', 57, 'Reeding: convex half-rounds run side by side, the opposite of fluting.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 16%, transparent 16% 20%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Fluting', 25, 'Fluting: concave channels cut into the face, with a fillet between each pair.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 9%, transparent 9% 18%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

const EXPECTED = Number(process.env.BATCH10_EXPECTED ?? 13);
if (all.length !== EXPECTED) {
  throw new Error(`batch 10 must hold exactly ${EXPECTED} designs, found ${all.length}`);
}

export const batch10 = all;
