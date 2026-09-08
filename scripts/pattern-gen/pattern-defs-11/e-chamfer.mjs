// E. Chamfer - what is taken off the cell rather than what is put on it.
//
// Every design here starts from the full square and removes: a corner, an
// edge, a notch, a step. clip-path: polygon() is the whole toolkit, and the
// converter turns it into an SVG <clipPath> with the same points, so a
// twenty-vertex profile costs nothing and lands exactly where CSS put it, and
// the notches and channels stay real holes on a transparent background because
// nothing is filled back in - the shape simply stops.
import { section, A, F, TR, cp, ink, poly, rot, R2, R4 } from './shared.mjs';

const { add, all } = section('E. Chamfer');

/** A solid cell cut to a profile, turned a quarter at a time. */
const cut = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Cornercut',
  'One corner taken off square, and the cut turning round the cell from one to the next.',
  (c) => ({ rule: cut(c, poly([[0, 0], [62, 0], [100, 38], [100, 100], [0, 100]])) }),
  { pal: 0 }
);

add(
  'Clipcorner',
  'Two opposite corners cut, so the cell reads as a long lozenge.',
  (c) => ({
    rule: cut(c, poly([[36, 0], [100, 0], [100, 64], [64, 100], [0, 100], [0, 36]]), R2),
  }),
  { pal: 19 }
);

add(
  'Bevelset',
  'All four corners cut equally: a regular octagon held inside its square.',
  (c) => ({
    rule: cut(
      c,
      poly([[30, 0], [70, 0], [100, 30], [100, 70], [70, 100], [30, 100], [0, 70], [0, 30]]),
      R2
    ),
  }),
  { pal: 12 }
);

add(
  'Mitre',
  'A single deep cut running most of the way across, leaving a broad triangle.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 0], [100, 24], [0, 88]])) }),
  { pal: 27 }
);

add(
  'Skewback',
  'The cut leans the other way from the corner it starts at, so the profile reads as sprung.',
  (c) => ({ rule: cut(c, poly([[0, 26], [58, 0], [100, 0], [100, 100], [0, 100]])) }),
  { pal: 34 }
);

add(
  'Nosing',
  'One edge stepped forward twice, like the nose of a tread.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 62], [70, 62], [70, 80], [36, 80], [36, 100], [0, 100]])),
  }),
  { pal: 46 }
);

add(
  'Housing',
  'A slot let into one edge and stopped short of the far side.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 100], [0, 100], [0, 66], [64, 66], [64, 34], [0, 34]])),
  }),
  { pal: 21 }
);

add(
  'Halving',
  'Two opposite notches of the same size, so the cell would key into a copy of itself.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [0, 0],
        [36, 0],
        [36, 26],
        [64, 26],
        [64, 0],
        [100, 0],
        [100, 100],
        [64, 100],
        [64, 74],
        [36, 74],
        [36, 100],
        [0, 100],
      ]),
      R2
    ),
  }),
  { pal: 30 }
);

add(
  'Birdsmouth',
  'A V cut into one edge, deep enough to reach the middle of the cell.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 100], [50, 46], [0, 100]])),
  }),
  { pal: 62 }
);

add(
  'Chase',
  'A straight channel run right across the cell, ends open.',
  (c) => ({
    rule: cut(
      c,
      poly([[0, 0], [100, 0], [100, 42], [0, 42], [0, 58], [100, 58], [100, 100], [0, 100]]),
      R2
    ),
  }),
  { pal: 24 }
);

add(
  'Stylobate',
  'Three steps down from one corner to the opposite edge.',
  (c) => ({
    rule: cut(
      c,
      poly([[0, 0], [34, 0], [34, 34], [67, 34], [67, 67], [100, 67], [100, 100], [0, 100]])
    ),
  }),
  { pal: 68 }
);

add(
  'Dieblock',
  'Every corner squared off with a step rather than a straight cut.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [22, 0],
        [78, 0],
        [78, 22],
        [100, 22],
        [100, 78],
        [78, 78],
        [78, 100],
        [22, 100],
        [22, 78],
        [0, 78],
        [0, 22],
        [22, 22],
      ]),
      R2
    ),
  }),
  { pal: 4 }
);

add(
  'Mutule',
  'A block projecting from one edge, wider than it is deep.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 70], [76, 70], [76, 100], [24, 100], [24, 70], [0, 70]])),
  }),
  { pal: 71 }
);

add(
  'Modillion',
  'A bracket profile: a straight back, a stepped front and an angled underside.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 28], [58, 28], [58, 52], [82, 52], [40, 100], [0, 100]])),
  }),
  { pal: 39 }
);

export const sectionE = { title: 'E. Chamfer', all };
