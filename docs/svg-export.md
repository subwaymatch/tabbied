# Native SVG export - reference

The single source of truth for how Tabbied's SVG export works, which patterns
it supports (and why), and the rules to follow when touching patterns, the
converter, or export UI. Written for future maintainers and coding agents.
This document is the reference; the original research handoff it grew from
was retired and lives in git history.

Batches 11 (gallery orders 1200-1254, 55 designs) and 12 (1400-1431, 32
designs) were authored against this document: every design in them is tier 4,
and `scripts/pattern-gen/validate-svg-batch11.mjs` /
`validate-svg-batch12.mjs` are the gate that keeps them there - they run the
shipped converter over each rendered design and fail on a throw, on any
warning, or on a pixel diff above a budget deliberately tighter than the
shipped one. Both are thin callers of `scripts/pattern-gen/svg-sweep.mjs`, and
both batches share the authoring lints in `scripts/pattern-gen/pattern-lints.mjs`.

Batch 12 is where the *smooth* gradient gets used: 19 of its 32 designs are
built on linear and radial ramps - fades, a corner glow, halftones and ruled
fields thinned across a cell, and a fade posterized into flat alpha levels.
That is deliberate, and it is the tier-4 way to draw the effects that
otherwise reach for `filter: blur()` or `box-shadow` and land in tier 2 (see
`bokeh`, `neon`, `lantern`, `terrain`). A ramp written as gradient stops is a
`<linearGradient>` or `<radialGradient>` with the same stops; a blur is an
`feGaussianBlur`.

## What it is

`doodleToSvg()` (`packages/tabbied/src/core/svgExport.ts`) walks a rendered
`<css-doodle>`'s shadow DOM and maps computed styles onto **native SVG
primitives** - rects, paths, gradients, clips, masks, filters. No
`<foreignObject>`: exports open in design tools and scale to any resolution
(`viewBox` only, no fixed size; transparency survives).

Public surface:

- `controller.exportSvg(options)` / React handle `exportSvg(options)` - waits
  for in-flight CSS transitions, then snapshots the DOM. `{ download: true }`
  saves `<slug>.svg`.
- `supportsSvgExport(pattern)` (in `types.ts`, **not** the converter module):
  UI gating without pulling the converter into the bundle.
- `import { doodleToSvg } from 'tabbied/svg-export'` - direct converter use.

**Bundle contract:** the converter is ~75 KB raw / ~21 KB gzipped - two
thirds of the package core. `exportSvg()` loads it via dynamic `import()` so
it stays out of the main bundle (verified: one lazily-loaded chunk in the
site build). Never re-export converter *values* from `core/index.ts` - types
only. `dist/core/svgExport.js` must keep **zero runtime imports** (only
type-only imports in the source); the parity harness and e2e inject that file
directly into pages.

## Pattern support tiers

### 1. No SVG export - `"svgExport": false` (4)

These paint **smooth conic-gradient sweeps**; SVG has no angular-gradient
primitive, so faithful export is impossible. The editor disables the menu
item with tooltip *"This design uses effects SVG can't represent."* No
dialog - the option simply can't be used.

| Pattern | Reason |
| --- | --- |
| `coil` | Smooth conic color-wheel sweeps in ring segments |
| `spectrum` | Smooth multi-color conic sweeps |
| `pinwheel` | Source *looks* hard-stop, but css-doodle re-rolls each `var()` occurrence independently, so quarters blend smoothly |
| `wedge` | Two independently-rolled `@pick()` stop positions make most cells a smooth black->transparent conic fade |

### 2. Limited support - `"svgExportNote"` on the definition (11)

Export works and is parity-verified, but with a caveat the user must be told
about (see the dialog contract below). Two sub-groups:

**Filter-based effects** - valid SVG that browsers render correctly but
design tools (Figma, Illustrator) import imperfectly; the converter also
reports these in the result's `warnings`:

