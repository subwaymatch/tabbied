'use client';

import { useState } from 'react';
import s from './ShowcaseSite.module.css';

// The site palette (and its background color) is appended to every prompt so a
// generated image blends into the page.
export function withPalette(prompt: string, colors: string[]): string {
  const bg = colors[0];
  return `${prompt} Color palette: ${colors.join(', ')}. Use ${bg} as the background so the image blends into the page.`;
}

// Card imagery is a labelled placeholder carrying a ready-to-use GPT Image 2
// prompt. The display text is clamped, so a copy button lifts the full prompt
// (from data-image-prompt) to the clipboard.
export default function ImageCard({
  prompt,
  colors,
}: {
  prompt: string;
  colors: string[];
}) {
  const full = withPalette(prompt, colors);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = full;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <figure className={s.imgph} data-image-prompt={full}>
      <div className={s.imgphInner}>
        <span className={s.imgphBadge}>◳ GPT Image 2 prompt</span>
        <p className={s.imgphText}>{full}</p>
        <button type="button" className={s.imgphCopy} onClick={copy} aria-label="Copy prompt">
          {copied ? '✓ Copied' : '⧉ Copy prompt'}
        </button>
      </div>
    </figure>
  );
}
