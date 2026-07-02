---
'tabbied': minor
---

Sizing correctness, off-screen perf, and packaging fixes.

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

- The core `tabbied` entry no longer re-exports the full preset catalog —
  import presets from `tabbied/artworks` instead. This keeps `createArtwork`
  consumers from carrying all 100+ designs in unshaken environments.
- Added `default` export conditions, top-level `main`/`types` fallbacks, and
  a `./package.json` export for older resolvers; the raw `artworks/*.json`
  files (unreachable through the exports map) are no longer shipped; source
  maps now inline their sources.
