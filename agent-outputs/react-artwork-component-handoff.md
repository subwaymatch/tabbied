# Tabbied artworks as a reusable React component — research report & implementation handoff

- **Date:** 2026-06-10
- **Repo:** `subwaymatch/tabbied-site-nextjs` (branch researched: `claude/sweet-euler-atbtlf`, based on `a1a9af7`)
- **Audience:** a coding agent (or developer) implementing the component package. This document contains everything needed to start: verified facts about the current codebase and `css-doodle`, decision rationale, a recommended API, and a phased implementation plan.

---

## 0. TL;DR — answers to the four questions

| # | Question | Recommendation |
|---|----------|----------------|
| 1 | Separate repo? | **No. Keep one repo.** Add Yarn workspaces with a `packages/tabbied` folder; the Next.js site stays where it is and consumes the package. Publish to npm from the package folder. The npm names `tabbied`, `tabbied-react`, and the `@tabbied` scope are all unclaimed (verified 2026-06-10). |
| 2 | Portable to Vue/Svelte? | **Yes, easily.** `css-doodle` is a framework-agnostic web component and ~90% of the pipeline (`lib/doodleSource.ts`, `lib/aspectRatio.ts`, `lib/seed.ts`, the artwork JSON) is already pure TypeScript. Structure the package as a **vanilla-JS core + thin framework wrappers** exposed as subpath exports (`tabbied`, `tabbied/react`, later `tabbied/vue`, `tabbied/svelte`). Each additional wrapper is roughly a day of work. |
| 3 | Dynamic width/height? | **Generalize the existing grid-derivation math from preset ratios to arbitrary container sizes.** Pick a target cell size, measure the container with `ResizeObserver`, set `@size: 100% 100%`, and compute `cols × rows` so cells stay near-square (clamped to css-doodle's 64×64 grid maximum). Offer this as the default `fit="grid"` strategy, plus `stretch`, `cover`/`contain` (the gallery's existing transform-scale technique — required for *Symmetry* and best for px-heavy artworks), and `fixed`. |
| 4 | Component structure? | **A client component (`'use client'` baked into the published files) that renders a measurable wrapper `<div>`, shows only the palette background until mounted, then mounts `<css-doodle>`.** Props: `artwork`, `seed`, `palette`, `options` (named record), `fit`, `cellSize`/`density`, `className`/`style`, a11y props; an imperative ref handle for `redraw()` / `exportImage()`. Build with plain `tsc` (no bundler) so the `'use client'` directive is preserved naturally. React ≥ 18 as a peer dependency. |

---

## 1. Current architecture (verified by reading the code)

### 1.1 Stack

- Next.js ^16.2.7 (App Router), React ^19.2.7, TypeScript ^6, **css-doodle ^0.51.0**, Yarn 1 (`yarn.lock` v1).
- Playwright e2e smoke tests (`yarn build && yarn test:e2e`).
- No LICENSE file in the repo (matters for npm publishing — see §7).

### 1.2 Rendering pipeline

```
artworks/<slug>.json                          19 presets: name, slug, palette[6-ish],
  │                                           options[], code.{style,doodle}, gallery meta
  ▼
lib/doodleSource.ts → buildDoodleSource()     pure string substitution:
  │                                           ${optionPlaceholders}, ${width}, ${height},
  │                                           palette → --color0..N custom props,
  │                                           fixFullRandomGate() compat shim
  ▼
<style> css-doodle#<id> { --color0:…; --rule:(…) } </style>
<css-doodle id=<id> data-seed=<seed> use="var(--rule)">  :doodle { @grid: …; @size: …; … }  </css-doodle>
```

Key files:

| File | Role |
|------|------|
| `lib/artwork.ts` | `Artwork` / `ArtworkOption` types; reads `artworks/*.json` from disk (server-only, uses `node:fs`) |
| `lib/doodleSource.ts` | `buildDoodleSource()` — the substitution engine. Pure TS, no DOM, no React. Width/height are injected as **CSS lengths** (`"360px"`, `"100%"` both valid per its doc comment) |
| `lib/aspectRatio.ts` | Preset ratios `1:2, 2:3, 1:1, 3:2, 2:1`; `deriveGrid(ratio, level)` keeps cells near-square using long-edge counts `[3, 6, 9, 12, 15]`; `gridToLevel()` maps back |
| `lib/seed.ts` | `randomSeed(4)` — alphanumeric seeds |
| `components/Doodle/index.tsx` | The React wrapper. Renders `<style>` + `<css-doodle>`; pushes post-mount changes through `element.update(doodleCode)` |
| `components/edit-artwork-page/EditArtwork.tsx` | Editor: exact-pixel sizing (`fitToBox`), grid re-derivation on ratio change, `export({ scale, download })` |
| `components/select-artwork-page/GalleryDoodleInner.tsx` | Gallery thumbnails: renders at a **fixed 800×800**, then `transform: scale(...)` cover-fits into the card (lines 106–128). Auto-reseeds every 2.5–4 s, respects `prefers-reduced-motion`, drops ticks when the tab is hidden |
| `css-doodle.d.ts` | JSX typing for the `<css-doodle>` intrinsic element |

