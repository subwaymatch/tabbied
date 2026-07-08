'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@base-ui-components/react/dialog';
import { Download, Plus, Trash2, Upload, X } from 'lucide-react';
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
  /** Colors, background (color0) first, then the inks. */
  name: string;
  colors: string[];
  transparent: boolean;
  /** Whether the draft edits an existing palette (shows Delete). */
  existing: boolean;
};

const draftFromPalette = (palette: BrandPalette): Draft => ({
  id: palette.id,
  name: palette.name,
  colors: [...palette.colors],
  transparent: palette.transparentBackground === true,
  existing: true,
});

const newDraft = (): Draft => ({
  id: createPaletteId(),
  name: '',
  colors: [...STARTER_COLORS],
  transparent: false,
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
  const { palettes, activePaletteId } = useBrandPalettes();

  // Preview mode is derived from whether a custom palette is active, but the
  // "Custom palette" segment needs a palette to switch *to* — remember the last
  // one so toggling back restores the user's choice rather than jumping to the
  // first palette every time.
  const lastBrandIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activePaletteId !== null) lastBrandIdRef.current = activePaletteId;
  }, [activePaletteId]);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    message: string;
    error: boolean;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mode: 'artwork' | 'brand' =
    activePaletteId === null ? 'artwork' : 'brand';

  const selectMode = (next: 'artwork' | 'brand') => {
    if (next === 'artwork') {
      setActivePalette(null);
      return;
    }

    const remembered = lastBrandIdRef.current;
    const target =
      remembered && palettes.some((palette) => palette.id === remembered)
        ? remembered
        : (palettes[0]?.id ?? null);

    setActivePalette(target);
  };

  const openEditor = (palette?: BrandPalette) => {
    setDraftError(null);
    setDraft(palette ? draftFromPalette(palette) : newDraft());
  };

  const saveDraft = () => {
    if (!draft) return;

    // The name is optional — a nameless palette just shows its colors.
    const invalid = draft.colors.find((color) => !isValidPaletteColor(color));

    if (invalid !== undefined) {
      setDraftError(`"${invalid}" is not a valid hex color.`);
      return;
    }

    upsertPalette({
      id: draft.id,
      name: draft.name,
      colors: draft.colors,
      transparentBackground: draft.transparent,
    });
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

  const fileInput = (
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
  );

  return (
    <section className={styles.bar} aria-label="Custom palette">
      {palettes.length === 0 ? (
        // No saved palettes: nothing to preview yet, so collapse to a single
        // invitation to create one.
        <div className={styles.empty}>
          <div className={styles.emptyLead}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => openEditor()}
            >
              <Plus size={16} /> New palette
            </button>
            <span className={styles.emptyHint}>
              Preview every design in your custom colors — palettes stay in
              this browser.
            </span>
          </div>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} /> Import
          </button>
          {fileInput}
        </div>
      ) : (
        <>
          <div className={styles.barRow}>
            <div className={styles.controls}>
              <span className={styles.previewLabel}>Preview colors</span>
              <div
                className={styles.modeToggle}
                role="radiogroup"
                aria-label="Preview colors"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={mode === 'artwork'}
                  className={
                    mode === 'artwork'
                      ? `${styles.modeOption} ${styles.modeOptionActive}`
                      : styles.modeOption
                  }
                  onClick={() => selectMode('artwork')}
                >
                  Artwork colors
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={mode === 'brand'}
                  className={
                    mode === 'brand'
                      ? `${styles.modeOption} ${styles.modeOptionActive}`
                      : styles.modeOption
                  }
                  onClick={() => selectMode('brand')}
                >
                  Custom palette
                </button>
              </div>

              {mode === 'artwork' && (
                <span className={styles.modeHint}>
                  Each design shows its own colors
                </span>
              )}
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => openEditor()}
              >
                <Plus size={16} /> New palette
              </button>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} /> Import
              </button>
              <button
                type="button"
                className={styles.textButton}
                onClick={exportPalettes}
              >
                <Download size={16} /> Export
              </button>
              {fileInput}
            </div>
          </div>

          {/* The palette chips sit on their own line below the mode row so
              adding palettes never reflows the New / Import / Export actions. */}
          {mode === 'brand' && (
            <div
              className={styles.chips}
              role="radiogroup"
              aria-label="Active palette"
            >
              {palettes.map((palette) => {
                const isActive = palette.id === activePaletteId;
                const label = palette.name || 'Untitled palette';

                return (
                  <div
                    key={palette.id}
                    role="radio"
                    aria-checked={isActive}
                    aria-label={label}
                    tabIndex={0}
                    className={
                      isActive
                        ? `${styles.chip} ${styles.chipActive}`
                        : styles.chip
                    }
                    // Clicking a non-active chip selects it; clicking the
                    // already-active chip opens its editor (A3).
                    onClick={() =>
                      isActive ? openEditor(palette) : setActivePalette(palette.id)
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        if (isActive) openEditor(palette);
                        else setActivePalette(palette.id);
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
          )}
        </>
      )}

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
                    Name <span className={styles.labelHint}>(optional)</span>
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
                  <span className={styles.dialogLabel}>Background</span>
                  <div className={styles.bgRow}>
                    {draft.transparent ? (
                      <span
                        className={styles.transparentSwatch}
                        aria-hidden="true"
                      />
                    ) : (
                      <input
                        type="color"
                        className={styles.colorInput}
                        value={toColorInputValue(draft.colors[0])}
                        aria-label="Background color"
                        onChange={(event) =>
                          setDraftColor(0, event.target.value)
                        }
                      />
                    )}
                    <input
                      type="text"
                      className={
                        draft.transparent
                          ? `${styles.hexInput} ${styles.hexInputInert}`
                          : styles.hexInput
                      }
                      value={draft.colors[0]}
                      disabled={draft.transparent}
                      aria-label="Background color hex value"
                      onChange={(event) => setDraftColor(0, event.target.value)}
                    />
                    <label className={styles.bgTransparent}>
                      <ToggleSwitch
                        small
                        isChecked={draft.transparent}
                        onChange={(checked) =>
                          setDraft({ ...draft, transparent: checked })
                        }
                      />
                      <span className={styles.bgTransparentLabel}>
                        Transparent
                      </span>
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
                          <input
                            type="color"
                            className={styles.colorInput}
                            value={toColorInputValue(color)}
                            aria-label={`Color ${index}`}
                            onChange={(event) =>
                              setDraftColor(index, event.target.value)
                            }
                          />
                          <input
                            type="text"
                            className={styles.hexInput}
                            value={color}
                            aria-label={`Color ${index} hex value`}
                            onChange={(event) =>
                              setDraftColor(index, event.target.value)
                            }
                          />
                          <button
                            type="button"
                            className={styles.removeColor}
                            aria-label={`Remove color ${index}`}
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
                      );
                    })}
                  </div>

                  {draft.colors.length < MAX_PALETTE_COLORS && (
                    <button
                      type="button"
                      className={`${styles.textButton} ${styles.addColor}`}
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
                      className={`${styles.textButton} ${styles.dialogDelete}`}
                      onClick={removeDraftPalette}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                  <Dialog.Close className={styles.textButton}>
                    Cancel
                  </Dialog.Close>
                  <button
                    type="button"
                    className={styles.saveButton}
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
