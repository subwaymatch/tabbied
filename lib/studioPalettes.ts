// The palettes the customizer's Colours tab offers, and how a palette of one
// length becomes a palette of another.
//
// A template declares as many roles as its stylesheet reads - a ground and
// anywhere from one to a dozen inks - while a library palette carries three to
// seven colours. So the two cannot simply be assigned across: the roles are
// filled by cycling the library's inks, which keeps the ground the ground and
// spreads the inks evenly rather than running out partway down the page.
//
// Nothing here touches the API. A palette choice is only ever a starting set
// of colours for the edits document; the pencil beside each row opens the same
// per-role editor the rail used to be, so a person is never limited to what
// the library happens to hold.
import { PALETTE_LIBRARY, type LibraryPalette } from './paletteLibrary';

export type PaletteChoice = {
  id: string;
  name: string;
  /** Exactly as many colours as the template has roles, ground first. */
  colors: string[];
};

/** A colour that renders as nothing, so `transparent` must survive a recolour. */
const isTransparent = (value: string): boolean => {
  const colour = value.trim().toLowerCase();

  return colour === 'transparent' || /^#(?:[0-9a-f]{6})00$/.test(colour);
};

/**
 * Fill `roles` positions from `source`, ground first and then the inks in turn.
 *
 * A role the template authored as transparent stays transparent: a pattern
 * field drawn over a photograph reads only because its ground is not painted,
 * and a palette swap that filled it in would cover the picture.
 */
export function fitPalette(source: readonly string[], authored: readonly string[]): string[] {
  const inks = source.slice(1);

  return authored.map((original, index) => {
    if (isTransparent(original)) return original;
    if (index === 0) return source[0] ?? original;

    return inks.length === 0 ? original : inks[(index - 1) % inks.length];
  });
}

const sameColour = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Two palettes are the same palette when every role matches, case aside. */
export const samePalette = (a: readonly string[], b: readonly string[]): boolean =>
  a.length === b.length && a.every((colour, index) => sameColour(colour, b[index] ?? ''));

/**
 * The rows the rail draws: the template's own palette first - it is the one
 * the site was designed in, and the one "Reset palette" goes back to - then
 * the library, fitted to this template's roles.
 */
export function paletteChoices(templateName: string, authored: readonly string[]): PaletteChoice[] {
  const library: LibraryPalette[] = PALETTE_LIBRARY;

  return [
    { id: 'template', name: `${templateName} (template default)`, colors: [...authored] },
    ...library.map((palette) => ({
      id: palette.id,
      name: palette.name,
      colors: fitPalette(palette.colors, authored),
    })),
  ];
}

/** Which row is lit, or null when the colours were edited by hand. */
export function activeChoice(
  choices: readonly PaletteChoice[],
  palette: readonly string[]
): string | null {
  return choices.find((choice) => samePalette(choice.colors, palette))?.id ?? null;
}
