# Template image pipeline (KIE AI) - RETIRED

> **This pipeline is retired. Future image generation uses the GPT Image 2
> API exclusively** - see `docs/image-pipeline.md`. `gpt-image-2` now emits
> real alpha channels (`background: "transparent"`), so neither KIE's
> generation API nor Kie.ai's background-removal API has a place in any
> current workflow. These scripts and this README are kept as the record of
> how the earlier imagery was produced; don't point new work at them.

The template sites render every card, alternating row and lookbook cell as a
labelled placeholder holding a ready made image prompt. These four scripts take
those prompts through [KIE AI](https://kie.ai)'s job API and drop finished
images into `public/images/template/`.

Default model is **`z-image`** ([product page](https://kie.ai/z-image)), from
Alibaba Tongyi Lab. Override per run with `--model`, or globally with
`KIE_MODEL`.

`z-image` is the only slug KIE exposes for this family. Its API docs call the
model plain "Z-Image" and never say Turbo, while the product page describes
Z-Image-Turbo, the distilled 8-step variant Tongyi actually shipped. So the
underlying checkpoint is almost certainly Turbo, but KIE does not state it, and
the slug is what matters here either way.

## Setting the API key

Get a key at [kie.ai/api-key](https://kie.ai/api-key), then put it in a file at
the repo root rather than exporting it in every shell:

```bash
# .env.local  (git-ignored)
KIE_API_KEY=your-key-here
```

The scripts read `.env` and then `.env.local` themselves, so a plain
`node scripts/images/submit-batch.mjs` picks the key up with no `export`. They
run outside Next.js, which is why they do their own loading rather than relying
on Next's.

Precedence matches the Next.js convention, most specific first:

1. a real environment variable (`KIE_API_KEY=... npm run images:submit`)
2. `.env.local`
3. `.env`

Both files are git-ignored. Use `.env.local` for anything secret; `.env` is
handy for non-secret defaults you want everyone to share, but since it is
ignored here too, it will not travel with the repo.

Accepted syntax: `KEY=value`, `export KEY=value`, single or double quotes,
`#` comments on their own line or after a value. A `#` inside a quoted value or
a bare URL is kept.

| Variable | Purpose |
|---|---|
| `KIE_API_KEY` | Required. Your KIE API key. |
| `KIE_MODEL` | Model slug. Defaults to `z-image`. |
| `KIE_RATE_LIMIT` | Requests allowed per 10s. Defaults to 18. |
| `KIE_API_BASE` | API root. Defaults to `https://api.kie.ai/api/v1`. |

## Run it

```bash
npm run build                        # refreshes out/template/<slug>/index.html

npm run images:extract               # 1. prompts -> .batch/prompts.json
npm run images:build                 # 2. manifest -> .batch/tasks.json
npm run images:submit -- --watch     # 3. create jobs, poll to completion
npm run images:import                # 4. download, recompress, write public/
```

Working files live in the git-ignored `scripts/images/.batch/`.

## Regenerating an image you already have

The pipeline is built to be additive - every step skips work it has already
done - so redoing a finished image means opting out of all three skips. Each
step spells that `--force`:

```bash
# One image. The id is the filename in public/images/template, minus .webp.
node scripts/images/build-batch.mjs --force --only react__meridian__gallery-2
npm run images:submit -- --force --watch
npm run images:import -- --force
```

| Step   | What it skips by default              | What `--force` does                          |
| ------ | ------------------------------------- | -------------------------------------------- |
| build  | prompts whose `.webp` already exists  | plans them anyway (same as `--all`)          |
| submit | ids that already carry a `taskId`     | drops their state so they get a fresh job    |
| import | destinations that already exist       | overwrites the file                          |

`--force` on submit is the one that matters, and the one `--retry` won't do for
you: `--retry` only requeues tasks that *failed* or stalled, so a successful
generation stays put no matter how often it is replanned.

Scope with `--only`, which matches a site name (`meridian`) or any substring of an id - including an alias, so an id read
straight off a page finds the prompt that generates it. Without `--only`,
`--force` regenerates **every** slot, which is a full paid run.

Don't like the result? Just run the three commands again - each one rerolls the
seed on KIE's side. To go back to the prompt card instead, delete the file and
reindex:

```bash
rm public/images/template/react__meridian__gallery-2.webp
npm run images:index
```

Rebuild afterwards either way (`npm run build`) so the pages pick the change up.

## Rate limiting

KIE accepts **20 new requests per 10 seconds per account**, and anything over
that returns 429 *without entering the queue*, so an unpaced run would silently
lose images. Every request in this pipeline, polling included, goes through one
shared pacer in `common.mjs`.

It spaces requests evenly (one every ~555ms at the default 18/10s) rather than
letting a window's worth go at once. A simple "N per 10 seconds" counter allows
all N to leave together and N more the instant the window rolls; because the
server's window does not share our boundary, it can see 2N at once and start
rejecting. Even spacing keeps any 10 second window anyone measures at 19
requests. Verified against a local stub: bursting produced 34 in a window, the
paced version produces 19.

`--concurrency` only controls how many sockets are open at once. The pacer is
what bounds the request rate, so raising concurrency makes things no faster.
429s are retried with backoff, and the retry pushes the shared schedule out so
queued requests do not walk into the same wall.

Consequence: submitting 175 images takes about 100 seconds, and each polling
pass over 175 open jobs takes about the same. Generation time dominates anyway.
If KIE support raises your account limit, raise `KIE_RATE_LIMIT` to match.

## 1. extract-prompts.mjs

Prompts are authored in two places (`components/template/templateContent.ts` and
`components/template/templateSections.ts`), but they converge in the rendered
HTML: every placeholder is a `<figure class="imgph" data-image-prompt="...">`
carrying the final composed string, palette clause included. This reads the built
pages so there is only one parser to keep honest.

Each record gets an id of `react__<site>__<slot>-<index>`, for example
`react__meridian__gallery-2`. (The `react__` segment is vestigial - there was
once a second, static-HTML stack - but it is baked into 174 filenames, so it
stays.) That id is the output filename, so results route themselves back to
slots. Identical prompts collapse to one generation,
with the extra ids recorded as `aliases`.

Slot aspect comes from the layout and maps onto what the model offers. `z-image`
supports only `1:1`, `4:3`, `3:4`, `16:9` and `9:16`: the 4/3 cards and rows and
the 1/1 gallery cells map exactly, and the 4/5 tall gallery cell takes the
nearest portrait, `3:4`. The small difference is cropped by `object-fit: cover`,
never stretched, the same rule the patterns follow.

`z-image` caps prompts at 1000 characters. Every composed template prompt is
currently 230 to 330, so this only ever shows up as a warning if content grows.

## 2. build-batch.mjs

Writes the list of jobs to create. By default it only includes prompts with no
image on disk yet, so reruns are cheap and additive.

```bash
node scripts/images/build-batch.mjs --all              # include what is already on disk
node scripts/images/build-batch.mjs --only sunday-press
node scripts/images/build-batch.mjs --model z-image
```

`--force` is an alias of `--all`, so the regenerate chain above reads the same
at every step. `--only` matches a site, or any substring of an id or one of its aliases.

KIE has no bulk-submit endpoint, so this is a plain plan rather than an upload
file: one job per image, created and polled individually.

## 3. submit-batch.mjs

Creates a job per task and records each `taskId` in `.batch/state.json`, so
closing the shell mid-run loses nothing. Rerunning only submits the gaps.

```bash
node scripts/images/submit-batch.mjs --watch --interval 10
node scripts/images/submit-batch.mjs --check
node scripts/images/submit-batch.mjs --retry --watch     # requeue what did not succeed
node scripts/images/submit-batch.mjs --watch --stall-after 15
```

Every generation is asynchronous: a 200 from `createTask` means the job was
accepted, not finished. Jobs are polled until each reaches `success` or `fail`.

Ctrl-C is safe at any point after the task ids are written: the jobs keep
running on KIE, and rerunning with `--watch` resumes polling without
resubmitting anything. Polling shares the pacer, so a pass over N open jobs
takes about N x 0.55s; watch the interval between log lines shrink as jobs
finish.

`--retry` requeues what failed or stalled; `--force` requeues everything in the
current plan, successful generations included, which is what makes a finished
image regenerable (see [Regenerating an image you already
have](#regenerating-an-image-you-already-have)).

Occasionally a job never reaches a terminal state. `--watch` gives up once
nothing has changed for `--stall-after` minutes (default 10) and prints which
ids are stuck, rather than looping forever. Import what finished, then requeue
the rest with `--retry`, which drops every non-successful task from the state so
it gets a fresh job. Without `--retry` a stuck task is skipped on later runs: it
is back in the plan (no image on disk) but still carries its old task id.

## 4. import-batch.mjs

KIE returns a URL per job rather than inline data, so each result is fetched,
resized to roughly 2x its widest rendered slot and written as WebP into
`public/images/template/`. With `output: 'export'` there is no `/_next/image`
optimizer at runtime, so this mirrors `scripts/optimize-images.mjs`.

`z-image` exposes no resolution control, so whatever it returns is downscaled to
fit and never enlarged.

Individual jobs can fail without failing the run, usually a content filter trip.
Those ids are listed on stdout and in `.batch/imported.json`; rerunning
`images:build` picks up exactly the missing ones.

## How slots pick up their image

`components/template/ImageCard.tsx` checks whether an image exists for a slot id
and swaps itself. React cannot stat the filesystem at render time, so the set of
finished ids is mirrored into `components/template/generatedImages.ts`, which
`import-batch` (and `npm run images:index`) rewrites.

A filled slot renders `<img>` cropped with `object-fit: cover` and moves the
copy button to a hover overlay; an unfilled one keeps the prompt card. A half
finished run therefore leaves a page that still reads as complete.

Adding, removing or reordering items inside a section renumbers its slots, so
rerun `images:extract` after content edits. After an import, rebuild:

```bash
npm run build
```
