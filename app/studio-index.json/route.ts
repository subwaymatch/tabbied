import { STUDIO_ENTRIES } from 'lib/studioDirections';

// The studio index, emitted as a plain static asset by the export.
//
// The Worker matches against the same 57 entries the browser does, and this is
// how it gets them: `env.ASSETS.fetch('/studio-index.json')`. Reading it as an
// asset rather than bundling it into the Worker is the property the MCP
// endpoint already relies on - the tools describe exactly the bytes this
// deployment serves, so a template added in the same commit cannot be missing
// from the index the API matches against.
//
// It is a route handler rather than a generator script because the source of
// truth is TypeScript (lib/templateSites.ts, components/template/templateData.ts,
// and the package's catalog.json): the build already resolves all three, and a
// second reader would be a second definition of what an entry is.
export const dynamic = 'force-static';

export async function GET() {
  return Response.json({
    specVersion: 1,
    count: STUDIO_ENTRIES.length,
    entries: STUDIO_ENTRIES,
  });
}
