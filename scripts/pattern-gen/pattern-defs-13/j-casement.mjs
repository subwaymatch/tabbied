// J. Casement - frames, and the openings cut through them.
//
// Two directions, and the section runs both. A frame is a *union* of edge
// slabs: four of them for a closed surround, three for one left open. An
// opening is the complement - a union of two "everything but this band"
// layers, which leaves a rectangular hole exactly where the two bands cross,
// because mask layers composite by adding coverage and only the intersection
// of the two gaps is uncovered by both.
//
// Either way the void is cut rather than painted, so on a transparent
// background the sheet shows through every window.
import {
  section,
  F,
  TR,
  cp,
  ink,
  poly,
  rot,
  faded,
  msk,
  discL,
  slabLin,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('J. Casement');

const turned = (decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

/** Everything except the strip between `from` and `to` - a wall with a slot. */
const gapLin = (angle, from, to) =>
  `linear-gradient(${angle}, #000 0 ${from}, transparent ${from} ${to}, #000 ${to})`;

add(
  'Casing',
  'A plain frame of even width around an open middle.',
  (c) => ({
    rule: turned(
      faded(
        c,
        slabLin('0deg', '14%'),
        slabLin('90deg', '14%'),
        slabLin('180deg', '14%'),
        slabLin('270deg', '14%')
      )
    ),
  }),
  { pal: 73 }
);

add(
  'Alcove',
  'The same frame with one side left open.',
  (c) => ({
    rule: turned(
      faded(c, slabLin('0deg', '14%'), slabLin('90deg', '14%'), slabLin('270deg', '14%'))
    ),
  }),
  { pal: 19 }
);

add(
  'Apse',
  'A rectangular body with a half-round end swelling off it.',
  (c) => ({
    rule: turned(faded(c, slabLin('90deg', '55%'), discL('28%', '55% 50%')), R2),
  }),
  { pal: 60 }
);

add(
  'Garret',
  'The gable-end wall with one small light under the peak.',
  (c) => ({
    rule: turned(
      `background: ${ink(c)}; ${cp(poly([[0, 100], [0, 36], [50, 6], [100, 36], [100, 100]]))} ${msk(
        gapLin('90deg', '40%', '60%'),
        gapLin('180deg', '48%', '72%')
      )}`
    ),
  }),
  { pal: 37 }
);

add(
  'Lucarne',
  'A long roof slope with a small dormer void cut into it.',
  (c) => ({
    rule: turned(
      `background: ${ink(c)}; ${cp(poly([[0, 100], [0, 55], [100, 10], [100, 100]]))} ${msk(
        gapLin('90deg', '42%', '58%'),
        gapLin('180deg', '48%', '70%')
      )}`
    ),
  }),
  { pal: 49 }
);

export const sectionJ = { title: 'J. Casement', all };
