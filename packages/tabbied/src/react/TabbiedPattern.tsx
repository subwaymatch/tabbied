'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from 'react';
import {
  patternConfigToAttributes,
  createPattern,
  resolveBoxStyle,
  DEFAULT_FIT_MODE,
  DEFAULT_FIXED_SIZE,
  type PatternBoxSize,
  type PatternConfig,
  type PatternController,
  type PatternDefinition,
  type PatternExportOptions,
  type PatternSvgExportOptions,
  type CoverRender,
  type CssDoodleElement,
  type FitMode,
  type OptionValue,
  type SvgExportResult,
} from '../core/index.js';

export type TabbiedPatternHandle = {
  /** Re-randomize (or set) the seed, animating designs with CSS transitions. */
  redraw: (seed?: string) => void;
  /** PNG export via css-doodle's element.export(). */
  exportImage: (options?: PatternExportOptions) => Promise<unknown>;
  /**
   * Native SVG export - real vector primitives, no foreignObject. Not
   * available for patterns with `svgExport: false` (see supportsSvgExport).
   */
  exportSvg: (options?: PatternSvgExportOptions) => Promise<SvgExportResult>;
  /** The raw <css-doodle> element, for power users. */
  readonly element: CssDoodleElement | null;
};

export type TabbiedPatternProps = PatternBoxSize & {
  /**
   * The pattern to render, as a `PatternDefinition`. Import only the presets
   * you use from `tabbied/patterns` (e.g. `import { radius } from
   * 'tabbied/patterns'`) so the bundler ships just those, or pass your own
   * definition object.
   */
  pattern: PatternDefinition;
  /** Randomization seed. Omit for a random seed per mount (use the handle's redraw()). */
  seed?: string;
  /** Active colors, color0 (background) first. Defaults to the preset palette. */
  palette?: string[];
  /** Option values keyed by option id; unset options use authored defaults. */
  options?: Record<string, OptionValue>;
  /**
   * Fit strategy - how the drawing relates to this component's box (the box
   * itself is sized by `fill`/`width`/`height`/`maxWidth`/`maxHeight`):
   * `grid` (the default) re-derives the cell grid from the measured box,
   * `cover` scales a fixed-resolution render uniformly (preserving fixed-px
   * effects) after reshaping it to the box - whole cells, nothing cropped
   * mid-cell - and `fixed` renders at an explicit canvas size. No fit deforms
   * the pattern: nothing is scaled by a different factor horizontally than
   * vertically.
   */
  fit?: FitMode;
  /** fit:"grid" - target cell size in px (default 36). */
  cellSize?: number;
  /** fit:"grid" - authored density level 0..4, alternative to cellSize. */
  density?: 0 | 1 | 2 | 3 | 4;
  /** `cover` - render resolution override. */
  coverRender?: CoverRender;
  /**
   * Re-randomize the seed every N ms (first redraw lands at a random point
   * within the first interval). Skipped under prefers-reduced-motion; ticks
   * are dropped while the tab is hidden or the element is outside the
   * viewport, so off-screen patterns cost nothing. Only meaningful when
   * `seed` is uncontrolled.
   *
   * Reduced motion covers more than this timer - see the note on motion in
   * the README: the designs' own cell transitions are muted too, so redraws
   * and resize-driven re-renders cut rather than morph.
   */
  redrawInterval?: number;
  /**
   * Pause `redrawInterval` ticks without tearing down the timer, so the redraw
   * phase is preserved across pause/resume. Off-screen elements already skip
   * ticks automatically; this is for consumer-controlled gates on top of that.
   * No effect unless `redrawInterval` is set.
   */
  paused?: boolean;
  /**
   * true (default): an aria-hidden decorative image.
   * false: role="img" with ariaLabel (defaults to the pattern name).
   */
  decorative?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  /** Called once the first pattern render has been committed. */
  onReady?: () => void;
};

/**
 * Renders a Tabbied pattern into a normal, CSS-sizeable box (like an <img>).
 *
 * By default the box fills its containing block, so dropping one into a sized
 * parent is all it takes:
 *
 * ```tsx
 * <div style={{ width: '100%', height: 400 }}>
 *   <TabbiedPattern pattern={radius} />
 * </div>
 * ```
 *
 * `width`/`height`/`maxWidth`/`maxHeight`/`aspectRatio` bound it instead, and
 * `fill={false}` hands sizing back to a class name. Whatever the box turns out
 * to be, the pattern is fitted into it without distortion - see `fit`.
 *
 * The wrapper <div> is all that React renders - on the server and the first
 * client paint it shows the pattern's background color (correct size, zero
 * CLS, no hydration mismatch, no raw-source flash). After mount, the
 * framework-free createPattern() controller owns the <css-doodle> inside it.
 */
