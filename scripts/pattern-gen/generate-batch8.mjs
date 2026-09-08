// Syncs packages/tabbied/patterns/ with the batch-8 definitions: writes one
// JSON per definition, deletes any batch-8 pattern (and its gallery thumbnail
// entry) that the definitions no longer describe, and prints the thumbnail
// entries to insert. Scoped to gallery orders 900+ so it never touches
// patterns shipped in another batch.
import { writeFileSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch8 } from './pattern-defs-8.mjs';

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

const defs = batch8;

// Guard: batch-8 slugs must be unique within the batch and must not clobber any
// pre-existing pattern that isn't part of this batch.
const batchSlugs = new Set();
for (const def of defs) {
  if (batchSlugs.has(def.slug)) throw new Error(`duplicate slug: ${def.slug}`);
  batchSlugs.add(def.slug);
}
// Batch 8 owns gallery orders 900-999, so a file already on disk is either
// this batch's own output (safe to rewrite) or another batch's pattern (never
// clobber it). The range is bounded at both ends so batch 9, which lives above
// it, survives a batch-8 regeneration.
const FIRST_ORDER = 900;
const LAST_ORDER = 999;
const ownedByBatch8 = (order) => order >= FIRST_ORDER && order <= LAST_ORDER;
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
  if (!ownedByBatch8(orderOf(def.slug))) {
    throw new Error(`batch-8 slug ${def.slug} collides with an existing pattern`);
  }
}

// Drop patterns this batch used to own but no longer defines, so the
// definitions stay the single source of truth for what ships.
const dropped = [...existing].filter(
  (slug) => !batchSlugs.has(slug) && ownedByBatch8(orderOf(slug))
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

  // Sanity: every ${placeholder} in the code must be replaced by some option.
  const placeholders = new Set(
    [...`${style} ${doodle}`.matchAll(/\$\{(\w+)\}/g)].map((m) => m[1])
  );
  placeholders.delete('width');
  placeholders.delete('height');
  for (const ph of placeholders) {
    if (!options.some((o) => o.replace === '${' + ph + '}')) {
      throw new Error(`${def.slug}: placeholder \${${ph}} has no option`);
    }
  }
  for (const o of options) {
    const name = o.replace.slice(2, -1);
    if (!placeholders.has(name)) {
      throw new Error(`${def.slug}: option ${o.id} (${o.replace}) unused`);
    }
  }
  // Lint: a custom property whose value contains @-functions is a textual
  // macro - every plain var(--x) reference re-rolls it. Shared rolls must be
  // emitted per cell and referenced via @var(--x) instead.
  const propDefs = [...style.matchAll(/(--[\w-]+)\s*:\s*([^;]*);/g)];
  for (const [, propName, propValue] of propDefs) {
    if (/--color\d/.test(propName)) continue;
    if (!/@(p|pick|r|rand|pd|pick-d|pn|pick-n)\b/i.test(propValue)) continue;
    const plainRefs = [
      ...style.matchAll(new RegExp(`(?<!@)var\\(${propName}\\)`, 'g')),
    ].length;
    if (plainRefs > 1) {
      throw new Error(
        `${def.slug}: randomized ${propName} referenced ${plainRefs}x via plain var() - re-rolls per reference; use a cell-level prop + @var()`
      );
    }
  }
  // Batch 7 inherits batch 6's background independence: painting var(--color0)
  // only *looks* like a knockout while the background is opaque. With the
  // background slot set to #rrggbb00 the "hole" paints nothing and the shape
  // underneath stays solid. Cut the shape instead (clip-path hole, mask, or a
  // gap between elements).
  if (/var\(\s*--color0\s*\)/.test(style)) {
    throw new Error(
      `${def.slug}: style paints var(--color0) - that knockout disappears on a transparent background`
    );
  }
  // Exactly one frequency gate, so the slider always thins the whole field.
  // Nested @random(k) blocks *inside* that gate are how a design varies itself
  // (Blossom's trick) and are not counted here.
  const gateCount = (style.match(/@random\(\$\{shapeFrequency\}\)/g) ?? []).length;
  if (gateCount !== 1) {
    throw new Error(
      `${def.slug}: expected exactly one @random(\${shapeFrequency}) gate, found ${gateCount}`
    );
  }

  // Sanity: balanced parens in the rule.
  let depth = 0;
  for (const ch of style) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth < 0) throw new Error(`${def.slug}: unbalanced parens`);
  }
  if (depth !== 0) throw new Error(`${def.slug}: unbalanced parens`);
  if (def.palette.length !== def.colors.max) {
    throw new Error(`${def.slug}: palette length != colors.max`);
  }
  if (!/transition/.test(style)) {
    throw new Error(`${def.slug}: no transition in style`);
  }

  const pattern = {
    name: def.name,
    slug: def.slug,
    galleryOrder: def.order,
    ...(def.white ? { galleryWhite: true } : {}),
    description: def.description,
    palette: def.palette,
    colors: def.colors,
    ...(def.minCellPx ? { sizing: { minCellPx: def.minCellPx } } : {}),
    ...(def.svgExport === false ? { svgExport: false } : {}),
    ...(def.svgExportNote ? { svgExportNote: def.svgExportNote } : {}),
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
console.log('--- galleryThumbnails entries ---');
console.log(thumbEntries.join('\n'));
