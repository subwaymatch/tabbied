// G. Rampband - a ramp cut into steps.
//
// `stepFade()` writes a fall as a handful of flat translucent levels, every
// stop pair sitting at the same position. It is a hard-stop gradient that
// reads as a ramp, and it is the one place in the batch where the *amount* of
// ink is quantised rather than the geometry - the cell goes down in counted
// stages instead of sliding.
//
// The alpha is carried by the mask, not by the ink, so the levels stay real
// holes: on a transparent background the sheet shows through each step in
// proportion.
import {
  section,
  A,
  F,
  TR,
  ink,
  rot,
  stepFade,
  fade,
  faded,
  R4,
} from './shared.mjs';

const { add, all } = section('G. Rampband');

const banded = (c, layer, turns = R4) =>
  `--rot: ${turns}; ${F} { ${faded(c, layer)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Stepramp',
  'A single fall cut into five flat levels, so the fade is counted rather than smooth.',
  (c) => ({ rule: banded(c, stepFade('180deg', 5)) }),
  { pal: 28 }
);

export const sectionG = { title: 'G. Rampband', all };
