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
 * The inline tags a template may use for its accent run.
 *
 * `<em>` is the house default, but the 52 bespoke pages were written before
 * there was a convention and reach for whichever tag their stylesheet targets
 * - Cobalt Works styles `.hero h1 span`. The accent is therefore a property of
 * the page, read off the markup, never assumed.
 */
export const ACCENT_TAGS = ['em', 'span', 'i', 'b', 'strong', 'mark'] as const;

/**
 * Which tag carries the accent inside an element's inner HTML, if any.
 *
 * `<br>` is skipped: it is a line break in a headline, not an accent. The
 * first remaining inline tag wins, because a slot that holds more than one
 * accent is not a text slot (see htmlToTextValue).
 */
export function accentTagOf(html: string): string | null {
  for (const match of html.matchAll(/<([a-z][a-z0-9]*)\b[^>]*>/gi)) {
    const tag = match[1].toLowerCase();

    if (tag === 'br') continue;

    return (ACCENT_TAGS as readonly string[]).includes(tag) ? tag : null;
  }

  return null;
}

/**
 * Read an annotated element's inner HTML back into a slot value.
 *
 * The generator's side of the contract: the accent tag becomes `{em}...{/em}`
 * so the value round-trips, and every other tag is dropped to its text.
 * Dropping is right rather than lossy-by-accident - a text slot promises "this
 * is text", and anything richer than one accent belongs in a different slot
 * kind.
 *
 * `emphasisTag` is the page's own accent tag. It defaults to `em` so a caller
 * that does not know one behaves exactly as this did before the bespoke pages
 * needed a `<span>`.
 */
export function htmlToTextValue(html: string, emphasisTag = 'em'): string {
  const tag = emphasisTag.toLowerCase();
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  const withMarkers = html.replace(
    pattern,
    (_whole, inner: string) => `{em}${inner}{/em}`
  );

  return decodeEntities(withMarkers.replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}
