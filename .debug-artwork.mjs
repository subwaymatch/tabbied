// Renders one artwork, dumps console errors, painted-cell count and the first
// cell's generated CSS, before and after a reseed.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const slug = process.argv[2];
const cssDoodle = readFileSync(path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'), 'utf-8');
const artwork = JSON.parse(readFileSync(path.join(ROOT, `artworks/${slug}.json`), 'utf-8'));

const fixFullRandomGate = (code) => code.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');

let style = artwork.code.style;
let doodle = artwork.code.doodle;
for (const option of artwork.options) {
  style = style.split(option.replace).join(String(option.default));
  doodle = doodle.split(option.replace).join(String(option.default));
}
style = fixFullRandomGate(style.split('${width}').join('300px').split('${height}').join('300px'));
doodle = fixFullRandomGate(doodle.split('${width}').join('300px').split('${height}').join('300px'));
const colors = artwork.palette.map((c, i) => `--color${i}: ${c};`).join(' ');

const html = `<!DOCTYPE html><html><head><style>
  body { margin: 0; background: #777; padding: 14px; }
  css-doodle { ${colors} ${style} }
</style></head><body>
  <css-doodle data-seed="t1Ab" use="var(--rule)">${doodle}</css-doodle>
<script>${cssDoodle}</script></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 360 } });
page.on('console', (m) => console.log('[console]', m.type(), m.text().slice(0, 300)));
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)));
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(900);

const report = await page.evaluate(() => {
  const el = document.querySelector('css-doodle');
  if (!el || !el.shadowRoot) return { error: 'no shadow root' };
  const cells = [...el.shadowRoot.querySelectorAll('cssd-cell')];
  const styleTag = [...el.shadowRoot.querySelectorAll('style')].map((s) => s.textContent).join('\n');
  let painted = 0;
  for (const c of cells) {
    const s = getComputedStyle(c);
    const b = getComputedStyle(c, '::before');
    const a = getComputedStyle(c, '::after');
    if (
      s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.clipPath !== 'none' ||
      b.content === '""' || a.content === '""'
    ) painted++;
  }
  return { cellCount: cells.length, painted, css: styleTag.slice(0, 2600) };
});
console.log(JSON.stringify(report, null, 2).slice(0, 3200));
await page.screenshot({ path: `/tmp/debug-${slug}.png` });
await browser.close();