### 1.3 Hard-won behaviors that MUST be preserved in the library

These are documented in code comments and represent debugging effort; re-deriving them would be expensive:

1. **Seed rides on the unobserved `data-seed` attribute, never the observed `seed` attribute.** css-doodle's `generate()` falls back to `attr('seed') || attr('data-seed')` (verified in `node_modules/css-doodle/src/component.js:385`). Changing the observed `seed` attribute rebuilds every cell element, killing CSS transitions; pushing changes through `update()` swaps the generated stylesheet in place so cells persist and transitions animate (`components/Doodle/index.tsx:25-40`).
2. **css-doodle ≥ 0.5 doesn't re-read text content on bare `update()`** — always pass the current source: `update(doodleCode)`.
3. **Mount-render guard:** css-doodle renders its text content on mount; the `renderedSource` ref pattern skips the first effect run so nothing renders twice (also makes the component React-StrictMode-safe).
4. **`fixFullRandomGate()`:** css-doodle ≥ 0.5 reads `@random(1)` as a one-cell count, not a 100% gate; the shim rewrites it to `@random(0.999)`. This means the package should **pin css-doodle to `^0.51`** and treat version bumps as behavior-audit events.
5. **Pattern determinism:** "The generated pattern depends only on the seed and grid, so the same inputs render identically at any size" (`lib/doodleSource.ts:29-31`). Same seed + same grid = same artwork at 100 px or 3000 px. Changing the grid changes the arrangement.

### 1.4 Artwork uniformity (important for dynamic sizing)

Verified across all 19 presets:

- **18 of 19** share the identical doodle shell: `:doodle { @grid: ${grid}; @size: ${width} ${height}; … } :container { background: var(--color0); … }`, with a `grid` option (id `"grid"`) holding a `"colsxrows"` string.
- **Symmetry** is the exception: fixed `@grid: 1x13`, no grid option, and its `:container` CSS letterboxes a centered 2:3 composition. It cannot density-adapt; it must letterbox/cover.
- **Fixed-px effects inventory** (count of `\d+px` occurrences in `code.style`): ring 15, metro 9, terrain 6, bloks 4, odessa 4, symmetry 4, blossom 2; the other 12 artworks have none. Px-based strokes/shadows do **not** scale with cell size, which is exactly why the gallery scales a fixed-resolution render instead of rendering at card size. This motivates per-artwork sizing metadata (§4.4).

### 1.5 css-doodle facts (verified against the installed 0.51.0 package and css-doodle.com)

| Fact | Evidence |
|------|----------|
| Importing `css-doodle` in plain Node **does not crash** — element registration is guarded (`customElements ‖ customElements.get(e) ‖ customElements.define(e,t)`) | Ran `node -e "import('css-doodle')"` in this repo → `import OK` |
| Package exports: `.` (min bundle, auto-registers), `./component` (`CSSDoodle`, `define`, `create`), `./generator` (**only** `shape` and `svg` helpers), `./parser` | `node_modules/css-doodle/package.json` + `src/exports/*` |
| **There is no DOM-free full renderer.** The pattern can only be produced by the custom element in a real browser DOM (shadow root + generated stylesheet). True server-side pattern rendering is not possible today | `src/exports/generator/index.js` exports only `shape`/`svg` |
| Max grid is **64×64** (`parse_grid(size, GRID = 64)`); 1-dimensional grids extend to 4096 cells | `node_modules/css-doodle/src/parser/parse-grid.js:3` + css-doodle.com docs |
| `update(styles)` re-renders; `export({ scale, name, download, detail })` produces an image (used by the editor with `scale: ceil(3000/maxEdge)`) | `src/component.js:157,201`; `EditArtwork.tsx:349-356` |
| `@size` accepts any CSS length including `100%` and viewport units | css-doodle.com docs; `lib/doodleSource.ts:25` doc comment |
| The docs recommend the `use="var(--rule)"` + CSS-custom-property pattern (which this codebase already uses) for production | css-doodle.com |

