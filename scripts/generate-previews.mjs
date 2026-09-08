#!/usr/bin/env node
// Renders one stable preview image per design into public/previews/<slug>.webp.
//
// The previews are the catalog's visual index for tools that can't run
// css-doodle - multimodal agents choosing a design, OG cards, anything that
// wants to *see* a pattern without mounting it. Every catalog entry points at
// its preview URL (codegen adds it), so the contract is: a design ships with
// a preview or the build fails (scripts/check-previews.mjs, on prebuild).
//
// The images are committed, not built on deploy: rendering needs a headless
// browser the deploy build doesn't have, and a stable URL should not re-render
// (and subtly shift) on every deploy anyway. Regenerate when patterns change:
//
//   npm run previews            # all designs + prune orphans
//   npm run previews <slug>...  # just those designs
//
// Spec: authored palette, default options, fixed seed, default (grid) fit in
// a square box - the same thing a consumer gets by default when they embed
// the design, not the hand-tuned gallery-thumbnail look.
import { createServer } from 'node:http';
import {
  readFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
  unlinkSync,
} from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PATTERNS_DIR = join(ROOT, 'packages/tabbied/patterns');
const OUT_DIR = join(ROOT, 'public/previews');

const SIZE = 480; // square CSS px; captured @2x - see SCALE
// @1x the finest stipple designs (dustfall, ninon: sub-pixel mask dots)
// disappear entirely, and a preview that renders blank is worse than none.
const SCALE = 2;
const SEED = 'preview1'; // fixed so a re-render is comparable
const WEBP_QUALITY = 75;

const MIME = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.html': 'text/html',
};

const serveRepo = () =>
  new Promise((res) => {
    const server = createServer((req, out) => {
      const file = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!file.startsWith(ROOT) || !existsSync(file)) {
        out.writeHead(404).end();
        return;
      }
      out.writeHead(200, {
        'Content-Type': MIME[extname(file)] || 'application/octet-stream',
      });
      out.end(readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () =>
      res({ server, port: server.address().port })
    );
  });

const allSlugs = readdirSync(PATTERNS_DIR)
  .filter((file) => file.endsWith('.json'))
  .map((file) => file.replace(/\.json$/, ''))
  .sort();

const requested = process.argv.slice(2);
for (const slug of requested) {
  if (!allSlugs.includes(slug)) {
    console.error(`generate-previews: unknown design "${slug}"`);
    process.exit(1);
  }
}
const slugs = requested.length ? requested : allSlugs;

const { server, port } = await serveRepo();
const browser = await chromium.launch({
  executablePath: process.env.MOCKUP_CHROMIUM || '/opt/pw-browsers/chromium',
});

try {
  const page = await browser.newPage({
    viewport: { width: SIZE, height: SIZE },
    deviceScaleFactor: SCALE,
  });
  page.on('pageerror', (e) =>
    console.error(`  pageerror: ${e.message.split('\n')[0]}`)
  );
  await page.goto(`http://127.0.0.1:${port}/scripts/render-pattern.html`);
  mkdirSync(OUT_DIR, { recursive: true });

  let done = 0;
  for (const slug of slugs) {
    const definition = JSON.parse(
      readFileSync(join(PATTERNS_DIR, `${slug}.json`), 'utf8')
    );

    await page.evaluate(
      async ([def, o]) => window.__render(def, o),
      [definition, { seed: SEED, fit: 'grid', width: SIZE, height: SIZE }]
    );
    // Let the authored ~400ms first-arrangement transition finish.
    await page.waitForTimeout(600);

    const png = await page.locator('#stage').screenshot();
    await sharp(png)
      .webp({ quality: WEBP_QUALITY })
      .toFile(join(OUT_DIR, `${slug}.webp`));

    done += 1;
    if (done % 25 === 0 || done === slugs.length) {
      console.log(`generate-previews: ${done}/${slugs.length}`);
    }
  }

  // A full run owns the folder: a retired design's preview must not linger
  // at a live URL (mirrors the template packager's prune).
  if (!requested.length) {
    for (const file of readdirSync(OUT_DIR)) {
      const slug = file.replace(/\.webp$/, '');
      if (file.endsWith('.webp') && !allSlugs.includes(slug)) {
        unlinkSync(join(OUT_DIR, file));
        console.log(`generate-previews: pruned orphan ${file}`);
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

console.log(
  `generate-previews: wrote ${slugs.length} preview(s) to public/previews/`
);
