import styles from './ReactDocs.module.css';
import CopyButton from './CopyButton';

// A presentational code panel with an optional filename/label bar and a
// copy button. Server component apart from the CopyButton island.
export default function CodeBlock({
  code,
  title,
  className,
}: {
  code: string;
  /** Optional label rendered in the panel's top bar (e.g. a filename). */
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={[styles.codePanel, className].filter(Boolean).join(' ')}
    >
      <div className={styles.codePanelBar}>
        <span className={styles.codePanelTitle}>{title}</span>
        <CopyButton code={code} />
      </div>
      <pre className={styles.codeBlock}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
