// SVG-export pixel-parity sweep (development tool).
//
// For each pattern, rasterizes doodleToSvg()'s output and diffs it against a
// real screenshot of the live element (deviceScaleFactor 2) - the ground
// truth for what the user sees. The CI-friendly equivalent lives in
// e2e/svg-export.spec.ts; this script is for fast iteration against a dev
// server, with per-pattern results as they complete and failure artifacts
// (out.svg / mine.png / ref.png) for inspection.
//
// Usage:
//   npm run build --workspace tabbied   # the sweep injects dist/
//   npx next dev                        # in another terminal
//   node scripts/svg-parity-sweep.mjs [slug ...]   (no args = all supported)
//
// Env: SVG_SWEEP_BASE_URL (default http://localhost:3000),
//      SVG_SWEEP_CHROMIUM (explicit Chromium executable path, optional),
//      SVG_SWEEP_ARTIFACTS (failure-artifact dir, default a temp dir).
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE_URL = process.env.SVG_SWEEP_BASE_URL || 'http://localhost:3000';
const SCRATCH =
  process.env.SVG_SWEEP_ARTIFACTS ||
  path.join(os.tmpdir(), 'tabbied-svg-parity');
fs.mkdirSync(SCRATCH, { recursive: true });

const compiled = fs.readFileSync(
  'packages/tabbied/dist/core/svgExport.js',
  'utf8'
);
const script =
  compiled.replace(/\bexport\s+(function|class|const)/g, '$1') +
  '\nwindow.__svgx = { doodleToSvg, _internals };';

const allSlugs = fs
  .readdirSync('packages/tabbied/patterns')
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''));

const unsupported = new Set(
  allSlugs.filter((slug) => {
    const def = JSON.parse(
      fs.readFileSync(path.join('packages/tabbied/patterns', `${slug}.json`), 'utf8')
    );
    return def.svgExport === false;
  })
);

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : allSlugs.filter((s) => !unsupported.has(s));

const TOLERANCE = 12; // per-channel
const MAX_BAD_FRACTION = 0.01; // 1% of pixels
// Documented sub-CSS-pixel deviations:
// - fractal/matryoshka/subdivide: css-doodle's live rendering shows hairline
//   seams from rasterizing the nested foreignObject mask; the vector export
//   intentionally renders clean solid tiles instead.
// - drypoint: the browser rasterizes the @svg mask image with slightly
//   different sub-pixel rounding than the inlined symbol (≤1 CSS px).
// - windowpane: mixed-width borders on rounded cells blend their corner
//   arcs progressively in CSS; the per-side arc strokes junction within
//   ≤1 CSS px of it.
// Keep in sync with e2e/svg-export.spec.ts (which documents each entry).
const PER_PATTERN_MAX = {
  fractal: 0.03,
  matryoshka: 0.03,
  subdivide: 0.035,
  drypoint: 0.02,
  windowpane: 0.02,
  glyph: 0.015,
  terrain: 0.02,
  neon: 0.015,
  lantern: 0.015,
  stepramp: 0.02,
};

const browser = await chromium.launch({
  executablePath: process.env.SVG_SWEEP_CHROMIUM || undefined,
});
const page = await browser.newPage({
  viewport: { width: 1400, height: 1000 },
  deviceScaleFactor: 2,
});
page.on('pageerror', (e) => console.log(`  pageerror: ${e.message.split('\n')[0]}`));

