# Studio AI - real generation behind the shipped UI · 2026-08-27

A strategy, not an implementation, and the **only plan document in this
folder**: the earlier strategy set (editable templates, site builder,
branding service, platform/auth) was retired in favor of this consolidated
plan - git history holds them - so everything Studio needs is stated here
rather than cited.

The starting point: Studio shipped as a client-side matcher. `/studio` takes
a description, `lib/studioMatch.ts` scores it against the 57 template sites,
`/studio/results?q=...` renders three of them, and every card leads to a real
page and a real zip. This plan makes "Get three websites" a real LLM call -
an **OpenAI-compatible upstream** for both text and images (GPT Image 2),
gated by **better-auth sessions on D1**, with generated media in **R2** -
without discarding anything the matcher established.

---

## 1. The stance, and three continuities

**The LLM chooses and parameterizes; Tabbied renders.** No CSS, no
css-doodle code, no free-form HTML ever comes back from the text model. A
Studio direction stays what it is today - a real template site, a palette,
a few lines of copy, and (new) imagery - and the AI's contribution is
*which* sites, *better* palettes, copy the matcher could never write, and
pictures.

Continuities that keep the shipped surface paying rent:

- **The matcher becomes candidate assembly.** `matchDirections` is not
  deleted or bypassed: the Worker runs the same scoring server-side to pick
  the top ~12 entries and puts *those summaries in the prompt*. The model
  chooses 3 from a dozen pre-qualified candidates instead of hallucinating
  over 57, and the slug enum in the response schema is built from exactly
  that dozen.
- **The matcher remains the signed-out path**, unchanged: instant, free,
  deterministic. `?q=` keeps meaning "matched"; a new `?g=<id>` means
  "generated". One results page renders both.
- **Every card still leads somewhere real.** Preview opens
  `/template/<slug>/`, Download serves the existing zip. The e2e guard that
  fetches every Preview href and asserts a 200 applies to AI output
  unchanged - it is the difference between generation and confabulation.

## 2. The platform substrate

The site stays a pure static export served by Workers static assets;
everything stateful happens over `fetch` to `/api/*` in the **existing
Worker** (Hono already routes `/api`, and `run_worker_first` already lists
it - with `trailingSlash: true`, a POST to a non-asset path would otherwise
be answered with a 308 before the Worker saw it). Same-origin is the
load-bearing property: auth cookies never cross an origin in production, so
there is no CORS surface and no token-in-localStorage compromise.

New bindings in `wrangler.jsonc`:

| Binding | Service | Used for |
|---|---|---|
| `DB` | D1 | better-auth tables, generations, the usage ledger, rate windows |
| `MEDIA` | R2 | user uploads and generated images (§7) |
| vars/secrets | - | `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`, `AI_IMAGE_MODEL` |

Secrets: `.dev.vars` (gitignored) locally, `wrangler secret put` in
production. D1 schema changes ride `wrangler d1 migrations`, committed under
`worker/migrations/`, generated from a Drizzle schema (the schema is the
source of truth; migrations are emitted, not hand-written).

**Decide the Workers paid plan ($5/mo) before writing auth code.** The
free plan's 10 ms CPU cap cannot absorb better-auth's default scrypt
password hashing (deliberately tens of milliseconds). The workaround - a
cheaper WebCrypto PBKDF2 hash - trades security margin for $5; take the
paid plan and record the decision.

**The dev loop**: `next dev` (:3000) has no Worker; `wrangler dev` (:8787)
has no HMR. Run both, with `NEXT_PUBLIC_API_BASE` - empty in production
(same-origin), `http://localhost:8787` in dev - read by one `apiFetch`
helper and the auth client's `baseURL`; nothing else may hardcode a host.
The Worker enables CORS-with-credentials for `localhost:3000` only under a
`DEV` var; production ships no CORS headers at all. `npm run preview` (the
real Worker over `out/`) is the same-origin integration check and what
Playwright API specs run against.

## 3. Auth: better-auth on D1

- `worker/auth.ts`: better-auth with the **Drizzle adapter over D1**;
  `npx @better-auth/cli generate` emits the auth tables (`user`, `session`,
  `account`, `verification`). Mounted as
  `app.on(['GET','POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))`.
- **Email/password** with verification required; **social** starts with
  GitHub and Google (least review friction). Providers are
  clientId/secret + callback URL - adding one later is configuration.
