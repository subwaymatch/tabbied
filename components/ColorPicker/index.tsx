'use client';

import { useEffect, useRef } from 'react';
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
  const pickrRef = useRef<Pickr | null>(null);

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

    pickrRef.current = pickr;

    return () => {
      pickrRef.current = null;
      pickr.destroyAndRemove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the swatch in sync when the color is changed from outside (e.g. the
  // "Randomize" palette button). setColor fires 'change', not 'save', so this
  // won't loop back through handleColorChange.
  useEffect(() => {
    pickrRef.current?.setColor(color);
  }, [color]);

  // Pickr replaces the inner element with its own swatch button, so React must
  // own a wrapper around it — unmounting (e.g. removing a palette color) would
  // otherwise have React remove a node Pickr already detached, which throws
  // and blanks the whole tree.
  return (
    <div>
      <div className={`${pickerClassName} color-picker`} />
    </div>
  );
}
