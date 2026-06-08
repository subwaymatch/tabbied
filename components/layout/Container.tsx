import type { ReactNode } from 'react';
import styles from './grid.module.css';

type ContainerProps = {
  /** Go edge-to-edge (no max-width / padding) below the md breakpoint. */
  fluidOnMobile?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function Container({
  fluidOnMobile,
  className,
  children,
}: ContainerProps) {
  const classes = [
    styles.container,
    fluidOnMobile && styles.containerFluidOnMobile,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