export const TabbiedPattern = forwardRef<
  TabbiedPatternHandle,
  TabbiedPatternProps
>(function TabbiedPattern(
  {
    pattern,
    seed,
    palette,
    options,
    fit,
    cellSize,
    density,
    fill,
    width,
    height,
    maxWidth,
    maxHeight,
    aspectRatio,
    coverRender,
    redrawInterval,
    paused = false,
    decorative = true,
    ariaLabel,
    className,
    style,
    onReady,
  },
  ref
) {
  const definition = pattern;
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<PatternController | null>(null);

  // fit:"fixed" draws its canvas at an explicit pixel size, so it only takes
  // the numeric form of width/height; a CSS length still sizes the box, and
  // the canvas falls back to DEFAULT_FIXED_SIZE.
  const config: PatternConfig = {
    pattern: definition,
    seed,
    palette,
    options,
    fit,
    cellSize,
    density,
    width: typeof width === 'number' ? width : undefined,
    height: typeof height === 'number' ? height : undefined,
    coverRender,
    redrawInterval,
    paused,
    onReady,
  };
  const configRef = useRef(config);

  // Forward prop changes into the controller. Runs on every commit - the
  // controller diffs the built source, so unchanged props are a cheap no-op
  // (this also makes the first run after mount a no-op, mirroring the
  // renderedSource guard the site components used).
  useEffect(() => {
    configRef.current = config;
    controllerRef.current?.update(config);
  });

  // Mount once, destroy on unmount. StrictMode's mount->cleanup->mount cycle
  // simply builds a fresh controller (each renders exactly once).
  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const controller = createPattern(host, configRef.current);
    controllerRef.current = controller;

    return () => {
      controllerRef.current = null;
      controller.destroy();
    };
  }, []);

  // `redrawInterval` / `paused` need no effect of their own: they ride in the
  // config above, and the controller owns the timer (and its reduced-motion,
  // tab-visibility and viewport gates). Flipping `paused` is read at tick
  // time, so the redraw phase survives pause/resume.

  useImperativeHandle(
    ref,
    () => ({
      redraw: (nextSeed?: string) => controllerRef.current?.redraw(nextSeed),
      exportImage: (exportOptions?: PatternExportOptions) => {
        const controller = controllerRef.current;

        if (!controller) {
          return Promise.reject(
            new Error('[tabbied] exportImage() called before mount')
          );
        }

        return controller.exportImage(exportOptions);
      },
      exportSvg: (exportOptions?: PatternSvgExportOptions) => {
        const controller = controllerRef.current;

        if (!controller) {
          return Promise.reject(
            new Error('[tabbied] exportSvg() called before mount')
          );
        }

        return controller.exportSvg(exportOptions);
      },
      get element() {
        return controllerRef.current?.element ?? null;
      },
    }),
    []
  );

  // The pattern's background color, painted on the wrapper as the pre-mount
  // placeholder (correct size, zero CLS, no raw-source flash).
  const background = (palette ?? definition.palette)?.[0];
  const resolvedFit = fit ?? DEFAULT_FIT_MODE;
  // fit:"fixed" is the one strategy with an inherent size, so its box defaults
  // to the canvas rather than to filling the parent.
  const boxStyle: CSSProperties = resolveBoxStyle(
    resolvedFit === 'fixed'
      ? {
          fill: false,
          width: width ?? DEFAULT_FIXED_SIZE.width,
          height: height ?? DEFAULT_FIXED_SIZE.height,
          maxWidth,
          maxHeight,
          aspectRatio,
        }
      : { fill, width, height, maxWidth, maxHeight, aspectRatio }
  );

  // The config as data-* attributes. On the client they are inert - the
  // controller is driven by props - but they make a *server* render
  // self-describing: the prerendered HTML then carries everything
  // hydratePatterns() needs to re-mount the pattern with no React and no
  // build step, which is what lets a static export be repackaged as a plain
  // HTML template. Deterministic from props, so no hydration mismatch (an
  // uncontrolled `seed` is generated inside the controller, not here, and so
  // is simply absent).
  const configAttributes = patternConfigToAttributes(config);

  return (
    <div
      ref={hostRef}
      {...configAttributes}
      className={className}
      style={{ backgroundColor: background, ...boxStyle, ...style }}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': ariaLabel ?? definition.name })}
    />
  );
});
