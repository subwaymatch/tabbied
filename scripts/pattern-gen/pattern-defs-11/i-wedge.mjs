// I. Wedge - triangles, points and tapers.
//
// A triangle is three numbers in a clip path and the only primitive here that
// has a direction: both of these point somewhere. One halves the cell along
// its diagonal; the other runs a wedge from a whole edge down to a corner.
//
// clip-path: polygon() maps to an SVG <clipPath> vertex for vertex, so a
// twenty-sided profile is as cheap and as exact as a three-sided one.
import { section, A, F, TR, cp, ink, poly, rot, R4 } from './shared.mjs';

const { add, all } = section('I. Wedge');

/** A solid cut to a profile and turned a quarter at a time. */
const cut = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Gnomonwedge',
  'A right triangle filling half the cell, the hypotenuse running corner to corner.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 100], [0, 100]])) }),
  { pal: 0 }
);

add(
  'Quoinwedge',
  'A wedge set into a corner, its point running to the far edge.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 0], [100, 34], [0, 100]])) }),
  { pal: 50 }
);

export const sectionI = { title: 'I. Wedge', all };
