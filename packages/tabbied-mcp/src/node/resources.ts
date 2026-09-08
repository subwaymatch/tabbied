// Where the stdio server gets its catalog, previews, and docs.
//
// The catalog is read from the installed `tabbied` package rather than fetched,
// so the tools describe exactly the version the caller will `npm install` - an
// agent told about a design that only exists on the site would write an import
// that doesn't resolve. The network is the fallback, not the default.
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type {
  Catalog,
  CatalogDesign,
  TemplateCatalog,
  TemplateSpec,
} from '../types.js';

const require = createRequire(import.meta.url);

export const SITE = 'https://tabbied.com';

/** Root of the installed `tabbied` package, or null when it isn't resolvable. */
export function tabbiedRoot(): string | null {
  try {
    return path.dirname(require.resolve('tabbied/package.json'));
  } catch {
    return null;
  }
}

export async function loadCatalog(): Promise<Catalog> {
  const root = tabbiedRoot();

  if (root) {
    try {
      return JSON.parse(
        await readFile(path.join(root, 'catalog.json'), 'utf-8')
      ) as Catalog;
    } catch (error) {
      // A resolvable package with no catalog.json means a source checkout that
      // hasn't been built. Say so - the network copy would silently disagree
      // with the local patterns the user is about to edit.
      const reason = error instanceof Error ? error.message : String(error);
      process.stderr.write(
        `tabbied-mcp: could not read the local catalog (${reason}); ` +
          `falling back to ${SITE}/catalog.json\n`
      );
    }
  }

  const response = await fetch(`${SITE}/catalog.json`);
  if (!response.ok) {
    throw new Error(
      `no local catalog and ${SITE}/catalog.json returned ${response.status}. ` +
        'Install the `tabbied` package (npm i tabbied) or restore network access.'
    );
  }
  return (await response.json()) as Catalog;
}

/**
 * Preview bytes for one design. These are the committed @2x renders the site
 * serves, so what the agent sees is the same image a human browsing the gallery
 * sees - not a fresh render that might differ.
 */
export async function fetchPreview(
  design: CatalogDesign
): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(design.preview);
  if (!response.ok) {
    throw new Error(`${design.preview} returned ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    data: buffer.toString('base64'),
    mimeType: response.headers.get('Content-Type') ?? 'image/webp',
  };
}

/**
 * The full reference. The package ships its own copy as llms.txt (the tarball
 * gets the *full* text under that name - in node_modules, depth beats brevity),
 * so this works offline too.
 */
export async function fetchDocs(): Promise<string> {
  const root = tabbiedRoot();
  if (root) {
    try {
      return await readFile(path.join(root, 'llms.txt'), 'utf-8');
    } catch {
      // fall through to the network copy
    }
  }

  const response = await fetch(`${SITE}/llms-full.txt`);
  if (!response.ok) {
    throw new Error(`${SITE}/llms-full.txt returned ${response.status}`);
  }
  return await response.text();
}

/**
 * The editable-template index and one site's spec.
 *
 * These come from the network with no local fallback, and that is not an
 * oversight: they are *site* artefacts, generated from the static export
 * (docs/editable-templates.md), and the `tabbied` package does not contain
 * them. There is nothing local to prefer.
 */
export async function fetchTemplateCatalog(): Promise<TemplateCatalog> {
  const response = await fetch(`${SITE}/editable-catalog.json`);

  if (!response.ok) {
    throw new Error(`${SITE}/editable-catalog.json returned ${response.status}`);
  }

  return (await response.json()) as TemplateCatalog;
}

export async function fetchTemplate(slug: string): Promise<TemplateSpec> {
  const response = await fetch(`${SITE}/editable/${slug}.json`);

  if (!response.ok) {
    throw new Error(`${SITE}/editable/${slug}.json returned ${response.status}`);
  }

  return (await response.json()) as TemplateSpec;
}
