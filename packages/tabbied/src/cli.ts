#!/usr/bin/env node
// The `tabbied` CLI: render any preset to SVG/PNG (or a PNG frame sequence)
// from the command line, and query the catalog while you're at it.
//
//   npx tabbied render radius --seed k9Pz --size 1600x900 --out hero.svg
//   npx tabbied render bight --frames 90 --reseed-every 30 --out frames/
//   npx tabbied list --tag dots --density dense
//   npx tabbied info radius
//
// Rendering runs css-doodle in a real headless browser - that is the only
// faithful renderer there is (see docs/svg-export.md for why nothing here
// tries to reimplement it). The browser comes from whichever Playwright the
// caller already has (`playwright`, `playwright-core`, or `@playwright/test`),
// so this package doesn't drag a browser download into every install; pass
// --browser <path> or set TABBIED_CHROMIUM to use a specific Chromium.
//
// The pattern definitions come from the compiled catalog in dist - the CLI
// works from the published tarball, not just the repo checkout.
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { patterns, isPatternSlug } from './patterns.generated.js';
import type { PatternDefinition, OptionValue } from './core/types.js';

const require = createRequire(import.meta.url);
const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

type RenderArgs = {
  slug: string;
  out: string;
  seed: string;
  palette: string[] | null;
  options: Record<string, OptionValue>;
  width: number;
  height: number;
  fit: 'grid' | 'cover' | 'fixed';
  format: 'svg' | 'png';
  scale: number;
  frames: number;
  reseedEvery: number;
  browser: string | null;
};

const HELP = `tabbied - render Tabbied's generative patterns from the command line

Usage:
  tabbied render <slug> --out <file|dir> [options]
  tabbied list [--tag t] [--mood m] [--density d] [--good-for g] [--query text]
  tabbied info <slug>

Render options:
  --out <path>          Destination. Extension picks the format (.svg | .png);
                        with --frames, a directory for the sequence.
  --seed <string>       Fixed seed (default: random). Same seed = same image.
  --palette <colors>    Comma-separated CSS colors, background first.
  --options "<pairs>"   Option values, "id: value; id2: value2".
  --size <WxH>          Output size in px (default 960x960).
  --fit <mode>          grid | cover | fixed (default grid).
  --scale <n>           PNG device-scale factor (default 2).
  --frames <n>          Render a PNG sequence of n frames into --out/.
  --reseed-every <n>    Frames between reseeds in a sequence (default 30).
  --browser <path>      Chromium executable (or set TABBIED_CHROMIUM).

The catalog behind list/info also ships as tabbied/catalog.json, and the full
agent-facing reference is https://tabbied.com/llms-full.txt.`;

function fail(message: string): never {
  console.error(`tabbied: ${message}`);
  process.exit(1);
}

// ---- catalog commands ------------------------------------------------------

type CatalogDesign = {
  slug: string;
  name: string;
  description?: string;
  tags: string[];
  mood: string[];
  density: string;
  goodFor: string[];
  preview: string;
  svgExport: { supported: boolean; note?: string };
};

function readCatalog(): { designs: CatalogDesign[] } {
  return JSON.parse(
    readFileSync(path.join(packageRoot, 'catalog.json'), 'utf-8')
  );
}

function runList(flags: Map<string, string>): void {
  const { designs } = readCatalog();
  const tag = flags.get('tag');
  const mood = flags.get('mood');
  const density = flags.get('density');
  const goodFor = flags.get('good-for');
  const query = flags.get('query')?.toLowerCase();

  const matches = designs.filter(
    (design) =>
      (!tag || design.tags.includes(tag)) &&
      (!mood || design.mood.includes(mood)) &&
      (!density || design.density === density) &&
      (!goodFor || design.goodFor.includes(goodFor)) &&
      (!query ||
        `${design.name} ${design.description ?? ''}`
          .toLowerCase()
          .includes(query))
  );

  for (const design of matches) {
    console.log(
      `${design.slug.padEnd(14)} ${design.density.padEnd(7)} [${design.tags.join(
        ', '
      )}] - ${design.name}`
    );
  }
  console.log(`\n${matches.length}/${designs.length} designs`);
}

function runInfo(slug: string): void {
  const design = readCatalog().designs.find((entry) => entry.slug === slug);
  if (!design) fail(`unknown design "${slug}" - try \`tabbied list\``);
  console.log(JSON.stringify(design, null, 2));
}

// ---- argument parsing ------------------------------------------------------

function parseFlags(argv: string[]): Map<string, string> {
  const flags = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) fail(`unexpected argument "${arg}"`);
    const name = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) fail(`--${name} needs a value`);
    flags.set(name, next);
    i += 1;
  }
  return flags;
}