- **No KV, and no secondary storage.** This originally specified a KV session
  cache; implementing it showed the binding earning nothing. Sessions use
  better-auth's `cookieCache` instead - a signed, short-lived copy in the
  cookie, which removes the lookup rather than moving it to a store the deploy
  then has to provision. better-auth's own credential rate limiting is set to
  `storage: 'database'`, because its default in-memory map is per-isolate and
  would count a distributed brute force as unrelated attempts.
- Transactional email (verification, reset) via an HTTP email API - Resend
  as default candidate, one `fetch`, swappable behind better-auth's hooks.
  SPF/DKIM on the sending domain is calendar time, not code time - start it
  first. **Turnstile** on credential signup (better-auth's captcha plugin;
  we are already on Cloudflare).
- Client: `createAuthClient` from `better-auth/react` in
  `lib/authClient.ts`; static `/sign-in`, `/sign-up`, `/account` pages as
  plain client components in the existing visual language. A static export
  has no middleware route protection and needs none: pages render a
  signed-out state client-side, and the *data* is protected at the API -
  the only place protection is real anyway.

**Studio's policy: generation requires a session; matching does not.**
Signed out, the button reads "Match from the library" and runs the client
matcher exactly as today; "Generate with AI" routes through
`/sign-in?next=/studio` and back. Nobody loses the current capability by
declining an account, and the LLM never runs for an anonymous request -
cost control at the top of the funnel, before quotas even apply.

Deliberately not yet: billing tiers (the quota shape in §8 accepts a paid
tier without schema changes), organizations, passkeys.

## 4. The gateway rules

"OpenAI-compatible" is a *wire format*, not a vendor: text is
`${AI_BASE_URL}/responses`, images are `${AI_BASE_URL}/images/*`, both with
a bearer key - OpenAI, an aggregator, or a self-hosted server are one
env-var change. Cloudflare AI Gateway in front is recommended and is also
just an `AI_BASE_URL` change; it buys logging, caching, retries, and a spend
dashboard without code.

**Text speaks the Responses API**, which OpenAI recommends for new work and
which is the only one of the two endpoints that can carry a turn forward: a
response has an id, and quoting it as `previous_response_id` continues that
context server-side. Studio spends that twice - the repair retry in §5 is a
real second turn rather than a re-ask, and the id is stored on the
generation row so a revision can continue the document a user kept.

Three consequences are load-bearing:

- **Reasoning tokens are output tokens.** `max_output_tokens` is spent on
  thinking *before* any message is emitted, so a cap sized for the old
  `max_completion_tokens` returns `status: "incomplete"` with no content at
  all. That is a distinct failure from a refusal or a malformed answer and
  the client reports it as one; `AI_REASONING_EFFORT` and the cap trade
  against each other and are both configuration.
- **There is no `choices[0].message.content`.** The answer is an item in an
  `output` array that also carries reasoning items, so it is walked rather
  than indexed, and a `refusal` part is distinguished from an empty one.
- **`store: true` is what makes an id resolvable**, and it means prompts and
  answers are retained upstream. That is a deliberate trade for continuity,
  not an incidental default. Everything sent is already the user's own
  description plus catalog facts; nothing is added to it here.

Continuity is an optimisation and never a dependency: an upstream that
stores nothing returns no id, and both callers fall back to restating the
document in full.

- **Task endpoints, never a raw proxy.** No `/api/ai/chat` passthrough -
  that is a free LLM faucet and hands prompt construction to the client.
  Every endpoint is task-shaped: session-checked, zod-validated input in,
  validated JSON out, prompts assembled server-side.
- **Structured output, validated twice.** Text calls send the schema as
  `text.format: {type:'json_schema', strict:true}` and the Worker validates
  the response against the same zod schema - an upstream that ignores
  `json_schema` (some "compatible" servers do) fails loudly, not with
  garbage reaching the UI. Schema enums that reference catalog facts are
  built from the deployed bytes (§5.2).
- The user's description is data, clearly delimited in the prompt - it is
  untrusted text, and the schema, not the prompt, is the security boundary.

## 5. `POST /api/studio/directions`

**Input** (zod): `{ description: string }`, trimmed, 10-600 chars - the
bounds `StudioForm` already enforces. Additive later: `{ exclude?: slug[] }`
for "three more" re-rolls.

**Pipeline:**

