#!/usr/bin/env node
// Merge authored catalog metadata (tags / mood / density / goodFor) into
// packages/tabbied/patterns/*.json.
//
// Input: one or more JSON files, each `{ "<slug>": { tags, mood, density,
// goodFor }, ... }` - the shape the tagging pass produces. Every entry is
// validated against the closed vocabulary before anything is written, and the
// pattern files are rewritten with the metadata inserted right after
// `description`, keeping the rest of the key order untouched.
//
//   node scripts/pattern-gen/apply-catalog-metadata.mjs <file.json> [...]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateDesignMetadata,
} from '../../packages/tabbied/scripts/catalog-vocabulary.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PATTERNS_DIR = path.join(ROOT, 'packages/tabbied/patterns');

const inputs = process.argv.slice(2);
if (!inputs.length) {
  console.error('usage: apply-catalog-metadata.mjs <file.json> [...]');
  process.exit(1);
}

const merged = {};
for (const input of inputs) {
  const data = JSON.parse(readFileSync(input, 'utf8'));
  for (const [slug, metadata] of Object.entries(data)) {
    if (merged[slug]) {
      console.error(`duplicate metadata for "${slug}" (second in ${input})`);
      process.exit(1);
    }
    merged[slug] = metadata;
  }
}

// Validate everything before writing anything.
const errors = [];
for (const [slug, metadata] of Object.entries(merged)) {
  const file = path.join(PATTERNS_DIR, `${slug}.json`);
  if (!existsSync(file)) {
    errors.push(`${slug}: no such design`);
    continue;
  }
  errors.push(...validateDesignMetadata({ slug, ...metadata }));
}
if (errors.length) {
  for (const error of errors) console.error(`metadata: ${error}`);
  process.exit(1);
}

const ORDERED = ['tags', 'mood', 'density', 'goodFor'];

let written = 0;
for (const [slug, metadata] of Object.entries(merged)) {
  const file = path.join(PATTERNS_DIR, `${slug}.json`);
  const definition = JSON.parse(readFileSync(file, 'utf8'));

  const next = {};
  for (const [key, value] of Object.entries(definition)) {
    if (ORDERED.includes(key)) continue; // replaced below, at the anchor
    next[key] = value;
    if (key === 'description') {
      for (const field of ORDERED) next[field] = metadata[field];
    }
  }
  // A definition with no description still gets the metadata, at the end.
  if (!('description' in definition)) {
    for (const field of ORDERED) next[field] = metadata[field];
  }

  writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
  written += 1;
}

console.log(`metadata: wrote ${written} pattern file(s)`);
