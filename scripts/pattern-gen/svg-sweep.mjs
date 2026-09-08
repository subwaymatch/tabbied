// The SVG-export gate, shared by the batches that promise a clean export
// (11 and 12). Their defining constraint is that every design exports as
// native SVG with *no* caveat: no `svgExport: false`, no `svgExportNote`, no
// converter warning.
//
// For each pattern it renders the design in headless Chromium, runs the
// shipped converter (packages/tabbied/dist/core/svgExport.js, injected as a
// classic script the way e2e/svg-export.spec.ts does), and requires:
//
//   1. doodleToSvg() does not throw (no SvgExportUnsupportedError);
//   2. result.warnings is empty - a warning is exactly the signal that the
//      design would need an svgExportNote (blur, box-shadow, blend mode);
//   3. the rasterized SVG matches a screenshot of the live element within the
//      budget below, using the same anti-aliasing-tolerant diff as
//      e2e/svg-export.spec.ts and scripts/svg-parity-sweep.mjs.
//
// Unlike scripts/svg-parity-sweep.mjs this needs no dev server and no pattern
// route: it renders a page of doodles directly from the JSON definitions, so
// 400 designs sweep in minutes. Designs are checked at a wide-open frequency
// gate (every cell paints) across two seeds, so the @pick() branches a design
// can take are all exercised rather than whichever ones one seed happened to
// roll.
//
// Env read here: SLUGS (comma-separated slugs; defaults to the whole batch),
//                CHROMIUM_PATH, SVG_SEEDS (comma-separated, default two),
//                SVG_GRID (grid override, e.g. 6x9 - the editor default),
//                SVG_CELL (px box per design, default 300),
//                SVG_ARTIFACTS (dir for out.svg / mine.png / ref.png).
import { chromium } from '@playwright/test';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PATTERNS_DIR = path.join(ROOT, 'packages/tabbied/patterns');

// The tolerance matches e2e/svg-export.spec.ts, but the budget is deliberately
// tighter than the shipped 1%: these batches get no per-pattern headroom, and
// a design that needs more than a rounding edge's worth of slack has an
// abutment problem to fix rather than a threshold to raise. In practice these
// designs land between 0.00% and 0.10%; anything near 1% is a clip-path edge
// butted against a plain box edge, which CSS pixel-snaps and SVG does not.
const TOLERANCE = 12;
const MAX_BAD_FRACTION = 0.004;

const ALL_CELLS = 9999; // gate wide open: every cell paints
// SVG_CELL widens the box each design is drawn in, which is how a design gets
// checked at something like the editor's own cell size rather than a
// thumbnail's. Fewer fit on a page, so the sweep drops to one column/row pair
// once the box is large.
const CELL = Number(process.env.SVG_CELL) || 300;
const COLS = CELL > 500 ? 1 : 4;
const ROWS = CELL > 500 ? 1 : 3;
const GAP = 16;
const PAD = 16;
const PER_PAGE = COLS * ROWS;

// Mirrors buildDoodleSource() in packages/tabbied/src/core/doodleSource.ts.
function buildSource(pattern, { optionOverrides = {} } = {}) {
  let style = pattern.code.style;
  let doodle = pattern.code.doodle;
  for (const option of pattern.options) {
    const raw = optionOverrides[option.id] ?? option.default;
    const value =
      option.type === 'ToggleSwitch' ? (raw ? (option.code ?? '') : '') : String(raw);
    style = style.split(option.replace).join(value);
    doodle = doodle.split(option.replace).join(value);
  }
  for (const [token, value] of [
    ['${width}', `${CELL}px`],
    ['${height}', `${CELL}px`],
  ]) {
    style = style.split(token).join(value);
    doodle = doodle.split(token).join(value);
  }
  const colors = pattern.palette
    .map((color, idx) => `--color${idx}: ${color};`)
    .join(' ');
  return { style: colors + ' ' + style, doodle };
}

function buildPage(blocks, seed, cssDoodle) {
  return `<!DOCTYPE html><html><head><style>
    html, body { margin: 0; background: #ffffff; }
    body { display: grid; grid-template-columns: repeat(${COLS}, ${CELL}px); gap: ${GAP}px; padding: ${PAD}px; }
    css-doodle { display: block; }
    ${blocks.map((b) => `css-doodle[data-slug="${b.slug}"] { ${b.style} }`).join('\n')}
  </style></head><body>
    ${blocks
      .map(
        (b) =>
          `<css-doodle data-slug="${b.slug}" data-seed="${seed}" use="var(--rule)">${b.doodle}</css-doodle>`
      )
      .join('\n')}
  <script>${cssDoodle}</script></body></html>`;
}

