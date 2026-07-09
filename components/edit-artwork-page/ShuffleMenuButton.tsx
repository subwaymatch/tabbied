'use client';

import { useEffect, useState } from 'react';
import { Menu } from '@base-ui-components/react/menu';
import { Check, ChevronDown, Palette, RefreshCw, Shuffle } from 'lucide-react';
import styles from './ShuffleMenuButton.module.css';

// The three shuffle scopes. "Layout" reseeds the pattern; "Colors" rerolls the
// palette; "Everything" does both.
type ShuffleAction = 'all' | 'layout' | 'colors';

const STORAGE_KEY = 'tabbied.shuffleAction.v1';

const ACTIONS = [
  { id: 'all' as const, label: 'Shuffle', Icon: Shuffle },
  { id: 'layout' as const, label: 'Shuffle layout', Icon: RefreshCw },
  { id: 'colors' as const, label: 'Shuffle colors', Icon: Palette },
];

const isShuffleAction = (value: unknown): value is ShuffleAction =>
  value === 'all' || value === 'layout' || value === 'colors';

/**
 * A split "Shuffle" button that unifies the two randomize actions (reseed the
 * layout, reroll the colors) into one control. The main button runs the current
 * default; the chevron opens a menu of all three scopes. Picking one runs it and
 * remembers it as the new default (persisted across visits), so a user who
 * mostly reshuffles colors just clicks the main button next time.
 */
export default function ShuffleMenuButton({
  onShuffleAll,
  onShuffleLayout,
  onShuffleColors,
}: {
  onShuffleAll: () => void;
  onShuffleLayout: () => void;
  onShuffleColors: () => void;
}) {
  const [action, setAction] = useState<ShuffleAction>('all');

  // Restore the last-used scope after mount. localStorage isn't available on the
  // server, so starting from 'all' keeps SSR and the first client render aligned.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isShuffleAction(saved)) setAction(saved);
    } catch {
      // Ignore storage access failures (private mode, etc.).
    }
  }, []);

  const run = (id: ShuffleAction) => {
    if (id === 'all') onShuffleAll();
    else if (id === 'layout') onShuffleLayout();
    else onShuffleColors();
  };

  // Picking from the menu runs the action and makes it the new default, so the
  // next main-button click repeats it without reopening the menu.
  const choose = (id: ShuffleAction) => {
    setAction(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Ignore storage access failures.
    }
    run(id);
  };

  const current = ACTIONS.find((a) => a.id === action) ?? ACTIONS[0];
  const CurrentIcon = current.Icon;

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.main}
        onClick={() => run(current.id)}
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
              {ACTIONS.map(({ id, label, Icon }) => (
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
