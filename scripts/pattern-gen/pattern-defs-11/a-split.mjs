// A. Split - one straight cut across the cell, with an ink either side.
//
// The simplest thing a cell can do and still be a drawing: divide. Where the
// cut lands, how it leans, whether the two parts touch or leave a gap between
// them, and whether one of them sits proud of the other is the whole of this
// section.
//
// Most of these lay the second ink *over* a full-bleed first rather than
// butting two clipped shapes edge to edge. One anti-aliased edge instead of
// two abutting ones is both the better drawing and the better export:
// abutting AA edges are exactly where a vector renderer and a CSS painter
// disagree.
import { section, A, B, F, TR, cp, ink, poly, rot, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('A. Split');

// The overlay: a second ink laid across part of a full-bleed cell.
const over = (shape, inkValue) => A(`inset: 0; background: ${inkValue}; ${cp(shape)}`);

const TRI_TL = poly([[0, 0], [100, 0], [0, 100]]);

add(
  'Ridgeline',
  'One diagonal cut corner to corner, a different ink each side of it, and the ridge turning a quarter at a time.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(TRI_TL, ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 0 }
);

add(
  'Thirdstop',
  'Two cuts rather than one: three bands across the cell, the middle one the odd ink out.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${over(poly([[0, 34], [100, 34], [100, 66], [0, 66]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 19 }
);

add(
  'Swapcut',
  'One diagonal, and the ink either side of it changing places every other cell.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${over(TRI_TL, ink(c))} @even { ${rot('180deg')} } }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Seamband',
  'A third ink laid in a narrow band right on the seam, so the join is drawn rather than implied.',
  (c) => ({
    // The upper block runs on *under* the band rather than stopping at it: a
    // clip-path edge butted against a plain box edge is the one abutment CSS
    // and SVG round differently, so the band covers the join instead.
    rule: `--rot: ${R2}; ${F} { background: ${ink(c, 3)}; ${B(`left: 0; right: 0; top: 0; height: 54%; background: ${c1};`)} ${A(`top: 46%; left: 0; right: 0; height: 8%; background: var(--color2);`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 16 }
);

add(
  'Halfmast',
  'A vertical cut, and each half masked back to half its height so the two never sit level.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 0; width: 50%; top: 0; height: 62%; background: ${ink(c)};`)} ${A(`right: 0; width: 50%; bottom: 0; height: 62%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 35 }
);

add(
  'Notchcut',
  'A straight cut with one square notch taken out of the middle of it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 44], [38, 44], [38, 60], [62, 60], [62, 44], [100, 44], [100, 100], [0, 100]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 71 }
);

export const sectionA = { title: 'A. Split', all };
