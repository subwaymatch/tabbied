'use client';

import { useRef, useState } from 'react';
import { exportPalettesJson, importPalettesJson } from 'lib/brandPalettes';

// Shared JSON import/export wiring for the palette controls (gallery bar and
// individual artwork page). Owns the hidden file input, a picker trigger, and
// the success/error status message.
export function usePaletteImportExport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{
    message: string;
    error: boolean;
  } | null>(null);

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
        skipped > 0
          ? `skipped ${skipped} duplicate${skipped === 1 ? '' : 's'}`
          : '',
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

  const openFilePicker = () => fileInputRef.current?.click();

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

  return { status, exportPalettes, openFilePicker, fileInput };
}
