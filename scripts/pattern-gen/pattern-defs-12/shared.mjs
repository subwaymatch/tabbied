// Batch 12 - shared vocabulary.
//
// Batch 12 inherits batch 11's constraint wholesale: every design must export
// as native SVG with *no* caveat - no `svgExport: false`, no `svgExportNote`,
// no converter warning, and pixel parity with the live render well inside the
// house budget. docs/svg-export.md is the contract; pattern-defs-11/shared.mjs
// is where the vocabulary that satisfies it was worked out, and this module
// re-exports it rather than restating it.
//
// What is off the table is unchanged and worth repeating, because it is the
// whole reason both batches look the way they do: box-shadow, filter: blur(),
// mix-blend-mode (all export as SVG *filters*, which design tools import
// imperfectly), repeating-conic-gradient and smooth conic sweeps (SVG has no
// angular gradient), nested @doodle() images and @svg() payloads (documented
// sub-pixel deviations from the live render), and borders on partially-rounded
// boxes (the converter throws).
//
// Where batch 12 goes further is the other direction: *smooth* gradients.
// Batch 11 had one section of them (M. Fade, nine designs) and used hard stops
// everywhere else. Most of this batch is built on the smooth ramp - linear and
// radial, always as masks - because that is the part of the supported subset
// the catalogue had barely touched, and because a <linearGradient> or
// <radialGradient> with the same stops is about the most faithful thing the
// converter emits. Nineteen of the thirty-two designs are those; the other
// thirteen work in the hard-edged vocabulary.
//
// Two things make a smooth ramp safe here where a conic one is not:
//
//   * a linear or radial gradient maps stop-for-stop onto its SVG equivalent,
//     including the premultiplied-alpha subdivision the converter does for a
//     colour->transparent run (CSS interpolates premultiplied, SVG does not);
//   * the ramp is a *mask* over a solid ink, never a two-colour background
//     image. That keeps the ink an ordinary background-color, so a reseed
//     morphs through the colour instead of snapping to it, and it makes the
//     faded end a real hole - set the background slot to transparent and the
//     sheet shows through the soft edge exactly as it does through a hard one.
//
// The house rules inherited from batches 6-11 still apply and are enforced by
// generate-batch12.mjs: exactly one @random(${shapeFrequency}) gate per design;
// every design samples a transition-able ink per cell; a randomized custom
// property read more than once goes through @var(--x); nothing paints
// var(--color0).
export {
  RESERVED,
  section,
  F,
  TR,
  cp,
  rot,
  msk,
  B,
  A,
  ink,
  c1,
  R2,
  R4,
  pieL,
  slotL,
  ringsL,
  poly,
} from '../pattern-defs-11/shared.mjs';

import { TAKEN } from '../pattern-defs-11/shared.mjs';
import { ink, msk, mskI } from '../pattern-defs-11/shared.mjs';
import { batch11 } from '../pattern-defs-11.mjs';

// Every motif name used anywhere in the project, batch 11 included. A name
// should never come to mean two different things.
export const TAKEN12 = new Set([...TAKEN, ...batch11.map((d) => d.slug)]);

// ── smooth ramps: the mask layers this batch is built on ───────────────────
// Every one of these paints in #000 and transparent only. Keeping colour out
// of the mask is what makes the ink a transitionable background-color, and it
// keeps each layer composable: msk(a, b) adds them, mskI(a, b) intersects.
//
// The units are percentages of the mask box throughout, so a design holds its
// proportions at any grid and any canvas size.

/** Solid at `from`, gone by `to`. The plainest fade there is. */
export const fade = (angle, from, to) =>
  `linear-gradient(${angle}, #000 ${from}, transparent ${to})`;

/** The same ramp run backwards: nothing at `from`, solid by `to`. */
export const rise = (angle, from, to) =>
  `linear-gradient(${angle}, transparent ${from}, #000 ${to})`;

/** Up and back down again: a soft-edged band lying across the box. */
export const midFade = (angle, a, b, c, d) =>
  `linear-gradient(${angle}, transparent ${a}, #000 ${b} ${c}, transparent ${d})`;

/**
 * Stepped translucency: a fade posterized into `steps` flat levels. Every stop
 * pair sits at the same position, so this is a hard-stop gradient that reads
 * as a ramp - the levels come from the alpha, not from interpolation.
 */
export const stepFade = (angle, steps, span = 100) => {
  const stops = [];
  for (let i = 0; i < steps; i++) {
    const a = Math.round(255 * (1 - i / steps))
      .toString(16)
      .padStart(2, '0');
    const from = ((i * span) / steps).toFixed(1);
    const to = (((i + 1) * span) / steps).toFixed(1);
    stops.push(`#000000${a} ${from}% ${to}%`);
  }
  stops.push(`transparent ${span}%`);
  return `linear-gradient(${angle}, ${stops.join(', ')})`;
};

// ── tiled fields ───────────────────────────────────────────────────────────
// A gradient smaller than its box tiles, and the converter turns the layer
// into an SVG <pattern> holding one tile.

/** A hard-edged dot of radius `r` in each `pitch`-sized tile. */
export const dotsL = (r, pitch, offset = '0 0') =>
  `radial-gradient(circle at 50% 50%, #000 ${r}, transparent ${r}) ${offset} / ${pitch} ${pitch}`;

/** The same field with the dot's edge feathered from `core` out to `r`. */
export const softDotsL = (core, r, pitch, offset = '0 0') =>
  `radial-gradient(circle at 50% 50%, #000 ${core}, transparent ${r}) ${offset} / ${pitch} ${pitch}`;

// ── declaration-level shorthands ───────────────────────────────────────────

/** One ink, cut by the layers added together. */
export const faded = (c, ...layers) => `background: ${ink(c)}; ${msk(...layers)}`;

/** One ink, cut by everything the layers agree on. */
export const both = (c, ...layers) => `background: ${ink(c)}; ${mskI(...layers)}`;

/** A pseudo-element covering the whole cell, in its own ink. */
export const sheet = (el, inkValue, css = '') =>
  el(`inset: 0; background: ${inkValue}; ${css}`);

/** A horizontal bar: `top`/`height` given, inset from the sides by `side`. */
export const across = (top, height, inkValue, side = '0') =>
  `left: ${side}; right: ${side}; top: ${top}; height: ${height}; background: ${inkValue};`;

/** A vertical bar: `left`/`width` given, inset from top and bottom by `end`. */
export const down = (left, width, inkValue, end = '0') =>
  `top: ${end}; bottom: ${end}; left: ${left}; width: ${width}; background: ${inkValue};`;
