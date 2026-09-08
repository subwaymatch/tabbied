// Ink-coverage check for batch 11.
//
// validate-batch11.mjs asks whether a design *paints* - it reads computed
// styles, so a cell with a background counts even when a mask hides all of it.
// This one asks whether the paint is *visible*, by rendering the design and
// measuring how much of the sheet its single most common colour takes up.
//
// A design that is one flat colour is a blank sheet - a mask that never opens,
// two shapes intersected to nothing, a sector aimed out of its own cell. All
// three render without error and export without error, which is exactly why
// neither of the other validators catches them.
//
// The dominant-colour measure is used rather than "pixels differing from the
// background" because plenty of good designs here are full-bleed: two inks
// meeting edge to edge cover the sheet completely and show none of it.
//
// Usage: node scripts/pattern-gen/validate-ink-batch11.mjs
// Env: CHROMIUM_PATH, SLUGS=a,b to narrow, MAX_DOMINANT to move the bound.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch11 } from './pattern-defs-11.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PATTERNS_DIR = path.join(ROOT, 'packages/tabbied/patterns');
const cssDoodle = readFileSync(
  path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'),
  'utf-8'
);

// Deliberately loose: the sparsest legitimate designs in the batch (a hairline
// ring, twelve clock marks) sit around 98% background, and a genuinely broken
// one sits at 100%.
const MAX_DOMINANT = Number(process.env.MAX_DOMINANT ?? 0.992);

const CELL = 260;
const COLS = 5;
const ROWS = 3;
const PER_PAGE = COLS * ROWS;

const buildSource = (pattern, grid) => {
  let style = pattern.code.style;
  let doodle = pattern.code.doodle;
  for (const option of pattern.options) {
    const raw = option.id === 'grid' ? grid : option.default;
    const value =
      option.type === 'ToggleSwitch' ? (raw ? (option.code ?? '') : '') : String(raw);
    style = style.split(option.replace).join(value);
    doodle = doodle.split(option.replace).join(value);
  }
  for (const [token, value] of [['${width}', `${CELL}px`], ['${height}', `${CELL}px`]]) {
    style = style.split(token).join(value);
    doodle = doodle.split(token).join(value);
  }
  const colors = pattern.palette.map((c, i) => `--color${i}: ${c};`).join(' ');
  // Mirrors fixFullRandomGate() in core/doodleSource.ts: css-doodle >= 0.5
  // reads @random(1) as a one-cell *count*, not a 100% probability, so
  // skipping this would render a single painted cell per design.
  const fixGate = (code) =>
    code.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');
  return { style: fixGate(colors + ' ' + style), doodle: fixGate(doodle) };
};

const slugs = process.env.SLUGS
  ? process.env.SLUGS.split(',').map((s) => s.trim())
  : batch11.map((d) => d.slug);
const gridFor = (slug) => batch11.find((d) => d.slug === slug)?.thumb.grid ?? '5x5';

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
const page = await browser.newPage({
  viewport: { width: COLS * CELL, height: ROWS * CELL },
});

const results = [];
for (let i = 0; i < slugs.length; i += PER_PAGE) {
  const chunk = slugs.slice(i, i + PER_PAGE);
  const blocks = chunk.map((slug) => {
    const pattern = JSON.parse(
      readFileSync(path.join(PATTERNS_DIR, `${slug}.json`), 'utf-8')
    );
    return { slug, background: pattern.palette[0], ...buildSource(pattern, gridFor(slug)) };
  });
  const html = `<!DOCTYPE html><html><head><style>
    html, body { margin: 0; }
    body { display: grid; grid-template-columns: repeat(${COLS}, ${CELL}px); }
    css-doodle { display: block; }
    ${blocks.map((b) => `css-doodle[data-slug="${b.slug}"] { ${b.style} }`).join('\n')}
  </style></head><body>
    ${blocks
      .map(
        (b) =>
          `<css-doodle data-slug="${b.slug}" data-seed="ink11" use="var(--rule)">${b.doodle}</css-doodle>`
      )
      .join('\n')}
  <script>${cssDoodle}</script></body></html>`;

  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(1100);
  const shot = await page.screenshot();
  const shotUrl = `data:image/png;base64,${shot.toString('base64')}`;

  const measured = await page.evaluate(
    async ({ shotUrl, slugs: chunkSlugs }) => {
      const img = new Image();
      img.src = shotUrl;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const g = canvas.getContext('2d');
      g.drawImage(img, 0, 0);
      const out = [];
      for (const slug of chunkSlugs) {
        const el = document.querySelector(`css-doodle[data-slug="${slug}"]`);
        const r = el.getBoundingClientRect();
        const w = Math.round(r.width);
        const h = Math.round(r.height);
        const data = g.getImageData(Math.round(r.left), Math.round(r.top), w, h).data;
        // Quantized to 5 bits a channel so anti-aliased edges do not read as
        // hundreds of distinct colours.
        const counts = new Map();
        for (let p = 0; p < data.length; p += 4) {
          const key =
            ((data[p] >> 3) << 10) | ((data[p + 1] >> 3) << 5) | (data[p + 2] >> 3);
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        let top = 0;
        for (const n of counts.values()) if (n > top) top = n;
        out.push({ slug, dominant: top / (w * h) });
      }
      return out;
    },
    { shotUrl, slugs: chunk }
  );
  results.push(...measured);
  process.stdout.write(`\r  ${Math.min(i + PER_PAGE, slugs.length)}/${slugs.length}   `);
}
process.stdout.write('\n');
await browser.close();

const failures = results.filter((r) => r.dominant > MAX_DOMINANT);
results.sort((a, b) => b.dominant - a.dominant);
console.log('most nearly blank:');
for (const r of results.slice(0, 10)) {
  console.log(`  ${(r.dominant * 100).toFixed(1)}% one colour   ${r.slug}`);
}

if (failures.length) {
  console.log(`\nFAILURES (${failures.length}):`);
  for (const f of failures) {
    console.log(
      `  ${f.slug} -> ${(f.dominant * 100).toFixed(2)}% of the sheet is a single colour`
    );
  }
  process.exit(1);
}
console.log(`\nall ${slugs.length} patterns put readable ink on the sheet`);
