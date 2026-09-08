import type { Env } from '../env';
import type { StudioEntry } from '../../lib/studioMatch';

// The 57 template sites, read as an asset rather than bundled.
//
// `/studio-index.json` is emitted by the export (app/studio-index.json/route.ts)
// from the same TypeScript the site matches against, so the API and the browser
// score identical data and a template added in one commit cannot be missing
// from one of them. It is the property the MCP endpoint already relies on for
// the design catalog, and the memoization is the same shape too: cached as the
// promise, so concurrent first requests share one fetch, and a failure is not
// cached - a transient miss would otherwise poison the isolate for its lifetime.

type Index = { specVersion: number; count: number; entries: StudioEntry[] };

let indexPromise: Promise<StudioEntry[]> | null = null;

export function loadStudioIndex(env: Env, request: Request): Promise<StudioEntry[]> {
  indexPromise ??= env.ASSETS.fetch(new URL('/studio-index.json', request.url).toString())
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`/studio-index.json returned ${response.status}`);
      }

      const body = (await response.json()) as Index;

      if (!Array.isArray(body.entries) || body.entries.length === 0) {
        throw new Error('/studio-index.json contained no entries');
      }

      return body.entries;
    })
    .catch((error) => {
      indexPromise = null;
      throw error;
    });

  return indexPromise;
}
