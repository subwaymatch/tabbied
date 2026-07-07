'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import styles from './ReactDocs.module.css';

// Copy-to-clipboard affordance for code blocks. Small client island; the
// surrounding CodeBlock stays a server component.
export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — quietly no-op.
    }
  };

  return (
    <button
      type="button"
      className={styles.copyButton}
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy code'}
      title="Copy code"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}
