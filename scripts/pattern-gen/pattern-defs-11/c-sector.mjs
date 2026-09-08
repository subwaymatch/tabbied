// C. Sector - hard-stop conic pies.
//
// conic-gradient is the only thing in CSS that sweeps a value round an angle,
// and it is also the one gradient SVG has no primitive for. The distinction
// that matters is *hard stop* versus sweep: a span whose two ends are the same
// colour is a sector, and the converter emits it as a path; a span whose ends
// differ is a smooth angular blend, and the converter refuses it. Four designs
// in the catalogue are marked "no SVG export" for exactly that reason.
//
// Every conic here is a hard stop, used as a mask, so the part that is not the
// sector is a genuine hole rather than a fill in the background colour. What
// separates one design from the next is where the apex sits, how wide the
// sector opens, how many of them there are, and whether the middle is bored
// out.
import { section, A, F, TR, ink, rot, pie1, arcSector, R4 } from './shared.mjs';

const { add, all } = section('C. Sector');

add(
  'Beamspread',
  'One wide beam thrown from the middle of an edge, opening to nearly a half-circle.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${pie1('104deg', { from: '308deg', at: '50% 100%' })} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 20 }
);

add(
  'Protractor',
  'A half circle with the middle bored out - a sector taken all the way to 180 degrees.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${arcSector('180deg', '36%')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 59 }
);

export const sectionC = { title: 'C. Sector', all };
