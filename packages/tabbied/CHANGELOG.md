# tabbied

## 0.5.1

### Patch Changes

- Changes since tabbied@0.5.0 that landed without a changeset:

  - The 2026 design, and Studio's AI tier: auth on D1, generation, images, R2 ([#64](https://github.com/tabbied-design/tabbied/issues/64))

## 0.5.0

### Minor Changes

- [#59](https://github.com/tabbied-design/tabbied/pull/59) [`f526357`](https://github.com/tabbied-design/tabbied/commit/f5263578e5b1993b6eaae2a29651e987888a6db5) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Make the catalog agent-usable: closed-vocabulary metadata, preview images, a
  `tabbied` CLI, and agent docs in the tarball.

  - **Every design now carries `tags`, `mood`, `density`, and `goodFor`** -
    closed-vocabulary enums (see `scripts/catalog-vocabulary.mjs`) authored by
    looking at each rendered design, validated by codegen at build time, and
    published in `catalog.json`. The catalog is now queryable ("sparse designs
    that suit a hero background") instead of merely readable. The fields are
    catalog-only: the runtime bundle and `PatternDefinition` are unchanged.
  - **Every design has a stable preview image** at
    `https://tabbied.com/previews/<slug>.webp` (authored palette, default
    options, fixed seed), listed as `preview` in its catalog entry - so a
    multimodal tool can look at a shortlist before committing to a slug.
  - **New `tabbied` CLI** (`npx tabbied ...`): `render <slug>` to SVG or PNG at
    any size/seed/palette, `--frames N --reseed-every M` for deterministic
    video-ready PNG sequences, and `list`/`info` to query the catalog from a
    shell. Rendering uses whatever Playwright the project already has; no
    browser is downloaded on install.
  - **The tarball now ships `llms.txt` and `AGENTS.md`** - the complete
    agent-facing reference (entry points, sizing gotchas, recipes for hero
    backgrounds / video frames / static HTML, the editor share-URL scheme, and
    a one-line entry per design). Generation moved into the package build, so
    a publish can't ship without them; the site serves the same texts at
    /llms.txt and /llms-full.txt.

- [#55](https://github.com/tabbied-design/tabbied/pull/55) [`772d747`](https://github.com/tabbied-design/tabbied/commit/772d74752534f8e1defa66f629e0f40fe0e0a620) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Remove the `contain` fit and the Symmetry design, and collapse the
  per-pattern fit-capability model that only existed to serve them.

  `contain` only ever made sense for a grid-less composition, and Symmetry was
  the only one - 1 of 254 designs, and the sole pattern without a `grid` option.
  For everything else, letterboxing drew the pattern's _authored_ grid on the
  default square canvas: a `10x15` design came out with 80 × 53 cells, visibly
  oblong next to the same design under `grid` or `cover`. Adapting the render
  box the way `cover` does wouldn't have fixed it either, because `grid` already
  fills the box exactly with square cells and no bars - there is no version of
  `contain` that beats `grid` for a tiling design.

  With both gone, every design is a cell-tiled grid supporting all three
  remaining fits, so `fit` is a plain choice rather than a per-pattern
  negotiation.

  Breaking changes:

  - `fit="contain"` is gone. Use `grid`, or `cover` with an `aspectRatio` on the
    box. TypeScript rejects it; `data-fit="contain"` is ignored like any other
    unrecognized value, and the config falls back to `grid`.
  - The `symmetry` preset is gone from `tabbied/patterns` and the catalog, which
    goes from 254 designs to 253.
  - `resolveFitMode()`, `allowedFitModes()`, `defaultFitMode()` and
    `hasGridOption()` are gone, replaced by the exported `DEFAULT_FIT_MODE`
    constant (`'grid'`). Nothing negotiates capability anymore, so no fit
    request falls back or warns.
  - `PatternSizing` loses `allowed`, `default` and `coverRender`; no design
    declared any of them once Symmetry was removed. `minCellPx`, `maxCellPx`
    and `cellMultiple` are unchanged.
  - `PatternDefinition.lockAspectRatio` is gone - no design set it, and every
    design adapts to any ratio.
  - `coverRender.cropTop` is gone (Symmetry's gallery card was its only user),
    along with its `data-cover-render` wire form - `800x800+0.48` no longer
    parses, `800x800` still does.
  - `fitRenderToBox()` no longer takes a `mode` argument; it always covers.
  - `catalog.json` designs no longer carry a `fit` object. The three modes are
    the same for every design and are documented once under `usage.fit`.

- [#55](https://github.com/tabbied-design/tabbied/pull/55) [`772d747`](https://github.com/tabbied-design/tabbied/commit/772d74752534f8e1defa66f629e0f40fe0e0a620) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Honour `prefers-reduced-motion` for the designs' own cell transitions, not
  just the ambient redraw timer.

  Every design carries a ~400ms `transition` - that is what makes a redraw morph
  into the next arrangement instead of cutting. Only the `redrawInterval` timer
  was gated, so the transitions still fired on every re-render, including ones
  nobody asked for: `fit: "grid"` and `fit: "cover"` re-derive their grid on
  resize, so turning a phone or dragging a window animated every cell on the
  page. That is exactly the passive motion the preference exists for.

  Under `prefers-reduced-motion: reduce` the controller now mutes those
  transitions for its whole life, using the same shadow-root override that
  already suppresses the first paint. Anything that re-renders - a resize, a
  `redraw()`, an option or palette change - cuts to the new arrangement. Nothing
  is lost: the pattern renders identically, it just stops easing between states.

  The preference is also now **observed rather than read once**. Previously
  `syncRedrawTimer` only re-checked it on a config change, so toggling the OS
  setting mid-session left a running timer ticking. A `change` listener on the
  media query now re-syncs the timer and toggles the override, and is removed in
  `destroy()`.

  No API change - this needs no configuration and no new props.

- [#59](https://github.com/tabbied-design/tabbied/pull/59) [`f526357`](https://github.com/tabbied-design/tabbied/commit/f5263578e5b1993b6eaae2a29651e987888a6db5) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Fix three silent-wrongness bugs in the core, and expose `controller.destroyed`.

  - **SVG export of a `fit: "cover"` pattern was silently distorted.** The
    measurement pass neutralizes transforms with a style injected into the
    shadow root, which can never match the host `<css-doodle>` - where the
    cover fit puts its `translate(...) scale(...)`. Measured geometry came back
    scaled while computed px lengths (border widths, corner radii,
    pseudo-element sizes, shadow offsets, transform origins) stayed unscaled,
    and the export mixed the two without error. The host transform is now
    neutralized during measurement and restored afterwards; cover-fit exports
    come out at the render box's native resolution.
  - **A config-driven grid change re-introduced sub-pixel seams.** `update()`
    with a new `cellSize`/`density` re-rendered the grid but never re-snapped
    the canvas to the new track count, leaving every cell boundary fractional
    until the next container resize. `reconcile()` now re-snaps.
  - **`hydratePatterns()` could never re-hydrate an element after
    `controller.destroy()`** - it kept returning the dead controller, so the
    documented teardown-and-rehydrate recipe left the page blank. Controllers
    now expose a readonly `destroyed` flag (the new public API in this
    release), and hydration replaces dead controllers.
  - **A bare Slider entry in `data-options` (`frequency:`) parsed to `0`**
    (usually below the option's minimum) instead of falling back to the
    authored default as the attribute contract promises.

## 0.4.0

### Minor Changes

- [#51](https://github.com/subwaymatch/tabbied/pull/51) [`6103be1`](https://github.com/subwaymatch/tabbied/commit/6103be16402185cda96c83bd78a7cccbe4f9dfae) Thanks [@subwaymatch](https://github.com/subwaymatch)! - **Breaking: "artwork" is now "pattern" throughout the public API.** The project
  started out making artworks and has pivoted to making patterns, mostly for
  digital products - the vocabulary now matches. There are no deprecated
  aliases; this is a clean break on 0.x.

  | Before                                                                                                                                        | After                                                    |
  | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
  | `createArtwork(host, config)`                                                                                                                 | `createPattern(host, config)`                            |
  | `hydrateArtworks({ artworks })`                                                                                                               | `hydratePatterns({ patterns })`                          |
  | `artworkConfigToAttributes` / `artworkConfigFromElement`                                                                                      | `patternConfigToAttributes` / `patternConfigFromElement` |
  | `ArtworkDefinition`, `ArtworkOption`, `ArtworkConfig`, `ArtworkController`, `ArtworkSlug`, `ArtworkColors`, `ArtworkSizing`, `ArtworkBoxSize` | `Pattern...` equivalents                                   |
  | `import { ... } from 'tabbied/artworks'`                                                                                                        | `import { ... } from 'tabbied/patterns'`                   |
  | `artworks` record, `isArtworkSlug()`                                                                                                          | `patterns` record, `isPatternSlug()`                     |
  | `<TabbiedArtwork artwork={...} />`                                                                                                              | `<TabbiedPattern pattern={...} />`                         |
  | `TabbiedArtworkProps`, `TabbiedArtworkHandle`                                                                                                 | `TabbiedPatternProps`, `TabbiedPatternHandle`            |
  | `data-artwork="<slug>"`                                                                                                                       | `data-pattern="<slug>"`                                  |

  Design slugs, palettes, options and rendering are all unchanged - this is a
  rename, not a behaviour change. To migrate, rename the imports and the
  `artwork` prop; nothing else needs to move.

  `ARTWORK_ATTRIBUTE` / `ARTWORK_SELECTOR` are now `PATTERN_ATTRIBUTE` /
  `PATTERN_SELECTOR`. Note that `data-pattern` is what
  `patternConfigFromElement` reads, so markup emitted by an older version needs
  the attribute renamed too.

  The package CHANGELOG's historical entries are deliberately left alone: 0.1.0
  through 0.3.0 shipped the old names, and rewriting them would make those
  entries describe an API that never existed.

- [#51](https://github.com/subwaymatch/tabbied/pull/51) [`6103be1`](https://github.com/subwaymatch/tabbied/commit/6103be16402185cda96c83bd78a7cccbe4f9dfae) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add declarative mounting: `hydratePatterns()` reads a pattern's config off
  plain `data-*` attributes and mounts every match under a root, so a static
  HTML page can describe its patterns in the markup and bring them all up with
  one call - no component, no build step.

  `patternConfigToAttributes()` is the inverse, and `TabbiedPattern` now uses it
  on its own placeholder. A server-rendered React page therefore emits exactly
  what `hydratePatterns` reads, which is what lets a prerendered page be
  repackaged as a framework-free template.

  The attributes are readable rather than a JSON blob (`data-palette="transparent,
#C9C8C1"`, `data-options="grid: 8x12; shadow: true"`), and option values are
  typed by the pattern's own option metadata rather than guessed - a
  `ButtonSelectGroup` choice that looks numeric stays a string. Unknown slugs
  and unparseable attributes degrade to the design's authored defaults instead
  of failing.

- [#51](https://github.com/subwaymatch/tabbied/pull/51) [`6103be1`](https://github.com/subwaymatch/tabbied/commit/6103be16402185cda96c83bd78a7cccbe4f9dfae) Thanks [@subwaymatch](https://github.com/subwaymatch)! - **Breaking: the `shadow` option is removed from all seven patterns that had
  it** - `bloks`, `cupola`, `foliage`, `mixtape`, `odessa`, `quarterfall` and
  `radius`. The toggle injected a `box-shadow`, which is the one CSS effect that
  costs a design its clean SVG export: with it on, the shadow left as an SVG
  drop-shadow filter that Figma and Illustrator import imperfectly.

  Rather than keep a switch whose "on" state quietly degrades an export, the
  effect is gone. All seven now export as clean native vector unconditionally,
  which takes the clean tier from 232 designs to **239** and empties the
  conditional tier entirely.

  Passing `options={{ shadow: ... }}` is now a no-op rather than an error - the
  controller ignores option ids a design doesn't declare - so nothing throws,
  but the shadow will no longer render. **`bloks` and `cupola` change
  appearance by default**, since their toggle defaulted to on; the other five
  defaulted to off and are unchanged unless you were opting in.

  `PatternOption.svgExportNote` and the editor's per-option warning still work;
  no design uses them now. A design that wants a shadow should bake it in and
  take a definition-level note, as `neon`, `lantern` and `terrain` do - visible
  in the catalogue rather than hidden behind a switch.

- [#51](https://github.com/subwaymatch/tabbied/pull/51) [`6103be1`](https://github.com/subwaymatch/tabbied/commit/6103be16402185cda96c83bd78a7cccbe4f9dfae) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Move the ambient-redraw timer into the framework-free core. `createPattern`
  now accepts `redrawInterval` and `paused`, along with the gates that used to
  live in the React component: the effect switches off entirely under
  `prefers-reduced-motion`, and drops ticks while the tab is hidden or the host
  is scrolled out of view. `paused` is read at tick time, so pausing and
  resuming preserves the redraw phase instead of restarting the cycle.

  `TabbiedPattern`'s `redrawInterval` / `paused` props are unchanged - they now
  pass straight through to the controller - so React consumers need do nothing.
  Vanilla consumers get animated patterns without reimplementing the timer.

## 0.3.0

### Minor Changes

- [#47](https://github.com/subwaymatch/tabbied/pull/47) [`94b4475`](https://github.com/subwaymatch/tabbied/commit/94b44756022653ac040774b74c32473e550c6c31) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add 32 artworks (gallery orders 1400-1431) that export as native SVG with no
  caveat: no `svgExport: false`, no `svgExportNote`, and no converter warning.
  The catalogue goes from 222 designs to 254.

  19 of the 32 are built on **smooth gradients**, which is the part of the
  supported CSS subset the catalogue had barely used: straight fades over a
  solid ink, dot fields and ruled fields thinned by a ramp, a glow thrown from a
  corner, ramps shut inside a cut shape, and a fade posterized into flat alpha
  levels. Every one is a mask over an ordinary `background-color`, so a reseed
  morphs through the colour instead of snapping to it, and the faded end is a
  real hole - set the background slot to transparent and the sheet shows through
  a soft edge exactly as it does through a hard one.

  That is also the tier-4 way to draw effects that otherwise land in the
  caveated tier: a glow written as radial-gradient stops exports as a
  `<radialGradient>`, where `filter: blur()` or `box-shadow` exports as an SVG
  filter (which is why `bokeh`, `neon`, `lantern` and `terrain` carry notes).

  The other 13 work in the hard-edged vocabulary - splits, chamfers, hard-stop
  radial bands, dot fields, an overlap read through opacity, a mask
  intersection, and border-radius forms.

  Every design is verified against its live render pixel-by-pixel by
  `scripts/artwork-gen/validate-svg-batch12.mjs`, which fails on a throw, on any
  warning, or on a pixel diff above a budget tighter than the shipped one.

  Supporting changes to the artwork tooling, all no-ops for the shipped
  catalogue:

  - The authoring lints batch 11 introduced now live in
    `scripts/artwork-gen/artwork-lints.mjs`, and the two browser gates in
    `svg-sweep.mjs` / `render-sweep.mjs`, shared by both batches instead of
    copied. Regenerating batch 11 produces byte-identical files.
  - `generate-batch11.mjs` claimed every gallery order from 1200 upwards, so it
    would have deleted all of batch 12 - the same hazard `generate-batch10.mjs`
    had for batch 11. It is now bounded to 1200-1399, and batch 12 bounds itself
    to 1400-1999.
  - The rendering gate sampled computed styles after a fixed timeout, so on a
    loaded machine it could read one of its two passes mid-transition and report
    whole pages of designs as painting with `color0`. It now waits for the
    reading to stop changing.
  - The SVG sweep drew every design in a 300px box, so a square grid gave cells
    at an exact integer size - and integer cell boundaries hide the deviation
    that dense hard edges show at fractional ones, which is what the editor
    actually renders (60.66px cells at the default 6x9 grid). `SVG_CELL` and
    `SVG_GRID` now let the sweep reproduce that condition. Under it the whole
    shipped catalogue moves into a 0.5-1.8% band wherever a design draws many
    hard edges per cell, batch 11 included; `docs/svg-export.md` records the
    numbers and what the 0.4% batch budget does and does not claim.

  `stepramp` keeps documented per-artwork headroom in the e2e for the same
  reason `glyph` already does - several full-width hard edges per cell, landing
  mid-device-pixel at the editor's default grid.

- [#46](https://github.com/subwaymatch/tabbied/pull/46) [`d30662c`](https://github.com/subwaymatch/tabbied/commit/d30662ce73e8d42d28b235b1b851887731940364) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Ship `catalog.json` - a machine-readable index of every design, for tools (and
  people) that need to pick one without seeing it rendered.

  The API is small, but the presets are referenced by slug and there are 222 of
  them. `cleat`, `gnomonwedge` and `karst` say nothing about what they draw, so
  anything choosing a design without a picture in front of it - an AI coding
  assistant, a script generating a gallery - either guesses a slug that doesn't
  exist or imports the whole `artworks` record and loses tree-shaking. The
  descriptions authored in `artworks/*.json` already solve this; they just
  weren't reachable, because codegen compiled them into a module rather than
  publishing them as data.

  `catalog.json` is generated by the same codegen pass, from the same source
  files, and is exported as `tabbied/catalog.json`:

  ```js
  import catalog from "tabbied/catalog.json";

  const arches = catalog.designs.filter((design) =>
    /arc|curve|round/.test(design.description ?? "")
  );
  ```

  Each entry carries the design's description, authored palette and colour-count
  bounds, every option with its accepted values, the default fit, and its
  SVG-export support - but not the css-doodle source, which is large and isn't
  something a consumer passes. Unit tests pin the generated `fit.default` and
  `svgExport.supported` against `defaultFitMode()` and `supportsSvgExport()`, so
  the catalog cannot drift from the behaviour it describes.

  The site publishes the same data at `/catalog.json`, plus `/llms.txt` and
  `/llms-full.txt` (the API contract and a one-line entry per design, ~31 KB -
  sized so an assistant can load it in one fetch).

## 0.2.0

### Minor Changes

- [#44](https://github.com/subwaymatch/tabbied/pull/44) [`ef1bad4`](https://github.com/subwaymatch/tabbied/commit/ef1bad49dcaf7117df081e6d8bed7ab09ca325aa) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add 55 artworks (gallery orders 1200+) that export as native SVG with no
  caveat: no `svgExport: false`, no `svgExportNote`, and no converter warning.
  They come from twelve families - splits, stripe fields, hard-stop conic
  sectors, rings, chamfers, border-radius forms, bars, wedges, dot fields,
  overlaps, mask intersections and smooth fades. Every one is verified against
  its live render pixel-by-pixel by
  `scripts/artwork-gen/validate-svg-batch11.mjs`, which fails on a throw, on any
  warning, or on a pixel diff above a budget tighter than the shipped one.

  Fix two SVG-export geometry bugs that only showed on elements with a border,
  where the border box and the padding box differ:

  - an absolutely-positioned `::before`/`::after` resolved its offsets against
    its host's border box instead of the padding box (and a static one was
    centred in the border box rather than the content box), so pseudo-elements
    inside a bordered box exported displaced by the border width;
  - a `background-image` layer used the border box as its positioning area
    instead of the origin box (`background-origin`, padding-box by default), so
    percentage stops and tile sizes on a bordered box resolved against the wrong
    size.

  Both are no-ops for borderless elements, which is every artwork in the
  catalogue.

  Retire the `Wireframe` artwork (batch 9). Its slug stays reserved so the name
  is never reused, and the batch-9 designs that followed it shift down one
  gallery position.

  Stop the artwork generators from silently dropping SVG-export metadata. The
  tiers introduced with native export were written straight into the generated
  JSON, but every batch generator rewrites the files it owns from its
  definitions - so regenerating a batch erased them, turning a design that
  cannot be exported into one that offers a broken download. The tier now lives
  in each batch's definitions and is emitted by its generator, and the three
  tier lists are pinned by a unit test so any future loss fails the build.

  Two related generator hazards fixed at the same time: `generate-batch10.mjs`
  claimed every gallery order above 1100 and so deleted all of batch 11, and
  `generate-batch4.mjs` read the pre-monorepo artworks path and could not run at
  all. `generate-artworks.mjs` (batches 1-3) now refuses to run - its
  definitions predate 105 retirements and an unrelated redesign of `tetro`.

- [#45](https://github.com/subwaymatch/tabbied/pull/45) [`5106c19`](https://github.com/subwaymatch/tabbied/commit/5106c19a8297d46ca2035c6cea94b85c518d875f) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add the 19 curated batch-5 artwork presets (gallery orders 414-604). They
  landed in the catalogue shortly after `0.1.0` was published and never carried a
  changeset of their own, so this is the first release note to mention them:
  Bobbin, Bowl, Chamfer, Cinch, Cleat, Diadem, Dogtooth, Ell, Frond, Lobe,
  Loophole, Notchblock, Octagon, Quaver, Quoit, Sail, Sliver, Spark and Wavelet.

  Each draws one shape per cell from a hand-picked outline - a chamfered square,
  a quarter-disc, a squared ring, an eight-point spark - and reseeding re-rolls
  the orientation or the ink rather than scattering position and angle. Every one
  takes the catalogue's two standard controls, `grid` (columns and rows) and
  `frequency`.

  None of them is an SVG-export exception: no `svgExport: false` and no
  `svgExportNote`, so all 19 offer an unqualified "Download SVG".

- [#43](https://github.com/subwaymatch/tabbied/pull/43) [`12ddf44`](https://github.com/subwaymatch/tabbied/commit/12ddf44adf1359676d66465f6c042d0a19591e14) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add native SVG export. `controller.exportSvg()` and the React handle's
  `exportSvg()` convert the rendered artwork into a true vector SVG - real
  shapes, gradients, clips and masks, no `<foreignObject>` - so exports open in
  design tools and scale to any resolution. Pass `{ download: true }` to save a
  `.svg` file directly. Designs that paint smooth conic-gradient sweeps (which
  SVG cannot represent) opt out via the new `svgExport: false` definition flag;
  check `supportsSvgExport(artwork)` before offering the option. Blur, glow
  shadows and blend modes export as SVG filter effects and are reported in the
  result's `warnings` (they render correctly in browsers but may degrade when
  imported into some design tools).

  The converter (~21 KB gzipped) stays out of the main bundle: `exportSvg()`
  loads it on demand through a dynamic import, and direct use is available via
  the new `tabbied/svg-export` subpath (`import { doodleToSvg } from
'tabbied/svg-export'`).

  Designs with known export limitations (filter-based effects, documented
  sub-pixel deviations) describe them in the new `svgExportNote` fields on the
  definition and on toggle options, for export UIs to surface before
  downloading.

- [#31](https://github.com/subwaymatch/tabbied/pull/31) [`b57bb03`](https://github.com/subwaymatch/tabbied/commit/b57bb03029f1f9a3321197915da312430108d1b8) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Sizing correctness, off-screen perf, and packaging fixes.

  **Fit modes**

  - `fit="cover"` no longer cuts grid-driven artworks off mid-cell: the render
    box now follows the host's aspect ratio and re-derives its grid, tiling the
    box edge-to-edge with whole, near-square cells. Special layouts (artworks
    without a `grid` option, e.g. Symmetry, or renders with an explicit
    `cropTop`) keep the previous scale-and-crop behavior.
  - `fit="grid"` no longer produces visibly stretched cells: cols/rows are now
    chosen jointly (scored by cell squareness) instead of rounding each axis
    independently, and a cell floor above the box's short edge no longer forces
    a distorted 1×N grid.

  **Performance**

  - `redrawInterval` now skips ticks while the element is outside the viewport
    (built-in IntersectionObserver), so off-screen animated artworks cost
    nothing. `paused` remains as an external gate on top.
  - The unsupported-`fit` console warning fires once per artwork+fit pair
    instead of on every render/resize tick.

  **Fixes**

  - `destroy()` (and fit changes away from cover/contain) restore the host's
    inline `position`/`overflow` styles instead of leaving them mutated.
  - Palette colors and option values are sanitized before being substituted
    into the generated stylesheet, closing a CSS-injection vector via untrusted
    values (e.g. URL-driven palettes).
  - ToggleSwitch options no longer inject the literal string `true` into the
    doodle half of custom definitions.

  **Packaging (breaking)**

  - The core `tabbied` entry no longer re-exports the full preset catalog -
    import presets from `tabbied/artworks` instead. This keeps `createArtwork`
    consumers from carrying all 100+ designs in unshaken environments.
  - Added `default` export conditions, top-level `main`/`types` fallbacks, and
    a `./package.json` export for older resolvers; the raw `artworks/*.json`
    files (unreachable through the exports map) are no longer shipped; source
    maps now inline their sources.

- [#42](https://github.com/subwaymatch/tabbied/pull/42) [`95127ff`](https://github.com/subwaymatch/tabbied/commit/95127ff3b0a15b91b43ae66b393a364a90483bee) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Removed the `awning` artwork.

  `import { awning } from 'tabbied/artworks'` no longer resolves, and `awning` is
  gone from the `artworks` record and from `ArtworkSlug`. There is no drop-in
  replacement - the design is retired rather than renamed. The showcase sites that
  used it now use `louvre` (angled slats) and `fluting`, which sit in the same
  architectural family if you need somewhere to land.

- [#41](https://github.com/subwaymatch/tabbied/pull/41) [`f5eed7c`](https://github.com/subwaymatch/tabbied/commit/f5eed7cc491f847941c1d5d514087737ee71241a) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add 70 new generative designs and retire 15, bringing the preset catalog to 169.

  **Batch 7 (orders 700+, 24 designs)** works in the idiom of the eleven artworks
  Syung Hong drew by hand: one shape per cell, its outline rolled out of a short,
  deliberately chosen library rather than a continuum, and a single ink sampled
  per cell.

  **Batch 8 (orders 900+, 10 designs)** is organised around css-doodle's own
  generators - `@shape()` walking an equation into a clip-path, `mask: @svg(...)`,
  CSS gradient masks, `@match` on the cell's address, and `mask: @doodle(...)`.

  **Batch 9 (orders 1000+, 23 designs)** inverts the usual relationship between
  cell and canvas. Every batch before it draws a tile and repeats it; these read
  `@x`/`@y` against `@X`/`@Y` and use them to place the cell inside one larger
  picture, so changing the grid changes the resolution of the composition rather
  than the number of copies. It leans on three things no earlier batch used: real
  maths on the cell coordinates (`@sqrt`, `@atan2`), conic gradients - the only
  way to sweep a value round an angle - and SVG _stroke_, for line art rather than
  filled shapes.

  **Batch 10 (orders 1100+, 13 designs)** sits between the two: these motifs are
  bigger than a cell and smaller than the sheet, so the grid stops being a frame
  around each drawing and becomes what the drawing is assembled from. `Sunray` and
  `Spray` cut a conic sector out of the cell so the shape opens from a point;
  `Plait`, `Chain` and `Staple` run a motif from one cell into the next;
  `Fenestrate` and `Perforate` make the drawing the hole; `Arris`, `Haunch` and
  `Abutment` build off the corner rather than the middle; `Frieze`, `Reeding` and
  `Fluting` band across the sheet.

  Fifteen earlier designs are retired (Morse, Daybreak, Shuffle, Domino, Aster,
  Aperture, Zipper, Polaroid, Carousel, Matte, Lens, Ibeam, Tictac, Crosshatch,
  Sawedge); the sample sites and showcase pages that used them now use other
  presets.

  Every design in all four batches is background-independent: no rule paints
  `var(--color0)`, so every gap is real geometry - a mask, a clip-path hole, a
  `frame:` outline, or a gap between elements - and each renders identically over
  any background, including a transparent one.

- [#40](https://github.com/subwaymatch/tabbied/pull/40) [`6c5977b`](https://github.com/subwaymatch/tabbied/commit/6c5977b8b2fc3c18c7f682bda510cd859e759987) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add 19 ordered, background-independent artwork presets (batch 6).

  Two properties set this batch apart.

  **Ordered.** Where the earlier batches lean on scatter - Confetti, Shard and
  Sprinkles roll a fresh position, size and angle for every cell - nothing here
  is placed at random. Every shape sits on the cell grid, and what varies from
  cell to cell varies by rule: `@match` on the cell's column/row/index, `@pn()`
  cycling a value in order, or `@calc()` ramping a size, angle or bore across the
  canvas. No `@rand()` anywhere. Reseeding re-inks a design without rearranging
  it, so a redraw reads as a new colorway of the same pattern.

  **Background-independent.** A design that knocks holes out of its shapes by
  painting `var(--color0)` only looks right while the background is opaque -
  set the background slot to transparent and those "holes" stop erasing
  anything. So every gap in this batch is real geometry (a clip-path hole, a
  mask, or a gap between shapes) and no rule paints the background color. Each
  design renders identically over any background, including none, which makes
  them usable as overlays and transparent PNG exports.

  The designs: Louvre, Kerf, Damier, Bias, Hurdle, Isocube, Lintel, Lunette,
  Annulus, Ovolo, Cove, Mortise, Rafter, Ogee, Buttonhole, Gutter, Diminuendo,
  Taper and Torsion.

- [#42](https://github.com/subwaymatch/tabbied/pull/42) [`95127ff`](https://github.com/subwaymatch/tabbied/commit/95127ff3b0a15b91b43ae66b393a364a90483bee) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Artworks are never distorted to fit, and the box they render into is now part of
  the API.

  **`fit="stretch"` is removed (breaking).** It was the one strategy that scaled an
  artwork by a different factor horizontally than vertically - keeping the authored
  grid and letting cells deform with the container. Nothing does that any more:
  `grid` re-derives the cell grid so cells stay near-square at any box shape,
  `cover`/`contain` scale a render uniformly, and `fixed` draws at an explicit
  canvas size. Passing `"stretch"` now falls back to the artwork's default fit and
  logs what to use instead.

  **Box props.** An artwork has no intrinsic size, and until now the wrapper had no
  size either - `<TabbiedArtwork artwork={radius} />` rendered a zero-height box
  unless you also passed `style`. The box is now addressable directly, and **fills
  its container by default**:

  ```tsx
  // .panel is 100% wide and 400px tall; the artwork fills it.
  <div className="panel">
    <TabbiedArtwork artwork={radius} />
  </div>

  // Or bound it, with no sized parent involved.
  <TabbiedArtwork artwork={radius} maxWidth={960} aspectRatio={3 / 2} />
  <TabbiedArtwork artwork={radius} height="40vh" maxHeight={520} />

  // Or hand sizing back to CSS.
  <TabbiedArtwork artwork={radius} fill={false} className="hero-art" />
  ```

  - New props: `fill` (default `true`), `maxWidth`, `maxHeight`, `aspectRatio`.
  - `width`/`height` now accept a CSS length as well as a px number, and size the
    box under every fit. Under `fit="fixed"` the numeric form still sets the canvas
    resolution, so existing `fixed` usage is unchanged.
  - They resolve to inline styles on the wrapper, server render included, so the
    box is correct before the artwork mounts - no layout shift.
  - The core API gets the same thing as a pure helper: `resolveBoxStyle(size)`
    returns the CSS to assign to your own host element.

### Patch Changes

- [#39](https://github.com/subwaymatch/tabbied/pull/39) [`b96bf3c`](https://github.com/subwaymatch/tabbied/commit/b96bf3ced44286ed87c955a973496ac40ebf6c6b) Thanks [@subwaymatch](https://github.com/subwaymatch)! - No transition animation on an artwork's first draw.

  Artwork rules carry their own `transition`, which is what makes `redraw()` morph
  one arrangement into the next. On the very first paint there is nothing to morph
  from, so every cell was animating in from its unstyled state: the drawing
  visibly assembled itself over ~400ms, and a page holding many artworks paid for
  thousands of simultaneous transitions while it was still loading.

  `createArtwork` now mutes transitions inside the css-doodle shadow root for the
  first two frames of a newly mounted element, then removes the override. First
  paint lands finished; `redraw()` and every later update animate exactly as
  authored. No API change.
