// Turning an edits document into a list of concrete changes.
//
// This is the whole engine, and it deliberately touches no DOM: given a spec
// and an edits document it computes *what* would change, as data. The DOM step
// (apply.ts) is then a short, dull executor.
//
// The split is not ceremony. Everything interesting - validation, palette
// resolution, option ranges, attribute serialization - is here, where it can
// be tested with `node --test` and no browser, and where the site builder can
// call it to preview a change, the packager to write one, and an LLM pipeline
// to check its own output before anyone sees it.

import { isHexColor } from './color.js';
import { propertiesForPalette, resolvePaletteRoles } from './palette.js';
import type { PaletteProperties } from './palette.js';
import type {
  EditsDocument,
  PatternOptionSpec,
  PatternSlot,
  Problem,
  Slot,
  TemplateSpec,
  TextFormat,
} from './spec.js';
import { SPEC_VERSION } from './spec.js';

export type EditOperation =
  | {
      type: 'text';
      id: string;
      value: string;
      format: TextFormat;
      emphasisClass?: string;
    }
  | { type: 'image'; id: string; src: string; alt?: string }
  | {
      type: 'pattern';
      id: string;
      /** Attribute name -> value, or null to remove it. */
      attributes: Record<string, string | null>;
    }
  | { type: 'properties'; properties: PaletteProperties };

export type EditPlan = {
  operations: EditOperation[];
  problems: Problem[];
};

/** Minimum usable palette: a ground plus one ink. */
export const MIN_PALETTE_COLORS = 2;

const error = (path: string, message: string): Problem => ({
  level: 'error',
  path,
  message,
});

const warning = (path: string, message: string): Problem => ({
  level: 'warning',
  path,
  message,
});

const findSlot = (spec: TemplateSpec, id: string): Slot | undefined =>
  spec.slots.find((slot) => slot.id === id);

const serializePalette = (colors: readonly string[]): string =>
  colors.join(', ');

const serializeOptions = (
  options: Record<string, string | number | boolean>
): string =>
  Object.entries(options)
    .filter(([, value]) => value != null)
    .map(([id, value]) => `${id}: ${value}`)
    .join('; ');

/**
 * Check one option value against the range the catalog published for it.
 *
 * Out-of-range is an error rather than a clamp: a slider value outside its
 * bounds means the caller is working from a stale spec or hallucinated the
 * range, and quietly clamping would hide that from an LLM pipeline that could
 * otherwise correct itself.
 */
function checkOption(
  path: string,
  option: PatternOptionSpec,
  value: string | number | boolean
): Problem[] {
  if (option.type === 'ToggleSwitch') {
    return typeof value === 'boolean'
      ? []
      : [error(path, `option "${option.id}" expects a boolean`)];
  }

  if (option.type === 'Slider') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return [error(path, `option "${option.id}" expects a number`)];
    }

    const { min, max } = option;

    if (min != null && value < min) {
      return [error(path, `option "${option.id}" is below its minimum (${min})`)];
    }

    if (max != null && value > max) {
      return [error(path, `option "${option.id}" is above its maximum (${max})`)];
    }

    return [];
  }

  const values = option.values ?? [];

  if (values.length > 0 && !values.includes(String(value))) {
    return [
      error(
        path,
        `option "${option.id}" must be one of: ${values.join(', ')}`
      ),
    ];
  }

  return [];
}

function checkPalette(path: string, colors: unknown): Problem[] {
  if (!Array.isArray(colors)) {
    return [error(path, 'palette must be an array of colours')];
  }

  if (colors.length < MIN_PALETTE_COLORS) {
    return [
      error(
        path,
        `palette needs at least ${MIN_PALETTE_COLORS} colours (a ground and an ink)`
      ),
    ];
  }

  return colors.flatMap((color, index) =>
    isHexColor(color)
      ? []
      : [error(`${path}[${index}]`, `"${String(color)}" is not a hex colour`)]
  );
}

/**
 * Compute every change an edits document implies.
 *
 * Problems and operations are returned together, and an operation is only
 * emitted for an edit that validated: a document with one bad slot id still
 * applies the rest, which is what makes a partially-stale saved project (or a
 * partially-wrong LLM response) recoverable rather than a wall.
 */
