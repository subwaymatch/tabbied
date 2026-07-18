'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Dialog } from '@base-ui-components/react/dialog';
import { Check, Expand, X, Minus, Plus } from 'lucide-react';
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
import PaletteChip from 'components/edit-artwork-page/PaletteChip';
import ValueSlider from 'components/ValueSlider';
import ToggleSwitch from 'components/ToggleSwitch';
import ColorSwatch from 'components/ColorSwatch';
import PaletteEditorDialog from 'components/palette/PaletteEditorDialog';
import SectionPager from 'components/palette/SectionPager';
import { usePaletteEditor } from 'components/palette/usePaletteEditor';
import { useConfirmDelete } from 'components/palette/useConfirmDelete';
import { PALETTE_LIBRARY } from 'lib/paletteLibrary';
import {
  isTransparentHex,
  randomHexColor,
  toColorInputValue,
  toOpaqueHex,
} from 'lib/color';
import {
  deletePalette,
  getBrandPaletteState,
  resolveActivePalette,
  setActivePalette,
  useBrandPalettes,
  useDraftPreview,
  type BrandPalette,
} from 'lib/brandPalettes';
import styles from './EditArtwork.module.css';

// Options with this id hold a "colsxrows" grid string and follow the selected
// aspect ratio so that cells stay (near-)square.
const GRID_OPTION_ID = 'grid';

// Chips per page in the Your Palettes / Palette Library sections.
const CHIP_PER_PAGE = 4;

// Longest edge of the little aspect-ratio glyph rectangle, in pixels.
const RATIO_GLYPH_SIZE = 12;

// Fraction of the preview area the artwork fills, leaving a margin around it.
const PREVIEW_FIT_MARGIN = 0.9;

// The paletteSource marker for "the artwork's own colors" / a freely-edited
// palette — neither highlights any chip.
type PaletteSource = 'artwork' | 'custom' | string;

