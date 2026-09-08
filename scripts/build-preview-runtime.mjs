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
// does a bare `import 'css-doodle'`, which no browser resolves, and serving the
// raw dist would additionally hand the browser all 295 patterns to fetch one.
//
// Deriving the pattern list from the packaged HTML rather than from the
// template data is the same doctrine as the packager and the editable
// generator: the runtime then contains exactly the designs the shells it
// serves will ask for, and a template added in the same commit cannot be
// missing from it.
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

const patterns = usedPatterns();

if (patterns.length === 0) {
  console.error(
    'build-preview-runtime: no [data-pattern] in public/downloads - the packager wrote nothing usable.'
  );
  process.exit(1);
}

// A named import list rather than `export * from 'tabbied/patterns'`: the
// generated patterns module holds all 295, and naming the ones in use is what
// lets esbuild drop the rest.
const entry = [
  "import { hydratePatterns } from 'tabbied';",
  `import { ${patterns.join(', ')} } from 'tabbied/patterns';`,
  '',
  `const patterns = { ${patterns.join(', ')} };`,
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
  `preview-runtime: ${patterns.length} pattern(s), ${(bytes / 1024).toFixed(0)} KB` +
    (result.warnings.length ? ` - ${result.warnings.length} warning(s)` : '')
);