export function planEdits(
  spec: TemplateSpec,
  document: EditsDocument
): EditPlan {
  const problems: Problem[] = [];
  const operations: EditOperation[] = [];

  if (document.specVersion !== spec.specVersion) {
    problems.push(
      error(
        'specVersion',
        `edits target spec version ${document.specVersion}, this template is version ${spec.specVersion}`
      )
    );
    return { operations, problems };
  }

  if (document.slug !== spec.site.slug) {
    problems.push(
      error(
        'slug',
        `edits target "${document.slug}" but this template is "${spec.site.slug}"`
      )
    );
    return { operations, problems };
  }

  const edits = document.edits ?? {};

  // ---- palette ------------------------------------------------------------
  // Resolved first because pattern fields re-colour from it, and an explicit
  // per-field palette in the same document has to win over that.
  let paletteColors: string[] | null = null;

  if (edits.palette != null) {
    const paletteProblems = checkPalette('palette', edits.palette);

    problems.push(...paletteProblems);

    if (paletteProblems.length === 0) {
      paletteColors = edits.palette;
      operations.push({
        type: 'properties',
        properties: propertiesForPalette(spec.palette, edits.palette),
      });
    }
  }

  // ---- text ---------------------------------------------------------------
  for (const [id, value] of Object.entries(edits.text ?? {})) {
    const path = `text.${id}`;
    const slot = findSlot(spec, id);

    if (!slot) {
      problems.push(error(path, `no slot "${id}" in this template`));
      continue;
    }

    if (slot.kind !== 'text') {
      problems.push(error(path, `slot "${id}" is a ${slot.kind} slot`));
      continue;
    }

    if (typeof value !== 'string') {
      problems.push(error(path, 'text must be a string'));
      continue;
    }

    // A soft budget, not a rule: the design was set for roughly this much, but
    // it is the user's page and a long headline is their call to make.
    if (slot.maxChars != null && value.length > slot.maxChars) {
      problems.push(
        warning(
          path,
          `${value.length} characters where the design expects about ${slot.maxChars}`
        )
      );
    }

    operations.push({
      type: 'text',
      id,
      value,
      format: slot.format,
      emphasisClass: slot.emphasisClass,
    });
  }

  // ---- images -------------------------------------------------------------
  for (const [id, edit] of Object.entries(edits.images ?? {})) {
    const path = `images.${id}`;
    const slot = findSlot(spec, id);

    if (!slot) {
      problems.push(error(path, `no slot "${id}" in this template`));
      continue;
    }

    if (slot.kind !== 'image') {
      problems.push(error(path, `slot "${id}" is a ${slot.kind} slot`));
      continue;
    }

    if (!edit || typeof edit.src !== 'string' || edit.src.trim() === '') {
      problems.push(error(path, 'an image edit needs a src'));
      continue;
    }

    operations.push({
      type: 'image',
      id,
      src: edit.src,
      alt: edit.alt ?? slot.alt,
    });
  }

  // ---- patterns -----------------------------------------------------------
  // Every pattern slot that re-colours from the brand palette needs an
  // operation when the palette moved, even if the document never mentions it.
  const patternIds = new Set<string>(Object.keys(edits.patterns ?? {}));

  if (paletteColors) {
    for (const slot of spec.slots) {
      if (slot.kind === 'pattern' && slot.paletteRoles) patternIds.add(slot.id);
    }
  }

  for (const id of patternIds) {
    const path = `patterns.${id}`;
    const slot = findSlot(spec, id);

    if (!slot) {
      problems.push(error(path, `no slot "${id}" in this template`));
      continue;
    }

    if (slot.kind !== 'pattern') {
      problems.push(error(path, `slot "${id}" is a ${slot.kind} slot`));
      continue;
    }

    const edit = edits.patterns?.[id] ?? {};
    const attributes: Record<string, string | null> = {};
    const swapped = typeof edit.slug === 'string' && edit.slug !== slot.config.slug;

    if (edit.slug != null) {
      if (typeof edit.slug !== 'string' || edit.slug.trim() === '') {
        problems.push(error(path, 'a design swap needs a slug'));
        continue;
      }

      if (swapped) attributes['data-pattern'] = edit.slug;
    }

    // Palette precedence: an explicit override, else the brand palette through
    // this field's roles, else leave the authored palette alone.
    if (edit.palette != null) {
      const paletteProblems = checkPalette(`${path}.palette`, edit.palette);

      problems.push(...paletteProblems);

      if (paletteProblems.length === 0) {
        attributes['data-palette'] = serializePalette(edit.palette);
      }
    } else if (paletteColors && slot.paletteRoles) {
      attributes['data-palette'] = serializePalette(
        resolvePaletteRoles(slot.paletteRoles, paletteColors)
      );
    }

    if (edit.options != null) {
      const optionProblems: Problem[] = [];

      if (swapped) {
        // The slot's option metadata describes the design being replaced, so
        // there is nothing here to check the new values against. Say so rather
        // than pretending they were validated.
        problems.push(
          warning(
            path,
            'options were not validated: the design was swapped, so this spec has no ranges for them'
          )
        );
      } else {
        for (const [optionId, value] of Object.entries(edit.options)) {
          const option = slot.options?.find(
            (candidate) => candidate.id === optionId
          );

          if (!option) {
            optionProblems.push(
              error(`${path}.options.${optionId}`, `"${slot.config.slug}" has no option "${optionId}"`)
            );
            continue;
          }

          optionProblems.push(
            ...checkOption(`${path}.options.${optionId}`, option, value)
          );
        }
      }

      problems.push(...optionProblems);

      if (optionProblems.length === 0) {
        attributes['data-options'] = serializeOptions(edit.options);
      }
    } else if (swapped) {
      // Option ids belong to the design that declared them; carrying the old
      // design's set onto a new one leaves attributes that quietly do nothing.
      attributes['data-options'] = null;
    }

    if (edit.seed != null) {
      if (typeof edit.seed !== 'string') {
        problems.push(error(`${path}.seed`, 'seed must be a string'));
      } else {
        attributes['data-seed'] = edit.seed;
      }
    }

    if (Object.keys(attributes).length > 0) {
      operations.push({ type: 'pattern', id, attributes });
    }
  }

  return { operations, problems };
}

