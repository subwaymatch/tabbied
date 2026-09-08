// The Cloudflare Worker that serves tabbied.com.
//
// It is almost entirely a static-asset server: `next build` writes the whole
// site into out/, wrangler uploads it, and Cloudflare serves matching paths
// without ever invoking this code. Only three prefixes reach the Worker:
//
//   /mcp     the remote MCP endpoint (see docs/mcp-server.md)
//   /api     the platform tier: accounts, projects, AI tasks
//   /health  a liveness probe that doesn't depend on the asset pipeline
//
// and everything else falls through to `env.ASSETS`, which is also how the
// custom 404 page is served (`not_found_handling: "404-page"`).
//
// Routing is Hono's rather than a chain of `if (pathname === ...)`. That was the
// right shape for two routes and the wrong one for twenty: the platform work
// (see agent-outputs/20260827-studio-ai-plan.md) adds an authenticated API whose
// session extraction, rate limiting, and error shaping all want one place to
// live. Nothing about the two existing endpoints changes - same handlers, same
// statelessness, same fallthrough.
//
// The MCP server reads the catalog, the previews, and the reference *through
// the assets binding* rather than bundling them. That is deliberate: the tools
// then describe exactly the bytes this deployment serves, so a design added in
// the same commit can't be missing from the catalog the agent queries, and a
// 384 KB JSON file stays out of the Worker bundle.
//
// `createMcpHandler` is MCP v2's stateless entry point: it builds one server
// per request, which is exactly what the 2026-07-28 revision made possible by
// dropping the initialize/initialized handshake and the session id. That is
// why this endpoint needs no Durable Object - the protocol no longer needs one
// to be spoken. The same function is re-exported by `agents/mcp/server`; taking
// it from the SDK avoids pulling partyserver, esbuild, and babel into a Worker
// that wants none of them.
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createMcpHandler } from '@modelcontextprotocol/server';
import { buildAuth, configuredProviders } from './auth';
import type { Env } from './env';
import { isDev } from './env';
import journal from './migrations/meta/_journal.json';
import media from './routes/media';
import account from './routes/account';
import admin from './routes/admin';
import make from './routes/make';
import sites from './routes/sites';
import studio from './routes/studio';
import uploads from './routes/uploads';
import {
  buildServer,
  catalogTools,
  type Catalog,
  type CatalogDesign,
  type TemplateCatalog,
  type TemplateSpec,
} from 'tabbied-mcp';

export type { Env } from './env';

// Isolates are reused across requests, so a cold read of the catalog is paid
// once per isolate rather than once per request. Cached as the promise so
// concurrent first requests don't each start their own fetch.
let catalogPromise: Promise<Catalog> | null = null;
let docsPromise: Promise<string> | null = null;

function assetUrl(request: Request, path: string): string {
  return new URL(path, request.url).toString();
}

async function readAsset(
  env: Env,
  request: Request,
  path: string
): Promise<Response> {
  const response = await env.ASSETS.fetch(assetUrl(request, path));
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response;
}

function loadCatalog(env: Env, request: Request): Promise<Catalog> {
  catalogPromise ??= readAsset(env, request, '/catalog.json')
    .then((response) => response.json() as Promise<Catalog>)
    // Don't cache a failure: a transient miss would otherwise poison the
    // isolate for as long as it lives.
    .catch((error) => {
      catalogPromise = null;
      throw error;
    });
  return catalogPromise;
}

function loadDocs(env: Env, request: Request): Promise<string> {
  docsPromise ??= readAsset(env, request, '/llms-full.txt')
    .then((response) => response.text())
    .catch((error) => {
      docsPromise = null;
      throw error;
    });
  return docsPromise;
}

// btoa needs a binary string, and spreading a 400 KB array into
// String.fromCharCode blows the argument limit - so build it in chunks.
function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

