// Turning a packaged template into a preview of a generated direction.
//
// The artefact previewed is the *download* - out/downloads/<slug>/index.html,
// the same bytes the Download button hands over. That is deliberate on both
// counts. It is the only version of a template with no framework left in it,
// so its patterns are `[data-pattern]` placeholders the edits engine can
// rewrite and a plain `hydratePatterns()` can mount, where the live
// /template/<slug>/ page mounts its patterns through React and would ignore an
// attribute written from outside. And previewing what is actually downloaded
// is the difference between a preview and a mockup.
//
// Four changes are made to it, and no others:
//
//   1. A <base> so the package's relative styles/ and images/ still resolve
//      once the document is running inside an iframe on another path.
//   2. The bootstrap's esm.sh import is pointed at a same-origin bundle. The
//      pinned CDN import is right for a stranger who unzipped the download
//      years from now and wrong for this site drawing its own preview. The
//      same script keeps the page's `#section` links in the page - see
//      `bootstrap` for why a srcdoc document cannot do that on its own.
//   3. The edits document - a direction's three strings, or a site's full
//      revision - applied by the engine, exactly as an editor would apply it.
//   4. Every relative stylesheet, image and script reference is spelled out
//      as an absolute path under the package. The <base> already resolves
//      them correctly, but Chromium's speculative preload scanner does not
//      honour a <base> in an about:srcdoc document: it fetched each
//      stylesheet and preloaded image against the *page's* URL first
//      (`/studio/results/styles/base.css` - a 404, then `ERR_ABORTED` once
//      the parser caught up and fetched the right one). Nothing broke, and
//      the console filled with errors that looked exactly like a broken
//      preview. Absolute paths give the scanner nothing to guess.
//
// The rest of the page is untouched, which is what makes this honest: every
// section, image and word the download contains is what shows up here.
import {
  applyEdits,
  type EditsDocument,
  type Problem,
  type TemplateSpec,
} from 'tabbied-templates';

/** The bundled, same-origin pattern runtime (scripts/build-preview-runtime.mjs). */
export const PREVIEW_RUNTIME = '/studio/preview-runtime.js';

export const packagedTemplateUrl = (slug: string) => `/downloads/${slug}/`;

export const templateSpecUrl = (slug: string) => `/editable/${slug}.json`;

export type PreviewDocument = {
  /** Serialized HTML, ready for an iframe's srcdoc. */
  html: string;
  /** Anything the engine could not apply. Rendered, not swallowed. */
  problems: Problem[];
};

/**
 * The script the shell injects in place of the packaged bootstrap.
 *
 * It carries no pattern names: the runtime bundles every design any packaged
 * template mounts and `hydrate()` closes over the map, so this is the same one
 * line for all 57 sites and cannot drift from the page it revives.
 */
const bootstrap =
  `import { hydrate, rehydrate } from '${PREVIEW_RUNTIME}';\n` +
  'hydrate();\n' +
  // Handed to the parent so the editor can re-draw the patterns after it has
  // rewritten their attributes. Same origin, so the parent can reach it.
  'window.__tabbied = { rehydrate };\n' +
  // A `#work` link in a srcdoc document is a navigation, not a scroll. The
  // document's own URL is `about:srcdoc`, and the link resolves against the
  // <base> to `/downloads/<slug>/#work` - never the same URL, so the browser
  // navigates the frame there: the raw package, with the rebrand gone and the
  // esm.sh bootstrap back. A sandbox does not stop a frame navigating itself.
  // So fragment links are handled here, as the scroll the template meant.
  'document.addEventListener("click", (event) => {\n' +
  '  const link = event.target instanceof Element ? event.target.closest(\'a[href^="#"]\') : null;\n' +
  '  if (!link || event.defaultPrevented || event.button !== 0) return;\n' +
  '  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;\n' +
  '  event.preventDefault();\n' +
  '  const id = decodeURIComponent(link.getAttribute("href").slice(1));\n' +
  '  const target = id ? document.getElementById(id) : null;\n' +
  '  if (target) target.scrollIntoView();\n' +
  '  else if (!id || id === "top") window.scrollTo(0, 0);\n' +
  '});\n';

