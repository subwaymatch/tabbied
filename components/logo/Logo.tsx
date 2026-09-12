import type { CSSProperties } from 'react';
import { cormorantGaramond } from 'lib/fonts';
import LogoMark from './LogoMark';
import styles from './Logo.module.css';

// The masthead lockup: the mark plus the word. Every light nav draws it at
// 20/18, the homepage's dark nav a hair larger; nothing else varies, so the
// two sizes are props rather than a stylesheet per header.
//
// It renders no link of its own - the headers each wrap it in the anchor they
// already have, with the label they already give it.
//
// The wordmark's font variable is declared *here*, not on a route and not in
// the root layout. On the root layout the class rode `<html>` onto all 77
// template pages, which draw no lockup and whose downloadable package then
// carried a class with no rule behind it (e2e/templates.spec.ts catches
// exactly that). Per route it would be a line to remember in every masthead's
// page. On the component it is requested wherever the word is actually drawn,
// which is the only place it is read.
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
      className={[cormorantGaramond.variable, styles.lockup, className]
        .filter(Boolean)
        .join(' ')}
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
