// Executing an edit plan against a live document.
//
// Short on purpose: everything that needed a decision was made in plan.ts.
// What is left is finding each annotated element and writing to it - and one
// rule that is load-bearing far outside this file.
//
// **This never touches classes.** It sets text, attributes, and inline custom
// properties, nothing else. The packaged HTML download ships a stylesheet
// trimmed to the classes its markup actually uses (`trimUnusedRules` in
// scripts/package-templates.mjs), and that trim is only safe because nothing
// adds a class after load. An editor that added one would silently ship a
// download with the matching rule missing.

import type { EditOperation, EditPlan } from './plan.js';
import { planEdits } from './plan.js';
import { parseEmphasis } from './text.js';
import {
  EDIT_IMAGE_ATTRIBUTE,
  EDIT_PATTERN_ATTRIBUTE,
  EDIT_ROOT_ATTRIBUTE,
  EDIT_TEXT_ATTRIBUTE,
} from './spec.js';
import type { EditsDocument, Problem, TemplateSpec } from './spec.js';

export type ApplyResult = {
  /** Operations that found their element and were written. */
  applied: number;
  /**
   * Validation problems, plus one per operation whose element was missing.
   * A missing element is the silent-rot failure this whole scheme exists to
   * make loud, so it is an error and it names the slot.
   */
  problems: Problem[];
};

type Root = ParentNode;

/**
 * Every element carrying a slot id, not just the first.
 *
 * A slot is a piece of *content*, and one piece of content legitimately
 * appears in several places: the brand name is in the masthead, the footer and
 * the copyright line; the primary call to action is in the nav and again in
 * the hero. Those are one editable thing, so they share an id and an edit
 * reaches all of them. The generator enforces the other half of that bargain -
 * elements sharing an id must currently say the same thing.
 */
const queryAll = (root: Root, selector: string): Element[] =>
  Array.from(root.querySelectorAll(selector));

const query = (root: Root, selector: string): Element | null =>
  root.querySelector(selector);

/**
 * The pattern host inside a slot: the element carrying `data-pattern`, which
 * is either the annotated element itself or the placeholder inside it.
 */
function patternHost(element: Element): Element | null {
  if (element.hasAttribute('data-pattern')) return element;

  return element.querySelector('[data-pattern]');
}

function imageElement(element: Element): Element | null {
  if (element.tagName.toLowerCase() === 'img') return element;

  return element.querySelector('img');
}

/**
 * Write a text value, rebuilding the `{em}` accent as real elements.
 *
 * Nodes rather than innerHTML: the value is user (or model) input, and
 * building text nodes means there is no markup path into the page at all
 * rather than an escaping function that has to stay correct forever.
 *
 * The accent's class is read off the element being replaced when there is one,
 * because class names are hashed in the export and rewritten again in the
 * download package - the spec's captured class is the fallback for a headline
 * that had no accent until now.
 */
function writeText(
  element: Element,
  value: string,
  format: string,
  emphasisClass: string | undefined
): void {
  if (format !== 'emphasis') {
    element.textContent = value;
    return;
  }

  const segments = parseEmphasis(value);
  const existing = element.querySelector('em');
  const className = existing?.getAttribute('class') ?? emphasisClass ?? null;
  const document = element.ownerDocument;

  if (!document) {
    element.textContent = value;
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const segment of segments) {
    if (!segment.emphasis) {
      fragment.appendChild(document.createTextNode(segment.text));
      continue;
    }

    const em = document.createElement('em');

    if (className) em.setAttribute('class', className);
    em.textContent = segment.text;
    fragment.appendChild(em);
  }

  element.textContent = '';
  element.appendChild(fragment);
}

function runOperation(root: Root, operation: EditOperation): Problem | null {
  switch (operation.type) {
    case 'properties': {
      const target =
        query(root, `[${EDIT_ROOT_ATTRIBUTE}]`) ??
        ((root as Document).documentElement ?? null);

      if (!target) {
        return {
          level: 'error',
          path: 'palette',
          message: `no [${EDIT_ROOT_ATTRIBUTE}] element to write brand colours onto`,
        };
      }

      const style = (target as HTMLElement).style;

      for (const [property, value] of Object.entries(operation.properties)) {
        style.setProperty(property, value);
      }

      return null;
    }

    case 'text': {
      const elements = queryAll(
        root,
        `[${EDIT_TEXT_ATTRIBUTE}="${operation.id}"]`
      );

      if (elements.length === 0) {
        return {
          level: 'error',
          path: `text.${operation.id}`,
          message: `no element carrying ${EDIT_TEXT_ATTRIBUTE}="${operation.id}"`,
        };
      }

      for (const element of elements) {
        writeText(
          element,
          operation.value,
          operation.format,
          operation.emphasisClass
        );
      }

      return null;
    }

    case 'image': {
      const slots = queryAll(root, `[${EDIT_IMAGE_ATTRIBUTE}="${operation.id}"]`);
      const elements = slots
        .map((slot) => imageElement(slot))
        .filter((element): element is Element => element != null);

      if (elements.length === 0) {
        return {
          level: 'error',
          path: `images.${operation.id}`,
          message:
            slots.length > 0
              ? `slot "${operation.id}" contains no <img>`
              : `no element carrying ${EDIT_IMAGE_ATTRIBUTE}="${operation.id}"`,
        };
      }

      for (const element of elements) {
        element.setAttribute('src', operation.src);
        if (operation.alt != null) element.setAttribute('alt', operation.alt);
        // The export sizes images with a cache-busting query and intrinsic
        // dimensions; a replacement has neither, and a stale srcset would win
        // over the new src.
        element.removeAttribute('srcset');
      }

      return null;
    }

    case 'pattern': {
      const slots = queryAll(
        root,
        `[${EDIT_PATTERN_ATTRIBUTE}="${operation.id}"]`
      );
      const elements = slots
        .map((slot) => patternHost(slot))
        .filter((element): element is Element => element != null);

      if (elements.length === 0) {
        return {
          level: 'error',
          path: `patterns.${operation.id}`,
          message:
            slots.length > 0
              ? `slot "${operation.id}" contains no [data-pattern] host`
              : `no element carrying ${EDIT_PATTERN_ATTRIBUTE}="${operation.id}"`,
        };
      }

      for (const element of elements) {
        for (const [name, value] of Object.entries(operation.attributes)) {
          if (value == null) element.removeAttribute(name);
          else element.setAttribute(name, value);
        }
      }

      return null;
    }
  }
}

/**
 * Run a plan against a document (or any subtree).
 *
 * Note what this does *not* do: it leaves the page's patterns alone as objects.
 * Rewriting `data-*` is the whole change; re-mounting them is
 * `hydratePatterns()`'s job in a packaged template, and the live controller's
 * `update()` in the editor. Keeping those separate is what lets the same
 * function serve a detached DOM in a build script and a running page.
 */
export function applyPlan(root: Root, plan: EditPlan): ApplyResult {
  const problems = [...plan.problems];
  let applied = 0;

  for (const operation of plan.operations) {
    const problem = runOperation(root, operation);

    if (problem) problems.push(problem);
    else applied += 1;
  }

  return { applied, problems };
}

/** Plan and apply in one step - the common case. */
export function applyEdits(
  root: Root,
  spec: TemplateSpec,
  document: EditsDocument
): ApplyResult {
  return applyPlan(root, planEdits(spec, document));
}
