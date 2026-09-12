import type { CSSProperties } from 'react';
import LogoMark from './LogoMark';
import styles from './Logo.module.css';

// The masthead lockup: the mark plus the word. Every light nav draws it at
// 20/18, the homepage's dark nav a hair larger; nothing else varies, so the
// two sizes are props rather than a stylesheet per header.
//
// It renders no link of its own - the headers each wrap it in the anchor they
// already have, with the label they already give it.
export default function Logo({
  size = 20,
  wordSize = 18,
  gap = 10,
  className,
  style,
}: {
  size?: number;
  wordSize?: number;
  gap?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={[styles.lockup, className].filter(Boolean).join(' ')}
      style={
        {
          '--logo-gap': `${gap}px`,
          '--logo-word-size': `${wordSize}px`,
          ...style,
        } as CSSProperties
      }
    >
      <LogoMark size={size} />
      <span className={styles.word}>tabbied</span>
    </span>
  );
}
