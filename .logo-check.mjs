// Renders the LogoDoodle source next to the original SVG at several sizes and
// screenshots the comparison.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const ROOT = '/home/user/tabbied-site-nextjs';
const cssDoodle = readFileSync(
  `${ROOT}/node_modules/css-doodle/css-doodle.min.js`,
  'utf-8'
);
const svg = readFileSync(`${ROOT}/public/images/logo_tabbied_v3.svg`, 'utf-8');

// Keep in sync with components/main-page/LogoDoodleInner.tsx
const LOGO_DOODLE = `
  :doodle {
    @grid: 3x3 / 100%;
  }
  background: @pn(
    #FF3D8B, #3FFFB2, transparent,
    #232529, #3E8BFF, #FF3D8B,
    transparent, #275AA6, #3EECFF
  );
  border-radius: @pn(
    0 100% 0 0, 100% 0 0 0, 0,
    0 0 0 100%, 0 0 100% 0, 100% 0 0 0,
    0, 0 100% 0 0, 0 0 100% 0
  );
`;

const sizeRow = (size) => `
  <div class="row">
    <div class="label">${size}px</div>
    <div class="box" style="width:${size}px;height:${size}px">${svg.replace('width="162" height="162"', 'width="100%" height="100%"')}</div>
    <div class="box" style="width:${size}px;height:${size}px"><css-doodle>${LOGO_DOODLE}</css-doodle></div>
  </div>`;

const html = `<!DOCTYPE html><html><head><style>
  body { margin: 0; padding: 24px; background: #fff; font-family: sans-serif; }
  .row { display: flex; align-items: center; gap: 32px; margin-bottom: 24px; }
  .label { width: 60px; color: #555; }
  .box css-doodle { display: block; width: 100%; height: 100%; }
  .head { display: flex; gap: 32px; margin: 0 0 12px 92px; color: #888; }
  .head div { width: 200px; }
</style></head><body>
  <div class="head"><div>original SVG</div><div>css-doodle</div></div>
  ${sizeRow(200)}
  ${sizeRow(52)}
  ${sizeRow(40)}
  <script>${cssDoodle}</script>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 620, height: 480 } });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(600);
await page.screenshot({ path: '/tmp/logo-compare.png' });
await browser.close();
console.log('saved /tmp/logo-compare.png');
