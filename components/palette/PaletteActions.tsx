'use client';

import { Menu } from '@base-ui-components/react/menu';
import { ChevronDown, Download, Plus, Upload } from 'lucide-react';
import styles from './PaletteActions.module.css';

/**
 * Split button shared by the gallery bar and the individual artwork page: the
 * primary "New palette" action, plus a chevron that opens a menu with the
 * less-used Import / Export file actions (so they don't clutter the row — and,
 * as menu items rather than buttons, they don't collide with the artwork page's
 * own Export button).
 */
export default function PaletteActions({
  onNewPalette,
  onImport,
  onExport,
  className,
}: {
  onNewPalette: () => void;
  onImport: () => void;
  onExport: () => void;
  className?: string;
}) {
  return (
    <div className={className ? `${styles.group} ${className}` : styles.group}>
      <button
        type="button"
        className={styles.mainButton}
        onClick={onNewPalette}
      >
        <Plus size={16} /> New palette
      </button>
      <Menu.Root>
        <Menu.Trigger
          className={styles.chevron}
          aria-label="More palette actions"
        >
          <ChevronDown size={16} />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner
            className={styles.positioner}
            side="bottom"
            align="end"
            sideOffset={6}
          >
            <Menu.Popup className={styles.popup}>
              <Menu.Item className={styles.item} onClick={onImport}>
                <Upload size={16} /> Import palettes
              </Menu.Item>
              <Menu.Item className={styles.item} onClick={onExport}>
                <Download size={16} /> Export palettes
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}
