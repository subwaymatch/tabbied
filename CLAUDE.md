# CLAUDE.md

Guidance for coding agents working in this repository.

## Repo layout & commands

Tabbied: generative patterns built on css-doodle. npm workspaces - the
Next.js site at the root consumes the `tabbied` package in
`packages/tabbied/` (framework-free core + React wrapper + 295 pattern
presets as JSON in `packages/tabbied/patterns/`, embedded by codegen), the
`tabbied-mcp` package in `packages/tabbied-mcp/` (the MCP server, shared by
the site's `/mcp` endpoint and a `tabbied-mcp` stdio bin), and
`tabbied-templates` in `packages/tabbied-templates/` (the editable-section
spec and its apply engine - see below).

```bash
npm run dev                          # site (predev builds both packages)
npm run build:packages               # codegen + tsc for tabbied, then tabbied-mcp
npm test --workspace tabbied         # package unit tests (node --test)
npm test --workspace tabbied-mcp     # MCP toolset + both protocol eras
npm run build && npm run test:e2e    # static export + Playwright suite
npm run preview                      # run the real Worker over out/ (wrangler dev)
npm run deploy                       # build, then wrangler deploy
npm run typecheck:worker             # worker/ is excluded from the site tsconfig
npm run dev:api                      # the Worker on :8787 (the API half of `npm run dev`)
npm run db:migrate                   # apply worker/migrations to the local D1
npm run db:generate                  # re-emit them from worker/db/schema.ts
npm run stub:ai                      # a local OpenAI-shaped upstream on :8788
npm run test:worker                  # Worker unit tests (local D1/KV/R2, stub upstream)
npm run llms                         # regenerate public/llms*.txt + catalog
npm run templates [slug]             # repackage template site(s) by hand
npm run editable [slug]              # derive editable specs from out/ (also the gate)
npm run preview:runtime              # bundle Studio's same-origin pattern runtime
npm run admin:grant -- <email>       # make the first admin (--remote for production)
npm run check:thumbnails             # gallery configs all name a real design
```

`galleryThumbnails.ts` is the one pattern-keyed file nothing regenerates -
its palettes and densities were tuned by eye. The gallery reads it as
`galleryThumbnails[item.slug]`, so a config whose slug names nothing is never
read and rots silently; 278 accumulated that way when the catalog moved from
`artworks/` to `patterns/`. `check:thumbnails` runs on `prebuild`/`predev` and
fails on one. A design with *no* entry is fine - it falls back to its own
palette and option defaults, which is how 19 of the catalog renders.

## Plain punctuation

Everything written in this repository uses ASCII punctuation: code comments,
docs, commit messages, UI copy, template copy, prompts, and this file. Not
used, anywhere: the em dash and en dash, curly quotes and apostrophes, the
ellipsis character, arrows, bullets, check marks, emoji, and the invisible
ones (no-break space, zero-width space). The HTML entities that render the
same glyphs (`&mdash;`, `&rsquo;`, `&hellip;`) count too: the rendered page
is where a reader meets them.

Why: they are the fingerprints of word processors and language models, and
mixed with the ASCII a keyboard produces they make a file read as written
by two hands. They also do not survive a terminal, a diff, or a `grep`
reliably, and a curly apostrophe inside a single-quoted string is a syntax
error waiting for its line to be copied.

What to write instead:

- A dash in a sentence is a comma, a colon, a period, or a pair of
  parentheses, chosen for the sentence. A spaced hyphen is the plain-text
  stand-in and is what the mechanical conversion on 2026-09-04 produced, so
  the existing ones are not a model for new writing.
- A range is a hyphen (`10-600`, `2024-2026`).
- Quotes and apostrophes are straight.
- An ellipsis is three periods.
- An arrow is "to", or `->` in a comment.
- A check mark or a warning is a word: "ok", "failed", "note".

A glyph that is part of a *design* (a CSS `content`, an icon, a musical
flat in a bell foundry's table, a timetable arrow) is written as an escape
or an entity: `'\2714'` in CSS, `'\u266D'` in a string, `&#x2726;` in JSX
text. The source stays ASCII and the choice is visible in review. Prose
never gets that exemption.

`npm run check:typography` scans every tracked text file and fails on the
first banned character, naming the file, line, column and code point. CI
runs it before anything else. Run it before committing.

## Hosting - Cloudflare Workers static assets

The site is a static export served by Workers static assets. `wrangler.jsonc`
points `assets.directory` at `out/`; Cloudflare serves anything that matches a
file there **without invoking the Worker**, so `worker/index.ts` runs for
exactly two paths (`/mcp`, `/health`) and hands everything else to
`env.ASSETS`.

Three things that are explicit here and were implicit or automatic on Vercel:

- **`not_found_handling: "404-page"`.** Workers does not infer a custom 404
  from the presence of `out/404.html` the way Pages did. Without this line a
  miss returns a bare `404 Not Found` and `app/not-found.tsx` is never seen.
- **Headers live in `public/_headers`**, not in `next.config.mjs` (an export
  has no server to attach them to) and no longer in `vercel.json`. Next copies
  `public/` verbatim, so the file lands at `out/_headers` where wrangler reads
  it - and wrangler *consumes* it rather than serving it. `wrangler dev` prints
  `Parsed N valid header rules` on boot, which is the cheapest way to catch a
  typo. Limits: 100 rules, 2,000 characters per line.
- **`run_worker_first: ["/mcp", "/mcp/*", "/health", "/api", "/api/*"]`.**
  `/mcp` is not a file, so it would reach the Worker anyway - but only after
  the asset router looked at it, and with `trailingSlash: true` the default
  `html_handling` answers a POST to `/mcp` with a 308 to `/mcp/`. Redirecting
  an MCP client's POST breaks it. `/api` is listed for exactly the same reason
  and it is not optional: every POST to the platform tier would otherwise be
  answered with a redirect before the Worker saw it. **Any new non-asset route
  must join this list.**

The Worker routes with Hono (`worker/index.ts`). That was added for the
platform tier - the right shape for two routes was the wrong one for twenty -
and it changed no behaviour: same MCP handler, same statelessness, same
`env.ASSETS` fallthrough. `/api` is scaffolding today (`/api/health` and a
JSON 404); auth, generations, media, and the AI gateway land with the bindings
they need. See `agent-outputs/20260827-studio-ai-plan.md`.

The export is comfortably inside the platform limits - roughly 4,300 files
against a 20,000 free-plan ceiling, largest file 2.8 MB against 25 MiB - but
both are counted per Worker *version*. Don't treat that file count as stable:
most of it is per-route RSC payloads, and a Next minor can move it a lot (16.3
cut ~1,400 files off 16.2's output without changing a page). What is stable is
`public/downloads/`, a flat 1,711 files, so a batch of new template sites is
the thing most likely to actually threaten the ceiling. `wrangler deploy`
prints the count it uploaded.

`vercel.json` and `scripts/vercel-ignore-build.sh` are gone. The ignore-build
script's job - don't redeploy when only `agent-outputs/` changed - has no
in-repo equivalent on Cloudflare; it is a **build watch path** configured on
the Workers Builds project (exclude `agent-outputs/*`), so it lives in the
dashboard rather than in git.

## The MCP server - one implementation, two transports

`packages/tabbied-mcp/` exposes the catalog to agents over the Model Context
Protocol. Full reference: `docs/mcp-server.md`.

The protocol comes from `@modelcontextprotocol/server` (MCP SDK v2). We own
the tools; the SDK owns the wire.

- `src/tools.ts` - the four catalog tools, with no runtime imports at all. The
  host injects what differs (preview bytes, docs text) through `ToolContext`.
- `src/server.ts` - registers those tools onto an `McpServer`. The seam.
- `src/stdio.ts`, `src/node/` - the bin, the local catalog reader, and
  `render_design`. Node only, never reached from the Worker.

Both transports are the SDK's: the Worker wraps the factory in
`createMcpHandler`, the bin hands it to `serveStdio`. So the remote endpoint
and the local bin answer `tools/list` identically. **A tool that needs a
browser cannot be remote**: `render_design` exists only over stdio, because
rendering a css-doodle pattern needs a real browser and a Worker has none.

Four things worth not re-litigating:

- **`buildServer` is a factory, and must stay one.** MCP v2 is stateless - the
  SDK builds a server per request (per connection on stdio). Capturing
  per-request state in it would work locally and break under concurrency.
- **Tool schemas stay plain JSON Schema, adapted with `fromJsonSchema`,** not
  authored as Zod. `search_designs`'s enums are derived from the catalog being
  served, so static Zod could not express them without drifting from what is
  actually queryable. Registering the schema is also what buys argument
  validation - the SDK rejects an out-of-vocabulary tag before our handler runs.
- **`createMcpHandler` comes from the SDK, not from `agents/mcp/server`.**
  Cloudflare's is a re-export of the same function (it graduated upstream), but
  taking it from `agents` drags partyserver, esbuild, and babel into a Worker
  that needs none of them. The SDK's own deps are `zod` and
  `@modelcontextprotocol/core`; the bundle is ~122 KB gzipped.
- **The Worker reads the catalog through `env.ASSETS`, not from its bundle.**
  The tools then describe exactly the bytes that deployment serves: a design
  added in the same commit cannot be missing from the catalog an agent queries,
  and 384 KB of JSON stays out of the Worker.

`legacy: 'stateless'` is spelled out at the call site even though it is the
default: it is what keeps 2025-era clients working, and every shipping client
still opens with `initialize`. Dropping it to `'reject'` would strand them.

## Downloadable templates - derived from the export, never hand-ported

`npm run templates` writes two downloads per site - `<slug>-html.zip` and
`<slug>-react.zip` - plus the folders they were zipped from. The `/templates`
gallery links to both formats from every card, so a dead button means the
packager skipped that site. Both `out` and `public/downloads` are in
tsconfig's `exclude` because the React packages contain their own
`vite.config.ts`, which the site's typecheck would otherwise try to compile -
and in `public/downloads` that isn't hypothetical: it fails the second pass.

**`npm run build` is two `next build` passes with the packager between them**,
and that shape is forced by both ends of the problem:

- The packager *reads* the export, so it can only run after a build. It has no
  framework-free source to copy from - deriving from the export is the whole
  strategy: a hand-port is four artefacts per site to keep in step, and within
  two edits the download and the live site disagree.
- The deploy has to *ship* what it writes, and the host decides when it stops
  looking. This shape was forced by Vercel, where writing into `out/` after the
  build was too late: the Next.js builder patched the config ("Applying
  modifyConfig from Vercel" in the build log) and captured the export during
  `next build`, so a `postbuild` step packaged all 57 sites green and all 114
  buttons still 404ed - the files existed on the build machine and were never
  uploaded.

So the packager writes into `public/downloads/`, and the second pass exports
that folder like any other static asset. Nothing about the host is assumed;
it is just Next copying `public/`. The zips are gitignored (~106 MB), so the
deploy's own build is the only thing that ever produces the `/downloads/*.zip`
the site links to - which is why this is wired into `build` rather than left
to be remembered.

**The archives are written in-process, and must stay that way.** The packager
used to shell out to `zip -qr`. That binary is on GitHub Actions' runner and on
most developer machines, but Cloudflare's Workers Builds image ships `unzip`
and *not* `zip` - so CI stayed green while the first Workers deploy died with
`spawn zip ENOENT` on all 57 sites. `zipDirectory` now builds the archive with
fflate (zero dependencies), so the only thing the packaging step needs is the
Node that is already running it. Don't reintroduce a PATH lookup here. Two
details it depends on: every directory gets its own zero-length `<name>/`
entry, because 10 of the 57 sites reference no images and their empty `images/`
(and the React package's `public/`) would otherwise vanish from the download;
and entries carry the source file's real mtime, which `zip -r` did and fflate
does not do on its own.

**Cloudflare would tolerate a cheaper shape, and it is deliberately not used.**
`wrangler deploy` uploads `out/` from disk after the build command has already
exited, so a single pass plus a `postbuild` packaging step into `out/downloads/`
would work here and would save a whole `next build`. The two-pass version is
kept because it depends on nothing but Next copying `public/`, and the failure
it guards against is silent and total - 114 dead buttons on a green build. If
you do collapse it, prove it by fetching a `/downloads/*.zip` from a real
deployment, not from a local `out/`.

Run `npm run templates [slug]` by hand to repackage into `out/downloads/`
without rebuilding (that is where the e2e suite looks). Packaging everything
wipes the target folder first, so a retired site can't linger in the deploy;
naming a slug repackages just that one in place.

The two formats are built in opposite directions, and that is the point:

- **HTML is derived from the export**, because there is no framework-free
  source to copy - hand-porting is the trap the derive-don't-port strategy
  above exists to avoid.
- **React is a copy of the page**, because a template page already *is* a plain
  React component. The only Next.js API any of the 57 uses is `export const
  metadata`; there is no next/image, next/link, `'use client'` or
  `generateStaticParams` anywhere. So `page.tsx` ships as authored and only the
  frame changes: metadata lifted into `index.html`, workspace imports pointed
  at copied neighbours, plus a Vite scaffold. Vite resolves `.module.css`
  natively, so the React package needs **no CSS transform at all** - only the
  bundler-less HTML package needs `composes:`/`:global()` flattened.

**The two formats also lay their images out differently, and must.** The HTML
package flattens everything into `images/`, which it can only do because it
rewrites the markup on the way past - `rewriteImagePaths` points every `src` at
the flat copy. The React package ships the *source*, which asks for its images
by the URL it was authored with, so it copies them under the sub-paths they
have on the site (`public/images/sites/...`, `public/images/template/...`). Two
mechanisms depend on that: `Figure` builds its `src` from the manifest's `base`
(`/images/sites`), and `ImageCard` hardcodes `/images/template/<id>.webp`.
Flattening breaks the hardcoded kind - and breaks it *silently*, because Vite's
dev server answers a miss under `public/` with `index.html` and a 200, so
nothing 404s and the images just render blank. It emptied all five
`TemplateSite` pages under `vite dev` while the HTML zip looked fine.
`e2e/templates.spec.ts` guards this by taking the exported page as ground truth
for what gets requested and asserting the React package serves every one.

Two things it does *not* do, deliberately. It doesn't de-hash and un-minify
the built CSS: the authored `.module.css` is already the clean, commented
stylesheet a person should edit, so that ships and only the class names in the
*HTML* are rewritten back to plain ones. And it doesn't hand-write the mount
code: the placeholders already carry their config as `data-*` attributes
(`TabbiedPattern` serializes it via `patternConfigToAttributes`), so one
`hydratePatterns()` call revives the whole page.

A site fails loudly rather than shipping broken: more than one CSS module on a
page, or two hashed names collapsing onto one plain name. All 57 sites
package, so `KNOWN_UNSUPPORTED` is empty - anything that throws is a new
problem and exits non-zero.

`composes:` needs no flattening, which is easy to get backwards. CSS Modules
resolves a local `composes` in the **markup**: `.h2Light { composes: h2 }`
compiles to `class="...__h2Light ...__h2"` and both rules are already in the
sheet, so the declaration is inert - just not valid CSS outside the pipeline.
`dropComposes` removes it, having first checked the build really did add the
composed class (a premise about build output, so it is verified, not assumed).
A cross-file `composes ... from` would introduce a second module and is caught
by the one-module check before that runs.

**Two stylesheet paths, and they fail differently.** A site with its own
`<slug>.module.css` ships it byte-for-byte. The five built on the shared
`TemplateSite` component have no per-page sheet, so the component's is shipped
trimmed by `trimUnusedRules` to the rules the page can actually match (~45% of
it is other sites' layout kits). The trim is conservative - a rule goes only
when it names a class the page doesn't have, and a selector with no class at
all is always kept - and it is safe only because the packaged page has no
framework left to add a class after load.

Two traps that trimmer already fell into, both silent:

- **Comments containing braces.** This codebase documents its CSS heavily and
  one comment contains a literal `{ color: inherit }` as an example. Counted
  naively that desynchronises brace depth for the rest of the file, so the
  walker skips comments when scanning. Do not "simplify" it back to
  `indexOf('{')`.
- **Comments containing class names**, which poison the selector parsed out of
  the prelude. The selector is taken with comments stripped; they are put back
  on the way out so the shipped sheet stays documented.

`e2e/templates.spec.ts` covers one site of each of the three kinds and
asserts every class the markup uses survives into the stylesheet. Note it navigates to
`/downloads/<slug>/` **with the trailing slash**: `serve` rewrites
`<dir>/index.html` to an extensionless `<dir>`, and every relative asset then
resolves a level too high and 404s - which once had this spec passing against
a completely unstyled page. What actually proves a template is the pixel diff
against its live page (see the packaging commit); the spec is the cheap guard
that runs every time.

## Editable templates (full reference: docs/editable-templates.md)

`data-edit*` attributes in a template page name the parts a person or an agent
may change; `scripts/generate-editable.mjs` reads them back out of the export
into `public/editable/<slug>.json`, and `packages/tabbied-templates` validates
and applies an *edits document* against a DOM. Five sites are annotated (the
shared `TemplateSite` ones); the 52 bespoke pages follow in batches, and an
unannotated page is not a failure.

Four things worth not re-litigating:

- **The generator is the gate.** It runs inside `npm run build` (between the
  two `next build` passes, so the second exports it) and exits non-zero on an
  annotation that resolves to nothing. That failure is otherwise silent - the
  spec looks fine and the editor's control just does nothing, which is the
  `galleryThumbnails` rot in a new costume.
- **The engine never sets classes**, only text, attributes, and inline custom
  properties. `trimUnusedRules` ships a stylesheet trimmed to the classes the
  markup already uses, and that is safe *only* because nothing adds one after
  load.
- **Colour derivation has one implementation.** `derivePaletteProperties()` is
  shared by `TemplateSite.tsx` (first render) and `applyEdits` (re-colour); a
  second copy of that maths is how a re-coloured page gets unreadable body
  copy. Pattern fields re-colour through a declared role map, and a literal
  `transparent` in colour 0 must survive it - that is what lets a field read
  over a photograph.
- **One slot id may sit on several elements** (brand name in masthead and
  footer) and an edit reaches all of them; the generator fails the build if
  they don't currently agree.

All 57 sites are annotated. The 52 bespoke pages were done by
`scripts/annotate-templates.mjs`, a one-time codemod (`npm run
annotate:templates`) - run it after adding a new bespoke template, and note it
skips any page already carrying `data-edit-root`, so a hand-annotated page is
never overwritten. It refuses to annotate a component rendered more than once,
two nested maps sharing an index name, or a pattern wrapped in a fragment, and
says so; those need a wrapper or an id by hand.

When resolving a pattern's palette into a role map it chases **aliased
constants** (`const TILE_A = STEEL`) and **array constants** (`palette={FULL}`);
not doing so left 109 of 434 fields unable to re-colour. The 31 that remain
take a per-item palette from a data array or a conditional, so no static map
can describe them - they re-colour only through an explicit `palette` in the
edits document.

**Two palette derivations, and the bespoke one is not `--brand-N`.** Those 52
pages each declare their own property names on their root rule (`--paper`,
`--ink`, ...) with the stylesheet reading `var(--...)`, so they use
`data-edit-root="vars"` plus `data-edit-vars` naming the role order. The
properties are written *inline*, which is what makes an edit beat the authored
default still in the class rule. A colour interpolated into an inline style in
JS is baked at render time and a re-colour cannot reach it - write those as
`var(--ink)`.

`page.tsx` sources that import `tabbied-templates` get it added to the React
download's dependencies automatically - `EXTERNAL_DEPENDENCIES` in
`scripts/package-templates.mjs` is derived from the shipped source, not
maintained by hand.

## The homepage - its own shell, and a hydration rule

`app/page.tsx` is the only route in the dark editorial treatment. It brings its
own masthead and footer (`HomeNav`, `HomeFooter`) and its own token set
(`components/main-page/home.module.css`, inherited by every `Home*` section as
`var(--h-...)`); every other route still renders the shared light `MainHeader` and
`components/Footer`. Nothing here is global - the tokens sit on the page wrapper,
not on `:root` - so restyling the homepage cannot reach `/patterns` or `/docs`.

Three things worth not re-litigating:

- **The animated grids are seeded, then random.** The hero skyline, its margin
  columns, the pattern demo, and the story backdrop are all grids of randomly
  shaped cells that reshuffle on a timer. A `Math.random()` call during render
  makes the prerendered HTML disagree with the first client render and hydration
  blows up, so the *initial* grid comes from `seededRandom()` in `homeMotion.ts`
  (the same one on the server and in the browser), and only the timers, which
  start after mount, use real randomness. The same trap catches module-scope
  constants: a `Math.random()` at the top level of a module runs once per
  process, which is not once per page.
- **Every figure is derived.** `lib/siteCounts.ts` counts the presets, the
  template sites, and the palette library; the hero sentence, both stat rows and
  the two "view all" links read it. It is server-only on purpose - counting the
  keys of `patterns` in a client component would ship the whole catalog to the
  browser to learn one number. `e2e/smoke.spec.ts` asserts the same count
  appears in all three places rather than pinning the value.
- **Reduced motion stops all of it.** Six independent clocks run on this page
  plus three CSS animations (the two marquees and the orbiting squares). Every
  timer is gated on `useMediaQuery('(prefers-reduced-motion: reduce)')` and every
  animation and transition has a `@media (prefers-reduced-motion: reduce)`
  override; a marquee that merely slows down is the failure this guards against.

The mono is loaded by `next/font` **in the page**, not the root layout, so only
this route preloads it. IBM Plex Sans is deliberately not loaded - proxima-nova
from the layout's typekit link is the sans, and the design only ever named Plex
Sans as its fallback.

## The platform tier - auth, generation, media

`worker/` is no longer two routes. `/api` now carries better-auth over **D1**,
Studio's generation endpoints, and **R2** media, and the site gained
`/sign-in`, `/sign-up`, `/account`. Two datastores, deliberately: D1 for
everything stateful, R2 for bytes. Everything is still a static export;
everything stateful is a `fetch` to `/api/*` on the same origin, which is the
property that makes the session cookie work with no CORS surface at all.

```bash
npm run dev            # site on :3000, with NEXT_PUBLIC_API_BASE set
npm run dev:api        # the Worker on :8787 - run both
npm run db:migrate     # apply worker/migrations to the local D1
npm run stub:ai        # a local OpenAI-shaped upstream on :8788
npm run test:worker    # 36 tests in workerd, over local D1 and R2
```

**No binding declares an id, deliberately.** Wrangler provisions a binding
whose id is absent and looks one up whose id is present, so a placeholder is
strictly worse than nothing: it turns "create this for me" into "find
0000...000f", which fails the deploy with a `10041`. Local dev and the tests
simulate both bindings either way.

**There is no KV, and that is the second lesson from the same deploy.** It
briefly held three things - the session cache, the burst counters, and dev
mail - and none of them needed it. The counters in particular were *wrong*
there: Workers KV permits one write per second to a key and throws on the
second, so a client sending two requests in a second (exactly the burst the
limiter catches) turned the intended 429 into a 500, and with no
compare-and-set the count could only ever be approximate. In D1 the rollover
and the increment are one atomic statement, the count is exact, and the table
cannot grow past one row per user per endpoint. Sessions moved to
better-auth's `cookieCache`, which beats a second store by removing the lookup
rather than relocating it.

Provisioning cannot do the schema, and neither does a deploy: **every
migration under `worker/migrations` has to be applied to production by
hand or by the deploy command**, not only the first. `npm run deploy` runs
`db:migrate:remote` before `wrangler deploy` for that reason; a Workers
Builds project that deploys with its own command needs
`npx wrangler d1 migrations apply tabbied --remote` in it too. The failure
when this is skipped is exact and misleading: the routes that touch a new
table answer 503 ("The database schema is behind this deployment") while
everything around them works, which is how "Make this one" read as a
broken model call when 0003 had never reached production. `GET /api/health`
reports `schema.expected` against `schema.applied` (read from wrangler's
`d1_migrations` ledger), and `status: "degraded"` there is the whole
diagnosis. Then `wrangler secret put BETTER_AUTH_SECRET`. Until that secret
exists `/api/auth/*` answers 503 and nothing else changes, the intended
degradation, not an outage. `.dev.vars` is gitignored;
`.dev.vars.example` documents the shape.

Things worth not re-litigating:

- **`worker/db/schema.ts` is the source of truth and `worker/migrations` is
  emitted from it** (`npm run db:generate`). better-auth's four tables are
  transcribed from its own `getAuthTables()` output rather than guessed - run
  it after an upgrade, because a field added upstream is a migration here
  (that is how `account.issuer` was caught).
- **`buildAuth` is a factory**, for the same reason `buildServer` is on the
  MCP side: an isolate is shared across requests, so capturing bindings in a
  module-scope singleton works locally and breaks under concurrency.
- **Two ceilings, both exact.** `lib/ratelimit.ts` is a short window that stops
  a script spending a day's budget in ten seconds; `lib/quota.ts` is the daily
  ledger, summed per user per endpoint per UTC day. Text and images are capped
  separately, because they cost differently by an order of magnitude.
- **`trustedOrigins` trusts any loopback origin in dev, not a list of ports.**
  The site is :3000, the Worker :8787, `npm run preview` picks its own and a
  test harness another again; a hardcoded pair rejects every port it does not
  name as "Invalid origin", which reads like a bug in the sign-in form.
- **Secrets are typed optional and each feature degrades on its own.** No
  `AI_API_KEY` and the endpoints answer from the matcher; no `RESEND_API_KEY`
  *in dev* and the verification mail is written to KV instead of sent (which
  is how the e2e flow reads a link back). In production that same branch
  throws - a silently swallowed verification strands the account.
- **Provider buttons come from `/api/auth-providers`, not from the form.**
  `configuredProviders()` lists the social providers the Worker actually
  holds ids for (Google, Apple, GitHub), and the sign-in form draws a button
  per answer. With no Worker behind the export the request fails quietly and
  the form is email and password. A button for an unconfigured provider is
  one that 500s on click, which is the thing this exists to prevent.
- **A person's own generations are listable, like their sites.** `GET
  /api/studio/generations` is session-scoped and carries the three directions'
  names and palettes (never the copy); the account overview merges it with
  `/api/studio/sites` into one history. The no-listing rule is about anonymous
  enumeration by id, not about a person's own rows.
- **A correlated subquery in a single-table select must qualify its columns
  by hand.** drizzle renders `${user.id}` as a bare `"id"` when the outer
  query has no join, and inside `(select count(*) from site where ...)` that
  resolves to *site*.id - every count came back 0 and nothing errored.
  `${site}.user_id = ${user}.id` spells the tables out; the same pattern with
  a join in the outer query happens to work, which is why it looked fine on
  the generations list and not on the users list.
- **A miss under `/api` is `api.all('*')`, not `api.notFound()`.** A sub-app's
  notFound handler is not used once it is mounted with `route()`, so the
  request falls through to the asset handler and answers an API client with
  the marketing 404 page.
- **`createAuthClient` gets no `baseURL` in production.** A relative
  `/api/auth` looks equivalent and is not: the client validates the URL at
  construction, at module scope, during the export - where there is no origin
  to resolve it against. That threw the prerender of every page importing it.
- **The session type is narrowed once**, in `lib/authClient.ts`. better-auth
  infers it from the *server* config, which lives in `worker/` and is outside
  the site's tsconfig on purpose, so the client types `data` as `never`.

## Studio - matching, then generating

`/studio` takes a description of a business and `/studio/results` answers with
three template sites. Studio answers with what the repo actually has: 57
finished template sites, each on one of the 295 patterns and one of the 437
palettes, each with a real page and a real zip. (The AI tier this was designed
against - `agent-outputs/20260827-studio-ai-plan.md` - has since landed; see
below. The matcher was not replaced by it.)

- **`lib/studioMatch.ts` is pure and isomorphic; `lib/studioDirections.ts` is
  server-only.** The index - 57 entries of names, palettes and vocabulary - is
  built at build time and passed to the client as plain data. Importing the
  catalog (384 KB) or the template data into the browser to match against it is
  the thing this split exists to prevent.
- **Everyday words are mapped onto the closed catalog vocabulary**
  (`packages/tabbied/scripts/catalog-vocabulary.mjs`), and moods are scored by
  *votes*: "warm, earthy, friendly" is three words asking for `organic` and
  outranks one word asking for `technical`. Scoring presence rather than votes
  put a deep-sea research site at the top of a warm-and-earthy query.
- **The description travels in the query string**, so a result is refreshable
  and shareable, and the match is a pure function of it. Ties break on a hash of
  the text, which is what makes an empty or unmatched description still return a
  stable spread rather than the same three every time.
- **Every card leads somewhere that exists**: Preview to `/template/<slug>/`,
  Download to `/downloads/<slug>-html.zip`. `e2e/smoke.spec.ts` fetches each
  preview href and asserts a 200 - that guard is the whole difference between
  this and the mockup it came from.

**The AI tier landed, and the matcher was not replaced by it - it became
candidate assembly.** `POST /api/studio/directions` runs the same scorer
server-side, puts the top dozen in the prompt, and builds the response schema's
slug enum from exactly that dozen, so an invented template cannot survive
validation. The answer is validated against the same zod schema, then once more
after a repair retry carrying the validation errors; a second failure falls
back to the matcher's own three (`source: 'matched-fallback'`, which the page
says out loud) rather than erroring.

**Text goes to `${AI_BASE_URL}/responses`, not `/chat/completions`.** The
Responses API is what OpenAI recommends for new work, and it is the only one of
the two that carries a turn forward: the repair retry quotes the rejected
response as `previous_response_id`, so it sends the correction alone against a
context that still holds what the model just wrote, and the id is stored on the
`generation` row so a revision can continue the document a user kept. Four
things that shape follows from:

- **Reasoning tokens are output tokens.** `max_output_tokens` is spent thinking
  *before* any message is emitted, so a cap sized for the old
  `max_completion_tokens` comes back `status: "incomplete"` with no content -
  which reads exactly like a broken upstream. `respondJson` names that case;
  `AI_REASONING_EFFORT` (omitted entirely when unset, because a non-reasoning
  model rejects the field) and the cap trade against each other.
- **There is no `choices[0].message.content`.** The answer is an item in an
  `output` array that also carries reasoning items, so it is walked, and a
  `refusal` part is reported as a refusal rather than as absence.
- **Continuity is an optimisation, never a dependency.** `store: true` is what
  makes an id resolvable - and means prompts and answers are retained upstream,
  which is a deliberate trade. An upstream that stores nothing returns no id and
  both callers restate in full, so `responseId` is nullable and a stale one is a
  cache miss. The document in `generation` stays the source of truth: a shared
  `?g=` link is read by someone with no session and no upstream context.
- **Images stay on `/images/generations`.** The Responses API's
  `image_generation` tool would put a reasoning model in front of every image
  whose job is to rewrite a prompt `docs/image-pipeline.md` tunes deliberately,
  and bill the rewrite. Two endpoints, two failure modes, one metered call each.

- **The matcher remains the signed-out path**, unchanged and Worker-free:
  `?q=` still means matched and is still a pure function of the text. `?g=<id>`
  means generated, because an LLM answer is not reproducible - so shareability
  moved into storage. The id is the capability; reads need no session, writes
  check ownership, and there is no listing endpoint to enumerate.
- **Palettes are the one field the model authors freely**, so they are checked
  against the palette library's two rules and repaired deterministically with
  `tabbied-templates`' own colour maths. Shorthand hex is expanded first -
  `#fff` and `#ffffff` are one colour, and comparing them as strings let an
  invisible ink get "repaired" into a colour nobody chose.
- **Imagery is lazy, idempotent and separately capped**: one image per
  direction, on request, never three up front. `gpt-image-2` emits real alpha,
  which is why this reaches one vendor and not two (`docs/image-pipeline.md`).
- The artboard's **photo upload** waits on `/api/uploads`; the **spinner** it
  drew for a synchronous match is now real, because generating is a real call.

**A generated direction now reaches the template**, which is what makes
Preview more than a link to somebody else's website. The model authors a brand
name, a headline, a tagline and a palette; `/studio/preview/` applies them to
the template and shows the result.

- **Slot ids are local; roles are not.** An edits document is keyed by slot id,
  and those ids are whatever the annotator called them - `brand.name` on the
  five shared `TemplateSite` pages, `bar.mark` or `index.text12` on the bespoke
  ones. A caller holding three strings cannot address that, so a text slot may
  declare `data-edit-copy="brandName|headline|tagline"` and `directionToEdits`
  maps a direction onto whatever ids that particular page uses. Three roles,
  because they are the three the model authors and the three that are
  unambiguous on every page. Only the five `TemplateSite` pages carry them so
  far; `/editable-catalog.json` publishes `copyRoles` per site and the results
  page reads it to decide whether a card's Preview can promise a rebrand.
- **The artefact previewed is the download, not the live page.** `/template/
  <slug>/` mounts its patterns through React, which ignores a `data-*` write
  from outside - `applyPlan` deliberately does not re-mount anything, because
  re-mounting is `hydratePatterns()`'s job. The packaged `out/downloads/<slug>/`
  has no framework left in it, so the engine's attribute rewrites are exactly
  what a plain `hydratePatterns()` then reads. Previewing what is actually
  downloaded is also the difference between a preview and a mockup.
- **The bootstrap is repointed at a same-origin bundle, and must be.** The
  package imports `tabbied` from esm.sh, pinned, which is right for a stranger
  who unzipped it years later and wrong for this site drawing its own preview.
  `scripts/build-preview-runtime.mjs` bundles `hydratePatterns` plus every
  design any packaged template mounts (231 of them, 88 KB gzipped, cached
  across previews) into `public/studio/preview-runtime.js`, and the shell
  rewrites that one script tag. Serving `tabbied/dist` raw instead does not
  work: `register.js` does a bare `import 'css-doodle'` that no browser
  resolves. The step runs between the two `next build` passes, after the
  packager it reads from - **it is derived from the packaged HTML**, so a
  template added in the same commit cannot be missing a design it needs.
- **The preview document spells its resource paths out, and handles its own
  `#` links.** The injected `<base>` is correct and complete, and two things
  still go wrong in an `about:srcdoc` document without help. Chromium's
  preload scanner ignores the `<base>` and fetches every relative stylesheet
  and preloaded image against the *page's* URL first - a 404 at
  `/studio/results/styles/base.css`, then `ERR_ABORTED` once the parser
  catches up and fetches the right one; the preview drew fine and the console
  said otherwise. So `buildPreviewDocument` also rewrites `link`/`img`/
  `script` references to absolute paths under the package. And a `#work` link
  resolves against the `<base>` to the package's URL, which is never the
  document's own `about:srcdoc`, so the browser *navigates* the frame there -
  the raw page, rebrand gone, esm.sh bootstrap back; a sandbox does not stop
  a frame navigating itself. The injected bootstrap turns fragment links into
  the scroll the template meant. `e2e/studio-preview.spec.ts` pins both.
- **The iframe needs `allow-same-origin`, and that is not laziness.** With
  `allow-scripts` alone the document gets an opaque origin and the same-origin
  runtime import is blocked as cross-origin - the page renders with every
  pattern silently missing. What stays denied is what the packaged page
  actually contains: its `<form action="#">` and `<a href="#">` cannot navigate
  the top frame, submit, or open a popup. Model-authored strings reach the
  document as text nodes (`writeText` builds them with `createTextNode`
  precisely so there is no markup path), and everything else is first-party.
- **The three strings are the floor; a *site* is the whole page.** "Make this
  one" on a generated card is `POST /api/studio/sites`: every text slot on the
  chosen template rewritten for the business, against a strict JSON schema
  built from that template's spec (`worker/ai/siteSchema.ts`) - the same
  closed-vocabulary move as the slug enum, one level up, so an invented slot
  cannot survive and a forgotten one is a schema failure rather than a headline
  that silently stays the plant shop's. The answer is checked by zod and then by
  `planEdits`, which is pure and so runs in the Worker with no DOM; one repair
  retry; a second failure writes the three-string `directionToEdits` floor as
  revision 1 with `source: 'fallback'`, and the workspace says so. Because the
  document is keyed by slot id, **this reaches all 57 templates today** -
  `data-edit-copy` roles matter only for the cheap card-stage preview.
- **Sites are pinned and versioned.** `site` records `specVersion` and a
  SHA-256 of the packaged `index.html` it was authored against; `GET
  /api/studio/sites/:id` re-hashes the served package and reports
  `templateChanged`, so a re-packaged template is announced on the page rather
  than discovered as a missing headline. `revision` is append-only (`n`,
  `edits`, `instruction`, `source`, `responseId`) - a conversational or manual
  edit writes n+1, which is what makes "go back" possible. The listing is
  session-scoped (`GET /api/studio/sites`, on the `(userId, updatedAt)` index)
  and the read is by capability id, the same split as generations: the
  no-listing rule is about anonymous *enumeration*, not a person's own rows.
- **The output budget scales with the page.** A 300-slot bespoke page is a long
  answer and reasoning is spent from the same cap first, so `outputBudget`
  grows with the slot count; the 6,000 default that fits three strings comes
  back `incomplete` with nothing on a full page.
- **`worker/test/sites.test.ts` runs a real session.** Sign up, read the
  verification link out of `dev_mail` (DEV=1 writes it to D1), follow it, keep
  the cookie - then make, list and read through the real routes against the
  packaged assets the binding serves. With no `AI_API_KEY` it exercises every
  row the tier writes via the fallback path, which is the point.

**The workspace, and what surrounds it.** `/studio/site/?id=` is where a
site is worked on. For its owner (the read says `mine`, decided by session)
three things sit beside the canvas; a visitor by link gets the page alone.

- **The editor edits through the engine, live.** A keystroke plans one
  operation and runs it against the iframe's document; a palette change also
  calls `window.__tabbied.rehydrate()` inside the iframe, which the bundled
  runtime exports - it tears down the controllers it mounted and mounts from
  the attributes as they now are, because a rewritten `data-*` is not a
  re-render. Saving is `POST /api/studio/sites/:id/revisions` with the whole
  document, validated by `planEdits` server-side; a document the engine would
  reject is a 422 with reasons, not a stored blank. Image `src`s are held to
  the site's own media and the template's own files - a src is a fetch.
- **Asking is a diff.** `POST .../revise` shows the model the page *as it
  currently reads* - the person's document - and takes back `changes:
  [{id, value}]` against the same closed slot set, an optional palette and a
  one-line note. The latest AI revision's `responseId` is quoted when there is
  one, so the request travels alone against a context that still holds the
  page. History is append-only; Restore writes an older document as a new
  head.
- **Pictures are transparent and go into slots.** `POST .../images {slot,
  referenceIds?}` makes one picture for one image slot, `background:
  transparent`, keyed under `gen/site/<id>/<n>/<slot>.webp` so a re-generation
  never overwrites bytes an earlier revision points at, and writes revision
  n+1. References are the person's uploads - `POST /api/uploads`, judged by
  bytes not label, 8 MB, 60 per person, R2 `up/<userId>/` - and with any given
  the call goes to `/images/edits` as multipart, which `call()` sends as-is
  because fetch writes the boundary itself.
- **One prompt, one site.** `POST /api/studio/make` is the directions handler
  and the sites handler run in sequence in-process (`app.request`), with the
  caller's own headers, at the recommended index. Every gate and cap applies
  as it would to the two clicks it replaces, and there stays one
  implementation of each. "Make my website" on `/studio` is this.
- **The 2026 designs for the new pages** (agent-outputs has none; the source
  was a Claude Design export). Sign-in, sign-up and the password pages share
  `AuthForm.module.css` (592px measure, provider buttons above an "or"
  rule). `/studio` leads with one button - "Generate websites", the three
  directions - and keeps "Make my website" and "Match from the library" as
  text actions under it; the photo dropzone uploads to `/api/uploads` with
  each file's note before the generate call, and a description typed before
  signing in survives the round trip in `sessionStorage`. On
  `/studio/results` Preview is still a real link to the full page, and a
  plain click opens `PreviewDialog` instead: the packaged download with the
  direction applied, in an iframe, built by the same `buildPreviewDocument`
  the preview route uses. The account pages sit under `AccountHeader` (the
  homepage nav in ink on paper, initials on the right, a menu with the
  destinations and Sign out) and the admin pages under a sidebar shell whose
  "Export users" writes the directory as CSV in the browser. All of it is
  responsive down to 390px; the account and admin tables collapse to stacked
  rows, the admin rows labelling their cells once the header row is gone.
- **Pages.** `/account/{sites,uploads,usage,settings}` under one nav;
  `/verify-email` is where the confirmation link lands (`callbackURL` on
  sign-up), `/forgot-password` and `/reset-password` use better-auth 1.7's
  `requestPasswordReset`; `/s/?id=&n=` is a site at one revision, read-only.
  Every per-item page takes `?id=` - the export cannot enumerate ids.
- **Admin.** better-auth's `admin()` plugin supplies `role`, the ban fields
  and impersonation; its columns are transcribed into `schema.ts` and are
  migration 0004. `/api/admin/*` answers **404** to anyone without
  `role = 'admin'` - the pages hiding themselves is cosmetic. The first admin
  is either `ADMIN_EMAILS` (a comma-separated var or secret; the role is set
  on sign-up, or on the next sign-in for an account that already exists) or
  `npm run admin:grant -- you@example.com` (a D1 UPDATE; `--remote` for
  production); after that `/admin/users` does it through the client plugin.
  The caps page is read-only because the caps are constants.

Two things about the tests. `worker/test/*.test.ts` sign up real users and
follow the verification link out of `dev_mail`; run them **after** a build,
not during one - `next build` empties `out/` and the assets binding reads
from there, which reads as a random failure in `beforeAll`. And one smoke
test (`the same description always gives the same three`) can time out on
`page.goto` in a sandbox with no outbound network: the results page's
typekit and Google Fonts stylesheets hang until the proxy resets them, and
`load` waits for stylesheets. Not a regression; it passes with network.

## Agent-facing docs - all generated, never hand-edited

Five build artifacts describe the catalog to tools that can't see the
patterns. They're gitignored and regenerated on every build, so edit the
generators, not the output:

- `packages/tabbied/catalog.json` - written by the package's
  `scripts/codegen.mjs` from the same `patterns/*.json` it compiles, exported
  as `tabbied/catalog.json`. Carries each design's description, its
  closed-vocabulary metadata (`tags`/`mood`/`density`/`goodFor` - see below),
  its `preview` image URL, palette, options, and SVG-export tier - but
  **not** the css-doodle `code`, which is what keeps it readable.
- `packages/tabbied/llms.txt` - the full agent reference, written by the
  package's `scripts/generate-llms.mjs` during its build (so a publish can't
  ship without it; it's in the tarball `files` along with the hand-written
  `AGENTS.md`).
- `public/llms.txt`, `public/llms-full.txt`, `public/catalog.json` - the
  site's copies, written by the root `scripts/generate-llms.mjs`, a thin
  wrapper over the package generator. One template, two consumers.

Codegen re-implements `supportsSvgExport()` because it runs before tsc and
has no compiled module to import. `test/catalog.test.mjs` pins it against the
real implementation - if you change the rule in `types.ts`, change it in
codegen too or that test fails.

**Catalog metadata is a closed vocabulary.** Every `patterns/*.json` carries
`tags` (visible motifs), `mood`, `density`, and `goodFor`, validated by
codegen against `packages/tabbied/scripts/catalog-vocabulary.mjs` - an
out-of-vocabulary value or a missing field fails the build. The values were
authored by *looking at each rendered preview* (not the description), so when
adding a design, look at it before tagging it; when adding a vocabulary term,
remember published catalogs query these exact strings. The metadata is
catalog-only: codegen strips it from the runtime bundle, and a test pins that.

**Every design ships a committed preview** at `public/previews/<slug>.webp`
(authored palette, default options, seed `preview1`, rendered @2x - at @1x
the finest stipples vanish). `check:previews` (prebuild/predev) fails on a
missing or orphaned file; regenerate with `npm run previews [slug]`. The
catalog points agents at these URLs, which is why they're committed rather
than rebuilt per deploy - a headless browser isn't available on the deploy
build, and stable URLs shouldn't re-render anyway.

The package also ships a `tabbied` bin (`src/cli.ts`): `render` (SVG/PNG,
`--frames` for deterministic PNG sequences) and `list`/`info` over the
catalog. It acquires a browser from whichever Playwright is installed -
never add a hard Playwright dependency to the package.

## Grid snapping - invariant (full reference: docs/grid-snapping.md)

css-doodle lays its grid out as `repeat(n, 1fr)`, so a container that isn't
divisible by `n` puts every cell boundary on a sub-pixel and the browser draws
a hairline seam at each one. `fit: "grid"` therefore **oversizes its canvas**:
`applyGridSnap` sets it inline to `snapSpanToTracks(hostSpan, tracks)` (the
smallest multiple of the track count that still covers the box) and the host
clips the sub-cell overflow with `overflow: hidden`. Don't "simplify" that
back to `width: 100%`.

The cell is snapped to a whole multiple of `sizing.cellMultiple` (default 2),
not merely to a whole pixel: a design that subdivides its cell seams at
`cell / n` if the cell doesn't divide, however exact the outer track is. Only
`subdivide` (2), `fractal` (3) and `matryoshka` (4) - the three that mask with
a nested `@doodle` - declare their own.

The cell is also **squared** - `applyGridSnap` uses the larger of the two
snapped cells on both axes. Well over a hundred designs rotate a cell by a quarter
turn, which swaps an oblong's axes and leaves a strip uncovered (a 120×124
cell paints 124×120 rotated). Cobalt Works' coda seamed on exactly that.

The snap is an inline style on the `<css-doodle>` element, *not* a change to
`@size` in the generated source - the source feeds SVG export and the
definitions' `${width}`/`${height}` substitution, and neither should move
because a container happened to be 1441px wide. Two traps: a CSS class can't
set the box (`resolveBoxStyle` writes width/height inline on the wrapper, so a
class loses), and css-doodle caps grids at 64×64, so a box implying more
columns than that silently rescales the cell and puts the seams back.

`cover` scales its render box with a transform, so snapping alone does nothing
there - measured: 6 interior seams with integral tracks under a fractional
scale, 0 once `fitRenderToBox` quantised the scale so `cell × scale` is whole
(rounded up, translate rounded). Both halves are required; the render-box snap
only exists to give the quantiser a whole cell.

## Reduced motion - invariant

A pattern moves two ways, and `prefers-reduced-motion` has to stop both. The
`redrawInterval` timer is the obvious one. The other is that **all 295 designs
declare a ~400ms `transition`** - the thing that makes a redraw morph rather
than cut - and it fires on any re-render, including ones nobody asked for:
`grid` and `cover` re-derive their cell grid on resize, so turning a phone
would otherwise animate every cell on the page.

`createPattern` mutes them by injecting `transition: none !important` into the
shadow root (the generated cell styles live there; a light-DOM rule can't
reach them). The same override suppresses the first paint for two frames -
under reduced motion it simply never lifts.

Two things that look redundant and are not:

- **`ensureMuted()` after every `element.update()`.** css-doodle regenerates
  the shadow root when the grid changes, which takes the injected `<style>`
  with it. Without the re-assert the mute holds at mount and is gone after the
  first resize-driven re-render - i.e. it fails in exactly the case it exists
  for. `e2e/package.spec.ts` covers this by resizing and asserting the cell
  transition-duration is still 0ms.
- **The `change` listener on the media query.** The preference is observed,
  not read once: `syncRedrawTimer` only re-checks on a config change, so a
  toggle mid-session would otherwise leave a running timer ticking.

## SVG export - invariants (full reference: docs/svg-export.md)

The native SVG exporter (`packages/tabbied/src/core/svgExport.ts`) converts
rendered patterns to true vector SVG. Rules that must not regress:

- **Support tiers are metadata-driven.** `"svgExport": false` marks the 4
  designs SVG cannot represent (coil, spectrum, pinwheel, wedge - smooth
  conic sweeps): the editor *disables* "Download SVG" for them.
  `"svgExportNote"` on a definition (11 designs) documents limitations -
  filter-based effects or ≤1px deviations. The option-level form still works
  but no design uses it: the Shadow toggle that was its only user was removed
  rather than left as an export trap. Everything else (239) is clean.
  See docs/svg-export.md for the complete lists and reasons.
- **Limited exports must warn before downloading**: a right-aligned amber
  `TriangleAlert` on the "Download SVG" item (desktop menu + mobile panel)
  and a Base UI **`Dialog`** (not `AlertDialog` - outside-click must
  dismiss) titled "About this SVG export" listing the active notes, with
  Cancel / Download SVG. No notes -> download directly, no dialog.
- **Fail loudly, never silently wrong**: unsupported CSS throws
  `SvgExportUnsupportedError`. New patterns must either stay inside the
  supported CSS subset, extend the converter, or set `svgExport: false`
  (+ note). Batches 11 and 12 are authored to be clean throughout and share
  their lints (`scripts/pattern-gen/pattern-lints.mjs`) and their two gates
  (`svg-sweep.mjs`, `render-sweep.mjs`); a batch generator owns a *bounded*
  range of gallery orders and deletes anything in range it no longer defines.
  Verify with `node scripts/svg-parity-sweep.mjs <slug>` and keep
  `e2e/svg-export.spec.ts`'s representative list + thresholds in sync.
- **Bundle contract**: the converter (~21 KB gz) is lazy-loaded by
  `exportSvg()`; `core/index.ts` re-exports only its *types*
  (`supportsSvgExport` lives in `types.ts`); `dist/core/svgExport.js` must
  keep zero runtime imports (tests inject it into pages).
- **Parity testing** compares against live element screenshots (css-doodle's
  own foreignObject export is unfaithful for conic masks) with an
  anti-aliasing-tolerant diff.
