// Renders every batch-4 artwork in headless Chromium at its gallery-thumbnail
// settings and verifies it paints, reseeds to a different pattern, keeps its
// cells across reseed (so transitions animate) and logs no console errors.
// Also writes contact-sheet screenshots to /tmp/sheet-b4-*.png for review.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch4 } from './artwork-defs-4.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cssDoodle = readFileSync(
  path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'),
  'utf-8'
);

const fixFullRandomGate = (code) =>
  code.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');

function buildSource(artwork, { width, height, optionOverrides = {} }) {
  let style = artwork.code.style;
  let doodle = artwork.code.doodle;
  for (const option of artwork.options) {
    const value = optionOverrides[option.id] ?? option.default;
    style = style.split(option.replace).join(String(value));
    doodle = doodle.split(option.replace).join(String(value));
  }
  style = style.split('${width}').join(width);
  style = style.split('${height}').join(height);
  doodle = doodle.split('${width}').join(width);
  doodle = doodle.split('${height}').join(height);
  style = fixFullRandomGate(style);
  doodle = fixFullRandomGate(doodle);
  const colors = artwork.palette
    .map((color, idx) => `--color${idx}: ${color};`)
    .join(' ');
  return { style: colors + ' ' + style, doodle };
}

// Mirror of validate-artworks.mjs: backgroundImage/height are intentionally
// excluded so a design whose only per-seed change is a gradient (which can't
// transition and would snap) fails the reseed check — every design must vary a
// transition-able property so reseeds morph.
const CELL_PROPS = ['backgroundColor', 'transform', 'clipPath', 'opacity', 'borderTopWidth', 'borderLeftWidth', 'borderRadius', 'width', 'left', 'top', 'margin'];
const PSEUDO_PROPS = ['content', 'left', 'top', 'width', 'height', 'backgroundColor', 'opacity', 'transform', 'borderTopWidth', 'boxShadow', 'clipPath', 'borderRadius'];

async function inspect(page) {
  return page.evaluate(([cellProps, pseudoProps]) => {
    const out = {};
    for (const el of document.querySelectorAll('css-doodle')) {
      const slug = el.dataset.slug;
      const cells = [...el.shadowRoot.querySelectorAll('cssd-cell')];
      let painted = 0;
      const sig = [];
      for (const c of cells) {
        const s = getComputedStyle(c);
        const before = getComputedStyle(c, '::before');
        const after = getComputedStyle(c, '::after');
        const hasFeature =
          s.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
          s.backgroundImage !== 'none' ||
          s.clipPath !== 'none' ||
          s.borderTopWidth !== '0px' ||
          s.borderLeftWidth !== '0px' ||
          before.content === '""' ||
          after.content === '""';
        if (hasFeature) painted++;
        sig.push(
          cellProps.map((p) => s[p]).join('|'),
          pseudoProps.map((p) => before[p]).join('|'),
          pseudoProps.map((p) => after[p]).join('|')
        );
      }
      out[slug] = {
        cellCount: cells.length,
        painted,
        signature: sig.join('~'),
        firstCellMarked: cells[0]?.__marked ?? false,
      };
    }
    return out;
  }, [CELL_PROPS, PSEUDO_PROPS]);
}

const CHUNK = 20;
const chunks = [];
for (let i = 0; i < batch4.length; i += CHUNK) chunks.push(batch4.slice(i, i + CHUNK));

const browser = await chromium.launch();
const failures = [];
let shot = 0;

for (const chunk of chunks) {
  shot++;
  const blocks = chunk.map((def) => {
    const artwork = JSON.parse(
      readFileSync(path.join(ROOT, `packages/tabbied/artworks/${def.slug}.json`), 'utf-8')
    );
    // Render at the gallery-thumbnail grid/frequency (the smaller grid is the
    // harder case for the reseed-differs check, so passing here implies the
    // denser editor defaults pass too).
    const { style, doodle } = buildSource(artwork, {
      width: '300px',
      height: '300px',
      optionOverrides: { grid: def.thumb.grid, frequency: def.thumb.frequency },
    });
    return { slug: def.slug, style, doodle, name: artwork.name };
  });

  const html = `<!DOCTYPE html><html><head><style>
    body { margin: 0; background: #777; display: grid; grid-template-columns: repeat(5, 320px); gap: 14px; padding: 14px; font-family: sans-serif; }
    figure { margin: 0; }
    figcaption { color: #fff; font-size: 13px; padding: 3px 1px; }
    ${blocks.map((b) => `css-doodle[data-slug="${b.slug}"] { ${b.style} }`).join('\n')}
  </style></head><body>
    ${blocks
      .map(
        (b) =>
          `<figure><figcaption>${b.name}</figcaption><css-doodle data-slug="${b.slug}" data-seed="t1Ab" use="var(--rule)">${b.doodle}</css-doodle></figure>`
      )
      .join('\n')}
  <script>${cssDoodle}</script></body></html>`;

  const page = await browser.newPage({ viewport: { width: 1700, height: 1450 } });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(1200);

  await page.evaluate(() => {
    for (const el of document.querySelectorAll('css-doodle')) {
      const c = el.shadowRoot.querySelector('cssd-cell');
      if (c) c.__marked = true;
    }
  });

  const before = await inspect(page);
  await page.screenshot({ path: `/tmp/sheet-b4-${shot}-seed1.png`, fullPage: true });

  await page.evaluate(() => {
    for (const el of document.querySelectorAll('css-doodle')) {
      el.setAttribute('data-seed', 'z9Qx');
      el.update(el.textContent);
    }
  });
  await page.waitForTimeout(2800);
  const after = await inspect(page);
  await page.screenshot({ path: `/tmp/sheet-b4-${shot}-seed2.png`, fullPage: true });

  for (const def of chunk) {
    const slug = def.slug;
    const b = before[slug];
    const a = after[slug];
    const artwork = JSON.parse(
      readFileSync(path.join(ROOT, `packages/tabbied/artworks/${slug}.json`), 'utf-8')
    );
    const problems = [];
    if (!b || b.cellCount === 0) problems.push('no cells rendered');
    else {
      if (b.painted === 0) problems.push('nothing painted');
      if (b.painted < b.cellCount * 0.1) problems.push(`only ${b.painted}/${b.cellCount} painted`);
      if (a.signature === b.signature) problems.push('reseed produced identical pattern');
      if (!a.firstCellMarked) problems.push('cells were rebuilt on reseed (transitions broken)');
    }
    if (!artwork.code.style.includes('transition')) problems.push('no transition in style');
    if (problems.length) failures.push({ slug, problems });
  }
  if (errors.length) failures.push({ slug: `(page ${shot})`, problems: [...new Set(errors)].slice(0, 5) });
  await page.close();
}

await browser.close();

if (failures.length) {
  console.log('FAILURES:');
  for (const f of failures) console.log(' ', f.slug, '→', f.problems.join('; '));
  process.exit(1);
}
console.log(`all ${batch4.length} batch-4 artworks render, reseed and keep their cells ✓`);
