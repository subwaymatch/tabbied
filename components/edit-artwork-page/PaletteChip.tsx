'use client';

import { X } from 'lucide-react';
import PaletteStrip from 'components/palette/PaletteStrip';
import styles from './PaletteChip.module.css';

/**
 * A one-click palette chip for the editor's Colors group: a small swatch strip
 * plus name, rendered as a pill. The active chip gets a dark outline; saved
 * chips carry a delete affordance (with an inline "click again" confirm state).
 */
export default function PaletteChip({
  colors,
  transparentBackground = false,
  name,
  active,
  title,
  onClick,
  canDelete = false,
  deleteConfirming = false,
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
  deleteConfirming?: boolean;
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
          title={deleteConfirming ? 'Click again to delete' : 'Delete palette'}
          className={
            deleteConfirming
              ? `${styles.delete} ${styles.deleteConfirm}`
              : styles.delete
          }
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
