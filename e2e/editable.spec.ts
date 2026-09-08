// Editing a packaged template: does an edits document actually change the page?
//
// The unit tests in packages/tabbied-templates cover every decision the engine
// makes, with no DOM. What they cannot cover is the half that only exists in a
// browser - that the annotations survived the export and the packager, that the
// slot ids still find their elements, and that a re-colour reaches both the
// stylesheet's custom properties and the pattern fields.
//
// So this runs the real engine against the real packaged download, which is
// the artefact a stranger gets. Requires `npm run build` (or `next build` plus
// `npm run editable` and `npm run templates`); skips loudly rather than failing
// when those haven't run, matching e2e/templates.spec.ts.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.join(__dirname, '..');
const SLUG = 'solstice';
const TEMPLATE_DIR = path.join(REPO_ROOT, 'out', 'downloads', SLUG);
const ENGINE_DIR = path.join(
  REPO_ROOT,
  'packages',
  'tabbied-templates',
  'dist'
);
const ENGINE = path.join(ENGINE_DIR, 'index.js');

// The engine is real ESM with relative imports between its modules, so it has
// to be *served* rather than injected as a blob - a blob module has no base URL
// to resolve `./spec.js` against. Routing a fake origin at the built dist is
// the same move e2e/templates.spec.ts makes for esm.sh, and it means the test
// exercises the files about to ship.
const ENGINE_ORIGIN = 'https://engine.test';

const serveEngine = async (page: import('@playwright/test').Page) => {
  await page.route(`${ENGINE_ORIGIN}/**`, (route) => {
    const file = path.join(ENGINE_DIR, path.basename(new URL(route.request().url()).pathname));

    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });

    return route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: fs.readFileSync(file, 'utf8'),
    });
  });
};
// The generator writes into public/ (so the second `next build` exports it),
// and the export copy is what a deployment serves.
const SPEC_CANDIDATES = [
  path.join(REPO_ROOT, 'out', 'editable', `${SLUG}.json`),
  path.join(REPO_ROOT, 'public', 'editable', `${SLUG}.json`),
];

const specPath = SPEC_CANDIDATES.find((candidate) => fs.existsSync(candidate));

test.describe('editable templates', () => {
  test.skip(
    !specPath || !fs.existsSync(ENGINE) || !fs.existsSync(TEMPLATE_DIR),
    'run `npm run build` first - needs the spec, the built engine, and the packaged template'
  );

  const spec = JSON.parse(fs.readFileSync(specPath as string, 'utf8'));

  // Every kind of edit at once, because they interact: a palette change also
  // moves the pattern fields that follow it, and the engine has to reach both.
  const edits = {
    specVersion: spec.specVersion,
    slug: SLUG,
    edits: {
      text: {
        'brand.name': 'Northline',
        'hero.title': 'Rooms that {em}hold the quiet{/em}.',
        'hero.lede': 'A short, plain lede.',
      },
      palette: ['#0B2545', '#EEF4ED', '#13A8A8', '#8DA9C4', '#FF7B00'],
      patterns: { 'band.field': { seed: 'e2e-band' } },
    },
  };

  test('an edits document rewrites text, palette, and pattern fields', async ({
    page,
  }) => {
    // The trailing slash matters: `serve` rewrites <dir>/index.html to an
    // extensionless <dir>, and every relative asset then resolves a level too
    // high - the trap e2e/templates.spec.ts documents.
    await serveEngine(page);
    await page.goto(`/downloads/${SLUG}/`);

    const before = await page.evaluate(() => ({
      brands: document.querySelectorAll('[data-edit="brand.name"]').length,
      title: document
        .querySelector('[data-edit="hero.title"]')
        ?.textContent?.trim(),
      bg: document
        .querySelector('[data-edit-root]')
        ?.getAttribute('style'),
    }));

    // The brand name is one slot on several elements - masthead and footer -
    // which is the case that makes "apply to every match" load-bearing.
    expect(before.brands).toBeGreaterThan(1);

    const result = await page.evaluate(
      async ([engineUrl, specJson, editsJson]) => {
        const module = await import(/* webpackIgnore: true */ engineUrl);

        return module.applyEdits(
          document,
          JSON.parse(specJson),
          JSON.parse(editsJson)
        );
      },
      [`${ENGINE_ORIGIN}/index.js`, JSON.stringify(spec), JSON.stringify(edits)]
    );

    expect(result.problems).toEqual([]);
    expect(result.applied).toBeGreaterThan(0);

    // Text: every element carrying the id moved, not just the first.
    const brands = await page
      .locator('[data-edit="brand.name"]')
      .allTextContents();
    expect(brands.length).toBe(before.brands);
    for (const brand of brands) expect(brand.trim()).toBe('Northline');

    // The accent survives as a real <em>, keeping the class the packaged
    // stylesheet actually styles (de-hashed to `em` by the packager, where the
    // export still has the hashed name - which is why it is read off the DOM).
    const heading = page.locator('[data-edit="hero.title"]');
    await expect(heading).toHaveText('Rooms that hold the quiet.');
    const em = heading.locator('em');
    await expect(em).toHaveText('hold the quiet');
    expect(await em.getAttribute('class')).toBe('em');

    // Palette: the brand roles and the variables derived from them.
    const style = await page
      .locator('[data-edit-root]')
      .getAttribute('style');
    expect(style).toContain('#0B2545');
    expect(style).not.toBe(before.bg);
    const ink = await page.evaluate(() =>
      getComputedStyle(
        document.querySelector('[data-edit-root]') as HTMLElement
      ).getPropertyValue('--ink')
    );
    expect(ink.trim()).not.toBe('');

    // Pattern fields that follow the brand palette were re-coloured, and the
    // literal `transparent` in colour0 of an overlay field was not touched -
    // that is what keeps a field readable over a photograph.
    const palettes = await page
      .locator('[data-edit-pattern] [data-pattern]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('data-palette') ?? '')
      );
    expect(palettes.length).toBeGreaterThan(0);
    for (const palette of palettes) expect(palette).toContain('#EEF4ED');

    const seed = await page
      .locator('[data-edit-pattern="band.field"] [data-pattern]')
      .getAttribute('data-seed');
    expect(seed).toBe('e2e-band');
  });

  test('the engine reports a stale slot instead of failing silently', async ({
    page,
  }) => {
    await serveEngine(page);
    await page.goto(`/downloads/${SLUG}/`);

    const problems = await page.evaluate(
      async ([engineUrl, specJson]) => {
        const module = await import(/* webpackIgnore: true */ engineUrl);
        const spec = JSON.parse(specJson);

        return module.applyEdits(document, spec, {
          specVersion: spec.specVersion,
          slug: 'solstice',
          edits: { text: { 'hero.nonexistent': 'x' } },
        }).problems;
      },
      [`${ENGINE_ORIGIN}/index.js`, JSON.stringify(spec)]
    );

    expect(problems).toHaveLength(1);
    expect(problems[0].level).toBe('error');
  });
});

