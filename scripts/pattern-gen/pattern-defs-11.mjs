// Batch 11 - 55 designs that export as native SVG with no caveat at all.
//
// The earlier batches were organised around a motif: batch 9 asked what
// happens when the canvas is the unit rather than the cell, batch 10 built
// drawings larger than the cell they start in. This one is organised around a
// *format*. Native SVG export shipped with three tiers - four designs it
// cannot represent, eighteen it exports with a caveat the user has to be shown
// first, and the rest clean - and this batch is 55 more of the clean tier.
// Every design here downloads as a true vector file with no warning dialog, no
// filter effects for a design tool to mangle, and no sub-pixel deviation from
// what is on screen.
//
// That is a real constraint, not a label. Ruled out: box-shadow, blur, blend
// modes (all export as SVG filters), smooth conic sweeps and
// repeating-conic-gradient (no SVG primitive), nested @doodle() images and
// @svg() payloads (documented sub-pixel deviations), and borders on
// partially-rounded boxes (the converter throws). What is left - solid fills,
// radii, clip paths, every linear and radial gradient, masks including
// mask-composite: intersect, hard-stop conic sectors, transforms, opacity,
// z-index - is the vocabulary of the whole batch. See
// pattern-defs-11/shared.mjs for the reasoning and the helpers, and
// docs/svg-export.md for the export contract itself.
//
// The twelve families, in the order they ship:
//
//   A. Split       one straight cut across the cell; two inks meet.        (6)
//   B. Rule        stripe fields - pitch, duty, angle.                     (3)
//   C. Sector      hard-stop conic pies.                                   (2)
//   D. Annulus     radial hard stops: rings and bands.                     (4)
//   E. Chamfer     polygons that cut corners, notches and steps.          (14)
//   F. Lobe        border-radius forms.                                    (2)
//   H. Bar         placed bars rather than repeating fields.               (2)
//   I. Wedge       triangles.                                              (2)
//   J. Speck       dot fields and halftones.                               (7)
//   K. Overlap     two shapes crossing, read through opacity.              (1)
//   L. Intersect   mask-composite: intersect - one shape cut by another.   (3)
//   M. Fade        smooth linear ramps, used as masks.                     (9)
//
// (The letters are the families the batch was drawn from; G, N, O and P were
// authored and cut, so the sequence skips them rather than renumbering
// designs that already have their gallery order.)
//
// House rules, inherited from every earlier batch and enforced by
// generate-batch11.mjs and validate-batch11.mjs: exactly one
// @random(${shapeFrequency}) gate per design; every design samples a
// transition-able ink per cell so a reseed morphs; a randomized custom prop
// read more than once goes through @var(--x); nothing paints var(--color0),
// because a hole knocked out in the background colour stops being a hole the
// moment the background is transparent.
import { RESERVED, TAKEN } from './pattern-defs-11/shared.mjs';
import { sectionA } from './pattern-defs-11/a-split.mjs';
import { sectionB } from './pattern-defs-11/b-rule.mjs';
import { sectionC } from './pattern-defs-11/c-sector.mjs';
import { sectionD } from './pattern-defs-11/d-annulus.mjs';
import { sectionE } from './pattern-defs-11/e-chamfer.mjs';
import { sectionF } from './pattern-defs-11/f-lobe.mjs';
import { sectionH } from './pattern-defs-11/h-bar.mjs';
import { sectionI } from './pattern-defs-11/i-wedge.mjs';
import { sectionJ } from './pattern-defs-11/j-speck.mjs';
import { sectionK } from './pattern-defs-11/k-overlap.mjs';
import { sectionL } from './pattern-defs-11/l-intersect.mjs';
import { sectionM } from './pattern-defs-11/m-fade.mjs';

const SECTIONS = [
  sectionA,
  sectionB,
  sectionC,
  sectionD,
  sectionE,
  sectionF,
  sectionH,
  sectionI,
  sectionJ,
  sectionK,
  sectionL,
  sectionM,
];

// Batch 11 owns gallery orders 1200+; batch 10 stops at 1112.
const FIRST_ORDER = 1200;

let order = FIRST_ORDER;
const seen = new Set();
export const batch11 = [];

for (const { title, all } of SECTIONS) {
  for (const def of all) {
    if (RESERVED.has(def.slug)) {
      throw new Error(`${def.slug}: slug is a JS reserved word`);
    }
    // A name should never come to mean two different things - TAKEN carries
    // every motif name used anywhere in the project, including designs cut
    // before they shipped.
    if (TAKEN.has(def.slug)) {
      throw new Error(`${def.slug} (${title}): name already used elsewhere`);
    }
    if (seen.has(def.slug)) throw new Error(`duplicate slug in batch 11: ${def.slug}`);
    seen.add(def.slug);
    batch11.push({ ...def, order: order++ });
  }
}
