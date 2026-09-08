// The packaged HTML templates: does a zip somebody downloads actually work?
//
// This is the test that keeps `scripts/package-templates.mjs` honest. The
// templates are derived from the static export, so a change to a template page
// silently reshapes them - a smoke test that opens the generated template and
// asserts its patterns came up is what catches a template that stopped working
// because a page changed.
//
// Requires `npm run build && node scripts/package-templates.mjs` to have run;
// the suite skips (loudly) rather than failing when the templates aren't there,
// so the rest of the e2e run isn't blocked by a missing optional build step.
import { test, expect } from '@playwright/test';
import { unzipSync } from 'fflate';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.join(__dirname, '..');
const PACKAGE_DIR = path.join(REPO_ROOT, 'packages', 'tabbied');
const dirFor = (slug: string) =>
  path.join(REPO_ROOT, 'out', 'downloads', slug);

// Two sites, because the packager has two stylesheet paths and they fail
// differently. werkraum has its own authored `<slug>.module.css`, which ships
// verbatim. solstice is one of the five built on the shared TemplateSite
// component: it has no per-page sheet, so the component's is shipped trimmed
// to the rules the page can actually match - a transform with real room to be
// silently wrong, which is why it is covered here too.
// hopscotch-museum is the third path: its authored sheet uses `composes:`,
// which CSS Modules resolves in the markup rather than the stylesheet. The
// packager drops the (inert, non-CSS) declaration after checking the build
// really did put both classes on the element.
const FIXTURES = [
  { slug: 'werkraum', shared: false, patterns: 8, hero: 'werkraum-hero.webp' },
  { slug: 'solstice', shared: true, patterns: 4, hero: null },
  { slug: 'hopscotch-museum', shared: false, patterns: 8, hero: null },
] as const;

// The template pins its bootstrap to the published package on esm.sh. Serving
// this branch's built dist in its place keeps the test deterministic and
// offline - and means it exercises the code about to ship rather than the
// version that happens to be on the CDN.
const distFileFor = (url: string): string | null => {
  const pathname = new URL(url).pathname;

  if (/^\/tabbied@[^/]+\/patterns$/.test(pathname)) {
    return path.join(PACKAGE_DIR, 'dist', 'patterns.generated.js');
  }
  if (/^\/tabbied@[^/]+$/.test(pathname)) {
    return path.join(PACKAGE_DIR, 'dist', 'core', 'index.js');
  }
  // Relative imports inside the served modules resolve against esm.sh's root
  // (the base URL is /tabbied@x), so they arrive here as bare filenames.
  const file = path.join(PACKAGE_DIR, 'dist', 'core', path.basename(pathname));

  return fs.existsSync(file) ? file : null;
};

