# Editable templates

The 57 template sites are finished, hand-designed pages. This is the machinery
that lets somebody change the *brand* in one - the words, the photographs, the
colours, the pattern fields - without understanding the page, and without
being able to break its layout.

Three parties use the same contract: a person in a template editor, a coding
agent holding a downloaded zip, and Studio's generation tier
(`agent-outputs/20260827-studio-ai-plan.md`, which is also where the roadmap
for consuming this machinery now lives).

## The three pieces

| | What | Where |
|---|---|---|
| **Annotations** | `data-edit*` attributes naming the editable parts | the page source |
| **Spec** | what may change, and what it currently is | `public/editable/<slug>.json`, generated |
| **Engine** | validates an edit and applies it to a DOM | `packages/tabbied-templates` |

An **edits document** (`{specVersion, slug, edits}`) is the portable unit that
travels between them. It is what an editor autosaves, what an agent writes,
and what the branding service produces.

## Annotating a page

```tsx
<h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70">
  {renderTitle(site.title)}
</h1>

<ImageCard editId="hero.photo" ... />          {/* emits data-edit-image */}

<div data-edit-pattern="band.field" data-edit-roles={fullRoles(site)}>
  <TabbiedPattern ... />
</div>
```

| Attribute | Meaning |
|---|---|
| `data-edit="<id>"` | text slot; the element's text content is the value |
| `data-edit-format="emphasis"` | the value carries `{em}...{/em}` (see below) |
| `data-edit-max="70"` | soft length budget - warns, never blocks |
| `data-edit-multiline` | render a textarea |
| `data-edit-label="..."` | control label; defaults to a prettified id |
| `data-edit-image="<id>"` | image slot; the element is or contains the `<img>` |
| `data-edit-pattern="<id>"` | pattern slot; the element is or contains `[data-pattern]` |
| `data-edit-roles="transparent,1,3"` | how this field's palette follows the brand palette |
| `data-edit-root="<derivation>"` | the element carrying the brand custom properties |
| `data-edit-flat` | on the root: this site drops the alternating band tone |

**Attributes rather than a sidecar file**, deliberately. They survive every
derivation for free - the static export, the HTML download package, and (as
greppable anchors in the shipped source) the React package. Five sites share
one component, so a per-site sidecar would have nowhere to live for them
anyway.

**One id may appear on several elements**, and an edit reaches all of them.
That is the normal case, not an edge case: the brand name is in the masthead
and the footer, the primary call to action is in the nav and the hero. The
generator enforces the other half of the bargain - elements sharing an id must
currently say the same thing, or it fails the build.

## Brand copy: roles, because ids are local

A slot id is chosen by whoever annotated the page. The five shared
`TemplateSite` pages say `brand.name` and `hero.title`; the 52 bespoke ones say
`bar.mark`, `colophon.colophonMark`, `index.text12` - whatever the component
happened to be called when `annotate-templates.mjs` walked it. That is fine for
an editor, which shows a human the whole list and lets them pick. It is useless
to a caller that holds three strings and does not know which template it is
addressing, which is exactly Studio's position: the model picks a slug from a
shortlist, then has to put a business name *somewhere*.

So a text slot may additionally declare a **role**:

```jsx
<a data-edit="bar.mark" data-edit-copy="brandName" ...>Ateliers Beaufort</a>
<h1 data-edit="hero.title" data-edit-copy="headline" ...>...</h1>
<p data-edit="hero.lede" data-edit-copy="tagline" ...>...</p>
```

`data-edit-copy` takes one of `brandName`, `headline`, `tagline` - the three a
generated direction actually authors (`worker/ai/schema.ts`), and the three
that are unambiguous on every template. A fourth for body copy or section
headings would have to choose between a dozen candidates per page and would be
guessing, so there isn't one.

The generator carries the role into the spec as `slot.role`, and
`directionToEdits(spec, direction)` turns three strings and a palette into an
edits document addressed to *that* template's ids. It is deliberately total and
lossy: a role the template doesn't declare is dropped rather than reported, and
a palette that `planEdits` would reject is dropped so the page keeps its own.
The caller's alternative to a partial rebrand is no rebrand, which is worse.
What a caller *can* act on ahead of time is `declaredCopyRoles(spec)` and
`supportsBrandCopy(spec)` - the latter asks only whether the page names the
business anywhere, because a rebrand that leaves the template's own name in the
masthead is the failure worth refusing up front.

Roles are additive and optional. A page with none still edits exactly as it did
before; it just can't be handed a brand direction. Today the five `TemplateSite`
pages carry them (one component, so one edit covered all five) and the 52
bespoke pages do not - the same batching the annotations themselves went
through.