// Option values are typed by the definition (a numeric-looking select choice
// stays a string), mirroring the data-* attribute contract in hydrate.ts.
function parseOptions(
  definition: PatternDefinition,
  raw: string
): Record<string, OptionValue> {
  const values: Record<string, OptionValue> = {};
  for (const entry of raw.split(';')) {
    if (!entry.trim()) continue;
    const separator = entry.indexOf(':');
    if (separator === -1) fail(`--options entry "${entry.trim()}" needs "id: value"`);
    const id = entry.slice(0, separator).trim();
    const value = entry.slice(separator + 1).trim();
    const option = definition.options.find((candidate) => candidate.id === id);
    if (!option) {
      fail(
        `"${definition.slug}" has no option "${id}" (has: ${definition.options
          .map((candidate) => candidate.id)
          .join(', ') || 'none'})`
      );
    }
    if (option.type === 'Slider') {
      const numeric = Number(value);
      if (value === '' || !Number.isFinite(numeric)) fail(`option "${id}" needs a number`);
      values[id] = numeric;
    } else if (option.type === 'ToggleSwitch') {
      values[id] = value === 'true' || value === '';
    } else {
      values[id] = value;
    }
  }
  return values;
}

function parseRenderArgs(argv: string[]): RenderArgs {
  const slug = argv[0];
  if (!slug || slug.startsWith('--')) fail('usage: tabbied render <slug> --out <path>');
  if (!isPatternSlug(slug)) fail(`unknown design "${slug}" - try \`tabbied list\``);
  const definition = patterns[slug];

  const flags = parseFlags(argv.slice(1));
  const out = flags.get('out');
  if (!out) fail('--out is required');

  const size = flags.get('size') ?? '960x960';
  const sizeMatch = /^(\d+)x(\d+)$/.exec(size);
  if (!sizeMatch) fail(`--size must be WxH in px, got "${size}"`);

  const fit = flags.get('fit') ?? 'grid';
  if (!['grid', 'cover', 'fixed'].includes(fit)) fail(`--fit must be grid | cover | fixed`);

  const frames = Number(flags.get('frames') ?? 0);
  const extension = path.extname(out).toLowerCase();
  let format = flags.get('format') as 'svg' | 'png' | undefined;
  if (!format) {
    if (frames > 0) format = 'png';
    else if (extension === '.svg') format = 'svg';
    else if (extension === '.png') format = 'png';
    else fail(`--out needs a .svg or .png extension (or pass --format)`);
  }
  if (format === 'svg' && frames > 0) fail('--frames renders PNG sequences only');

  return {
    slug,
    out,
    seed: flags.get('seed') ?? Math.random().toString(36).slice(2, 6),
    palette:
      flags
        .get('palette')
        ?.split(',')
        .map((color) => color.trim())
        .filter(Boolean) ?? null,
    options: flags.has('options')
      ? parseOptions(definition, flags.get('options')!)
      : {},
    width: Number(sizeMatch![1]),
    height: Number(sizeMatch![2]),
    fit: fit as RenderArgs['fit'],
    format,
    scale: Number(flags.get('scale') ?? 2),
    frames,
    reseedEvery: Number(flags.get('reseed-every') ?? 30),
    browser: flags.get('browser') ?? process.env.TABBIED_CHROMIUM ?? null,
  };
}

// ---- rendering -------------------------------------------------------------

// The page needs the package's ESM by URL; a throwaway local server is the
// one approach that works everywhere (file:// module imports don't).
const MIME: Record<string, string> = {
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.html': 'text/html',
};

const PAGE = `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:#fff}#stage{overflow:hidden}</style>
<div id="stage"></div>
<script type="importmap">{"imports":{"css-doodle":"/css-doodle.js"}}</script>
<script type="module">
  import 'css-doodle';
  import { createPattern } from '/pkg/dist/core/index.js';
  window.__mount = (definition, config) => new Promise((ready) => {
    const stage = document.getElementById('stage');
    stage.style.width = config.width + 'px';
    stage.style.height = config.height + 'px';
    stage.style.background = (config.palette && config.palette[0]) || definition.palette?.[0] || '#fff';
    window.__controller = createPattern(stage, { ...config, pattern: definition, onReady: ready });
  });
  window.__redraw = (seed) => { window.__controller.redraw(seed); };
  window.__exportSvg = async () => {
    const { svg, warnings } = await window.__controller.exportSvg();
    return { svg, warnings };
  };
</script>`;

