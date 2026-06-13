// Renders selected artworks at gallery conditions: 800x800 internal render with
// each design's galleryThumbnails config, CSS-scaled onto ~260px cards.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const cssDoodle = readFileSync(path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'), 'utf-8');
const slugs = process.argv.slice(2);

// Pull thumbnail option overrides out of galleryThumbnails.ts (regex is fine
// for this generated, uniform file).
const thumbsSrc = readFileSync(
  path.join(ROOT, 'components/select-artwork-page/galleryThumbnails.ts'),
  'utf-8'
);
const thumbFor = (slug) => {
  const m = thumbsSrc.match(new RegExp(`  ${slug}: \\{\\n    options: \\{ ([^}]*) \\},`));
  if (!m) return {};
  const opts = {};
  for (const pair of m[1].split(', ')) {
    const [k, v] = pair.split(': ');
    opts[k] = v.startsWith("'") ? v.slice(1, -1) : Number(v);
  }
  return opts;
};

const fix = (c) => c.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');

const blocks = slugs.map((slug) => {
  const artwork = JSON.parse(readFileSync(path.join(ROOT, `artworks/${slug}.json`), 'utf-8'));
  const overrides = thumbFor(slug);
  let style = artwork.code.style;
  let doodle = artwork.code.doodle;
  for (const o of artwork.options) {
    const v = overrides[o.id] ?? o.default;
    style = style.split(o.replace).join(String(v));
    doodle = doodle.split(o.replace).join(String(v));
  }
  style = fix(style.split('${width}').join('800px').split('${height}').join('800px'));
  doodle = fix(doodle.split('${width}').join('800px').split('${height}').join('800px'));
  const colors = artwork.palette.map((c, i) => `--color${i}: ${c};`).join(' ');
  return { slug, style: colors + ' ' + style, doodle };
});

const html = `<!DOCTYPE html><html><head><style>
  body { margin: 0; background: #999; display: grid; grid-template-columns: repeat(5, 264px); gap: 12px; padding: 12px; font-family: sans-serif; }
  figure { margin: 0; }
  figcaption { color: #fff; font-size: 13px; padding: 2px 1px; }
  .card { width: 264px; height: 264px; overflow: hidden; position: relative; }
  .card css-doodle { transform: scale(0.33); transform-origin: 0 0; position: absolute; }
  ${blocks.map((b) => `css-doodle[data-slug="${b.slug}"] { ${b.style} }`).join('\n')}
</style></head><body>
  ${blocks
    .map(
      (b) =>
        `<figure><figcaption>${b.slug}</figcaption><div class="card"><css-doodle data-slug="${b.slug}" data-seed="gal7" use="var(--rule)">${b.doodle}</css-doodle></div></figure>`
    )
    .join('\n')}
<script>${cssDoodle}</script></body></html>`;

const browser = await chromium.launch();
const rows = Math.ceil(slugs.length / 5);
const page = await browser.newPage({ viewport: { width: 1400, height: rows * 296 + 24 } });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/gallery-check.png', fullPage: true });
await browser.close();
console.log('saved /tmp/gallery-check.png');
