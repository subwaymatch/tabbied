'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from 'react';
import {
  artworks,
  createArtwork,
  resolveFitMode,
  DEFAULT_FIXED_SIZE,
  type ArtworkConfig,
  type ArtworkController,
  type ArtworkDefinition,
  type ArtworkExportOptions,
  type ArtworkSlug,
  type CoverRender,
  type CssDoodleElement,
  type FitMode,
  type OptionValue,
} from '../core/index.js';

export type TabbiedArtworkHandle = {
  /** Re-randomize (or set) the seed, animating designs with CSS transitions. */
  redraw: (seed?: string) => void;
  /** PNG export via css-doodle's element.export(). */
  exportImage: (options?: ArtworkExportOptions) => Promise<unknown>;
  /** The raw <css-doodle> element, for power users. */
  readonly element: CssDoodleElement | null;
};

export type TabbiedArtworkProps = {
  /** Preset slug (tree-shakeable data ships with the package) or a full definition object. */
  artwork: ArtworkSlug | ArtworkDefinition;
  /** Pattern seed. Omit for a random seed per mount (use the handle's redraw()). */
  seed?: string;
  /** Active colors, color0 (background) first. Defaults to the preset palette. */
  palette?: string[];
  /** Option values keyed by option id; unset options use authored defaults. */
  options?: Record<string, OptionValue>;
  /**
   * Fit strategy — how the artwork relates to this component's box:
   * `grid` (default) adapts the cell grid to the measured container,
   * `stretch` keeps the authored grid and stretches, `cover`/`contain` scale
   * a fixed-resolution render (preserving fixed-px effects), `fixed` renders
   * at explicit width/height props. Defaults per artwork (sizing metadata).
   */
  fit?: FitMode;
  /** fit:"grid" — target cell size in px (default 36). */
  cellSize?: number;
  /** fit:"grid" — authored density level 0..4, alternative to cellSize. */
  density?: 0 | 1 | 2 | 3 | 4;
  /** fit:"fixed" — canvas size in px. */
  width?: number;
  height?: number;
  /** cover/contain — render resolution override. */
  coverRender?: CoverRender;
  /**
   * Re-randomize the seed every N ms (first redraw lands at a random point
   * within the first interval). Skipped under prefers-reduced-motion; ticks
   * are dropped while the tab is hidden. Only meaningful when `seed` is
   * uncontrolled.
   */
  redrawInterval?: number;
  /**
   * Pause `redrawInterval` ticks without tearing down the timer, so the redraw
   * phase is preserved across pause/resume (e.g. while the element is scrolled
   * out of the viewport). No effect unless `redrawInterval` is set.
   */
  paused?: boolean;
  /**
   * true (default): an aria-hidden decorative image.
   * false: role="img" with ariaLabel (defaults to the artwork name).
   */
  decorative?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  /** Called once the first pattern render has been committed. */
  onReady?: () => void;
};

const resolveDefinition = (
  artwork: ArtworkSlug | ArtworkDefinition
): ArtworkDefinition => {
  if (typeof artwork !== 'string') {
    return artwork;
  }

  const definition = artworks[artwork];

  if (!definition) {
    throw new Error(`[tabbied] unknown artwork slug: "${artwork}"`);
  }

  return definition;
};

/**
 * Renders a Tabbied artwork into a normal, CSS-sizeable box (like an <img>).
 *
 * The wrapper <div> is all that React renders — on the server and the first
 * client paint it shows the artwork's background color (correct size, zero
 * CLS, no hydration mismatch, no raw-source flash). After mount, the
 * framework-free createArtwork() controller owns the <css-doodle> inside it.
 */
export const TabbiedArtwork = forwardRef<
  TabbiedArtworkHandle,
  TabbiedArtworkProps
>(function TabbiedArtwork(
  {
    artwork,
    seed,
    palette,
    options,
    fit,
    cellSize,
    density,
    width,
    height,
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
  const definition = resolveDefinition(artwork);
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ArtworkController | null>(null);

  // Read `paused` through a ref so flipping it doesn't tear down and rebuild
  // the redraw timer — the redraw phase is preserved across pause/resume.
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const config: ArtworkConfig = {
    artwork: definition,
    seed,
    palette,
    options,
    fit,
    cellSize,
    density,
    width,
    height,
    coverRender,
    onReady,
  };
  const configRef = useRef(config);

  // Forward prop changes into the controller. Runs on every commit — the
  // controller diffs the built source, so unchanged props are a cheap no-op
  // (this also makes the first run after mount a no-op, mirroring the
  // renderedSource guard the site components used).
  useEffect(() => {
    configRef.current = config;
    controllerRef.current?.update(config);
  });

  // Mount once, destroy on unmount. StrictMode's mount→cleanup→mount cycle
  // simply builds a fresh controller (each renders exactly once).
  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const controller = createArtwork(host, configRef.current);
    controllerRef.current = controller;

    return () => {
      controllerRef.current = null;
      controller.destroy();
    };
  }, []);

  // Opt-in ambient redraws (the gallery shimmer): rotate the seed through the
  // controller so designs with CSS transitions morph between variations.
  useEffect(() => {
    if (!redrawInterval || redrawInterval <= 0) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const tick = () => {
      if (document.visibilityState === 'visible' && !pausedRef.current) {
        controllerRef.current?.redraw();
      }
    };

    // Land the first redraw anywhere in [0, interval) rather than a full
    // interval after mount, so a wall of artworks starts moving right away
    // instead of sitting still until every timer fires.
    let intervalTimer: ReturnType<typeof setInterval> | undefined;
    const firstTimer = setTimeout(() => {
      tick();
      intervalTimer = setInterval(tick, redrawInterval);
    }, Math.random() * redrawInterval);

    return () => {
      clearTimeout(firstTimer);
      if (intervalTimer !== undefined) {
        clearInterval(intervalTimer);
      }
    };
  }, [redrawInterval]);

  useImperativeHandle(
    ref,
    () => ({
      redraw: (nextSeed?: string) => controllerRef.current?.redraw(nextSeed),
      exportImage: (exportOptions?: ArtworkExportOptions) => {
        const controller = controllerRef.current;

        if (!controller) {
          return Promise.reject(
            new Error('[tabbied] exportImage() called before mount')
          );
        }

        return controller.exportImage(exportOptions);
      },
      get element() {
        return controllerRef.current?.element ?? null;
      },
    }),
    []
  );

  // The artwork's background color doubles as the pre-mount placeholder and
  // the letterbox color for fit:"contain".
  const background = (palette ?? definition.palette)?.[0];
  const resolvedFit = resolveFitMode(definition, fit);
  const fixedSize: CSSProperties | undefined =
    resolvedFit === 'fixed'
      ? {
          width: width ?? DEFAULT_FIXED_SIZE.width,
          height: height ?? DEFAULT_FIXED_SIZE.height,
        }
      : undefined;

  return (
    <div
      ref={hostRef}
      data-artwork={definition.slug}
      className={className}
      style={{ backgroundColor: background, ...fixedSize, ...style }}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': ariaLabel ?? definition.name })}
    />
  );
});
