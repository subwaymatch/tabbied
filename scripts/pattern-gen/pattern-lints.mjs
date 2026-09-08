// Authoring-time lints shared by the batch generators that promise a clean
// SVG export (batches 11 and 12).
//
// Two groups of rules live here:
//
//   * the *house* rules every batch since 6 has been checked against - one
//     frequency gate, a transitionable ink per cell, no plain var() re-rolls,
//     nothing painted in the background colour;
//   * the *SVG* rules that keep a design in tier 4 of docs/svg-export.md - no
//     declaration that exports as an SVG filter, no smooth conic sweep, no
//     border on a partially-rounded box.
//
// These are the cheap first pass. The real gate is running the shipped
// converter over every rendered design (validate-svg-batch11.mjs /
// validate-svg-batch12.mjs); this file exists to catch at authoring time the
// mistakes that would otherwise cost a browser launch to find.

// Declarations that would cost a design the clean SVG-export tier. Each maps
// to a tier-2 caveat in docs/svg-export.md, which these batches exist not to
// have.
export const SVG_BANNED = [
  [/box-shadow\s*:/, 'box-shadow exports as an SVG drop-shadow filter'],
  [/(^|[^-\w])filter\s*:/, 'filter() exports as an SVG filter primitive'],
  [/mix-blend-mode\s*:/, 'mix-blend-mode exports as an SVG blend style'],
  [/backdrop-filter\s*:/, 'backdrop-filter has no SVG equivalent'],
  [/repeating-conic-gradient/, 'the converter rejects repeating-conic-gradient'],
  [/@doodle\s*\(/, 'nested @doodle images deviate from the live render'],
  [/@svg\s*\(/, '@svg payloads rasterize with different sub-pixel rounding'],
  [/text-shadow\s*:/, 'text-shadow has no clean SVG mapping here'],
];

const angleOf = (token) => {
  const m = /^(-?[\d.]+)(deg|turn|grad|rad)?$/.exec(token);
  if (!m) return token;
  const n = parseFloat(m[1]);
  switch (m[2]) {
    case 'turn':
      return n * 360;
    case 'grad':
      return n * 0.9;
    case 'rad':
      return (n * 180) / Math.PI;
    default:
      return n;
  }
};

/** Split on whitespace, but not inside parentheses. */
const splitTokens = (text) => {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of text) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) {
      if (current) out.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  if (current) out.push(current);
  return out;
};

/**
 * A conic-gradient span whose endpoints differ in colour is a smooth angular
 * sweep - SVG has no angular gradient, and the converter throws on one. Only
 * hard stops are allowed: wherever the colour changes, the two stops must sit
 * at the same angle.
 *
 * Every stop is flattened to (colour, angle) pairs first, so the two-position
 * shorthand `#000 0 42deg` is compared the same way a pair of stops would be.
 * Positions that are still css-doodle expressions (`@calc(20 + 310 * @y / @Y)deg`)
 * stay strings and compare textually: two stops written from the same
 * expression resolve to the same angle in every cell, which is all a hard stop
 * requires.
 */
export const assertHardStopConic = (slug, style) => {
  for (const m of style.matchAll(
    /conic-gradient\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g
  )) {
    const parts = m[1].split(',').map((s) => s.trim());
    // Drop the leading `from <angle>` / `at <position>` clause.
    if (/^(from|at)\b/.test(parts[0])) parts.shift();
    const flat = [];
    for (const part of parts) {
      if (!part) continue;
      const [color, ...positions] = splitTokens(part);
      if (!positions.length) {
        flat.push({ color, pos: null });
        continue;
      }
      for (const pos of positions) flat.push({ color, pos: angleOf(pos) });
    }
    // CSS clamps each stop position up to the largest one before it, which is
    // what makes `transparent 0` after a 90deg stop a hard stop rather than a
    // backwards sweep. Model that before comparing - for the numeric ones;
    // an unresolved expression is only ever compared against itself.
    let high = -Infinity;
    for (const stop of flat) {
      if (typeof stop.pos !== 'number') continue;
      stop.pos = Math.max(stop.pos, high);
      high = stop.pos;
    }
    for (let i = 1; i < flat.length; i++) {
      const a = flat[i - 1];
      const b = flat[i];
      if (a.color === b.color) continue;
      if (a.pos === null || b.pos === null || a.pos !== b.pos) {
        throw new Error(
          `${slug}: conic-gradient sweeps smoothly from ${a.color} to ${b.color} - SVG has no angular gradient`
        );
      }
    }
  }
};

/**
 * Everything a design must satisfy before it is written out. Throws on the
 * first violation with a message that names the design and the rule.
 *
 * @param {{slug: string, style: string, doodle: string, options: Array,
 *          palette: string[], colors: {max: number}, batch: string}} design
 */
export function lintPattern({ slug, style, doodle, options, palette, colors, batch }) {
  // Sanity: every ${placeholder} in the code must be replaced by some option.
  const placeholders = new Set(
    [...`${style} ${doodle}`.matchAll(/\$\{(\w+)\}/g)].map((m) => m[1])
  );
  placeholders.delete('width');
  placeholders.delete('height');
  for (const ph of placeholders) {
    if (!options.some((o) => o.replace === '${' + ph + '}')) {
      throw new Error(`${slug}: placeholder \${${ph}} has no option`);
    }
  }
  for (const o of options) {
    const name = o.replace.slice(2, -1);
    if (!placeholders.has(name)) {
      throw new Error(`${slug}: option ${o.id} (${o.replace}) unused`);
    }
  }
  // Lint: a custom property whose value contains @-functions is a textual
  // macro - every plain var(--x) reference re-rolls it. Shared rolls must be
  // emitted per cell and referenced via @var(--x) instead.
  const propDefs = [...style.matchAll(/(--[\w-]+)\s*:\s*([^;]*);/g)];
  for (const [, propName, propValue] of propDefs) {
    if (/--color\d/.test(propName)) continue;
    if (!/@(p|pick|r|rand|pd|pick-d|pn|pick-n)\b/i.test(propValue)) continue;
    const plainRefs = [
      ...style.matchAll(new RegExp(`(?<!@)var\\(${propName}\\)`, 'g')),
    ].length;
    if (plainRefs > 1) {
      throw new Error(
        `${slug}: randomized ${propName} referenced ${plainRefs}x via plain var() - re-rolls per reference; use a cell-level prop + @var()`
      );
    }
  }
  // Painting var(--color0) only *looks* like a knockout while the background
  // is opaque. Cut the shape instead (clip-path hole, mask, or a gap).
  if (/var\(\s*--color0\s*\)/.test(style)) {
    throw new Error(
      `${slug}: style paints var(--color0) - that knockout disappears on a transparent background`
    );
  }
  // Exactly one frequency gate, so the slider always thins the whole field.
  const gateCount = (style.match(/@random\(\$\{shapeFrequency\}\)/g) ?? []).length;
  if (gateCount !== 1) {
    throw new Error(
      `${slug}: expected exactly one @random(\${shapeFrequency}) gate, found ${gateCount}`
    );
  }
  // The tier-4 rule: nothing that would need an svgExportNote.
  for (const [pattern, why] of SVG_BANNED) {
    if (pattern.test(style)) {
      throw new Error(`${slug}: ${why} - ${batch} exports clean or not at all`);
    }
  }
  assertHardStopConic(slug, style);
  // A border on a partially-rounded box makes the converter throw. Borders go
  // on square boxes or on full circles (border-radius: 50%), never between.
  const boxes = style.split(/(?=:before|:after)/);
  for (const box of boxes) {
    if (!/border(-(top|right|bottom|left))?(-width)?\s*:/.test(box)) continue;
    const radii = [...box.matchAll(/border-radius\s*:\s*([^;]+);/g)].map((m) =>
      m[1].trim()
    );
    for (const radius of radii) {
      if (!/^(50%|0|0%|none)$/.test(radius)) {
        throw new Error(
          `${slug}: a border on a partially-rounded box (${radius}) fails SVG export`
        );
      }
    }
  }

  // Sanity: balanced parens in the rule.
  let depth = 0;
  for (const ch of style) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth < 0) throw new Error(`${slug}: unbalanced parens`);
  }
  if (depth !== 0) throw new Error(`${slug}: unbalanced parens`);
  if (palette.length !== colors.max) {
    throw new Error(`${slug}: palette length != colors.max`);
  }
  if (!/transition/.test(style)) {
    throw new Error(`${slug}: no transition in style`);
  }
  // Every design must sample an ink that CSS can transition, so a reseed
  // morphs instead of snapping. background-image alone does not transition.
  if (!/(background|border)(-[a-z]+)?\s*:\s*[^;]*@p(ick)?\(/.test(style)) {
    throw new Error(
      `${slug}: no per-cell randomized background/border ink - a reseed would snap`
    );
  }
}
