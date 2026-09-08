import { contrastRatio, isHexColor, mix, onColor } from 'tabbied-templates';

// The palette is the one field the model genuinely authors, so it is the one
// field that gets validated and repaired rather than trusted.
//
// The two rules are the palette library's own, not new ones invented here: no
// ink may equal its background, and at least one ink must clear ~3:1 against
// colour 0. A palette that fails is *repaired* deterministically - one pass,
// nudging the nearest ink away from the ground - and only a palette repair
// cannot save is discarded for the template's authored one. Regenerating
// instead would spend money to re-roll dice we can simply load.

/** The contrast an ink needs against the background to count as legible. */
const MIN_CONTRAST = 3;

/** How far a repair is allowed to travel before it is a different colour. */
const MAX_REPAIR_STEPS = 8;
const REPAIR_STEP = 0.12;

export type PaletteVerdict = {
  colors: string[];
  /** 'clean' - as authored; 'repaired' - nudged; 'rejected' - unusable. */
  status: 'clean' | 'repaired' | 'rejected';
};

/**
 * Lowercase, and expand `#abc` to `#aabbcc`. Shorthand is a perfectly valid
 * colour - `isHexColor` accepts it and `toRgb` reads it - but everything
 * downstream stores and renders the six-digit form, so it is expanded here
 * rather than left for each consumer to handle differently.
 */
function normalise(hex: string): string {
  const value = hex.trim().toLowerCase();

  return value.length === 4
    ? `#${value
        .slice(1)
        .split('')
        .map((char) => char + char)
        .join('')}`
    : value;
}

/**
 * Push `ink` away from `background` until it clears MIN_CONTRAST, by mixing it
 * toward whichever of black/white the background is not. Returns null when the
 * ink cannot get there - which happens for a colour already at the far end.
 */
function repairInk(ink: string, background: string): string | null {
  const target = onColor(background);
  let candidate = ink;

  for (let step = 1; step <= MAX_REPAIR_STEPS; step++) {
    candidate = mix(candidate, target, REPAIR_STEP);

    if (contrastRatio(candidate, background) >= MIN_CONTRAST) {
      return candidate;
    }
  }

  return null;
}

/**
 * Validate a model-authored palette against the library's rules, repairing what
 * can be repaired. `fallback` is the template site's own palette - always a
 * valid one, since it shipped.
 */
export function ensurePalette(
  proposed: unknown,
  fallback: string[]
): PaletteVerdict {
  if (!Array.isArray(proposed) || proposed.length < 2) {
    return { colors: fallback, status: 'rejected' };
  }

  const colors = proposed.map((value) =>
    typeof value === 'string' ? normalise(value) : ''
  );

  if (!colors.every(isHexColor)) {
    return { colors: fallback, status: 'rejected' };
  }

  const [background, ...inks] = colors;

  // Rule one: an ink equal to the ground is invisible, and no amount of
  // contrast elsewhere makes that field readable.
  const distinct = inks.filter((ink) => ink !== background);

  if (distinct.length === 0) {
    return { colors: fallback, status: 'rejected' };
  }

  // Rule two: something has to be legible on the ground. If nothing is, repair
  // the closest candidate rather than the first - the smallest edit that fixes
  // the palette is the one that keeps it the palette the model chose.
  if (distinct.some((ink) => contrastRatio(ink, background) >= MIN_CONTRAST)) {
    return { colors: [background, ...distinct], status: 'clean' };
  }

  const best = distinct.reduce((a, b) =>
    contrastRatio(b, background) > contrastRatio(a, background) ? b : a
  );
  const repaired = repairInk(best, background);

  if (!repaired) {
    return { colors: fallback, status: 'rejected' };
  }

  return {
    colors: [background, ...distinct.map((ink) => (ink === best ? repaired : ink))],
    status: 'repaired',
  };
}
