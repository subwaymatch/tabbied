// E. Shirting - one stripe, four weights.
//
// A single repeating-linear-gradient per design, used as a mask over one ink,
// and the only thing that changes across the section is the ratio of rule to
// ground: a hairline on an open set, an even stripe, a dense rib, and cloth
// so nearly solid that only a pinstripe of ground survives. That is a weaver's
// distinction rather than a draughtsman's, and it is the whole section.
//
// A repeating gradient exports as a tiled <linearGradient>, so the count of
// stripes on screen is the count in the file, and the ground between them
// stays a real hole on a transparent background.
import { section, F, TR, rot, faded, slotL, R2 } from './shared.mjs';

const { add, all } = section('E. Shirting');

/** A ruled field over one ink. Every design here is upright, so the turn is
 *  the half turn - a quarter would only swap warp for weft. */
const ruled = (c, layer) =>
  `--rot: ${R2}; ${F} { ${faded(c, layer)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Batiste',
  'Hairlines spaced far apart on an airy ground.',
  (c) => ({ rule: ruled(c, slotL('90deg', '2%', '20%')) }),
  { pal: 48 }
);

add(
  'Percale',
  'A crisp, even stripe, ink and ground given equal measure.',
  (c) => ({ rule: ruled(c, slotL('90deg', '10%', '20%')) }),
  { pal: 9 }
);

add(
  'Fustian',
  'A dense, hard-wearing rib - more ink than ground.',
  (c) => ({ rule: ruled(c, slotL('90deg', '14%', '22%')) }),
  { pal: 57 }
);

add(
  'Moleskin',
  'Cloth nearly solid, with only a pinstripe of ground surviving the shear.',
  (c) => ({ rule: ruled(c, slotL('90deg', '21%', '25%')) }),
  { pal: 61 }
);

export const sectionE = { title: 'E. Shirting', all };