1. Session -> burst limiter -> daily ledger check (§8). Both counters are D1.
2. **Candidate assembly**: run the shared scorer over the studio index and
   take the top 12. The Worker reads the index as a build artifact through
   `env.ASSETS` (`/studio-index.json`, emitted by the same generator pass
   that owns the other agent-facing JSON) - the tools then describe exactly
   the bytes this deployment serves, and `lib/studioDirections.ts` stays
   server-only for the site without the Worker bundling template modules.
   Assembly must *relax* filters rather than AND itself into zero results,
   and the shipped diversity penalties (mood, hue, motif) run here so the
   dozen spans directions rather than clustering.
3. One `/responses` call, `text.format` strict JSON schema, slug enum from
   step 2 baked in. `instructions` carries the candidate summaries (name,
   topic, moods, tags, palette, density) and the contract; the description
   is the `input`.
4. Validate (zod, same schema). Palettes get the deterministic repair pass
   (§6). On failure: one repair retry carrying the validation errors -
   **chained on `previous_response_id`**, so the input is the correction
   alone against a context that still holds what the model just wrote, which
   is what it needs to see to fix it. On the second failure, **fall back to
   the matcher's own top 3** with `source: 'matched-fallback'` - the user
   gets results, never an error page, and the ledger records the attempt.
5. Write the `aiUsage` row from the upstream `usage` field -
   `input_tokens`/`output_tokens`, **summed across both turns**, because a
   rejected first turn spent real tokens and a chained retry is billed for
   the context it re-reads on top of them. A conservative estimate stands in
   when `usage` is absent, so the ledger never under-counts. Store the
   generation with its response id (§7), return `{ id }`.

**Output** - three directions, each:

```jsonc
{
  "slug": "verdant",                  // enum: the candidate dozen
  "stance": "Warm Editorial",        // the direction's own name
  "why": "Earthy greens and a calm leaf motif match the warm, trusted feel.",
  "palette": ["#F4F1EA", "#2E4A1F", "#7EA832", "#C9D98A"],  // background first
  "copy": {
    "brandName": "Hearth & Home",     // ≤ 30 chars
    "headline": "Find the home your life fits in.",          // ≤ 70
    "tagline": "A residential team for young Austin families." // ≤ 90
  },
  "image": null                       // filled by §7's image call, if requested
}
```

Plus a top-level `recommended` index and the model id used. The `copy`
budgets mirror the editable spec's `maxChars` discipline so the same values
can later flow into an edits document (§9) without truncation surgery.

## 6. Palettes: authored by the model, guaranteed by us

The palette is the one free-form text field, so it gets the strictest
programmatic treatment, with machinery that already exists: `isHexColor`
gate, then the two palette-library rules - no ink equal to its background,
at least one ink at ~3:1 contrast against `color0` - checked with
`contrastRatio` from `tabbied-templates/src/color.ts` (DOM-free, already a
workspace dependency; the Worker imports the same functions rather than
growing a second color library). A failing palette is repaired by
lightness-nudging the nearest ink (`mix` toward `onColor`) - one
deterministic pass - and only if repair cannot reach 3:1 does that
direction fall back to the site's authored palette. `StudioResults` renders
the generated palette through the existing `TabbiedPattern` cards; nothing
in the UI knows which path produced it.

## 7. Images and media: GPT Image 2 + R2

Studio generates imagery as well as directions, and stores it in R2. Two
kinds of media, one bucket (`MEDIA`), two prefixes:

- **`up/<userId>/<uuid>`** - user uploads. `POST /api/uploads`
  (authenticated) accepts images only, content-sniffed, a few MB cap; the
  D1 row stores the key, never the bytes. This is what un-blocks the
  artboard's photo-upload block on `StudioForm` - dropped from the matcher
  build because files had nowhere to go - restored for signed-in users,
  with per-file notes kept alongside for the eventual editor session.
- **`gen/<generationId>/<n>.webp`** - generated images.
  `POST /api/studio/direction-image` takes `{ generationId, index }`, loads
  the stored direction, assembles the image prompt server-side (stance,
  palette as anchored colors, the description, the house no-text rule),
  calls the **GPT Image 2 API through the same gateway base**, writes the
  result to R2, patches the stored generation's `image` field with the
  media key, and returns it. **Idempotent per (generation, index)** - a
  second call returns the stored key rather than re-spending.

Decisions that keep this honest:

- **Lazy, per direction - never three images up front.** Text directions
  are cheap; images cost real money. The results page renders instantly
  with pattern previews (as today) and each card offers "Generate imagery";
  opening or choosing a direction is the natural trigger. Image calls are
  metered as their own `endpoint` in the ledger with their own daily cap.
