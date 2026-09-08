// C. Stipple - a dot field with a ramp laid over it.
//
// Two mask layers intersected: a tiled dot field, and a smooth gradient. The
// field decides where ink can go, the ramp decides how much of it survives, and
// what comes out is a halftone that thins across the cell - dense at one edge,
// scattered in the middle, gone at the other.
//
// `mask-composite: intersect` is what multiplies them, and it exports as one
// <mask> nested inside the next, which is the correct reading of what CSS did.
// The dot field itself becomes an SVG <pattern> holding a single dot, so a
// field of four hundred costs one gradient however dense it gets.
import {
  section,
  A,
  F,
  TR,
  ink,
  rot,
  fade,
  rise,
  midFade,
  dotsL,
  softDotsL,
  both,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('C. Stipple');

/** A dot field thinned by a ramp, turned a quarter at a time. */
const thinned = (c, field, ramp, turns = R4) =>
  `--rot: ${turns}; ${F} { ${both(c, field, ramp)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Stipplefade',
  'An even stipple at one edge of the cell, thinning to nothing at the other.',
  (c) => ({ rule: thinned(c, dotsL('30%', '12.5%'), fade('180deg', '0%', '100%')) }),
  { pal: 24 }
);

add(
  'Dotfade',
  'Big dots on a wide pitch, falling away on the diagonal.',
  (c) => ({ rule: thinned(c, dotsL('40%', '25%'), fade('135deg', '0%', '100%'), R2) }),
  { pal: 5 }
);

add(
  'Grainfall',
  'A fine grain, dense enough to read as a tint where it starts and as specks where it ends.',
  (c) => ({ rule: thinned(c, dotsL('26%', '11.1%'), fade('180deg', '10%', '100%')) }),
  { pal: 21 }
);

add(
  'Spraydown',
  'Nothing at the top of the cell and a heavy spray by the bottom.',
  (c) => ({
    rule: thinned(c, softDotsL('6%', '48%', '6.25%'), rise('180deg', '4%', '100%')),
  }),
  { pal: 59 }
);

add(
  'Dustfall',
  'A fine field on a close pitch, settling towards one edge.',
  (c) => ({ rule: thinned(c, dotsL('24%', '10%'), fade('0deg', '0%', '100%')) }),
  { pal: 66 }
);

add(
  'Dotdrift',
  'A soft-edged band of stipple running across the cell with clear ground either side.',
  (c) => ({
    rule: thinned(c, dotsL('26%', '16.67%'), midFade('90deg', '0%', '35%', '65%', '100%')),
  }),
  { pal: 12 }
);

add(
  'Peppering',
  'Coarse dots concentrated in the middle third and thinning out from there.',
  (c) => ({
    rule: thinned(c, dotsL('34%', '20%'), midFade('180deg', '8%', '40%', '60%', '92%'), R2),
  }),
  { pal: 49 }
);

add(
  'Dotwash',
  'The field pooled in one corner, thinning as it goes out from it.',
  (c) => ({
    rule: thinned(
      c,
      dotsL('28%', '14.3%'),
      'radial-gradient(circle at 100% 0%, #000 0%, transparent 92%)'
    ),
  }),
  { pal: 74 }
);

export const sectionC = { title: 'C. Stipple', all };
