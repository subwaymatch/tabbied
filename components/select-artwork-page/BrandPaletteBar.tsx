'use client';

import { useRef, useState } from 'react';
import { Dialog } from '@base-ui-components/react/dialog';
import { Download, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import ToggleSwitch from 'components/ToggleSwitch';
import {
  MAX_PALETTE_COLORS,
  MIN_PALETTE_COLORS,
  createPaletteId,
  deletePalette,
  exportPalettesJson,
  importPalettesJson,
  isValidPaletteColor,
  setActivePalette,
  setTransparentBackground,
  upsertPalette,
  useBrandPalettes,
  type BrandPalette,
} from 'lib/brandPalettes';
import styles from './BrandPaletteBar.module.css';

// The palette a "New palette" dialog starts from — Tabbied's own inks over a
// near-white background, so the editor never opens empty.
const STARTER_COLORS = ['#f8f9fa', '#232529', '#3e8bff', '#3fffb2', '#ff3d8b'];

type Draft = {
  id: string;
  name: string;
  colors: string[];
  /** Whether the draft edits an existing palette (shows Delete). */
  existing: boolean;
};

const draftFromPalette = (palette: BrandPalette): Draft => ({
  id: palette.id,
  name: palette.name,
  colors: [...palette.colors],
  existing: true,
});

const newDraft = (): Draft => ({
  id: createPaletteId(),
  name: '',
  colors: [...STARTER_COLORS],
  existing: false,
});

// Normalize a hex string for the native color input (which only accepts
// #rrggbb): expand #rgb, drop alpha, fall back to white while mid-edit.
const toColorInputValue = (hex: string): string => {
  const value = hex.trim();

  if (/^#[0-9a-f]{3}$/i.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }

  if (/^#[0-9a-f]{6}/i.test(value)) {
    return value.slice(0, 7).toLowerCase();
  }

  return '#ffffff';
};

export default function BrandPaletteBar() {
  const { palettes, activePaletteId, transparentBackground } =
    useBrandPalettes();

  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    message: string;
    error: boolean;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEditor = (palette?: BrandPalette) => {
    setDraftError(null);
    setDraft(palette ? draftFromPalette(palette) : newDraft());
  };

  const saveDraft = () => {
    if (!draft) return;

    if (draft.name.trim().length === 0) {
      setDraftError('Give the palette a name.');
      return;
    }

    const invalid = draft.colors.find((color) => !isValidPaletteColor(color));

    if (invalid !== undefined) {
      setDraftError(`"${invalid}" is not a valid hex color.`);
      return;
    }

    upsertPalette({ id: draft.id, name: draft.name, colors: draft.colors });
    setActivePalette(draft.id);
    setDraft(null);
  };

  const removeDraftPalette = () => {
    if (!draft) return;

    deletePalette(draft.id);
    setDraft(null);
  };

  const exportPalettes = () => {
    const blob = new Blob([exportPalettesJson()], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'tabbied-palettes.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importFile = async (file: File) => {
    try {
      const { imported, skipped } = importPalettesJson(await file.text());
      const parts = [
        `Imported ${imported} palette${imported === 1 ? '' : 's'}`,
        skipped > 0 ? `skipped ${skipped} duplicate${skipped === 1 ? '' : 's'}` : '',
      ].filter(Boolean);

      setStatus({ message: `${parts.join(', ')}.`, error: false });
    } catch (error) {
      setStatus({
        message: `Import failed: ${
          error instanceof Error ? error.message : 'unrecognized file.'
        }`,
        error: true,
      });
    }
  };

  const setDraftColor = (index: number, value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            colors: prev.colors.map((color, i) => (i === index ? value : color)),
          }
        : prev
    );
  };

  return (
    <section className={styles.bar} aria-label="Brand palette">
      <div className={styles.barHeader}>
        <h3 className={styles.barTitle}>Brand palette</h3>
        <p className={styles.barHint}>
          Save your brand colors and preview every design with them. Palettes
          are stored in this browser and can be exported/imported as JSON.
        </p>
      </div>

      <div className={styles.barBody}>
        <div
          className={styles.chips}
          role="radiogroup"
          aria-label="Active palette"
        >
          <button
            type="button"
            role="radio"
            aria-checked={activePaletteId === null}
            className={
              activePaletteId === null
                ? `${styles.chip} ${styles.chipActive}`
                : styles.chip
            }
            onClick={() => setActivePalette(null)}
          >
            Artwork colors
          </button>

          {palettes.map((palette) => {
            const isActive = palette.id === activePaletteId;

            return (
              <span key={palette.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={
                    isActive
                      ? `${styles.chip} ${styles.chipActive}`
                      : styles.chip
                  }
                  onClick={() => setActivePalette(palette.id)}
                >
                  <span className={styles.swatches} aria-hidden="true">
                    {palette.colors.map((color, index) => (
                      <span
                        key={`${color}-${index}`}
                        className={styles.swatch}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                  {palette.name}
                </button>
                <button
                  type="button"
                  className={styles.chipEdit}
                  aria-label={`Edit palette ${palette.name}`}
                  title="Edit palette"
                  onClick={() => openEditor(palette)}
                >
                  <Pencil size={14} />
                </button>
              </span>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => openEditor()}
          >
            <Plus size={16} /> New palette
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} /> Import
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={exportPalettes}
            disabled={palettes.length === 0}
          >
            <Download size={16} /> Export
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) void importFile(file);
              // Allow re-importing the same file after edits.
              event.target.value = '';
            }}
          />

          <label className={styles.transparentToggle}>
            Transparent background
            <ToggleSwitch
              isChecked={transparentBackground}
              onChange={setTransparentBackground}
            />
          </label>
        </div>

        {status && (
          <p
            className={
              status.error
                ? `${styles.status} ${styles.statusError}`
                : styles.status
            }
            role="status"
          >
            {status.message}
          </p>
        )}
      </div>

      <Dialog.Root
        open={draft !== null}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className={styles.dialogBackdrop} />
          <Dialog.Popup className={styles.dialogPopup}>
            <Dialog.Title className={styles.dialogTitle}>
              {draft?.existing ? 'Edit palette' : 'New palette'}
            </Dialog.Title>

            {draft && (
              <>
                <div className={styles.dialogField}>
                  <label className={styles.dialogLabel} htmlFor="palette-name">
                    Name
                  </label>
                  <input
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
                  <span className={styles.dialogLabel}>
                    Colors (background first)
                  </span>
                  <div className={styles.colorRows}>
                    {draft.colors.map((color, index) => (
                      <div className={styles.colorRow} key={index}>
                        <input
                          type="color"
                          className={styles.colorInput}
                          value={toColorInputValue(color)}
                          aria-label={
                            index === 0
                              ? 'Background color'
                              : `Color ${index + 1}`
                          }
                          onChange={(event) =>
                            setDraftColor(index, event.target.value)
                          }
                        />
                        <input
                          type="text"
                          className={styles.hexInput}
                          value={color}
                          aria-label={
                            index === 0
                              ? 'Background color hex value'
                              : `Color ${index + 1} hex value`
                          }
                          onChange={(event) =>
                            setDraftColor(index, event.target.value)
                          }
                        />
                        <span className={styles.roleLabel}>
                          {index === 0 ? 'background' : ''}
                        </span>
                        <button
                          type="button"
                          className={styles.removeColor}
                          aria-label={`Remove color ${index + 1}`}
                          disabled={draft.colors.length <= MIN_PALETTE_COLORS}
                          onClick={() =>
                            setDraft({
                              ...draft,
                              colors: draft.colors.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {draft.colors.length < MAX_PALETTE_COLORS && (
                    <button
                      type="button"
                      className={styles.actionButton}
                      style={{ marginTop: '0.75rem' }}
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
                      <Plus size={16} /> Add color
                    </button>
                  )}
                </div>

                {draftError && (
                  <p className={styles.dialogError}>{draftError}</p>
                )}

                <div className={styles.dialogActions}>
                  {draft.existing && (
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.dialogDelete}`}
                      onClick={removeDraftPalette}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                  <Dialog.Close className={styles.actionButton}>
                    Cancel
                  </Dialog.Close>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.saveButton}`}
                    onClick={saveDraft}
                  >
                    Save palette
                  </button>
                </div>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