- **Native alpha, one vendor.** `gpt-image-2` honors
  `background: "transparent"`, so cut-out style brand imagery (an object to
  sit *on* a Tabbied pattern - the offline pipeline's strongest trick)
  needs no background-removal vendor. This mirrors the offline template
  pipeline, which dropped its Kie.ai leg for the same reason
  (`docs/image-pipeline.md`); the prompt craft there - one subject, no
  baked shadow, no text, palette anchored to materials - is the prompt
  craft here.
- **Serving**: `GET /api/media/<key>` streams from R2 with
  `cache-control: public, max-age=31536000, immutable` - keys are
  unguessable and content-stable, so immutable is safe. `/api/*` is already
  in `run_worker_first`; no new route class is needed.
- R2 stores WebP as returned (`output_format: "webp"` - smaller than PNG,
  alpha-capable); no re-encode pass in the Worker.

## 8. Storage and quotas (D1)

Beyond better-auth's tables, three app tables (Drizzle-defined):

- **`generation`** - `id` (128-bit random: the capability), `userId`,
  `description`, `result` (validated JSON, a few KB),
  `source` (`'ai' | 'matched-fallback'`), `model`, `responseId`,
  `createdAt`. `responseId` is the Responses turn the document came from, to
  be quoted as `previous_response_id` when a revision continues it; it is
  nullable and must stay so - a matched answer has no turn, an upstream that
  does not store returns no id, and upstream retention is finite, so a
  revision treats a stale id as a cache miss and restates the document. It
  is never returned by the read endpoint: that read is unauthenticated, and
  a stranger holding a share link has no business with the turn handle. A
  generation is an **immutable receipt** (the §7 image patch fills a
  declared-null field; nothing else ever mutates). `POST` returns `{id}`;
  the client navigates to `/studio/results?g=<id>`; the page fetches
  `GET /api/studio/generations/<id>` and renders the stored result. Reads
  are unauthenticated by design - the random id is the bearer, exactly an
  unlisted link - and the page echoes the description, so the sharing user
  sees everything a recipient will. No listing endpoint; "my generations"
  is a later `/account` nicety over the same rows.
- **`aiUsage`** - the ledger: `id`, `userId`, `endpoint`, `model`,
  `promptTokens`, `completionTokens`, `imageCount`, `costEstimate`,
  `createdAt`. Checked before every upstream call (per-user daily budget,
  text and image caps separate); written after, from the response.
- **`upload`** - `id`, `userId`, `key`, `contentType`, `bytes`, `note`,
  `createdAt`.

Burst limiting per user on `/api/studio/*`, as a `rate_window` row per (user,
endpoint) incremented by a single atomic statement.

**This was specified as KV counters and that was wrong.** Workers KV permits
one write per second to a given key and *throws* on the second, so a client
sending two requests in a second - precisely the burst being limited - made
the counter throw and the intended 429 surfaced as a 500. KV also has no
compare-and-set, so the count could only ever be approximate. In D1 the window
rollover and the increment are one `INSERT ... ON CONFLICT DO UPDATE ...
RETURNING`, the count is exact under concurrency, and a rollover updates the
row in place so the table holds at most one row per user per endpoint.

## 9. What v1 deliberately does not do

- **No full-site customization on the results page.** Generated palette,
  copy and imagery live on the *cards*; Preview opens the template as
  authored. Rewriting the actual page is the edits-document bridge - the
  `data-edit*` spec and `applyEdits` engine in `tabbied-templates`
  (`docs/editable-templates.md`) applied in an iframe - and Studio adopts
  that when a template editor exists, by expanding a direction into an
  edits document (palette roles + `copy` -> the site's text slot ids; the
  §5 budgets already fit). Building a second, Studio-only apply path would
  fork the one contract that keeps person, agent, and service compatible.
- **No anonymous LLM calls, ever**, and no client-visible prompt assembly.
- **No image generation inside the text call** - not as a
  `chat/completions` side effect and not as the Responses API's
  `image_generation` tool. That tool puts a reasoning model in front of
  every image whose job is to rewrite a prompt this repo tunes deliberately
  (§7), and bills the rewrite; images stay on `/images/generations` as a
  separate metered endpoint with its own failure mode.
- **No conversation state as the source of truth.** `previous_response_id`
  is a cost and quality optimisation on a turn; the document in `generation`
  is what is authoritative, shareable and re-renderable. A shared `?g=` link
  is read by someone with no session and no upstream context, so anything
  that only exists in a stored turn cannot be part of the contract.
- **No hosted sites.** The zip is the product; hosting is a different
  product with a different abuse surface.

## 10. Testing

- **Worker tests** (`@cloudflare/vitest-pool-workers`, local D1 with
  migrations applied, a local OpenAI-shaped stub upstream - never a paid
  API): candidate-assembly determinism, schema validation of a canned good
  response, the repair-retry and matcher-fallback paths, palette repair
  pinned against `contrastRatio`, image-endpoint idempotency, quota
  exhaustion (text and image separately), the unauthenticated 401, and R2
  round-trip through `/api/media/<key>`. The Responses client is pinned
  separately at the fetch boundary: the `output` walker stepping past a
  reasoning item, a refusal read as a refusal, an exhausted reasoning budget
  named as `incomplete` rather than as empty output, `store`/`text.format`
  on the wire, and `previous_response_id` on a chained turn.
- **e2e** against `npm run preview` with `AI_BASE_URL` pointed at the stub
  (a `.dev.vars` concern, never a production code path): sign-up -> verify
  (stub mail captured to `dev_mail`) -> generate -> three cards render -> every
  Preview href answers 200 -> "Generate imagery" produces an `<img>` served
  from `/api/media/` -> the `?g=` link renders identically in a fresh
  context. The existing matcher specs keep running unchanged against
  `serve out` - the signed-out path must keep working with no Worker at
  all.
- **The determinism spec forks**: "same description gives the same three"
  stays true for `?q=`; for `?g=` the property that survives is "the same
  stored generation renders the same three", asserted instead.

## 11. Sequencing

1. **Substrate** - bindings (`DB`, `MEDIA`), Drizzle + migrations,
   better-auth email/password with verification, sign-in/up/account pages,
   the dev loop, the vitest harness. Paid-plan decision recorded here.
   *(Done. The one surprise: bindings must declare no id, or wrangler looks
   the placeholder up instead of provisioning the resource.)*
2. **Ledger + limits** - `aiUsage`, the `rate_window` counter. Small;
   everything after assumes it.
3. **Directions end to end** - index asset, candidate assembly, upstream
   client, double validation, palette repair, fallback, `generation`
   storage, `?g=` results path, skeleton loading UI, the e2e loop. *Ship
   line: Studio generates.*
4. **Images + media** - R2 bucket, `/api/media/<key>`, `direction-image`
   with its own quota, "Generate imagery" on the cards.
5. **Uploads** - `/api/uploads`, the form's photo block restored with
   per-file notes.
6. **Social providers** and "three more" (`exclude`).
7. **The edits-document bridge** - directions expand into edits documents;
   Preview shows the re-colored, re-worded site. Rides a template editor's
   existence, not before.

Steps 1-4 are the substance; 5-7 are scheduled opportunism. Each step
deploys independently; nothing before step 4 touches any existing page, and
the MCP endpoint is untouched throughout.

## 12. Risks worth naming

- **Quality floor.** The model can pick a defensible-but-dull three.
  Candidate assembly is the lever, and a fixture set of descriptions with
  snapshot review keeps prompt changes honest - the catalog's closed
  vocabulary makes those evals cheap to assert against.
- **Latency vs. the matcher.** Signed-in users trade instant results for a
  multi-second call. Skeleton cards and stance-name reveal make the trade
  legible; the fallback means the worst case is the current product, never
  a spinner to nowhere. Streaming the text call is the upgrade if the
  chosen model warrants it; the response is small enough that v1 ships
  without it.
- **Image spend.** The most expensive call is behind the most deliberate
  click, idempotent per direction, and separately capped. The treadmill to
  watch is re-roll ("three more") × imagery; they share one daily ledger.
- **"OpenAI-compatible" drift** - ignored `json_schema`, absent `usage`,
  an images endpoint that quietly ignores `background`. Double validation
  makes text drift loud; the alpha lesson from the offline pipeline
  applies to images (verify transparency when a prompt demanded it); the
  conservative usage estimate keeps the ledger honest.
- **Capability-URL leakage.** A shared `?g=` link exposes the description,
  results, and any generated imagery to whoever holds it. That is the
  feature, stated plainly in the UI ("anyone with the link can view"); ids
  are unguessable, no user identity is in the payload, and there is no
  enumeration surface.
- **CPU limits discovered late** - mitigated by deciding the paid plan in
  step 1, not after a production incident.
