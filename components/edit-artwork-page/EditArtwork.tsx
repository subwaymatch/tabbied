'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Dialog } from '@base-ui-components/react/dialog';
import { Shuffle, Expand, X, Minus, Plus } from 'lucide-react';
import useMediaQuery from 'lib/useMediaQuery';
import type { Artwork, ArtworkOption } from 'lib/artwork';
import {
  type AspectRatioId,
  type OptionValue,
  ASPECT_RATIOS,
  ASPECT_RATIO_IDS,
  DEFAULT_ASPECT_RATIO,
  deriveGrid,
  getGridOptions,
  gridToLevel,
  isAspectRatioId,
  randomSeed,
} from 'tabbied';
import { TabbiedArtwork, type TabbiedArtworkHandle } from 'tabbied/react';
import EditArtworkHeader from 'components/edit-artwork-page/EditArtworkHeader';
import ButtonSelectGroup from 'components/ButtonSelectGroup';
import ValueSlider from 'components/ValueSlider';
import ToggleSwitch from 'components/ToggleSwitch';
import { useBrandPalettes, type BrandPalette } from 'lib/brandPalettes';
import styles from './EditArtwork.module.css';

const ColorPicker = dynamic(() => import('components/ColorPicker'), {
  ssr: false,
});

// Options with this id hold a "colsxrows" grid string and follow the selected
// aspect ratio so that cells stay (near-)square.
const GRID_OPTION_ID = 'grid';

// A random 6-digit hex color (e.g. "#3eecff"), used to shuffle the palette.
const randomHexColor = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;

// Longest edge of the little aspect-ratio preview rectangle, in pixels.
const ASPECT_RATIO_RECT_SIZE = 20;

// Fraction of the preview area the artwork fills, leaving a margin around it.
const PREVIEW_FIT_MARGIN = 0.9;

// Largest width/height for `ratio` that fits inside a maxW × maxH box.
const fitToBox = (ratio: AspectRatioId, maxW: number, maxH: number) => {
  const [rw, rh] = ASPECT_RATIOS[ratio];
  const scale = Math.min(maxW / rw, maxH / rh);

  return { width: Math.round(rw * scale), height: Math.round(rh * scale) };
};

// A hollow rectangle whose proportions mirror the aspect ratio, shown inside
// each aspect-ratio button so the shape is visible at a glance. The rectangle
// lives in a fixed-height slot so every button ends up the same height
// regardless of whether the ratio is portrait or landscape.
const renderAspectRatioOption = (option: string): ReactNode => {
  const [rw, rh] = ASPECT_RATIOS[option as AspectRatioId];
  const scale = ASPECT_RATIO_RECT_SIZE / Math.max(rw, rh);

  return (
    <span className={styles.aspectRatioOption}>
      <span className={styles.aspectRatioRectSlot}>
        <span
          className={styles.aspectRatioRect}
          style={{ width: `${rw * scale}px`, height: `${rh * scale}px` }}
        />
      </span>
      <span>{option}</span>
    </span>
  );
};

// Parse a #rgb / #rrggbb / #rrggbbaa color into 0-255 channels (alpha ignored).
const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  let value = hex.trim().replace(/^#/, '');

  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (value.length !== 6 && value.length !== 8) {
    return null;
  }

  const int = parseInt(value.slice(0, 6), 16);

  if (Number.isNaN(int)) {
    return null;
  }

  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
};

// Pick an expand-icon color that stays legible on any preview background:
// white on dark backgrounds, and a blend of near-black with the background
// (so it reads as a tinted dark) on light backgrounds.
const getExpandIconColor = (background: string): string => {
  const rgb = hexToRgb(background);

  if (!rgb) {
    return 'var(--gray-dark)';
  }

  // Perceived luminance (sRGB-weighted), normalized to 0-1.
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;

  if (luminance < 0.5) {
    return '#ffffff';
  }

  const dark = { r: 0x23, g: 0x25, b: 0x29 };
  const blend = (from: number, to: number) => Math.round(from + (to - from) * 0.3);

  return `rgb(${blend(dark.r, rgb.r)}, ${blend(dark.g, rgb.g)}, ${blend(
    dark.b,
    rgb.b
  )})`;
};

