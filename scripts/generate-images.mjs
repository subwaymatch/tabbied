#!/usr/bin/env node
/**
 * Generate images with OpenAI's GPT Image 2, from data/image-prompts.json.
 *
 * Size and quality are resolved per prompt (prompt -> set -> project -> defaults), so one
 * batch can mix a 1024x1536 medium-quality portrait with a 1536x1024 low-quality
 * illustration. The CLI flags are overrides, not defaults.
 *
 * Uses the Batch API (~50% cheaper). Prompts are chunked into --batch-size jobs and
 * every output file is parsed as a STREAM, never buffered whole: images come back as
 * inline base64 (~3.6 MB each), so a 1000-image batch would build a ~3.6 GB string and
 * blow V8's ~512 MB cap.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-images.mjs <command> [options]
 *
 * Commands:
 *   dry-run    print the rendered prompts, targets and projected cost; no API calls
 *   submit     upload the JSONL batches and create them; prints the ids
 *   status     show batch status (--batch <id>, or every batch last submitted)
 *   download   download completed batches' images into --out
 *   sync       generate immediately, one request per prompt (bounded concurrency)
 *
 * Options:
 *   --project <id>       Only this project
 *   --only <id[,id...]>  Only these prompt ids
 *   --slot <name>        Only this slot
 *   --out <dir>          Output directory (default: ./generated-images)
 *   --size <WxH>         OVERRIDE every entry's size (1536x1024|1024x1536|1024x1024)
 *   --quality <q>        OVERRIDE every entry's quality (low|medium|high)
 *   --output-format <f>  png | webp | jpeg (default: png)
 *   --model <name>       Override the model (default: JSON meta.model)
 *   --batch-size <n>     Prompts per batch job (default: 100)
 *   --batch <id>         Target batch id for status / download
 *   --concurrency <n>    `sync` parallel requests (default: 3)
 *   --force              Overwrite existing images (default: skip present)
 *   -h, --help           Show this help
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadPromptData, selectPrompts } from "./lib/prompts.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DATA_FILE = join(ROOT, "data", "image-prompts.json");
const API_BASE = "https://api.openai.com/v1";
// Two spellings of the same endpoint, and they are not interchangeable.
// `IMAGES_ENDPOINT` goes inside the Batch API's JSONL and create call, which
// wants an absolute API path. `IMAGES_PATH` is for direct calls through api(),
// which prepends API_BASE - already ending in /v1, so passing the other one
// there asks for /v1/v1/... and 404s.
const IMAGES_ENDPOINT = "/v1/images/generations";
const IMAGES_PATH = "/images/generations";

const COMMANDS = new Set(["dry-run", "submit", "status", "download", "sync"]);
const SIZES = new Set(["1536x1024", "1024x1536", "1024x1024"]);
const QUALITIES = new Set(["low", "medium", "high"]); // "auto" excluded on purpose

function parseArgs(argv) {
  const opts = {
    command: null, project: null, only: null, slot: null,
    out: join(process.cwd(), "generated-images"),
    size: null, quality: null, outputFormat: "png", model: null,
    batchSize: 100, batch: null, concurrency: 3, force: false, help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--project": opts.project = next(); break;
      case "--only": opts.only = next().split(",").map((s) => s.trim()).filter(Boolean); break;
      case "--slot": opts.slot = next(); break;
      case "--out": opts.out = next(); break;
      case "--size": opts.size = next(); break;
      case "--quality": opts.quality = next(); break;
      case "--output-format": opts.outputFormat = next(); break;
      case "--model": opts.model = next(); break;
      case "--batch-size": opts.batchSize = Math.max(1, Number(next()) || 100); break;
      case "--batch": opts.batch = next(); break;
      case "--concurrency": opts.concurrency = Math.max(1, Number(next()) || 1); break;
      case "--force": opts.force = true; break;
      case "-h": case "--help": opts.help = true; break;
      default:
        if (!a.startsWith("-") && opts.command === null && COMMANDS.has(a)) opts.command = a;
        else { console.error(`Unknown argument: ${a}`); process.exit(1); }
    }
  }
  return opts;
}

function printHelp() {
  const src = readFileSync(fileURLToPath(import.meta.url), "utf8");
  console.log(src.slice(src.indexOf("/**"), src.indexOf("*/") + 2).replace(/^\/\*\*?|\*\/$|^ \* ?/gm, "").trim());
}

