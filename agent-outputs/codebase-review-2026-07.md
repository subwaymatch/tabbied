# Codebase & npm package review — July 2026

Full review of the site and the published `tabbied` package (logic, CPU/memory,
CSS, accessibility, packaging), performed alongside the sizing fixes, brand
palettes, and docs redesign. Findings were verified against the code (and where
noted, at runtime) before being accepted. Items marked **fixed** were addressed
in the same PR; the rest are recorded here with suggested fixes.

## Package (`packages/tabbied`)

### Fixed in this PR

1. **Off-screen animation cost** — `redrawInterval` ticked for elements
   scrolled out of view (only the tab's visibility and the external `paused`
   prop gated it). The site's gallery hand-rolled an IntersectionObserver to
   compensate; every other consumer (including the docs demo) paid a full
   css-doodle stylesheet regeneration every N ms for invisible artwork.
   *Fix:* built-in viewport gating in `TabbiedArtwork` — ticks are dropped
   while the element is off-screen.
2. **`fit="cover"` cut grid artworks mid-cell** (the reported vertical cutoff).
   *Fix:* adaptive cover — the render box follows the host's aspect ratio and
   re-derives its grid; special layouts (no grid option / `cropTop`) keep
   scale-and-crop. See `sizing.ts` / `createArtwork.ts`.
3. **Stretched cells** in `deriveGridForBox` — independent per-axis rounding
   could pair a rounded-up axis with a rounded-down one (up to ~2× distortion
   at small counts; a min-cell floor above the box's short edge forced 1×N
   grids). *Fix:* joint cols/rows selection scored by cell squareness.
4. **Host style mutation leak** — cover/contain set `position`/`overflow` on
   the consumer's element and never restored them on `destroy()` or fit
   change. *Fix:* backup and restore.
5. **CSS injection** — palette colors and option values were substituted into
   a document-level stylesheet unescaped; a crafted `?palette=` share-link
   value could escape the scoped rule and inject page CSS. *Fix:* strip
   `{};` from substituted values.
6. **ToggleSwitch substitution bug** — the "on" branch injected the literal
   string `true` into the doodle half (latent for shipped presets, wrong for
   custom definitions). *Fix:* substitute the authored snippet in both halves.
7. **Exports map gaps** — no `default` condition, no top-level `main`/`types`,
   no `./package.json` export: `require('tabbied')` and older resolvers
   (Jest CJS, `moduleResolution: node10`) failed outright. *Fix:* added all
   three.
8. **Packaging dead weight** — all 103 raw `artworks/*.json` shipped but were
   unreachable through the exports map; source maps referenced `src/` paths
   not present in the tarball. *Fix:* dropped `artworks` from `files`,
   `inlineSources` for maps, removed `declarationMap`.
9. **Core entry pulled the whole catalog** — `tabbied` re-exported all 100+
   presets, so unshaken consumers of `createArtwork` carried ~200 KB of
   definitions. *Fix (breaking, pre-1.0):* presets now come only from
   `tabbied/artworks`.
10. **Console-warning flood** — `resolveFitMode` warned on every render/resize
    tick for an unsupported fit. *Fix:* warn once per artwork+fit pair.
11. **Broken documented example** — the README/docs core example called
    `redraw()`/`exportImage()` immediately after `createArtwork()`, which
    always throws for measured fits (the element mounts on the first
    ResizeObserver tick). *Fix:* examples drive the controller from `onReady`.
12. **Codegen reserved words** — a slug like `do` or `if` would generate
    `export const if = …` and break the build with a confusing syntax error.
    *Fix:* reserved-identifier guard in `codegen.mjs`.

### Noted, not fixed

- `exportImage()` still rejects before mount rather than awaiting it; a
  controller-level ready promise would make the imperative API friendlier.
- `randomSeed()` uses `Math.random` over a 62⁴ space — fine for aesthetics,
  worth documenting if ever used for dedup.
- Every gallery card keeps a live `setInterval` once approached (~160 timers
  after a full scroll, each a cheap no-op `paused` check). Consider tearing
  down while paused and preserving phase with a timestamp.

## Site

### Fixed in this PR