---

## 2. Question 1 — Repository strategy: keep one repo

### 2.1 Options considered

| Option | Pros | Cons |
|--------|------|------|
| **A. Separate repo** | Independent issues/stars/CI | Two repos to keep in sync; artwork JSON (the actual creative asset, updated in this repo) would need vendoring or a git submodule; contradicts the user's stated preference |
| **B. Single repo + Yarn workspaces (recommended)** | One source of truth for artworks; the site becomes the package's permanent integration test ("dogfooding"); publish straight from the subfolder; zero-friction local dev via workspace symlinks | Slightly more root-level config; package versioning lives next to app code |
| **C. Single repo, publish a subfolder without workspaces** | Minimal change | The site can't consume the package without `file:` hacks; no dogfooding; drifts immediately |

**Recommendation: B.** The user prefers one repository, and the strongest technical argument agrees: the artwork JSON files are living assets (new presets land regularly — see recent commits), and the site is the best possible regression test for the package.

### 2.2 Proposed layout

```
tabbied-site-nextjs/
├─ package.json                 # add: "workspaces": ["packages/*"]  (root stays "private": true)
├─ app/  components/  lib/  …   # Next.js site stays at the root (no churn)
├─ packages/
│  └─ tabbied/                  # the publishable package (npm name: "tabbied" — available)
│     ├─ package.json           # "type": "module", exports map → dist/, peer dep react
│     ├─ tsconfig.json
│     ├─ artworks/              # ← the JSON presets MOVE here (single source of truth)
│     ├─ scripts/codegen.mjs    # artworks/*.json → src/artworks.generated.ts (typed, tree-shakeable)
│     └─ src/
│        ├─ core/               # framework-agnostic: types, buildDoodleSource, sizing math,
│        │                      # seed, vanilla createArtwork() controller
│        ├─ react/              # 'use client' wrapper component + hooks
│        └─ artworks.generated.ts
└─ agent-outputs/               # this report
```

Notes for the implementer:

- **Yarn 1 workspaces:** add `"workspaces": ["packages/*"]` to the root `package.json` (it is already `"private": true`, which Yarn 1 requires). The site then resolves `tabbied` through the workspace symlink.
- **Artwork data ownership:** move `artworks/*.json` into the package. The site's `lib/artwork.ts` currently reads them from disk with `node:fs`; after the move it should import the generated module from the package instead (`import { artworks } from 'tabbied'`). Site-only fields (`galleryOrder`, `galleryWhite`, `defaultAspectRatio`, `description`) can stay in the JSON and the package type — they're tiny and harmless in the published artifact (total JSON is ~50 KB raw; per-artwork modules make unused presets tree-shakeable anyway). Low-churn alternative if the move feels risky in phase 1: keep `artworks/` at the root and have the package's codegen read `../../artworks` at build time; the published tarball still contains the generated module. Prefer the move — it makes the package self-contained.
- **Codegen instead of runtime JSON loading:** generate `artworks.generated.ts` with one named `const` export per artwork (typed `ArtworkDefinition`) plus a `artworks` record. This (a) removes the `node:fs` dependency from library code, (b) gives consumers compile-time slug types, (c) enables tree-shaking per artwork.
- **Site consumption during dev:** point the package `exports` at `dist/` always (Yarn 1 cannot rewrite `exports` via `publishConfig` at publish time, so source-pointing exports would complicate publishing). Add a root convenience: `"predev": "yarn workspace tabbied build"` and `"prebuild": "yarn workspace tabbied build"`, plus `yarn workspace tabbied dev` (`tsc --watch`) for active package development. If rebuild friction annoys later, Next's `transpilePackages: ['tabbied']` consuming source is the known alternative (Turborepo "internal package" pattern), but dist-first keeps publishing trivial and tool-agnostic.
- **Publishing:** `cd packages/tabbied && npm publish` (with a `prepublishOnly: "npm run build"` script). Versioning by hand (`npm version`) is fine at this scale; adopt Changesets only if release cadence grows.
- **CI:** add `yarn workspace tabbied build && yarn workspace tabbied typecheck` before the existing Playwright job. The existing e2e suite doubles as the package's integration test once the site consumes it.

---

## 3. Question 2 — Portability to Vue/Svelte: yes, by construction