async function handleMcp(request: Request, env: Env): Promise<Response> {
  const catalog = await loadCatalog(env, request);

  const fetchPreview = async (design: CatalogDesign) => {
    // The catalog's `preview` is an absolute tabbied.com URL, but this Worker
    // may be answering on a *.workers.dev preview deployment; re-resolving the
    // path against the incoming request keeps it reading its own assets.
    const path = new URL(design.preview).pathname;
    const response = await readAsset(env, request, path);
    return {
      data: toBase64(await response.arrayBuffer()),
      mimeType: response.headers.get('Content-Type') ?? 'image/webp',
    };
  };

  // The template tools read the same generated artefacts the site serves, so
  // an agent and the web builder see one set of bytes - and a template
  // annotated in this commit cannot be missing from the index an agent
  // queries. Unlike the catalog these are not worth memoising per isolate: the
  // per-slug specs are many and each is read rarely, and the index is small.
  const fetchTemplateCatalog = async () =>
    (await readAsset(env, request, '/editable-catalog.json')).json() as
      Promise<TemplateCatalog>;

  const fetchTemplate = async (slug: string) =>
    (await readAsset(env, request, `/editable/${slug}.json`)).json() as
      Promise<TemplateSpec>;

  // No render_design: rendering a css-doodle pattern needs a real browser, and
  // a Worker has none. Agents that need a rendered asset use the local stdio
  // server (`npx tabbied-mcp`) or the `tabbied` CLI.
  const tools = catalogTools({
    catalog,
    fetchPreview,
    fetchDocs: () => loadDocs(env, request),
    fetchTemplateCatalog,
    fetchTemplate,
  });

  // A factory, per the stateless model - the handler builds a server per
  // request. `legacy: 'stateless'` (the default, spelled out here because it is
  // load-bearing) keeps 2025-era clients working: they still open with
  // `initialize`, and every shipping client does so today.
  return createMcpHandler(() => buildServer(tools), {
    legacy: 'stateless',
  }).fetch(request);
}

const app = new Hono<{ Bindings: Env }>();

// Every method, because the transport uses more than POST and the SDK is what
// decides which ones it answers - a 405 from the SDK is a correct MCP reply,
// whereas a 404 from this router would not be. Both spellings are registered
// because `run_worker_first` hands us the unslashed form and a client that
// posts to `/mcp/` must not be redirected (see wrangler.jsonc).
app.all('/mcp', (c) => handleMcp(c.req.raw, c.env));
app.all('/mcp/', (c) => handleMcp(c.req.raw, c.env));

/** Every message down the cause chain, so a wrapped D1 error still reads as one. */
function describeError(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;

  for (let depth = 0; current !== undefined && current !== null && depth < 5; depth++) {
    parts.push(current instanceof Error ? current.message : String(current));
    current = current instanceof Error ? current.cause : undefined;
  }

  return parts.join(' <- ');
}

/**
 * SQLite's wording when the code is ahead of the database: a table or column
 * that a migration would have created. Drizzle wraps the D1 error, so the
 * cause chain is what gets matched, not the outer message.
 */
const SCHEMA_BEHIND = /no such (table|column)/i;

/** The newest migration this build ships, from drizzle's own journal. */
const EXPECTED_MIGRATION = journal.entries.at(-1)?.tag ?? null;

/**
 * What the database has actually had applied, against what this build
 * expects. `d1_migrations` is wrangler's ledger (one row per applied file);
 * a database that has never been migrated has no such table, which reads
 * as "nothing applied" rather than as an error.
 */
async function schemaStatus(env: Env) {
  let applied: string | null = null;

  try {
    const row = await env.DB.prepare(
      'SELECT name FROM d1_migrations ORDER BY id DESC LIMIT 1'
    ).first<{ name: string }>();
    applied = row?.name.replace(/\.sql$/, '') ?? null;
  } catch {
    applied = null;
  }

  return { expected: EXPECTED_MIGRATION, applied, current: applied === EXPECTED_MIGRATION };
}

