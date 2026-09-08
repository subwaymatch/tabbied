# Template imagery: GPT Image 2 (native alpha) -> committed WebP

How the imagery on the `/template/...` sites is produced, reviewed, and
committed. This documents the pipeline as implemented in this repo; the
scripts live at the repo root under `scripts/`. (The older `scripts/images/`
pipeline is retired - see its README - and **image generation uses the GPT
Image 2 API exclusively**, including transparency: `gpt-image-2` now honors
`background: "transparent"`, which removed the separate Kie.ai
background-removal vendor this pipeline used to need.)

```
  data/image-prompts.json        <- 1. author the PROJECT (palette + style), then its prompts
            │
            ▼  scripts/generate-images.mjs      (OpenAI Batch API, gpt-image-2, quality: low;
            │                                    cutout: true adds background: "transparent")
  generated-images/<id>.png      <- 2. candidates, gitignored, local scratch -
            │                         cut-outs arrive with a real alpha channel
            ▼  scripts/promote-images.mjs       (sharp -> WebP q92; verifies a cut-out
            │                                    actually has transparent pixels)
  public/images/sites/<id>[-cutout].webp <- 3. COMMITTED. This file IS what browsers download.
  lib/generated/images.js                <-    manifest: slug -> {hash, width, height}
            │
            ▼
  <Figure slug="..." />               <- 4. components/Figure.tsx, composited over a Tabbied pattern
```

Two properties define the pipeline:

- **An image is encoded exactly once and exists in git exactly once.** The
  promoted WebP is the served byte stream - no build-time re-encode, no source
  copy, no second lossy pass.
- **Transparency is per-image, not global.** Whether an image is a cut-out is
  a property of the *prompt*, declared in the JSON, and it drives every
  downstream step: the `background: "transparent"` request parameter, the
  alpha check at promotion, which filename gets committed, and the error when
  a cut-out candidate is missing or opaque.

## Prerequisites

| Variable | Used by | Where to get it |
|---|---|---|
| `OPENAI_API_KEY` | generation | platform.openai.com |

That is the whole list - one vendor, one key.

`generated-images/` is gitignored - only the promoted
`public/images/sites/*.webp` and the manifest are committed.

## Authoring prompts (`data/image-prompts.json`)

Every field resolves through a cascade - **prompt -> set -> project ->
`meta.defaults`**, first hit wins - so shared decisions are written once:

- A **project** is one template site: its `style` (one per project), its
  `palette` (+ `paletteMode`), its default `quality`/`size`/`cutout`.
  The palette hexes are the same ones the site passes to `TabbiedPattern`,
  so pattern and imagery stay in one family.
- A **set** groups images that must read as one series - a team-portrait grid,
  a product line - by pinning the shared sentences (crop, light, backdrop,
  lens) and re-anchoring the palette for that medium. Generate a whole set in
  one batch; six independently-written portraits will never grid together.
- A **prompt** carries only what is specific to one image: `id`, `project`,
  optional `set`/`slot`/`size`, and the `subject`.

Two palette modes:

- `hex` - flat graphic styles (risograph, flat vector, isometric, gouache):
  the palette is rendered as a literal ink list, "use these colours and no
  others".
- `scene` - photographic styles: each hex is anchored to a **material**
  ("golden baked crust", "shell jackets and rope accents"), because a bare hex
  has nothing to attach to in a photograph. When a set changes medium
  (portraits inside a photo project), it re-anchors the same hexes with new
  `as` notes - never new colours.

Rules that keep the results usable:

- `cutout: true` for an **object** (product, portrait, prop) - something with
  a silhouette that will sit *on* a Tabbied pattern. `cutout: false` for a
  **scene** - cut out a scene and you get ragged edges or a ghost.
- A cut-out prompt describes **the subject alone** - nothing else in frame.
  The `background: "transparent"` parameter does the isolation; do not ask
  for transparency in the prose (that paints a fake checkerboard) and do not
  describe a backdrop for it to sit on. **Never a drop shadow**: it survives
  as baked semi-transparent smudge in the alpha edge - the shadow is CSS at
  composite time.
- `"No text, letters, numbers, or logos."` is appended to every prompt by
  default (`noText`). The model bakes garbled lettering otherwise; brand
  names, labels and headlines belong in the DOM, over the image.
- One subject per cut-out image. Concrete nouns beat adjectives. For
  photographs, name the shot ("three-quarter view", "from directly above").

## Quality: `low`, deliberately

This collection is generated at `quality: "low"` throughout (the
`meta.defaults`). At 1536×1024 that is 158 output tokens ≈ **$0.0024/image**
on Batch pricing - the full 159-image collection cost ~$0.42 and generated in
about six minutes, with zero failed requests. `low` is visibly fine for
graphic styles and for photos placed at card size; if a specific hero or
portrait ever needs more, set `quality: "medium"` on that project or set (it
is ~9× the cost, still cents) rather than globally.

Accepted sizes: `1536x1024` (hero/landscape), `1024x1536` (portrait/tall
product), `1024x1024` (square product/detail). Never `auto`.

## Running it