### 3.1 Why it's easy here

Two structural facts make this codebase unusually portable:

1. **`<css-doodle>` is a web component** — it has no knowledge of React. Vue and Svelte both consume custom elements natively (Svelte templates support them out of the box; Vue only needs `isCustomElement: (tag) => tag === 'css-doodle'` in the *wrapper library's* build config — consumers never see this).
2. **Everything except the ~50-line DOM glue is already pure TypeScript**: artwork data, `buildDoodleSource()`, grid/sizing math, seeds. None of it imports React.

### 3.2 Recommended structure: vanilla core + thin wrappers in one package

Ship **one npm package with subpath exports** rather than separate packages per framework (simpler publishing, one version number, shared core):

```jsonc
// packages/tabbied/package.json (sketch)
{
  "name": "tabbied",
  "type": "module",
  "exports": {
    ".":        { "types": "./dist/core/index.d.ts",  "import": "./dist/core/index.js" },
    "./react":  { "types": "./dist/react/index.d.ts", "import": "./dist/react/index.js" }
    // later: "./vue", "./svelte"
  },
  "dependencies": { "css-doodle": "^0.51.0" },
  "peerDependencies": { "react": ">=18 <20" },
  "peerDependenciesMeta": { "react": { "optional": true } },
  "sideEffects": ["./dist/**/register.js"]   // see §5.6 — css-doodle import IS a side effect
}
```

The portability lynchpin is a **framework-free controller** in core. Wrappers then shrink to "call controller on mount, forward prop changes, destroy on unmount":

```ts
// core/createArtwork.ts (sketch — framework-free)
export type ArtworkController = {
  update(config: Partial<ResolvedConfig>): void;  // diffs → element.update(doodleCode)
  redraw(seed?: string): void;
  exportImage(opts?: { scale?: number; download?: boolean; name?: string }): Promise<Blob | void>;
  destroy(): void;
};

export function createArtwork(host: HTMLElement, config: ArtworkConfig): ArtworkController {
  // 1. registers the element (import 'css-doodle' in a register.ts side-effect module)
  // 2. builds source via buildDoodleSource(), creates <style> + <css-doodle data-seed use="var(--rule)">
  // 3. owns the ResizeObserver + grid-adaptation loop (fit: 'grid' — §4)
  // 4. implements the update()-not-attribute rules from §1.3
}
```

This is the same adapter architecture used by Embla Carousel, FullCalendar, AG Grid, etc.: the React/Vue/Svelte packages are each thin idiomatic shells. With the controller in place:

- **React wrapper:** ~100–150 lines (`'use client'`, `useRef` + effect lifecycle, `useImperativeHandle` for the controller, mounted-flag SSR handling — §5.2).
- **Vue wrapper (later):** a `<script setup>` component calling the controller in `onMounted`/`onUnmounted`; build with `@vitejs/plugin-vue` + the `isCustomElement` flag. ~1 day including packaging.
- **Svelte wrapper (later):** same shape with `$effect`/`onMount`; Svelte needs no custom-element config. ~1 day.
- **Escape hatch for any other framework:** document `createArtwork()` directly — it already works in vanilla JS, Astro islands, Web Components, etc.

### 3.3 React-version note

React 19 added full custom-element support (passes all Custom Elements Everywhere tests; client-side it assigns matching **properties**, otherwise attributes; SSR renders primitive props as attributes). The wrapper here only ever sets string attributes (`data-seed`, `use`, `id`/`data-*`) and text content — a pattern that already worked on React 16–18 (this very codebase ran it pre-19). So the peer range can safely be `>=18`, with React 19 consumers getting no special-casing at all.

---

## 4. Question 3 — Supporting dynamic width & height

### 4.1 How sizing actually works today

`@size` just sets the host element's CSS width/height; the cells are laid out by CSS grid and **stretch** to fill. The substitution already accepts `"100%"`. The pattern itself depends only on seed + grid (§1.3.5). The repo already contains the two endpoints of the design space:

- **Editor** (`EditArtwork.tsx`): exact pixel size, grid re-derived per aspect ratio so cells stay near-square.
- **Gallery** (`GalleryDoodleInner.tsx:106-128`): fixed 800×800 render, `transform: scale()` cover-fit into the card — preserving authored px effects at any card size.

Dynamic sizing = generalizing these into selectable strategies.

### 4.2 Strategy matrix (the `fit` prop)

| `fit` | Mechanism | JS on resize | Cell shape | Authored px effects | Pattern stable across resize? | Use for |
|-------|-----------|--------------|------------|---------------------|-------------------------------|---------|
| `grid` **(default)** | `@size: 100% 100%`; ResizeObserver derives `cols × rows` from a target cell size; `update()` only when the derived grid changes | Yes (debounced) | Near-square, always | Constant px (don't scale with cell) — clamp cell size per artwork | Arrangement re-randomizes when the grid steps; fluid in between | Backgrounds/sections of arbitrary, unknown size. "More area = more cells" **is** the natural repetition mechanism for these grid artworks |
| `stretch` | `@size: 100% 100%`, keep the authored grid | None | Distorts with container ratio | Constant px | Fully stable | Mild deviations from the authored ratio; cheapest option |
| `cover` / `contain` | Render at an authored ratio & fixed resolution (e.g. 800×1200), `transform: scale` + crop (cover) or letterbox (contain). Exactly the gallery technique; DOM scaling stays vector-crisp | Cheap (scale only) | Authored | **Scale proportionally** (preserves the authored look) | Fully stable | *Symmetry* (mandatory), px-heavy artworks (ring, metro, terrain), thumbnails, hero crops |
| `fixed` | Explicit `width`/`height` props in px (current editor behavior) | None | Per props | Constant px | Stable | Editors, exports, fixed slots |
| *(rejected)* tile | `export()` → blob → `background-image: repeat` | — | — | — | — | Random per-cell patterns are not edge-seamless; visible seams. Only viable with authoring changes (edge-matching cells). Not v1; noted as a future idea for static, zero-JS backgrounds |

### 4.3 The `fit: 'grid'` algorithm (core of the feature)

Generalizes `deriveGrid()` from 5 preset ratios to any box, reusing the authored density vocabulary:

```ts
// Authored density levels (lib/aspectRatio.ts): long-edge counts [3,6,9,12,15]
// against the editor's 360×540 base box → target cell sizes:
const DENSITY_CELL_PX = [180, 90, 60, 45, 36] as const;  // level 0..4
// Most presets default to "10x15" (level 4) → cellSize 36 matches today's look.

function deriveGridForBox(w: number, h: number, targetCell: number, meta: SizingMeta) {
  // Respect per-artwork bounds (px-effect artworks need a floor/ceiling),
  // then css-doodle's hard 64×64 cap — raising the *effective* cell size when
  // capped keeps cells near-square instead of letting one axis distort.
  const bounded = clamp(targetCell, meta.minCellPx ?? 24, meta.maxCellPx ?? 220);
  const cell = Math.max(bounded, w / 64, h / 64);
  return {
    cols: Math.max(1, Math.round(w / cell)),
    rows: Math.max(1, Math.round(h / cell)),
  };
}
```

Implementation notes:

- The component renders a wrapper `<div>` (receives `className`/`style`, is the ResizeObserver target) with the `<css-doodle>` inside at `@size: 100% 100%`. Between grid steps, resizing is pure CSS stretch (cells deviate from square by at most ~half a cell); when `cols×rows` changes, push the new source through `update()`.
- **Debounce** grid updates (~150–200 ms) — every grid change re-randomizes the arrangement (same seed, different grid ⇒ different layout). Document this honestly; it's inherent to the medium. The seed still makes any (size, grid) pair reproducible.
- The 64×64 cap is generous: at the default 36 px cell it covers ~2300×2300 px before cells start growing; a 4K background simply gets ~60 px cells (still square thanks to the `Math.max` above).
- Re-derive from `ASPECT_RATIOS`-style ratios is no longer needed, but keep `deriveGrid`/`gridToLevel` in core — the site's editor still uses them.

### 4.4 Per-artwork sizing metadata (add to the JSON schema)

```jsonc
// added to each artworks/<slug>.json
"sizing": {
  "allowed": ["grid", "stretch", "cover", "contain", "fixed"],  // omit "grid" for symmetry
  "default": "grid",
  "minCellPx": 28,        // floor for px-effect artworks (ring, metro, terrain, …)
  "maxCellPx": 200,
  "coverRender": { "width": 800, "height": 1200 }  // resolution for cover/contain fits
}
```

Defaults can be inferred (everything but Symmetry supports `grid`), so this can start as an override only where needed: **Symmetry** (`allowed: ["cover","contain","stretch","fixed"]`, `default: "cover"`), and conservative `minCellPx` for ring/metro/terrain/bloks/odessa/blossom (the px-effect inventory in §1.4 says which).

---

## 5. Question 4 — Component structure & API

### 5.1 Server vs client: it's a client component, and that's fine

- Rendering **requires a browser DOM** — css-doodle builds a shadow root and a generated stylesheet in `connectedCallback`. There is no DOM-free renderer (§1.5), so a true React Server Component that emits the pattern is impossible today.
- The module is still **safe to import during SSR** (registration is guarded — verified §1.5), so consumers can import it anywhere without `next/dynamic`; the `'use client'` directive makes it a client boundary in RSC apps automatically.
- **Do not SSR the `<css-doodle>` element with its source as text children**: before the element upgrades, custom-element children are ordinary text — users would see raw doodle code flash. The current site sidesteps this with `dynamic(..., { ssr: false })`; the library should bake the equivalent in (next point) so consumers don't need framework-specific lazy imports.

### 5.2 Hydration/placeholder behavior (bake in, don't delegate)

```
server render / first client paint:   <div class=… style="background: <palette[0]>"/>   ← correct size & bg, zero CLS
after mount (useEffect sets flag):    wrapper + <style> + <css-doodle …>source</css-doodle>
```

A `mounted` flag (`useState(false)` + `useEffect(() => setMounted(true))`) gives: no hydration mismatch (seed and measurements never affect server markup), no raw-text flash, and a visually sensible placeholder (the artwork's background color) until the pattern paints one frame later. This replicates what the site achieves via `ssr: false`, but portably and without consumer ceremony.

### 5.3 Proposed public API (React)

```tsx
import { TabbiedArtwork, type TabbiedArtworkHandle } from 'tabbied/react';
import { maze } from 'tabbied';            // tree-shakeable preset data (optional import style)

// — Typical decorative background —
<div className="relative">
  <TabbiedArtwork
    artwork="maze"                          // ArtworkSlug union, or a full ArtworkDefinition object
    seed="k9Pz"                             // omit → random once per mount
    palette={['#101418', '#e8f1ff', …]}     // optional; defaults to the preset palette
    options={{ frequency: 0.8, thickness: 10 }}  // named by option id; defaults from preset
    fit="grid"                              // 'grid' | 'stretch' | 'cover' | 'contain' | 'fixed'
    cellSize={36}                           // or density={0..4} → [180,90,60,45,36]px
    className="absolute inset-0 -z-10"      // sizing comes from normal CSS, like an <img>
  />
  <h1>Content on top</h1>
</div>

// — Imperative handle —
const ref = useRef<TabbiedArtworkHandle>(null);
ref.current?.redraw();                      // new random seed (or redraw('abcd'))
await ref.current?.exportImage({ scale: 4, download: true });  // wraps element.export()
ref.current?.element;                       // the raw <css-doodle> for power users
```

```ts
export type TabbiedArtworkProps = {
  artwork: ArtworkSlug | ArtworkDefinition;
  seed?: string;
  palette?: string[];                       // length-validated against the preset in dev
  options?: Record<string, string | number | boolean>;  // keyed by ArtworkOption.id
  fit?: FitMode;                            // default: artwork.sizing.default ?? 'grid'
  cellSize?: number;
  density?: 0 | 1 | 2 | 3 | 4;
  width?: number; height?: number;          // fit:'fixed' only
  /** true (default): aria-hidden decorative image. false: role="img" + ariaLabel. */
  decorative?: boolean;
  ariaLabel?: string;                       // defaults to artwork name when decorative={false}
  className?: string;
  style?: React.CSSProperties;
  onReady?: () => void;                     // first paint of the pattern
  ref?: React.Ref<TabbiedArtworkHandle>;    // React 19 ref-as-prop; forwardRef for 18
};
```

Design decisions worth recording:

- **`options` as a named record, not a positional array.** The internal `buildDoodleSource()` takes positional `optionValues` aligned with `artwork.options`; the component maps `{ [option.id]: value }` onto that order and fills gaps with `option.default`. Named props survive preset evolution and read better.
- **`artwork` accepts a slug or a full definition object.** Slug keeps bundles lean with the generated module; the object form lets advanced users define custom artworks with the same schema.
- **Random seed via lazy `useState(() => randomSeed())`** — stable across re-renders, never part of server markup, StrictMode-safe.
- **Style scoping: drop the `css-doodle#<id>` selector; use a `data` attribute.** The current `id`-based selector collides if a consumer mounts two instances of the same artwork. Use `useId()` for uniqueness, but select with `css-doodle[data-tabbied="<uid>"] { … }` — attribute selectors sidestep the fact that `useId()` values (`«r0»`-style) are not valid bare id selectors without escaping.
- **Keep the §1.3 update discipline** in the controller: seed on `data-seed`, changes through `update(doodleCode)`, `renderedSource` guard for mount/StrictMode.
- **Accessibility:** default `decorative` → `aria-hidden="true"` (these are backgrounds); `decorative={false}` → `role="img"` + `aria-label`. If an auto-redraw feature is ever exposed (the gallery's shimmer), make it opt-in (`redrawInterval?: number`) and respect `prefers-reduced-motion` + document visibility exactly as `GalleryDoodleInner.tsx:48-69` already does.

### 5.4 What stays in core vs the React layer

| Core (`tabbied`) | React (`tabbied/react`) |
|---|---|
| `ArtworkDefinition`/`ArtworkOption` types, generated preset data | `TabbiedArtwork` component (`'use client'`) |
| `buildDoodleSource`, `fixFullRandomGate` (moved from `lib/doodleSource.ts`) | mounted-flag SSR handling |
| sizing math: `deriveGridForBox`, density table, legacy `deriveGrid`/`gridToLevel` (moved from `lib/aspectRatio.ts`) | `useImperativeHandle` → controller |
| `randomSeed` (moved from `lib/seed.ts`) | prop-diffing → `controller.update()` |
| `createArtwork()` controller: DOM creation, ResizeObserver loop, update/redraw/export/destroy | — |
| `register.ts` (side-effect `import 'css-doodle'`) | — |

The site then deletes `lib/doodleSource.ts`, `lib/seed.ts`, most of `lib/aspectRatio.ts`, and rebuilds `components/Doodle` on the package (or replaces it outright with `TabbiedArtwork fit="fixed"` + the handle).

### 5.5 Build & packaging

- **Compile with plain `tsc`** — no bundler. The package is small, ships ESM + `.d.ts`, and unbundled per-file output preserves `'use client'` naturally (the directive only gets dropped by bundlers that concatenate files; with Rollup/tsup you'd need `banner: "'use client';"` or preserve-directives plugins — avoidable complexity here).
- **`exports` map** as in §3.2; `"files": ["dist", "artworks"]`; Node ≥ 18 engines.
- **css-doodle as a regular `dependency`** pinned `^0.51.0` (see §1.3.4 — its minor versions have changed generation semantics before; `fixFullRandomGate` exists for exactly that reason).

### 5.6 ⚠️ Tree-shaking gotcha: do NOT set `"sideEffects": false`

`import 'css-doodle'` *is* a side effect (it registers the custom element). With `"sideEffects": false`, bundlers will drop that import and the component renders nothing — a classic, hard-to-debug failure. Isolate the import in a `register.ts` module and declare `"sideEffects": ["./dist/**/register.js"]` (everything else stays shakeable).

---

## 6. Phased implementation plan

Each phase ends green: `yarn workspace tabbied build` + site `yarn build` + `yarn test:e2e` (after `npx playwright install chromium`).

**Phase 1 — Workspace + core extraction (no behavior change)**
1. Root `package.json`: add `"workspaces": ["packages/*"]`; scaffold `packages/tabbied` (tsconfig, build scripts).
2. Move `lib/doodleSource.ts`, `lib/seed.ts`, grid math from `lib/aspectRatio.ts` into `packages/tabbied/src/core/` (site-only helpers like `getCanvasSize` can stay in the site or move — keep the editor compiling).
3. Move `artworks/*.json` into the package; write `scripts/codegen.mjs` → `artworks.generated.ts`; rewrite the site's `lib/artwork.ts` to import from the package (drop `node:fs`).
4. Update all site imports; verify the site renders identically (e2e + eyeball gallery/editor).

**Phase 2 — Controller + React component**
5. Implement `createArtwork()` controller in core (per §3.2/§5.4), porting the update/seed discipline from `components/Doodle/index.tsx` and the cover-scale math from `GalleryDoodleInner.tsx`.
6. Implement `fit: 'grid'` (§4.3) with ResizeObserver + debounce; `stretch`, `cover`, `contain`, `fixed`.
7. Add `sizing` metadata to the JSON schema; set Symmetry's overrides + `minCellPx` for the px-effect artworks (§1.4 inventory).
8. Implement `TabbiedArtwork` (`tabbied/react`) with the §5.3 API, mounted-flag SSR behavior, a11y defaults, imperative handle.
9. Dogfood: swap the site's editor preview to `<TabbiedArtwork fit="fixed">` + handle (export/redraw), and gallery thumbs to `fit="cover"` with `redrawInterval`. If editor parity gets risky, defer the editor swap — the package must not block on it.

**Phase 3 — Publish**
10. Add LICENSE (root decision — see §7), package README with the §5.3 examples (decorative background, hero, export), CHANGELOG.
11. `npm publish` `tabbied@0.1.0`; tag; add package build/typecheck to CI before e2e.

**Phase 4 — Optional/later**
12. `tabbied/vue`, `tabbied/svelte` wrappers over the controller (~1 day each, §3.2).
13. Niceties: IntersectionObserver lazy mount, `onReady`, build-time SVG snapshots (via Playwright + `export()`) for zero-JS static backgrounds.

---

## 7. Risks, gotchas, open questions

| Item | Detail | Mitigation / decision needed |
|------|--------|------------------------------|
| **No LICENSE file** | Repo has none; npm publish + README badges imply open source | **User decision required** before Phase 3 (MIT is the ecosystem default; artworks are also creative works — decide if the license covers them) |
| css-doodle version drift | Generation semantics have changed across minors (`@random(1)`; text-content re-reads) | Pin `^0.51`, treat upgrades as audit events, keep `fixFullRandomGate` |
| `sideEffects` tree-shaking | Dropping the registration import blanks all artworks | §5.6 pattern; add an e2e that mounts via the *built* package |
| Grid steps re-randomize | `fit:'grid'` resizes change the arrangement at thresholds | Debounce; document; `stretch`/`cover` for stability-critical uses |
| 64×64 grid cap | Hard limit in css-doodle | Effective-cell-size clamp (§4.3) keeps cells square; cells just grow on huge canvases |
| Raw-source text flash | Only if SSR'ing `<css-doodle>` children | Mounted-flag placeholder (§5.2) |
| No server-side pattern rendering | No DOM-free renderer exists in css-doodle 0.51 | Accept client-only; optional Phase 4 static-SVG pipeline for SSG needs |
| Package name | `tabbied`, `tabbied-react`, `@tabbied/*` all unclaimed as of 2026-06-10 (`npm view` 404s) | Recommend plain `tabbied`; reserve early |
| Editor migration risk | The editor leans on transition-preserving updates + export | Controller ports that logic 1:1; editor swap is step 9 and deferrable |

---

## 8. Sources

**Codebase evidence (this repo, branch `claude/sweet-euler-atbtlf`):** `lib/doodleSource.ts`, `lib/aspectRatio.ts`, `lib/seed.ts`, `lib/artwork.ts`, `components/Doodle/index.tsx`, `components/edit-artwork-page/EditArtwork.tsx`, `components/select-artwork-page/GalleryDoodleInner.tsx`, `css-doodle.d.ts`, all 19 `artworks/*.json`, and `node_modules/css-doodle@0.51.0` source (`package.json` exports, `src/component.js`, `src/parser/parse-grid.js`, `src/exports/*`). Empirical checks run 2026-06-10: Node import of `css-doodle` succeeds; `npm view tabbied|@tabbied/react|tabbied-react` → 404 (names free).

**External:**
- [React v19 release notes — full custom element support](https://react.dev/blog/2024/12/05/react-19)
- [React 19 support for web components (sordyl.dev)](https://sordyl.dev/blog/react-19-support-for-web-components/) · [React 19 custom elements deep dive (aleks-elkin)](https://aleks-elkin.github.io/posts/2024-12-06-react-19/) · [Frontend Masters: React 19 and Web Component examples](https://frontendmasters.com/blog/react-19-and-web-component-examples/) · [RFC: custom element attributes/properties in React 19](https://github.com/facebook/react/issues/11347)
- ['use client' directive reference (react.dev)](https://react.dev/reference/rsc/use-client) · [Rollup discussion: preserving directives](https://github.com/rollup/rollup/issues/4699) · [Vite discussion: preserving 'use client' in library builds](https://github.com/vitejs/vite/discussions/15721) · [tsup issue: building React packages for Next.js](https://github.com/egoist/tsup/issues/835) · [Rollup + RSC library guide (misha.wtf)](https://www.misha.wtf/blog/rollup-server-components)
- [css-doodle documentation](https://css-doodle.com/)
- [Vue and Web Components guide](https://vuejs.org/guide/extras/web-components.html) · [Svelte custom elements docs](https://svelte.dev/docs/svelte/custom-elements)
