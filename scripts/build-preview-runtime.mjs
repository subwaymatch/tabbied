#!/usr/bin/env node
// The pattern runtime Studio's preview shell loads, bundled and same-origin.
//
// Studio previews a *generated* direction by taking the packaged download for
// its template, applying an edits document to it, and showing the result. The
// download is the right artefact to show - it is framework-free, its patterns
// are `[data-pattern]` placeholders rather than React, and it is literally what
// the Download button hands over - but its own bootstrap imports tabbied from
// esm.sh, pinned, so the shipped zip keeps rendering years from now. That is
// correct for a stranger who unzipped it and wrong for this site, which would
// then depend on a third-party CDN to draw its own preview.
//
// So the shell rewrites that one script tag to import this file instead. It has
// to be a *bundle* rather than a copy of dist/: `tabbied/dist/core/register.js`
// does a bare `import 'css-doodle'`, which no browser resolves.
//
// The bundle carries the whole catalog, not just the designs the packaged
// templates mount. It used to be derived from the packaged HTML (231 of the
// 295), which was exactly right while a preview could only re-colour a field;
// the customizer's "Shuffle patterns" swaps a field to any design in the
// library, and a design missing from this bundle hydrates to a blank with a
// console warning - the silent failure the whole editable scheme exists to
// avoid. The packaged HTML is still read, as the check that the packager wrote
// something this runtime can draw, and the catalog it is checked against is
// the one the customizer offers.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(repoRoot, 'public', 'studio', 'preview-runtime.js');

// The packager writes into public/downloads during a build (so the second
// `next build` exports it) and into out/downloads when re-run by hand against
// an existing export. Read whichever is there, newest first - the same
// two-candidate shape e2e/editable.spec.ts uses for the spec.
const downloadsDir = [
  path.join(repoRoot, 'public', 'downloads'),
  path.join(repoRoot, 'out', 'downloads'),
].find((candidate) => existsSync(candidate));

if (!downloadsDir) {
  console.error(
    'build-preview-runtime: no downloads folder - run `npm run templates` first.'
  );
  process.exit(1);
}

/** Every design any packaged template mounts, read out of the markup. */
function usedPatterns() {
  const slugs = new Set();

  for (const entry of readdirSync(downloadsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const file = path.join(downloadsDir, entry.name, 'index.html');

    if (!existsSync(file) || !statSync(file).isFile()) continue;

    for (const match of readFileSync(file, 'utf-8').matchAll(
      /data-pattern="([a-z0-9-]+)"/g
    )) {
      slugs.add(match[1]);
    }
  }

  return [...slugs].sort();
}

/** The whole catalog, by slug - what a field may be swapped to. */
function catalogPatterns() {
  const catalogPath = path.join(repoRoot, 'packages', 'tabbied', 'catalog.json');

  if (!existsSync(catalogPath)) {
    console.error(
      'build-preview-runtime: packages/tabbied/catalog.json is missing - run `npm run build:packages`.'
    );
    process.exit(1);
  }

  return JSON.parse(readFileSync(catalogPath, 'utf-8'))
    .designs.map((design) => design.slug)
    .sort();
}

const used = usedPatterns();

if (used.length === 0) {
  console.error(
    'build-preview-runtime: no [data-pattern] in public/downloads - the packager wrote nothing usable.'
  );
  process.exit(1);
}

const patterns = catalogPatterns();
const missing = used.filter((slug) => !patterns.includes(slug));

if (missing.length > 0) {
  console.error(
    `build-preview-runtime: the packaged templates mount ${missing.join(', ')}, which the catalog does not have.`
  );
  process.exit(1);
}

// The whole record rather than a named list: every design is wanted, and the
// generated module's `patterns` export is the one place they are all named.
const entry = [
  "import { hydratePatterns } from 'tabbied';",
  "import { patterns } from 'tabbied/patterns';",
  '',
  'export { hydratePatterns, patterns };',
  '',
  '// The shell calls this; keeping the call here means the injected script tag',
  '// is one line and carries no pattern names of its own.',
  'let mounted = [];',
  'export const hydrate = (options = {}) => (mounted = hydratePatterns({ patterns, ...options }));',
  '',
  '// The editor rewrites data-* on a pattern host and needs it drawn again.',
  '// hydratePatterns skips an element it already mounted, so this tears the',
  '// controllers down first - the same teardown/re-hydrate cycle the README',
  '// documents - and mounts from the attributes as they now are.',
  'export const rehydrate = () => {',
  '  for (const { controller } of mounted) controller.destroy();',
  '  return hydrate();',
  '};',
  '',
  '// Which designs this runtime can draw, for a shell that wants to check',
  '// before it writes a slug into the page.',
  'export const designs = Object.keys(patterns);',
  '',
].join('\n');

mkdirSync(path.dirname(outFile), { recursive: true });

const result = await build({
  stdin: { contents: entry, resolveDir: repoRoot, loader: 'js' },
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  legalComments: 'none',
  outfile: outFile,
  metafile: true,
});

const bytes = statSync(outFile).size;

console.log(
  `preview-runtime: ${patterns.length} pattern(s) (${used.length} mounted by a template), ${(bytes / 1024).toFixed(0)} KB` +
    (result.warnings.length ? ` - ${result.warnings.length} warning(s)` : '')
);
