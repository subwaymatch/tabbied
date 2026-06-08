import type { CSSProperties, ReactNode } from 'react';
import styles from './grid.module.css';

type RowProps = {
  /** Remove the column gutter (old Bootstrap `g-0`). */
  noGutter?: boolean;
  /** Cross-axis alignment, e.g. "center". */
  align?: CSSProperties['alignItems'];
  className?: string;
  children?: ReactNode;
};

export default function Row({ noGutter, align, className, children }: RowProps) {
  const classes = [styles.row, noGutter && styles.noGutter, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={align ? { alignItems: align } : undefined}>
      {children}
    </div>
  );
}
