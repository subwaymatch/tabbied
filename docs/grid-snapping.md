# Grid snapping - why `fit: "grid"` oversizes its canvas

Short version: css-doodle lays its grid out as `repeat(n, 1fr)`. A container
that isn't divisible by `n` puts every cell boundary on a sub-pixel, and the
browser draws a hairline seam at each one. `createPattern` rounds the canvas
up to a whole number of tracks and lets the host clip the difference.

## The failure it fixes

`fit: "grid"` is the default, and the common way to use it is a field that
fills a section:

```jsx
<TabbiedPattern pattern={quire} fit="grid" cellSize={120}
                style={{ position: 'absolute', inset: 0 }} />
```

`deriveGridForBox` measures the host and picks `cols`/`rows`. The canvas was
then sized `100% × 100%`, so the tracks came out `hostWidth / cols` - which a
fluid container almost never makes an integer. A 1440px band at 11 columns
gives **130.906px** tracks, and every one of the 10 interior boundaries lands
mid-pixel.

The result is a faint grid of hairlines over the pattern, in the pattern's own
colours or the page background, depending on which way the boundary rounds.
It reads as a rendering bug, not a design.

This was not rare. A sweep of the 36 template pages - reading
`getComputedStyle(cssd-grid).gridTemplateColumns` out of each doodle's shadow
root - found **164 fractional grids** before the fix, nearly all of them
full-section background fields.

## The fix

`applyGridSnap` in `core/createPattern.ts` sets the canvas inline to
`snapSpanToTracks(hostSpan, tracks, cellMultiple)` on each axis - the smallest
span that both covers the box and divides into cells of a whole, divisible
size:

```ts
const unit = tracks * cellMultiple;
Math.ceil(span / unit) * unit;
```

Three properties matter, and `test/sizing.test.mjs` pins all three:

- every track is a whole pixel (`snapped % tracks === 0`), and the cell is a
  whole multiple of `cellMultiple`;
- the canvas still **covers** the host (`snapped >= span`), so no strip of the
  container shows through;
- the overflow is under `cellMultiple` cells, which the host clips via
  `overflow: hidden`.

### Why a whole pixel is not enough

A design that subdivides its cell puts a boundary at `cell / n`, and an
indivisible cell lands *that* boundary on a fraction of a pixel - which the
browser seams however exact the outer grid is.

Sichtbeton's hero was the case that proved it: 8 × 180px across and 3 × 197px
down, every outer track exact, and still visibly gapped. `subdivide` masks
each cell with a nested `@doodle(@grid: 2)`, and 197 halves to **98.5**.

`PatternSizing.cellMultiple` carries the divisor. It defaults to 2 - which
also keeps centred rules and strokes off half-pixels - and only three designs
in the catalogue need more, the three that mask with a nested `@doodle`:

| Design | Nested grid | `cellMultiple` |
|---|---|---|
| `subdivide` | 2 × 2 | 2 |
| `fractal` | 3 × 3 | 3 |
| `matryoshka` | 4 × 4 | 4 |

An even cell divides by 2 but not by 3 or 4, so a blanket "make it even" rule
fixes `subdivide` and leaves the other two seaming. Snapping everything to a
multiple of 12 would cover all three but throws away up to 12 cells' worth of
overflow on every field. Per-design metadata costs neither.

### And why an exact cell is still not enough

The cell also has to be **square**. 146 of the 254 designs rotate their cell
by a quarter turn (`transform: rotate(@pick(0deg, 90deg, 180deg, 270deg))`),
and a quarter turn of an oblong swaps its axes: a 120 × 124 cell paints
124 × 120 once rotated, leaving 2px uncovered top and bottom. That reads as a
seam between blocks even though every track is exact and every cell divides.

Cobalt Works' coda band was the case that proved it - 12 × 120px across,
2 × 124px down, both exact, and visibly lined. `applyGridSnap` takes the
larger of the two snapped cells and uses it on both axes; both are already
multiples of `cellMultiple`, so the max is too, and the canvas still covers
the host because the cell only ever grows.

Rounding *down* would satisfy the first property too, but would leave up to a
full cell of the container uncovered - far more visible on a background field
than a sub-cell crop.

## Things that are easy to get wrong

**The doodle source still says `100%`.** The snap is an inline style on the
`<css-doodle>` element, not a change to `@size` in the generated source. That
is deliberate: the source feeds SVG export and the 254 pattern definitions'
`${width}`/`${height}` substitution, and neither should move because a
container happened to be 1441px wide.

**A CSS class cannot set the box.** `resolveBoxStyle` writes `width`/`height`
inline on the wrapper, so `.myField { width: 2640px }` silently loses. Callers
that need a specific box must pass `style`, not a class name.

**64 is a hard cap.** css-doodle's `parse_grid` caps grids at 64×64
(`MAX_GRID_EDGE`). Asking for a box that implies more columns than that - say
2640px at `cellSize={40}`, which wants 66 - clamps to 64 and silently rescales
the cell to 41.25px, putting the seams straight back. Pin to a multiple that
lands at or under the cap.

**Resize runs the snap, not a re-render.** `applyGridSnap` is arithmetic, so
`handleResize` calls it on every tick; only a changed `cols`/`rows` triggers
the debounced re-render. Without that, the canvas would hold its old pixel
size through a drag and either gap or over-cover the host.

## `fit: "cover"`: snapping is not enough

`cover` derives a render box and then *scales* it into the host with a
transform, which makes it a different problem: the transform maps exact layout
tracks onto fractional device pixels, and the browser seams there.

An isolated test settles it. Seven cells, every one the same colour, so any
column that is not that colour is a seam and nothing else:

| Case | Interior seams | Worst delta |
|---|---|---|
| No transform, fractional tracks | **0** | 0 |
| `scale(1.44)`, fractional tracks | 6 | 87 |
| `scale(1.44)`, integral tracks | 6 | 87 |
| `scale(1.4444...)`, `cell × scale = 143` | **0** | 0 |

Two things fall out of that. Without a transform the browser abuts identical
neighbours cleanly even on fractional boundaries - so the grid fix works
because there is no transform, not because layout rounding is inherently
fatal. And snapping the render box *on its own does nothing*: six seams
either way, same severity. Only quantising the scale removes them.

So both halves are needed, and `applyGridSnap`'s work is the enabler rather
than the fix:

1. The adaptive cover render box is snapped to whole, divisible, square cells,
   which is what gives step 2 a whole `cell` to quantise against.
2. `fitRenderToBox` quantises the scale so `cell × scale` is a whole number,
   rounding **up** (cover crops anyway). The ratio is untouched, so the
   drawing is never distorted - only cropped slightly further.

The translate is rounded too - half a pixel of offset puts every boundary
back on a fraction and undoes the quantised scale.

The cost is a slightly larger crop. On the package test page the canvas
overshoots its host by 3px across and 10px down on a 1152 × 320 box, under
4% and well inside one scaled cell.

## What this does not cover

- **`fit: "fixed"`** sizes the canvas to an explicit width/height that the
  caller chose; the editor's 364×546 preview at a 6×9 grid gives 60.66px cells
  by construction. `docs/svg-export.md` ("Cell boundaries: integer vs
  fractional") covers what that means for export fidelity.

## Verification

```bash
npm test --workspace tabbied      # snapSpanToTracks properties
npm run build && npm run test:e2e # e2e/package.spec.ts asserts whole tracks
```

The e2e `fit="grid"` test asserts the canvas covers the host, overflows by
less than one cell, that the host clips, and that every laid-out track is
within 0.01px of an integer.
