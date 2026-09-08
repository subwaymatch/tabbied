// Framework-free pattern controller: mounts a <css-doodle> for a pattern
// definition into a host element, owns the sizing strategy (ResizeObserver +
// grid adaptation / cover scaling), and pushes every later change through
// css-doodle's update() so the element - and its CSS transitions - survive.
// Framework wrappers (tabbied/react) reduce to "create on mount, forward prop
// changes, destroy on unmount".
import './register.js';
import { buildDoodleSource, expandPalette } from './doodleSource.js';
import { randomSeed } from './seed.js';
import {
  DEFAULT_CELL_PX,
  DEFAULT_COVER_RENDER,
  DEFAULT_FIT_MODE,
  DEFAULT_FIXED_SIZE,
  DENSITY_CELL_PX,
  GRID_OPTION_ID,
  adaptCoverRenderToBox,
  coverCellPx,
  deriveGridForBox,
  fitRenderToBox,
  snapSpanToTracks,
  type CoverRender,
} from './sizing.js';
import type { SvgExportOptions, SvgExportResult } from './svgExport.js';
import type {
  PatternDefinition,
  FitMode,
  OptionValue,
} from './types.js';

// css-doodle's imperative surface (the element is created at runtime, so the
// methods are typed here rather than via JSX intrinsics).
export type CssDoodleElement = HTMLElement & {
  update: (code?: string) => void;
  export: (options?: PatternExportOptions) => Promise<unknown>;
};

/** Pass-through options for css-doodle's element.export(). */
export type PatternExportOptions = {
  scale?: number;
  name?: string;
  download?: boolean;
  detail?: boolean;
};

/** Options for the native SVG export (doodleToSvg + download plumbing). */
export type PatternSvgExportOptions = SvgExportOptions & {
  /** Trigger a browser download of the .svg file. */
  download?: boolean;
  /** Download file name (without extension). Defaults to the pattern slug. */
  name?: string;
};

export type PatternConfig = {
  pattern: PatternDefinition;
  /**
   * Randomization seed. Omit for a random seed per controller; redraw() rotates it.
   * Passing `undefined` in update() keeps the current seed.
   */
  seed?: string;
  /**
   * Active colors, color0 (background) first. Defaults to the preset palette
   * at its default color count. Expanded to the pattern's full slot count by
   * cycling the inks (see expandPalette).
   */
  palette?: string[];
  /** Option values keyed by option id; unset options use authored defaults. */
  options?: Record<string, OptionValue>;
  /**
   * Fit strategy - how the drawing relates to the host box. Defaults to
   * DEFAULT_FIT_MODE. How *big* the host box is stays a CSS question: size it
   * yourself, or apply resolveBoxStyle() to it.
   */
  fit?: FitMode;
  /** fit:"grid" - target cell size in px (default 36). */
  cellSize?: number;
  /** fit:"grid" - authored density level 0..4, alternative to cellSize. */
  density?: number;
  /** fit:"fixed" - canvas size in px. */
  width?: number;
  height?: number;
  /** `cover` - render resolution override (default 800×800). */
  coverRender?: CoverRender;
  /**
   * Re-randomize the seed every N ms, so designs with authored CSS
   * transitions morph between arrangements (the gallery shimmer). The first
   * redraw lands at a random point within the first interval, so a page of
   * patterns starts moving immediately instead of stepping in lockstep.
   *
   * Switched off entirely under prefers-reduced-motion (which also mutes the
   * designs' own cell transitions, so a resize-driven re-render cuts instead
   * of morphing); ticks are dropped while the tab is hidden or the host is
   * outside the viewport, so off-screen patterns cost nothing. Only
   * meaningful when `seed` is uncontrolled - an update() that sets `seed`
   * wins the next tick.
   */
  redrawInterval?: number;
  /**
   * Pause `redrawInterval` ticks without tearing the timer down, so the
   * redraw phase survives pause/resume. Off-screen hosts already skip ticks
   * on their own; this is a consumer-controlled gate on top of that. No
   * effect unless `redrawInterval` is set.
   */
  paused?: boolean;
  /** Called once the first pattern render has been committed. */
  onReady?: () => void;
};