// Largest width/height for `ratio` that fits inside a maxW × maxH box.
const fitToBox = (ratio: AspectRatioId, maxW: number, maxH: number) => {
  const [rw, rh] = ASPECT_RATIOS[ratio];
  const scale = Math.min(maxW / rw, maxH / rh);

  return { width: Math.round(rw * scale), height: Math.round(rh * scale) };
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
  const lockedAspectRatio = artwork.lockAspectRatio ?? null;
  const defaultAspectRatio =
    lockedAspectRatio ?? artwork.defaultAspectRatio ?? DEFAULT_ASPECT_RATIO;

  const paletteDefaults = artwork.palette ?? [];
  const minColors = artwork.colors?.min ?? paletteDefaults.length;
  const maxColors = artwork.colors?.max ?? paletteDefaults.length;
  const defaultColors = artwork.colors?.default ?? paletteDefaults.length;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const brandState = useBrandPalettes();
  const brandPalettes = brandState.palettes;
  // The active palette shared with the gallery — a saved palette or a curated
  // library palette (opening an artwork picks up whatever the gallery previews).
  const activeCustomPalette = resolveActivePalette(brandState);

  const draftPreview = useDraftPreview();

  // Which palette (if any) the editor's swatches currently reflect, driving the
  // chip outline. 'artwork'/'custom' highlight no chip; a palette id highlights
  // that chip. Any manual swatch edit switches this to 'custom'.
  const [paletteSource, setPaletteSource] = useState<PaletteSource>('artwork');
  const [savedPage, setSavedPage] = useState(0);
  const [libPage, setLibPage] = useState(0);

  const customPaletteColors = (custom: BrandPalette): string[] =>
    custom.colors.map((color, index) =>
      index === 0 && custom.transparentBackground ? `${color}00` : color
    );

  const customPaletteToEditor = (
    custom: BrandPalette
  ): { palette: string[]; count: number } => {
    const colors = customPaletteColors(custom);
    const next = [...paletteDefaults];
    const limit = Math.min(colors.length, next.length);

    for (let i = 0; i < limit; i += 1) next[i] = colors[i];

    return {
      palette: next,
      count: Math.min(maxColors, Math.max(minColors, colors.length)),
    };
  };

  const urlHadPaletteAtMount = useRef<boolean | null>(null);

  if (urlHadPaletteAtMount.current === null) {
    const n = searchParams.getAll('palette').length;
    urlHadPaletteAtMount.current = n >= minColors && n <= maxColors;
  }

  const initialCustomApplied = useRef(false);

  const optionFromQuery = (option: ArtworkOption): OptionValue => {
    const queryVal = searchParams.get(option.id);

    if (queryVal === null) {
      return option.default;
    }

    if (typeof option.default === 'number') {
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
      if (option.id === GRID_OPTION_ID) {
        return /^\d+x\d+$/.test(queryVal) ? queryVal : option.default;
      }

      return option.options?.includes(queryVal) ? queryVal : option.default;
    }

    return queryVal;
  };

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

    if (activeCustomPalette && paletteDefaults.length > 0) {
      return customPaletteToEditor(activeCustomPalette);
    }

    return { palette: paletteDefaults, count: defaultColors };
  };

  const aspectRatioFromQuery = (): AspectRatioId => {
    const queryRatio = searchParams.get('aspectRatio');

    return !lockedAspectRatio && queryRatio && isAspectRatioId(queryRatio)
      ? queryRatio
      : defaultAspectRatio;
  };

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

  const selfWrites = useRef<Set<string>>(new Set());
  const isScreenXS = useMediaQuery('(max-width: 747.99px)');
  const isTwoColumn = useMediaQuery('(min-width: 992px)');
  const baseWidth = isScreenXS ? 240 : 360;

  const { width, height } = previewSize
    ? fitToBox(
        aspectRatio,
        previewSize.width * PREVIEW_FIT_MARGIN,
        (isTwoColumn ? previewSize.height : (viewport?.height ?? 800) * 0.6) *
          PREVIEW_FIT_MARGIN
      )
    : fitToBox(aspectRatio, baseWidth, baseWidth * 1.5);

  // Sync component state FROM the URL search params when they change externally.
  useEffect(() => {
    const currentParams = searchParams.toString();

    if (selfWrites.current.has(currentParams)) {
      selfWrites.current.delete(currentParams);
      return;
    }

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

  // Apply the gallery's selected palette on first load, once, and mark it as the
  // active chip. A shared link that carries its own palette wins (source stays
  // "custom" — the link's colors, not a named palette).
  useEffect(() => {
    if (initialCustomApplied.current) return;

    if (urlHadPaletteAtMount.current || paletteDefaults.length === 0) {
      initialCustomApplied.current = true;
      if (urlHadPaletteAtMount.current) setPaletteSource('custom');
      return;
    }

    if (!activeCustomPalette) return;

    initialCustomApplied.current = true;
    const { palette: nextPalette, count } =
      customPaletteToEditor(activeCustomPalette);
    setPalette(nextPalette);
    setColorCount(count);
    setPaletteSource(activeCustomPalette.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCustomPalette]);

  useEffect(() => {
    const updateViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

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

    const nextParams = newParams.toString();

    if (nextParams !== searchParams.toString()) {
      if (selfWrites.current.size > 32) selfWrites.current.clear();
      selfWrites.current.add(nextParams);

      window.history.replaceState(null, '', `${pathname}?${nextParams}`);
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

  // Randomize only the visible colors; hidden slots keep their stored values.
  // A transparent background is preserved (only the inks reroll).
  const randomizePalette = () => {
    setPalette((prev) =>
      prev.map((color, index) => {
        if (index >= colorCount) return color;
        if (index === 0 && isTransparentHex(color)) return color;

        return randomHexColor();
      })
    );
    setPaletteSource('custom');
  };

  const changeColorCount = (delta: number) => {
    setColorCount((prev) =>
      Math.min(maxColors, Math.max(minColors, prev + delta))
    );
    setPaletteSource('custom');
  };

  // Apply a saved / library palette to the editor's swatches.
  const applyBrandPalette = (brand: BrandPalette) => {
    const colors = customPaletteColors(brand);

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

  const editor = usePaletteEditor({
    onSaved: (saved) => {
      applyBrandPalette(saved);
      setActivePalette(saved.id);
      setPaletteSource(saved.id);

      const state = getBrandPaletteState();
      const index = state.palettes.findIndex((p) => p.id === saved.id);

      if (index >= 0) setSavedPage(Math.floor(index / CHIP_PER_PAGE));
    },
  });

  const confirmDelete = useConfirmDelete((id) => {
    deletePalette(id);
    if (paletteSource === id) setPaletteSource('custom');
  });

  // Select a saved palette chip: clicking the active one opens it for editing,
  // otherwise apply + mark active (shared with the gallery).
  const onSelectSavedChip = (saved: BrandPalette) => {
    if (paletteSource === saved.id) {
      editor.openEditor(saved);
      return;
    }

    applyBrandPalette(saved);
    setActivePalette(saved.id);
    setPaletteSource(saved.id);
  };

  const onSelectLibraryChip = (library: (typeof PALETTE_LIBRARY)[number]) => {
    const brand: BrandPalette = { id: library.id, name: library.name, colors: library.colors };

    applyBrandPalette(brand);
    setActivePalette(library.id);
    setPaletteSource(library.id);
  };

  const setTransparentBackground = (transparent: boolean) => {
    setPalette((prev) => {
      const next = [...prev];
      const opaque = toOpaqueHex(next[0] ?? '#f8f9fa');

      next[0] = transparent ? `${opaque}00` : opaque;

      return next;
    });
  };

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
      scale: Math.ceil(3000 / Math.max(width, height)),
      download: true,
    });
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard unavailable — nothing to do.
    }
  };

  const copyReactComponent = async () => {
    const activePalette = palette.slice(0, colorCount);
    const paletteLiteral = activePalette.map((color) => `'${color}'`).join(', ');
    const optionEntries = artwork.options.map(
      (option, index) => [option.id, optionValues[index]] as const
    );
    const optionsLiteral = optionEntries
      .map(([id, value]) =>
        typeof value === 'string' ? `${id}: '${value}'` : `${id}: ${value}`
      )
      .join(', ');

    const lines = [
      `import { TabbiedArtwork } from 'tabbied/react';`,
      `import { ${artwork.slug} } from 'tabbied/artworks';`,
      ``,
      `<TabbiedArtwork`,
      `  artwork={${artwork.slug}}`,
      `  seed="${seed}"`,
      `  palette={[${paletteLiteral}]}`,
      ...(optionEntries.length ? [`  options={{ ${optionsLiteral} }}`] : []),
      `/>`,
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
    } catch {
      // Clipboard unavailable — nothing to do.
    }
  };

  const overlayPreviewColors = (colors: string[]): string[] => {
    const next = [...paletteDefaults];
    const limit = Math.min(colors.length, next.length);

    for (let i = 0; i < limit; i += 1) next[i] = colors[i];

    const count = Math.min(maxColors, Math.max(minColors, colors.length));

    return next.slice(0, count);
  };

  const displayPalette = draftPreview
    ? overlayPreviewColors(draftPreview)
    : palette.slice(0, colorCount);

  const artworkProps = {
    artwork,
    seed,
    palette: displayPalette,
    options: Object.fromEntries(
      artwork.options.map((option, index) => [option.id, optionValues[index]])
    ),
  } as const;

  const previewBackground =
    displayPalette.length > 0 ? displayPalette[0] : 'transparent';
  const expandIconColor = getExpandIconColor(previewBackground);

  const previewIsTransparent =
    previewBackground === 'transparent' || isTransparentHex(previewBackground);

  const bgIsTransparent = isTransparentHex(palette[0] ?? '');

  const expanded = fitToBox(
    aspectRatio,
    (viewport?.width ?? 1200) * 0.9,
    (viewport?.height ?? 800) * 0.9
  );

  // ---- Grouped inspector controls ----

  const savedPageCount = Math.max(
    1,
    Math.ceil(brandPalettes.length / CHIP_PER_PAGE)
  );
  const clampedSavedPage = Math.min(savedPage, savedPageCount - 1);
  const savedRows = brandPalettes.slice(
    clampedSavedPage * CHIP_PER_PAGE,
    clampedSavedPage * CHIP_PER_PAGE + CHIP_PER_PAGE
  );

  const libPageCount = Math.max(
    1,
    Math.ceil(PALETTE_LIBRARY.length / CHIP_PER_PAGE)
  );
  const clampedLibPage = Math.min(libPage, libPageCount - 1);
  const libRows = PALETTE_LIBRARY.slice(
    clampedLibPage * CHIP_PER_PAGE,
    clampedLibPage * CHIP_PER_PAGE + CHIP_PER_PAGE
  );

  const hasEffects = artwork.options.some(
    (option) => option.type === 'ToggleSwitch'
  );

  const renderRatioTile = (id: AspectRatioId) => {
    const [rw, rh] = ASPECT_RATIOS[id];
    const scale = RATIO_GLYPH_SIZE / Math.max(rw, rh);
    const selected = id === aspectRatio;

    return (
      <button
        key={id}
        type="button"
        title={id}
        aria-label={id}
        aria-pressed={selected}
        className={
          selected ? `${styles.ratioTile} ${styles.ratioTileActive}` : styles.ratioTile
        }
        onClick={() => changeAspectRatio(id)}
      >
        <span
          className={styles.ratioGlyph}
          style={{ width: `${rw * scale}px`, height: `${rh * scale}px` }}
        />
      </button>
    );
  };

  const renderLayoutOption = (option: ArtworkOption, index: number) => {
    const value = optionValues[index];
    const onChange = (next: OptionValue) => setOptionByIndex(index, next);

    if (option.type === 'ButtonSelectGroup') {
      const options =
        option.id === GRID_OPTION_ID
          ? getGridOptions(aspectRatio)
          : option.options;

      if (!options || options.length === 0) return null;

      const label = option.id === GRID_OPTION_ID ? 'Grid density' : option.displayName;

      return (
        <div className={styles.layoutRow} key={option.id}>
          <span className={styles.layoutLabel}>{label}</span>
          <div className={styles.segmented} role="group" aria-label={label}>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={opt === value}
                className={
                  opt === value
                    ? `${styles.segment} ${styles.segmentActive}`
                    : styles.segment
                }
                onClick={() => onChange(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (option.type === 'Slider') {
      const step = option.step ?? 1;
      const formatted = step < 1 ? Number(value).toFixed(1) : String(value);

      return (
        <div key={option.id} className={styles.sliderBlock}>
          <div className={styles.layoutRow}>
            <span className={styles.layoutLabel}>{option.displayName}</span>
            <span className={styles.layoutValue}>{formatted}</span>
          </div>
          <ValueSlider
            min={option.min!}
            max={option.max!}
            step={option.step!}
            value={value as number}
            onChange={onChange}
            label={option.displayName}
            hideValue
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.pageWrapper}>
      <EditArtworkHeader
        artworkName={artwork.name}
        onShuffleAll={() => {
          randomizeSeed();
          randomizePalette();
        }}
        onShuffleLayout={randomizeSeed}
        onShuffleColors={randomizePalette}
        onExportPng={exportArtwork}
        onCopyLink={copyShareLink}
        onCopyReactComponent={copyReactComponent}
      />

      <main className={styles.editArtworkSection}>
        <Dialog.Root open={isExpanded} onOpenChange={setIsExpanded}>
          <div
            ref={previewRef}
            className={
              previewIsTransparent
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
              <Expand size={18} />
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
                  previewIsTransparent
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

        <div className={styles.panel}>
          {palette.length > 0 && (
            <section className={styles.group}>
              <h2 className={styles.groupTitle}>Colors</h2>

              <div className={styles.colorsRow}>
                <div className={styles.bgGroup}>
                  <div
                    className={styles.bgSwatchBox}
                    role="group"
                    aria-label="Background"
                  >
                    <span
                      className={styles.bgSwatch}
                      title="Background color"
                    >
                      <input
                        type="color"
                        className={styles.bgInput}
                        aria-label="Background color"
                        value={toColorInputValue(palette[0])}
                        style={{ opacity: bgIsTransparent ? 0.3 : 1 }}
                        onChange={(event) => {
                          const hex = event.target.value;
                          setPalette((prev) => {
                            const next = [...prev];
                            next[0] = hex;

                            return next;
                          });
                          setPaletteSource('custom');
                        }}
                      />
                      <span className={styles.bgStrip} aria-hidden="true" />
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={bgIsTransparent}
                      title="Transparent background"
                      className={
                        bgIsTransparent
                          ? `${styles.transButton} ${styles.transButtonActive}`
                          : styles.transButton
                      }
                      onClick={() => setTransparentBackground(!bgIsTransparent)}
                    >
                      {bgIsTransparent && <Check size={15} />}
                    </button>
                  </div>
                  <span className={styles.groupCaption}>background</span>
                </div>

                <div className={styles.inksGroup}>
                  <div className={styles.inksRow}>
                    <div className={styles.inksWrap}>
                      {palette.slice(1, colorCount).map((hex, inkIndex) => {
                        const index = inkIndex + 1;

                        return (
                          <ColorSwatch
                            key={`color${index}`}
                            className={styles.inkSwatch}
                            ariaLabel={`Color ${index + 1}`}
                            color={hex}
                            onChange={(newHex) => {
                              setPalette((prev) => {
                                const next = [...prev];
                                next[index] = newHex;

                                return next;
                              });
                              setPaletteSource('custom');
                            }}
                          />
                        );
                      })}
                    </div>

                    {minColors < maxColors && (
                      <div
                        className={styles.countGroup}
                        role="group"
                        aria-label="Number of colors"
                      >
                        <button
                          type="button"
                          className={styles.countButton}
                          onClick={() => changeColorCount(-1)}
                          disabled={colorCount <= minColors}
                          aria-label="Remove color"
                          title="Remove color"
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.countButton}
                          onClick={() => changeColorCount(1)}
                          disabled={colorCount >= maxColors}
                          aria-label="Add color"
                          title="Add color"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <span className={styles.groupCaption}>inks</span>
                </div>
              </div>

              <div className={styles.chipsSection}>
                <div className={styles.chipsHeader}>
                  <span className={styles.chipsLabel}>Your Palettes</span>
                  <SectionPager
                    page={clampedSavedPage}
                    pageCount={savedPageCount}
                    onPageChange={setSavedPage}
                    label="palettes"
                  />
                </div>
                <div className={styles.chipsRow}>
                  {savedRows.map((saved) => (
                    <PaletteChip
                      key={saved.id}
                      colors={saved.colors}
                      transparentBackground={saved.transparentBackground}
                      name={saved.name || 'Untitled'}
                      active={paletteSource === saved.id}
                      title={
                        paletteSource === saved.id
                          ? 'Edit this palette'
                          : `Fill the swatches with "${saved.name || 'Untitled'}"`
                      }
                      onClick={() => onSelectSavedChip(saved)}
                      canDelete
                      deleteConfirming={confirmDelete.pendingId === saved.id}
                      deleteLabel={`Delete ${saved.name || 'palette'}`}
                      onDelete={() => confirmDelete.request(saved.id)}
                    />
                  ))}
                  <button
                    type="button"
                    className={styles.newChip}
                    onClick={() => editor.openEditor()}
                    title="Create a new palette"
                  >
                    <Plus size={13} /> New Palette
                  </button>
                </div>
              </div>

              <div className={styles.chipsSection}>
                <div className={styles.chipsHeader}>
                  <span className={styles.chipsLabel}>Palette Library</span>
                  <SectionPager
                    page={clampedLibPage}
                    pageCount={libPageCount}
                    onPageChange={setLibPage}
                    label="palettes"
                  />
                </div>
                <div className={styles.chipsRow}>
                  {libRows.map((library) => (
                    <PaletteChip
                      key={library.id}
                      colors={library.colors}
                      name={library.name}
                      active={paletteSource === library.id}
                      title={`Fill the swatches with "${library.name}"`}
                      onClick={() => onSelectLibraryChip(library)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className={styles.group}>
            <h2 className={styles.groupTitle}>Layout</h2>

            {!lockedAspectRatio && (
              <div className={styles.layoutRow}>
                <span className={styles.layoutLabel}>Aspect ratio</span>
                <div className={styles.ratioTiles}>
                  {ASPECT_RATIO_IDS.map((id) => renderRatioTile(id))}
                </div>
              </div>
            )}

            {artwork.options.map((option, index) =>
              renderLayoutOption(option, index)
            )}
          </section>

          {hasEffects && (
            <section className={styles.group}>
              <h2 className={styles.groupTitle}>Effects</h2>
              {artwork.options.map((option, index) =>
                option.type === 'ToggleSwitch' ? (
                  <label key={option.id} className={styles.effectsRow}>
                    {option.displayName}
                    <ToggleSwitch
                      small
                      isChecked={optionValues[index] as boolean}
                      onChange={(value) => setOptionByIndex(index, value)}
                    />
                  </label>
                ) : null
              )}
            </section>
          )}
        </div>
      </main>

      <PaletteEditorDialog
        draft={editor.draft}
        setDraft={editor.setDraft}
        draftError={editor.draftError}
        onClose={editor.closeEditor}
        onSave={editor.saveDraft}
        onDelete={editor.removeDraftPalette}
        onShuffleOrder={editor.shuffleDraftOrder}
        setDraftColor={editor.setDraftColor}
      />
    </div>
  );
}
