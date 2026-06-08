'use client';

import { Switch } from '@base-ui-components/react/switch';
import styles from './ToggleSwitch.module.css';

type ToggleSwitchProps = {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
};

export default function ToggleSwitch({
  isChecked,
  onChange,
}: ToggleSwitchProps) {
  return (
    <Switch.Root
      checked={isChecked}
      onCheckedChange={onChange}
      className={styles.toggleSwitch}
    >
      <Switch.Thumb className={styles.thumb} />
    </Switch.Root>
  );
}