export type PatternController = {
  /** The live <css-doodle> element (null until mounted / after destroy()). */
  readonly element: CssDoodleElement | null;
  /** True after destroy(); a destroyed controller ignores every call. */
  readonly destroyed: boolean;
  /** Merge config changes in; only real differences reach the DOM. */
  update(config: Partial<PatternConfig>): void;
  /** Re-randomize (or set) the seed and regenerate, preserving transitions. */
  redraw(seed?: string): void;
  /** Wraps css-doodle's element.export() - PNG export at a scale factor. */
  exportImage(options?: PatternExportOptions): Promise<unknown>;
  /**
   * Native SVG export: real vector primitives, no foreignObject. Waits for
   * any in-flight render transitions to settle, then snapshots the DOM.
   * Not available for patterns with `svgExport: false`.
   */
  exportSvg(options?: PatternSvgExportOptions): Promise<SvgExportResult>;
  destroy(): void;
};

// Let redraw/option transitions (the patterns author ~400ms eases) finish so
// computed styles aren't captured mid-flight. Capped so a long or infinite
// animation can't wedge the export.
const SETTLE_TIMEOUT_MS = 1200;

async function settleAnimations(element: CssDoodleElement): Promise<void> {
  const root = element.shadowRoot;
  if (!root) return;

  const animations: Animation[] = [];
  for (const node of root.querySelectorAll('*')) {
    if (typeof node.getAnimations === 'function') {
      animations.push(...node.getAnimations());
    }
  }
  if (animations.length === 0) return;

  await Promise.race([
    Promise.allSettled(animations.map((animation) => animation.finished)),
    new Promise((resolve) => setTimeout(resolve, SETTLE_TIMEOUT_MS)),
  ]);
}

// Delay before a resize-driven grid change re-renders. Every grid step
// re-randomizes the arrangement (same seed + different grid ⇒ different
// layout - inherent to the medium), so wait for the resize to settle instead
// of re-rolling the design on every frame of a drag. Between steps the canvas
// stretches fluidly via CSS.
const GRID_RESIZE_DEBOUNCE_MS = 180;

// Uniqueness for the per-instance <style> scope. An attribute selector
// (css-doodle[data-tabbied="t0"]) sidesteps both id collisions when the same
// pattern mounts twice and id-escaping issues.
let instanceCounter = 0;

// Every pattern's rules carry their own `transition`, which is what makes
// redraw() morph one arrangement into the next instead of cutting. This
// override switches that off, and it is used for two different reasons.
//
// 1. The first paint has nothing to morph from, so every cell would animate in
//    from its unstyled state: the drawing visibly assembles itself, and a page
//    of patterns pays for thousands of simultaneous transitions while it is
//    still loading. Muted for two frames, then dropped.
// 2. Under prefers-reduced-motion it stays on for the controller's whole life.
//    The ambient redraw timer is switched off separately (see
//    syncRedrawTimer), but that is not the only motion: a resize re-derives
//    the grid and re-renders, which morphs every cell without the user having
//    asked for anything. That is the passive motion the preference is about.
//
// The override lives in the shadow root because that is where css-doodle puts
// the generated cell styles; a rule in the light DOM cannot reach them.
const MUTE_TRANSITIONS =
  'cssd-cell,cssd-cell *,cssd-cell::before,cssd-cell::after{transition:none !important}';

const appendMuteStyle = (
  element: CssDoodleElement
): HTMLStyleElement | null => {
  const root = element.shadowRoot;

  if (!root) {
    return null;
  }

  const mute = document.createElement('style');
  mute.textContent = MUTE_TRANSITIONS;
  root.appendChild(mute);

  return mute;
};

