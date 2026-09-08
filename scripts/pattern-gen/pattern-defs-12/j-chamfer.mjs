// J. Chamfer - what is taken off the square rather than what is put on it.
//
// Every design starts from the full cell and takes a corner off it: shallow,
// deep enough to leave a long triangle, or twice on opposite corners so the
// square reads as a lozenge. clip-path: polygon() is the whole toolkit and it
// exports as an SVG <clipPath> with the same points, so the profile lands
// exactly where CSS put it. Nothing is filled back in, so what is cut away
// stays a real hole on a transparent background - the shape simply stops.
import { section, A, F, TR, cp, ink, poly, rot, R2, R4 } from './shared.mjs';

const { add, all } = section('J. Chamfer');

/** A solid cell cut to a profile, turned a quarter at a time. */
const cut = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Snipcorner',
  'One corner taken off at a shallow angle, so the cut is longer than it is deep.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 0], [100, 76], [0, 100]])) }),
  { pal: 3 }
);

add(
  'Angleoff',
  'A single deep cut running most of the way across, leaving a long triangle.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 0], [100, 16], [0, 92]])) }),
  { pal: 61 }
);

add(
  'Cornerchip',
  'Two opposite corners chipped off deeply, so the cell reads as a long lozenge.',
  (c) => ({
    rule: cut(c, poly([[44, 0], [100, 0], [100, 56], [56, 100], [0, 100], [0, 44]]), R2),
  }),
  { pal: 52 }
);

export const sectionJ = { title: 'J. Chamfer', all };
