// Framework-free artwork controller: mounts a <css-doodle> for an artwork
// definition into a host element, owns the sizing strategy (ResizeObserver +
// grid adaptation / cover scaling), and pushes every later change through
// css-doodle's update() so the element — and its CSS transitions — survive.
// Framework wrappers (tabbied/react) reduce to "create on mount, forward prop
// changes, destroy on unmount".
import './register.js';
import { buildDoodleSource, expandPalette } from './doodleSource.js';
import { randomSeed } from './seed.js';
import {
  DEFAULT_CELL_PX,
  DEFAULT_COVER_RENDER,
  DEFAULT_FIXED_SIZE,
  DENSITY_CELL_PX,
  GRID_OPTION_ID,
  deriveGridForBox,
  fitRenderToBox,
  resolveFitMode,
  type CoverRender,
} from './sizing.js';
import type {
  ArtworkDefinition,
  FitMode,
  OptionValue,
} from './types.js';

// css-doodle's imperative surface (the element is created at runtime, so the
// methods are typed here rather than via JSX intrinsics).
export type CssDoodleElement = HTMLElement & {
  update: (code?: string) => void;
  export: (options?: ArtworkExportOptions) => Promise<unknown>;
};

/** Pass-through options for css-doodle's element.export(). */
export type ArtworkExportOptions = {
  scale?: number;
  name?: string;
  download?: boolean;
  detail?: boolean;
};

export type ArtworkConfig = {
  artwork: ArtworkDefinition;
  /**
   * Pattern seed. Omit for a random seed per controller; redraw() rotates it.
   * Passing `undefined` in update() keeps the current seed.
   */
  seed?: string;
  /**
   * Active colors, color0 (background) first. Defaults to the preset palette
   * at its default color count. Expanded to the artwork's full slot count by
   * cycling the inks (see expandPalette).
   */
  palette?: string[];
  /** Option values keyed by option id; unset options use authored defaults. */
  options?: Record<string, OptionValue>;
  /** Fit strategy. Defaults to the artwork's sizing.default. */
  fit?: FitMode;
  /** fit:"grid" — target cell size in px (default 36). */
  cellSize?: number;
  /** fit:"grid" — authored density level 0..4, alternative to cellSize. */
  density?: number;
  /** fit:"fixed" — canvas size in px. */
  width?: number;
  height?: number;
  /** cover/contain — render resolution override (default 800×800 or the artwork's sizing.coverRender). */
  coverRender?: CoverRender;
  /** Called once the first pattern render has been committed. */
  onReady?: () => void;
};

export type ArtworkController = {
  /** The live <css-doodle> element (null until mounted / after destroy()). */
  readonly element: CssDoodleElement | null;
  /** Merge config changes in; only real differences reach the DOM. */
  update(config: Partial<ArtworkConfig>): void;
  /** Re-randomize (or set) the seed and regenerate, preserving transitions. */
  redraw(seed?: string): void;
  /** Wraps css-doodle's element.export() — PNG export at a scale factor. */
  exportImage(options?: ArtworkExportOptions): Promise<unknown>;
  destroy(): void;
};

// Delay before a resize-driven grid change re-renders. Every grid step
// re-randomizes the arrangement (same seed + different grid ⇒ different
// layout — inherent to the medium), so wait for the resize to settle instead
// of re-rolling the design on every frame of a drag. Between steps the canvas
// stretches fluidly via CSS.
const GRID_RESIZE_DEBOUNCE_MS = 180;

// Uniqueness for the per-instance <style> scope. An attribute selector
// (css-doodle[data-tabbied="t0"]) sidesteps both id collisions when the same
// artwork mounts twice and id-escaping issues.
let instanceCounter = 0;

type ResolvedConfig = {
  definition: ArtworkDefinition;
  palette: string[];
  optionValues: OptionValue[];
  fit: FitMode;
  targetCellPx: number;
  fixedWidth: number;
  fixedHeight: number;
  coverRender: CoverRender;
};

const clampDensity = (density: number): number =>
  Math.min(Math.max(Math.round(density), 0), DENSITY_CELL_PX.length - 1);

