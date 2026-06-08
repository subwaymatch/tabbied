'use client';

import styles from './ValueSlider.module.scss';

type ValueSliderPropTypes = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
};

export default function ValueSlider({
  min,
  max,
  step,
  value,
  onChange,
}: ValueSliderPropTypes) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <input
      type="range"
      className={styles.slider}
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label="value slider"
      onChange={(e) => {
        onChange(Number(e.target.value));
      }}
      style={{
        background: `linear-gradient(to right, #232529 0%, #232529 ${percent}%, #98a0af ${percent}%, #98a0af 100%)`,
      }}
    />
  );
}
