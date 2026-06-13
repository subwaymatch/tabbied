// Importing css-doodle registers the <css-doodle> custom element — that side
// effect is the entire point of this module. It is isolated here (and listed
// in package.json "sideEffects") so tree-shaking bundlers never drop the
// registration while everything else stays shakeable. Safe to import during
// SSR: css-doodle guards its customElements.define() call, so plain Node
// imports are no-ops.
import 'css-doodle';
