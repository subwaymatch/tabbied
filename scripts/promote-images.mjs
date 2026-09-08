#!/usr/bin/env node
/**
 * Promote chosen candidates into the repository: encode to WebP q92 straight into
 * `public/images/sites/`, the files the site serves, then rebuild the manifest.
 *
 * Promotion follows the `cutout` flag:
 *   cutout: false -> commits <id>.webp            (a scene, served full-bleed)
 *   cutout: true  -> commits <id>-cutout.webp     (an object, placed on a pattern)
 *
 * Cut-outs come straight from generation now - gpt-image-2 emits a real alpha
 * channel (background:"transparent"), so <id>.png IS the cut-out and is promoted
 * under the -cutout name (the committed filename contract does not move). A
 * legacy <id>-cutout.png from the retired background-removal pass wins when
 * present, so re-promoting an old project can't regress to its opaque original;
 * --keep-original only means anything in that legacy layout.
 *
 * A cutout:true prompt with no candidate on disk is an ERROR, not a silent skip:
 * that combination is what leaves a page serving a stale image after a
 * regeneration. So is a native cut-out source with no transparent pixels.
 *
 * Why WebP, and why this writes the served file directly: a 1536x1024 image is ~1.4 MB
 * as PNG and ~130 kB as WebP. And routing it through a second encoder later is a double
 * lossy pass - measured, promote-q92 -> build-q80 lands at 35.58 dB PSNR against the PNG
 * original while a single q80 encode is 37.41 dB. The second pass costs ~1.8 dB to save
 * ~3 kB. Because the promoted file IS the artifact, --quality is the quality users
 * actually see; it defaults to 92 rather than a serving-oriented 80.
 *
 * Usage:
 *   node scripts/promote-images.mjs [options]
 *
 * Options:
 *   --project <id>    Only this project
 *   --only <id[,id..]> Only these prompt ids
 *   --from <dir>      Candidate directory (default: ./generated-images)
 *   --quality <n>     WebP quality of the served image (default: 92)
 *   --keep-original   Legacy layouts only: also promote the opaque original beside a cut-out
 *   --no-build        Skip the manifest rebuild afterwards
 *   --dry-run         Report what would be promoted; write nothing
 *   -h, --help        Show this help
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import { CUTOUT_SUFFIX, loadPromptData, selectPrompts } from "./lib/prompts.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DATA_FILE = join(ROOT, "data", "image-prompts.json");
// Promotion writes the *served* file directly. There is deliberately no source copy
// elsewhere: that would put every image in git twice and add a second lossy encode.
const OUT_DIR = join(ROOT, "public", "images", "sites");

function parseArgs(argv) {
  const opts = {
    project: null, only: null, from: join(process.cwd(), "generated-images"),
    quality: 92, keepOriginal: false, build: true, dryRun: false, help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--project": opts.project = next(); break;
      case "--only": opts.only = next().split(",").map((x) => x.trim()).filter(Boolean); break;
      case "--from": opts.from = next(); break;
      case "--quality": opts.quality = Math.min(100, Math.max(1, Number(next()) || 92)); break;
      case "--keep-original": opts.keepOriginal = true; break;
      case "--no-build": opts.build = false; break;
      case "--dry-run": opts.dryRun = true; break;
      case "-h": case "--help": opts.help = true; break;
      default: console.error(`Unknown argument: ${a}`); process.exit(1);
    }
  }
  return opts;
}

function printHelp() {
  const src = readFileSync(fileURLToPath(import.meta.url), "utf8");
  console.log(src.slice(src.indexOf("/**"), src.indexOf("*/") + 2).replace(/^\/\*\*?|\*\/$|^ \* ?/gm, "").trim());
}

/**
 * Convert one image buffer to the committed WebP.
 * `nearLossless` is not used: these are photographic-ish raster renders, so plain
 * high-quality WebP is both smaller and visually equivalent. alphaQuality 100 matters
 * here - every cut-out lands on a busy pattern, where a lossy alpha edge shows.
 */
export async function toWebp(buf, quality) {
  return sharp(buf).webp({ quality, alphaQuality: 100, effort: 6 }).toBuffer();
}

