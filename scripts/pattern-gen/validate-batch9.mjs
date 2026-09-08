// Renders every batch-9 pattern in headless Chromium at its gallery-thumbnail
// settings and verifies it paints, keeps its cells across a reseed (so
// transitions animate), re-inks on that reseed, and logs no console errors.
//
// Batch 7 is the *scattered* batch - @rand() and @pick() place shapes, so
// unlike batch 6 the geometry is allowed to move on reseed. What it does
// inherit from batch 6 is background independence: re-rendering with the
// background slot set to a zero-alpha color must produce byte-identical
// cells. A design that knocked its holes out with var(--color0) would quietly
// fill them in here. (Same seed -> same rolls, so the two passes are directly
// comparable even though the design is random.)
//
// Contact sheets land in /tmp/sheet-b9-*.png - the transparent pass is shot
// over a checkerboard so real holes are visible as see-through.
// Set CHROMIUM_PATH to use a browser other than Playwright's own download,
// and ONLY=slug,slug to narrow the run while authoring.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch9 } from './pattern-defs-9.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cssDoodle = readFileSync(
  path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'),
  'utf-8'
);

// `@random(n)` with n >= the cell count paints every cell, which takes the
// frequency gate's own dice roll out of the comparison below.
const ALL_CELLS = 9999;
// What the editor writes when the background slot is switched to transparent.
const TRANSPARENT = '#00000000';

// Mirrors buildDoodleSource() in packages/tabbied/src/core/doodleSource.ts,
// including the ToggleSwitch semantics (on -> substitute the snippet, off ->
// drop the token) that batch 9's Shadow / Rounded Corners switches rely on.
function buildSource(pattern, { width, height, optionOverrides = {}, transparentBg = false }) {
  let style = pattern.code.style;
  let doodle = pattern.code.doodle;
  for (const option of pattern.options) {
    const raw = optionOverrides[option.id] ?? option.default;
    const value =
      option.type === 'ToggleSwitch' ? (raw ? (option.code ?? '') : '') : String(raw);
    style = style.split(option.replace).join(value);
    doodle = doodle.split(option.replace).join(value);
  }
  style = style.split('${width}').join(width);
  style = style.split('${height}').join(height);
  doodle = doodle.split('${width}').join(width);
  doodle = doodle.split('${height}').join(height);
  const palette = transparentBg
    ? [TRANSPARENT, ...pattern.palette.slice(1)]
    : pattern.palette;
  const colors = palette
    .map((color, idx) => `--color${idx}: ${color};`)
    .join(' ');
  return { style: colors + ' ' + style, doodle };
}

// Split into what a redraw may rearrange and what must actually change.
const GEOM_PROPS = ['transform', 'clipPath', 'borderRadius', 'width', 'height', 'left', 'top', 'margin', 'inset', 'opacity', 'zIndex', 'borderTopWidth', 'borderLeftWidth', 'webkitMaskImage'];
// Deliberately excludes background-image: a design whose only per-cell
// variation lives in a gradient, an @svg() or a nested @doodle() would *snap*
// on reseed instead of morphing, and the reseed check below is what stops one
// shipping. Everything listed here transitions.
const COLOR_PROPS = ['backgroundColor', 'borderTopColor', 'borderRightColor', 'boxShadow', 'color'];

async function inspect(page) {
  return page.evaluate(([geomProps, colorProps]) => {
    const out = {};
    for (const el of document.querySelectorAll('css-doodle')) {
      const slug = el.dataset.slug;
      const cells = [...el.shadowRoot.querySelectorAll('cssd-cell')];
      let painted = 0;
      const geom = [];
      const color = [];
      for (const c of cells) {
        const styles = [
          getComputedStyle(c),
          getComputedStyle(c, '::before'),
          getComputedStyle(c, '::after'),
        ];
        const [s, before, after] = styles;
        const hasFeature =
          s.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
          s.backgroundImage !== 'none' ||
          s.clipPath !== 'none' ||
          s.borderTopWidth !== '0px' ||
          s.borderLeftWidth !== '0px' ||
          s.boxShadow !== 'none' ||
          before.content !== 'none' ||
          after.content !== 'none';
        if (hasFeature) painted++;
        for (const st of styles) {
          geom.push(geomProps.map((p) => st[p]).join('|'));
          color.push(colorProps.map((p) => st[p]).join('|'));
        }
        geom.push(before.content, after.content);
      }
      out[slug] = {
        cellCount: cells.length,
        painted,
        geom: geom.join('~'),
        color: color.join('~'),
        firstCellMarked: cells[0]?.__marked ?? false,
      };
    }
    return out;
  }, [GEOM_PROPS, COLOR_PROPS]);
}

const CHECKERBOARD = `
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #b8b8b8 25%, transparent 25%),
    linear-gradient(-45deg, #b8b8b8 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #b8b8b8 75%),
    linear-gradient(-45deg, transparent 75%, #b8b8b8 75%);
  background-size: 24px 24px;
  background-position: 0 0, 0 12px, 12px -12px, -12px 0px;
`;

