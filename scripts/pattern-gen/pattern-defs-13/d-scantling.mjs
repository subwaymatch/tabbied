// D. Scantling - the two halves of a rebated joint.
//
// One block with a step ploughed out of its corner, and the block that step
// was cut to receive. They are the same carpentry read from either side, and
// putting them next to each other in a grid is the point: at any frequency
// the field mixes both halves, so the cells look like timber waiting to be
// fitted rather than one shape repeated.
//
// Both are a single clip-path polygon over one ink. The notch is cut, never
// filled, so it stays open on a transparent background.
import { section, F, TR, cp, ink, poly, rot, R4 } from './shared.mjs';

const { add, all } = section('D. Scantling');

/** A solid block cut to a profile, turned a quarter at a time. */
const profile = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Rabbet',
  'A block with a step ploughed out of one corner, ready to take its neighbour.',
  (c) => ({
    rule: profile(
      c,
      poly([[16, 16], [52, 16], [52, 52], [84, 52], [84, 84], [16, 84]])
    ),
  }),
  { pal: 31 }
);

add(
  'Rebate',
  'The other half of that joint: a block with the notch taken out of its edge.',
  (c) => ({
    rule: profile(
      c,
      poly([[14, 14], [86, 14], [86, 86], [62, 86], [62, 56], [14, 56]])
    ),
  }),
  { pal: 72 }
);

export const sectionD = { title: 'D. Scantling', all };