| Pattern | Effect |
| --- | --- |
| `bokeh` | `filter: blur()` -> `feGaussianBlur` |
| `neon`, `lantern`, `terrain` | box-shadow glows -> `feDropShadow`/blur-merge chains |
| `misprint` | `mix-blend-mode` -> SVG blend style (least portable) |

**Documented sub-pixel deviations** (≤1 CSS px from the on-screen render):

| Pattern | Deviation |
| --- | --- |
| `fractal`, `matryoshka`, `subdivide` | Live rendering shows hairline seams from rasterizing the nested `@doodle` mask; the vector export is intentionally seam-free |
| `drypoint` | `@svg` mask sub-pixel rounding; its payload uses `calc()` in SVG attributes, which some design tools don't evaluate |
| `windowpane` | CSS blends mixed-width borders progressively around rounded corners; per-side arc strokes junction within ≤1 px |
| `glyph` | Wall-to-wall maximum-contrast quadrant edges; anti-aliasing varies across Chromium builds |

### 3. Conditional - `"svgExportNote"` on a ToggleSwitch option (0)

No design is in this tier. `bloks`, `cupola`, `foliage`, `mixtape`, `odessa`,
`quarterfall` and `radius` used to carry a Shadow toggle whose `box-shadow`
exported as an SVG filter; the option was removed outright rather than kept as
a trap, so all seven are tier 4 unconditionally.

The mechanism is still supported end to end - `PatternOption.svgExportNote`,
the amber icon and the dialog's per-option lines all still work - so a future
design that needs a conditional effect can use it. It is currently unexercised
by any pattern, which is why `e2e/svg-export.spec.ts` no longer has a case for
it: there is no fixture to point one at.

### 4. Full support - everything else (239)

Solid fills, border-radius shapes, per-side borders, clip-paths,
linear/radial/repeating gradients (incl. `calc(% ± px)` ramps and
premultiplied-alpha interpolation), CSS masks incl. `mask-composite:
intersect`, hard-stop conic pie sectors, inlined `@svg` payloads, transforms,
opacity, z-index. Each verified pixel-accurate against its live render.

## UI contract: warning icon + confirmation dialog

Implemented in `components/edit-pattern-page/EditPattern.tsx` /
`EditPatternHeader.tsx`. Any new export surface must follow the same rules:

1. `supportsSvgExport(pattern) === false` -> **disabled** "Download SVG" item
   with the tooltip. Never show the dialog for these.
2. Collect the active notes: `pattern.svgExportNote` plus
   `option.svgExportNote` for every option whose current value is `true`.
3. Notes present -> a right-aligned amber lucide `TriangleAlert` on the
   "Download SVG" item (desktop dropdown **and** mobile export panel), and
   clicking opens a confirmation dialog titled **"About this SVG export"**
   listing each note verbatim, with **Cancel** / **Download SVG** actions.
4. The dialog is a Base UI **`Dialog`**, *not* `AlertDialog` - outside-click
   and Esc must dismiss it (AlertDialog deliberately never closes on outside
   press).
5. No notes -> download immediately, no dialog.

The metadata lives in the package (`svgExportNote` on `PatternDefinition` and
on `PatternOption`), so package consumers can implement the same UX.

## Rules when adding or editing patterns

- The converter **fails loudly** (`SvgExportUnsupportedError`) on CSS it
  can't map - silently-wrong output is the failure mode to avoid. If a new
  pattern throws, either extend the converter or set `"svgExport": false`.
- **Beware css-doodle per-occurrence rolls**: paired
  `-webkit-x: @pick(...)` / `x: @pick(...)` declarations roll independently
  (rendering uses the last declaration; the export reads computed styles so
  it matches). But `@pick()` inside *conic-gradient stop positions* can turn
  an intended hard-stop wedge into a smooth sweep (this is exactly what
  disqualified `wedge`). The conic parser rejects any nonzero span whose
  endpoints differ in color.
- Effects that map to SVG *filters* (blur, box-shadow, blend modes) are
  allowed but need an `svgExportNote` (on the definition, or on the toggle
  option when the effect is optional).