for (const fixture of FIXTURES) {
  const TEMPLATE_DIR = dirFor(fixture.slug);

  test.describe(`packaged HTML template (${fixture.slug})`, () => {
  test.skip(
    !fs.existsSync(path.join(TEMPLATE_DIR, 'index.html')),
    `run \`node scripts/package-templates.mjs ${fixture.slug}\` first`
  );

  test('opens standalone and brings its patterns up', async ({ page }) => {
    const cssDoodle = fs.readFileSync(
      path.join(REPO_ROOT, 'node_modules', 'css-doodle', 'css-doodle.min.js'),
      'utf-8'
    );

    await page.route('https://esm.sh/**', async (route) => {
      const url = route.request().url();

      // register.js imports 'css-doodle' as a bare specifier, which a browser
      // can't resolve on its own - serve it from the same origin.
      if (url.endsWith('/css-doodle')) {
        return route.fulfill({
          status: 200,
          body: cssDoodle,
          headers: { 'content-type': 'application/javascript' },
        });
      }

      const file = distFileFor(url);

      if (!file) return route.fulfill({ status: 404, body: '' });

      return route.fulfill({
        status: 200,
        body: fs
          .readFileSync(file, 'utf-8')
          // Only the import specifier - the same string appears as a tag name
          // in document.createElement('css-doodle'), which must not be touched.
          .replace(
            /\b(import|from)\s+(['"])css-doodle\2/g,
            '$1 "https://esm.sh/css-doodle"'
          ),
        headers: { 'content-type': 'application/javascript' },
      });
    });

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // The directory form, with the trailing slash, on purpose. `serve`
    // rewrites `<dir>/index.html` to an extensionless `<dir>` - no trailing
    // slash - and every relative asset in the template then resolves one
    // level too high and 404s. The template is fine (opened from disk, or
    // served by anything that doesn't do that rewrite); the URL is what has
    // to be right here, or this spec silently tests an unstyled page.
    await page.goto(`/downloads/${fixture.slug}/`);

    const hosts = page.locator('[data-pattern]');
    await expect(hosts).toHaveCount(fixture.patterns);

    // Every placeholder gets a live element, and they paint.
    await expect
      .poll(
        () => page.locator('[data-pattern] css-doodle').count(),
        { timeout: 20000 }
      )
      .toBe(fixture.patterns);

    await expect
      .poll(
        () =>
          page.evaluate(() =>
            [...document.querySelectorAll('css-doodle')].reduce(
              (total, element) =>
                total +
                (element.shadowRoot?.querySelectorAll('cssd-cell').length ?? 0),
              0
            )
          ),
        { timeout: 20000 }
      )
      .toBeGreaterThan(100);

    expect(errors).toEqual([]);
  });

  test('carries no build-tool residue', async ({ page }) => {
    const html = fs.readFileSync(
      path.join(TEMPLATE_DIR, 'index.html'),
      'utf-8'
    );

    // Hashed class names, the Next runtime and the RSC payload are exactly
    // what makes an export unusable as a template.
    expect(html).not.toMatch(/-module__[A-Za-z0-9_]+__/);
    expect(html).not.toContain('/_next/');
    expect(html).not.toContain('__next_f');
    expect(html).not.toMatch(/<!--\/?\$[!?]?-->/);
    expect(html).not.toContain('data-precedence');

    // Assets are relative, so the folder works opened from disk.
    expect(html).not.toMatch(/(?:src|href)="\/images\//);
    if (fixture.hero) expect(html).toContain(`./images/${fixture.hero}`);
    expect(html).toContain(`./styles/${fixture.slug}.css`);

    const css = fs.readFileSync(
      path.join(TEMPLATE_DIR, 'styles', `${fixture.slug}.css`),
      'utf-8'
    );

    // Readable, not minified, and free of CSS-modules-only syntax.
    expect(css).toContain('/*');
    expect(css).not.toContain(':global(');
    expect(css).not.toContain('composes:');

    // Every class the markup uses must survive into the stylesheet -
    // this is what the trim could get wrong on a shared sheet.
    const declared = new Set(
      [...css.matchAll(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g)].map((m) => m[1])
    );
    const onPage = new Set<string>();
    for (const attr of html.matchAll(/class="([^"]*)"/g)) {
      for (const name of attr[1].split(/\s+/)) if (name) onPage.add(name);
    }
    // Two sets of class names are hooks rather than styles: lucide's own
    // icon classes, and the `figure`/`figure--cutout` markers the Figure
    // component puts on every image for pages that want to target them.
    // A page that styles neither is not missing anything.
    const HOOKS = new Set(['figure', 'figure--cutout']);
    const orphans = [...onPage].filter(
      (name) =>
        !declared.has(name) && !name.startsWith('lucide') && !HOOKS.has(name)
    );
    expect(orphans, `classes used by the page but absent from its stylesheet`)
      .toEqual([]);

    // Braces balance - the trim walks the sheet by hand, and a comment
    // containing a literal `{` once desynchronised it.
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    expect((withoutComments.match(/\{/g) ?? []).length).toBe(
      (withoutComments.match(/\}/g) ?? []).length
    );

    // Every image the page references was copied in.
    for (const match of html.matchAll(/\.\/images\/([^"']+)/g)) {
      expect(
        fs.existsSync(path.join(TEMPLATE_DIR, 'images', match[1])),
        `${match[1]} should be packaged`
      ).toBe(true);
    }

    await page.goto(`/downloads/${fixture.slug}/`);
  });
  });

  test.describe(`packaged React template (${fixture.slug})`, () => {
  const REACT_DIR = path.join(
    REPO_ROOT,
    'out',
    'downloads',
    `${fixture.slug}-react`
  );
  const EXPORTED_PAGE = path.join(
    REPO_ROOT,
    'out',
    'template',
    fixture.slug,
    'index.html'
  );

  test.skip(
    !fs.existsSync(path.join(REACT_DIR, 'src', 'App.tsx')) ||
      !fs.existsSync(EXPORTED_PAGE),
    `run \`npm run build\` then \`npm run templates ${fixture.slug}\` first`
  );

  // The React package ships the page's *source*, so it asks for its images by
  // the URL it was written with - and unlike the HTML package there is no
  // markup rewrite to point those URLs somewhere else. Flattening the files
  // into one folder therefore breaks any page whose image path is hardcoded
  // rather than read from the manifest (ImageCard's `/images/template/<id>`),
  // and it breaks them quietly: Vite's dev server answers the miss with
  // index.html and a 200, so nothing 404s and the images just render blank.
  //
  // The exported page is the ground truth for what gets requested: it is the
  // same component tree, rendered by Next.
  test('serves every image URL the page requests', () => {
    const exported = fs.readFileSync(EXPORTED_PAGE, 'utf-8');
    const requested = new Set(
      [
        ...exported.matchAll(
          /\/images\/([A-Za-z0-9/_-]+\.(?:webp|png|jpg|jpeg|svg|avif))/g
        ),
      ].map((match) => match[1])
    );

    expect(requested.size, 'fixture should exercise the image path')
      .toBeGreaterThan(0);

    const missing = [...requested].filter(
      (relativePath) =>
        !fs.existsSync(path.join(REACT_DIR, 'public', 'images', relativePath))
    );

    expect(missing, 'images the page asks for but the package does not serve')
      .toEqual([]);
  });

  // Figure builds its `src` from the manifest rather than from a literal, so
  // the trimmed manifest is a second way to point at a file that isn't there.
  test('the trimmed image manifest points at files that exist', () => {
    const manifestFile = path.join(REACT_DIR, 'src', 'images.ts');

    test.skip(
      !fs.existsSync(manifestFile),
      'site does not use Figure, so it ships no manifest'
    );

    const manifest: Record<string, { base?: string }> = JSON.parse(
      fs
        .readFileSync(manifestFile, 'utf-8')
        .replace(/^[\s\S]*?export default /, '')
        .replace(/\s*as Record<[\s\S]*$/, '')
        .trim()
    );

    expect(Object.keys(manifest).length).toBeGreaterThan(0);

    const unreachable = Object.entries(manifest)
      .map(([id, entry]) => `${entry.base ?? '/images/sites'}/${id}.webp`)
      .filter((url) => !fs.existsSync(path.join(REACT_DIR, 'public', url)));

    expect(unreachable, 'manifest entries with no file behind them').toEqual([]);
  });
  });
}

test.describe('the /templates gallery offers both formats', () => {
  test.skip(
    !fs.existsSync(path.join(REPO_ROOT, 'out', 'downloads', 'werkraum-html.zip')),
    'run `node scripts/package-templates.mjs` first'
  );

  test('every card links to an HTML and a React zip that exist', async ({
    page,
  }) => {
    await page.goto('/templates/');

    const html = page.getByRole('link', { name: 'HTML', exact: true });
    const react = page.getByRole('link', { name: 'React', exact: true });

    const count = await html.count();
    expect(count).toBeGreaterThan(50);
    await expect(react).toHaveCount(count);

    // Every href must resolve to a file the packager actually wrote - a card
    // for a site the packager skipped would otherwise be a dead button.
    for (const link of [...(await html.all()), ...(await react.all())]) {
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^\/downloads\/[a-z0-9-]+-(html|react)\.zip$/);
      expect(
        fs.existsSync(path.join(REPO_ROOT, 'out', href!.replace(/^\//, ''))),
        `${href} should exist`
      ).toBe(true);
    }
  });

  test('clicking a button downloads a real zip', async ({ page }) => {
    await page.goto('/templates/');

    for (const label of ['HTML', 'React']) {
      const link = page.getByRole('link', { name: label, exact: true }).first();
      const download = page.waitForEvent('download');
      await link.click();
      const file = await download;
      expect(file.suggestedFilename()).toMatch(
        new RegExp(`-${label.toLowerCase()}\\.zip$`)
      );
      const bytes = fs.readFileSync(await file.path());
      expect(bytes.byteLength).toBeGreaterThan(2000);

      // Actually parse it. A size check alone passes on a corrupt archive, and
      // the packager writes these itself now (fflate, not the `zip` binary -
      // Cloudflare's build image has no `zip`), so nothing else would notice a
      // malformed one: the deploy would happily serve 114 unopenable
      // downloads. unzipSync throws on a bad central directory, and CRCs are
      // checked per entry on inflate.
      const entries = unzipSync(bytes);
      const names = Object.keys(entries);
      expect(names.length).toBeGreaterThan(3);
      // Every entry sits under the one top-level folder the archive expands
      // into, rather than scattering into the download directory.
      const roots = new Set(names.map((name) => name.split('/')[0]));
      expect(roots.size).toBe(1);
      expect(names).toContain(`${[...roots][0]}/index.html`);
    }
  });

  test('the React package is a runnable Vite app', async () => {
    const dir = path.join(REPO_ROOT, 'out', 'downloads', 'werkraum-react');

    for (const file of [
      'package.json',
      'vite.config.ts',
      'index.html',
      'src/main.tsx',
      'src/App.tsx',
      'src/werkraum.module.css',
    ]) {
      expect(fs.existsSync(path.join(dir, file)), `${file} missing`).toBe(true);
    }

    const app = fs.readFileSync(path.join(dir, 'src', 'App.tsx'), 'utf-8');
    // The page ships as authored; only the Next-isms and the workspace import
    // paths change. Anything left of either would fail `vite build`.
    expect(app).not.toContain("from 'next'");
    expect(app).not.toMatch(/export const metadata/);
    expect(app).not.toMatch(/from 'components\//);
    expect(app).not.toContain("'lib/generated/images'");
    expect(app).toContain("from 'tabbied/react'");
    expect(app).toContain("from 'tabbied/patterns'");

    // Vite resolves CSS modules itself, so unlike the HTML package the
    // stylesheet ships exactly as authored.
    const authored = fs.readFileSync(
      path.join(REPO_ROOT, 'app/template/werkraum/werkraum.module.css'),
      'utf-8'
    );
    expect(fs.readFileSync(path.join(dir, 'src', 'werkraum.module.css'), 'utf-8'))
      .toBe(authored);

    const pkg = JSON.parse(
      fs.readFileSync(path.join(dir, 'package.json'), 'utf-8')
    );
    expect(pkg.dependencies).toHaveProperty('tabbied');
    expect(pkg.scripts.dev).toBe('vite');
  });
});
