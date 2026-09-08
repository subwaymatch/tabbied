// F. Cutfade - a ramp shut inside a cut shape.
//
// clip-path decides the silhouette and the mask decides how much of it is
// there. They are separate steps in the Filter Effects model - children, then
// filter, then clip, then mask - and the converter emits them in that order,
// so a faded triangle is a <clipPath> and a <mask> on the same group rather
// than one shape approximating both.
//
// Both read as hard-edged marks that are only half printed: the profile stays
// exact wherever the ink reaches, and where it does not, the outline stops
// with it.
import {
  section,
  A,
  F,
  TR,
  cp,
  ink,
  poly,
  rot,
  msk,
  fade,
  R4,
} from './shared.mjs';

const { add, all } = section('F. Cutfade');

/** A cut shape in one ink, faded by a ramp, turned a quarter at a time. */
const cutFade = (c, shape, ramp, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${msk(ramp)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Fadedwedge',
  'A corner-to-corner triangle, solid at its base and spent by its point.',
  (c) => ({
    rule: cutFade(c, poly([[0, 100], [100, 100], [0, 0]]), fade('0deg', '0%', '100%')),
  }),
  { pal: 2 }
);

add(
  'Fadedbar',
  'A bar cut on the slant, thinning towards one end.',
  (c) => ({
    rule: cutFade(
      c,
      poly([[10, 68], [72, 12], [90, 32], [28, 88]]),
      fade('45deg', '0%', '100%')
    ),
  }),
  { pal: 42 }
);

export const sectionF = { title: 'F. Cutfade', all };
