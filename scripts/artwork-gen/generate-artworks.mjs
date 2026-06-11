// One-shot generator: emits artworks/<slug>.json for every definition and
// prints the galleryThumbnails.ts entries to insert.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch1 } from './artwork-defs-1.mjs';
import { batch2 } from './artwork-defs-2.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

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

const defs = [...batch1, ...batch2];

const slugs = new Set();
for (const def of defs) {
  if (slugs.has(def.slug)) throw new Error(`duplicate slug: ${def.slug}`);
  slugs.add(def.slug);
}

const thumbEntries = [];

for (const def of defs) {
  let options;
  if (def.options) {
    options = def.options.map((opt) =>
      opt.kind === 'grid' ? GRID_OPTION(opt.default) : opt
    );
  } else {
    options = [GRID_OPTION(def.gridDefault), FREQ_OPTION(def.freqDefault)];
  }

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
  // macro — every plain var(--x) reference re-rolls it. Shared rolls must be
  // emitted per cell and referenced via @var(--x) instead.
  const propDefs = [...style.matchAll(/(--[\w-]+)\s*:\s*([^;]*);/g)];
  for (const [, propName, propValue] of propDefs) {
    if (/--color\d/.test(propName)) continue;
    if (!/@(p|pick|r|rand|pd|pick-d)\b/i.test(propValue)) continue;
    const plainRefs = [
      ...style.matchAll(new RegExp(`(?<!@)var\\(${propName}\\)`, 'g')),
    ].length;
    if (plainRefs > 1) {
      throw new Error(
        `${def.slug}: randomized ${propName} referenced ${plainRefs}x via plain var() — re-rolls per reference; use a cell-level prop + @var()`
      );
    }
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

  const artwork = {
    name: def.name,
    slug: def.slug,
    galleryOrder: def.order,
    ...(def.white ? { galleryWhite: true } : {}),
    description: def.description,
    palette: def.palette,
    colors: def.colors,
    options,
    code: { style, doodle },
  };

  writeFileSync(
    path.join(ROOT, `artworks/${def.slug}.json`),
    JSON.stringify(artwork, null, 2) + '\n'
  );

  // Thumbnail config: square card → square-ish grid override plus any
  // option overrides declared by the definition.
  const thumbOptions = {};
  if (def.thumb?.grid) thumbOptions.grid = def.thumb.grid;
  if (def.thumb?.frequency !== undefined)
    thumbOptions.frequency = def.thumb.frequency;
  Object.assign(thumbOptions, def.thumb?.options ?? {});

  const pairs = Object.entries(thumbOptions)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`)
    .join(', ');
  thumbEntries.push(`  ${def.slug}: {\n    options: { ${pairs} },\n  },`);
}

console.log(`wrote ${defs.length} artwork files`);
console.log('--- galleryThumbnails entries ---');
console.log(thumbEntries.join('\n'));