app.onError((error, c) => {
  const { pathname } = new URL(c.req.url);
  const detail = describeError(error);
  const ray = c.req.header('cf-ray') ?? null;

  // Say what failed, in the log. Cloudflare's observability keeps console
  // output, and a 500 that names nothing gets diagnosed by reading every
  // handler on the path instead of one line. The ray id is echoed in the
  // body so a report from a browser console can be matched to that line.
  console.error(
    `${c.req.method} ${pathname}${ray ? ` [${ray}]` : ''}: ${
      error instanceof Error && error.stack ? error.stack : detail
    }`
  );

  // The catalog is an asset; if it can't be read, the deployment is broken
  // rather than the request. Say so in JSON-RPC terms so an MCP client
  // surfaces something better than an opaque 500.
  if (pathname === '/mcp' || pathname === '/mcp/') {
    return c.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32603,
          message: `MCP server unavailable: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      },
      503
    );
  }

  // A table or column the code expects and the database lacks is a deploy
  // that shipped without its migration, not a fault in the request. It is
  // answered as a 503 that says so: the fix is `npm run db:migrate:remote`,
  // and until it runs this route is down rather than mysteriously broken.
  // (This is what "Make this one" looked like from the outside when
  // migration 0003 had never been applied to production: every route that
  // touched `site` answered "Internal error", and the working routes around
  // it made the failure look like the model call.)
  if (SCHEMA_BEHIND.test(detail)) {
    return c.json(
      {
        error: 'The database schema is behind this deployment. Apply the pending migrations.',
        ray,
      },
      503
    );
  }

  return c.json({ error: 'Internal error', ray }, 500);
});

app.get('/health', (c) => c.text('ok'));

// ---- the platform tier ----------------------------------------------------
// Identity, Studio's generation endpoints, and R2 media. Everything here is
// same-origin with the site in production, which is the property that makes the
// session cookie work with no CORS surface at all.
const api = new Hono<{ Bindings: Env }>();

// Dev only, and narrowly: `next dev` serves the site from :3000 while the
// Worker runs on :8787, so the daily loop is cross-origin even though
// production never is. Production ships no CORS headers - the absence is the
// security property, so this must stay behind the flag.
api.use('*', async (c, next) => {
  if (!isDev(c.env)) {
    return next();
  }

  return cors({
    origin: ['http://localhost:3000', 'http://localhost:8787'],
    credentials: true,
    allowHeaders: ['content-type'],
  })(c, next);
});

// Liveness for the API tier, plus the one deploy-time fact nothing else
// reports: whether the database has had this build's migrations applied.
// `degraded` here, with `schema.applied` behind `schema.expected`, is the
// whole diagnosis of a Studio that answers 503 on every site route.
api.get('/health', async (c) => {
  const schema = await schemaStatus(c.env);

  return c.json({
    status: schema.current ? 'ok' : 'degraded',
    service: 'tabbied-api',
    version: 1,
    schema,
  });
});

// Which social providers the sign-in form may offer. Public and cheap: it
// reads the environment and touches nothing. Deliberately outside better-auth's
// own prefix, which has no equivalent - a button for an unconfigured provider
// would otherwise be one that 500s on click.
api.get('/auth-providers', (c) => c.json({ providers: configuredProviders(c.env) }));

// better-auth owns everything under this prefix: sign-up, sign-in, callbacks,
// verification, session. Handing it the raw Request keeps us out of the way of
// its cookie and redirect handling.
// `all` rather than an explicit method list: better-auth answers GET, POST and
// the OPTIONS preflight the dev-only CORS layer above generates, and it returns
// its own 404 for anything it does not own.
api.all('/auth/*', async (c) => {
  if (!c.env.BETTER_AUTH_SECRET) {
    // Unconfigured is a 503, not a 500: the site is fine, this tier is not up.
    return c.json({ error: 'Authentication is not configured.' }, 503);
  }

  return buildAuth(c.env).handler(c.req.raw);
});

// Before the wider /studio prefix only for legibility - the two do not
// overlap, since studio.ts registers nothing under /sites.
api.route('/studio/make', make);
api.route('/studio/sites', sites);
api.route('/studio', studio);
api.route('/media', media);
api.route('/uploads', uploads);
api.route('/account', account);
api.route('/admin', admin);

// A miss under /api is JSON, never the site's 404 page. This is `all('*')`
// rather than `notFound()` because a sub-app's notFound handler is not used
// once it is mounted with `route()` - the request would fall through to the
// asset handler below and answer an API client with HTML.
api.all('*', (c) => c.json({ error: 'Not found' }, 404));

app.route('/api', api);

// Anything that is not one of ours is an asset. This is the common path by a
// wide margin - Cloudflare only routes the prefixes in `run_worker_first` here
// at all, and everything else that reaches us is a miss the asset router
// answers with out/404.html.
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
