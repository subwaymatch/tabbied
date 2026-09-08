// F. Lobe - everything border-radius can be talked into.
//
// One property, eight numbers: a corner radius per corner, each with its own
// horizontal and vertical component. Set them all to half the box and you have
// a circle; set two opposite pairs and you have a leaf; pull the vertical
// components away from the horizontal and the whole thing turns oval. Nothing
// else in CSS gives so many shapes for so little code, and every one of them
// interpolates into every other, so a reseed morphs rather than cuts.
//
// The converter reads the eight computed values back and emits an SVG path
// with matching elliptical arcs - the one thing to stay away from is putting a
// *border* on a partially-rounded box, which it refuses outright. Nothing here
// has one.
import { section, A, F, TR, ink, rot, R2, R4 } from './shared.mjs';

const { add, all } = section('F. Lobe');

/** A rounded solid filling the cell, turned a quarter at a time. */
const lobe = (c, radius, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; border-radius: ${radius}; ${rot('@var(--rot)')} }${TR}`;

add(
  'Lobeform',
  'Three corners rounded and one left square: the plainest leaf there is.',
  (c) => ({ rule: lobe(c, '50% 50% 50% 0') }),
  { pal: 0 }
);

add(
  'Petalcut',
  'Two opposite corners taken all the way round and two left sharp.',
  (c) => ({ rule: lobe(c, '100% 0 100% 0', R2) }),
  { pal: 19 }
);

export const sectionF = { title: 'F. Lobe', all };