/** The promote jobs for one resolved prompt ({src, out} stems), or an error. */
function plan(r, opts) {
  const src = (stem) => join(opts.from, `${stem}.png`);
  if (!r.cutout) {
    return existsSync(src(r.id))
      ? { jobs: [{ src: r.id, out: r.id }] }
      : { error: `no ${r.id}.png in ${opts.from}` };
  }
  const cutStem = `${r.id}${CUTOUT_SUFFIX}`;
  // Generation returns the cut-out directly (background:"transparent"), so the
  // original IS the cut-out. A legacy <id>-cutout.png beside it is output from
  // the retired removal pass and takes precedence - its sibling <id>.png is the
  // OPAQUE original in that layout, and promoting it as the cut-out would ship
  // an un-cut image under the -cutout name.
  const legacy = existsSync(src(cutStem));
  const native = existsSync(src(r.id));
  if (!legacy && !native) {
    const stale = existsSync(join(OUT_DIR, `${cutStem}.webp`));
    return {
      error:
        `cutout:true but neither ${cutStem}.png nor ${r.id}.png in ${opts.from}.` +
        (stale
          ? `\n    public/images/sites/${cutStem}.webp already exists, so the site will KEEP SERVING THE OLD IMAGE.`
          : "") +
        `\n    Regenerate: node scripts/generate-images.mjs submit --only ${r.id} --force`,
    };
  }
  // requireAlpha guards the native path: an opaque PNG promoted under the
  // -cutout name is exactly the silent failure this script exists to refuse.
  const jobs = [{ src: legacy ? cutStem : r.id, out: cutStem, requireAlpha: !legacy }];
  if (opts.keepOriginal && legacy && native) jobs.push({ src: r.id, out: r.id });
  return { jobs };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return printHelp();

  if (!existsSync(opts.from)) { console.error(`Source directory not found: ${opts.from}`); process.exit(1); }
  const data = loadPromptData(DATA_FILE);
  const selected = selectPrompts(data, { only: opts.only, project: opts.project });
  if (!selected.length) { console.error("No prompts matched the filters."); process.exit(1); }

  const jobs = [];
  let errors = 0;
  for (const r of selected) {
    const p = plan(r, opts);
    if (p.error) { errors++; console.error(`  failed ${r.id}: ${p.error}`); continue; }
    jobs.push(...p.jobs);
  }
  if (!jobs.length) { console.error("\nNothing to promote."); process.exit(1); }

  console.log(
    `\nPromoting ${jobs.length} image(s) from ${opts.from} -> public/images/sites ` +
      `(webp q${opts.quality})${opts.dryRun ? " [dry-run]" : ""}\n`,
  );
  if (!opts.dryRun) mkdirSync(OUT_DIR, { recursive: true });

  let promoted = 0, before = 0, after = 0;
  for (const job of jobs) {
    const raw = readFileSync(join(opts.from, `${job.src}.png`));
    if (job.requireAlpha) {
      const alpha = (await sharp(raw).stats()).channels[3];
      if (!alpha || alpha.min === 255) {
        errors++;
        console.error(
          `  failed ${job.out}: ${job.src}.png has no transparent pixels - a cut-out generated ` +
            `before native alpha, or a failed transparency request. Regenerate it ` +
            `(cutout prompts send background:"transparent").`,
        );
        continue;
      }
    }
    const webp = await toWebp(raw, opts.quality);
    before += raw.length; after += webp.length;
    if (!opts.dryRun) writeFileSync(join(OUT_DIR, `${job.out}.webp`), webp);
    promoted++;
    console.log(`  ok ${job.out}.webp  ${(raw.length / 1e6).toFixed(2)}MB -> ${(webp.length / 1e6).toFixed(2)}MB`);
  }
  console.log(
    `\n${promoted} promoted · ${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(1)}MB ` +
      `(${after ? (before / after).toFixed(1) : "1.0"}x smaller)` +
      (errors ? ` · ${errors} skipped with errors` : ""),
  );

  if (opts.dryRun) return;
  if (opts.build) {
    console.log("\nRebuilding the image manifest...");
    execFileSync(process.execPath, [join(ROOT, "scripts", "build-image-manifest.mjs")], { stdio: "inherit" });
  } else {
    console.log("Skipped the manifest rebuild (--no-build); run `npm run build:images`.");
  }
  if (errors) process.exitCode = 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((err) => { console.error(err.message || err); process.exit(1); });
}
