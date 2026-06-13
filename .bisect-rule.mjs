// Tries rule variants to find which construct kills css-doodle's compiler.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const cssDoodle = readFileSync(path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'), 'utf-8');

const variants = {
  v1_full: `--u: calc(190px / @Y); --pc: @p(#3EECFF, #FF3D8B); @random(0.8) { :before { content: ''; position: absolute; left: 14%; top: 14%; width: var(--u); height: var(--u); background: @var(--pc); box-shadow: calc(@var(--u) * @p(1, 1, 2)) 0 @var(--pc), calc(@var(--u) * @p(0, 1)) var(--u) @var(--pc), calc(@var(--u) * @p(1, 2)) var(--u) @var(--pc); } }`,
  v2_no_p_in_calc: `--u: calc(190px / @Y); --pc: @p(#3EECFF, #FF3D8B); @random(0.8) { :before { content: ''; position: absolute; left: 14%; top: 14%; width: var(--u); height: var(--u); background: @var(--pc); box-shadow: calc(@var(--u) * 2) 0 @var(--pc), calc(@var(--u) * 1) var(--u) @var(--pc); } }`,
  v3_no_var_u: `--pc: @p(#3EECFF, #FF3D8B); @random(0.8) { :before { content: ''; position: absolute; left: 14%; top: 14%; width: calc(190px / @Y); height: calc(190px / @Y); background: @var(--pc); box-shadow: calc(190px / @Y * @p(1, 1, 2)) 0 @var(--pc); } }`,
  v4_rolled_mult: `--u: calc(190px / @Y); --m1: @p(1, 1, 2); --pc: @p(#3EECFF, #FF3D8B); @random(0.8) { :before { content: ''; position: absolute; left: 14%; top: 14%; width: var(--u); height: var(--u); background: @var(--pc); box-shadow: calc(@var(--u) * @var(--m1)) 0 @var(--pc); } }`,
};

const browser = await chromium.launch();
for (const [name, rule] of Object.entries(variants)) {
  const html = `<!DOCTYPE html><html><head><style>
    css-doodle { --color0: #1A1C2E; --rule: ( ${rule} ); }
  </style></head><body>
    <css-doodle data-seed="t1Ab" use="var(--rule)">:doodle { @grid: 8x12; @size: 300px 300px; } :container { background: var(--color0); }</css-doodle>
  <script>${cssDoodle}</script></body></html>`;
  const page = await browser.newPage({ viewport: { width: 360, height: 360 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const painted = await page.evaluate(() => {
    const el = document.querySelector('css-doodle');
    if (!el?.shadowRoot) return -1;
    return [...el.shadowRoot.querySelectorAll('cssd-cell')].filter(
      (c) => getComputedStyle(c, '::before').content === '""'
    ).length;
  });
  console.log(name, '→ painted:', painted, errors.length ? 'errors: ' + errors[0] : '');
  await page.close();
}
await browser.close();
