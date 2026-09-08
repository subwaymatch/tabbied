// Declarative mounting: read a pattern's config off a plain DOM element's
// data-* attributes and bring it to life.
//
// This is what turns a prerendered page into a standalone, framework-free
// template. The React component writes the same attributes onto its
// placeholder (see patternConfigToAttributes), so a static export already
// carries everything needed to re-mount its patterns without React, an RSC
// payload, or a build step:
//
//   <div data-pattern="ortho"
//        data-palette="transparent, #C9C8C1, #8E8E88"
//        data-fit="grid"
//        data-redraw-interval="5200"></div>
//
//   <script type="module">
//     import { hydratePatterns } from 'tabbied';
//     import { patterns } from 'tabbied/patterns';
//     hydratePatterns({ patterns });
//   </script>
//
// The attributes are deliberately readable rather than a JSON blob: somebody
// editing a downloaded template should be able to change a colour or a slug
// in the markup without decoding anything.
import { createPattern } from './createPattern.js';
import type { PatternConfig, PatternController } from './createPattern.js';
import { FIT_MODES } from './sizing.js';
import type { CoverRender } from './sizing.js';
import type {
  PatternDefinition,
  PatternOption,
  FitMode,
  OptionValue,
} from './types.js';

/** The data-* attribute an element must carry to be hydrated. */
export const PATTERN_ATTRIBUTE = 'data-pattern';

/** Default selector for hydratePatterns(). */
export const PATTERN_SELECTOR = `[${PATTERN_ATTRIBUTE}]`;

/**
 * Serialized form of a PatternConfig: every value a string, keyed by the
 * data-* attribute name it belongs on. `pattern` carries the slug.
 */
export type PatternAttributes = Record<string, string>;

/** A hydrated element and the controller now driving it. */
export type HydratedPattern = {
  element: HTMLElement;
  controller: PatternController;
};

export type HydrateOptions = {
  /**
   * Pattern definitions to resolve slugs against - the `patterns` record from
   * `tabbied/patterns`, or an array/subset of definitions if the page only
   * uses a few (which keeps the payload to just those).
   */
  patterns: Record<string, PatternDefinition> | readonly PatternDefinition[];
  /** Where to look for elements. Defaults to the whole document. */
  root?: ParentNode;
  /** Overrides the default `[data-pattern]` selector. */
  selector?: string;
  /**
   * Called for an element whose slug isn't in `patterns`, or whose config is
   * unusable. Defaults to a console.warn - a template with one bad slug
   * should still mount the rest of its patterns.
   */
  onError?: (error: Error, element: HTMLElement) => void;
  /** Merged into every controller's config, after the attributes. */
  defaults?: Partial<PatternConfig>;
};

// Controllers already mounted by hydratePatterns, so a second call (a
// re-render, a template that both defers and calls manually) is a no-op
// rather than a double mount. Weak so detached elements stay collectable.
const hydrated = new WeakMap<Element, PatternController>();

// ---- serialization -------------------------------------------------------

// Values are joined with a separator and parsed back by splitting on it, so
// the parse has to survive a CSS color that contains its own commas -
// `rgb(0, 0, 0)`. Every authored palette in the catalog is hex-or-keyword,
// but the config takes any CSS color, so split at top level only.
const splitTopLevel = (value: string, separator: string): string[] => {
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
};

const coverRenderToString = (render: CoverRender): string =>
  `${render.width}x${render.height}`;

const parseCoverRender = (value: string): CoverRender | undefined => {
  const match = /^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/.exec(value.trim());

  if (!match) return undefined;

  return { width: Number(match[1]), height: Number(match[2]) };
};

/**
 * A PatternConfig as data-* attributes, for a server render (or a template
 * generator) to spread onto the host element. `hydratePatterns` reads exactly
 * what this writes.
 *
 * Only the values that were actually set are emitted, so a pattern left on
 * its authored defaults serializes to a single `data-pattern="<slug>"` and
 * the markup stays readable. `onReady` has no serialized form.
 */
export function patternConfigToAttributes(
  config: Omit<PatternConfig, 'onReady'> & { onReady?: unknown }
): PatternAttributes {
  const attributes: PatternAttributes = {
    [PATTERN_ATTRIBUTE]: config.pattern.slug,
  };

  const set = (name: string, value: string | undefined) => {
    if (value != null && value !== '') attributes[`data-${name}`] = value;
  };

  set('seed', config.seed);
  set('fit', config.fit);
  set('palette', config.palette?.join(', '));

  if (config.options) {
    const pairs = Object.entries(config.options)
      // An option set to undefined means "use the authored default", which is
      // what an absent entry already means to the controller.
      .filter(([, value]) => value != null)
      .map(([id, value]) => `${id}: ${value}`);

    set('options', pairs.join('; '));
  }

  if (config.cellSize != null) set('cell-size', String(config.cellSize));
  if (config.density != null) set('density', String(config.density));
  if (config.width != null) set('width', String(config.width));
  if (config.height != null) set('height', String(config.height));
  if (config.coverRender) {
    set('cover-render', coverRenderToString(config.coverRender));
  }
  if (config.redrawInterval != null) {
    set('redraw-interval', String(config.redrawInterval));
  }
  // Only the "on" state is worth an attribute; absent already means false.
  if (config.paused) attributes['data-paused'] = '';

  return attributes;
}

// ---- parsing -------------------------------------------------------------

const numberAttribute = (
  element: HTMLElement,
  name: string
): number | undefined => {
  const raw = element.getAttribute(`data-${name}`);

  if (raw == null || raw.trim() === '') return undefined;

  const value = Number(raw);

  return Number.isFinite(value) ? value : undefined;
};

