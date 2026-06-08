'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import randomstring from 'randomstring';
import _ from 'lodash';
import useMediaQuery from 'lib/useMediaQuery';
import EditArtworkHeader from 'components/edit-artwork-page/EditArtworkHeader';
import ButtonSelectGroup from 'components/ButtonSelectGroup';
import ValueSlider from 'components/ValueSlider';
import ToggleSwitch from 'components/ToggleSwitch';
import styles from './EditArtwork.module.scss';

const Doodle = dynamic(() => import('components/Doodle'), {
  ssr: false,
});

const ColorPicker = dynamic(() => import('components/ColorPicker'), {
  ssr: false,
});

// css-doodle >= 0.5 reads `@random(1)` as a one-cell count rather than a 100%
// probability gate (fractional values still behave as probabilities). The
// artwork definitions were authored against css-doodle 0.12 where `@random(1)`
// meant "every cell", so nudge the fully-on case just under 1 to preserve the
// original look at maximum frequency.
const fixFullRandomGate = (code: string) =>
  code.replace(/@random\s*\(\s*1(?:\.0+)?\s*\)/g, '@random(0.999)');

export default function EditArtwork({ artwork }: { artwork: any }) {
  const [palette, setPalette] = useState(
    artwork.hasOwnProperty('palette') ? artwork.palette : []
  );
  const [optionValues, setOptionValues] = useState(
    _.cloneDeep(artwork.options.map((o) => o.default))
  );
  const [styleCode, setStyleCode] = useState('');
  const [doodleCode, setDoodleCode] = useState('');
  const [seed, setSeed] = useState('0000');
  const doodleRef = React.createRef<any>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isScreenXS = useMediaQuery('(max-width: 747.99px)');
  const width = isScreenXS ? 240 : 360;
  const height = width * 1.5;

  // Sync component state FROM the URL search params.
  useEffect(() => {
    const queryPalette = searchParams.getAll('palette');

    if (
      artwork.palette &&
      queryPalette.length === artwork.palette.length &&
      !_.isEqual(palette, queryPalette)
    ) {
      setPalette(queryPalette);
    }

    artwork.options.forEach((option, optionIndex) => {
      if (searchParams.has(option.id)) {
        const queryVal = searchParams.get(option.id);

        if (typeof option.default === 'string') {
          setOptionByIndex(optionIndex, queryVal);
        } else if (typeof option.default === 'number') {
          setOptionByIndex(optionIndex, Number(queryVal));
        } else if (typeof option.default === 'boolean') {
          setOptionByIndex(optionIndex, queryVal === 'true');
        }
      }
    });

    if (searchParams.has('seed') && seed !== searchParams.get('seed')) {
      setSeed(searchParams.get('seed') as string);
    }
  }, [searchParams]);

  useEffect(() => {
    updateDoodleCode();
  }, [isScreenXS, palette, optionValues]);

  // Sync the URL search params FROM component state if necessary.
  useEffect(() => {
    // Leave the URL untouched until it carries at least one search param
    // (matches the original behaviour which skipped when only `id` was set).
    if (searchParams.toString() === '') {
      return;
    }

    const newParams = new URLSearchParams();

    palette.forEach((color: string) => newParams.append('palette', color));
    newParams.set('seed', seed);
    artwork.options.forEach((o, idx) => {
      newParams.set(o.id, String(optionValues[idx]));
    });

    if (newParams.toString() !== searchParams.toString()) {
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [seed, palette, optionValues]);

  const setOptionByIndex = (index: number, value: any) => {
    setOptionValues((prev) => {
      const newValues = _.clone(prev);
      newValues[index] = value;

      return newValues;
    });
  };

  const randomizeSeed = () => {
    setSeed(randomstring.generate({ length: 4 }));
  };

  const exportArtwork = async () => {
    await (doodleRef.current as any).export({
      scale: Math.ceil(3000 / width),
      download: true,
    });
  };

  const getColorsStyleCode = (colors) => {
    let colorStyleVariables = '';

    colors.forEach((color, idx) => {
      colorStyleVariables += `--color${idx}: ${color};\n`;
    });

    return colorStyleVariables;
  };

  const updateDoodleCode = () => {
    let newStyleCode = artwork.code.style;
    let newDoodleCode = artwork.code.doodle;

    artwork.options.forEach((option, index) => {
      switch (option.type) {
        case 'ButtonSelectGroup':
        case 'Slider':
          newStyleCode = newStyleCode
            .split(option.replace)
            .join(optionValues[index]);

          newDoodleCode = newDoodleCode
            .split(option.replace)
            .join(optionValues[index]);

          break;
        case 'ToggleSwitch':
          if (optionValues[index]) {
            newStyleCode = newStyleCode.split(option.replace).join(option.code);
            newDoodleCode = newDoodleCode
              .split(option.replace)
              .join(optionValues[index]);
          } else {
            newStyleCode = newStyleCode.split(option.replace).join('');
            newDoodleCode = newDoodleCode.split(option.replace).join('');
          }
          break;
        default:
          break;
      }
    });

    newDoodleCode = newDoodleCode.split('${width}').join(String(width) + 'px');
    newDoodleCode = newDoodleCode
      .split('${height}')
      .join(String(height) + 'px');

    newStyleCode = fixFullRandomGate(newStyleCode);
    newDoodleCode = fixFullRandomGate(newDoodleCode);

    newStyleCode = getColorsStyleCode(palette) + newStyleCode;

    setStyleCode(newStyleCode);
    setDoodleCode(newDoodleCode);
  };

  const getOptionControlComponent = (
    option: any,
    optionIndex: number
  ): React.ReactNode => {
    const controlValue = optionValues[optionIndex];
    const onChange = (value) => setOptionByIndex(optionIndex, value);

    let componentJsx = null;

    switch (option.type) {
      case 'ButtonSelectGroup':
        componentJsx =
          option.options && option.options.length > 0 ? (
            <ButtonSelectGroup
              options={option.options}
              value={controlValue}
              onChange={onChange}
            />
          ) : null;
        break;
      case 'Slider':
        componentJsx = (
          <div className={styles.valueSliderWrapper}>
            <ValueSlider
              min={option.min}
              max={option.max}
              step={option.step}
              value={controlValue}
              onChange={onChange}
            />
          </div>
        );
        break;
      case 'ToggleSwitch':
        componentJsx = (
          <ToggleSwitch isChecked={controlValue} onChange={onChange} />
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
                      key={'color' + index}
                      index={index}
                      handleColorChange={(color) => {
                        const colorHEXAString = color.toHEXA().toString();

                        setPalette((prevPalette) => {
                          const newPalette = _.clone(prevPalette);
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

            {artwork.options.map((option, optionIndex) =>
              getOptionControlComponent(option, optionIndex)
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