const reducedMotionQuery = (): MediaQueryList | null =>
  typeof matchMedia === 'function'
    ? matchMedia('(prefers-reduced-motion: reduce)')
    : null;

const prefersReducedMotion = (): boolean =>
  reducedMotionQuery()?.matches ?? false;

type ResolvedConfig = {
  definition: PatternDefinition;
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

export function createPattern(
  host: HTMLElement,
  initialConfig: PatternConfig
): PatternController {
  const uid = `t${instanceCounter++}`;

  let config: PatternConfig = { ...initialConfig };
  let seed = config.seed ?? randomSeed();

  let styleEl: HTMLStyleElement | null = null;
  let element: CssDoodleElement | null = null;
  let observer: ResizeObserver | null = null;
  let gridTimer: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;
  // Ambient-redraw timer state (see syncRedrawTimer). redrawIntervalMs is the
  // interval the live timer was built for, so a reconcile only rebuilds when
  // the interval itself changed.
  let redrawIntervalMs: number | undefined;
  let firstRedrawTimer: ReturnType<typeof setTimeout> | null = null;
  let redrawTimer: ReturnType<typeof setInterval> | null = null;
  let viewportObserver: IntersectionObserver | null = null;
  let inViewport = true;
  let readyFired = false;
  // The transition override living in the current element's shadow root, held
  // so the reduced-motion listener can drop it when the preference changes.
  let muteStyle: HTMLStyleElement | null = null;
  let motionQuery: MediaQueryList | null = null;
  let onMotionChange: (() => void) | null = null;
  // Inline host styles the cover mount overwrote, restored when the
  // element unmounts so destroy() (or a fit change) leaves the host as found.
  let hostStyleBackup: { position: string; overflow: string } | null = null;

  let hostSize: { width: number; height: number } | null = null;
  // What the live element currently shows, for update()-vs-recreate diffing.
  // renderBox is the canvas size a cover render was drawn at - the
  // scaling transform must track what's in the DOM, not the latest measure.
  let rendered: {
    structure: string;
    styleCode: string;
    doodleCode: string;
    seed: string;
    renderBox: CoverRender | null;
    /** Layout cell size of a cover render, for scale quantisation. */
    cellPx: number | null;
  } | null = null;

  const resolve = (): ResolvedConfig => {
    const definition = config.pattern;
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
      fit: config.fit ?? DEFAULT_FIT_MODE,
      targetCellPx:
        config.cellSize ??
        (config.density != null
          ? DENSITY_CELL_PX[clampDensity(config.density)]
          : DEFAULT_CELL_PX),
      fixedWidth: config.width ?? DEFAULT_FIXED_SIZE.width,
      fixedHeight: config.height ?? DEFAULT_FIXED_SIZE.height,
      coverRender: config.coverRender ?? DEFAULT_COVER_RENDER,
    };
  };

  // Re-creating the element (instead of update()) is only needed when the
  // mounted structure itself changes: a different pattern or fit strategy.
  const structureKey = (resolved: ResolvedConfig): string =>
    `${resolved.definition.slug}|${resolved.fit}`;

  const needsMeasure = (fit: FitMode): boolean =>
    fit === 'grid' || fit === 'cover';

  // The fixed-resolution box a `cover` render draws at: the base box reshaped
  // to the host, so the grid tiles it edge-to-edge with whole cells and
  // nothing is cropped mid-cell. Falls back to the base box until the first
  // measure lands.
  const resolveRenderBox = (resolved: ResolvedConfig): CoverRender =>
    hostSize
      ? adaptCoverRenderToBox(
          hostSize.width,
          hostSize.height,
          resolved.coverRender
        )
      : resolved.coverRender;

  // The css-doodle canvas size and effective option values for the strategy.
  const buildSource = (resolved: ResolvedConfig) => {
    const { definition, fit } = resolved;
    let width: string;
    let height: string;
    let optionValues = resolved.optionValues;
    let renderBox: CoverRender | null = null;
    let renderCellPx: number | null = null;

    if (fit === 'fixed') {
      width = `${resolved.fixedWidth}px`;
      height = `${resolved.fixedHeight}px`;
    } else if (fit === 'cover') {
      renderBox = resolveRenderBox(resolved);
      // width/height are filled in below, after any render-box snapping.
      width = '';
      height = '';
    } else {
      // grid fills the host; the pattern only depends on seed + grid, so
      // percentage sizing renders identically at any container size.
      width = '100%';
      height = '100%';
    }

    const overrideGrid = (cols: number, rows: number) =>
      definition.options.map((option, index) =>
        option.id === GRID_OPTION_ID
          ? `${cols}x${rows}`
          : resolved.optionValues[index]
      );

    if (fit === 'grid' && hostSize) {
      const { cols, rows } = deriveGridForBox(
        hostSize.width,
        hostSize.height,
        resolved.targetCellPx,
        definition.sizing
      );

      optionValues = overrideGrid(cols, rows);
    } else if (renderBox && hostSize) {
      // Cell size for the adapted box: an explicit cellSize/density prop is in
      // host px (grid-fit semantics), so it converts through the render scale;
      // otherwise the pinned/authored grid's cell size on the base box is kept.
      const gridIndex = definition.options.findIndex(
        (option) => option.id === GRID_OPTION_ID
      );
      const authoredCell = coverCellPx(
        String(resolved.optionValues[gridIndex]),
        resolved.coverRender
      );
      const explicitCell = config.cellSize != null || config.density != null;
      const cellPx =
        explicitCell || authoredCell == null
          ? (resolved.targetCellPx * renderBox.width) / hostSize.width
          : authoredCell;
      const { cols, rows } = deriveGridForBox(
        renderBox.width,
        renderBox.height,
        cellPx,
        definition.sizing
      );

      // Snap the render box the same way a grid canvas is snapped: whole,
      // divisible, square cells. On its own this does nothing for a scaled
      // canvas (measured: 6 seams either way), but it is what gives
      // fitRenderToBox a whole `cell` to quantise the scale against, and the
      // pair together take the seams to zero.
      const multiple = definition.sizing?.cellMultiple;
      const cell = Math.max(
        snapSpanToTracks(renderBox.width, cols, multiple) / cols,
        snapSpanToTracks(renderBox.height, rows, multiple) / rows
      );

      renderBox = { ...renderBox, width: cols * cell, height: rows * cell };
      renderCellPx = cell;
      optionValues = overrideGrid(cols, rows);
    }

    if (renderBox) {
      width = `${renderBox.width}px`;
      height = `${renderBox.height}px`;
    }

    return {
      ...buildDoodleSource({
        code: definition.code,
        options: definition.options,
        palette: resolved.palette,
        optionValues,
        width,
        height,
      }),
      renderBox,
      cellPx: renderCellPx,
    };
  };

  // Size a `grid` canvas so every track lands on a whole pixel.
  //
  // The grid fills the host, and `repeat(cols, 1fr)` over a container that
  // isn't divisible by cols puts every cell boundary on a sub-pixel, which
  // paints a hairline seam at each one. Overriding the canvas inline (the
  // source still says 100%, so the generated pattern and its SVG export are
  // untouched) rounds each axis up to a whole multiple of its track count;
  // the host clips the sub-cell overflow.
  //
  // Pure arithmetic, so it runs on every resize tick - between debounced grid
  // steps the canvas keeps covering the host at whole tracks, where plain
  // percentage sizing would drift back onto sub-pixels.
  const applyGridSnap = (resolved: ResolvedConfig) => {
    if (!element || !hostSize || resolved.fit !== 'grid') {
      return;
    }

    const { cols, rows } = deriveGridForBox(
      hostSize.width,
      hostSize.height,
      resolved.targetCellPx,
      resolved.definition.sizing
    );

    const cellMultiple = resolved.definition.sizing?.cellMultiple;
    const cellW = snapSpanToTracks(hostSize.width, cols, cellMultiple) / cols;
    const cellH = snapSpanToTracks(hostSize.height, rows, cellMultiple) / rows;

    // Square the cell. Well over a hundred designs rotate their cell by a quarter
    // turn (`transform: rotate(@pick(0deg, 90deg, ...))`), and a quarter turn
    // of an oblong swaps its axes: a 120x124 cell paints 124x120 once rotated,
    // leaving 2px uncovered top and bottom. That reads as a seam between
    // blocks even though every track is exact. Taking the larger of the two
    // keeps the canvas covering the host, and both are already multiples of
    // cellMultiple so the max is too.
    const cell = Math.max(cellW, cellH);

    element.style.width = `${cols * cell}px`;
    element.style.height = `${rows * cell}px`;
  };

  const applyTransform = (resolved: ResolvedConfig) => {
    if (!element || !hostSize || resolved.fit !== 'cover') {
      return;
    }

    const { scale, translateX, translateY } = fitRenderToBox(
      hostSize.width,
      hostSize.height,
      rendered?.renderBox ?? resolved.coverRender,
      rendered?.cellPx ?? undefined
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
    const { styleCode, doodleCode, renderBox, cellPx } = buildSource(resolved);

    styleEl = document.createElement('style');
    styleEl.textContent = `css-doodle[data-tabbied="${uid}"] { ${styleCode} }`;

    element = document.createElement('css-doodle') as CssDoodleElement;
    element.setAttribute('data-tabbied', uid);
    element.setAttribute('use', 'var(--rule)');
    element.setAttribute('data-seed', seed);
    element.textContent = doodleCode;

    rendered = {
      structure: structureKey(resolved),
      styleCode,
      doodleCode,
      seed,
      renderBox,
      cellPx,
    };

    if (resolved.fit === 'cover' || resolved.fit === 'grid') {
      // An oversized canvas scaled or snapped into the host (which clips the
      // overflow): a fixed-resolution render for cover, a whole number of grid
      // tracks for grid. Positioning is set before append so the oversized
      // canvas never affects layout.
      const hostStyle = getComputedStyle(host);
      hostStyleBackup ??= {
        position: host.style.position,
        overflow: host.style.overflow,
      };
      if (hostStyle.position === 'static') {
        host.style.position = 'relative';
      }
      host.style.overflow = 'hidden';
      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = '0';
      applyGridSnap(resolved);
      applyTransform(resolved);
    }

    host.appendChild(styleEl);
    host.appendChild(element);

    // Mute unconditionally, then decide how long for: under reduced motion the
    // override stays for good, otherwise it lifts once the first paint has
    // landed and redraws animate exactly as authored.
    muteStyle = appendMuteStyle(element);
    if (!prefersReducedMotion()) {
      releaseFirstDrawMute();
    }

    fireReady();
  };

  // css-doodle's update() regenerates the shadow root when the grid changes,
  // which takes the injected override with it - so under reduced motion the
  // override has to be re-asserted after every update, not just at mount.
  // Re-appending synchronously means it is in place for the same style
  // recalculation that would otherwise start the transitions.
  const ensureMuted = () => {
    if (!element || !prefersReducedMotion() || muteStyle?.isConnected) {
      return;
    }

    muteStyle = appendMuteStyle(element);
  };

  // Two frames: one for the cells to get their styles, one to paint them.
  const releaseFirstDrawMute = () => {
    const mute = muteStyle;

    if (!mute || typeof requestAnimationFrame !== 'function') {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // A change to the preference mid-frame wins over the release.
        if (muteStyle === mute && !prefersReducedMotion()) {
          mute.remove();
          muteStyle = null;
        }
      });
    });
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
    // The override lived in the element's shadow root, so it went with it.
    muteStyle = null;

    if (hostStyleBackup) {
      host.style.position = hostStyleBackup.position;
      host.style.overflow = hostStyleBackup.overflow;
      hostStyleBackup = null;
    }
  };

  // Push the current config into the live element. The seed rides on the
  // unobserved `data-seed` attribute and every change goes through
  // element.update(doodleCode): update() swaps the generated stylesheet in
  // place when the grid is unchanged, so cells persist and the patterns' CSS
  // transitions animate between the two states. (Changing the observed `seed`
  // attribute instead would make css-doodle rebuild every cell element,
  // killing any transition; and css-doodle >= 0.5 no longer re-reads the text
  // content on a bare update(), so the source is always passed explicitly.)
  const applyUpdate = (resolved: ResolvedConfig) => {
    if (!element || !rendered) return;

    const { styleCode, doodleCode, renderBox, cellPx } = buildSource(resolved);
    const styleChanged = styleCode !== rendered.styleCode;
    const seedChanged = seed !== rendered.seed;
    const doodleChanged = doodleCode !== rendered.doodleCode;

    if (!styleChanged && !seedChanged && !doodleChanged) {
      // The render box is embedded in the doodle source (@size), so an
      // unchanged source means an unchanged box.
      return;
    }

    if (styleChanged && styleEl) {
      styleEl.textContent = `css-doodle[data-tabbied="${uid}"] { ${styleCode} }`;
    }

    if (seedChanged) {
      element.setAttribute('data-seed', seed);
    }

    element.update(doodleCode);
    ensureMuted();
    rendered = { ...rendered, styleCode, doodleCode, seed, renderBox, cellPx };
  };

  // Re-randomize (or set) the seed and regenerate in place. Shared by the
  // public redraw() and the ambient redraw timer: both drop `config.seed` so
  // a later update() on unrelated props doesn't snap back to the seed the
  // controller was created with.
  const rotateSeed = (nextSeed?: string) => {
    seed = nextSeed ?? randomSeed();
    config = { ...config, seed: undefined };
    applyUpdate(resolve());
  };

  // Full reconcile after a config change: re-create on structural changes,
  // update() otherwise. Measured fits stay unmounted until the first
  // ResizeObserver tick delivers the host's size.
  const reconcile = () => {
    if (destroyed) return;

    const resolved = resolve();

    syncObserver(resolved);
    syncRedrawTimer();

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
    // A non-structural config change can still change the derived grid (a
    // cellSize/density update re-renders with new cols/rows), and the inline
    // canvas size must be re-snapped to the new track count or every boundary
    // lands back on a sub-pixel - the seams the snap exists to prevent.
    applyGridSnap(resolved);
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

    if (resolved.fit === 'cover') {
      // Re-scaling the already-rendered canvas is cheap - apply on every
      // tick. The render's box + grid track the host's shape too, so they are
      // re-derived below as well (debounced).
      applyTransform(resolved);
    }

    if (resolved.fit === 'grid') {
      // Re-snapping the already-rendered canvas is arithmetic - apply on
      // every tick, so it keeps covering the host at whole tracks while the
      // re-render below waits out the debounce.
      applyGridSnap(resolved);
    }

    if ((resolved.fit === 'grid' || resolved.fit === 'cover') && previous) {
      // Between grid steps the canvas stretches via CSS; only a changed
      // derived grid re-renders, debounced so a drag-resize settles first.
      if (gridTimer !== null) clearTimeout(gridTimer);
      gridTimer = setTimeout(() => {
        gridTimer = null;
        if (destroyed) return;

        const next = resolve();
        applyUpdate(next);
        applyGridSnap(next);
        applyTransform(next);
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

  // Ambient redraws: rotate the seed on a timer so designs with authored CSS
  // transitions morph between arrangements. This lives in the controller
  // rather than in each framework wrapper so the vanilla, React and
  // declarative entry points all inherit the same gating.
  //
  // Three gates keep a wall of animated patterns from costing what it looks
  // like it should: prefers-reduced-motion switches the effect off entirely,
  // a hidden tab stops ticking, and a host scrolled out of view stops
  // ticking. `paused` is a fourth, consumer-controlled gate on top.
  const clearRedrawTimer = () => {
    if (firstRedrawTimer !== null) {
      clearTimeout(firstRedrawTimer);
      firstRedrawTimer = null;
    }
    if (redrawTimer !== null) {
      clearInterval(redrawTimer);
      redrawTimer = null;
    }
    viewportObserver?.disconnect();
    viewportObserver = null;
    inViewport = true;
    redrawIntervalMs = undefined;
  };

  // Rebuilt only when the interval itself changes. `paused` is read at tick
  // time instead, so pausing and resuming preserves the redraw phase rather
  // than restarting the cycle.
  const syncRedrawTimer = () => {
    const { redrawInterval } = config;
    const wanted =
      redrawInterval && redrawInterval > 0 && !prefersReducedMotion()
        ? redrawInterval
        : undefined;

    if (wanted === redrawIntervalMs) return;

    clearRedrawTimer();

    if (wanted === undefined) return;

    redrawIntervalMs = wanted;

    if (typeof IntersectionObserver !== 'undefined') {
      viewportObserver = new IntersectionObserver((entries) => {
        inViewport = entries[entries.length - 1].isIntersecting;
      });
      viewportObserver.observe(host);
    }

    const tick = () => {
      if (
        !destroyed &&
        element &&
        inViewport &&
        !config.paused &&
        document.visibilityState === 'visible'
      ) {
        rotateSeed();
      }
    };

    // Land the first redraw anywhere in [0, interval) rather than a full
    // interval after mount, so a page of patterns starts moving right away
    // instead of sitting still and then stepping in lockstep.
    firstRedrawTimer = setTimeout(() => {
      firstRedrawTimer = null;
      tick();
      redrawTimer = setInterval(tick, wanted);
    }, Math.random() * wanted);
  };

  // The preference can be toggled while the page is open, so it is observed
  // rather than read once at mount. Both halves have to follow it: the ambient
  // timer starts or stops, and the transition override goes on or comes off.
  motionQuery = reducedMotionQuery();

  if (motionQuery?.addEventListener) {
    onMotionChange = () => {
      if (destroyed) return;

      syncRedrawTimer();

      if (prefersReducedMotion()) {
        if (element && !muteStyle) muteStyle = appendMuteStyle(element);
      } else if (muteStyle) {
        muteStyle.remove();
        muteStyle = null;
      }
    };

    motionQuery.addEventListener('change', onMotionChange);
  }

  reconcile();

  return {
    get element() {
      return element;
    },

    get destroyed() {
      return destroyed;
    },

    update(partial: Partial<PatternConfig>) {
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

      rotateSeed(nextSeed);
    },

    async exportImage(options?: PatternExportOptions) {
      if (!element) {
        throw new Error('[tabbied] exportImage() called before the pattern mounted');
      }

      return element.export({ name: config.pattern.slug, ...options });
    },

    async exportSvg(options?: PatternSvgExportOptions) {
      if (!element) {
        throw new Error('[tabbied] exportSvg() called before the pattern mounted');
      }

      const { download, name, ...svgOptions } = options ?? {};

      // The converter is ~21 KB gzipped and only needed here - load it on
      // demand so consumers who never export don't bundle it.
      const [{ doodleToSvg }] = await Promise.all([
        import('./svgExport.js'),
        settleAnimations(element),
      ]);
      const result = doodleToSvg(element, svgOptions);

      if (download) {
        const blob = new Blob([result.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = `${name ?? config.pattern.slug}.svg`;
        anchor.href = url;
        anchor.click();
        // Revoking synchronously can abort the just-started download.
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      }

      return result;
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;

      clearRedrawTimer();
      observer?.disconnect();
      observer = null;

      if (motionQuery && onMotionChange) {
        motionQuery.removeEventListener('change', onMotionChange);
      }
      motionQuery = null;
      onMotionChange = null;

      unmountElement();
    },
  };
}