## Colour: one edit point, not three copies

Colour enters a page **once**, as custom properties on the `data-edit-root`
element; the stylesheet only ever says `var(--...)`. Re-colouring is then a
property rewrite rather than a search-and-replace through a stylesheet.

Some of what the page needs is *derived* from the palette rather than in it -
the ink that stays legible on the page ground, the card and panel tints. Those
are functions of the palette, so a re-colour must recompute them; leaving them
behind is how a re-coloured page ends up with unreadable body copy. The
`data-edit-root` value names which derivation to use:

- **`direct`** - `--brand-0...n` and nothing else.
- **`templateSite`** - those, plus the variables the shared component works in
  (`--bg`, `--c1`, `--ink`, `--onC1`, `--card`, `--soft`, `--band`).
- **`vars`** - the page's own property names, listed in role order by
  `data-edit-vars`. This is what the 52 bespoke pages use; see below.

`derivePaletteProperties()` is the single implementation, shared by
`TemplateSite.tsx` (first render) and `applyEdits` (re-colour). They must agree
exactly, which is why the maths moved out of the component.

**Pattern fields keep literal colours** (css-doodle palettes are serialized
into `data-palette`, and the SVG exporter parses concrete colours), so a
pattern slot declares a **role map**: `data-edit-roles="transparent,1,3"` means
position 0 is the literal `transparent` and positions 1-2 follow brand roles 1
and 3. A numeric role wraps if the palette is short.

`transparent` in colour 0 is the one that matters: it is what leaves real
negative space so a field reads *over* a photograph. It is a literal precisely
so that re-colouring can never fill it in. An off-palette accent stays literal
for the same reason - it is not part of the brand, so it must not move when the
brand does.

**31 of the 434 pattern fields carry no role map, and cannot.** They take a
per-item palette from a data array (`palette={p.palette}`) or a conditional
(``palette={[..., i % 4 === 0 ? ACID : GREY, ...]}``), so one static map could
not describe what a single JSX node renders differently on each pass. Those
fields are still slots - swappable, re-seedable, and re-colourable by an
explicit `palette` in the edits document, which `PatternEdit` supports for
exactly this case. They just do not follow a brand re-colour on their own. The
codemod names each one rather than leaving it to be discovered.

## The `{em}` accent

The template sites mark one span of a headline as an accent. If a headline slot
were plain text, the first person to edit it would silently lose the accent the
design was built around - so the *value* keeps the markers
(`Come back to {em}yourself{/em}.`) and both renderers parse them: the React
component building elements, and `applyEdits` building DOM nodes on a page with
no React.

`applyEdits` builds text nodes, never `innerHTML`, so there is no markup path
into the page from user or model input at all. It reads the accent's class off
the element it is replacing, because that class differs by context: the export
has the hashed CSS-module name, the download package has the de-hashed `em`.

## Generating the spec

`npm run editable` reads `out/template/<slug>/index.html` and writes
`public/editable/<slug>.json` plus the aggregate `public/editable-catalog.json`.
It runs inside `npm run build`, between the two `next build` passes, so the
second pass exports it like any other static asset - the same shape, and for
the same reason, as the template packager.

