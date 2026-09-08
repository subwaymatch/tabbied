// Building a spec out of exported HTML.
//
// Everything the spec says a slot *currently is* comes from here, read off the
// bytes the site actually shipped. Nothing is hand-written, so the spec cannot
// drift from the page - the same reason the download packager derives its HTML
// from the export instead of keeping a second copy of every template.
//
// The annotations carry their own metadata rather than pointing at a sidecar
// file. Five of the template sites share one component, so per-site sidecars
// would have nowhere to live for them, and a label sitting on the element it
// labels is one fewer thing to keep in sync.

import { scanElements, parseAttributes, stripCacheBuster } from './html.js';
import { hasEmphasis, htmlToTextValue } from './text.js';
import { parseCopyRole } from './brand.js';
import {
  EDIT_IMAGE_ATTRIBUTE,
  EDIT_PATTERN_ATTRIBUTE,
  EDIT_ROOT_ATTRIBUTE,
  EDIT_TEXT_ATTRIBUTE,
} from './spec.js';
import type {
  ImageSlot,
  PaletteDerivation,
  PaletteRole,
  PatternOptionSpec,
  PatternSlot,
  PatternSlotConfig,
  Slot,
  TextFormat,
  TextSlot,
} from './spec.js';

/** Optional annotations, all of them on the same element as the slot id. */
export const FORMAT_ATTRIBUTE = 'data-edit-format';
export const MAX_ATTRIBUTE = 'data-edit-max';
export const MULTILINE_ATTRIBUTE = 'data-edit-multiline';
export const LABEL_ATTRIBUTE = 'data-edit-label';
/** Names the brand-copy role a text slot holds. See brand.ts. */
export const COPY_ATTRIBUTE = 'data-edit-copy';
export const ROLES_ATTRIBUTE = 'data-edit-roles';
export const FLAT_ATTRIBUTE = 'data-edit-flat';
/** `vars` roots only: the page's own custom-property names, in role order. */
export const VARS_ATTRIBUTE = 'data-edit-vars';

export type ExtractOptions = {
  /**
   * Option metadata for a design, from the catalog. Without it a pattern slot
   * still extracts - it just carries no ranges, so an editor can offer a seed
   * and a palette but not typed controls.
   */
  designOptions?: (slug: string) => PatternOptionSpec[] | undefined;
};

