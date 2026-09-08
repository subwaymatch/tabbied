// Batch 12 - 32 designs that export as native SVG with no caveat at all.
//
// Batch 11 asked what the catalogue looks like when the *format* is the
// constraint: designs that download as true vector files with no warning
// dialog, no filter effects for a design tool to mangle, and no sub-pixel
// deviation from what is on screen. This batch keeps that rule and spends most
// of its designs on the one part of the supported CSS subset the catalogue had
// barely used - the smooth gradient.
//
// Nineteen of the thirty-two are ramps: straight fades over a solid ink, dot
// fields and ruled fields thinned across a cell, a glow thrown from a corner,
// ramps shut inside a cut shape, and a fade posterized into flat alpha levels.
// They are safe for the same reason the hard-edged ones are: a
// <linearGradient> or <radialGradient> carries the same stops CSS did, and the
// converter subdivides a colour->transparent run to account for CSS
// interpolating premultiplied alpha where SVG does not. Only *conic* blends
// are impossible, and there are none.
//
// Every ramp is a mask over an ordinary background-color rather than a
// two-colour background image. That keeps the ink transitionable - a reseed
// morphs through the colour instead of snapping to it - and it makes the faded
// end a real hole: set the background slot to transparent and the sheet shows
// through a soft edge exactly as it does through a hard one.
//
// The remaining thirteen work in the hard-edged vocabulary batch 11
// established - splits, chamfers, hard-stop radial bands, dot fields,
// overlaps, mask intersections and border-radius forms.
//
// The thirteen families, in the order they ship:
//
//   A. Falloff     one ink, one straight ramp.                         (5)
//   C. Stipple     dot fields thinned by a ramp.                       (8)
//   D. Drybrush    ruled fields thinned by a ramp.                     (2)
//   E. Bloom       a radial ramp thrown from a corner.                 (1)
//   F. Cutfade     a ramp confined to a cut shape.                     (2)
//   G. Rampband    a fade posterized into flat alpha levels.           (1)
//   I. Split       one cut across the cell, an ink either side.        (2)
//   J. Chamfer     corners taken off the square.                       (3)
//   L. Ring        hard-stop radial bands.                             (1)
//   N. Speck       hard-edged dot fields.                              (2)
//   R. Overlap     two shapes crossing, read through opacity.          (1)
//   S. Intersect   mask-composite: intersect.                          (1)
//   T. Radius      border-radius forms.                                (3)
//
// (The letters are the families the batch was drawn from. B, H, K, M, O, P and
// Q were authored and cut, so the sequence skips them rather than renumbering
// designs that already have their gallery order.)
//
// House rules, inherited from every earlier batch and enforced by
// generate-batch12.mjs (via pattern-lints.mjs) and validate-batch12.mjs:
// exactly one @random(${shapeFrequency}) gate per design; every design samples
// a transition-able ink per cell so a reseed morphs; a randomized custom prop
// read more than once goes through @var(--x); nothing paints var(--color0),
// because a hole knocked out in the background colour stops being a hole the
// moment the background is transparent.
import { RESERVED, TAKEN12 } from './pattern-defs-12/shared.mjs';
import { sectionA } from './pattern-defs-12/a-falloff.mjs';
import { sectionC } from './pattern-defs-12/c-stipple.mjs';
import { sectionD } from './pattern-defs-12/d-drybrush.mjs';
import { sectionE } from './pattern-defs-12/e-bloom.mjs';
import { sectionF } from './pattern-defs-12/f-cutfade.mjs';
import { sectionG } from './pattern-defs-12/g-rampband.mjs';
import { sectionI } from './pattern-defs-12/i-split.mjs';
import { sectionJ } from './pattern-defs-12/j-chamfer.mjs';
import { sectionL } from './pattern-defs-12/l-ring.mjs';
import { sectionN } from './pattern-defs-12/n-speck.mjs';
import { sectionR } from './pattern-defs-12/r-overlap.mjs';
import { sectionS } from './pattern-defs-12/s-intersect.mjs';
import { sectionT } from './pattern-defs-12/t-radius.mjs';

const SECTIONS = [
  sectionA,
  sectionC,
  sectionD,
  sectionE,
  sectionF,
  sectionG,
  sectionI,
  sectionJ,
  sectionL,
  sectionN,
  sectionR,
  sectionS,
  sectionT,
];

// Batch 12 owns gallery orders 1400-1999; batch 11 stops at 1254.
const FIRST_ORDER = 1400;

let order = FIRST_ORDER;
const seen = new Set();
export const batch12 = [];

for (const { title, all } of SECTIONS) {
  for (const def of all) {
    if (RESERVED.has(def.slug)) {
      throw new Error(`${def.slug}: slug is a JS reserved word`);
    }
    // A name should never come to mean two different things - TAKEN12 carries
    // every motif name used anywhere in the project, batch 11 included, plus
    // the designs cut before they shipped.
    if (TAKEN12.has(def.slug)) {
      throw new Error(`${def.slug} (${title}): name already used elsewhere`);
    }
    if (seen.has(def.slug)) throw new Error(`duplicate slug in batch 12: ${def.slug}`);
    seen.add(def.slug);
    batch12.push({ ...def, order: order++ });
  }
}
