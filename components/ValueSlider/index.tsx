'use client';

import { Slider } from '@base-ui-components/react/slider';
import styles from './ValueSlider.module.css';

type ValueSliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

export default function ValueSlider({
  min,
  max,
  step,
  value,
  onChange,
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
      <Slider.Control className={styles.control}>
        <Slider.Track className={styles.track}>
          <Slider.Indicator className={styles.indicator} />
          <Slider.Thumb className={styles.thumb} aria-label="value slider" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}
