'use client';

import type { CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import styles from './LogoDoodle.module.css';

// css-doodle registers a browser custom element on import, so the doodle
// itself can only render on the client (same pattern as the Hero and the
// gallery thumbnails). The sizing wrapper renders on the server so the header
// reserves the logo's space and nothing shifts when the doodle mounts.
const LogoDoodleInner = dynamic(() => import('./LogoDoodleInner'), {
  ssr: false,
});

type LogoDoodleProps = {
  /**
   * Optional edge length (number = px, or any CSS length). When omitted, the
   * logo is sized by the `--logo-size` CSS variable (default 52px), so it can
   * also be resized from a parent stylesheet or media query.
   */
  size?: number | string;
  className?: string;
};

export default function LogoDoodle({ size, className }: LogoDoodleProps) {
  const style =
    size !== undefined
      ? ({
          '--logo-size': typeof size === 'number' ? `${size}px` : size,
        } as CSSProperties)
      : undefined;

  return (
    <span
      className={[styles.logo, className].filter(Boolean).join(' ')}
      style={style}
    >
      <LogoDoodleInner />
    </span>
  );
}
