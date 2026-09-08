# Mockups: putting a real Tabbied pattern onto a real-looking object

How the `mockup-*` images are made: a poster on a gallery wall, a compact with
the pattern on its lid, a van in full livery. Companion to
`docs/image-pipeline.md`, which covers the ordinary template photography.

**Status: piloted.** Five mockups were generated end to end on 2026-08-02 with
`gpt-image-2` at `quality: low`. Everything below marked **measured** came out
of that run; the rest is reasoning you should re-check on your own first batch.

---

## 1. The question that decides the whole workflow

There are two obvious ways to get a Tabbied pattern into a generated
photograph, and only one of them works.

**Describing the pattern in the prompt does not work.** You can paste the
css-doodle source, or write "a basketweave of alternating striped blocks in
pink, lilac and marigold", and the model will produce something that *rhymes*
with the pattern. It cannot execute CSS, so it is guessing from a description.
The result is a plausible pattern that is not ours, which defeats the point of
a mockup: the whole job is to show *this* design on an object.

**Rendering the pattern and passing the pixels does work.** The pattern is
rasterised in a headless browser, and that PNG is sent to the image **edits**
endpoint as the reference. The model then draws the object with that pattern
printed on it. This is the pipeline below.

```
  packages/tabbied/patterns/<design>.json
       │  scripts/render-pattern.mjs   (headless Chromium, real css-doodle)
       ▼
  generated-images/refs/<id>-ref.png          <- the pattern, exact pixels. Free.
       │  scripts/generate-mockups.mjs -> POST /v1/images/edits (multipart)
       ▼
  generated-images/mockups/<id>.png           <- the object wearing it
       │  sharp -> WebP q92
       ▼
  public/images/mockups/<id>.webp             <- COMMITTED, served
  lib/generated/images.js                     <-  manifest entry, base: /images/mockups
```

## 2. Fidelity tiers: pick the cheapest exact option

The edits model **redraws** what you hand it. It keeps the palette and the
character of the geometry, but it re-composes the arrangement. That is fine for
a van or a tote; it is not fine if you need the exact pattern.

| Tier | Technique | Pattern fidelity | Use for |
|---|---|---|---|
| 0 | Render the live `<TabbiedPattern>` in the page | exact, and animated | anything on the site itself |
| 1 | Generate a scene with a **blank** surface, composite the render onto it with `sharp` | exact, pixel-true | straight-on posters, flat packaging faces, screens |
| 2 | **Edits endpoint** with the render as input (this doc) | faithful impression | curved, wrapped, folded or angled surfaces |

Tier 1 is worth remembering: for a poster photographed square-on, prompting for
"a large blank white poster in a thin black frame, photographed straight on"
and compositing the real render into that rectangle gives a perfect pattern for
the same money. Reach for tier 2 when the surface bends.

## 3. Rendering the reference (free, deterministic)

```bash
node scripts/render-pattern.mjs --design bauhaus --out refs/poster.png \
  --palette "#F2E9DC,#E63329,#1D3D8F,#F0C02E,#1A1A1A" \
  --seed mk-poster --width 1024 --height 1536 --cell 96
```

The script boots a tiny static server over the repo, loads the built core plus
css-doodle in Playwright, mounts the pattern and screenshots the element at
`deviceScaleFactor 2`. An element screenshot is used rather than the SVG
exporter because it is the same ground truth the SVG parity sweep compares
against, and it works for every design including the four that cannot export to
SVG.

Two knobs matter for mockups:

- **`--cell`** is the one to reach for. Larger cells mean fewer, bigger
  features, and big features survive the redraw. The default grid is tuned for
  a web background and comes out too fine.
- **`--seed`** fixes the composition, so a re-render is byte-identical and a
  regenerated mockup is comparable to the last one.

An importmap in `scripts/render-pattern.html` maps the bare `css-doodle`
specifier that the built core imports; without it the page fails to resolve the
module and nothing mounts.

## 4. The edit call

`POST https://api.openai.com/v1/images/edits`, **multipart/form-data** (not
JSON): `model`, `image` (the reference PNG), `prompt`, `size`, `quality`, `n`.
Response carries base64, same as the generations endpoint.

**Measured gotchas:**

- **`input_fidelity` is not accepted by `gpt-image-2`.** Sending it returns
  `400 invalid_input_fidelity_model`. It is a `gpt-image-1` parameter. The
  script leaves it unset and exposes `--fidelity` only for use with older
  models.
- **The edits endpoint is not batchable.** The Batch API takes JSONL request
  bodies and this call is multipart, so mockups run synchronously with small
  concurrency. At mockup volumes that is irrelevant: five images took well
  under a minute.
