// Colour maths for palette derivation.
//
// These were the private helpers at the top of components/template/TemplateSite.tsx.
// They moved here because a re-colour has to happen in two places that must
// agree exactly: the React component rendering the live page, and applyEdits()
// rewriting a page it has no React in. Two copies of a luminance threshold is
// the kind of drift that shows up as one download package whose body text is
// the wrong ink.

export type Rgb = [number, number, number];

export function toRgb(hex: string): Rgb {
  let value = hex.replace('#', '').trim();

  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const n = Number.parseInt(value, 16);

  if (!Number.isFinite(n)) return [0, 0, 0];

  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Relative luminance, per WCAG. */
export function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colours, 1..21. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];

  return (light + 0.05) / (dark + 0.05);
}

/**
 * Blend two colours, returning `rgb(...)`.
 *
 * Deliberately not hex: these feed CSS custom properties, and keeping them as
 * rgb() makes a derived value obvious when reading the DOM in devtools - it is
 * never mistaken for one of the brand hexes.
 */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  const channel = (x: number, y: number) => Math.round(x + (y - x) * t);

  return `rgb(${channel(ar, br)}, ${channel(ag, bg)}, ${channel(ab, bb)})`;
}

/** Legible text colour to sit on a filled swatch. */
export function onColor(hex: string): string {
  return luminance(hex) < 0.55 ? '#ffffff' : '#151515';
}

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && HEX_COLOR.test(value.trim());