- After any pattern change, run the parity sweep for it (below); keep the
  representative list and threshold table in `e2e/svg-export.spec.ts` in
  sync (thresholds are mirrored in `scripts/svg-parity-sweep.mjs`).
- **The tier belongs in the batch definition, never only in the generated
  JSON.** Each `scripts/pattern-gen/pattern-defs-N.mjs` takes `svgExport` /
  `svgExportNote` in a design's cfg and its generator emits them. A tier
  written straight into `packages/tabbied/patterns/*.json` is silently erased
  the next time anyone regenerates that batch - the generators rewrite every
  file they own. This is not hypothetical: `wedge` lost its `svgExport: false`
  that way, and nothing failed.
- The three tiers are **pinned by a unit test** (`packages/tabbied/test/`), so
  losing or changing one fails `npm test --workspace tabbied`. Changing a
  design's tier means updating that test and the counts above with it.
- **A batch generator owns a bounded range of gallery orders**, and deletes
  anything in its range it no longer defines. The bound is the important half:
  batch 10 once claimed every order above 1100 and so deleted the whole of
  batch 11. Batch 11 owns 1200-1399, batch 12 owns 1400-1999, and a batch 13
  starts at 2000 and bounds itself the same way.
- `scripts/pattern-gen/generate-patterns.mjs` (batches 1-3) is historical and
  refuses to run: its definitions would recreate 105 retired designs and
  overwrite `tetro`. For those patterns the JSON is authoritative - edit it
  directly, and the unit test guards the tiers.

## Verification

Ground truth is a **screenshot of the live element** (deviceScaleFactor 2),
not css-doodle's `element.export()` - the foreignObject render is measurably
unfaithful for conic masks. The diff is anti-aliasing-tolerant: CSS
pixel-snaps edges while SVG anti-aliases fractional geometry, so a differing
pixel passes when its color lies channel-wise between the other image's
5×5-neighborhood extremes (2 device px = 1 CSS px), checked in both
directions. Default budget: ≤1% differing pixels; the tiers above carry
documented per-pattern headroom (see `PER_PATTERN_MAX` in the spec - CI's
Chromium measures slightly different AA/shadow falloff than local builds).

### Cell boundaries: integer vs fractional

The batch sweeps draw each design in a square box, so a square grid gives
cells at an exact integer size (300px / 5x5 = 60.0px). The editor does not: at
the default 6x9 grid the pattern page renders a 364x546 element, and the cells
come out **60.66px**. That one difference is worth knowing about, because a
design whose hard edges land on integer boundaries in the sweep lands
mid-device-pixel in the editor - and mid-pixel is exactly where CSS snaps an
edge and SVG anti-aliases it.

`SVG_CELL=301` makes the sweep use a box that does not divide evenly, which
reproduces the editor's condition. Under it the *whole shipped catalogue*
moves into a 0.5-1.8% band wherever a design draws many hard edges per cell -
batch 11's `toning` measures 1.84%, `dimmer` 1.71%, `tinting` 1.36%,
`housing` 1.31%. These are the same designs that sit at 0.00% on integer
boundaries.

So: the 0.4% budget below is calibrated for the integer-cell default, where it
is a tight and stable signal for real authoring mistakes - abutments, wrong
geometry, gradient aliasing. It is *not* a claim that any design holds 0.4% at
every grid the editor offers. When a design is edge-dense enough to matter,
the e2e's `PER_PATTERN_MAX` carries the documented headroom (`glyph`,
`stepramp`).

One thing the fractional pass does catch that the default misses: repeating
*smooth* ramps alias badly once the period falls to a handful of pixels. Two
batch-12 candidates measured 4.8% and 6.0% at a 12% period on a small cell,
and widening the period so a cell holds a few repeats rather than a dozen took
them to 0.15% and 0.14%. Prefer a period a design can afford at `10x15`.

