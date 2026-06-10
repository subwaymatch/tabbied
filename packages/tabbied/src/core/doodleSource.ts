// Shared helper for turning an artwork definition into concrete css-doodle
// source. Used by the artwork controller, the Tabbied editor and the gallery
// thumbnails so the substitution rules stay in one place.
import type { ArtworkOption, OptionValue } from './types.js';

// css-doodle >= 0.5 reads `@random(1)` as a one-cell count rather than a 100%
// probability gate (fractional values still behave as probabilities). The
// artwork definitions were authored against css-doodle 0.12 where `@random(1)`
// meant "every cell", so nudge the fully-on case just under 1 to preserve the
// original look at maximum frequency.
export const fixFullRandomGate = (code: string): string =>
  code.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');

const getColorsStyleCode = (colors: string[]): string =>
  colors.map((color, idx) => `--color${idx}: ${color};\n`).join('');

// Grow an active palette up to the artwork's full slot count by cycling its
// ink colors (everything after the color0 background). Artwork styles always
// reference colors up to `max - 1`, so when fewer colors are active the unused
// slots have to resolve to something — aliasing them back into the active inks
// redraws the design with the reduced palette instead of leaving gaps.
export const expandPalette = (
  colors: string[],
  totalColors: number
): string[] => {
  const expanded = [...colors];
  const inkCount = colors.length - 1;

  while (inkCount > 0 && expanded.length < totalColors) {
    expanded.push(colors[1 + ((expanded.length - 1) % inkCount)]);
  }

  return expanded;
};

export type DoodleSourceInput = {
  code: { style: string; doodle: string };
  options: ArtworkOption[];
  palette: string[];
  optionValues: OptionValue[];
  /** Canvas size as CSS lengths, e.g. "360px" / "100%". */
  width: string;
  height: string;
};

// Build the css-doodle style + rules for an artwork by substituting its option
// placeholders, canvas size and palette. The generated pattern depends only on
// the seed and grid, so the same inputs render identically at any size.
export function buildDoodleSource({
  code,
  options,
  palette,
  optionValues,
  width,
  height,
}: DoodleSourceInput): { styleCode: string; doodleCode: string } {
  let styleCode = code.style;
  let doodleCode = code.doodle;

  options.forEach((option, index) => {
    switch (option.type) {
      case 'ButtonSelectGroup':
      case 'Slider':
        styleCode = styleCode
          .split(option.replace)
          .join(String(optionValues[index]));
        doodleCode = doodleCode
          .split(option.replace)
          .join(String(optionValues[index]));
        break;
      case 'ToggleSwitch':
        if (optionValues[index]) {
          styleCode = styleCode.split(option.replace).join(option.code ?? '');
          doodleCode = doodleCode
            .split(option.replace)
            .join(String(optionValues[index]));
        } else {
          styleCode = styleCode.split(option.replace).join('');
          doodleCode = doodleCode.split(option.replace).join('');
        }
        break;
      default:
        break;
    }
  });

  doodleCode = doodleCode.split('${width}').join(width);
  doodleCode = doodleCode.split('${height}').join(height);

  styleCode = fixFullRandomGate(styleCode);
  doodleCode = fixFullRandomGate(doodleCode);

  styleCode = getColorsStyleCode(palette) + styleCode;

  return { styleCode, doodleCode };
}