```bash
# 1. cost + prompt review (no API calls) - read the rendered prompts
node scripts/generate-images.mjs dry-run --project neve-gelato

# 2. generate via the Batch API (~50% cheaper). Three separate invocations -
#    never one long-lived process; batch ids persist in generated-images/last-batch.json
node scripts/generate-images.mjs submit --project neve-gelato
node scripts/generate-images.mjs status          # repeat until "completed"
node scripts/generate-images.mjs download

# 3. REVIEW cut-outs over a real pattern at full size (alpha-edge artifacts and
#    value collapse are invisible at thumbnail size), then promote:
node scripts/promote-images.mjs --project neve-gelato

# 4. verify + commit images and manifest TOGETHER
npm run build:images        # must be a true no-op on a clean tree
git add public/images/sites lib/generated/images.js data/image-prompts.json
```

Regenerating one image reuses its slug - edit the prompt's `subject`, then
`submit/status/download --only <id> --force` and promote `--only <id>`. The
commit is one WebP plus one manifest line, and
the manifest hash doubles as the cache-buster (`?v=<hash8>`), so returning
visitors get the new bytes despite immutable caching.

## Transparency: native alpha, one vendor

`gpt-image-2` accepts `background: "transparent"` and returns the subject on
a real alpha channel, so a cut-out is finished the moment the batch downloads:
generation and isolation are one call to one API. (Historically the
parameter was a 400 on this model, and cut-outs took a second pass through
Kie.ai's hosted `recraft/remove-background`; that whole leg - its API key,
its upload hop, its rate limiter, and `scripts/remove-background.mjs` - is
retired. **Future image generation uses the GPT Image 2 API only.**)

What holds the contract together now:

- `cutout: true` in `data/image-prompts.json` is what adds the parameter to
  the request (`requestBody` in `scripts/generate-images.mjs`) - transparency
  stays a property of the prompt, not a flag someone must remember.
- Transparency needs an alpha-capable `output_format`: `png` (the default) or
  `webp`, never `jpeg`.
- **Promotion verifies the alpha is real.** A `cutout: true` PNG with no
  transparent pixels fails promotion loudly - that is the shape a
  pre-native-alpha candidate (or a silently ignored parameter) would take,
  and an opaque image committed under the `-cutout` name is exactly the
  regression the check exists to refuse.
- The committed filename contract is unchanged: cut-outs still promote to
  `<id>-cutout.webp`, so served URLs, the manifest, and `Figure` move not at
  all. A legacy `<id>-cutout.png` on disk (old removal output) still wins
  over its sibling `<id>.png`, which in that layout is the *opaque* original.

## Promotion and serving

- `sharp(...).webp({ quality: 92, alphaQuality: 100, effort: 6 })` - q92
  because this file *is* the artifact, `alphaQuality: 100` because every
  cut-out lands on a busy pattern where a lossy alpha edge shows. PNG->WebP
  runs ~14× smaller (~130 kB for a 1536×1024).
- Promotion follows the flag: `cutout: false` -> `<id>.webp`; `cutout: true` ->
  `<id>-cutout.webp`, sourced from the native-alpha original (or a legacy
  `-cutout.png` when one exists; `--keep-original` is only meaningful in that
  legacy layout). A `cutout: true` prompt with no candidate on disk - or an
  opaque one - is an **error**, not a skip; both are what silently leave a
  stale or broken committed image after a regeneration.
- `scripts/build-image-manifest.mjs` writes `lib/generated/images.js`
  (committed): slug -> `{hash, width, height, formats}`. It is incremental and
  a true no-op on a clean tree, so it is safe in `prebuild`/`predev`
  (`npm run build:images`).
- `components/Figure.tsx` renders a plain `<img>` (never `next/image` - the
  bytes are final; a request-time re-encode would be a second lossy pass)
  with intrinsic `width`/`height` from the manifest (no CLS) and the hash
  cache-buster. Pass `cutout` for cut-outs and seat them with a CSS
  `drop-shadow` in the page's own stylesheet.

## Composition rules (how the images meet the patterns)

The composite is the whole point: **the Tabbied pattern is the surface, and a
cut-out object sits on it.** Scenes stay full-bleed with the pattern living
*next to* them (a split hero, a section band, a card back) - never layered
under a scene, which fights it for the same job. Portrait grids over pattern
tiles are the strongest use of the pipeline; keep every portrait in one `set`.

## Gotcha checklist

1. Transparency is the **parameter**, never the prompt - `background:
   "transparent"` (sent automatically for `cutout: true`) returns real alpha;
   *asking* for transparency in the prose paints a fake checkerboard into the
   pixels. And it requires `png`/`webp` output, never `jpeg`.
2. Batch output files embed base64 images and run to gigabytes - the scripts
   stream them line by line; don't "simplify" that away.
3. Expensive failures happen on the **retrieval** side, after the paid work.
   Keep the retry wrappers on every GET.
4. A palette-coloured backdrop or a baked drop shadow ruins a cut-out (§ above).
5. Faces are where `low` shows first; portraits are the first candidates for a
   per-set `quality: "medium"`.
6. Two copies of a palette drift - the JSON project palette and the page's
   `TabbiedPattern` palette must stay byte-identical hexes.
7. Filter by `--project`, not by id-prefix regex.
8. The manifest is one generated file; two branches adding projects conflict
   there - take either side and re-run `npm run build:images`.
