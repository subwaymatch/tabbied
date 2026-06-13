// Reseeds one artwork and reports which inspected props actually changed.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const slug = process.argv[2];
const cssDoodle = readFileSync(path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'), 'utf-8');
const artwork = JSON.parse(readFileSync(path.join(ROOT, `artworks/${slug}.json`), 'utf-8'));

const fix = (code) => code.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');
let style = artwork.code.style;
let doodle = artwork.code.doodle;
for (const option of artwork.options) {
  style = style.split(option.replace).join(String(option.default));
  doodle = doodle.split(option.replace).join(String(option.default));
}
style = fix(style.split('${width}').join('300px').split('${height}').join('300px'));
doodle = fix(doodle.split('${width}').join('300px').split('${height}').join('300px'));
const colors = artwork.palette.map((c, i) => `--color${i}: ${c};`).join(' ');

const html = `<!DOCTYPE html><html><head><style>
  css-doodle { ${colors} ${style} }
</style></head><body>
  <css-doodle data-seed="t1Ab" use="var(--rule)">${doodle}</css-doodle>
<script>${cssDoodle}</script></body></html>`;

const PROPS = ['backgroundColor', 'height', 'width', 'top', 'left', 'borderRadius', 'transform', 'content', 'zIndex'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 360 } });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(800);

const snap = () =>
  page.evaluate((props) => {
    const el = document.querySelector('css-doodle');
    const cells = [...el.shadowRoot.querySelectorAll('cssd-cell')].slice(0, 6);
    return cells.map((c) => {
      const b = getComputedStyle(c, '::before');
      const a = getComputedStyle(c, '::after');
      return {
        before: Object.fromEntries(props.map((p) => [p, b[p]])),
        after: Object.fromEntries(props.map((p) => [p, a[p]])),
      };
    });
  }, PROPS);

const s1 = await snap();
await page.evaluate(() => {
  const el = document.querySelector('css-doodle');
  el.setAttribute('data-seed', 'z9Qx');
  el.update(el.textContent);
});
await page.waitForTimeout(1000);
const s2 = await snap();

for (let i = 0; i < s1.length; i++) {
  for (const half of ['before', 'after']) {
    const diffs = PROPS.filter((p) => s1[i][half][p] !== s2[i][half][p]);
    console.log(`cell ${i} ::${half}`, diffs.length ? 'changed: ' + diffs.join(',') : 'IDENTICAL', '| bg:', s1[i][half].backgroundColor, '→', s2[i][half].backgroundColor);
  }
}
await browser.close();