/**
 * Rewrite the packaged bootstrap to load the same-origin runtime.
 *
 * Matched on the esm.sh specifier rather than on position: the packager writes
 * exactly one such module script today (scripts/package-templates.mjs), and if
 * that ever stops being true a preview that silently drew nothing would be far
 * harder to notice than the problem this reports.
 */
function rewriteBootstrap(documentEl: Document): Problem[] {
  const scripts = [
    ...documentEl.querySelectorAll('script[type="module"]'),
  ].filter((script) => script.textContent?.includes('esm.sh'));

  if (scripts.length === 0) {
    return [
      {
        level: 'error',
        path: 'runtime',
        message:
          'the packaged template has no esm.sh bootstrap to replace - its patterns will not render',
      },
    ];
  }

  scripts.forEach((script, index) => {
    // One script does the hydrating; any further one is a duplicate mount.
    script.textContent = index === 0 ? bootstrap : '';
  });

  return [];
}

/** Attributes the preload scanner acts on, by element. */
const RESOURCE_ATTRIBUTES: ReadonlyArray<readonly [selector: string, attribute: string]> = [
  ['link[href]', 'href'],
  ['link[imagesrcset]', 'imagesrcset'],
  ['img[src], script[src], source[src], video[src], audio[src], track[src], iframe[src], embed[src]', 'src'],
  ['img[srcset], source[srcset]', 'srcset'],
  ['video[poster]', 'poster'],
];

/** Absolute, root-relative, fragment-only, protocol-relative or empty: not ours to touch. */
const NOT_RELATIVE = /^(?:[a-z][a-z0-9+.-]*:|\/|#|$)/i;

/**
 * `./styles/base.css` -> `/downloads/<slug>/styles/base.css`. Resolved with the
 * URL parser against a throwaway origin so `./` and `../` mean what they mean.
 */
function absolutise(value: string, root: string): string {
  if (NOT_RELATIVE.test(value.trim())) return value;

  const resolved = new URL(value.trim(), `https://package.invalid${root}`);

  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
}

/** Each candidate of a srcset is a URL and an optional descriptor. */
function absolutiseSrcset(value: string, root: string): string {
  return value
    .split(',')
    .map((candidate) => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);

      return [absolutise(url ?? '', root), ...descriptor].join(' ');
    })
    .join(', ');
}

/**
 * Spell every relative resource reference out as an absolute path under the
 * package (change 4 above). The <base> stays: it is what resolves the
 * references this cannot see, such as a `url()` in an inline style.
 */
function absolutiseResources(documentEl: Document, root: string): void {
  for (const [selector, attribute] of RESOURCE_ATTRIBUTES) {
    for (const element of documentEl.querySelectorAll(selector)) {
      const value = element.getAttribute(attribute);
      if (value === null) continue;

      const rewritten = attribute.endsWith('srcset')
        ? absolutiseSrcset(value, root)
        : absolutise(value, root);

      if (rewritten !== value) element.setAttribute(attribute, rewritten);
    }
  }
}

/**
 * Build the preview document.
 *
 * Takes the packaged HTML as text rather than fetching it, so the caller owns
 * the request (and its errors) and this stays a pure transform over a DOM the
 * browser already knows how to build.
 */
export function buildPreviewDocument(options: {
  html: string;
  spec: TemplateSpec;
  /** Any edits document - a three-string rebrand or a full revision. */
  edits: EditsDocument;
  slug: string;
}): PreviewDocument {
  const { html, spec, edits, slug } = options;
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const head = parsed.head;

  // First child, so it precedes every relative href and src in the document -
  // a <base> only governs what follows it.
  const base = parsed.createElement('base');
  base.setAttribute('href', packagedTemplateUrl(slug));
  head.insertBefore(base, head.firstChild);

  const problems = [
    ...rewriteBootstrap(parsed),
    ...applyEdits(parsed, spec, edits).problems,
  ];

  // After the edits, so an image the engine pointed at a template file is
  // covered too.
  absolutiseResources(parsed, packagedTemplateUrl(slug));

  return {
    html: `<!DOCTYPE html>${parsed.documentElement.outerHTML}`,
    problems,
  };
}
