'use client';

import styles from './PaletteStrip.module.css';

/**
 * A fixed-width swatch strip of a palette's colors. The colors flex to fill the
 * strip equally, so palettes with 3-7 colors all render at the same width
 * (never fixed per-cell). A transparent background renders the first cell as a
 * mini checkerboard. Size is controlled by `--strip-width` / `--strip-height`
 * (defaults 60 x 16), so callers restyle it per context via a className.
 */
export default function PaletteStrip({
  colors,
  transparentBackground = false,
  className,
}: {
  colors: string[];
  transparentBackground?: boolean;
  className?: string;
}) {
  return (
    <span
      className={className ? `${styles.strip} ${className}` : styles.strip}
      aria-hidden="true"
    >
      {colors.map((color, index) => {
        const isTransparent = index === 0 && transparentBackground;

        return (
          <span
            // Colors can repeat within a palette, so pair the value with its slot.
            key={`${color}-${index}`}
            className={
              isTransparent ? `${styles.cell} ${styles.cellTransparent}` : styles.cell
            }
            style={isTransparent ? undefined : { background: color }}
          />
        );
      })}
    </span>
  );
}
