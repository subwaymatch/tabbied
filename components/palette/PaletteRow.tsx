'use client';

import { Check, Pencil, X } from 'lucide-react';
import PaletteStrip from './PaletteStrip';
import styles from './PaletteRow.module.css';

/**
 * One row in the merged palette list (custom palettes first, then the read-only
 * library), shared by the gallery rail and the embedded palette browser. Rows
 * share a single left edge — no horizontal padding, no hover background; hover
 * is a 2px translateX nudge. Clicking the row applies the palette (or, when it's
 * already active, opens the editor — handled by the caller's onClick).
 */
export default function PaletteRow({
  colors,
  transparentBackground = false,
  name,
  active,
  showEdit = false,
  showDelete = false,
  editLabel,
  editTitle = 'Edit palette',
  deleteLabel,
  onClick,
  onEdit,
  onDelete,
}: {
  colors: string[];
  transparentBackground?: boolean;
  name: string;
  active: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  editLabel?: string;
  editTitle?: string;
  deleteLabel?: string;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const stop =
    (handler?: () => void) =>
    (event: React.MouseEvent | React.KeyboardEvent) => {
      if (
        event.type === 'keydown' &&
        (event as React.KeyboardEvent).key !== 'Enter' &&
        (event as React.KeyboardEvent).key !== ' '
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      handler?.();
    };

  return (
    <button type="button" className={styles.row} onClick={onClick} title={name}>
      <PaletteStrip colors={colors} transparentBackground={transparentBackground} />
      <span
        className={active ? `${styles.name} ${styles.nameActive}` : styles.name}
      >
        {name}
      </span>
      {active && (
        <span className={styles.check}>
          <Check size={14} />
        </span>
      )}
      {showEdit && onEdit && (
        <span
          role="button"
          tabIndex={0}
          aria-label={editLabel}
          title={editTitle}
          className={styles.edit}
          onClick={stop(onEdit)}
          onKeyDown={stop(onEdit)}
        >
          <Pencil size={13} />
        </span>
      )}
      {showDelete && onDelete && (
        <span
          role="button"
          tabIndex={0}
          aria-label={deleteLabel}
          title="Delete palette"
          className={styles.delete}
          onClick={stop(onDelete)}
          onKeyDown={stop(onDelete)}
        >
          <X size={12} strokeWidth={2} />
        </span>
      )}
    </button>
  );
}
