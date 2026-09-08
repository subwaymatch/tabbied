// F. Metalwork - beads turned concentric on the lathe.
//
// A repeating-radial-gradient run from the centre of the cell: fine rings all
// the way out, every one the same weight. The first stop has to sit at 0 or
// the repeat starts mid-ring and the centre reads as a blot.
//
// The converter maps these to <radialGradient> stops one for one, which is
// why rings land at a flat 0.00% against their live render: there is no
// geometry for a vector renderer to re-derive, only stops. And because the
// rings are a mask rather than a two-colour image, the ground between them
// stays see-through.
import { section, F, TR, rot, faded, ringsL, R4 } from './shared.mjs';

const { add, all } = section('F. Metalwork');

add(
  'Capstan',
  'Fine concentric beads turned all the way out from the centre.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, ringsL('4%', '12%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 54 }
);

export const sectionF = { title: 'F. Metalwork', all };
