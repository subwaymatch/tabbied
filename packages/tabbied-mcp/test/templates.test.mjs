// The template tools.
//
// Unlike the design tools, these read *site* artefacts rather than the
// installed package, so a fixture is the honest choice here - the generated
// specs are not in this package's dependency tree, and a test that fetched
// tabbied.com would be testing the deploy.
//
// The fixture mirrors what scripts/generate-editable.mjs actually emits; the
// shapes are pinned by e2e/editable.spec.ts against the real thing.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import fs from 'node:fs';
import { createRequire } from 'node:module';

import { catalogTools, createToolset } from '../dist/tools.js';

const require = createRequire(import.meta.url);
const catalog = JSON.parse(
  fs.readFileSync(require.resolve('tabbied/catalog.json'), 'utf-8')
);

const templateCatalog = {
  specVersion: 1,
  generated: 2,
  templates: [
    {
      slug: 'solstice',
      name: 'Solstice',
      href: '/template/solstice/',
      spec: '/editable/solstice.json',
      palette: ['#2b1d3a', '#ff6b6b'],
      patterns: ['lobe', 'blossom'],
      slots: { text: 106, image: 9, pattern: 4 },
      downloads: {
        html: '/downloads/solstice-html.zip',
        react: '/downloads/solstice-react.zip',
      },
    },
    {
      slug: 'verdant',
      name: 'Verdant',
      href: '/template/verdant/',
      spec: '/editable/verdant.json',
      palette: ['#f4faf0', '#2d6a4f'],
      patterns: ['frond'],
      slots: { text: 80, image: 10, pattern: 2 },
      downloads: {
        html: '/downloads/verdant-html.zip',
        react: '/downloads/verdant-react.zip',
      },
    },
  ],
};

const specs = {
  solstice: {
    specVersion: 1,
    site: { slug: 'solstice', name: 'Solstice' },
    palette: {
      colors: ['#2b1d3a', '#ff6b6b'],
      derivation: 'templateSite',
      flatSections: true,
    },
    slots: [
      {
        id: 'hero.title',
        kind: 'text',
        value: 'Come back to {em}yourself{/em}.',
        format: 'emphasis',
      },
    ],
  },
};

const requested = [];

const context = {
  catalog,
  fetchPreview: async () => ({ data: 'ZmFrZQ==', mimeType: 'image/webp' }),
  fetchDocs: async () => 'THE REFERENCE',
  fetchTemplateCatalog: async () => templateCatalog,
  fetchTemplate: async (slug) => {
    requested.push(slug);

    if (!(slug in specs)) throw new Error(`${slug} returned 404`);

    return specs[slug];
  },
};

const toolset = createToolset(catalogTools(context));

const parse = (result) => JSON.parse(result.content[0].text);
const call = (name, args = {}) => toolset.call(name, args);

test('the template tools are advertised when their data is resolvable', () => {
  assert.deepEqual(
    toolset.list().map((tool) => tool.name),
    [
      'search_designs',
      'get_design',
      'preview_design',
      'get_docs',
      'list_templates',
      'get_template',
    ]
  );
});

test('a host that cannot resolve templates does not advertise them', () => {
  // A listed tool that always fails is worse than a missing one - the same
  // rule the preview and docs tools already follow.
  const bare = createToolset(catalogTools({ catalog }));

  assert.deepEqual(
    bare.list().map((tool) => tool.name),
    ['search_designs', 'get_design']
  );

  // The index alone is not enough for get_template, which needs both.
  const indexOnly = createToolset(
    catalogTools({ catalog, fetchTemplateCatalog: async () => templateCatalog })
  );

  assert.deepEqual(
    indexOnly.list().map((tool) => tool.name),
    ['search_designs', 'get_design', 'list_templates']
  );
});

test('list_templates returns every annotated site with its editable counts', async () => {
  const result = parse(await call('list_templates'));

  assert.equal(result.matched, 2);
  assert.equal(result.total, 2);
  assert.deepEqual(
    result.templates.map((entry) => entry.slug),
    ['solstice', 'verdant']
  );
  assert.deepEqual(result.templates[0].editable, {
    text: 106,
    image: 9,
    pattern: 4,
  });
  assert.equal(result.templates[0].url, 'https://tabbied.com/template/solstice/');
});

test('list_templates filters on slug or name', async () => {
  const byName = parse(await call('list_templates', { query: 'Verd' }));

  assert.equal(byName.matched, 1);
  assert.equal(byName.templates[0].slug, 'verdant');
});

test('a query that matches nothing lists what there is instead of an empty set', async () => {
  const result = parse(await call('list_templates', { query: 'zzz' }));

  assert.equal(result.matched, 0);
  assert.deepEqual(result.slugs, ['solstice', 'verdant']);
});

test('get_template returns the spec, the downloads, and how to use them', async () => {
  const result = parse(await call('get_template', { slug: 'solstice' }));

  assert.equal(result.site.slug, 'solstice');
  assert.equal(result.palette.derivation, 'templateSite');
  assert.equal(result.slots[0].id, 'hero.title');
  assert.equal(
    result.downloads.html,
    'https://tabbied.com/downloads/solstice-html.zip'
  );
  // The usage notes are the part an agent most reliably gets wrong, so they
  // carry the resolved URL rather than a placeholder.
  assert.match(result.usage.html, /downloads\/solstice-html\.zip/);
  assert.match(result.usage.colors, /data-edit-root/);
  assert.match(result.usage.text, /\{em\}/);
});

test('an unknown slug comes back as a correction, not a dead end', async () => {
  const result = await call('get_template', { slug: 'solstis' });

  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /Did you mean: solstice\?/);
});

test('a slug the index knows but whose spec cannot be read is a tool error', async () => {
  // The index and the specs are separate assets, so they can disagree if a
  // deploy is half-written; that must surface, not throw.
  const result = await call('get_template', { slug: 'verdant' });

  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /Could not load the spec for "verdant"/);
  assert.ok(requested.includes('verdant'));
});

test('get_template requires a slug', async () => {
  const result = await call('get_template', {});

  assert.equal(result.isError, true);
});
