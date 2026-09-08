// SVG-export gate for batch 13 - 300 designs that must export as native SVG
// with *no* caveat: no `svgExport: false`, no `svgExportNote`, no converter
// warning, and pixel parity with the live render. The harness lives in
// svg-sweep.mjs, shared with batches 11 and 12; this script points it at
// batch 13.
//
// This is the gate that actually decides whether the batch keeps its promise -
// the lints in generate-batch13.mjs only reject the CSS that is known unsafe
// at authoring time, while this runs the shipped converter over every rendered
// design and fails on a throw, on any warning, or on a pixel diff.
//
// Usage:
//   npm run build --workspace tabbied     # the sweep injects dist/
//   node scripts/pattern-gen/validate-svg-batch13.mjs
//   SLUGS=headland,tulle node scripts/pattern-gen/validate-svg-batch13.mjs
//
// Env: SLUGS (comma-separated slugs; defaults to the whole batch),
//      CHROMIUM_PATH, SVG_SEEDS (comma-separated, default two),
//      SVG_ARTIFACTS (dir for failure artifacts: out.svg / mine.png / ref.png).
import { batch13 } from './pattern-defs-13.mjs';
import { runSvgSweep } from './svg-sweep.mjs';

await runSvgSweep({
  defs: batch13,
  label: 'batch-13',
  artifactsPrefix: 'tabbied-svg-b13',
});
