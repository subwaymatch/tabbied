'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Dialog } from '@base-ui-components/react/dialog';
import { Shuffle, Expand, X } from 'lucide-react';
import useMediaQuery from 'lib/useMediaQuery';
import type { Artwork, ArtworkOption } from 'lib/artwork';
import {
  type AspectRatioId,
  ASPECT_RATIOS,
  ASPECT_RATIO_IDS,
  DEFAULT_ASPECT_RATIO,
  deriveGrid,
  getGridOptions,
  gridToLevel,
  isAspectRatioId,
} from 'lib/aspectRatio';
import EditArtworkHeader from 'components/edit-artwork-page/EditArtworkHeader';
import ButtonSelectGroup from 'components/ButtonSelectGroup';
import ValueSlider from 'components/ValueSlider';
import ToggleSwitch from 'components/ToggleSwitch';
import { buildDoodleSource, type OptionValue } from 'lib/doodleSource';
import styles from './EditArtwork.module.css';

const Doodle = dynamic(() => import('components/Doodle'), {
  ssr: false,
});

const ColorPicker = dynamic(() => import('components/ColorPicker'), {
  ssr: false,
});

// Options with this id hold a "colsxrows" grid string and follow the selected
// aspect ratio so that cells stay (near-)square.
const GRID_OPTION_ID = 'grid';

const SEED_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Replaces randomstring.generate({ length: 4 }) — a short alphanumeric seed.
const randomSeed = (length = 4) =>
  Array.from(
    { length },
    () => SEED_CHARS[Math.floor(Math.random() * SEED_CHARS.length)]
  ).join('');

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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The value an option takes according to the URL, falling back to the
  // authored default when the param is absent or malformed (a hand-edited URL
  // must not feed NaN into a slider, which would blank the control).
  const optionFromQuery = (option: ArtworkOption): OptionValue => {
    const queryVal = searchParams.get(option.id);

    if (queryVal === null) {
      return option.default;
    }

    if (typeof option.default === 'number') {
      const numericVal = Number(queryVal);

      return Number.isNaN(numericVal) ? option.default : numericVal;
    }

    if (typeof option.default === 'boolean') {
      return queryVal === 'true';
    }

    return queryVal;
  };

  const paletteFromQuery = (): string[] => {
    const queryPalette = searchParams.getAll('palette');

    return artwork.palette && queryPalette.length === artwork.palette.length
      ? queryPalette
      : artwork.palette ?? [];
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
  const [palette, setPalette] = useState<string[]>(paletteFromQuery);
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
  const doodleRef = useRef<any>(null);
  const expandedDoodleRef = useRef<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScreenXS = useMediaQuery('(max-width: 747.99px)');
  const isTwoColumn = useMediaQuery('(min-width: 992px)');
  const baseWidth = isScreenXS ? 240 : 360;

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
  // setter is guarded so an echo of our own router.replace is a no-op.
  useEffect(() => {
    const queryPalette = paletteFromQuery();

    if (!arraysEqual(palette, queryPalette)) {
      setPalette(queryPalette);
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

    palette.forEach((color) => newParams.append('palette', color));
    newParams.set('seed', seed);
    if (!lockedAspectRatio) {
      newParams.set('aspectRatio', aspectRatio);
    }
    artwork.options.forEach((option, index) => {
      newParams.set(option.id, String(optionValues[index]));
    });

    if (newParams.toString() !== searchParams.toString()) {
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, palette, optionValues, aspectRatio]);

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

  const randomizePalette = () => {
    setPalette((prev) => prev.map(() => randomHexColor()));
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
    await doodleRef.current?.export({
      // Cap the longer edge at ~3000px so exports stay a sensible size in any
      // orientation.
      scale: Math.ceil(3000 / Math.max(width, height)),
      download: true,
    });
  };

  // Build the css-doodle source for a given canvas size. The pattern depends
  // only on the seed and grid, so the same seed produces the same artwork at
  // any size — letting the expanded dialog render a larger copy that matches.
  const buildSource = (canvasWidth: number, canvasHeight: number) =>
    buildDoodleSource({
      code: artwork.code,
      options: artwork.options,
      palette,
      optionValues,
      width: `${canvasWidth}px`,
      height: `${canvasHeight}px`,
    });

  // Derived straight from state (cheap string substitution), so the preview
  // can never lag a render behind the controls.
  const { styleCode, doodleCode } = buildSource(width, height);

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

  // Fit the artwork inside the viewport (with a little margin) for the dialog.
  const expanded = fitToBox(
    aspectRatio,
    (viewport?.width ?? 1200) * 0.9,
    (viewport?.height ?? 800) * 0.9
  );
  const expandedSource = isExpanded
    ? buildSource(expanded.width, expanded.height)
    : null;

  return (
    <div className={styles.pageWrapper}>
      <EditArtworkHeader onRedraw={randomizeSeed} onExport={exportArtwork} />

      <main className={styles.editArtworkSection}>
        <Dialog.Root open={isExpanded} onOpenChange={setIsExpanded}>
          <div
            ref={previewRef}
            className={styles.previewWrapper}
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
              <Doodle
                name={artwork.slug}
                seed={seed}
                styleCode={styleCode}
                doodleCode={doodleCode}
                doodleRef={doodleRef}
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
                className={styles.dialogDoodle}
                style={{ backgroundColor: previewBackground }}
              >
                {expandedSource && (
                  <Doodle
                    name={`${artwork.slug}-expanded`}
                    seed={seed}
                    styleCode={expandedSource.styleCode}
                    doodleCode={expandedSource.doodleCode}
                    doodleRef={expandedDoodleRef}
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
                </div>
                <div className="colors">
                  {palette.map((hex, index) => (
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
