'use client';

import type { BrandPalette } from 'lib/brandPalettes';
import styles from './PaletteChips.module.css';

/**
 * The saved-palette chips, shared by the gallery bar and the individual artwork
 * page. A chip shows its swatch strip (+ optional name); clicking a non-active
 * chip selects it, clicking the already-active chip opens it for editing.
 */
export default function PaletteChips({
  palettes,
  activeId,
  onSelect,
  onEdit,
  className,
}: {
  palettes: BrandPalette[];
  activeId: string | null;
  onSelect: (palette: BrandPalette) => void;
  onEdit: (palette: BrandPalette) => void;
  className?: string;
}) {
  if (palettes.length === 0) return null;

  return (
    <div
      className={className ? `${styles.chips} ${className}` : styles.chips}
      role="radiogroup"
      aria-label="Custom palette"
    >
      {palettes.map((palette) => {
        const isActive = palette.id === activeId;
        const label = palette.name || 'Untitled palette';

        return (
          <div
            key={palette.id}
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            tabIndex={0}
            className={
              isActive ? `${styles.chip} ${styles.chipActive}` : styles.chip
            }
            title={
              isActive
                ? 'Edit this palette'
                : palette.name
                  ? `Preview in "${palette.name}"`
                  : 'Preview in this palette'
            }
            // Clicking a non-active chip selects it; clicking the already-active
            // chip opens its editor.
            onClick={() => (isActive ? onEdit(palette) : onSelect(palette))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (isActive) onEdit(palette);
                else onSelect(palette);
              }
            }}
          >
            <span className={styles.swatches} aria-hidden="true">
              {palette.colors.map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className={
                    index === 0 && palette.transparentBackground
                      ? `${styles.swatch} ${styles.swatchTransparent}`
                      : styles.swatch
                  }
                  style={
                    index === 0 && palette.transparentBackground
                      ? undefined
                      : { backgroundColor: color }
                  }
                />
              ))}
            </span>
            {palette.name && (
              <span className={styles.chipName}>{palette.name}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
