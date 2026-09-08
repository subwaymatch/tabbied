// Batch 13 - 42 designs that export as native SVG with no caveat at all.
//
// Batches 11 and 12 fixed the *format*: designs that download as true vector
// files with no warning dialog, no filter effects for a design tool to mangle,
// and no sub-pixel deviation from what is on screen. This batch keeps that
// rule and changes the *anchor*: where those batches drew almost everything
// from the middle of the cell outward, this one seats its geometry against the
// cell's corners and edges - a shoreline held against one side, a frame
// hugging the perimeter, a light thrown in from an edge, a notch cut right
// through to the border.
//
// That anchoring is what the new vocabulary in pattern-defs-13/shared.mjs is
// for: `farthest-side` radials, so a stop at 100% means "one cell side"
// wherever the centre sits, and hard linear bands, so a bar is a mask layer
// that composes rather than a pseudo-element that does not.
//
// Sixteen families, in the order they ship:
//
//   A. Shore      land held against an edge, and the water shaping it.  (5)
//   B. Fell       a rounded mass standing off the side.                 (1)
//   C. Roofline   profiles taken off the top of a solid mass.           (2)
//   D. Scantling  the two halves of a rebated joint.                    (2)
//   E. Shirting   one stripe, four weights.                             (4)
//   F. Metalwork  beads turned concentric on the lathe.                 (1)
//   G. Beacon     two fans of light thrown from opposite edges.         (1)
//   H. Sheer      the dotted grounds of net and lace.                   (4)
//   I. Rigging    spars run out on the diagonal.                        (2)
//   J. Casement   frames, and the openings cut through them.            (5)
//   K. Cutground  ground stepped and notched, all clip-path.            (3)
//   L. Knitwork   ribbing end-on, and a sawtooth skyline.               (2)
//   M. Kilnglow   a smooth radial ramp, behaving like a glaze.          (1)
//   N. Silk       linear ramps as sheen on cloth.                       (3)
//   O. Fresco     the fall of ink quantised into counted levels.        (4)
//   P. Woolwork   a periodic field crossed with a smooth ramp.          (2)
//
// House rules, inherited from every earlier batch and enforced by
// generate-batch13.mjs (via pattern-lints.mjs) and validate-batch13.mjs /
// validate-svg-batch13.mjs: exactly one @random(${shapeFrequency}) gate per
// design; every design samples a transition-able ink per cell so a reseed
// morphs; a randomized custom prop read more than once goes through @var(--x);
// nothing paints var(--color0), because a hole knocked out in the background
// colour stops being a hole the moment the background is transparent.
import { RESERVED, TAKEN13 } from './pattern-defs-13/shared.mjs';
import { sectionA } from './pattern-defs-13/a-shore.mjs';
import { sectionB } from './pattern-defs-13/b-fell.mjs';
import { sectionC } from './pattern-defs-13/c-roofline.mjs';
import { sectionD } from './pattern-defs-13/d-scantling.mjs';
import { sectionE } from './pattern-defs-13/e-shirting.mjs';
import { sectionF } from './pattern-defs-13/f-metalwork.mjs';
import { sectionG } from './pattern-defs-13/g-beacon.mjs';
import { sectionH } from './pattern-defs-13/h-sheer.mjs';
import { sectionI } from './pattern-defs-13/i-rigging.mjs';
import { sectionJ } from './pattern-defs-13/j-casement.mjs';
import { sectionK } from './pattern-defs-13/k-cutground.mjs';
import { sectionL } from './pattern-defs-13/l-knitwork.mjs';
import { sectionM } from './pattern-defs-13/m-kilnglow.mjs';
import { sectionN } from './pattern-defs-13/n-silk.mjs';
import { sectionO } from './pattern-defs-13/o-fresco.mjs';
import { sectionP } from './pattern-defs-13/p-woolwork.mjs';

const SECTIONS = [
  sectionA,
  sectionB,
  sectionC,
  sectionD,
  sectionE,
  sectionF,
  sectionG,
  sectionH,
  sectionI,
  sectionJ,
  sectionK,
  sectionL,
  sectionM,
  sectionN,
  sectionO,
  sectionP,
];

// Batch 13 owns gallery orders 2000-2999; batch 12 stops at 1431.
const FIRST_ORDER = 2000;

let order = FIRST_ORDER;
const seen = new Set();
export const batch13 = [];

for (const { title, all } of SECTIONS) {
  for (const def of all) {
    if (RESERVED.has(def.slug)) {
      throw new Error(`${def.slug}: slug is a JS reserved word`);
    }
    // A name should never come to mean two different things - TAKEN13 carries
    // every motif name used anywhere in the project, batches 11 and 12
    // included.
    if (TAKEN13.has(def.slug)) {
      throw new Error(`${def.slug} (${title}): name already used elsewhere`);
    }
    if (seen.has(def.slug)) throw new Error(`duplicate slug in batch 13: ${def.slug}`);
    seen.add(def.slug);
    batch13.push({ ...def, order: order++ });
  }
}
