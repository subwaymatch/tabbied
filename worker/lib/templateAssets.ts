import type { TemplateSpec } from 'tabbied-templates';
import type { Env } from '../env';

// The template artefacts, read through the assets binding.
//
// Same doctrine as the catalog and the studio index: the Worker describes and
// authors against exactly the bytes this deployment serves, so a template
// re-packaged in this commit cannot be missing from, or disagree with, what
// the model is handed. None of it is memoised per isolate: there are 57 slugs
// each read rarely, and a stale spec cached across a deploy would be precisely
// the drift the pinning in `site` exists to detect.

type CatalogEntry = { slug: string; copyRoles?: string[] };
type EditableCatalog = { templates: CatalogEntry[] };
type DesignCatalog = { designs: { slug: string }[] };

/** How many redirects a read will follow before giving up. */
const MAX_HOPS = 3;

/**
 * Read one asset, the way a browser would.
 *
 * The binding applies the same `html_handling` the edge does, and under the
 * default (`auto-trailing-slash`) a request for `/dir/index.html` is not
 * served: it is answered with a 307 to `/dir/`. workerd follows that on a
 * request made from a URL string, which is why reading the packaged page by
 * file name worked; but a reader that throws on anything but a 200 was one
 * runtime detail away from a 500 on every "Make this one". So callers ask
 * for the URL the router serves outright (see `loadPackagedHtml`), and a
 * same-origin redirect handed back anyway is followed here, a bounded
 * number of times.
 */
async function readAsset(env: Env, request: Request, path: string): Promise<Response> {
  let url = new URL(path, request.url);

  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    const response = await env.ASSETS.fetch(url.toString());

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      const next = location ? new URL(location, url) : null;

      if (!next || next.origin !== url.origin) {
        throw new Error(`${path} redirected off-site (${response.status})`);
      }

      url = next;
      continue;
    }

    if (!response.ok) {
      throw new Error(`${path} returned ${response.status}`);
    }

    return response;
  }

  throw new Error(`${path} redirected more than ${MAX_HOPS} times`);
}

/** `/editable-catalog.json`: which templates can take which brand copy. */
export async function loadEditableCatalog(env: Env, request: Request): Promise<EditableCatalog> {
  return (await readAsset(env, request, '/editable-catalog.json')).json() as Promise<EditableCatalog>;
}

// The design catalog is the one asset here that is memoised, the way the
// studio index is: it is read on every save that swaps a pattern, and it
// changes only with a deploy, which is a new isolate. Cached as the promise
// so concurrent first reads share one fetch, and dropped on failure so a
// transient miss does not poison the isolate for its lifetime.
let designsPromise: Promise<ReadonlySet<string>> | null = null;

/**
 * `/catalog.json`: every design's slug, as the set a pattern slot may be
 * swapped to. A slug outside it hydrates to a blank field with a console
 * warning, so the planner is handed this and refuses it up front.
 */
export function loadDesignSlugs(env: Env, request: Request): Promise<ReadonlySet<string>> {
  designsPromise ??= readAsset(env, request, '/catalog.json')
    .then(async (response) => {
      const body = (await response.json()) as DesignCatalog;

      if (!Array.isArray(body.designs) || body.designs.length === 0) {
        throw new Error('/catalog.json contained no designs');
      }

      return new Set(body.designs.map((design) => design.slug));
    })
    .catch((error) => {
      designsPromise = null;
      throw error;
    });

  return designsPromise;
}

/** `/editable/<slug>.json`: the spec the site is authored against. */
export async function loadTemplateSpec(env: Env, request: Request, slug: string): Promise<TemplateSpec> {
  return (await readAsset(env, request, `/editable/${slug}.json`)).json() as Promise<TemplateSpec>;
}

/**
 * The packaged page, `out/downloads/<slug>/index.html`: the artefact previewed
 * and shipped. Asked for as `/downloads/<slug>/`, the URL the asset router
 * serves it under, which is also what the browser-side preview fetches
 * (`packagedTemplateUrl` in lib/studioPreview.ts). Asking for `index.html`
 * by name gets a redirect instead of the bytes; see `readAsset`.
 */
export async function loadPackagedHtml(env: Env, request: Request, slug: string): Promise<string> {
  return (await readAsset(env, request, `/downloads/${slug}/`)).text();
}

/** SHA-256 as hex, what `site.templateHash` pins. */
export async function hashText(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));

  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
