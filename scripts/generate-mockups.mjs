#!/usr/bin/env node
/**
 * Put a real Tabbied pattern onto a real-looking object.
 *
 * The flow is render-then-EDIT, not text-to-image:
 *
 *   packages/tabbied/patterns/<design>.json
 *      │  scripts/render-pattern.mjs (headless Chromium)
 *      ▼
 *   generated-images/refs/<id>-ref.png     <- the actual pattern, exact pixels
 *      │  POST /v1/images/edits  (multipart; the ref is the `image` field)
 *      ▼
 *   generated-images/mockups/<id>.png      <- the object wearing the pattern
 *
 * Why the edits endpoint and not a text prompt: the model cannot execute
 * css-doodle, so describing the pattern in words yields something that merely
 * resembles ours. Handing it the rendered pixels is the only way the geometry
 * in the mockup is our geometry. The model still REDRAWS what it is given, so
 * expect a faithful impression rather than a pixel match; §"Fidelity tiers" in
 * docs/pattern-mockups.md covers when to composite exactly instead.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-mockups.mjs [options]
 *
 * Options:
 *   --only <id[,id..]>  Only these mockup ids
 *   --refs-only         Render the pattern references and stop (no API calls, free)
 *   --out <dir>         Output directory (default: ./generated-images/mockups)
 *   --quality <q>       low | medium | high (default: the JSON's meta.defaults)
 *   --fidelity <f>      Send input_fidelity (gpt-image-1 only; gpt-image-2
 *                       rejects it with invalid_input_fidelity_model)
 *   --concurrency <n>   Parallel edit requests (default: 2)
 *   --force             Regenerate mockups that already exist
 *   -h, --help          Show this help
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderPattern } from './render-pattern.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DATA_FILE = join(ROOT, 'data', 'mockup-prompts.json');
const REF_DIR = join(ROOT, 'generated-images', 'refs');
const EDITS_URL = 'https://api.openai.com/v1/images/edits';

function parseArgs(argv) {
  const o = { only: null, refsOnly: false, out: join(ROOT, 'generated-images', 'mockups'),
              quality: null, fidelity: null, concurrency: 2, force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const next = () => argv[++i];
    switch (argv[i]) {
      case '--only': o.only = next().split(',').map((s) => s.trim()).filter(Boolean); break;
      case '--refs-only': o.refsOnly = true; break;
      case '--out': o.out = resolve(next()); break;
      case '--quality': o.quality = next(); break;
      case '--fidelity': o.fidelity = next(); break;
      case '--concurrency': o.concurrency = Math.max(1, Number(next()) || 2); break;
      case '--force': o.force = true; break;
      case '-h': case '--help': o.help = true; break;
      default: console.error(`Unknown argument: ${argv[i]}`); process.exit(1);
    }
  }
  return o;
}

function printHelp() {
  const src = readFileSync(fileURLToPath(import.meta.url), 'utf8');
  console.log(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2).replace(/^\/\*\*?|\*\/$|^ \* ?/gm, '').trim());
}

/**
 * The instruction that does the work. Everything before the fidelity clause is
 * ordinary scene direction; the fidelity clause is what stops the model
 * treating the reference as loose inspiration.
 */
export function buildPrompt(m) {
  return [
    `A product photograph of ${m.subject}.`,
    'The pattern in the provided image is the printed design on it:',
    'reproduce that pattern faithfully, keeping its exact colours, geometry and',
    'proportions, wrapped naturally over the surface with the scene\'s own',
    'lighting, perspective and any folds or curvature.',
    'Nothing else in the frame carries the pattern.',
    'No text, letters, numbers, or logos.',
  ].join(' ');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One edit call. Deliberately NOT retried: this POST creates paid work, and a
 * silent re-send would double the bill. A failure is reported and the run
 * carries on with the other mockups.
 */
async function editImage({ refPath, prompt, size, quality, fidelity, model, key }) {
  const form = new FormData();
  form.append('model', model);
  form.append('prompt', prompt);
  form.append('size', size);
  form.append('quality', quality);
  form.append('n', '1');
  if (fidelity) form.append('input_fidelity', fidelity);
  form.append('image', new Blob([readFileSync(refPath)], { type: 'image/png' }), 'reference.png');

  const res = await fetch(EDITS_URL, { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text().catch(() => '')).slice(0, 300)}`);
  const body = await res.json();
  const b64 = body?.data?.[0]?.b64_json;
  if (!b64) throw new Error('response contained no image data');
  return Buffer.from(b64, 'base64');
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return printHelp();

  const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  const model = data.meta?.model ?? 'gpt-image-2';
  const defaults = data.meta?.defaults ?? {};
  let list = data.mockups;
  if (opts.only) list = list.filter((m) => opts.only.includes(m.id));
  if (!list.length) { console.error('No mockups matched.'); process.exit(1); }

  // 1. Render each reference. Free, deterministic, and worth eyeballing before
  //    spending anything on the edit.
  console.log(`Rendering ${list.length} pattern reference(s)...`);
  mkdirSync(REF_DIR, { recursive: true });
  for (const m of list) {
    const out = join(REF_DIR, `${m.id}-ref.png`);
    if (!opts.force && existsSync(out)) { console.log(`  - ${m.id} ref exists`); m._ref = out; continue; }
    const a = m.pattern;
    await renderPattern({ design: a.design, out, palette: a.palette ?? null, seed: a.seed ?? m.id,
                          width: a.width ?? 1024, height: a.height ?? 1024, fit: a.fit ?? 'grid',
                          cell: a.cell ?? null, scale: 2 });
    console.log(`  ok ${m.id}-ref.png (${a.design})`);
    m._ref = out;
  }
  if (opts.refsOnly) return console.log(`\nReferences in ${REF_DIR}. Review, then rerun without --refs-only.`);

  const key = process.env.OPENAI_API_KEY;
  if (!key) { console.error('OPENAI_API_KEY is not set.'); process.exit(1); }
  mkdirSync(opts.out, { recursive: true });

  const todo = list.filter((m) => {
    if (!opts.force && existsSync(join(opts.out, `${m.id}.png`))) { console.log(`  - skip ${m.id} (exists)`); return false; }
    return true;
  });
  if (!todo.length) return console.log('Nothing to generate.');

  console.log(`\nEditing ${todo.length} mockup(s) · ${model}` +
    (opts.fidelity ? ` · input_fidelity ${opts.fidelity}` : ''));
  let i = 0, ok = 0, failed = 0;
  async function worker() {
    while (i < todo.length) {
      const m = todo[i++];
      const prompt = buildPrompt(m);
      try {
        const buf = await editImage({
          refPath: m._ref, prompt, size: m.size ?? defaults.size ?? '1024x1024',
          quality: opts.quality ?? m.quality ?? defaults.quality ?? 'low',
          fidelity: opts.fidelity, model, key,
        });
        writeFileSync(join(opts.out, `${m.id}.png`), buf);
        ok++; console.log(`  ok ${m.id}.png (${(buf.length / 1e6).toFixed(2)}MB)`);
      } catch (err) { failed++; console.error(`  failed ${m.id}: ${err.message}`); }
      await sleep(250);
    }
  }
  await Promise.all(Array.from({ length: Math.min(opts.concurrency, todo.length) }, worker));
  console.log(`\nDone: ${ok} generated, ${failed} failed. Output in ${opts.out}`);
  console.log('Compare each against its reference before promoting (docs/pattern-mockups.md).');
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((err) => { console.error(err.message || err); process.exit(1); });
}
