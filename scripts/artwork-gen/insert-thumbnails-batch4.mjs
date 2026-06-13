// Inserts the batch-4 thumbnail configs into galleryThumbnails.ts, just before
// the closing brace of the galleryThumbnails map. Idempotent: skips any slug
// that already has an entry.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch4 } from './artwork-defs-4.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FILE = path.join(
  ROOT,
  'components/select-artwork-page/galleryThumbnails.ts'
);

let src = readFileSync(FILE, 'utf-8');

const blocks = [];
for (const def of batch4) {
  if (new RegExp(`\\n  ${def.slug}: \\{`).test(src)) continue; // already present
  blocks.push(
    `  ${def.slug}: {\n    options: { grid: '${def.thumb.grid}', frequency: ${def.thumb.frequency} },\n  },`
  );
}

if (!blocks.length) {
  console.log('nothing to insert (all batch-4 slugs already present)');
  process.exit(0);
}

// Find the final "};" that closes the exported map and insert before it.
const marker = '\n};\n';
const at = src.lastIndexOf(marker);
if (at === -1) throw new Error('could not find closing of galleryThumbnails');

src = src.slice(0, at) + '\n' + blocks.join('\n') + src.slice(at);
writeFileSync(FILE, src);
console.log(`inserted ${blocks.length} thumbnail entries`);
