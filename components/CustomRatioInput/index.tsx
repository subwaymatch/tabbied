'use client';

import { useEffect, useState } from 'react';
import { isValidRatio, parseRatio } from 'lib/aspectRatio';
import styles from './CustomRatioInput.module.css';

type CustomRatioInputProps = {
  /** Current ratio as a "w:h" string. */
  value: string;
  onChange: (ratio: string) => void;
};

// Two number fields (width : height) for entering an arbitrary aspect ratio.
// The fields mirror the active ratio and only commit when both are valid, so
// selecting a preset elsewhere keeps them in sync.
export default function CustomRatioInput({
  value,
  onChange,
}: CustomRatioInputProps) {
  const parsed = parseRatio(value);
  const [width, setWidth] = useState(parsed ? String(parsed[0]) : '');
  const [height, setHeight] = useState(parsed ? String(parsed[1]) : '');

  useEffect(() => {
    const next = parseRatio(value);

    if (next) {
      setWidth(String(next[0]));
      setHeight(String(next[1]));
    }
  }, [value]);

  const commit = (nextWidth: string, nextHeight: string) => {
    const ratio = `${nextWidth}:${nextHeight}`;

    if (isValidRatio(ratio)) {
      onChange(ratio);
    }
  };

  return (
    <div className={styles.customRatio}>
      <span className={styles.label}>Custom</span>
      <input
        className={styles.field}
        type="number"
        min={1}
        max={100}
        step={1}
        inputMode="numeric"
        aria-label="Custom ratio width"
        value={width}
        onChange={(event) => {
          setWidth(event.target.value);
          commit(event.target.value, height);
        }}
      />
      <span className={styles.colon}>:</span>
      <input
        className={styles.field}
        type="number"
        min={1}
        max={100}
        step={1}
        inputMode="numeric"
        aria-label="Custom ratio height"
        value={height}
        onChange={(event) => {
          setHeight(event.target.value);
          commit(width, event.target.value);
        }}
      />
    </div>
  );
}
