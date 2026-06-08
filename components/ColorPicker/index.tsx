'use client';

import { useEffect } from 'react';
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/monolith.min.css';

type PickrColor = { toHEXA: () => { toString: () => string } };

type ColorPickerProps = {
  index: number;
  color: string;
  handleColorChange: (color: PickrColor) => void;
};

export default function ColorPicker({
  index,
  color,
  handleColorChange,
}: ColorPickerProps) {
  const pickerClassName = `color-picker-${index}`;

  useEffect(() => {
    const pickr = Pickr.create({
      el: `.${pickerClassName}`,
      theme: 'monolith',
      default: color,
      defaultRepresentation: 'HEXA',
      swatches: [],
      components: {
        // Main components
        preview: true,
        hue: true,
        opacity: true,

        // Input / output options
        interaction: {
          hex: false,
          rgba: false,
          hsva: false,
          input: true,
          clear: false,
          save: true,
        },
      },
    });

    pickr.on('save', (savedColor: any) => handleColorChange(savedColor));

    return () => {
      pickr.destroyAndRemove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className={`${pickerClassName} color-picker`} />;
}
