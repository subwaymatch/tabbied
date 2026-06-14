import styles from './ReactDocs.module.css';

// A presentational code panel. Server component — it only formats text, so it
// adds no client bundle to the (mostly static) docs page.
export default function CodeBlock({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <pre className={[styles.codeBlock, className].filter(Boolean).join(' ')}>
      <code>{code}</code>
    </pre>
  );
}
