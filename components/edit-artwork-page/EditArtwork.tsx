'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useMediaQuery from 'lib/useMediaQuery';
import type { Artwork, ArtworkOption } from 'lib/artwork';
import {
  type AspectRatioId,
  RATIO_PRESETS,
  DEFAULT_ASPECT_RATIO,
  deriveGrid,
  getCanvasSize,
  getGridOptions,
  gridToLevel,
  isValidRatio,
} from 'lib/aspectRatio';
import EditArtworkHeader from 'components/edit-artwork-page/EditArtworkHeader';
import ButtonSelectGroup from 'components/ButtonSelectGroup';
import CustomRatioInput from 'components/CustomRatioInput';
import ValueSlider from 'components/ValueSlider';
import ToggleSwitch from 'components/ToggleSwitch';
import styles from './EditArtwork.module.css';

const Doodle = dynamic(() => import('components/Doodle'), {
  ssr: false,
});

const ColorPicker = dynamic(() => import('components/ColorPicker'), {
  ssr: false,
});

type OptionValue = string | number | boolean;

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

const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

// css-doodle >= 0.5 reads `@random(1)` as a one-cell count rather than a 100%
// probability gate (fractional values still behave as probabilities). The
// artwork definitions were authored against css-doodle 0.12 where `@random(1)`
// meant "every cell", so nudge the fully-on case just under 1 to preserve the
// original look at maximum frequency.
const fixFullRandomGate = (code: string) =>
  code.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');

export default function EditArtwork({ artwork }: { artwork: Artwork }) {
  // A preset may pin itself to a single aspect ratio (e.g. Symmetry), in which
  // case the selector is hidden and the ratio can't change.
  const lockedAspectRatio = artwork.lockAspectRatio ?? null;
  const initialAspectRatio =
    lockedAspectRatio ?? artwork.defaultAspectRatio ?? DEFAULT_ASPECT_RATIO;

  const [palette, setPalette] = useState<string[]>(artwork.palette ?? []);
  const [optionValues, setOptionValues] = useState<OptionValue[]>(() =>
    artwork.options.map((option) => option.default)
  );
  const [aspectRatio, setAspectRatio] =
    useState<AspectRatioId>(initialAspectRatio);
  const [styleCode, setStyleCode] = useState('');
  const [doodleCode, setDoodleCode] = useState('');
  const [seed, setSeed] = useState('0000');
  const doodleRef = useRef<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isScreenXS = useMediaQuery('(max-width: 747.99px)');
  const baseWidth = isScreenXS ? 240 : 360;
  const { width, height } = getCanvasSize(aspectRatio, baseWidth);

  // Sync component state FROM the URL search params.
  useEffect(() => {
    const queryPalette = searchParams.getAll('palette');

    if (
      artwork.palette &&
      queryPalette.length === artwork.palette.length &&
      !arraysEqual(palette, queryPalette)
    ) {
      setPalette(queryPalette);
    }

    artwork.options.forEach((option, optionIndex) => {
      if (!searchParams.has(option.id)) {
        return;
      }

      const queryVal = searchParams.get(option.id) ?? '';

      if (typeof option.default === 'string') {
        setOptionByIndex(optionIndex, queryVal);
      } else if (typeof option.default === 'number') {
        const numericVal = Number(queryVal);

        // Ignore malformed numbers so a hand-edited URL can't feed NaN into a
        // slider (which would blank the control).
        if (!Number.isNaN(numericVal)) {
          setOptionByIndex(optionIndex, numericVal);
        }
      } else if (typeof option.default === 'boolean') {
        setOptionByIndex(optionIndex, queryVal === 'true');
      }
    });

    if (searchParams.has('seed') && seed !== searchParams.get('seed')) {
      setSeed(searchParams.get('seed') as string);
    }

    const queryAspectRatio = searchParams.get('aspectRatio');

    if (
      !lockedAspectRatio &&
      queryAspectRatio &&
      isValidRatio(queryAspectRatio) &&
      queryAspectRatio !== aspectRatio
    ) {
      setAspectRatio(queryAspectRatio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    updateDoodleCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreenXS, palette, optionValues, aspectRatio]);

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

  const getColorsStyleCode = (colors: string[]) =>
    colors.map((color, idx) => `--color${idx}: ${color};\n`).join('');

  const updateDoodleCode = () => {
    let newStyleCode = artwork.code.style;
    let newDoodleCode = artwork.code.doodle;

    artwork.options.forEach((option, index) => {
      switch (option.type) {
        case 'ButtonSelectGroup':
        case 'Slider':
          newStyleCode = newStyleCode
            .split(option.replace)
            .join(String(optionValues[index]));

          newDoodleCode = newDoodleCode
            .split(option.replace)
            .join(String(optionValues[index]));

          break;
        case 'ToggleSwitch':
          if (optionValues[index]) {
            newStyleCode = newStyleCode
              .split(option.replace)
              .join(option.code ?? '');
            newDoodleCode = newDoodleCode
              .split(option.replace)
              .join(String(optionValues[index]));
          } else {
            newStyleCode = newStyleCode.split(option.replace).join('');
            newDoodleCode = newDoodleCode.split(option.replace).join('');
          }
          break;
        default:
          break;
      }
    });

    newDoodleCode = newDoodleCode.split('${width}').join(`${width}px`);
    newDoodleCode = newDoodleCode.split('${height}').join(`${height}px`);

    newStyleCode = fixFullRandomGate(newStyleCode);
    newDoodleCode = fixFullRandomGate(newDoodleCode);

    newStyleCode = getColorsStyleCode(palette) + newStyleCode;

    setStyleCode(newStyleCode);
    setDoodleCode(newDoodleCode);
  };

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

  return (
    <div className={styles.pageWrapper}>
      <EditArtworkHeader onRedraw={randomizeSeed} onExport={exportArtwork} />

      <main className={styles.editArtworkSection}>
        <div
          className={styles.previewWrapper}
          style={{
            backgroundColor: palette.length > 0 ? palette[0] : 'transparent',
          }}
        >
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

        <div className={styles.optionsWrapper}>
          <div className={styles.options}>
            {palette.length > 0 && (
              <div className={styles.optionBox}>
                <h3>Palette</h3>
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
                  options={[...RATIO_PRESETS]}
                  value={aspectRatio}
                  onChange={(value) =>
                    changeAspectRatio(value as AspectRatioId)
                  }
                />
                <CustomRatioInput
                  value={aspectRatio}
                  onChange={changeAspectRatio}
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