function buildPage(blocks, { checkerboard = false } = {}) {
  return `<!DOCTYPE html><html><head><style>
    body { margin: 0; ${checkerboard ? CHECKERBOARD : 'background: #777;'} display: grid; grid-template-columns: repeat(5, 320px); gap: 14px; padding: 14px; font-family: sans-serif; }
    figure { margin: 0; }
    figcaption { color: ${checkerboard ? '#222' : '#fff'}; font-size: 13px; padding: 3px 1px; }
    ${blocks.map((b) => `css-doodle[data-slug="${b.slug}"] { ${b.style} }`).join('\n')}
  </style></head><body>
    ${blocks
      .map(
        (b) =>
          `<figure><figcaption>${b.name}</figcaption><css-doodle data-slug="${b.slug}" data-seed="t1Ab" use="var(--rule)">${b.doodle}</css-doodle></figure>`
      )
      .join('\n')}
  <script>${cssDoodle}</script></body></html>`;
}

const only = process.env.ONLY
  ? new Set(process.env.ONLY.split(',').map((s) => s.trim()))
  : null;
const defs = only ? batch9.filter((d) => only.has(d.slug)) : batch9;
if (!defs.length) throw new Error('ONLY matched no batch-9 slugs');

const CHUNK = 20;
const chunks = [];
for (let i = 0; i < defs.length; i += CHUNK) chunks.push(defs.slice(i, i + CHUNK));

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
const failures = [];
let shot = 0;

for (const chunk of chunks) {
  shot++;
  const sourceFor = (transparentBg) =>
    chunk.map((def) => {
      const pattern = JSON.parse(
        readFileSync(path.join(ROOT, `packages/tabbied/patterns/${def.slug}.json`), 'utf-8')
      );
      const { style, doodle } = buildSource(pattern, {
        width: '300px',
        height: '300px',
        optionOverrides: { grid: def.thumb.grid, frequency: ALL_CELLS },
        transparentBg,
      });
      return { slug: def.slug, style, doodle, name: pattern.name };
    });

  const openPage = async (html) => {
    const page = await browser.newPage({ viewport: { width: 1700, height: 1450 } });
    const errors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    return { page, errors };
  };

  // Pass 1 - the pattern's own palette, before and after a reseed.
  const { page, errors } = await openPage(buildPage(sourceFor(false)));

  await page.evaluate(() => {
    for (const el of document.querySelectorAll('css-doodle')) {
      const c = el.shadowRoot.querySelector('cssd-cell');
      if (c) c.__marked = true;
    }
  });

  const before = await inspect(page);
  await page.screenshot({ path: `/tmp/sheet-b9-${shot}-seed1.png`, fullPage: true });

  await page.evaluate(() => {
    for (const el of document.querySelectorAll('css-doodle')) {
      el.setAttribute('data-seed', 'z9Qx');
      el.update(el.textContent);
    }
  });
  await page.waitForTimeout(2800);
  const after = await inspect(page);
  await page.screenshot({ path: `/tmp/sheet-b9-${shot}-seed2.png`, fullPage: true });
  await page.close();

  // Pass 2 - same seed, background slot switched to transparent.
  const { page: clearPage, errors: clearErrors } = await openPage(
    buildPage(sourceFor(true), { checkerboard: true })
  );
  const clear = await inspect(clearPage);
  await clearPage.screenshot({ path: `/tmp/sheet-b9-${shot}-clear.png`, fullPage: true });
  await clearPage.close();

  for (const def of chunk) {
    const slug = def.slug;
    const b = before[slug];
    const a = after[slug];
    const t = clear[slug];
    const pattern = JSON.parse(
      readFileSync(path.join(ROOT, `packages/tabbied/patterns/${slug}.json`), 'utf-8')
    );
    const problems = [];
    if (!b || b.cellCount === 0) problems.push('no cells rendered');
    else {
      if (b.painted === 0) problems.push('nothing painted');
      if (b.painted < b.cellCount) problems.push(`only ${b.painted}/${b.cellCount} painted with the gate wide open`);
      if (a.color === b.color && a.geom === b.geom) problems.push('reseed changed nothing');
      if (!a.firstCellMarked) problems.push('cells were rebuilt on reseed (transitions broken)');
      if (!t || t.geom !== b.geom || t.color !== b.color) {
        problems.push('a transparent background changed the cells (the design paints with color0)');
      }
    }
    if (!pattern.code.style.includes('transition')) problems.push('no transition in style');
    if (pattern.code.style.includes('var(--color0)')) problems.push('style paints var(--color0)');
    if (problems.length) failures.push({ slug, problems });
  }
  const allErrors = [...new Set([...errors, ...clearErrors])];
  if (allErrors.length) failures.push({ slug: `(page ${shot})`, problems: allErrors.slice(0, 5) });
}

await browser.close();

if (failures.length) {
  console.log('FAILURES:');
  for (const f of failures) console.log(' ', f.slug, '->', f.problems.join('; '));
  process.exit(1);
}
console.log(
  `all ${defs.length} batch-9 patterns render, re-draw on reseed and render identically on a transparent background`
);
