import type { ReactNode } from 'react';
import CodeBlock from './CodeBlock';
import styles from './ReactDocs.module.css';

// Pairs a live preview (children) with the source that produced it. The live
// artwork is passed in as children — a client island — so this stays a server
// component.
export default function Example({
  code,
  children,
}: {
  code: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.example}>
      <div className={styles.preview}>{children}</div>
      <CodeBlock code={code} />
    </div>
  );
}
