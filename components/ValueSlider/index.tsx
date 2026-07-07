'use client';

import { Slider } from '@base-ui-components/react/slider';
import styles from './ValueSlider.module.css';

type ValueSliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  /** Accessible name for the thumb (e.g. the option's display name). */
  label?: string;
};

export default function ValueSlider({
  min,
  max,
  step,
  value,
  onChange,
  label,
}: ValueSliderProps) {
  return (
    <Slider.Root
      className={styles.root}
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : next)}
    >
      <div className={styles.row}>
        <Slider.Control className={styles.control}>
          <Slider.Track className={styles.track}>
            <Slider.Indicator className={styles.indicator} />
            <Slider.Thumb
              className={styles.thumb}
              aria-label={label ?? 'value slider'}
            />
          </Slider.Track>
        </Slider.Control>
        <Slider.Value className={styles.value}>
          {(_formatted, values) => values[0].toFixed(1)}
        </Slider.Value>
      </div>
    </Slider.Root>
  );
}
