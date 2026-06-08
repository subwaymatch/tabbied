'use client';

import type { ReactNode } from 'react';
import { ToggleGroup } from '@base-ui-components/react/toggle-group';
import { Toggle } from '@base-ui-components/react/toggle';
import styles from './ButtonSelectGroup.module.css';

type ButtonSelectGroupProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  // Optional custom renderer for an option's contents. Defaults to the option
  // string itself.
  renderOption?: (option: string) => ReactNode;
};

export default function ButtonSelectGroup({
  options,
  value,
  onChange,
  renderOption,
}: ButtonSelectGroupProps) {
  return (
    <ToggleGroup
      className={styles.buttonSelectGroup}
      value={[value]}
      onValueChange={(groupValue) => {
        const next = groupValue[0];

        // Ignore the empty array produced by clicking the active option —
        // one choice must always stay selected.
        if (next != null) {
          onChange(next);
        }
      }}
    >
      {options.map((option) => (
        <Toggle key={option} value={option} className={styles.option}>
          {renderOption ? renderOption(option) : option}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