// Runs in the page: convert one doodle, rasterize both images, diff them.
// Byte-for-byte the comparison used by e2e/svg-export.spec.ts.
const compare = async ({ slug, shotUrl, tolerance, keepImages }) => {
  const el = document.querySelector(`css-doodle[data-slug="${slug}"]`);
  if (!el) return { slug, error: 'element missing' };

  let res;
  try {
    res = window.__svgx.doodleToSvg(el);
  } catch (e) {
    return { slug, error: `doodleToSvg: ${e.message}` };
  }
  if (res.warnings.length) {
    return { slug, error: `warnings: ${res.warnings.join(' | ')}`, svg: res.svg };
  }

  const grid = el.shadowRoot.querySelector('cssd-grid').getBoundingClientRect();
  const scale = 2;
  const W = Math.round(res.width * scale);
  const H = Math.round(res.height * scale);

  const draw = async (src, srcRect) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const g = canvas.getContext('2d');
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, W, H);
    if (srcRect) {
      g.drawImage(img, srcRect.x, srcRect.y, srcRect.w, srcRect.h, 0, 0, W, H);
    } else {
      g.drawImage(img, 0, 0, W, H);
    }
    return canvas;
  };

  let mine, ref;
  try {
    const url = URL.createObjectURL(new Blob([res.svg], { type: 'image/svg+xml' }));
    mine = await draw(url);
    URL.revokeObjectURL(url);
  } catch (e) {
    return { slug, error: `rasterize svg: ${e.message}`, svg: res.svg };
  }
  try {
    ref = await draw(shotUrl, {
      x: grid.left * scale,
      y: grid.top * scale,
      w: grid.width * scale,
      h: grid.height * scale,
    });
  } catch (e) {
    return { slug, error: `draw screenshot: ${e.message}`, svg: res.svg };
  }

  const a = mine.getContext('2d').getImageData(0, 0, W, H).data;
  const b = ref.getContext('2d').getImageData(0, 0, W, H).data;
  const within = (data, i, other, x, y) => {
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
      data[i] >= lo0 - tolerance && data[i] <= hi0 + tolerance &&
      data[i + 1] >= lo1 - tolerance && data[i + 1] <= hi1 + tolerance &&
      data[i + 2] >= lo2 - tolerance && data[i + 2] <= hi2 + tolerance
    );
  };

  let bad = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const delta = Math.max(
        Math.abs(a[i] - b[i]),
        Math.abs(a[i + 1] - b[i + 1]),
        Math.abs(a[i + 2] - b[i + 2])
      );
      if (delta <= tolerance) continue;
      if (within(a, i, b, x, y) && within(b, i, a, x, y)) continue;
      bad++;
    }
  }
  const badFraction = bad / (W * H);
  const out = { slug, badFraction, hasForeignObject: res.svg.includes('foreignObject') };
  if (keepImages || badFraction > 0) {
    out.svg = res.svg;
    out.minePng = mine.toDataURL('image/png');
    out.refPng = ref.toDataURL('image/png');
  }
  return out;
};

/**
 * Sweeps a batch's definitions. Exits the process non-zero on any failure, so
 * a per-batch script is just `runSvgSweep({ defs, label })`.
 *
 * @param {{defs: Array<{slug: string, thumb: {grid: string}}>, label: string,
 *          artifactsPrefix?: string}} options
 */
