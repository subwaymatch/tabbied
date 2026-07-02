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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pickrRef = useRef<Pickr | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    // Pickr replaces its target element with its own swatch button, and
    // destroyAndRemove() deletes that button without restoring the target —
    // so each mount creates a fresh target node inside the React-owned
    // wrapper. (Selecting a static child by class instead would leave
    // StrictMode's second mount, after the first cleanup, with no element to
    // attach to and crash the whole editor tree in dev.)
    const target = document.createElement('div');
    target.className = 'color-picker';
    wrapper.appendChild(target);

    const pickr = Pickr.create({
      el: target,
      theme: 'monolith',
      default: color,
      defaultRepresentation: 'HEXA',
      swatches: [],
      i18n: {
        // Positionally-distinct accessible names for the swatch buttons.
        'btn:toggle': index === 0 ? 'Background color' : `Color ${index + 1}`,
      },
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
      // destroyAndRemove() removes Pickr's button; drop anything left of the
      // per-mount target so remounts start clean.
      target.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the swatch in sync when the color is changed from outside (e.g. the
  // "Randomize" palette button). setColor fires 'change', not 'save', so this
  // won't loop back through handleColorChange.
  useEffect(() => {
    pickrRef.current?.setColor(color);
  }, [color]);

  // React owns only this wrapper; Pickr's swatch button lives inside it and
  // is created/removed by the effect above — React never has to reconcile a
  // node Pickr has already detached.
  return <div ref={wrapperRef} />;
}
