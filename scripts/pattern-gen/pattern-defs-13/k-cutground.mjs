// K. Cutground - ground stepped and notched, all clip-path.
//
// A solid sheet with a profile taken out of it: one bench cut into a sheer
// face, and the two notches a river wears - a wide V, and the near-vertical
// slot it deepens into. Each is a single polygon, and the cut runs right to
// the edge of the cell so neighbouring cells read as continuous ground rather
// than as a row of separate marks.
//
// Nothing is filled back in behind the notch. On a transparent background the
// cut is genuinely see-through, which is the whole reason these are clipped
// rather than drawn as two abutting shapes.
import { section, F, TR, cp, ink, poly, rot, R4 } from './shared.mjs';

const { add, all } = section('K. Cutground');

const profile = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Bench',
  'One deep step cut into an otherwise sheer face.',
  (c) => ({
    rule: profile(c, poly([[0, 100], [0, 58], [46, 58], [46, 26], [100, 26], [100, 100]])),
  }),
  { pal: 45 }
);

add(
  'Gully',
  'A V worn up into the sheet from its lower edge.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 0], [100, 0], [100, 100], [58, 100], [50, 40], [42, 100], [0, 100]])
    ),
  }),
  { pal: 63 }
);

add(
  'Gorge',
  'A slot with near-vertical walls, cut almost to the floor.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 0], [42, 0], [46, 88], [54, 88], [58, 0], [100, 0], [100, 100], [0, 100]])
    ),
  }),
  { pal: 11 }
);

export const sectionK = { title: 'K. Cutground', all };