/** Just the problems - for a caller that wants to check before applying. */
export function validateEdits(
  spec: TemplateSpec,
  document: EditsDocument
): Problem[] {
  return planEdits(spec, document).problems;
}

/**
 * Structural checks on a generated spec.
 *
 * Runs in the build gate (`npm run check:editable`). The failure this exists
 * for is the silent one: a slot that names nothing, or two slots sharing an
 * id, produce a spec that looks fine and an editor whose controls do nothing.
 */
export function validateSpec(spec: TemplateSpec): Problem[] {
  const problems: Problem[] = [];

  if (spec.specVersion !== SPEC_VERSION) {
    problems.push(
      warning(
        'specVersion',
        `spec is version ${spec.specVersion}, this build speaks ${SPEC_VERSION}`
      )
    );
  }

  const seen = new Set<string>();

  for (const slot of spec.slots) {
    if (seen.has(slot.id)) {
      problems.push(error(slot.id, `duplicate slot id "${slot.id}"`));
    }

    seen.add(slot.id);

    if (slot.id.trim() === '') {
      problems.push(error('(unnamed)', 'a slot has an empty id'));
    }
  }

  problems.push(...checkPalette('palette', spec.palette.colors));

  for (const slot of spec.slots) {
    if (slot.kind !== 'pattern' || !slot.paletteRoles) continue;

    for (const [index, role] of slot.paletteRoles.entries()) {
      if (typeof role !== 'number') continue;

      if (!Number.isInteger(role) || role < 0) {
        problems.push(
          error(
            `${slot.id}.paletteRoles[${index}]`,
            `role ${role} is not a palette index`
          )
        );
      }
    }
  }

  return problems;
}

export const hasErrors = (problems: readonly Problem[]): boolean =>
  problems.some((problem) => problem.level === 'error');

export function formatProblems(problems: readonly Problem[]): string {
  return problems
    .map((problem) => `  ${problem.level}: ${problem.path} - ${problem.message}`)
    .join('\n');
}

function isPatternSlotWithRoles(slot: Slot): slot is PatternSlot {
  return slot.kind === 'pattern' && slot.paletteRoles != null;
}

/** Pattern slots that follow the brand palette - the ones a re-colour moves. */
export function recolourablePatternSlots(spec: TemplateSpec): PatternSlot[] {
  return spec.slots.filter(isPatternSlotWithRoles);
}
