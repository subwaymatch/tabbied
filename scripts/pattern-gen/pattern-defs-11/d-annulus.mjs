// D. Annulus - rings, cut with hard-stop radial gradients.
//
// A radial-gradient whose stops all land on the same position is a set of
// concentric hard edges: transparent to the first radius, ink between two
// radii, transparent again past the second. Used as a mask that is a real
// ring, with a real hole in the middle - set the background slot to
// transparent and you can see the sheet through it.
//
// The converter maps these to <radialGradient> stops one for one, which is why
// every design in this section lands at a flat 0.00% against its live render:
// there is no geometry for a vector renderer to re-derive, only stops.
import {
  section,
  F,
  TR,
  ink,
  rot,
  msk,
  bandL,
  bandAt,
  ringsL,
  R4,
} from './shared.mjs';

const { add, all } = section('D. Annulus');

add(
  'Rimband',
  'The ring runs right to the edge of the cell, so it meets its neighbours.',
  (c) => ({ rule: `${F} { background: ${ink(c)}; ${msk(bandL('40%', '100%'))} }${TR}` }),
  { pal: 13 }
);

add(
  'Bangle',
  'The ring is drawn on the corner rather than the centre, so only an arc of it lands in the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk(bandAt('44%', '58%', '0% 0%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Ripplering',
  'Many fine concentric rings, close enough that the eye reads the spacing before the shape.',
  (c) => ({ rule: `${F} { background: ${ink(c)}; ${msk(ringsL('4%', '9%'))} }${TR}` }),
  { pal: 42 }
);

add(
  'Tidering',
  'The rings are centred on the bottom edge, so each cell shows a run of arcs rather than circles.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk(ringsL('6%', '15%', '50% 100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 65 }
);

export const sectionD = { title: 'D. Annulus', all };