// Values are joined with a separator and split back out, so the split has to
// survive a CSS colour carrying its own commas - `rgb(0, 0, 0)`. Same rule as
// the pattern hydration contract this reads.
function splitTopLevel(value: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';

  for (const char of value) {
    if (char === '(') depth += 1;
    else if (char === ')') depth = Math.max(0, depth - 1);

    if (char === separator && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  parts.push(current);

  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
}

const numberOr = (value: string | undefined): number | undefined => {
  if (value == null || value.trim() === '') return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

/** Prettify `hero.title` as "Hero title" for a control with no authored label. */
export function labelFromId(id: string): string {
  const words = id
    .split('.')
    .join(' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim();

  return words.charAt(0).toUpperCase() + words.slice(1);
}

function coerceOptionValue(
  option: PatternOptionSpec | undefined,
  raw: string
): string | number | boolean | undefined {
  if (!option) return raw;

  if (option.type === 'ToggleSwitch') {
    if (raw === 'true' || raw === '') return true;
    if (raw === 'false') return false;
    return undefined;
  }

  if (option.type === 'Slider') {
    if (raw === '') return undefined;

    const value = Number(raw);

    return Number.isFinite(value) ? value : undefined;
  }

  return raw;
}

function parsePatternConfig(
  attributes: Record<string, string>,
  optionSpecs: PatternOptionSpec[] | undefined
): PatternSlotConfig {
  const config: PatternSlotConfig = { slug: attributes['data-pattern'] };

  const palette = attributes['data-palette'];
  if (palette) config.palette = splitTopLevel(palette, ',');

  const seed = attributes['data-seed'];
  if (seed) config.seed = seed;

  const fit = attributes['data-fit'];
  if (fit) config.fit = fit;

  const cellSize = numberOr(attributes['data-cell-size']);
  if (cellSize != null) config.cellSize = cellSize;

  const density = numberOr(attributes['data-density']);
  if (density != null) config.density = density;

  const redrawInterval = numberOr(attributes['data-redraw-interval']);
  if (redrawInterval != null) config.redrawInterval = redrawInterval;

  const options = attributes['data-options'];

  if (options) {
    const values: Record<string, string | number | boolean> = {};

    for (const entry of splitTopLevel(options, ';')) {
      const separator = entry.indexOf(':');
      const id = (separator === -1 ? entry : entry.slice(0, separator)).trim();
      const raw = separator === -1 ? '' : entry.slice(separator + 1).trim();
      const value = coerceOptionValue(
        optionSpecs?.find((candidate) => candidate.id === id),
        raw
      );

      if (value !== undefined) values[id] = value;
    }

    if (Object.keys(values).length > 0) config.options = values;
  }

  return config;
}

/** `transparent,1,3` -> `['transparent', 1, 3]`. */
export function parsePaletteRoles(value: string): PaletteRole[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => (/^\d+$/.test(part) ? Number(part) : part));
}

function textSlotFrom(
  id: string,
  attributes: Record<string, string>,
  innerHtml: string
): TextSlot {
  const format: TextFormat =
    attributes[FORMAT_ATTRIBUTE] === 'emphasis' ? 'emphasis' : 'plain';
  const value = htmlToTextValue(innerHtml);
  const slot: TextSlot = {
    id,
    kind: 'text',
    value: format === 'emphasis' ? value : value.replace(/\{\/?em\}/g, ''),
    format,
  };

  const label = attributes[LABEL_ATTRIBUTE];
  if (label) slot.label = label;

  const role = parseCopyRole(attributes[COPY_ATTRIBUTE]);
  if (role) slot.role = role;

  const maxChars = numberOr(attributes[MAX_ATTRIBUTE]);
  if (maxChars != null) slot.maxChars = maxChars;

  if (MULTILINE_ATTRIBUTE in attributes) slot.multiline = true;

  // The accent's class name is hashed in the export and rewritten again in the
  // download package, so it can only be learned from the markup in hand.
  if (format === 'emphasis' && hasEmphasis(value)) {
    const em = /<em\b([^>]*)>/i.exec(innerHtml);
    const className = em ? parseAttributes(em[1])['class'] : undefined;

    if (className) slot.emphasisClass = className;
  }

  return slot;
}

function imageSlotFrom(
  id: string,
  tagName: string,
  attributes: Record<string, string>,
  innerHtml: string
): ImageSlot | null {
  let imageAttributes = attributes;

  if (tagName !== 'img') {
    const match = /<img\b([^>]*)>/i.exec(innerHtml);

    if (!match) return null;

    imageAttributes = parseAttributes(match[1]);
  }

  const slot: ImageSlot = {
    id,
    kind: 'image',
    src: stripCacheBuster(imageAttributes['src'] ?? ''),
    alt: imageAttributes['alt'] ?? '',
  };

  const width = numberOr(imageAttributes['width']);
  if (width != null) slot.width = width;

  const height = numberOr(imageAttributes['height']);
  if (height != null) slot.height = height;

  // The image pipeline already records its prompt on the figure it generated;
  // carrying it into the spec is what lets a regenerate-this-image affordance
  // start from what was actually asked for.
  const prompt = attributes['data-image-prompt'];
  if (prompt) slot.prompt = prompt;

  const label = attributes[LABEL_ATTRIBUTE];
  if (label) slot.label = label;

  return slot;
}

function patternSlotFrom(
  id: string,
  tagName: string,
  attributes: Record<string, string>,
  innerHtml: string,
  options: ExtractOptions
): PatternSlot | null {
  let hostAttributes: Record<string, string> | null = null;

  if ('data-pattern' in attributes) {
    hostAttributes = attributes;
  } else {
    const match = /<[a-zA-Z][^>]*\bdata-pattern=[^>]*>/i.exec(innerHtml);

    if (match) {
      const inner = /^<[a-zA-Z][^\s/>]*([\s\S]*)$/.exec(match[0]);
      hostAttributes = inner ? parseAttributes(inner[1]) : null;
    }
  }

  if (!hostAttributes || !hostAttributes['data-pattern']) return null;

  const slug = hostAttributes['data-pattern'];
  const optionSpecs = options.designOptions?.(slug);
  const slot: PatternSlot = {
    id,
    kind: 'pattern',
    config: parsePatternConfig(hostAttributes, optionSpecs),
  };

  const roles = attributes[ROLES_ATTRIBUTE];
  if (roles) slot.paletteRoles = parsePaletteRoles(roles);

  if (optionSpecs && optionSpecs.length > 0) slot.options = optionSpecs;

  const label = attributes[LABEL_ATTRIBUTE];
  if (label) slot.label = label;

  return slot;
}

export type ExtractedRoot = {
  derivation: PaletteDerivation;
  flatSections?: boolean;
  /** `vars` roots: the property names role 0 upward write to. */
  varNames?: string[];
  /**
   * The brand palette, read back off the root's inline `--brand-*` properties.
   *
   * Taking the colours from the page rather than from the module that rendered
   * it is the same discipline as the rest of this file: a spec that sourced its
   * palette separately could disagree with what shipped, and nothing would say
   * so.
   */
  colors: string[];
};

export type ExtractResult = {
  slots: Slot[];
  /** The page root's palette derivation, when it declares one. */
  root: ExtractedRoot | null;
  /** Annotations that named nothing usable - the build gate reports these. */
  problems: string[];
};

/** Read named custom properties out of an inline style, in the order asked. */
export function parseNamedColors(
  style: string,
  names: readonly string[]
): string[] {
  const colors: string[] = [];

  for (const name of names) {
    const match = new RegExp(`--${name}\\s*:\\s*([^;]+)`).exec(style);

    // Stop at the first name the page does not actually set: a gap would
    // renumber every role after it, so role 2 in a saved edits document would
    // land on a different colour than the page it was made from.
    if (!match) break;

    colors.push(match[1].trim());
  }

  return colors;
}

/** `--brand-0:#F5F1E8;--brand-1:#2E2A25` -> the ordered palette. */
export function parseBrandColors(style: string): string[] {
  const found = new Map<number, string>();

  for (const match of style.matchAll(/--brand-(\d+)\s*:\s*([^;]+)/g)) {
    found.set(Number(match[1]), match[2].trim());
  }

  const colors: string[] = [];

  // Contiguous from role 0: a gap means the page and the spec would disagree
  // about which index is which ink, so stop rather than compact them.
  for (let index = 0; found.has(index); index += 1) {
    colors.push(found.get(index) as string);
  }

  return colors;
}

/**
 * Read every annotated slot out of a page.
 *
 * An annotation that resolves to nothing (an image slot with no `<img>`, a
 * pattern slot with no placeholder) is reported rather than skipped: a slot
 * that silently vanishes is exactly the failure mode that let 278 dead gallery
 * thumbnail configs accumulate, and the cure was the same - a build gate that
 * fails on one.
 */
export function extractFromHtml(
  html: string,
  options: ExtractOptions = {}
): ExtractResult {
  const scanned = scanElements(html, [
    EDIT_TEXT_ATTRIBUTE,
    EDIT_IMAGE_ATTRIBUTE,
    EDIT_PATTERN_ATTRIBUTE,
    EDIT_ROOT_ATTRIBUTE,
  ]);

  const slots: Slot[] = [];
  const problems: string[] = [];
  let root: ExtractResult['root'] = null;

  for (const element of scanned) {
    const { attribute, value: id, attributes, innerHtml, tagName } = element;

    if (attribute === EDIT_ROOT_ATTRIBUTE) {
      const derivation: PaletteDerivation =
        id === 'templateSite' || id === 'vars' ? id : 'direct';
      const style = attributes['style'] ?? '';
      const varNames =
        derivation === 'vars'
          ? (attributes[VARS_ATTRIBUTE] ?? '')
              .split(',')
              .map((name) => name.trim())
              .filter((name) => name.length > 0)
          : [];

      root = {
        derivation,
        ...(FLAT_ATTRIBUTE in attributes ? { flatSections: true } : {}),
        ...(derivation === 'vars' ? { varNames } : {}),
        colors:
          derivation === 'vars'
            ? parseNamedColors(style, varNames)
            : parseBrandColors(style),
      };
      continue;
    }

    if (id.trim() === '') {
      problems.push(`${attribute} with an empty id on <${tagName}>`);
      continue;
    }

    if (attribute === EDIT_TEXT_ATTRIBUTE) {
      slots.push(textSlotFrom(id, attributes, innerHtml));
      continue;
    }

    if (attribute === EDIT_IMAGE_ATTRIBUTE) {
      const slot = imageSlotFrom(id, tagName, attributes, innerHtml);

      if (slot) slots.push(slot);
      else problems.push(`image slot "${id}" contains no <img>`);

      continue;
    }

    if (attribute === EDIT_PATTERN_ATTRIBUTE) {
      const slot = patternSlotFrom(id, tagName, attributes, innerHtml, options);

      if (slot) slots.push(slot);
      else problems.push(`pattern slot "${id}" contains no [data-pattern] host`);
    }
  }

  return { slots: dedupe(slots, problems), root, problems };
}

/** What a repeated slot must agree on for one value to describe all of them. */
function sameContent(a: Slot, b: Slot): boolean {
  if (a.kind === 'text' && b.kind === 'text') return a.value === b.value;
  if (a.kind === 'image' && b.kind === 'image') return a.src === b.src;
  if (a.kind === 'pattern' && b.kind === 'pattern') {
    return (
      a.config.slug === b.config.slug &&
      (a.config.palette ?? []).join() === (b.config.palette ?? []).join()
    );
  }

  return false;
}

/**
 * Collapse repeats of one id into a single slot.
 *
 * A slot is a piece of content, and content repeats: the brand name is in the
 * masthead and again in the footer. Applying an edit reaches every element
 * carrying the id, so the spec needs one entry - but only if they currently
 * agree. Two elements sharing an id while saying different things is a real
 * authoring bug: whichever value the spec recorded, the first edit would make
 * the other one change to match, silently.
 */
function dedupe(slots: Slot[], problems: string[]): Slot[] {
  const byId = new Map<string, Slot>();
  const unique: Slot[] = [];

  for (const slot of slots) {
    const existing = byId.get(slot.id);

    if (!existing) {
      byId.set(slot.id, slot);
      unique.push(slot);
      continue;
    }

    if (existing.kind !== slot.kind) {
      problems.push(
        `slot "${slot.id}" is used for both a ${existing.kind} and a ${slot.kind}`
      );
      continue;
    }

    if (!sameContent(existing, slot)) {
      problems.push(
        `slot "${slot.id}" repeats with different content, so one value cannot describe both`
      );
    }
  }

  return unique;
}