```bash
npm test --workspace tabbied              # unit tests for the pure parsers
npm run build && npm run test:e2e         # e2e incl. representative parity set
SVG_FULL_SWEEP=1 npx playwright test e2e/svg-export.spec.ts   # full catalog
node scripts/svg-parity-sweep.mjs [slug ...]   # dev-server sweep w/ artifacts
node scripts/pattern-gen/validate-svg-batch12.mjs   # no dev server needed
SVG_CELL=301 node scripts/pattern-gen/validate-svg-batch12.mjs  # fractional cells
SVG_GRID=6x9 node scripts/pattern-gen/validate-svg-batch12.mjs  # editor default
```

The last one is the fast path while authoring: it renders patterns directly
from their JSON, twelve to a page across two seeds with the frequency gate
wide open, so a few hundred designs sweep in minutes instead of one page load
each. It also fails on any converter *warning*, which the parity scripts do
not - a warning is precisely the signal that a design needs an
`svgExportNote`. `SLUGS=a,b` narrows it to specific patterns (including ones
outside the batch the script names).

The sweep script needs `npm run build --workspace tabbied` first (it injects
`dist/core/svgExport.js`) and a running dev server; failure artifacts
(`out.svg`, `mine.png`, `ref.png`) land in a temp dir it prints.

## Converter subtleties (hard-won; don't regress these)

- **Geometry**: layout offsets are integer-rounded, so boxes are measured via
  `getBoundingClientRect` with a temporary `transform:none` override. The
  override must be unwound in **two steps** (restore transforms while
  transitions stay muted, force a recalc, then unmute) or the patterns'
  ~400ms transitions restart and computed transforms read as identity.
- **Effect order** per the Filter Effects model: children -> `filter` ->
  `clip-path` -> `mask` -> opacity/blend, all inside the transform group.
  Transform origins are baked into the emitted matrix (design tools handle
  SVG `transform-origin` poorly).
- **Blur math**: CSS `blur(v)`'s parameter IS the Gaussian σ; shadow blur
  radii are 2σ. Multiple box-shadows need independent blur->offset->flood
  branches merged under the source (chained `feDropShadow`s wrongly blur each
  other). Filter regions must be absolute `userSpaceOnUse` boxes sized from
  the shape + effect reach - percentage regions clip glows on thin boxes.
- **Gradients**: CSS interpolates premultiplied alpha; SVG doesn't. Stop
  pairs differing in both color and alpha get subdivided premultiplied
  intermediate stops. `repeating-*` maps to `spreadMethod="repeat"` over the
  first->last stop run.
- **Conic sectors**: abutting sector paths get a hair of angular overlap
  (adjacent AA edges otherwise leave seams CSS doesn't have).
- **Masks**: CSS alpha masking -> SVG luminance masking by painting mask
  content white × source alpha. `mask-composite: intersect` nests masks.
  Nested-`@doodle` masks are re-rendered in a hidden shadow root and walked
  recursively; their axis-aligned tiles use `crispEdges` to avoid seams.
- **`@svg()` payloads** inline as `<symbol viewBox ... overflow="visible">`
  (payloads intentionally bleed past their viewBox) with content-hash id
  namespacing.
- **Colors** are normalized through a DOM probe that **fails loudly** on
  unparseable values - a silent fallback once painted whole patterns in the
  page's inherited text color (the `curl` calc()-ramp incident).
- **Borders shift the boxes inside them.** An absolutely-positioned
  pseudo-element resolves its offsets against its host's *padding* box, a
  static one is centred in the content box, and a background layer is
  positioned in the origin box (padding-box by default) even though it is
  clipped to the border box. All three coincide on a borderless element,
  which every pattern in the catalogue currently is - so this has no live
  parity coverage and is held by unit tests instead (`originBox` and
  `pseudoBoxFor` in the package's test suite). The converter used the border
  box for all three until batch 11, and anything placed inside a frame came
  out displaced by the border width.
- **Determinism**: same DOM in -> byte-identical SVG out (deterministic def
  ids); e2e asserts it.
