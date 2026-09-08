// G. Beacon - two fans of light thrown from opposite edges.
//
// A hard-stop conic sector is the one angular form the converter can carry:
// SVG has no angular gradient, so a sector whose colour changes anywhere but
// at a shared stop angle is banned outright, and the lints hold this section
// to that. Two sectors aimed at each other from facing edges leave a gap down
// the middle that belongs to neither, which is the whole drawing.
//
// The sectors are mask layers over one ink, so the dark between the beams is
// a real hole rather than a second colour standing in for one.
import { section, F, TR, rot, faded, pieL, R2 } from './shared.mjs';

const { add, all } = section('G. Beacon');

add(
  'Mirrorblack',
  'Two fans facing each other from opposite edges, almost meeting.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${faded(
      c,
      pieL('60deg', { from: '60deg', at: '0% 50%' }),
      pieL('60deg', { from: '240deg', at: '100% 50%' })
    )} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 4 }
);

export const sectionG = { title: 'G. Beacon', all };
