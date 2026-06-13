import type { Metadata } from 'next';
import { TabbiedArtwork } from 'tabbied/react';

export const metadata: Metadata = {
  title: 'tabbied package test',
  robots: { index: false },
};

// Exercises the `tabbied` package the way an external consumer would: plain
// server-component JSX with no ssr:false ceremony (the component is a client
// boundary by itself and renders a measurable placeholder until mounted).
// Used by e2e/package.spec.ts to cover the fit strategies the main site
// doesn't reach (the gallery uses cover, the editor fixed).
export default function PackageTestPage() {
  return (
    <main style={{ padding: 24, display: 'grid', gap: 24 }}>
      <h1>tabbied package test</h1>

      {/* Adaptive grid (the default fit): cols × rows derive from the box.
          Radius paints cell backgrounds directly, which is what the e2e's
          painted-cell probe asserts on (stroke-based designs like maze draw
          via pseudo-elements instead). */}
      <section id="fit-grid">
        <h2>fit=&quot;grid&quot;</h2>
        <div style={{ height: 320 }}>
          <TabbiedArtwork
            artwork="radius"
            seed="k9Pz"
            fit="grid"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </section>

      {/* Authored grid stretched to the box. */}
      <section id="fit-stretch">
        <h2>fit=&quot;stretch&quot;</h2>
        <div style={{ height: 240 }}>
          <TabbiedArtwork
            artwork="radius"
            seed="k9Pz"
            fit="stretch"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </section>

      {/* Grid-less composition letterboxed at its authored 2:3 ratio. */}
      <section id="fit-contain">
        <h2>fit=&quot;contain&quot; (symmetry)</h2>
        <div style={{ height: 300 }}>
          <TabbiedArtwork
            artwork="symmetry"
            seed="k9Pz"
            fit="contain"
            decorative={false}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </section>
    </main>
  );
}
