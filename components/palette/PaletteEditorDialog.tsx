'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@base-ui-components/react/dialog';
import { Check, Plus, Shuffle, Trash2, X } from 'lucide-react';
import ToggleSwitch from 'components/ToggleSwitch';
import ColorSwatch from 'components/ColorSwatch';
import useMediaQuery from 'lib/useMediaQuery';
import type { PaletteDraft } from './usePaletteEditor';
import styles from './PaletteEditorDialog.module.css';

// A palette in the dialog holds 3-7 colors (background + 2-6 inks): remove is
// disabled at the minimum and Add color is hidden at the maximum.
const DIALOG_MIN_COLORS = 3;
const DIALOG_MAX_COLORS = 7;

// A hex text field with a fixed, non-editable "#" fused to its left edge. The
// stored value keeps its leading "#", but the editable text is just the digits —
// any "#" the user types or pastes is stripped back out.
function HexField({
  value,
  disabled,
  ariaLabel,
  onValueChange,
}: {
  value: string;
  disabled?: boolean;
  ariaLabel: string;
  onValueChange: (hex: string) => void;
}) {
  const digits = value.replace(/#/g, '');

  return (
    <span
      className={
        disabled ? `${styles.hexField} ${styles.hexFieldInert}` : styles.hexField
      }
    >
      <span className={styles.hexHash} aria-hidden="true">
        #
      </span>
      <input
        type="text"
        className={styles.hexInput}
        value={digits}
        disabled={disabled}
        aria-label={ariaLabel}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        onChange={(event) =>
          onValueChange(`#${event.target.value.replace(/#/g, '')}`)
        }
      />
    </span>
  );
}

/**
 * The shared new/edit-palette dialog (4a): the single place palettes are
 * created, edited, and deleted. Renders over a low-opacity backdrop so the page
 * it sits on stays visible (its artworks recolor live as the draft is edited).
 */
export default function PaletteEditorDialog({
  draft,
  setDraft,
  draftError,
  onClose,
  onSave,
  onDelete,
  onShuffleOrder,
  setDraftColor,
}: {
  draft: PaletteDraft | null;
  setDraft: React.Dispatch<React.SetStateAction<PaletteDraft | null>>;
  draftError: string | null;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onShuffleOrder: () => void;
  setDraftColor: (index: number, value: string) => void;
}) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  // The delete action confirms inline (Delete this palette? / Delete / Keep)
  // rather than removing on the first click.
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Reset the inline delete confirmation whenever the dialog opens on a
  // different palette (or closes).
  useEffect(() => {
    setConfirmingDelete(false);
  }, [draft?.id]);

  // On touch devices, auto-focusing the Name field pops the on-screen keyboard
  // and it covers the dialog. Detect a coarse primary pointer and skip the
  // initial focus there; pointer/keyboard users still land in the Name field.
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');

  return (
    <Dialog.Root
      open={draft !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        {/* Low-opacity scrim: the page (and its live-recolored artworks) stays
            visible behind the dialog. */}
        <Dialog.Backdrop className={styles.dialogBackdrop} />
        <Dialog.Popup
          className={styles.dialogPopup}
          initialFocus={isCoarsePointer ? false : nameInputRef}
        >
          <div className={styles.dialogTitleRow}>
            <Dialog.Title className={styles.dialogTitle}>
              {draft?.existing ? 'Edit palette' : 'New palette'}
            </Dialog.Title>
            <button
              type="button"
              className={styles.shuffleButton}
              onClick={onShuffleOrder}
              aria-label="Shuffle color order"
              title="Shuffle color order"
            >
              <Shuffle size={17} />
            </button>
          </div>

          {draft && (
            <>
              <div className={styles.dialogField}>
                <label className={styles.dialogLabel} htmlFor="palette-name">
                  Name <span className={styles.labelHint}>(optional)</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="palette-name"
                  className={styles.nameInput}
                  type="text"
                  value={draft.name}
                  placeholder="e.g. Acme brand"
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </div>

              <div className={styles.dialogField}>
                <span className={styles.dialogLabel}>Background</span>
                <div className={styles.bgRow}>
                  {/* The picker stays clickable while transparent: opening it
                      and picking a color turns the transparent switch off;
                      leaving it unchanged keeps transparent on (the native
                      input only fires on a real change). */}
                  <ColorSwatch
                    className={styles.dialogSwatch}
                    ariaLabel="Background color"
                    color={draft.colors[0]}
                    transparent={draft.transparent}
                    onChange={(hex) =>
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              colors: prev.colors.map((c, i) =>
                                i === 0 ? hex : c
                              ),
                              transparent: false,
                            }
                          : prev
                      )
                    }
                  />
                  <HexField
                    value={draft.colors[0]}
                    disabled={draft.transparent}
                    ariaLabel="Background hex value"
                    onValueChange={(hex) => setDraftColor(0, hex)}
                  />
                  <label className={styles.bgTransparent}>
                    <ToggleSwitch
                      small
                      isChecked={draft.transparent}
                      onChange={(checked) =>
                        setDraft({ ...draft, transparent: checked })
                      }
                    />
                    <span className={styles.bgTransparentLabel}>Transparent</span>
                  </label>
                </div>
              </div>

              <div className={styles.dialogField}>
                <span className={styles.dialogLabel}>Colors</span>
                <div className={styles.colorRows}>
                  {draft.colors.slice(1).map((color, inkIndex) => {
                    const index = inkIndex + 1;

                    return (
                      <div className={styles.colorRow} key={index}>
                        <ColorSwatch
                          className={styles.dialogSwatch}
                          ariaLabel={`Color ${index}`}
                          color={color}
                          onChange={(hex) => setDraftColor(index, hex)}
                        />
                        <HexField
                          value={color}
                          ariaLabel={`Color ${index} hex value`}
                          onValueChange={(hex) => setDraftColor(index, hex)}
                        />
                        <button
                          type="button"
                          className={styles.removeColor}
                          aria-label={`Remove color ${index}`}
                          disabled={draft.colors.length <= DIALOG_MIN_COLORS}
                          onClick={() =>
                            setDraft({
                              ...draft,
                              colors: draft.colors.filter((_, i) => i !== index),
                            })
                          }
                        >
                          <X size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {draft.colors.length < DIALOG_MAX_COLORS && (
                  <button
                    type="button"
                    className={styles.addColor}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        colors: [
                          ...draft.colors,
                          draft.colors[draft.colors.length - 1] ?? '#3e8bff',
                        ],
                      })
                    }
                  >
                    <Plus size={15} /> Add color
                  </button>
                )}
              </div>

              {draftError && <p className={styles.dialogError}>{draftError}</p>}

              <div className={styles.dialogActions}>
                {draft.existing &&
                  (confirmingDelete ? (
                    <span className={styles.confirmDelete}>
                      Delete this palette?
                      <button
                        type="button"
                        className={styles.confirmDeleteButton}
                        onClick={onDelete}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className={styles.confirmKeep}
                        onClick={() => setConfirmingDelete(false)}
                      >
                        Keep
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => setConfirmingDelete(true)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  ))}
                <Dialog.Close className={styles.cancelButton}>
                  <X size={15} /> Cancel
                </Dialog.Close>
                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={onSave}
                >
                  <Check size={15} /> Save palette
                </button>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
