// The `{em}...{/em}` convention for accented text.
//
// The template sites mark one span of a headline as an accent - Tabbied's
// house move, styled per site. It has to survive editing: if a headline slot
// were plain text, the first person to change "Homes that {em}hold your
// life{/em}." would silently lose the accent the design was built around.
//
// So the *value* carries the markers, and both renderers parse them: the React
// component (building elements) and applyEdits (building DOM nodes on a page
// with no React). One parser, two renderers, no drift.

export type TextSegment = {
  text: string;
  emphasis: boolean;
};

const EMPHASIS_PATTERN = /\{em\}([\s\S]*?)\{\/em\}/g;

/**
 * Split a value into plain and accented runs.
 *
 * An unclosed `{em}` is not an error - it is somebody halfway through typing -
 * so it stays literal text rather than swallowing the rest of the headline.
 */
export function parseEmphasis(value: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let index = 0;

  EMPHASIS_PATTERN.lastIndex = 0;

  for (const match of value.matchAll(EMPHASIS_PATTERN)) {
    const start = match.index ?? 0;

    if (start > index) {
      segments.push({ text: value.slice(index, start), emphasis: false });
    }

    if (match[1].length > 0) segments.push({ text: match[1], emphasis: true });

    index = start + match[0].length;
  }

  if (index < value.length) {
    segments.push({ text: value.slice(index), emphasis: false });
  }

  return segments;
}

/** The value with its markers removed - what the page reads as. */
export function stripEmphasis(value: string): string {
  return parseEmphasis(value)
    .map((segment) => segment.text)
    .join('');
}

/** Whether a value carries an accent at all. */
export function hasEmphasis(value: string): boolean {
  return parseEmphasis(value).some((segment) => segment.emphasis);
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
  '#39': "'",
  '#x27': "'",
  '#8217': '\u2019',
};

/**
 * Decode the entity subset a static export actually emits.
 *
 * Deliberately small: this reads back markup this repo generated, not
 * arbitrary HTML, and a full entity table would be dead weight in a package
 * that also ships to the browser. Numeric escapes are handled generically so
 * the table only needs the named ones.
 */
export function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, name: string) => {
    const key = name.toLowerCase();

    if (key in ENTITIES) return ENTITIES[key];

    if (key.startsWith('#x')) {
      const code = Number.parseInt(key.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }

    if (key.startsWith('#')) {
      const code = Number.parseInt(key.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }

    return whole;
  });
}

/**
 * Read an annotated element's inner HTML back into a slot value.
 *
 * The generator's side of the contract: an `<em>` becomes `{em}...{/em}` so the
 * value round-trips, and every other tag is dropped to its text. Dropping is
 * right rather than lossy-by-accident - a text slot promises "this is text",
 * and anything richer than one accent belongs in a different slot kind.
 */
export function htmlToTextValue(html: string): string {
  const withMarkers = html.replace(
    /<em\b[^>]*>([\s\S]*?)<\/em>/gi,
    (_whole, inner: string) => `{em}${inner}{/em}`
  );

  return decodeEntities(withMarkers.replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}