// ── Cost estimation ─────────────────────────────────────────────────────────
// Image output tokens per request, measured against gpt-image-2 on 2026-07-28.
// 1024x1536 is assumed equal to 1536x1024 (same pixel count) - verify before a
// large portrait run.
const COST_TOKENS = {
  "1024x1024/low": 196, "1024x1024/medium": 1372, "1024x1024/high": 5488,
  "1536x1024/low": 158, "1536x1024/medium": 1372, "1536x1024/high": 5488,
  "1024x1536/low": 158, "1024x1536/medium": 1372, "1024x1536/high": 5488,
};
const USD_PER_MTOK = { batch: 15, sync: 30 };

const sizeOf = (e, opts) => opts.size || e.size;
const qualityOf = (e, opts) => opts.quality || e.quality;

function describeCost(entries, opts, mode) {
  let tokens = 0;
  for (const e of entries) {
    const t = COST_TOKENS[`${sizeOf(e, opts)}/${qualityOf(e, opts)}`];
    if (t === undefined) return `cost not estimable for ${sizeOf(e, opts)}/${qualityOf(e, opts)}`;
    tokens += t;
  }
  return `~$${((tokens * USD_PER_MTOK[mode]) / 1e6).toFixed(2)} projected (${mode} pricing)`;
}

const outputExt = (opts) => (opts.outputFormat === "jpeg" ? "jpg" : opts.outputFormat);

function requestBody(e, opts, model) {
  const body = { model, prompt: e.prompt, size: sizeOf(e, opts), quality: qualityOf(e, opts), n: 1 };
  // Cut-outs are generated with a real alpha channel: gpt-image-2 honors
  // background:"transparent" now (it used to 400 on it), which is what retired
  // the separate background-removal vendor. Transparency needs an alpha-capable
  // output format - png (the default) or webp. See docs/image-pipeline.md.
  if (e.cutout) body.background = "transparent";
  if (opts.outputFormat !== "png") body.output_format = opts.outputFormat;
  return body;
}

// ── OpenAI helpers ──────────────────────────────────────────────────────────
function requireKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) { console.error("OPENAI_API_KEY is not set."); process.exit(1); }
  return key;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const RETRY_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

/**
 * One OpenAI API call. `retries` defaults to 0 and is opted into PER CALL SITE,
 * deliberately: this helper also creates batches and submits generations, and
 * silently re-sending one of those would duplicate work and double the bill.
 * Only idempotent GETs pass a retry count.
 */
