'use client';

import { X } from 'lucide-react';
import PaletteStrip from 'components/palette/PaletteStrip';
import styles from './PaletteChip.module.css';

/**
 * A one-click palette chip for the editor's Colors group: a small swatch strip
 * plus name, rendered as a pill. The active chip gets a dark outline; custom
 * chips carry a delete affordance that removes the palette on the first click.
 */
export default function PaletteChip({
  colors,
  transparentBackground = false,
  name,
  active,
  title,
  onClick,
  canDelete = false,
  deleteLabel,
  onDelete,
}: {
  colors: string[];
  transparentBackground?: boolean;
  name: string;
  active: boolean;
  title: string;
  onClick: () => void;
  canDelete?: boolean;
  deleteLabel?: string;
  onDelete?: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? `${styles.chip} ${styles.chipActive}` : styles.chip}
      onClick={onClick}
      title={title}
    >
      <PaletteStrip
        className={styles.strip}
        colors={colors}
        transparentBackground={transparentBackground}
      />
      <span className={styles.name}>{name}</span>
      {canDelete && onDelete && (
        <span
          role="button"
          tabIndex={0}
          aria-label={deleteLabel}
          title="Delete palette"
          className={styles.delete}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              onDelete();
            }
          }}
        >
          <X size={11} strokeWidth={2.5} />
        </span>
      )}
    </button>
  );
}
