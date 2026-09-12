'use client';

// Editing the colours of one palette, for this site. The rail's rows choose a
// palette wholesale; this is the way to change one of its colours - which is
// what the rail used to be before the list took its place, so nothing a person
// could do before has gone away.
//
// It edits a copy and commits on Save, unlike the rail's rows, which apply as
// they are clicked: a colour picker fires an event per drag frame, and planning
// and re-running the whole page on each of them is what made the first version
// of this unusable.
import { useEffect, useState } from 'react';
import { Dialog } from '@base-ui-components/react/dialog';
import { Check, X } from 'lucide-react';
import styles from './PaletteDialog.module.css';

/** A colour the picker cannot show. Kept as authored rather than filled in. */
const isTransparent = (value: string) => {
  const colour = value.trim().toLowerCase();

  return colour === 'transparent' || /^#(?:[0-9a-f]{6})00$/.test(colour);
};

/** `abc` and `#abc` both mean `#aabbcc`; anything else leaves the value alone. */
function normalise(raw: string, fallback: string): string {
  const value = raw.trim().toLowerCase().replace(/^#/, '');

  if (/^[0-9a-f]{3}$/.test(value)) {
    return `#${value
      .split('')
      .map((char) => char + char)
      .join('')}`;
  }

  return /^[0-9a-f]{6}$/.test(value) ? `#${value}` : fallback;
}

export default function PaletteDialog({
  open,
  onOpenChange,
  title,
  colors,
  labels,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** The colours to start from, ground first. */
  colors: readonly string[];
  /** One label per role, from the template's own spec. */
  labels: readonly string[];
  onSave: (colors: string[]) => void;
}) {
  const [draft, setDraft] = useState<string[]>([...colors]);

  // Re-seed whenever the dialog is opened, or opening it a second time would
  // show the previous row's colours.
  useEffect(() => {
    if (open) setDraft([...colors]);
  }, [open, colors]);

  const set = (index: number, value: string) =>
    setDraft((previous) => previous.map((colour, i) => (i === index ? value : colour)));

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Description className={styles.lede}>
            Each colour sets one part of the page.
          </Dialog.Description>

          <div className={styles.rows}>
            {draft.map((colour, index) => {
              const clear = isTransparent(colour);
              const label = labels[index] ?? (index === 0 ? 'Ground' : `Ink ${index}`);

              return (
                <div key={index} className={styles.row}>
                  <label
                    className={clear ? `${styles.swatch} ${styles.swatchClear}` : styles.swatch}
                    style={clear ? undefined : { background: colour }}
                  >
                    <input
                      type="color"
                      value={clear ? '#ffffff' : colour}
                      aria-label={label}
                      onChange={(event) => set(index, event.target.value)}
                    />
                  </label>
                  <span className={styles.label}>{label}</span>
                  <input
                    className={styles.hex}
                    value={colour}
                    aria-label={`${label} value`}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    onChange={(event) => set(index, event.target.value)}
                    onBlur={(event) =>
                      set(index, isTransparent(event.target.value)
                        ? event.target.value.trim().toLowerCase()
                        : normalise(event.target.value, colors[index] ?? '#000000'))
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.actions}>
            <Dialog.Close className={styles.cancel}>
              <X size={15} aria-hidden="true" /> Cancel
            </Dialog.Close>
            <button
              type="button"
              className={styles.save}
              onClick={() => {
                onSave(
                  draft.map((colour, index) =>
                    isTransparent(colour)
                      ? colour.trim().toLowerCase()
                      : normalise(colour, colors[index] ?? '#000000')
                  )
                );
                onOpenChange(false);
              }}
            >
              <Check size={16} aria-hidden="true" /> Save changes
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
