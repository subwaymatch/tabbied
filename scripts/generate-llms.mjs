// Writes the site's agent-facing docs into public/ from the package's
// catalog.json. The texts themselves are built by the package's own
// scripts/generate-llms.mjs (which also writes the tarball's llms.txt during
// the package build) - this wrapper just gives the site its three copies:
//
//   /llms.txt       the short index (llmstxt.org convention)
//   /llms-full.txt  the complete reference - API contract, recipes, catalog
//   /catalog.json   the structured catalog, served verbatim
//
// Run via `npm run llms` (part of prebuild/predev, after the package build).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLlmsTexts } from '../packages/tabbied/scripts/generate-llms.mjs';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const catalogPath = path.join(repoRoot, 'packages', 'tabbied', 'catalog.json');
const publicDir = path.join(repoRoot, 'public');

let catalog;
try {
  catalog = JSON.parse(await readFile(catalogPath, 'utf-8'));
} catch (error) {
  throw new Error(
    `generate-llms: could not read ${path.relative(repoRoot, catalogPath)}. ` +
      'Run `npm run build --workspace tabbied` first.',
    { cause: error }
  );
}

const { llms, llmsFull } = buildLlmsTexts(catalog);

await mkdir(publicDir, { recursive: true });

await Promise.all([
  writeFile(path.join(publicDir, 'llms.txt'), llms),
  writeFile(path.join(publicDir, 'llms-full.txt'), llmsFull),
  // Served alongside so a tool can fetch the structured form directly.
  writeFile(
    path.join(publicDir, 'catalog.json'),
    `${JSON.stringify(catalog, null, 2)}\n`
  ),
]);

const kb = (text) => `${Math.round(Buffer.byteLength(text) / 102.4) / 10} KB`;

console.log(
  `generate-llms: wrote public/llms.txt (${kb(llms)}), ` +
    `public/llms-full.txt (${kb(llmsFull)}), and public/catalog.json ` +
    `for ${catalog.count} designs`
);