1. **Landing-page CLS (high)** — the entire hero was behind `ssr: false` with
   no reserved space, so the page rendered without it and a ~600px section
   inserted itself after hydration. *Fix:* the hero section (text/CTA/blue
   background) is server-rendered; only the css-doodle backdrop lazy-mounts
   into its absolutely-positioned slot.
2. **Editor dead in dev (high)** — Pickr + StrictMode crashed every editor
   page under `next dev` (`Cannot read properties of null (reading
   'parentNode')`): Pickr replaces its target node and `destroyAndRemove()`
   doesn't restore it, so StrictMode's second mount found nothing. *Fix:* a
   fresh target node is created inside the effect per mount.
3. **RSC fetch per knob tweak** — every slider step / grid click ran
   `router.replace`, fetching an identical static RSC payload from the CDN
   (7 fetches per slider drag, measured). *Fix:* native
   `window.history.replaceState` (App Router keeps `useSearchParams` in sync).
4. **"Back to gallery" misnavigation** — `router.back()` fired whenever
   `history.length > 1`, so a deep-linked editor sent users back to Google (or
   wherever), with the scroll-restore flag left armed. *Fix:* gallery cards
   mark the navigation in sessionStorage; the editor consumes the marker and
   only goes `back()` when it was really opened from the gallery.
5. **URL param validation** — `?frequency=` parsed to `0` (below slider min)
   and out-of-range/unknown values passed through. *Fix:* clamp numeric
   params to option bounds, validate select values, `^\d+x\d+$` for grids.
6. **IntersectionObserver staleness** — callbacks read `entries[0]` instead of
   the latest batched entry (gallery pause + hero pause). *Fix:* read the last
   entry.
7. **`optimize-images.mjs` double-encode** — the encoded buffer was re-encoded
   with sharp defaults, discarding the configured quality settings. *Fix:*
   write the buffer as-is.
8. **`vercel-ignore-build.sh`** — the `HEAD^` fallback could skip deployable
   changes on multi-commit pushes. *Fix:* only trust the parent fallback for
   single-commit history; otherwise build.
9. **Product Hunt badge** — a third-party CSS `background-image` in the footer
   loaded eagerly on every page and could delay/block `load`. *Fix:* a lazy
   `<img>` with explicit dimensions.
10. **A11y batch** — restored `:focus-visible` outlines (slider thumb, editor
    header buttons, drawer links); contrast fixes (ButtonSelectGroup labels,
    editor icon buttons, ToggleSwitch off-state + border); slider thumbs and
    Pickr swatches now have distinct accessible names; gallery page has an
    `h1`; `100vw` height typo → `100dvh`.
11. **Shimmer compositing** — the gallery loading shimmer animated
    `background-position` (main-thread repaints on every visible loading
    card). *Fix:* animate `transform` on an oversized band layer. Also fixed
    the dead `.galleryCard:hover` color rule.
12. **e2e brittleness** — the scroll-restore test now asserts the picked card
    href is non-null before clicking.

### Noted, not fixed

- `Footer` bakes `new Date().getFullYear()` at build time — the year goes
  stale every January until a rebuild. Consider a hardcoded range or a tiny
  client island.
- `HowItWorks` mobile breakpoints use fixed image heights that only match at
  specific viewport widths (blank bands elsewhere); `aspect-ratio: 960/650`
  would fix it.
- Duplicated tokens/styles: `#ed005f` hardcoded where `--red-high-contrast`
  exists; `.galleryCard` styles duplicated (and drifted) between
  BrowseArtwork and SelectArtwork modules; `.actionBtn` copy-pasted between
  Hero and MakeYourArt.
- Dangling CSS-module references (`styles.center` in MakeYourArt,
  `styles.textHeader`/`styles.names` in BuiltBy) silently resolve to
  `undefined`.
- Dead rules: global `.btn` in `globals.css`, the `margin: 0` media rule in
  BrowseArtwork, the `.pcr-picker` z-index override in `pickr.css`.
- White-on-`#ed005f` CTA text measures ~4.4:1 — marginal AA fail at normal
  sizes.
- `align-items: safe center` is dropped by Safari (editor options column
  falls back to top-aligned) — cosmetic inconsistency.
- `GalleryDoodleInner` imports the full `artworks` record (~144 KB deferred
  chunk) to render 7 homepage thumbnails; per-slug imports would shrink it.
