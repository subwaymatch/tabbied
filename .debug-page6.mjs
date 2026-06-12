// Reproduces the validator's page containing seigaiha and reports, per slug,
// whether the reseed signature changed — plus any in-page update() errors.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { batch1 } from './scripts/artwork-gen/artwork-defs-1.mjs';
import { batch2 } from './scripts/artwork-gen/artwork-defs-2.mjs';
import { batch3 } from './scripts/artwork-gen/artwork-defs-3.mjs';

const ROOT = process.cwd();
const cssDoodle = readFileSync(path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'), 'utf-8');
const slugs = [...batch1, ...batch2, ...batch3].map((d) => d.slug);
const CHUNK = 20;
const pageIdx = Math.floor(slugs.indexOf('seigaiha') / CHUNK);
const chunk = slugs.slice(pageIdx * CHUNK, pageIdx * CHUNK + CHUNK);
console.log('page', pageIdx + 1, 'slugs:', chunk.join(','));

const fix = (c) => c.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');
const blocks = chunk.map((slug) => {
  const artwork = JSON.parse(readFileSync(path.join(ROOT, `artworks/${slug}.json`), 'utf-8'));
  let style = artwork.code.style;
  let doodle = artwork.code.doodle;
  for (const o of artwork.options) {
    style = style.split(o.replace).join(String(o.default));
    doodle = doodle.split(o.replace).join(String(o.default));
  }
  style = fix(style.split('${width}').join('300px').split('${height}').join('300px'));
  doodle = fix(doodle.split('${width}').join('300px').split('${height}').join('300px'));
  const colors = artwork.palette.map((c, i) => `--color${i}: ${c};`).join(' ');
  return { slug, style: colors + ' ' + style, doodle };
});

const html = `<!DOCTYPE html><html><head><style>
  body { margin: 0; background: #777; display: grid; grid-template-columns: repeat(5, 320px); gap: 14px; padding: 14px; }
  ${blocks.map((b) => `css-doodle[data-slug="${b.slug}"] { ${b.style} }`).join('\n')}
</style></head><body>
  ${blocks.map((b) => `<figure><css-doodle data-slug="${b.slug}" data-seed="t1Ab" use="var(--rule)">${b.doodle}</css-doodle></figure>`).join('\n')}
<script>${cssDoodle}</script></body></html>`;

const CELL_PROPS = ['backgroundColor', 'transform', 'clipPath', 'opacity', 'borderTopWidth', 'borderLeftWidth', 'borderRadius', 'width', 'left', 'top', 'margin'];
const PSEUDO_PROPS = ['content', 'left', 'top', 'width', 'height', 'backgroundColor', 'opacity', 'transform', 'borderTopWidth', 'boxShadow', 'clipPath', 'borderRadius'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1700, height: 1450 } });
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 200)));
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(1200);

const inspect = () =>
  page.evaluate(([cp, pp]) => {
    const out = {};
    for (const el of document.querySelectorAll('css-doodle')) {
      const cells = [...el.shadowRoot.querySelectorAll('cssd-cell')];
      const sig = [];
      for (const c of cells) {
        const s = getComputedStyle(c);
        const b = getComputedStyle(c, '::before');
        const a = getComputedStyle(c, '::after');
        sig.push(cp.map((p) => s[p]).join('|'), pp.map((p) => b[p]).join('|'), pp.map((p) => a[p]).join('|'));
      }
      out[el.dataset.slug] = sig.join('~');
    }
    return out;
  }, [CELL_PROPS, PSEUDO_PROPS]);

const before = await inspect();
const updateErrors = await page.evaluate(() => {
  const errs = [];
  for (const el of document.querySelectorAll('css-doodle')) {
    try {
      el.setAttribute('data-seed', 'z9Qx');
      el.update(el.textContent);
    } catch (e) {
      errs.push(el.dataset.slug + ': ' + String(e).slice(0, 120));
    }
  }
  return errs;
});
if (updateErrors.length) console.log('update errors:', updateErrors);
await page.waitForTimeout(1400);
const after = await inspect();

for (const slug of chunk) {
  if (before[slug] === after[slug]) console.log('IDENTICAL:', slug);
}
console.log('done');
await browser.close();