// The other palette derivation. The 52 bespoke pages each own their custom
// property names (`--navy`, `--bone`, ...) rather than the shared component's,
// and their annotations were added by a codemod rather than by hand - so the
// thing worth proving here is that a re-colour reaches a page whose stylesheet
// never heard of `--brand-0`, and that the codemod's generated slot ids
// actually find their elements.
test.describe('editable templates (bespoke page)', () => {
  const BESPOKE = 'beaufort';
  const bespokeDir = path.join(REPO_ROOT, 'out', 'downloads', BESPOKE);
  const bespokeSpecPath = [
    path.join(REPO_ROOT, 'out', 'editable', `${BESPOKE}.json`),
    path.join(REPO_ROOT, 'public', 'editable', `${BESPOKE}.json`),
  ].find((candidate) => fs.existsSync(candidate));

  test.skip(
    !bespokeSpecPath || !fs.existsSync(ENGINE) || !fs.existsSync(bespokeDir),
    'run `npm run build` first'
  );

  test('a vars-derivation page re-colours through its own property names', async ({
    page,
  }) => {
    const spec = JSON.parse(fs.readFileSync(bespokeSpecPath as string, 'utf8'));

    expect(spec.palette.derivation).toBe('vars');
    expect(spec.palette.varNames.length).toBeGreaterThan(1);

    await serveEngine(page);
    await page.goto(`/downloads/${BESPOKE}/`);

    const colors = ['#0B2545', '#EEF4ED', '#13A8A8', '#8DA9C4', '#FF7B00'];
    const result = await page.evaluate(
      async ([engineUrl, specJson, colorsJson]) => {
        const module = await import(/* webpackIgnore: true */ engineUrl);
        const parsed = JSON.parse(specJson);

        return module.applyEdits(document, parsed, {
          specVersion: parsed.specVersion,
          slug: parsed.site.slug,
          edits: {
            palette: JSON.parse(colorsJson),
            text: { 'bar.mark': 'Northline Sail Co.' },
          },
        });
      },
      [
        `${ENGINE_ORIGIN}/index.js`,
        JSON.stringify(spec),
        JSON.stringify(colors),
      ]
    );

    expect(result.problems).toEqual([]);

    // The page's own property, not --brand-0, and it actually resolves: the
    // stylesheet's authored default sits in a class rule, so the inline
    // property has to win for a re-colour to be visible at all.
    const ground = await page.evaluate((name) => {
      const root = document.querySelector('[data-edit-root]') as HTMLElement;
      return {
        inline: root.style.getPropertyValue(`--${name}`),
        computed: getComputedStyle(root).getPropertyValue(`--${name}`),
      };
    }, spec.palette.varNames[0]);

    expect(ground.inline.trim()).toBe('#0B2545');
    expect(ground.computed.trim()).toBe('#0B2545');

    await expect(page.locator('[data-edit="bar.mark"]')).toHaveText(
      'Northline Sail Co.'
    );

    // Every field that follows the brand palette moved, and the literal
    // `transparent` in colour 0 survived - these pages draw their patterns on
    // the page ground, so filling that slot would black out the section.
    const palettes = await page
      .locator('[data-edit-pattern] [data-pattern]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('data-palette') ?? '')
      );

    expect(palettes.length).toBeGreaterThan(4);
    for (const palette of palettes) {
      expect(palette.startsWith('transparent')).toBe(true);
      expect(palette).toMatch(/#(0B2545|EEF4ED|13A8A8|8DA9C4|FF7B00)/);
    }
  });
});
