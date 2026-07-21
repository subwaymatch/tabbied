// Faithful, dependency-free reimplementation of Tabbied's doodle-source
// pipeline (see packages/tabbied/src/core/doodleSource.ts). Given an artwork
// definition (the real JSON shipped in packages/tabbied/artworks) plus an
// active palette and option values, it emits the exact <style> + <css-doodle>
// pair the Tabbied engine mounts at runtime — so these sample sites render the
// designs the same way tabbied.com does, just baked into static HTML.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTWORK_DIR = path.resolve(__dirname, '../../packages/tabbied/artworks');

export function loadArtwork(slug) {
  const file = path.join(ARTWORK_DIR, `${slug}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// css-doodle >= 0.5 reads @random(1) as a one-cell count; the presets were
// authored for "every cell", so nudge the fully-on case just under 1.
const fixFullRandomGate = (code) =>
  code.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');

const sanitizeCssValue = (value) => String(value).replace(/[{};]/g, '');

// Grow the active palette to the artwork's full slot count by cycling inks.
function expandPalette(colors, totalColors) {
  const expanded = [...colors];
  const inkCount = colors.length - 1;
  while (inkCount > 0 && expanded.length < totalColors) {
    expanded.push(colors[1 + ((expanded.length - 1) % inkCount)]);
  }
  return expanded;
}

function buildDoodleSource({ code, options, palette, optionValues, width, height }) {
  let styleCode = code.style;
  let doodleCode = code.doodle;

  options.forEach((option, index) => {
    switch (option.type) {
      case 'ButtonSelectGroup':
      case 'Slider': {
        const value = sanitizeCssValue(String(optionValues[index]));
        styleCode = styleCode.split(option.replace).join(value);
        doodleCode = doodleCode.split(option.replace).join(value);
        break;
      }
      case 'ToggleSwitch': {
        const snippet = optionValues[index] ? (option.code ?? '') : '';
        styleCode = styleCode.split(option.replace).join(snippet);
        doodleCode = doodleCode.split(option.replace).join(snippet);
        break;
      }
      default:
        break;
    }
  });

  styleCode = styleCode.split('${width}').join(width);
  styleCode = styleCode.split('${height}').join(height);
  doodleCode = doodleCode.split('${width}').join(width);
  doodleCode = doodleCode.split('${height}').join(height);

  styleCode = fixFullRandomGate(styleCode);
  doodleCode = fixFullRandomGate(doodleCode);

  const colorVars = palette
    .map((color, idx) => `--color${idx}: ${sanitizeCssValue(color)};`)
    .join(' ');

  return { styleCode: `${colorVars} ${styleCode}`, doodleCode };
}

let uidCounter = 0;

/**
 * Build the scoped <style> and <css-doodle> markup for one artwork instance.
 *
 * @param {object} cfg
 * @param {string} cfg.slug     artwork slug (a file in packages/tabbied/artworks)
 * @param {string[]} cfg.palette active colors, background (color0) first
 * @param {object} [cfg.options] option-id -> value overrides (e.g. { grid: '8x12' })
 * @param {string} [cfg.seed]   css-doodle seed for a reproducible pattern
 * @returns {{ style: string, element: string, uid: string }}
 */
export function doodle({ slug, palette, options = {}, seed }) {
  const art = loadArtwork(slug);
  const uid = `art${uidCounter++}`;

  const maxColors = art.colors?.max ?? palette.length;
  const active = palette.slice(0, Math.max(maxColors, 1));
  const totalColors = Math.max(maxColors, active.length);
  const expanded = expandPalette(active, totalColors);

  const optionValues = art.options.map((o) => options[o.id] ?? o.default);

  const { styleCode, doodleCode } = buildDoodleSource({
    code: art.code,
    options: art.options,
    palette: expanded,
    optionValues,
    width: '100%',
    height: '100%',
  });

  const seedAttr = seed != null ? ` seed="${seed}"` : '';
  const style = `css-doodle[data-tabbied="${uid}"]{${styleCode}}`;
  const element = `<css-doodle data-tabbied="${uid}" use="var(--rule)"${seedAttr}>${doodleCode}</css-doodle>`;

  return { style, element, uid };
}
