#!/usr/bin/env node
/**
 * Fails the build if components/select-pattern-page/galleryThumbnails.ts holds
 * a config for a design that no longer exists.
 *
 * That file is hand-maintained (palettes and densities were tuned by eye), so
 * nothing regenerates it and a stale entry is invisible: the gallery looks it
 * up as `galleryThumbnails[item.slug]`, keyed off the shipped catalog, so an
 * entry whose slug names nothing is simply never read. 278 of them accumulated
 * that way when the catalog moved from `artworks/` to `patterns/` and the
 * configs for the designs dropped in that move were left behind.
 *
 * The batch generators already delete the entries for designs they drop, but
 * only within the gallery-order range each one owns - anything removed outside
 * a generator (a migration, a hand-deleted JSON) rots unnoticed. This is the
 * backstop for that case.
 *
 * The reverse is NOT an error: a design with no entry at all falls back to its
 * own palette and option defaults, which is how most of the catalog renders.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PATTERNS_DIR = path.join(ROOT, 'packages/tabbied/patterns');
const THUMBNAILS_FILE = path.join(
  ROOT,
  'components/select-pattern-page/galleryThumbnails.ts'
);

const patterns = new Set(
  readdirSync(PATTERNS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
);

// Top-level keys only: every entry sits at exactly two spaces of indent, and
// nested config objects are written on one line, so this cannot match into one.
const entries = [
  ...readFileSync(THUMBNAILS_FILE, 'utf-8').matchAll(/^ {2}([a-z][a-z0-9]*): \{/gm),
].map((m) => m[1]);

const orphans = entries.filter((slug) => !patterns.has(slug));

if (orphans.length) {
  console.error(
    `galleryThumbnails.ts has ${orphans.length} config(s) for designs that do not exist:\n  ` +
      orphans.join(', ') +
      `\nDelete those entries, or restore the pattern JSON they were written for.`
  );
  process.exit(1);
}

console.log(
  `gallery thumbnails: ${entries.length} configs, all naming a shipped design`
);
