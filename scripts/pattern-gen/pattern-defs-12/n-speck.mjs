// N. Speck - hard-edged dot fields.
//
// The same tiled radial-gradient section C fades, left alone: every dot the
// same weight, all the way across. Change the tile and the pitch changes;
// change the stop and the dot grows or shrinks - from a tint with texture in
// it up to a field so dense the gaps become the drawing.
//
// The converter turns a tiled layer into an SVG <pattern> holding one dot, so
// a field of four hundred costs one gradient and lands on the browser's own
// tile origin. Everything here is a mask, so the gaps are real holes.
import { section, F, TR, dotsL, faded } from './shared.mjs';

const { add, all } = section('N. Speck');

const field = (c, ...layers) => `${F} { ${faded(c, ...layers)} }${TR}`;

add(
  'Dotset',
  'Nine dots to a cell, each a third of its own tile.',
  (c) => ({ rule: field(c, dotsL('33%', '33.34%')) }),
  { pal: 25 }
);

add(
  'Gritfield',
  'The finest field in the section - a texture rather than a pattern.',
  (c) => ({ rule: field(c, dotsL('28%', '9%')) }),
  { pal: 54 }
);

export const sectionN = { title: 'N. Speck', all };
