'use client';

import { useEffect, useRef } from 'react';
import { Download, Plus, Upload } from 'lucide-react';
import PaletteChips from 'components/palette/PaletteChips';
import PaletteEditorDialog from 'components/palette/PaletteEditorDialog';
import { usePaletteEditor } from 'components/palette/usePaletteEditor';
import { usePaletteImportExport } from 'components/palette/usePaletteImportExport';
import {
  setActivePalette,
  useBrandPalettes,
  type BrandPalette,
} from 'lib/brandPalettes';
import styles from './BrandPaletteBar.module.css';

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

  const editor = usePaletteEditor({
    onSaved: (palette) => setActivePalette(palette.id),
  });
  const { status, exportPalettes, openFilePicker, fileInput } =
    usePaletteImportExport();

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

  const selectPalette = (palette: BrandPalette) => setActivePalette(palette.id);

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
              onClick={() => editor.openEditor()}
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
            onClick={openFilePicker}
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
                onClick={() => editor.openEditor()}
              >
                <Plus size={16} /> New palette
              </button>
              <button
                type="button"
                className={styles.textButton}
                onClick={openFilePicker}
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
              adding palettes never reflows the New / Import / Export actions.
              They're always listed (A5), even in "Artwork colors" mode —
              clicking one selects it (and switches to custom preview). */}
          <PaletteChips
            palettes={palettes}
            activeId={activePaletteId}
            onSelect={selectPalette}
            onEdit={editor.openEditor}
            className={styles.barChips}
          />
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

      <PaletteEditorDialog
        draft={editor.draft}
        setDraft={editor.setDraft}
        draftError={editor.draftError}
        onClose={editor.closeEditor}
        onSave={editor.saveDraft}
        onDelete={editor.removeDraftPalette}
        onRandomize={editor.randomizeDraft}
        setDraftColor={editor.setDraftColor}
      />
    </section>
  );
}