- **Never retry this POST.** It creates paid work; a silent re-send doubles the
  bill. The script reports a failure and carries on with the rest.

The prompt is scene direction plus one clause that does the actual work:

> A product photograph of *[subject]*. **The pattern in the provided image is
> the printed design on it: reproduce that pattern faithfully, keeping its
> exact colours, geometry and proportions, wrapped naturally over the surface
> with the scene's own lighting, perspective and any folds or curvature.**
> Nothing else in the frame carries the pattern. No text, letters, numbers, or
> logos.

The "nothing else in the frame carries the pattern" sentence earns its place:
without it the model is happy to tile the wall behind the object too. The
no-text clause is the same rule as the rest of the pipeline; brand names go in
the DOM, over the image.

## 5. What survives the redraw, and what does not

**Measured** across the five pilot mockups. This is the most useful thing in
this document, because it tells you which designs to pick.

| Mockup | Design | Surface | Outcome |
|---|---|---|---|
| `mockup-compact-cosmetics` | `fluting` | domed enamel lid | **Excellent.** Basketweave blocks, stripe direction and palette all held, wrapped over the dome with correct specular highlights. |
| `mockup-van-wrap` | `ziggy` | large curved panels | **Excellent.** Chevrons and the exact five-colour palette held across doors, wheel arches and panel seams. Arrangement re-composed, which is invisible on a livery. |
| `mockup-poster-gallery` | `bauhaus` | flat, framed | **Good.** Quarter-circles and leaf forms in the right inks. Re-composed, so use tier 1 if a specific composition matters. |
| `mockup-tin-packaging` | `annulus` | cylinder | **Partial.** Rings and palette held, but `annulus`'s defining feature, rings thickening row by row down the canvas, flattened into a uniform grid. |
| `mockup-tote-textile` | `lattice` | fabric with folds | **Partial.** Read the coloured pips and the palette, but lost the diagonal argyle lattice and rebuilt it as square blocks. |

The pattern in those results:

- **Bold, chunky, locally-defined geometry survives.** Chevrons, quarter
  circles, basketweave blocks: each cell is legible on its own, so redrawing
  cell by cell keeps the design intact.
- **Global progressions do not survive.** Anything whose identity is a ramp
  across the whole canvas (`annulus`, `taper`, `diminuendo`, `crescendo`) gets
  flattened, because the model draws locally and has no notion of "row 7 of
  14".
- **Fine diagonal structure degrades.** `lattice`'s crossing diagonals became
  axis-aligned blocks.

So: **choose local, bold designs for tier 2, and use tier 1 for the ramps.**

## 6. Promote and serve

```bash
node scripts/generate-mockups.mjs --refs-only     # 1. render refs, free, review them
node scripts/generate-mockups.mjs                 # 2. the paid edit
# 3. review each mockup against its reference before promoting
#    (sharp -> WebP q92 into public/images/mockups, then:)
npm run build:images
```

`build-image-manifest.mjs` scans **both** `public/images/sites` and
`public/images/mockups`, and records a `base` on each entry so `<Figure>` builds
the right URL. Entries without a `base` fall back to `/images/sites`, so the
existing template imagery is unaffected.

```tsx
<Figure slug="mockup-van-wrap" alt="Delivery van in full pattern livery" />
```

**Measured:** the five pilot mockups came to 9.1 MB of PNG and 1.1 MB of WebP.

## 7. Adding a mockup

1. Add an entry to `data/mockup-prompts.json`: an `id`, a `subject` (the scene,
   no style or pattern words), a `size`, and an `pattern` block naming the
   design, palette, seed and `cell`.
2. `--refs-only` and look at the reference. If the features look small at
   this size, raise `cell` and re-render. This step is free.
3. Run the edit, then compare the mockup against its reference side by side:
   check the palette has not drifted, the geometry is recognisably the design,
   and the pattern scale suits the object (not ant-sized, not billboard).
4. Reroll failures. At `low` quality a reroll costs a fraction of a cent.
   If a design keeps failing, it is probably a global-progression design;
   move it to tier 1.

## 8. Honest limits

- A tier-2 mockup is a **faithful impression, not a reproduction**. Do not
  present one as an exact print proof. Show the real pattern next to it (the
  site renders live patterns anyway) and the difference reads as photography
  rather than as error.
- Palette can shift a shade under scene lighting. That is usually desirable,
  since a perfectly flat colour match looks pasted on.
- The model will occasionally add plausible product details you did not ask
  for (the compact's gold rim, the tin's brushed lid). Usually welcome; worth a
  look before shipping.
