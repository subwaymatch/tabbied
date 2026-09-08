// H. Sheer - the dotted grounds of net and lace.
//
// Tiled radial fields: a hard dot, a feathered dot, and a ring. The converter
// turns each tiled layer into an SVG <pattern> holding one tile, so a field of
// four hundred dots costs one gradient however dense the net gets.
//
// The pitch is where this section had to be careful. A dot far below a pixel
// at thumbnail scale is drawn by CSS and by a vector rasterizer with different
// rounding, and the parity sweep catches it as a whole-field diff rather than
// an edge one - the two finest designs here (Bobbinet, Tulle) ship coarser
// than first drawn, and on a 3x3 thumbnail grid, so their features stay whole
// pixels where the gallery shows them.
import {
  section,
  F,
  TR,
  rot,
  faded,
  dotsL,
  softDotsL,
  eyeletL,
  R4,
} from './shared.mjs';

const { add, all } = section('H. Sheer');

const turned = (decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Bobbinet',
  'A net of eyelets - the ground a bobbin lace is worked on.',
  (c) => ({ rule: turned(faded(c, eyeletL('16%', '28%', '25%'))) }),
  { pal: 51, tg: '3x3' }
);

add(
  'Tulle',
  'An even veil of dots, close enough to read almost as a tint.',
  (c) => ({ rule: turned(faded(c, dotsL('28%', '12.5%'))) }),
  { pal: 14, tg: '3x3' }
);

add(
  'Maline',
  'Small dots with feathered edges, soft as pressed net.',
  (c) => ({ rule: turned(faded(c, softDotsL('8%', '30%', '12.5%'))) }),
  { pal: 44 }
);

add(
  'Ninon',
  'Sparse pin dots on a wide open ground.',
  (c) => ({ rule: turned(faded(c, dotsL('10%', '14.3%'))) }),
  { pal: 27 }
);

export const sectionH = { title: 'H. Sheer', all };