const results = [];
for (const slug of slugs) {
  try {
    await page.goto(`${BASE_URL}/patterns/${slug}/?seed=parity01`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForFunction(
      (s) => {
        const el = document.querySelector(`div[data-pattern="${s}"] css-doodle`);
        return el && el.shadowRoot && el.shadowRoot.querySelector('cssd-grid');
      },
      slug,
      { timeout: 30000 }
    );
    await page.waitForTimeout(900); // let first-draw transitions settle

    // Ground truth: what the browser actually painted (2x device pixels).
    // Full-viewport screenshot + fractional crop of the grid's rect keeps
    // exact registration (element screenshots round their clip origin).
    const shot = await page.screenshot();
    const shotUrl = `data:image/png;base64,${shot.toString('base64')}`;
    const gridOffset = await page.evaluate((s) => {
      const el = document.querySelector(`div[data-pattern="${s}"] css-doodle`);
      const grid = el.shadowRoot.querySelector('cssd-grid');
      const gr = grid.getBoundingClientRect();
      // Viewport screenshots share getBoundingClientRect's coordinate space.
      return { dx: gr.left, dy: gr.top, w: gr.width, h: gr.height };
    }, slug);

    await page.addScriptTag({ content: script });

    const r = await page.evaluate(
      async ({ slug, TOLERANCE, shotUrl, gridOffset }) => {
        const el = document.querySelector(`div[data-pattern="${slug}"] css-doodle`);

        let res;
        try {
          res = window.__svgx.doodleToSvg(el);
        } catch (e) {
          return { error: `doodleToSvg: ${e.message}` };
        }

        const scale = 2;
        const W = Math.round(res.width * scale);
        const H = Math.round(res.height * scale);

        const draw = async (src, srcRect) => {
          const img = new Image();
          img.src = src;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = W;
          c.height = H;
          const g = c.getContext('2d');
          g.fillStyle = '#ffffff';
          g.fillRect(0, 0, W, H);
          if (srcRect) {
            g.drawImage(img, srcRect.x, srcRect.y, srcRect.w, srcRect.h, 0, 0, W, H);
          } else {
            g.drawImage(img, 0, 0, W, H);
          }
          return c;
        };

        let mine, ref;
        try {
          const blob = new Blob([res.svg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          mine = await draw(url);
          URL.revokeObjectURL(url);
        } catch (e) {
          return { error: `rasterize svg: ${e.message}` };
        }
        try {
          // Crop the screenshot to the grid's sub-rect so both canvases
          // cover the identical region.
          ref = await draw(shotUrl, {
            x: gridOffset.dx * scale,
            y: gridOffset.dy * scale,
            w: gridOffset.w * scale,
            h: gridOffset.h * scale,
          });
        } catch (e) {
          return { error: `draw screenshot: ${e.message}` };
        }

        const a = mine.getContext('2d').getImageData(0, 0, W, H).data;
        const b = ref.getContext('2d').getImageData(0, 0, W, H).data;
        // CSS painters snap edges to device pixels; SVG anti-aliases true
        // fractional geometry. A differing pixel is an edge artifact (not a
        // defect) when each image's neighborhood in the other image contains
        // a matching color. Radius 2 device px = 1 CSS px.
        // A differing pixel is an anti-aliasing artifact when its color lies
        // channel-wise between the other image's neighborhood extremes (an
        // AA blend of two adjacent colors need not literally appear in the
        // snapped rendering).
        const nearMatch = (data, i, other, x, y) => {
          let lo0 = 255, lo1 = 255, lo2 = 255;
          let hi0 = 0, hi1 = 0, hi2 = 0;
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
              const j = (ny * W + nx) * 4;
              if (other[j] < lo0) lo0 = other[j];
              if (other[j] > hi0) hi0 = other[j];
              if (other[j + 1] < lo1) lo1 = other[j + 1];
              if (other[j + 1] > hi1) hi1 = other[j + 1];
              if (other[j + 2] < lo2) lo2 = other[j + 2];
              if (other[j + 2] > hi2) hi2 = other[j + 2];
            }
          }
          return (
            data[i] >= lo0 - TOLERANCE && data[i] <= hi0 + TOLERANCE &&
            data[i + 1] >= lo1 - TOLERANCE && data[i + 1] <= hi1 + TOLERANCE &&
            data[i + 2] >= lo2 - TOLERANCE && data[i + 2] <= hi2 + TOLERANCE
          );
        };
        let bad = 0;
        let maxDelta = 0;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            const d = Math.max(
              Math.abs(a[i] - b[i]),
              Math.abs(a[i + 1] - b[i + 1]),
              Math.abs(a[i + 2] - b[i + 2])
            );
            if (d > maxDelta) maxDelta = d;
            if (d <= TOLERANCE) continue;
            if (nearMatch(a, i, b, x, y) && nearMatch(b, i, a, x, y)) continue;
            bad++;
          }
        }
        const total = a.length / 4;
        return {
          width: res.width,
          height: res.height,
          warnings: res.warnings,
          bad,
          total,
          maxDelta,
          badFraction: bad / total,
          svg: res.svg,
          minePng: mine.toDataURL('image/png'),
          refPng: ref.toDataURL('image/png'),
        };
      },
      { slug, TOLERANCE, shotUrl, gridOffset }
    );

    if (r.error) {
      results.push({ slug, status: 'ERROR', detail: r.error });
      console.log(`ERROR ${slug}: ${r.error}`);
      continue;
    }
    const pass = r.badFraction <= (PER_PATTERN_MAX[slug] ?? MAX_BAD_FRACTION);
    results.push({
      slug,
      status: pass ? 'pass' : 'FAIL',
      badPct: (r.badFraction * 100).toFixed(3),
      maxDelta: r.maxDelta,
      warnings: r.warnings,
    });
    console.log(
      `${pass ? 'pass' : 'FAIL'} ${slug}  bad=${(r.badFraction * 100).toFixed(3)}% maxΔ=${r.maxDelta}` +
        (r.warnings.length ? `  [${r.warnings.join('; ')}]` : '')
    );
    if (!pass) {
      const dir = path.join(SCRATCH, slug);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'out.svg'), r.svg);
      fs.writeFileSync(
        path.join(dir, 'mine.png'),
        Buffer.from(r.minePng.split(',')[1], 'base64')
      );
      fs.writeFileSync(
        path.join(dir, 'ref.png'),
        Buffer.from(r.refPng.split(',')[1], 'base64')
      );
    }
  } catch (e) {
    results.push({ slug, status: 'ERROR', detail: e.message.split('\n')[0] });
    console.log(`ERROR ${slug}: ${e.message.split('\n')[0]}`);
  }
}

const fails = results.filter((r) => r.status !== 'pass');
console.log(
  `\n${results.length - fails.length}/${results.length} passed; failures: ${fails.map((f) => f.slug).join(', ') || 'none'}`
);
// Scripted callers must see failures as failures, like the other gates do.
if (fails.length > 0) process.exitCode = 1;
await browser.close();
