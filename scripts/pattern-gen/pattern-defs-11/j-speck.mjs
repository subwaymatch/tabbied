// J. Speck - dot fields and halftones.
//
// A radial-gradient with a hard stop is one dot; give it a background-size
// smaller than the box and it tiles into a field. Change the tile and the
// pitch changes; change the stop and the dot grows or shrinks - from a tint
// with texture in it up to a field so dense the gaps become the drawing.
//
// The converter turns a tiled layer into an SVG <pattern> holding one dot, so
// a field of four hundred costs one gradient and lands on the browser's own
// tile origin. Every design here is a mask, so the gaps are real holes.
import { section, A, F, TR, ink, msk, mskI, slotL } from './shared.mjs';

const { add, all } = section('J. Speck');

/** A tiled dot field: `r` of each `pitch`-sized tile is inked. */
const dots = (r, pitch, offset = '0 0') =>
  `radial-gradient(circle at 50% 50%, #000 ${r}, transparent ${r}) ${offset} / ${pitch} ${pitch}`;

/** The plainest dot design: one ink, cut into a field of dots. */
const dotted = (c, r, pitch) => `background: ${ink(c)}; ${msk(dots(r, pitch))}`;

add(
  'Speckfield',
  'Small dots on a wide pitch, so the cell reads as a tint with texture in it.',
  (c) => ({ rule: `${F} { ${dotted(c, '16%', '25%')} }${TR}` }),
  { pal: 0 }
);

add(
  'Dotfield',
  'A plain even field: the dot half the width of its tile.',
  (c) => ({ rule: `${F} { ${dotted(c, '25%', '20%')} }${TR}` }),
  { pal: 19 }
);

add(
  'Pindot',
  'The smallest dot that still reads, on a close pitch.',
  (c) => ({ rule: `${F} { ${dotted(c, '17%', '12.5%')} }${TR}` }),
  { pal: 12 }
);

add(
  'Polkadot',
  'Big dots on a wide pitch - four or five to a cell and no more.',
  (c) => ({ rule: `${F} { ${dotted(c, '32%', '33.34%')} }${TR}` }),
  { pal: 27 }
);

add(
  'Grainfield',
  'Dots dense enough that the ink joins up and the gaps become the drawing.',
  (c) => ({ rule: `${F} { ${dotted(c, '44%', '16.67%')} }${TR}` }),
  { pal: 34 }
);

add(
  'Sandfield',
  'A fine close field, nearer a texture than a pattern.',
  (c) => ({ rule: `${F} { ${dotted(c, '22%', '14.3%')} }${TR}` }),
  { pal: 46 }
);

add(
  'Dotmatrix',
  'A field of squares instead of dots - the same lattice, cut with straight edges.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${mskI(slotL('90deg', '11%', '20%'), slotL('0deg', '11%', '20%'))} }${TR}`,
  }),
  { pal: 65 }
);

export const sectionJ = { title: 'J. Speck', all };