async function api(path, { method = "GET", key, json, form, retries = 0 } = {}) {
  const headers = { Authorization: `Bearer ${key}` };
  let body;
  if (json !== undefined) { headers["Content-Type"] = "application/json"; body = JSON.stringify(json); }
  else if (form !== undefined) body = form; // fetch sets the multipart boundary

  for (let attempt = 0; ; attempt++) {
    let res, networkErr;
    try { res = await fetch(`${API_BASE}${path}`, { method, headers, body }); }
    catch (err) { networkErr = err; } // DNS, TLS, socket reset - retryable like a 5xx
    if (res?.ok) return res;

    const transient = networkErr !== undefined || RETRY_STATUS.has(res?.status);
    if (!transient || attempt >= retries) {
      if (networkErr) throw networkErr;
      const detail = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}${detail ? ` - ${detail}` : ""}`);
    }
    const waitMs = Math.min(32_000, 2_000 * 2 ** attempt);
    console.error(`  ... ${method} ${path} failed; retry ${attempt + 1}/${retries} in ${waitMs / 1000}s`);
    await sleep(waitMs);
  }
}

const BATCH_STATE_FILE = (out) => join(out, "last-batch.json");

function chunk(entries, size) {
  const out = [];
  for (let i = 0; i < entries.length; i += size) out.push(entries.slice(i, i + size));
  return out;
}

function decodeImage(respBody) {
  const b64 = respBody?.data?.[0]?.b64_json;
  if (!b64) throw new Error("response contained no image data (b64_json)");
  return Buffer.from(b64, "base64");
}

// ── Commands ────────────────────────────────────────────────────────────────
function cmdDryRun(entries, opts) {
  const ext = outputExt(opts);
  console.log(
    `[dry-run] ${entries.length} prompt(s) · ${chunk(entries, opts.batchSize).length} batch job(s)\n` +
      `          ${describeCost(entries, opts, "batch")}\n`,
  );
  for (const e of entries) {
    console.log(
      `── ${e.id}.${ext}  (${e.project}${e.slot ? `/${e.slot}` : ""} · ` +
        `${sizeOf(e, opts)} · ${qualityOf(e, opts)} · ${e.cutout ? "cutout" : "full-bleed"})`,
    );
    console.log(e.prompt.replace(/^/gm, "   "));
    console.log();
  }
}

async function submitChunk(entries, opts, model, key, label) {
  const jsonl = entries
    .map((e) => JSON.stringify({
      custom_id: e.id, method: "POST", url: IMAGES_ENDPOINT, body: requestBody(e, opts, model),
    }))
    .join("\n");

  const form = new FormData();
  form.append("purpose", "batch");
  form.append("file", new Blob([jsonl], { type: "application/jsonl" }), "image-batch.jsonl");
  const file = await (await api("/files", { method: "POST", key, form })).json();

  const batch = await (await api("/batches", {
    method: "POST", key,
    json: { input_file_id: file.id, endpoint: IMAGES_ENDPOINT, completion_window: "24h" },
  })).json();
  console.log(`  ${label} -> batch ${batch.id} (${entries.length} requests, ${batch.status})`);
  return batch;
}

function saveBatchState(opts, model, batches, total) {
  mkdirSync(opts.out, { recursive: true });
  writeFileSync(
    BATCH_STATE_FILE(opts.out),
    JSON.stringify({ model, count: total, batchIds: batches.map((b) => b.id) }, null, 2),
  );
}

async function cmdSubmit(entries, opts, model, key) {
  const chunks = chunk(entries, opts.batchSize);
  console.log(`Submitting ${entries.length} prompt(s) across ${chunks.length} batch job(s)...`);
  const batches = [];
  for (const [i, c] of chunks.entries()) {
    batches.push(await submitChunk(c, opts, model, key, `[${i + 1}/${chunks.length}]`));
    saveBatchState(opts, model, batches, entries.length);
  }
  console.log(`\nTrack with:  node scripts/generate-images.mjs status --out ${opts.out}`);
}

function resolveBatchIds(opts) {
  if (opts.batch) return [opts.batch];
  const stateFile = BATCH_STATE_FILE(opts.out);
  if (existsSync(stateFile)) {
    const ids = JSON.parse(readFileSync(stateFile, "utf8")).batchIds || [];
    if (ids.length) return ids;
  }
  console.error("No --batch id given and no last-batch.json in --out.");
  process.exit(1);
}

// Polled for the life of a run; one transient 5xx must not end it.
const retrieveBatch = async (id, key) => (await api(`/batches/${id}`, { key, retries: 5 })).json();

async function cmdStatus(opts, key) {
  for (const id of resolveBatchIds(opts)) {
    const b = await retrieveBatch(id, key);
    const c = b.request_counts || {};
    console.log(`Batch ${b.id}: ${b.status} · ${c.completed ?? 0}/${c.total ?? "?"} done, ${c.failed ?? 0} failed`);
  }
}

/**
 * Yield an output file's JSONL rows one line at a time. Batch image output embeds
 * each PNG as base64, so these files run to gigabytes; res.text() would exceed
 * V8's ~512 MB max string length.
 */
async function* streamFileLines(fileId, key) {
  const res = await api(`/files/${fileId}/content`, { key, retries: 5 });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.trim()) yield line;
    }
  }
  buf += decoder.decode();
  if (buf.trim()) yield buf;
}

async function downloadBatch(b, opts, key) {
  if (b.status !== "completed") { console.error(`  ! batch ${b.id} is ${b.status}, skipping`); return { ok: 0, failed: 0 }; }
  if (b.error_file_id) {
    for await (const line of streamFileLines(b.error_file_id, key)) {
      const row = JSON.parse(line);
      console.error(`  ! ${row.custom_id}: ${row.response?.body?.error?.message || "request errored"}`);
    }
  }
  if (!b.output_file_id) { console.error(`  ! batch ${b.id} has no output file`); return { ok: 0, failed: 0 }; }

  const ext = outputExt(opts);
  let ok = 0, failed = 0;
  for await (const line of streamFileLines(b.output_file_id, key)) {
    const row = JSON.parse(line);
    if (row.error || row.response?.status_code !== 200) {
      failed++;
      console.error(`  failed ${row.custom_id}: ${row.error?.message || row.response?.body?.error?.message || "unknown error"}`);
      continue;
    }
    const dest = join(opts.out, `${row.custom_id}.${ext}`);
    if (!opts.force && existsSync(dest)) { console.log(`  - skip ${row.custom_id} (exists; use --force)`); continue; }
    try {
      writeFileSync(dest, decodeImage(row.response.body));
      ok++; console.log(`  ok ${row.custom_id}.${ext}`);
    } catch (err) { failed++; console.error(`  failed ${row.custom_id}: ${err.message}`); }
  }
  return { ok, failed };
}

async function cmdDownload(opts, key) {
  mkdirSync(opts.out, { recursive: true });
  const batches = await Promise.all(resolveBatchIds(opts).map((id) => retrieveBatch(id, key)));
  let ok = 0, failed = 0;
  for (const b of batches) { const r = await downloadBatch(b, opts, key); ok += r.ok; failed += r.failed; }
  console.log(`\nDone: ${ok} written, ${failed} failed. Output in ${opts.out}`);
  if (failed) process.exitCode = 1;
}

async function cmdSync(entries, opts, model, key) {
  mkdirSync(opts.out, { recursive: true });
  const ext = outputExt(opts);
  const todo = entries.filter((e) => {
    if (!opts.force && existsSync(join(opts.out, `${e.id}.${ext}`))) {
      console.log(`  - skip ${e.id} (exists; use --force)`); return false;
    }
    return true;
  });
  if (!todo.length) return console.log("Nothing to generate.");

  let i = 0, ok = 0, failed = 0;
  async function worker() {
    while (i < todo.length) {
      const e = todo[i++];
      try {
        const res = await api(IMAGES_PATH, { method: "POST", key, json: requestBody(e, opts, model) });
        writeFileSync(join(opts.out, `${e.id}.${ext}`), decodeImage(await res.json()));
        ok++; console.log(`  ok ${e.id}.${ext}`);
      } catch (err) { failed++; console.error(`  failed ${e.id}: ${err.message}`); }
    }
  }
  await Promise.all(Array.from({ length: Math.min(opts.concurrency, todo.length) }, worker));
  console.log(`\nDone: ${ok} generated, ${failed} failed. Output in ${opts.out}`);
  if (failed) process.exitCode = 1;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.command) return printHelp();

  if (!["png", "webp", "jpeg"].includes(opts.outputFormat)) {
    console.error(`Unsupported --output-format "${opts.outputFormat}". Use png, webp, or jpeg.`); process.exit(1);
  }
  if (opts.quality && !QUALITIES.has(opts.quality)) {
    console.error(`Unsupported --quality "${opts.quality}". Use ${[...QUALITIES].join(", ")}.`); process.exit(1);
  }
  if (opts.size && !SIZES.has(opts.size)) {
    console.error(`Unsupported --size "${opts.size}". Use ${[...SIZES].join(", ")}.`); process.exit(1);
  }

  const data = loadPromptData(DATA_FILE);
  const model = opts.model || data.meta.model;

  if (opts.command === "status") return cmdStatus(opts, requireKey());
  if (opts.command === "download") return cmdDownload(opts, requireKey());

  const entries = selectPrompts(data, { only: opts.only, project: opts.project, slot: opts.slot });
  if (!entries.length) { console.error("No prompts matched the filters."); process.exit(1); }

  // Every entry's resolved size/quality must be one the API accepts.
  for (const e of entries) {
    if (!SIZES.has(sizeOf(e, opts))) throw new Error(`prompt "${e.id}": unsupported size "${sizeOf(e, opts)}"`);
    if (!QUALITIES.has(qualityOf(e, opts))) throw new Error(`prompt "${e.id}": unsupported quality "${qualityOf(e, opts)}"`);
  }

  if (opts.command === "dry-run") return cmdDryRun(entries, opts);

  const mode = opts.command === "sync" ? "sync" : "batch";
  console.log(
    `${entries.length} prompt(s) · model ${model} · ${outputExt(opts)} · out ${opts.out}\n` +
      `${describeCost(entries, opts, mode)}\n`,
  );
  const key = requireKey();
  if (opts.command === "sync") return cmdSync(entries, opts, model, key);
  if (opts.command === "submit") return cmdSubmit(entries, opts, model, key);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((err) => { console.error(err.message || err); process.exit(1); });
}