export async function runSvgSweep({ defs, label, artifactsPrefix = 'tabbied-svg' }) {
  const cssDoodle = readFileSync(
    path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'),
    'utf-8'
  );
  // Wrapped in an IIFE because page.setContent() reuses the JS realm: injecting
  // the converter's top-level `const`s twice into the same global would throw
  // "already declared" on the second page of the sweep.
  const converter =
    '(function(){\n' +
    readFileSync(path.join(ROOT, 'packages/tabbied/dist/core/svgExport.js'), 'utf8')
      .replace(/\bexport\s+(function|class|const)/g, '$1') +
    '\nwindow.__svgx = { doodleToSvg };\n})();';

  const ARTIFACTS =
    process.env.SVG_ARTIFACTS || path.join(os.tmpdir(), artifactsPrefix);
  mkdirSync(ARTIFACTS, { recursive: true });

  const SEEDS = (process.env.SVG_SEEDS || 'sv11,qz73').split(',');
  const slugs = process.env.SLUGS
    ? process.env.SLUGS.split(',').map((s) => s.trim())
    : defs.map((d) => d.slug);

  const known = new Set(
    readdirSync(PATTERNS_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''))
  );
  for (const slug of slugs) {
    if (!known.has(slug)) {
      throw new Error(`no pattern JSON for ${slug} - run the generator first`);
    }
  }

  // Thumbnail grids keep the sweep honest about cell aspect: a square canvas
  // with a square grid means cells are square, the way the design was authored.
  //
  // SVG_GRID overrides that for every design, which is how a batch gets checked
  // at the *editor* default too - a non-square grid on a square canvas gives
  // fractional, non-square cells, and a design whose edges land on clean pixel
  // boundaries at 5x5 can drift at 6x9.
  const gridFor = (slug) =>
    process.env.SVG_GRID || defs.find((d) => d.slug === slug)?.thumb.grid || '4x4';

  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  const page = await browser.newPage({
    viewport: {
      width: COLS * CELL + (COLS - 1) * GAP + PAD * 2,
      height: ROWS * CELL + (ROWS - 1) * GAP + PAD * 2,
    },
    deviceScaleFactor: 2,
  });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') pageErrors.push(m.text());
  });

  const failures = [];
  const worst = [];
  let checked = 0;

  for (const seed of SEEDS) {
    for (let i = 0; i < slugs.length; i += PER_PAGE) {
      const chunk = slugs.slice(i, i + PER_PAGE);
      const blocks = chunk.map((slug) => {
        const pattern = JSON.parse(
          readFileSync(path.join(PATTERNS_DIR, `${slug}.json`), 'utf-8')
        );
        return {
          slug,
          ...buildSource(pattern, {
            optionOverrides: { grid: gridFor(slug), frequency: ALL_CELLS },
          }),
        };
      });

      pageErrors.length = 0;
      await page.setContent(buildPage(blocks, seed, cssDoodle), { waitUntil: 'load' });
      await page.waitForTimeout(1100); // let the first-draw transitions settle
      const shot = await page.screenshot();
      const shotUrl = `data:image/png;base64,${shot.toString('base64')}`;
      await page.addScriptTag({ content: converter });

      for (const slug of chunk) {
        const r = await page.evaluate(compare, {
          slug,
          shotUrl,
          tolerance: TOLERANCE,
          keepImages: false,
        });
        checked++;
        if (r.error) {
          failures.push({ slug, seed, problem: r.error });
        } else if (r.hasForeignObject) {
          failures.push({ slug, seed, problem: 'export contains a foreignObject' });
        } else if (r.badFraction > MAX_BAD_FRACTION) {
          failures.push({
            slug,
            seed,
            problem: `pixel diff ${(r.badFraction * 100).toFixed(2)}% > ${MAX_BAD_FRACTION * 100}%`,
          });
        }
        if (r.badFraction !== undefined) worst.push({ slug, seed, f: r.badFraction });
        if (r.error || r.badFraction > MAX_BAD_FRACTION) {
          const dir = path.join(ARTIFACTS, `${slug}-${seed}`);
          mkdirSync(dir, { recursive: true });
          if (r.svg) writeFileSync(path.join(dir, 'out.svg'), r.svg);
          for (const [name, uri] of [['mine.png', r.minePng], ['ref.png', r.refPng]]) {
            if (uri) {
              writeFileSync(path.join(dir, name), Buffer.from(uri.split(',')[1], 'base64'));
            }
          }
        }
      }
      if (pageErrors.length) {
        failures.push({
          slug: chunk.join('+'),
          seed,
          problem: `console errors: ${[...new Set(pageErrors)].slice(0, 3).join(' | ')}`,
        });
      }
      process.stdout.write(
        `\r  ${seed}: ${Math.min(i + PER_PAGE, slugs.length)}/${slugs.length}   `
      );
    }
    process.stdout.write('\n');
  }

  await browser.close();

  worst.sort((x, y) => y.f - x.f);
  console.log('worst diffs:');
  for (const w of worst.slice(0, 12)) {
    console.log(`  ${(w.f * 100).toFixed(3)}%  ${w.slug} (${w.seed})`);
  }

  if (failures.length) {
    console.log(`\nFAILURES (${failures.length}), artifacts in ${ARTIFACTS}:`);
    for (const f of failures) console.log(`  ${f.slug} [${f.seed}] -> ${f.problem}`);
    process.exit(1);
  }
  console.log(
    `\nall ${slugs.length} ${label} patterns export as native SVG with no warnings and match their live render (${checked} checks)`
  );
}