const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export default function EditArtwork({ artwork }: { artwork: Artwork }) {
  // A preset may pin itself to a single aspect ratio (e.g. Symmetry), in which
  // case the selector is hidden and the ratio can't change.
  const lockedAspectRatio = artwork.lockAspectRatio ?? null;
  const defaultAspectRatio =
    lockedAspectRatio ?? artwork.defaultAspectRatio ?? DEFAULT_ASPECT_RATIO;

  // Color-count bounds: the authored palette holds `max` entries (slot 0 is
  // the background) and `colorCount` marks how many are active. Presets
  // without a `colors` config keep their palette size fixed.
  const paletteDefaults = artwork.palette ?? [];
  const minColors = artwork.colors?.min ?? paletteDefaults.length;
  const maxColors = artwork.colors?.max ?? paletteDefaults.length;
  const defaultColors = artwork.colors?.default ?? paletteDefaults.length;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The value an option takes according to the URL, falling back to the
  // authored default when the param is absent or malformed, and clamped /
  // validated against the option's own bounds (a hand-edited URL must not
  // feed NaN or an out-of-range value into a control, which would blank it).
  const optionFromQuery = (option: ArtworkOption): OptionValue => {
    const queryVal = searchParams.get(option.id);

    if (queryVal === null) {
      return option.default;
    }

    if (typeof option.default === 'number') {
      // Number('') is 0, which would silently pass the NaN guard.
      const numericVal = queryVal.trim() === '' ? NaN : Number(queryVal);

      if (Number.isNaN(numericVal)) {
        return option.default;
      }

      return Math.min(
        Math.max(numericVal, option.min ?? -Infinity),
        option.max ?? Infinity
      );
    }

    if (typeof option.default === 'boolean') {
      return queryVal === 'true';
    }

    if (option.type === 'ButtonSelectGroup') {
      // Grid values follow the aspect ratio (their list is dynamic), so they
      // validate by shape; other groups must match an authored choice.
      if (option.id === GRID_OPTION_ID) {
        return /^\d+x\d+$/.test(queryVal) ? queryVal : option.default;
      }

      return option.options?.includes(queryVal) ? queryVal : option.default;
    }

    return queryVal;
  };

  // The URL carries only the active colors, so the param count doubles as the
  // color count. Stored palette entries beyond it are topped up from the
  // authored defaults so re-adding a color always reveals a sensible value.
  const paletteStateFromQuery = (): { palette: string[]; count: number } => {
    const queryPalette = searchParams.getAll('palette');

    if (queryPalette.length >= minColors && queryPalette.length <= maxColors) {
      return {
        palette: [
          ...queryPalette,
          ...paletteDefaults.slice(queryPalette.length),
        ],
        count: queryPalette.length,
      };
    }

    return { palette: paletteDefaults, count: defaultColors };
  };

  const aspectRatioFromQuery = (): AspectRatioId => {
    const queryRatio = searchParams.get('aspectRatio');

    return !lockedAspectRatio && queryRatio && isAspectRatioId(queryRatio)
      ? queryRatio
      : defaultAspectRatio;
  };

  // State starts from the URL (shared / refreshed links) and falls back to the
  // artwork defaults, so the first paint already shows the linked artwork
  // instead of correcting itself after mount.
  const [palette, setPalette] = useState<string[]>(
    () => paletteStateFromQuery().palette
  );
  const [colorCount, setColorCount] = useState<number>(
    () => paletteStateFromQuery().count
  );
  const [optionValues, setOptionValues] = useState<OptionValue[]>(() =>
    artwork.options.map((option) => optionFromQuery(option))
  );
  const [aspectRatio, setAspectRatio] =
    useState<AspectRatioId>(aspectRatioFromQuery);
  const [seed, setSeed] = useState(() => searchParams.get('seed') ?? '0000');
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewport, setViewport] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [previewSize, setPreviewSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const doodleRef = useRef<TabbiedArtworkHandle>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScreenXS = useMediaQuery('(max-width: 747.99px)');
  const isTwoColumn = useMediaQuery('(min-width: 992px)');
  const baseWidth = isScreenXS ? 240 : 360;

  // Saved brand palettes (managed on /artworks) offered as one-click presets.
  const { palettes: brandPalettes } = useBrandPalettes();

  // Scale the artwork to fill the preview area (leaving a margin) so it shows as
  // large as the space allows. Until the preview is measured, fall back to the
  // original fixed footprint. In the stacked (single-column) layout the preview
  // height grows with the artwork, so the height is capped against the viewport
  // there rather than measured to avoid a feedback loop.
  const { width, height } = previewSize
    ? fitToBox(
        aspectRatio,
        previewSize.width * PREVIEW_FIT_MARGIN,
        (isTwoColumn ? previewSize.height : (viewport?.height ?? 800) * 0.6) *
          PREVIEW_FIT_MARGIN
      )
    : fitToBox(aspectRatio, baseWidth, baseWidth * 1.5);

  // Sync component state FROM the URL search params after mount (back /
  // forward navigation re-renders with new params without remounting). Each
  // setter is guarded so an echo of our own URL replace is a no-op.
  useEffect(() => {
    const queryPaletteState = paletteStateFromQuery();

    if (
      colorCount !== queryPaletteState.count ||
      !arraysEqual(
        palette.slice(0, colorCount),
        queryPaletteState.palette.slice(0, queryPaletteState.count)
      )
    ) {
      setPalette(queryPaletteState.palette);
      setColorCount(queryPaletteState.count);
    }

    artwork.options.forEach((option, optionIndex) => {
      const queryVal = optionFromQuery(option);

      if (queryVal !== optionValues[optionIndex]) {
        setOptionByIndex(optionIndex, queryVal);
      }
    });

    const querySeed = searchParams.get('seed') ?? '0000';

    if (seed !== querySeed) {
      setSeed(querySeed);
    }

    const queryAspectRatio = aspectRatioFromQuery();

    if (queryAspectRatio !== aspectRatio) {
      setAspectRatio(queryAspectRatio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Track the viewport so the expanded dialog can size the artwork to fit.
  useEffect(() => {
    const updateViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Measure the preview area so the artwork can be scaled to fill it.
  useEffect(() => {
    const element = previewRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const { width: w, height: h } = entries[0].contentRect;

      setPreviewSize((prev) => {
        const next = { width: Math.round(w), height: Math.round(h) };

        return prev && prev.width === next.width && prev.height === next.height
          ? prev
          : next;
      });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Sync the URL search params FROM component state if necessary.
  useEffect(() => {
    // Leave the URL untouched until it carries at least one search param
    // (matches the original behaviour which skipped when only `id` was set).
    if (searchParams.toString() === '') {
      return;
    }

    const newParams = new URLSearchParams();

    palette
      .slice(0, colorCount)
      .forEach((color) => newParams.append('palette', color));
    newParams.set('seed', seed);
    if (!lockedAspectRatio) {
      newParams.set('aspectRatio', aspectRatio);
    }
    artwork.options.forEach((option, index) => {
      newParams.set(option.id, String(optionValues[index]));
    });

    if (newParams.toString() !== searchParams.toString()) {
      // Native replaceState (which the App Router keeps in sync with
      // useSearchParams) instead of router.replace: the page is fully static,
      // so a router navigation would refetch an identical RSC payload from
      // the CDN on every knob tweak — a network request per slider step.
      window.history.replaceState(null, '', `${pathname}?${newParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, palette, colorCount, optionValues, aspectRatio]);

  const setOptionByIndex = (index: number, value: OptionValue) => {
    setOptionValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value;

      return newValues;
    });
  };

  const randomizeSeed = () => {
    setSeed(randomSeed(4));
  };

  // Randomize only the visible colors: hidden slots keep their stored values
  // so re-adding a color reveals something deliberate, not a stray random.
  const randomizePalette = () => {
    setPalette((prev) =>
      prev.map((color, index) =>
        index < colorCount ? randomHexColor() : color
      )
    );
  };

  const changeColorCount = (delta: number) => {
    setColorCount((prev) =>
      Math.min(maxColors, Math.max(minColors, prev + delta))
    );
  };

  // Apply a saved brand palette (see /artworks) to this artwork. Pickr and
  // the URL carry HEXA values, so a transparent background becomes the stored
  // color with zero alpha — reversible in the picker, and PNG exports keep
  // the real transparency.
  const applyBrandPalette = (brand: BrandPalette) => {
    const colors = brand.colors.map((color, index) =>
      index === 0 && brand.transparentBackground ? `${color}00` : color
    );

    setPalette((prev) => {
      const next = [...prev];
      const limit = Math.min(colors.length, next.length);

      for (let i = 0; i < limit; i += 1) {
        next[i] = colors[i];
      }

      return next;
    });
    setColorCount(Math.min(maxColors, Math.max(minColors, colors.length)));
  };

  // Switching the aspect ratio re-derives every grid option at its current
  // density level so the preset keeps its intended coarseness and square cells.
  const changeAspectRatio = (nextRatio: AspectRatioId) => {
    setOptionValues((prev) =>
      prev.map((value, index) =>
        artwork.options[index].id === GRID_OPTION_ID
          ? deriveGrid(nextRatio, gridToLevel(String(value)))
          : value
      )
    );
    setAspectRatio(nextRatio);
  };

  const exportArtwork = async () => {
    await doodleRef.current?.exportImage({
      // Cap the longer edge at ~3000px so exports stay a sensible size in any
      // orientation.
      scale: Math.ceil(3000 / Math.max(width, height)),
      download: true,
    });
  };

  // Props shared by the preview and the expanded dialog: the same seed +
  // options produce the same pattern at any size (it depends only on seed and
  // grid), so the dialog can render a larger copy that matches. The active
  // palette slice is passed as-is — TabbiedArtwork expands it so inactive
  // color slots alias back into the active inks (this is what "removing" a
  // color does).
  const artworkProps = {
    artwork,
    seed,
    palette: palette.slice(0, colorCount),
    options: Object.fromEntries(
      artwork.options.map((option, index) => [option.id, optionValues[index]])
    ),
  } as const;

  const getOptionControlComponent = (
    option: ArtworkOption,
    optionIndex: number
  ): ReactNode => {
    const controlValue = optionValues[optionIndex];
    const onChange = (value: OptionValue) =>
      setOptionByIndex(optionIndex, value);

    let componentJsx: ReactNode = null;

    switch (option.type) {
      case 'ButtonSelectGroup': {
        // Grid options follow the selected aspect ratio; everything else uses
        // the choices declared in the preset JSON.
        const buttonOptions =
          option.id === GRID_OPTION_ID
            ? getGridOptions(aspectRatio)
            : option.options;

        componentJsx =
          buttonOptions && buttonOptions.length > 0 ? (
            <ButtonSelectGroup
              options={buttonOptions}
              value={controlValue as string}
              onChange={onChange}
            />
          ) : null;
        break;
      }
      case 'Slider':
        componentJsx = (
          <div className={styles.valueSliderWrapper}>
            <ValueSlider
              min={option.min!}
              max={option.max!}
              step={option.step!}
              value={controlValue as number}
              onChange={onChange}
              label={option.displayName}
            />
          </div>
        );
        break;
      case 'ToggleSwitch':
        componentJsx = (
          <ToggleSwitch
            isChecked={controlValue as boolean}
            onChange={onChange}
          />
        );
        break;
      default:
        break;
    }

    return componentJsx ? (
      <div key={option.id} className={styles.optionBox}>
        <h3>{option.displayName}</h3>
        {componentJsx}
      </div>
    ) : null;
  };

  const previewBackground = palette.length > 0 ? palette[0] : 'transparent';
  const expandIconColor = getExpandIconColor(previewBackground);

  // A zero-alpha background (a transparent brand palette) previews over a
  // checkerboard, the usual "this is transparent" affordance.
  const isTransparentBackground =
    /^#[0-9a-f]{8}$/i.test(previewBackground) &&
    previewBackground.toLowerCase().endsWith('00');

  // Fit the artwork inside the viewport (with a little margin) for the dialog.
  const expanded = fitToBox(
    aspectRatio,
    (viewport?.width ?? 1200) * 0.9,
    (viewport?.height ?? 800) * 0.9
  );

  return (
    <div className={styles.pageWrapper}>
      <EditArtworkHeader artworkName={artwork.name} onRedraw={randomizeSeed} onExport={exportArtwork} />

      <main className={styles.editArtworkSection}>
        <Dialog.Root open={isExpanded} onOpenChange={setIsExpanded}>
          <div
            ref={previewRef}
            className={
              isTransparentBackground
                ? `${styles.previewWrapper} ${styles.previewTransparent}`
                : styles.previewWrapper
            }
            style={{ backgroundColor: previewBackground }}
          >
            <Dialog.Trigger
              className={styles.expandButton}
              style={{ color: expandIconColor }}
              aria-label="Expand artwork"
            >
              <Expand size={20} />
            </Dialog.Trigger>

            <div className={styles.doodleFrame}>
              <TabbiedArtwork
                ref={doodleRef}
                {...artworkProps}
                fit="fixed"
                width={width}
                height={height}
                decorative={false}
              />
            </div>
          </div>

          <Dialog.Portal>
            <Dialog.Backdrop className={styles.dialogBackdrop} />
            <Dialog.Popup className={styles.dialogPopup}>
              <Dialog.Title className={styles.srOnly}>
                {artwork.name}
              </Dialog.Title>
              <Dialog.Close
                className={styles.dialogClose}
                aria-label="Close expanded view"
              >
                <X size={24} />
              </Dialog.Close>
              <div
                className={
                  isTransparentBackground
                    ? `${styles.dialogDoodle} ${styles.previewTransparent}`
                    : styles.dialogDoodle
                }
                style={{ backgroundColor: previewBackground }}
              >
                {isExpanded && (
                  <TabbiedArtwork
                    {...artworkProps}
                    fit="fixed"
                    width={expanded.width}
                    height={expanded.height}
                    decorative={false}
                  />
                )}
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

        <div className={styles.optionsWrapper}>
          <div className={styles.options}>
            {palette.length > 0 && (
              <div className={styles.optionBox}>
                <div className={styles.paletteHeading}>
                  <h3>Palette</h3>
                  <button
                    type="button"
                    className={styles.randomizeButton}
                    onClick={randomizePalette}
                    aria-label="Randomize palette"
                    title="Randomize palette"
                  >
                    <Shuffle size={18} />
                  </button>
                  {minColors < maxColors && (
                    <div
                      className={styles.colorCountGroup}
                      role="group"
                      aria-label="Number of colors"
                    >
                      <button
                        type="button"
                        className={styles.colorCountButton}
                        onClick={() => changeColorCount(-1)}
                        disabled={colorCount <= minColors}
                        aria-label="Remove color"
                        title="Remove color"
                      >
                        <Minus size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.colorCountButton}
                        onClick={() => changeColorCount(1)}
                        disabled={colorCount >= maxColors}
                        aria-label="Add color"
                        title="Add color"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="colors">
                  {palette.slice(0, colorCount).map((hex, index) => (
                    <ColorPicker
                      key={`color${index}`}
                      index={index}
                      handleColorChange={(color) => {
                        const colorHEXAString = color.toHEXA().toString();

                        setPalette((prevPalette) => {
                          const newPalette = [...prevPalette];
                          newPalette[index] = colorHEXAString;

                          return newPalette;
                        });
                      }}
                      color={hex}
                    />
                  ))}
                </div>

                {brandPalettes.length > 0 && (
                  <div className={styles.brandPalettes}>
                    <span className={styles.brandPalettesLabel}>
                      Apply a brand palette
                    </span>
                    <div className={styles.brandPaletteChips}>
                      {brandPalettes.map((brand) => (
                        <button
                          key={brand.id}
                          type="button"
                          className={styles.brandPaletteChip}
                          title={`Apply palette "${brand.name}"`}
                          onClick={() => applyBrandPalette(brand)}
                        >
                          <span
                            className={styles.brandSwatches}
                            aria-hidden="true"
                          >
                            {brand.colors.map((color, index) => (
                              <span
                                key={`${color}-${index}`}
                                className={
                                  index === 0 && brand.transparentBackground
                                    ? `${styles.brandSwatch} ${styles.brandSwatchTransparent}`
                                    : styles.brandSwatch
                                }
                                style={
                                  index === 0 && brand.transparentBackground
                                    ? undefined
                                    : { backgroundColor: color }
                                }
                              />
                            ))}
                          </span>
                          {brand.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!lockedAspectRatio && (
              <div className={styles.optionBox}>
                <h3>Aspect ratio</h3>
                <ButtonSelectGroup
                  options={[...ASPECT_RATIO_IDS]}
                  value={aspectRatio}
                  onChange={(value) =>
                    changeAspectRatio(value as AspectRatioId)
                  }
                  renderOption={renderAspectRatioOption}
                />
              </div>
            )}

            {artwork.options.map((option, optionIndex) =>
              getOptionControlComponent(option, optionIndex)
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
