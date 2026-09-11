// The download with the person's changes in it, built where the changes are.
//
// The packaged zip on the server is the template as authored; the customizer
// holds the document that changes it. A Worker route could not apply that
// document (it has no DOM) and would re-upload a multi-megabyte archive per
// click, so the browser does it: fetch the packaged zip, apply the document
// to its index.html with the same engine the canvas was drawn with, and zip
// it again. What is saved is exactly what was previewed, which is the whole
// point of previewing the download rather than the live page.
//
// Two things beyond the engine's own work are done to the page, and no
// others. The bootstrap's import list is rewritten to the designs the page
// mounts *now*: the packager named each design the export used, and a
// swapped field names one that list never had. And a picture Studio made,
// which the page reaches through /api/media, is fetched and shipped inside
// the archive, since an unzipped folder has no API behind it.
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import {
  applyEdits,
  type EditsDocument,
  type Problem,
  type TemplateSpec,
} from 'tabbied-templates';

/** `zip`'s default and fflate's, the level the packager writes at. */
const ZIP_LEVEL = 6;

/** Every design the document mounts, sorted, for the bootstrap's import. */
const mountedDesigns = (doc: Document): string[] =>
  [
    ...new Set(
      [...doc.querySelectorAll('[data-pattern]')]
        .map((element) => element.getAttribute('data-pattern') ?? '')
        .filter((slug) => /^[a-z0-9]+$/.test(slug))
    ),
  ].sort();

/**
 * Point the packaged bootstrap at the designs the page mounts now. Matched on
 * the esm.sh specifier the packager writes (scripts/package-templates.mjs);
 * false when there is no such script, which a caller reports rather than
 * shipping a page whose patterns would not draw.
 */
export function rewriteBootstrap(doc: Document): boolean {
  const script = [...doc.querySelectorAll('script[type="module"]')].find((candidate) =>
    candidate.textContent?.includes('esm.sh/tabbied')
  );

  if (!script) return false;

  const list = mountedDesigns(doc).join(', ');
  const text = script.textContent ?? '';

  script.textContent = text
    .replace(
      /import \{[^}]*\} from '(https:\/\/esm\.sh\/tabbied@[^']*\/patterns)'/,
      `import { ${list} } from '$1'`
    )
    .replace(/hydratePatterns\(\{ patterns: \{[^}]*\} \}\)/, `hydratePatterns({ patterns: { ${list} } })`);

  return true;
}

const extensionFor = (contentType: string): string => {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  return 'webp';
};

/**
 * Bring Studio's pictures into the archive. Each `/api/media/...` image is
 * fetched from this origin, written under images/, and the page pointed at
 * the copy. One that cannot be fetched is left as it was and reported.
 */
async function inlineMedia(
  doc: Document,
  slug: string,
  entries: Record<string, Uint8Array>
): Promise<Problem[]> {
  const problems: Problem[] = [];
  const images = [...doc.querySelectorAll('img[src^="/api/media/"]')];

  for (const [index, image] of images.entries()) {
    const src = image.getAttribute('src') ?? '';

    try {
      const response = await fetch(src);

      if (!response.ok) throw new Error(String(response.status));

      const file = `images/studio-${index + 1}.${extensionFor(response.headers.get('content-type') ?? '')}`;

      entries[`${slug}/${file}`] = new Uint8Array(await response.arrayBuffer());
      image.setAttribute('src', `./${file}`);
    } catch {
      problems.push({
        level: 'warning',
        path: 'images',
        message: `${src} could not be fetched and is still referenced by its URL`,
      });
    }
  }

  return problems;
}

export type CustomisedArchive = {
  bytes: Uint8Array;
  problems: Problem[];
};

/**
 * The packaged HTML download for `slug`, with the document applied.
 *
 * The zip is fetched from the same static path the plain Download button
 * uses, so what is customized is byte-for-byte the package the packager
 * wrote; the archive comes back with the same entries in the same order,
 * index.html replaced, and the same folder name at the root.
 */
export async function buildCustomisedArchive(options: {
  slug: string;
  spec: TemplateSpec;
  edits: EditsDocument;
}): Promise<CustomisedArchive> {
  const { slug, spec, edits } = options;
  const response = await fetch(`/downloads/${slug}-html.zip`);

  if (!response.ok) {
    throw new Error(`The ${slug} package is not available (${response.status}).`);
  }

  const entries = unzipSync(new Uint8Array(await response.arrayBuffer()));
  const page = `${slug}/index.html`;

  if (!entries[page]) {
    throw new Error(`The ${slug} package has no index.html.`);
  }

  const doc = new DOMParser().parseFromString(strFromU8(entries[page]), 'text/html');
  const problems = [...applyEdits(doc, spec, edits).problems];

  if (!rewriteBootstrap(doc)) {
    problems.push({
      level: 'error',
      path: 'runtime',
      message: 'the packaged template has no esm.sh bootstrap to update - its patterns would not draw',
    });
  }

  problems.push(...(await inlineMedia(doc, slug, entries)));

  entries[page] = strToU8(`<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`);

  return { bytes: zipSync(entries, { level: ZIP_LEVEL }), problems };
}

/** `Park & Co.` to `park-and-co`; a name with nothing usable in it is `site`. */
export const archiveNameFor = (title: string): string =>
  title
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'site';

/** Hand the bytes to the browser as a download. */
export function saveArchive(bytes: Uint8Array, fileName: string): void {
  const blob = new Blob([bytes as BlobPart], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  // Revoking synchronously can abort the just-started download.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
