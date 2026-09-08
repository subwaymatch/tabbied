// M. Fade - the one section with smooth gradients in it.
//
// Everywhere else in this batch a gradient is a set of hard stops standing in
// for a shape. Here the blend is the point. A linear gradient exports
// faithfully - a <linearGradient> with the same stops - and where a run goes
// from a colour to transparent the converter subdivides it, because CSS
// interpolates premultiplied alpha and SVG does not. Only *conic* blends are
// impossible, and there are none here.
//
// Every fade is a mask over a solid ink rather than a two-colour gradient in
// the background. That keeps the ink an ordinary background-color - so a
// reseed morphs through the colour rather than snapping to it - and it makes
// the faded part a real hole: set the background slot to transparent and the
// sheet shows through the soft end exactly as it does through the hard one.
import {
  section,
  A,
  B,
  F,
  TR,
  ink,
  rot,
  msk,
  mskI,
  slotL,
  R2,
  R4,
  c1,
} from './shared.mjs';

const { add, all } = section('M. Fade');

/** A straight fade: full ink at `from`, gone by `to`. */
const fade = (angle, from, to) =>
  `linear-gradient(${angle}, #000 ${from}, transparent ${to})`;

/** One ink, faded. */
const faded = (c, layer) => `background: ${ink(c)}; ${msk(layer)}`;

add(
  'Softedge',
  'Solid at one edge of the cell and gone by the other.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, fade('180deg', '0%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 0 }
);

add(
  'Falloff',
  'The fade runs from one corner to the one opposite.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, fade('135deg', '0%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 12 }
);

add(
  'Dimmer',
  'A solid ink with a second fading away across it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(fade('180deg', '0%', '100%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Fadein',
  'Nothing for the first half of the cell, then the ink coming up over the second.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, 'linear-gradient(180deg, transparent 0% 46%, #000 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 9 }
);

add(
  'Tinting',
  'A ruled field that fades out as it crosses the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${mskI(slotL('90deg', '9%', '18%'), fade('90deg', '0%', '100%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Shading',
  'A fade running on the diagonal, over a cell that is otherwise plain.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${faded(c, fade('45deg', '10%', '90%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 62 }
);

add(
  'Toning',
  'Two inks fading past each other in opposite directions.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${c1}; ${msk(fade('180deg', '0%', '90%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(fade('0deg', '0%', '90%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Glazing',
  'A dot field with a fade laid over it, so the stipple thins out across the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI('radial-gradient(circle at 50% 50%, #000 34%, transparent 34%) 0 0 / 16.67% 16.67%', fade('180deg', '0%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 24 }
);

add(
  'Scumble',
  'Rules that fade as they go, dragged across the cell like a dry brush.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI(slotL('0deg', '11%', '20%'), fade('90deg', '6%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 57 }
);

export const sectionM = { title: 'M. Fade', all };