Everything in a spec is **derived from the export**: current text, image
sources and prompts, pattern configuration, and the brand palette (read back
off the root's inline `--brand-*`). Nothing is hand-written, so a spec cannot
describe a page that no longer exists. Option ranges are copied in from
`packages/tabbied/catalog.json`, which is what lets the engine validate a
slider value and an editor build a typed control without loading 295 pattern
definitions.

**The generator is also the build gate.** An annotation that resolves to
nothing - an image slot with no `<img>`, two elements sharing an id while
saying different things - exits non-zero. That failure is otherwise completely
silent: the spec looks fine and the editor's control just does nothing. This
repo has been there before, with 278 gallery thumbnail configs naming designs
that no longer existed.

**A site with no annotations is not a failure**, so a new template can land
before it is annotated - the generator reports the count rather than failing.
All 57 are annotated today: 9,797 text, 374 image, and 434 pattern slots.

## The engine

`packages/tabbied-templates` is framework-free and dependency-free, because it
runs in the browser (the builder's live preview and its client-side export),
in Node (the generator and its gate), and in tests.

- `planEdits(spec, document)` -> `{operations, problems}`. Pure: every judgement
  lives here - validation, palette resolution, option ranges, attribute
  serialization - so it is covered by `node --test` with no browser.
- `applyEdits(root, spec, document)` executes that plan against a DOM. Short
  and dull by construction.

Problems and operations come back together: a document with one bad slot id
still applies the rest, which is what makes a partially-stale saved project (or
a partially-wrong LLM response) recoverable rather than a wall. Errors are
errors - an out-of-range slider is never quietly clamped, because clamping
hides the mistake from a pipeline that could otherwise correct itself.

**The engine never touches classes.** It sets text, attributes, and inline
custom properties, nothing else. The HTML download ships a stylesheet trimmed
to the classes its markup actually uses (`trimUnusedRules` in
`scripts/package-templates.mjs`), and that trim is only safe because nothing
adds a class after load. An editor that added one would silently ship a
download with the matching rule missing.

## Testing

- `npm test --workspace tabbied-templates` - the planner, extraction, and
  palette derivation, exhaustively and without a browser.
- `e2e/editable.spec.ts` - the real engine against the real packaged download,
  once per palette derivation: annotations survived the export and the
  packager, ids still find their elements, and a re-colour reaches both the
  custom properties and the pattern fields.

## The two palette derivations

The 52 bespoke pages already kept their colour in one place before any of this
existed: each declares `--paper`, `--ink`, `--ochre`... on its root rule and its
stylesheet only reads `var(--...)`. Renaming those to `--brand-N` would have
meant a codemod over 52 stylesheets to gain nothing, so instead the page
declares which name each role owns:

```html
<div data-edit-root="vars" data-edit-vars="paper,ink,ochre,grey,pale"
     style="--paper:#eeede7;--ink:#131313;...">
```

A re-colour writes those names. The properties are set **inline**, which is
what makes an edit win over the authored defaults still sitting in the class
rule - so a page with no edits applied looks exactly as it always did.

One trap the bespoke pages carry: colour interpolated into an inline style in
JavaScript (`` style={{ background: `...${INK}...` }} ``) is baked at render time
and a DOM-level re-colour cannot reach it. Write those as `var(--ink)` instead;
custom properties resolve at computed-value time, so the inline style then
follows the override.

## Adding a site

1. Annotate it - or run `npm run annotate:templates` (see below).
2. `npm run build` (or `next build && npm run editable`) and read the gate.
3. Check the generated spec says what the page says.

Ids are **append-only within a `specVersion`**: renaming one orphans saved
edits documents that reference it.

## The annotation codemod

`scripts/annotate-templates.mjs` added the annotations to the 52 bespoke pages,
29,000 lines of hand-written JSX that could not be hand-edited reviewably. It
parses each page with `@babel/parser` (a build-time devDependency; typescript@7
is the native port and no longer exposes its compiler API to JS) and emits text
edits at node positions, so formatting and comments survive.

**It writes to source and is meant to run once.** The annotations are then
committed and maintained by hand, which is what keeps ids stable - an id that
regenerated on every build would shift whenever a page changed. A page already
carrying `data-edit-root` is skipped, so re-running is safe and a hand-annotated
page is never overwritten. Run it after adding a new bespoke template.

Three things it refuses to annotate rather than get wrong, each reported:

- **A component the page renders more than once.** There is no static id that
  could name each instance the way a `.map()` index does.
- **Two nested maps binding the same index name.** The outer binding is
  shadowed, so an id built from both would repeat one value. (This is not
  hypothetical - it produced 224 colliding slots on the first run, every one
  caught by the build gate.)
- **A pattern wrapped in a fragment**, which gives no element to annotate.

Its correctness claim is that it changes nothing a visitor sees. That was
checked the only way worth checking: building the export before and after and
diffing the rendered text of all 57 pages, which came back identical.

Two things it resolves that are easy to miss, because both hide a colour one
indirection away from the pattern that uses it:

- **Aliased constants** - `const TILE_A = STEEL`. About twenty pages name their
  tile colours that way, and not chasing the alias left those fields with no
  role map at all.
- **Array constants** - `palette={FULL}` where `const FULL = [PARCHMENT, NAVY,
  ...]`, rather than an array written inline.

Missing those two left 109 of 434 fields unable to re-colour. Resolving them
brings it to 31, all of which are genuinely dynamic.

Slot ids come from the element's own class name where it has one - those are
already descriptive (`heroKicker`, `rowTitle`) and cover about 79% of text
slots. Failing that, a link's own in-page anchor names it far better than its
position does (`bar.making`, not `bar.link2`), and otherwise a semantic word
for the tag (`faq.0.answer`, not `faq.0.p`). That leaves 40 of 9,797 ids
falling back to a bare tag name.
