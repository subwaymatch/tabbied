// SVG-export gate for batch 11 - the batch's defining constraint is that every
// design exports as native SVG with *no* caveat: no `svgExport: false`, no
// `svgExportNote`, no converter warning. The harness lives in svg-sweep.mjs,
// shared with batch 12; this script just points it at batch 11's definitions.
//
// Usage:
//   npm run build --workspace tabbied     # the sweep injects dist/
//   node scripts/pattern-gen/validate-svg-batch11.mjs
//   SLUGS=damier,radius node scripts/pattern-gen/validate-svg-batch11.mjs
//
// Env: SLUGS (comma-separated slugs; defaults to the whole batch),
//      CHROMIUM_PATH, SVG_SEEDS (comma-separated, default two),
//      SVG_ARTIFACTS (dir for failure artifacts: out.svg / mine.png / ref.png).
import { batch11 } from './pattern-defs-11.mjs';
import { runSvgSweep } from './svg-sweep.mjs';

await runSvgSweep({
  defs: batch11,
  label: 'batch-11',
  artifactsPrefix: 'tabbied-svg-b11',
});