export function createArtwork(
  host: HTMLElement,
  initialConfig: ArtworkConfig
): ArtworkController {
  const uid = `t${instanceCounter++}`;

  let config: ArtworkConfig = { ...initialConfig };
  let seed = config.seed ?? randomSeed();

  let styleEl: HTMLStyleElement | null = null;
  let element: CssDoodleElement | null = null;
  let observer: ResizeObserver | null = null;
  let gridTimer: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;
  let readyFired = false;

  let hostSize: { width: number; height: number } | null = null;
  // What the live element currently shows, for update()-vs-recreate diffing.
  let rendered: {
    structure: string;
    styleCode: string;
    doodleCode: string;
    seed: string;
  } | null = null;

  const resolve = (): ResolvedConfig => {
    const definition = config.artwork;
    const baseColors = definition.palette ?? [];
    const active =
      config.palette ??
      baseColors.slice(0, definition.colors?.default ?? baseColors.length);
    const totalColors = Math.max(
      definition.colors?.max ?? baseColors.length,
      active.length
    );

    return {
      definition,
      palette: expandPalette(active, totalColors),
      optionValues: definition.options.map(
        (option) => config.options?.[option.id] ?? option.default
      ),
      fit: resolveFitMode(definition, config.fit),
      targetCellPx:
        config.cellSize ??
        (config.density != null
          ? DENSITY_CELL_PX[clampDensity(config.density)]
          : DEFAULT_CELL_PX),
      fixedWidth: config.width ?? DEFAULT_FIXED_SIZE.width,
      fixedHeight: config.height ?? DEFAULT_FIXED_SIZE.height,
      coverRender:
        config.coverRender ??
        config.artwork.sizing?.coverRender ??
        DEFAULT_COVER_RENDER,
    };
  };

  // Re-creating the element (instead of update()) is only needed when the
  // mounted structure itself changes: a different artwork or fit strategy.
  const structureKey = (resolved: ResolvedConfig): string =>
    `${resolved.definition.slug}|${resolved.fit}`;

  const needsMeasure = (fit: FitMode): boolean =>
    fit === 'grid' || fit === 'cover' || fit === 'contain';

  // The css-doodle canvas size and effective option values for the strategy.
  const buildSource = (resolved: ResolvedConfig) => {
    const { definition, fit } = resolved;
    let width: string;
    let height: string;
    let optionValues = resolved.optionValues;

    if (fit === 'fixed') {
      width = `${resolved.fixedWidth}px`;
      height = `${resolved.fixedHeight}px`;
    } else if (fit === 'cover' || fit === 'contain') {
      width = `${resolved.coverRender.width}px`;
      height = `${resolved.coverRender.height}px`;
    } else {
      // grid + stretch fill the host; the pattern only depends on seed + grid,
      // so percentage sizing renders identically at any container size.
      width = '100%';
      height = '100%';
    }

    if (fit === 'grid' && hostSize) {
      const { cols, rows } = deriveGridForBox(
        hostSize.width,
        hostSize.height,
        resolved.targetCellPx,
        definition.sizing
      );

      optionValues = definition.options.map((option, index) =>
        option.id === GRID_OPTION_ID
          ? `${cols}x${rows}`
          : resolved.optionValues[index]
      );
    }

    return buildDoodleSource({
      code: definition.code,
      options: definition.options,
      palette: resolved.palette,
      optionValues,
      width,
      height,
    });
  };

  const applyTransform = (resolved: ResolvedConfig) => {
    if (
      !element ||
      !hostSize ||
      (resolved.fit !== 'cover' && resolved.fit !== 'contain')
    ) {
      return;
    }

    const { scale, translateX, translateY } = fitRenderToBox(
      hostSize.width,
      hostSize.height,
      resolved.coverRender,
      resolved.fit
    );

    element.style.transformOrigin = 'top left';
    element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  };

  const fireReady = () => {
    if (readyFired) return;
    readyFired = true;
    const { onReady } = config;

    if (onReady) {
      // The pattern is generated synchronously on connect; signal readiness
      // after the browser has had a frame to paint it.
      requestAnimationFrame(() => {
        if (!destroyed) onReady();
      });
    }
  };

  // Mount the <style> + <css-doodle> pair for the current config. css-doodle
  // renders its text content on mount, so the source is set before appending.
  const mountElement = (resolved: ResolvedConfig) => {
    const { styleCode, doodleCode } = buildSource(resolved);

    styleEl = document.createElement('style');
    styleEl.textContent = `css-doodle[data-tabbied="${uid}"] { ${styleCode} }`;

    element = document.createElement('css-doodle') as CssDoodleElement;
    element.setAttribute('data-tabbied', uid);
    element.setAttribute('use', 'var(--rule)');
    element.setAttribute('data-seed', seed);
    element.textContent = doodleCode;

    if (resolved.fit === 'cover' || resolved.fit === 'contain') {
      // Fixed-resolution render scaled into the host (which clips overflow).
      // Positioning is set before append so the oversized canvas never
      // affects layout.
      const hostStyle = getComputedStyle(host);
      if (hostStyle.position === 'static') {
        host.style.position = 'relative';
      }
      host.style.overflow = 'hidden';
      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = '0';
      applyTransform(resolved);
    }

    host.appendChild(styleEl);
    host.appendChild(element);

    rendered = {
      structure: structureKey(resolved),
      styleCode,
      doodleCode,
      seed,
    };

    fireReady();
  };

  const unmountElement = () => {
    if (gridTimer !== null) {
      clearTimeout(gridTimer);
      gridTimer = null;
    }
    styleEl?.remove();
    element?.remove();
    styleEl = null;
    element = null;
    rendered = null;
  };

  // Push the current config into the live element. The seed rides on the
  // unobserved `data-seed` attribute and every change goes through
  // element.update(doodleCode): update() swaps the generated stylesheet in
  // place when the grid is unchanged, so cells persist and the artworks' CSS
  // transitions animate between the two states. (Changing the observed `seed`
  // attribute instead would make css-doodle rebuild every cell element,
  // killing any transition; and css-doodle >= 0.5 no longer re-reads the text
  // content on a bare update(), so the source is always passed explicitly.)
  const applyUpdate = (resolved: ResolvedConfig) => {
    if (!element || !rendered) return;

    const { styleCode, doodleCode } = buildSource(resolved);
    const styleChanged = styleCode !== rendered.styleCode;
    const seedChanged = seed !== rendered.seed;
    const doodleChanged = doodleCode !== rendered.doodleCode;

    if (!styleChanged && !seedChanged && !doodleChanged) {
      return;
    }

    if (styleChanged && styleEl) {
      styleEl.textContent = `css-doodle[data-tabbied="${uid}"] { ${styleCode} }`;
    }

    if (seedChanged) {
      element.setAttribute('data-seed', seed);
    }

    element.update(doodleCode);
    rendered = { ...rendered, styleCode, doodleCode, seed };
  };

  // Full reconcile after a config change: re-create on structural changes,
  // update() otherwise. Measured fits stay unmounted until the first
  // ResizeObserver tick delivers the host's size.
  const reconcile = () => {
    if (destroyed) return;

    const resolved = resolve();

    syncObserver(resolved);

    if (needsMeasure(resolved.fit) && !hostSize) {
      if (element) unmountElement();
      return;
    }

    if (!element || !rendered) {
      if (element) unmountElement();
      mountElement(resolved);
      return;
    }

    if (rendered.structure !== structureKey(resolved)) {
      unmountElement();
      mountElement(resolved);
      return;
    }

    applyUpdate(resolved);
    applyTransform(resolved);
  };

  const handleResize = (width: number, height: number) => {
    if (destroyed) return;

    const previous = hostSize;
    hostSize = { width, height };

    const resolved = resolve();

    if (!element) {
      // First usable measurement mounts the element.
      if (width > 0 && height > 0) reconcile();
      return;
    }

    if (resolved.fit === 'cover' || resolved.fit === 'contain') {
      // Re-scaling is cheap — apply on every tick.
      applyTransform(resolved);
      return;
    }

    if (resolved.fit === 'grid' && previous) {
      // Between grid steps the canvas stretches via CSS; only a changed
      // derived grid re-renders, debounced so a drag-resize settles first.
      if (gridTimer !== null) clearTimeout(gridTimer);
      gridTimer = setTimeout(() => {
        gridTimer = null;
        if (!destroyed) applyUpdate(resolve());
      }, GRID_RESIZE_DEBOUNCE_MS);
    }
  };

  const syncObserver = (resolved: ResolvedConfig) => {
    const wanted = needsMeasure(resolved.fit);

    if (wanted && !observer) {
      observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        handleResize(Math.round(width), Math.round(height));
      });
      observer.observe(host);
    } else if (!wanted && observer) {
      observer.disconnect();
      observer = null;
      hostSize = null;
    }
  };

  reconcile();

  return {
    get element() {
      return element;
    },

    update(partial: Partial<ArtworkConfig>) {
      if (destroyed) return;

      config = { ...config, ...partial };

      // `seed: undefined` means "keep the current seed" so uncontrolled
      // consumers don't reset redraw()'s rotation on unrelated updates.
      if (partial.seed != null) {
        seed = partial.seed;
      }

      reconcile();
    },

    redraw(nextSeed?: string) {
      if (destroyed) return;

      seed = nextSeed ?? randomSeed();
      config = { ...config, seed: undefined };
      applyUpdate(resolve());
    },

    async exportImage(options?: ArtworkExportOptions) {
      if (!element) {
        throw new Error('[tabbied] exportImage() called before the artwork mounted');
      }

      return element.export({ name: config.artwork.slug, ...options });
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;

      observer?.disconnect();
      observer = null;
      unmountElement();
    },
  };
}
