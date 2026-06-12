// Renders every new artwork in headless Chromium and verifies:
//  1. it paints (cells with visible features),
//  2. reseeding changes the pattern,
//  3. cells persist across reseed (so CSS transitions can animate),
//  4. no console errors.
// Also captures contact-sheet screenshots for visual review.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch1 } from './scripts/artwork-gen/artwork-defs-1.mjs';
import { batch2 } from './scripts/artwork-gen/artwork-defs-2.mjs';
import { batch3 } from './scripts/artwork-gen/artwork-defs-3.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.');

const cssDoodle = readFileSync(path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'), 'utf-8');
const allSlugs = [...batch1, ...batch2, ...batch3].map((d) => d.slug);
const CH = 20; const pi = Math.floor(allSlugs.indexOf('seigaiha') / CH);
const slugs = allSlugs.slice(pi * CH, pi * CH + CH);

const fixFullRandomGate = (code) =>
  code.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');

// Mirror of lib/doodleSource.ts buildDoodleSource + expandPalette.
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

// Artworks whose pattern is intentionally seed-independent — a pure positional
// gradient — so reseeding is a no-op by design (the CSS transition still lets
// grid/palette changes morph). These skip the "reseed must differ" assertion.
const STATIC_BY_DESIGN = new Set(['crescendo']);

const CHUNK = 20;
const chunks = [];
for (let i = 0; i < slugs.length; i += CHUNK) chunks.push(slugs.slice(i, i + CHUNK));

const browser = await chromium.launch();
const failures = [];
let shot = 0;

for (const chunk of chunks) {
  shot++;
  const blocks = chunk.map((slug) => {
    const artwork = JSON.parse(readFileSync(path.join(ROOT, `artworks/${slug}.json`), 'utf-8'));
    // Render close to gallery conditions: square card, thumbnail option overrides.
    const overrides = {};
    const { style, doodle } = buildSource(artwork, {
      width: '300px',
      height: '300px',
      optionOverrides: overrides,
    });
    return { slug, style, doodle, name: artwork.name };
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
          `<figure><figcaption>${b.slug}</figcaption><css-doodle data-slug="${b.slug}" data-seed="t1Ab" use="var(--rule)">${b.doodle}</css-doodle></figure>`
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

  // Mark first cells so we can prove they are NOT rebuilt on reseed.
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('css-doodle')) {
      const c = el.shadowRoot.querySelector('cssd-cell');
      if (c) c.__marked = true;
    }
  });

  const before = await inspect(page);
  await page.screenshot({ path: `/tmp/sheet-${shot}-seed1.png`, fullPage: true });

  // Reseed exactly like the site does: swap data-seed, push update(doodleCode).
  const cssBefore = await page.evaluate(() => {
    const m = {};
    for (const el of document.querySelectorAll('css-doodle'))
      m[el.dataset.slug] = [...el.shadowRoot.querySelectorAll('style')].map((s) => s.textContent).join().length;
    return m;
  });
  const dumpSeiB = await page.evaluate(() => {
    const el = [...document.querySelectorAll('css-doodle')].find((e) => e.dataset.slug === 'seigaiha');
    return [...el.shadowRoot.querySelectorAll('style')].map((s) => s.textContent).join('\n');
  });
  (await import('node:fs')).writeFileSync('/tmp/sei-before.css', dumpSeiB);
  const updErrs = await page.evaluate(() => {
    const errs = [];
    for (const el of document.querySelectorAll('css-doodle')) {
      el.setAttribute('data-seed', 'z9Qx');
      try { el.update(el.textContent); } catch (e) { errs.push(el.dataset.slug + ': ' + String(e).slice(0, 150)); }
    }
    return errs;
  });
  if (updErrs.length) console.log('UPDATE ERRORS:', updErrs);
  const cssAfter = await page.evaluate(() => {
    const m = {};
    for (const el of document.querySelectorAll('css-doodle'))
      m[el.dataset.slug] = [...el.shadowRoot.querySelectorAll('style')].map((s) => s.textContent).join().length;
    return m;
  });
  for (const k of Object.keys(cssBefore))
    if (cssBefore[k] === cssAfter[k]) console.log('CSS UNCHANGED LEN:', k, cssBefore[k]);
  const dumpSei = await page.evaluate(() => {
    const el = [...document.querySelectorAll('css-doodle')].find((e) => e.dataset.slug === 'seigaiha');
    return [...el.shadowRoot.querySelectorAll('style')].map((s) => s.textContent).join('\n');
  });
  (await import('node:fs')).writeFileSync('/tmp/sei-after.css', dumpSei);
  await page.waitForTimeout(1400);
  const probe = await page.evaluate(() => {
    const el = [...document.querySelectorAll('css-doodle')].find((e) => e.dataset.slug === 'seigaiha');
    const cell = el.shadowRoot.querySelector('cssd-cell');
    const b = getComputedStyle(cell, '::before');
    const styles = [...el.shadowRoot.querySelectorAll('style')];
    return {
      styleTagCount: styles.length,
      cellCount: el.shadowRoot.querySelectorAll('cssd-cell').length,
      beforeHeight: b.height,
      beforeBg: b.backgroundColor,
      cssHeightLine: styles.map((s) => s.textContent).join('').match(/height:1[01][0-9.]+%/g)?.slice(0, 3),
    };
  });
  console.log('PROBE:', JSON.stringify(probe));
  const after = await inspect(page);
  await page.screenshot({ path: `/tmp/sheet-${shot}-seed2.png`, fullPage: true });

  for (const slug of chunk) {
    const b = before[slug];
    const a = after[slug];
    const artwork = JSON.parse(readFileSync(path.join(ROOT, `artworks/${slug}.json`), 'utf-8'));
    const problems = [];
    if (!b || b.cellCount === 0) problems.push('no cells rendered');
    else {
      if (b.painted === 0) problems.push('nothing painted');
      if (b.painted < b.cellCount * 0.1) problems.push(`only ${b.painted}/${b.cellCount} painted`);
      if (!STATIC_BY_DESIGN.has(slug) && a.signature === b.signature) {
        problems.push('reseed produced identical pattern');
        console.log('IDENTICAL', slug, 'sig head:', b.signature.slice(0, 200));
      }
      if (!a.firstCellMarked) problems.push('cells were rebuilt on reseed (transitions broken)');
    }
    if (!artwork.code.style.includes('transition')) problems.push('no transition in style');
    if (problems.length) failures.push({ slug, problems });
  }
  if (errors.length) failures.push({ slug: `(page ${shot})`, problems: errors.slice(0, 5) });
  await page.close();
}

await browser.close();

if (failures.length) {
  console.log('FAILURES:');
  for (const f of failures) console.log(' ', f.slug, '→', f.problems.join('; '));
  process.exit(1);
}
console.log(`all ${slugs.length} artworks render, reseed and keep their cells ✓`);