async function loadChromium(): Promise<{ chromium: any }> {
  for (const name of ['playwright', 'playwright-core', '@playwright/test']) {
    try {
      return await import(name);
    } catch {
      // try the next one
    }
  }
  fail(
    'rendering needs a headless browser via Playwright. Install one of\n' +
      '  npm i -D playwright   (or playwright-core / @playwright/test)\n' +
      'and, if it has no bundled browser, point --browser (or TABBIED_CHROMIUM) at a Chromium binary.'
  );
}

async function runRender(args: RenderArgs): Promise<void> {
  const definition = patterns[args.slug as keyof typeof patterns];

  if (args.format === 'svg' && (definition as PatternDefinition).svgExport === false) {
    fail(
      `"${args.slug}" paints effects SVG cannot represent (svgExport: false) - render it as PNG instead`
    );
  }

  const cssDoodlePath = require.resolve('css-doodle');

  const server = createServer((request, response) => {
    const url = decodeURIComponent((request.url ?? '/').split('?')[0]);
    let file: string | null = null;
    if (url === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html' }).end(PAGE);
      return;
    }
    if (url === '/css-doodle.js') file = cssDoodlePath;
    else if (url.startsWith('/pkg/')) {
      const candidate = path.join(packageRoot, url.slice('/pkg/'.length));
      if (candidate.startsWith(packageRoot)) file = candidate;
    }
    try {
      if (!file) throw new Error('not found');
      const body = readFileSync(file);
      response
        .writeHead(200, {
          'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream',
        })
        .end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  const { chromium } = await loadChromium();
  const browser = await chromium.launch(
    args.browser ? { executablePath: args.browser } : {}
  );

  try {
    const context = await browser.newContext({
      viewport: { width: args.width, height: args.height },
      deviceScaleFactor: args.scale,
      // Sequences must cut between frames, not catch mid-transition blurs;
      // the controller mutes the authored transitions under reduced motion.
      reducedMotion: args.frames > 0 ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    page.on('pageerror', (error: Error) =>
      console.error(`  pageerror: ${error.message.split('\n')[0]}`)
    );
    await page.goto(`http://127.0.0.1:${port}/`);

    const config = {
      seed: args.seed,
      fit: args.fit,
      width: args.width,
      height: args.height,
      ...(args.palette ? { palette: args.palette } : {}),
      ...(Object.keys(args.options).length ? { options: args.options } : {}),
    };
    await page.evaluate(
      // eslint-disable-next-line no-eval -- runs in the page, not in node
      ([def, cfg]: [unknown, unknown]) =>
        (window as any).__mount(def, cfg),
      [definition, config] as [unknown, unknown]
    );
    await page.waitForTimeout(600); // let the first arrangement settle

    if (args.frames > 0) {
      mkdirSync(args.out, { recursive: true });
      const pad = String(args.frames).length;
      for (let frame = 0; frame < args.frames; frame += 1) {
        if (frame > 0 && frame % args.reseedEvery === 0) {
          const generation = frame / args.reseedEvery;
          await page.evaluate(
            (seed: string) => (window as any).__redraw(seed),
            `${args.seed}-${generation}`
          );
          await page.waitForTimeout(60);
        }
        const name = `frame-${String(frame).padStart(pad, '0')}.png`;
        await page
          .locator('#stage')
          .screenshot({ path: path.join(args.out, name) });
      }
      console.log(
        `rendered ${args.frames} frames of ${args.slug} into ${args.out}/ ` +
          `(reseed every ${args.reseedEvery})`
      );
    } else if (args.format === 'png') {
      mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });
      await page.locator('#stage').screenshot({ path: args.out });
      console.log(
        `rendered ${args.slug} -> ${args.out} (${args.width}x${args.height} @${args.scale}x, seed ${args.seed})`
      );
    } else {
      const { svg, warnings } = await page.evaluate(() =>
        (window as any).__exportSvg()
      );
      mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });
      writeFileSync(args.out, svg);
      for (const warning of warnings ?? []) console.warn(`  note: ${warning}`);
      console.log(
        `exported ${args.slug} -> ${args.out} (${args.width}x${args.height}, seed ${args.seed})`
      );
    }
  } finally {
    await browser.close();
    server.close();
  }
}

// ---- entry -----------------------------------------------------------------

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);

  if (!command || command === '--help' || command === 'help') {
    console.log(HELP);
    return;
  }
  if (command === 'list') {
    runList(parseFlags(rest));
    return;
  }
  if (command === 'info') {
    if (!rest[0]) fail('usage: tabbied info <slug>');
    runInfo(rest[0]);
    return;
  }
  if (command === 'render') {
    await runRender(parseRenderArgs(rest));
    return;
  }
  fail(`unknown command "${command}" - try \`tabbied --help\``);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
