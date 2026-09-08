// L. Ring - hard-stop radial bands.
//
// A radial-gradient whose stops all land on the same position is a set of
// concentric hard edges: transparent to the first radius, ink between two, and
// transparent again past the second. Used as a mask that is a real ring with a
// real hole in it - set the background slot to transparent and the sheet shows
// through the middle.
//
// The converter maps these to <radialGradient> stops one for one, which is why
// rings land at a flat 0.00% against their live render: there is no geometry
// for a vector renderer to re-derive, only stops.
import { section, F, TR, rot, ringsL, faded, R4 } from './shared.mjs';

const { add, all } = section('L. Ring');

add(
  'Ringfield',
  'Rings on a close pitch, run from a point on one edge rather than the centre.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, ringsL('4%', '13%', '50% 100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 75 }
);

export const sectionL = { title: 'L. Ring', all };
