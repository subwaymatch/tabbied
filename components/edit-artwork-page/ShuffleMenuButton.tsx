'use client';

import { Menu } from '@base-ui-components/react/menu';
import { Check, ChevronDown } from 'lucide-react';
import {
  SHUFFLE_ACTIONS,
  type ShuffleAction,
} from './shuffleActions';
import styles from './ShuffleMenuButton.module.css';

/**
 * A split "Shuffle" button that unifies the two randomize actions (reseed the
 * layout, reroll the colors) into one control. The main button runs the current
 * default; the chevron opens a menu of all three scopes. Picking one runs it and
 * remembers it as the new default (the scope state lives in the parent so the
 * mobile 7d panel shares the same default).
 */
export default function ShuffleMenuButton({
  action,
  onRun,
  onSelect,
}: {
  action: ShuffleAction;
  /** Run the given scope without changing the default. */
  onRun: (id: ShuffleAction) => void;
  /** Make the given scope the new default (persisted). */
  onSelect: (id: ShuffleAction) => void;
}) {
  const current =
    SHUFFLE_ACTIONS.find((a) => a.id === action) ?? SHUFFLE_ACTIONS[0];
  const CurrentIcon = current.Icon;

  // Picking from the menu makes the scope the new default and runs it, so the
  // next main-button click repeats it without reopening the menu.
  const choose = (id: ShuffleAction) => {
    onSelect(id);
    onRun(id);
  };

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.main}
        onClick={() => onRun(current.id)}
        aria-label={current.label}
      >
        <CurrentIcon className={styles.icon} size={18} />
        <span className={styles.label}>{current.label}</span>
      </button>
      <Menu.Root>
        <Menu.Trigger className={styles.chevron} aria-label="Shuffle options">
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
              {SHUFFLE_ACTIONS.map(({ id, label, Icon }) => (
                <Menu.Item
                  key={id}
                  className={styles.item}
                  onClick={() => choose(id)}
                >
                  <Icon size={16} />
                  {label}
                  {id === current.id && (
                    <Check className={styles.check} size={15} aria-hidden="true" />
                  )}
                </Menu.Item>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}
