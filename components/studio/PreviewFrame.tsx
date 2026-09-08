'use client';

import type { RefObject } from 'react';
import type { Problem } from 'tabbied-templates';
import styles from './StudioPreview.module.css';

/**
 * The iframe a built preview document renders in, plus the notice for
 * anything the engine could not apply. Shared by the direction preview and the
 * site workspace, which differ in what they load and not in how they show it.
 */
export default function PreviewFrame({
  html,
  problems,
  title,
  frameRef,
}: {
  html: string;
  problems: Problem[];
  title: string;
  /** The editor reaches into the document through this. */
  frameRef?: RefObject<HTMLIFrameElement | null>;
}) {
  const shell = problems.filter((problem) => problem.path === 'runtime');
  const engine = problems.filter(
    (problem) => problem.level === 'error' && problem.path !== 'runtime'
  );

  return (
    <>
      {/* Reported rather than swallowed. Two kinds, told apart because a person
          can act on one and not the other: a slot the engine could not find is
          a template whose annotations have drifted; a missing bootstrap is the
          shell's problem and reads as "patterns will not draw". */}
      {shell.length > 0 ? (
        <p className={styles.notice} role="status">
          The template package has changed shape and its patterns cannot be
          drawn here. The text and colours below are still applied.
        </p>
      ) : null}
      {engine.length > 0 ? (
        <p className={styles.notice} role="status">
          {engine.length === 1
            ? 'One part of this document could not be placed on the template: '
            : `${engine.length} parts of this document could not be placed on the template: `}
          {engine.map((problem) => problem.path).join(', ')}.
        </p>
      ) : null}

      <div className={styles.frame}>
        <iframe
          ref={frameRef}
          className={styles.iframe}
          title={title}
          srcDoc={html}
          // `allow-same-origin` is required, not lazy: without it the document
          // gets an opaque origin and the same-origin runtime import is blocked
          // as cross-origin, so the page renders with every pattern missing.
          // What stays denied is what this page actually has: the packaged
          // template's `<form action="#">` and its `<a href="#">` links cannot
          // navigate the top frame, submit, or open a popup. The content is
          // first-party throughout - our template, our runtime - and the only
          // model-authored strings reach it as text nodes (`writeText` builds
          // them with createTextNode precisely so there is no markup path).
          // That reasoning holds *until* user-supplied markup or images enter
          // this document; revisit it then, not after.
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  );
}
