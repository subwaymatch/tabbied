// Syncs packages/tabbied/patterns/ with the batch-13 definitions: writes one
// JSON per definition, deletes any batch-13 pattern (and its gallery thumbnail
// entry) that the definitions no longer describe, and prints the thumbnail
// entries to insert. Scoped to gallery orders 2000-2999 so it never touches
// patterns shipped in another batch.
//
// The lints are in pattern-lints.mjs, shared with batches 11 and 12: the house
// rules every batch is checked against, plus the CSS that would cost a design
// its clean SVG-export tier - box-shadow, filter, blend modes, smooth conic
// sweeps, nested doodles and @svg payloads. Those checks are the cheap first
// pass; validate-svg-batch13.mjs is the real gate, running the shipped
// converter over every rendered design.
import { writeFileSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch13 } from './pattern-defs-13.mjs';
import { lintPattern } from './pattern-lints.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PATTERNS_DIR = path.join(ROOT, 'packages/tabbied/patterns');
const THUMBNAILS_FILE = path.join(
  ROOT,
  'components/select-pattern-page/galleryThumbnails.ts'
);

const SHELL =
  ':doodle { @grid: ${grid}; @size: ${width} ${height}; overflow:hidden; text-align:center; box-sizing:border-box } :container { background: var(--color0); overflow:hidden; }';

const GRID_OPTION = (def) => ({
  id: 'grid',
  displayName: 'Columns and rows',
  type: 'ButtonSelectGroup',
  default: def,
  options: ['2x3', '4x6', '6x9', '8x12', '10x15'],
  replace: '${grid}',
});

const FREQ_OPTION = (def) => ({
  id: 'frequency',
  displayName: 'Frequency',
  type: 'Slider',
  default: def,
  min: 0.2,
  max: 1,
  step: 0.1,
  replace: '${shapeFrequency}',
});

const collapse = (s) => s.replace(/\s+/g, ' ').trim();

const defs = batch13;

const batchSlugs = new Set();
for (const def of defs) {
  if (batchSlugs.has(def.slug)) throw new Error(`duplicate slug: ${def.slug}`);
  batchSlugs.add(def.slug);
}

// Batch 13 owns gallery orders 2000-2999, so a file already on disk is either
// this batch's own output (safe to rewrite) or another batch's pattern (never
// clobber it). A batch 14 starts at 3000 and bounds itself the same way.
const FIRST_ORDER = 2000;
const PAST_LAST_ORDER = 3000;
const ownedByBatch13 = (order) => order >= FIRST_ORDER && order < PAST_LAST_ORDER;
const existing = new Set(
  readdirSync(PATTERNS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
);
const orderOf = (slug) =>
  JSON.parse(readFileSync(path.join(PATTERNS_DIR, `${slug}.json`), 'utf-8'))
    .galleryOrder;

for (const def of defs) {
  if (!existing.has(def.slug)) continue;
  if (!ownedByBatch13(orderOf(def.slug))) {
    throw new Error(`batch-13 slug ${def.slug} collides with an existing pattern`);
  }
}

// Drop patterns this batch used to own but no longer defines, so the
// definitions stay the single source of truth for what ships.
const dropped = [...existing].filter(
  (slug) => !batchSlugs.has(slug) && ownedByBatch13(orderOf(slug))
);
for (const slug of dropped) {
  unlinkSync(path.join(PATTERNS_DIR, `${slug}.json`));
}
if (dropped.length) {
  let thumbs = readFileSync(THUMBNAILS_FILE, 'utf-8');
  for (const slug of dropped) {
    thumbs = thumbs.replace(
      new RegExp(`\\n  ${slug}: \\{[\\s\\S]*?\\n  \\},`, 'g'),
      ''
    );
  }
  writeFileSync(THUMBNAILS_FILE, thumbs);
  console.log(
    `removed ${dropped.length} pattern files + thumbnail entries: ${dropped.join(', ')}`
  );
}

const thumbEntries = [];

for (const def of defs) {
  const options = [GRID_OPTION(def.gridDefault), FREQ_OPTION(def.freqDefault)];

  const style = collapse(`${def.vars} --rule: ( ${def.rule} );`);
  const doodle = collapse(def.doodle ?? SHELL);

  lintPattern({
    slug: def.slug,
    style,
    doodle,
    options,
    palette: def.palette,
    colors: def.colors,
    batch: 'batch 13',
  });

  const pattern = {
    name: def.name,
    slug: def.slug,
    galleryOrder: def.order,
    ...(def.white ? { galleryWhite: true } : {}),
    description: def.description,
    palette: def.palette,
    colors: def.colors,
    ...(def.minCellPx ? { sizing: { minCellPx: def.minCellPx } } : {}),
    options,
    code: { style, doodle },
  };

  writeFileSync(
    path.join(PATTERNS_DIR, `${def.slug}.json`),
    JSON.stringify(pattern, null, 2) + '\n'
  );

  thumbEntries.push(
    `  ${def.slug}: {\n    options: { grid: '${def.thumb.grid}', frequency: ${def.thumb.frequency} },\n  },`
  );
}

console.log(`wrote ${defs.length} pattern files`);
if (process.env.PRINT_THUMBS) {
  console.log('--- galleryThumbnails entries ---');
  console.log(thumbEntries.join('\n'));
}