// Option values are typed by the definition rather than guessed from the
// string, so a ButtonSelectGroup whose choices happen to look numeric (or
// boolean) still comes back as the string css-doodle substitutes.
const coerceOptionValue = (
  option: PatternOption,
  raw: string
): OptionValue | undefined => {
  if (option.type === 'ToggleSwitch') {
    if (raw === 'true' || raw === '') return true;
    if (raw === 'false') return false;
    return undefined;
  }

  if (option.type === 'Slider') {
    // Number('') is 0, which would substitute a value the option never
    // offered; a bare `frequency:` entry should fall back to the default.
    if (raw === '') return undefined;
    const value = Number(raw);
    return Number.isFinite(value) ? value : undefined;
  }

  return raw;
};

const parseOptions = (
  definition: PatternDefinition,
  raw: string
): Record<string, OptionValue> => {
  const values: Record<string, OptionValue> = {};

  for (const entry of splitTopLevel(raw, ';')) {
    const separator = entry.indexOf(':');
    const id = (separator === -1 ? entry : entry.slice(0, separator)).trim();
    const rest = separator === -1 ? '' : entry.slice(separator + 1).trim();
    const option = definition.options.find((candidate) => candidate.id === id);

    if (!option) continue;

    const value = coerceOptionValue(option, rest);

    if (value !== undefined) values[id] = value;
  }

  return values;
};

const isFitMode = (value: string): value is FitMode =>
  (FIT_MODES as readonly string[]).includes(value);

/**
 * Read a PatternConfig off an element's data-* attributes. The inverse of
 * patternConfigToAttributes.
 *
 * Returns null when the element carries no `data-pattern`, or when its slug
 * isn't in `patterns`. Individual attributes that don't parse are dropped
 * (the controller then uses the pattern's authored default) rather than
 * failing the whole element - a hand-edited template should degrade to the
 * design's defaults, not to a blank box.
 */
export function patternConfigFromElement(
  element: HTMLElement,
  patterns: Record<string, PatternDefinition> | readonly PatternDefinition[]
): PatternConfig | null {
  const slug = element.getAttribute(PATTERN_ATTRIBUTE);

  if (!slug) return null;

  const definition = Array.isArray(patterns)
    ? patterns.find((candidate) => candidate.slug === slug)
    : (patterns as Record<string, PatternDefinition>)[slug];

  if (!definition) return null;

  const config: PatternConfig = { pattern: definition };

  const seed = element.getAttribute('data-seed');
  if (seed) config.seed = seed;

  const fit = element.getAttribute('data-fit')?.trim();
  if (fit && isFitMode(fit)) config.fit = fit;

  const palette = element.getAttribute('data-palette');
  if (palette) {
    const colors = splitTopLevel(palette, ',');
    if (colors.length > 0) config.palette = colors;
  }

  const options = element.getAttribute('data-options');
  if (options) {
    const values = parseOptions(definition, options);
    if (Object.keys(values).length > 0) config.options = values;
  }

  const cellSize = numberAttribute(element, 'cell-size');
  if (cellSize != null) config.cellSize = cellSize;

  const density = numberAttribute(element, 'density');
  if (density != null) config.density = density;

  const width = numberAttribute(element, 'width');
  if (width != null) config.width = width;

  const height = numberAttribute(element, 'height');
  if (height != null) config.height = height;

  const coverRender = element.getAttribute('data-cover-render');
  if (coverRender) {
    const parsed = parseCoverRender(coverRender);
    if (parsed) config.coverRender = parsed;
  }

  const redrawInterval = numberAttribute(element, 'redraw-interval');
  if (redrawInterval != null) config.redrawInterval = redrawInterval;

  // Valueless attributes are the HTML idiom for a boolean flag, so
  // `data-paused` and `data-paused="true"` both mean paused.
  const paused = element.getAttribute('data-paused');
  if (paused != null && paused !== 'false') config.paused = true;

  return config;
}

/**
 * Mount every `[data-pattern]` element under `root` from its data-* config.
 *
 * ```js
 * import { hydratePatterns } from 'tabbied';
 * import { patterns } from 'tabbied/patterns';
 *
 * const mounted = hydratePatterns({ patterns });
 * // later: mounted.forEach(({ controller }) => controller.destroy());
 * ```
 *
 * Idempotent: an element already hydrated by a previous call is skipped, and
 * its existing controller is returned. Not for use alongside the React
 * component - `TabbiedPattern` mounts its own controller on the same
 * placeholder - but the attributes it renders are exactly what this reads,
 * which is what lets a static export be repackaged as a plain HTML template.
 */
export function hydratePatterns(options: HydrateOptions): HydratedPattern[] {
  const {
    patterns,
    root = document,
    selector = PATTERN_SELECTOR,
    onError = (error: Error) => console.warn(error.message),
    defaults,
  } = options;

  const mounted: HydratedPattern[] = [];

  for (const element of root.querySelectorAll<HTMLElement>(selector)) {
    const existing = hydrated.get(element);

    // A destroyed controller is inert forever - fall through and re-hydrate
    // so a teardown/re-hydrate cycle (the README's own recipe) works.
    if (existing && !existing.destroyed) {
      mounted.push({ element, controller: existing });
      continue;
    }

    const config = patternConfigFromElement(element, patterns);

    if (!config) {
      onError(
        new Error(
          `[tabbied] no pattern definition for "${element.getAttribute(
            PATTERN_ATTRIBUTE
          )}" - pass it in \`patterns\``
        ),
        element
      );
      continue;
    }

    const controller = createPattern(element, { ...config, ...defaults });
    hydrated.set(element, controller);
    mounted.push({ element, controller });
  }

  return mounted;
}
