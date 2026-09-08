#!/usr/bin/env node
// Every design must ship a committed preview image (public/previews/<slug>.webp)
// and no preview may outlive its design. The catalog points agents at these
// URLs (see generate-previews.mjs), so a missing file is a broken promise in
// the published catalog - fail the build, don't let it rot.
//
// Runs on prebuild/predev. Fix with `npm run previews` (or `npm run previews
// <slug>` for one design).
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const patternsDir = path.join(repoRoot, 'packages', 'tabbied', 'patterns');
const previewsDir = path.join(repoRoot, 'public', 'previews');

const slugs = readdirSync(patternsDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => file.replace(/\.json$/, ''));

if (!existsSync(previewsDir)) {
  console.error(
    'previews: public/previews/ is missing - run `npm run previews`.'
  );
  process.exit(1);
}

const previews = new Set(
  readdirSync(previewsDir)
    .filter((file) => file.endsWith('.webp'))
    .map((file) => file.replace(/\.webp$/, ''))
);

const missing = slugs.filter((slug) => !previews.has(slug));
const orphans = [...previews].filter((slug) => !slugs.includes(slug));

if (missing.length || orphans.length) {
  for (const slug of missing) {
    console.error(`previews: missing public/previews/${slug}.webp`);
  }
  for (const slug of orphans) {
    console.error(
      `previews: orphan public/previews/${slug}.webp names no design`
    );
  }
  console.error(
    `previews: ${missing.length} missing, ${orphans.length} orphan(s) - ` +
      'run `npm run previews`.'
  );
  process.exit(1);
}

console.log(`previews: ${slugs.length} designs, all with a committed preview`);
