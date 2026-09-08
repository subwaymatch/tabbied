#!/usr/bin/env node
// Derive each template site's editable-section spec from the static export.
//
// Everything here is read out of out/template/<slug>/index.html - the current
// text, the image sources, the pattern configuration, the brand palette. That
// is the same doctrine as the download packager (see the "Downloadable
// templates" section of CLAUDE.md): the spec is generated from the
// bytes that shipped, so it cannot describe a page that no longer exists.
// Hand-writing any of it would reintroduce exactly the drift the packager was
// built to avoid.
//
// **This script is also the build gate.** An annotation that resolves to
// nothing - an image slot with no <img>, two elements sharing an id while
// saying different things - exits non-zero. That failure is otherwise
// completely silent: the spec looks fine and the editor's control just does
// nothing. The repo has been here before, with 278 gallery thumbnail configs
// naming designs that no longer existed, and the cure was the same.
//
// Runs inside `npm run build`, between the two `next build` passes, and writes
// into public/ so the second pass exports it like any other static asset.
//
//   npm run editable            every annotated site
//   npm run editable solstice   just one
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SPEC_VERSION,
  extractFromHtml,
  validateSpec,
  hasErrors,
  formatProblems,
  declaredCopyRoles,
} from 'tabbied-templates';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const exportDir = path.join(repoRoot, 'out', 'template');
const outDir = path.join(repoRoot, 'public', 'editable');
const catalogPath = path.join(repoRoot, 'public', 'editable-catalog.json');
const designCatalogPath = path.join(
  repoRoot,
  'packages',
  'tabbied',
  'catalog.json'
);

const only = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));

if (!existsSync(exportDir)) {
  console.error(
    'editable: out/template is missing - run `next build` first ' +
      '(`npm run build` does this for you).'
  );
  process.exit(1);
}

// Option ranges come from the design catalog, so a pattern slot in the spec
// carries the same bounds `get_design` publishes. Without them a slot still
// extracts; it just cannot offer typed controls or validate a value.
let designOptions = () => undefined;

if (existsSync(designCatalogPath)) {
  const catalog = JSON.parse(readFileSync(designCatalogPath, 'utf8'));
  const byslug = new Map(
    catalog.designs.map((design) => [design.slug, design.options ?? []])
  );

  designOptions = (slug) => byslug.get(slug);
} else {
  console.warn(
    'editable: packages/tabbied/catalog.json is missing - pattern slots will ' +
      'carry no option ranges. Run `npm run build:packages`.'
  );
}

const titleOf = (html) => {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);

  return match ? match[1].replace(/\s*[·| - -]\s*Tabbied\s*$/i, '').trim() : '';
};

const fontsOf = (html) => {
  const href = /<link[^>]+href="(https:\/\/fonts\.googleapis\.com\/[^"]+)"/i.exec(
    html
  );

  return href ? { href: href[1].replace(/&amp;/g, '&') } : undefined;
};

const slugs = readdirSync(exportDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((slug) => (only.length === 0 ? true : only.includes(slug)))
  .sort();

if (only.length > 0) {
  const missing = only.filter((slug) => !slugs.includes(slug));

  if (missing.length > 0) {
    console.error(`editable: no exported page for ${missing.join(', ')}`);
    process.exit(1);
  }
}

// Packaging everything rewrites the folder, so a retired site can't linger in
// the deploy. Naming slugs updates those in place.
if (only.length === 0) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const failures = [];
const specs = [];
let skipped = 0;

for (const slug of slugs) {
  const pagePath = path.join(exportDir, slug, 'index.html');

  if (!existsSync(pagePath)) continue;

  const html = readFileSync(pagePath, 'utf8');
  const { slots, root, problems } = extractFromHtml(html, { designOptions });

  // A site with no annotations is not a failure. Coverage is deliberately
  // incremental - the shared-component sites are annotated first and the
  // bespoke pages follow in batches - so an unannotated page is just one the
  // editor cannot open yet.
  if (!root && slots.length === 0) {
    skipped += 1;
    continue;
  }

  if (!root) {
    failures.push(
      `${slug}: ${slots.length} slot(s) but no [data-edit-root] - nothing ` +
        'declares how the palette is derived'
    );
    continue;
  }

  if (problems.length > 0) {
    failures.push(...problems.map((problem) => `${slug}: ${problem}`));
    continue;
  }

  const brand = slots.find((slot) => slot.id === 'brand.name');
  const spec = {
    specVersion: SPEC_VERSION,
    site: {
      slug,
      name: (brand && brand.kind === 'text' ? brand.value : '') || titleOf(html) || slug,
    },
    palette: {
      colors: root.colors,
      derivation: root.derivation,
      ...(root.flatSections ? { flatSections: true } : {}),
      // A `vars` page owns its property names, so the spec has to carry them:
      // without them a re-colour would compute the right colours and write
      // them nowhere.
      ...(root.varNames ? { varNames: root.varNames } : {}),
    },
    ...(fontsOf(html) ? { fonts: fontsOf(html) } : {}),
    slots,
  };

  const specProblems = validateSpec(spec);

  if (hasErrors(specProblems)) {
    failures.push(`${slug}:\n${formatProblems(specProblems)}`);
    continue;
  }

  writeFileSync(
    path.join(outDir, `${slug}.json`),
    `${JSON.stringify(spec, null, 2)}\n`
  );

  specs.push(spec);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`editable: ${failure}`);
  console.error(
    `editable: ${failures.length} problem(s) - every annotation must resolve ` +
      'to exactly one thing in the export.'
  );
  process.exit(1);
}

const counts = (spec, kind) =>
  spec.slots.filter((slot) => slot.kind === kind).length;

// The aggregate index: what /create lists, and what the MCP `list_templates`
// tool serves. Small enough to return whole - 57 entries needs no query
// language.
const catalog = {
  specVersion: SPEC_VERSION,
  generated: specs.length,
  templates: specs.map((spec) => ({
    slug: spec.site.slug,
    name: spec.site.name,
    href: `/template/${spec.site.slug}/`,
    spec: `/editable/${spec.site.slug}.json`,
    palette: spec.palette.colors,
    patterns: [
      ...new Set(
        spec.slots
          .filter((slot) => slot.kind === 'pattern')
          .map((slot) => slot.config.slug)
      ),
    ],
    // Which pieces of brand copy this template can be handed. Studio reads
    // this to decide whether a generated direction can be previewed *as* the
    // business, or only as the template in its colours - see brand.ts.
    copyRoles: declaredCopyRoles(spec),
    slots: {
      text: counts(spec, 'text'),
      image: counts(spec, 'image'),
      pattern: counts(spec, 'pattern'),
    },
    downloads: {
      html: `/downloads/${spec.site.slug}-html.zip`,
      react: `/downloads/${spec.site.slug}-react.zip`,
    },
  })),
};

writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

const totals = specs.reduce(
  (sum, spec) => ({
    text: sum.text + counts(spec, 'text'),
    image: sum.image + counts(spec, 'image'),
    pattern: sum.pattern + counts(spec, 'pattern'),
  }),
  { text: 0, image: 0, pattern: 0 }
);

console.log(
  `editable: ${specs.length} site(s) - ${totals.text} text, ${totals.image} ` +
    `image, ${totals.pattern} pattern slots; ${skipped} not yet annotated`
);
