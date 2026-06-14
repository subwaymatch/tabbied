'use client';

import { useRef } from 'react';
import { TabbiedArtwork, type TabbiedArtworkHandle } from 'tabbied/react';
import { radius } from 'tabbied/artworks';
import styles from './ReactDocs.module.css';

// Interactive companion to the "Reseed & export" section: a ref to the
// component's handle drives redraw()/exportImage() from the buttons.
export default function ReseedExportDemo() {
  const ref = useRef<TabbiedArtworkHandle>(null);

  return (
    <div>
      <TabbiedArtwork
        ref={ref}
        artwork={radius}
        fit="cover"
        className={styles.demoArt}
        style={{ width: '100%', height: 280 }}
      />

      <div className={styles.demoActions}>
        <button
          type="button"
          className={styles.demoBtn}
          onClick={() => ref.current?.redraw()}
        >
          Redraw
        </button>
        <button
          type="button"
          className={`${styles.demoBtn} ${styles.demoBtnPrimary}`}
          onClick={() => ref.current?.exportImage()}
        >
          Export PNG
        </button>
      </div>
    </div>
  );
}
