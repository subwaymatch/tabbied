// M. Kilnglow - a smooth radial ramp, behaving like a glaze.
//
// A scorch reaching in from one corner: solid for a fifth of its radius, then
// a long smooth fall to nothing. It is the effect a blur or a box-shadow would
// normally be reached for, and it is here written as stops instead - which is
// the entire reason it can ship in this batch. The catalogue already carries
// four caveated designs (bokeh, neon, lantern, terrain) that reach for a
// filter to do this; a <radialGradient> needs no note at all.
//
// The ramp is a mask over a solid ink, never a two-colour background image, so
// a reseed morphs through the colour and the faded end is a real hole with a
// soft edge rather than a blend into whatever happens to be behind it. The
// converter subdivides the colour->transparent run because CSS interpolates
// premultiplied alpha where SVG does not.
import { section, F, TR, rot, faded, R4 } from './shared.mjs';

const { add, all } = section('M. Kilnglow');

/** Solid to `hold`, gone by `gone`, thrown from `at`. */
const glow = (at, hold, gone) =>
  `radial-gradient(circle farthest-side at ${at}, #000 0 ${hold}, transparent ${gone})`;

add(
  'Raku',
  'A scorch reaching in from one corner across most of the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, glow('100% 100%', '20%', '86%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 19 }
);

export const sectionM = { title: 'M. Kilnglow', all };
