// Finding annotated elements in exported HTML, without a DOM.
//
// The generator reads a template's *current* values out of the static export -
// the same doctrine as the download packager: derive from what shipped, so the
// spec can never disagree with the page it describes. That means scanning
// markup in Node, where there is no document.
//
// This is a real (small) tokenizer rather than a regex, and the reason is on
// the record elsewhere in this repo: the CSS trimmer in package-templates.mjs
// was written with naive `indexOf('{')` scanning and silently desynchronised
// on a comment containing a brace. HTML has more of those traps, not fewer -
// a `>` inside an attribute value, a comment containing markup, and script
// bodies that are not markup at all.

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/** Elements whose content is text, not markup, and must not be walked. */
const RAW_TEXT_ELEMENTS = new Set(['script', 'style', 'textarea', 'title']);

export type ScannedElement = {
  /** Which annotation attribute matched. */
  attribute: string;
  /** That attribute's value - the slot id, for the slot attributes. */
  value: string;
  tagName: string;
  attributes: Record<string, string>;
  /** Markup between the tags. Empty for a void element. */
  innerHtml: string;
  /** Offsets of the whole element in the source. */
  start: number;
  end: number;
};

/**
 * Parse the attributes out of a start tag's source (everything after the tag
 * name, before the closing `>`).
 */
export function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>`]+)))?/g;

  for (const match of source.matchAll(pattern)) {
    const name = match[1].toLowerCase();

    attributes[name] = match[2] ?? match[3] ?? match[4] ?? '';
  }

  return attributes;
}

/** Index of the `>` ending a start tag, skipping quoted attribute values. */
function endOfStartTag(html: string, from: number): number {
  let quote: string | null = null;

  for (let index = from; index < html.length; index += 1) {
    const char = html[index];

    if (quote) {
      if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === '>') return index;
  }

  return -1;
}

/** Index just past the close tag for a raw-text element, from its content. */
function skipRawText(html: string, from: number, tagName: string): number {
  const close = html.toLowerCase().indexOf(`</${tagName}`, from);

  if (close === -1) return html.length;

  const end = endOfStartTag(html, close);

  return end === -1 ? html.length : end + 1;
}

type OpenElement = {
  tagName: string;
  contentStart: number;
  tagStart: number;
  match?: { attribute: string; value: string };
  attributes: Record<string, string>;
};

/**
 * Every element carrying one of `attributes`, in document order.
 *
 * Nesting is tracked, so an annotated element that contains other elements
 * (a headline with an accent span, a pattern slot wrapping its placeholder)
 * comes back with its markup intact.
 */
export function scanElements(
  html: string,
  attributes: readonly string[]
): ScannedElement[] {
  const wanted = attributes.map((name) => name.toLowerCase());
  const found: ScannedElement[] = [];
  const stack: OpenElement[] = [];
  let index = 0;

  const matchOf = (parsed: Record<string, string>) => {
    for (const name of wanted) {
      if (name in parsed) return { attribute: name, value: parsed[name] };
    }

    return undefined;
  };

  while (index < html.length) {
    const next = html.indexOf('<', index);

    if (next === -1) break;

    // Comments and doctypes carry markup-shaped text that must not be parsed.
    if (html.startsWith('<!--', next)) {
      const close = html.indexOf('-->', next + 4);
      index = close === -1 ? html.length : close + 3;
      continue;
    }

    if (html.startsWith('<!', next)) {
      const close = endOfStartTag(html, next);
      index = close === -1 ? html.length : close + 1;
      continue;
    }

    if (html.startsWith('</', next)) {
      const close = endOfStartTag(html, next);
      const tagName = html
        .slice(next + 2, close === -1 ? html.length : close)
        .trim()
        .toLowerCase();
      const end = close === -1 ? html.length : close + 1;

      // Find the matching open. Walking down rather than requiring the top to
      // match keeps one stray unclosed tag from losing every slot after it.
      for (let depth = stack.length - 1; depth >= 0; depth -= 1) {
        if (stack[depth].tagName !== tagName) continue;

        const open = stack[depth];

        if (open.match) {
          found.push({
            attribute: open.match.attribute,
            value: open.match.value,
            tagName: open.tagName,
            attributes: open.attributes,
            innerHtml: html.slice(open.contentStart, next),
            start: open.tagStart,
            end,
          });
        }

        stack.length = depth;
        break;
      }

      index = end;
      continue;
    }

    const nameMatch = /^<([a-zA-Z][^\s/>]*)/.exec(html.slice(next));

    if (!nameMatch) {
      index = next + 1;
      continue;
    }

    const tagName = nameMatch[1].toLowerCase();
    const close = endOfStartTag(html, next + nameMatch[0].length);

    if (close === -1) break;

    const source = html.slice(next + nameMatch[0].length, close);
    const parsed = parseAttributes(source);
    const match = matchOf(parsed);
    const selfClosing = source.trimEnd().endsWith('/');
    const end = close + 1;

    if (VOID_ELEMENTS.has(tagName) || selfClosing) {
      if (match) {
        found.push({
          attribute: match.attribute,
          value: match.value,
          tagName,
          attributes: parsed,
          innerHtml: '',
          start: next,
          end,
        });
      }

      index = end;
      continue;
    }

    if (RAW_TEXT_ELEMENTS.has(tagName)) {
      index = skipRawText(html, end, tagName);
      continue;
    }

    stack.push({
      tagName,
      contentStart: end,
      tagStart: next,
      match,
      attributes: parsed,
    });

    index = end;
  }

  return found;
}

/**
 * `/images/sites/x.webp?v=ab12cd34` -> `/images/sites/x.webp`.
 *
 * The export cache-busts image URLs with a content hash. A spec records the
 * stable path: the hash changes whenever the file is re-optimised, and a spec
 * that carried it would show a spurious diff on every image rebuild.
 */
export function stripCacheBuster(src: string): string {
  return src.replace(/\?v=[a-z0-9]+$/i, '');
}
