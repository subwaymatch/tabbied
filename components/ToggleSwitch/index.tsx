'use client';

import { Switch } from '@base-ui-components/react/switch';
import styles from './ToggleSwitch.module.css';

type ToggleSwitchProps = {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  /** Compact variant for dense UI (e.g. inside dialogs). */
  small?: boolean;
};

export default function ToggleSwitch({
  isChecked,
  onChange,
  small = false,
}: ToggleSwitchProps) {
  return (
    <Switch.Root
      checked={isChecked}
      onCheckedChange={onChange}
      className={
        small ? `${styles.toggleSwitch} ${styles.small}` : styles.toggleSwitch
      }
    >
      <Switch.Thumb className={styles.thumb} />
    </Switch.Root>
  );
}
