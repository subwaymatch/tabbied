// T. Radius - what `border-radius` alone can draw.
//
// One property, four corners, and a percentage each: round one hard and the
// square becomes a quadrant, round two opposite ones and it becomes a leaf,
// round three by different amounts and it leans. The converter reads the
// resolved radii off the box and emits a <rect> with them, or a <path> where
// the corners differ, so these sit at a flat zero against their live render.
//
// No design here puts a border on a rounded box - the converter throws on a
// partially-rounded one, and mixed widths round a corner deviate by up to a
// pixel. The shapes are filled, and where an outline is wanted it is a second
// filled shape inside the first.
import { section, A, F, TR, ink, rot, R2, R4 } from './shared.mjs';

const { add, all } = section('T. Radius');

/** One rounded box on an otherwise empty cell. */
const round = (c, css, turns = R4) =>
  `--rot: ${turns}; ${F} { ${A(`${css} background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Roundcut',
  'One corner rounded hard and the other three left square - a quadrant.',
  (c) => ({ rule: round(c, 'inset: 6%; border-radius: 100% 0 0 0;') }),
  { pal: 45 }
);

add(
  'Roundpair',
  'Two opposite corners rounded, which turns the square into a leaf.',
  (c) => ({ rule: round(c, 'inset: 6%; border-radius: 76% 0 76% 0;', R2) }),
  { pal: 64 }
);

add(
  'Roundstep',
  'Three corners rounded by different amounts, so the shape leans.',
  (c) => ({ rule: round(c, 'inset: 7%; border-radius: 60% 12% 40% 4%;') }),
  { pal: 69 }
);

export const sectionT = { title: 'T. Radius', all };
