import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const cssDoodle = readFileSync(path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'), 'utf-8');

const variants = {
  a_plain_var_only: `--u: calc(190px / @Y); @random(0.8) { :before { content: ''; position: absolute; left: 14%; top: 14%; width: var(--u); height: var(--u); background: #3EECFF; } }`,
  b_atvar_only: `--u: calc(190px / @Y); @random(0.8) { :before { content: ''; position: absolute; left: 14%; top: 14%; width: @var(--u); height: @var(--u); background: #3EECFF; } }`,
  c_atvar_in_calc: `--u: calc(190px / @Y); @random(0.8) { :before { content: ''; position: absolute; left: 14%; top: 14%; width: calc(@var(--u) * 1); height: calc(@var(--u) * 1); background: #3EECFF; } }`,
  d_simple_value: `--u: 24px; @random(0.8) { :before { content: ''; position: absolute; left: 14%; top: 14%; width: var(--u); height: var(--u); background: #3EECFF; } }`,
  e_longer_name: `--unit: calc(190px / @Y); @random(0.8) { :before { content: ''; position: absolute; left: 14%; top: 14%; width: var(--unit); height: var(--unit); background: #3EECFF; } }`,
};

const browser = await chromium.launch();
for (const [name, rule] of Object.entries(variants)) {
  const html = `<!DOCTYPE html><html><head><style>
    css-doodle { --color0: #1A1C2E; --rule: ( ${rule} ); }
  </style></head><body>
    <css-doodle data-seed="t1Ab" use="var(--rule)">:doodle { @grid: 8x12; @size: 300px 300px; } :container { background: var(--color0); }</css-doodle>
  <script>${cssDoodle}</script></body></html>`;
  const page = await browser.newPage({ viewport: { width: 360, height: 360 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(450);
  const painted = await page.evaluate(() => {
    const el = document.querySelector('css-doodle');
    if (!el?.shadowRoot) return -1;
    return [...el.shadowRoot.querySelectorAll('cssd-cell')].filter(
      (c) => getComputedStyle(c, '::before').content === '""'
    ).length;
  });
  console.log(name, '→ painted:', painted);
  await page.close();
}
await browser.close();
