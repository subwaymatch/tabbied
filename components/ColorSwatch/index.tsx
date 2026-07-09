'use client';

import { toColorInputValue } from 'lib/color';
import styles from './ColorSwatch.module.css';

type ColorSwatchProps = {
  /** Current color (any hex form; alpha is ignored by the native input). */
  color: string;
  /** Accessible name for the swatch. */
  ariaLabel: string;
  /** Called with the picked `#rrggbb` value when the color changes. */
  onChange: (hex: string) => void;
  /**
   * Render as a transparent slot: the checkerboard shows through and the native
   * input is kept clickable (so the picker still opens) but visually hidden.
   */
  transparent?: boolean;
  className?: string;
};

/**
 * A browser-native `<input type="color">` restyled into a compact swatch. The
 * native picker replaces the previous Pickr dependency; a `transparent` slot
 * shows the standard checkerboard while staying clickable.
 */
export default function ColorSwatch({
  color,
  ariaLabel,
  onChange,
  transparent = false,
  className,
}: ColorSwatchProps) {
  return (
    <span
      className={[
        styles.swatch,
        transparent ? styles.swatchTransparent : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type="color"
        className={styles.input}
        value={toColorInputValue(color)}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
      />
    </span>
  );
}
