import type { Metadata } from 'next';
import { TabbiedArtwork } from 'tabbied/react';
import { radius, symmetry, quilt } from 'tabbied/artworks';
import MainHeader from 'components/main-page/MainHeader';
import { Container, Row, Col } from 'components/layout';
import Footer from 'components/Footer';
import CodeBlock from 'components/react-docs-page/CodeBlock';
import Example from 'components/react-docs-page/Example';
import ReseedExportDemo from 'components/react-docs-page/ReseedExportDemo';
import styles from 'components/react-docs-page/ReactDocs.module.css';

export const metadata: Metadata = {
  title: 'React Component - Tabbied',
  description:
    'Use the TabbiedArtwork React component to render, recolor, reseed, and export Tabbied generative artworks.',
};

const installCode = `npm install tabbied`;

const basicCode = `import { TabbiedArtwork } from 'tabbied/react';
import { radius } from 'tabbied/artworks';

export function Banner() {
  return (
    <TabbiedArtwork
      artwork={radius}
      seed="k9Pz"
      fit="cover"
      style={{ width: '100%', height: 320 }}
    />
  );
}`;

const fitCode = `// grid (default): the cell grid adapts to the container size
<TabbiedArtwork artwork={radius} fit="grid" />

// cover: a fixed-resolution render is scaled to fill the box
<TabbiedArtwork artwork={radius} fit="cover" />

// contain: letterboxed at the artwork's authored ratio
<TabbiedArtwork artwork={symmetry} fit="contain" />

// stretch keeps the authored grid; fixed renders at width/height props`;

const paletteCode = `<TabbiedArtwork
  artwork={radius}
  seed="k9Pz"
  // color0 (the background) comes first
  palette={['#0b132b', '#5bc0be', '#6fffe9', '#ff6b6b']}
  fit="cover"
  style={{ width: '100%', height: 280 }}
/>`;

const optionsCode = `// Option ids come from the preset (the same controls the editor shows).
// Radius takes a grid size, a shape frequency, and a shadow toggle.
<TabbiedArtwork
  artwork={radius}
  seed="k9Pz"
  options={{ grid: '4x6', shadow: true }}
  fit="cover"
  style={{ width: '100%', height: 280 }}
/>`;

const reseedCode = `import { useRef } from 'react';
import { TabbiedArtwork, type TabbiedArtworkHandle } from 'tabbied/react';
import { radius } from 'tabbied/artworks';

export function Reseedable() {
  const ref = useRef<TabbiedArtworkHandle>(null);

  return (
    <>
      <TabbiedArtwork ref={ref} artwork={radius} fit="cover" />
      <button onClick={() => ref.current?.redraw()}>Redraw</button>
      <button onClick={() => ref.current?.exportImage()}>Export PNG</button>
    </>
  );
}`;

const animatedCode = `// Reseed on a timer (the gallery's shimmer). Paused while the tab is
// hidden, and skipped entirely under prefers-reduced-motion.
<TabbiedArtwork
  artwork={quilt}
  fit="cover"
  redrawInterval={2000}
  style={{ width: '100%', height: 280 }}
/>`;

const treeShakeCode = `// Import only what you render — bundlers ship just those presets.
import { radius, symmetry } from 'tabbied/artworks';

// Building a gallery? The full record pulls in every design.
import { artworks } from 'tabbied/artworks';`;

const coreCode = `import { createArtwork } from 'tabbied';
import { radius } from 'tabbied/artworks';

const controller = createArtwork(document.querySelector('#stage'), {
  artwork: radius,
  seed: 'k9Pz',
});

controller.redraw();         // re-randomize the seed
await controller.exportImage();
controller.destroy();`;

function Code({ children }: { children: string }) {
  return <code className={styles.inlineCode}>{children}</code>;
}

export default function ReactDocsPage() {
  return (
    <>
      <MainHeader />

      <main style={{ padding: '3rem 0 4rem' }}>
        <Container>
          <Row>
            <Col lg={{ span: 10, offset: 1 }} md={12}>
              <div className={styles.docs}>
                <h3 className="section-title">React Component</h3>

                <p className={styles.intro}>
                  <Code>TabbiedArtwork</Code> renders a Tabbied generative
                  artwork into a normal, CSS-sizeable box — like an{' '}
                  <Code>&lt;img&gt;</Code> — powered by{' '}
                  <a href="https://css-doodle.com/">css-doodle</a>. Point it at
                  any preset (or your own definition), size it with CSS, reseed
                  it, and export it to PNG.
                </p>

                {/* Install */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Install</h4>
                  <p>
                    The component ships in the <Code>tabbied</Code> package.
                    React is an <em>optional</em> peer dependency — you only
                    need it for the <Code>tabbied/react</Code> entry point.
                  </p>
                  <CodeBlock code={installCode} className={styles.codeStandalone} />
                </section>

                {/* Basic usage */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Basic usage</h4>
                  <p>
                    Import the component and a preset, then render it inside a
                    sized box. On the server and the first client paint it shows
                    the artwork&apos;s background color (correct size, zero
                    layout shift); the live pattern takes over once it mounts.
                  </p>
                  <Example code={basicCode}>
                    <TabbiedArtwork
                      artwork={radius}
                      seed="k9Pz"
                      fit="cover"
                      className={styles.demoArt}
                      style={{ width: '100%', height: 320 }}
                    />
                  </Example>
                </section>

                {/* Fit modes */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Fit modes</h4>
                  <p>
                    The <Code>fit</Code> prop controls how the artwork relates
                    to its box:
                  </p>
                  <ul className={styles.list}>
                    <li>
                      <Code>grid</Code> (default) adapts the cell grid to the
                      measured container.
                    </li>
                    <li>
                      <Code>stretch</Code> keeps the authored grid and stretches
                      it to fill.
                    </li>
                    <li>
                      <Code>cover</Code> / <Code>contain</Code> scale a
                      fixed-resolution render (preserving fixed-px effects) to
                      fill or letterbox the box.
                    </li>
                    <li>
                      <Code>fixed</Code> renders at explicit <Code>width</Code>{' '}
                      / <Code>height</Code> props.
                    </li>
                  </ul>
                  <p>
                    Each artwork also declares a sensible default, so{' '}
                    <Code>fit</Code> is optional.
                  </p>
                  <Example code={fitCode}>
                    <div className={styles.fitGrid}>
                      <figure className={styles.fitItem}>
                        <div className={styles.fitBox}>
                          <TabbiedArtwork
                            artwork={radius}
                            seed="k9Pz"
                            fit="grid"
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                        <figcaption className={styles.fitCaption}>
                          fit=&quot;grid&quot;
                        </figcaption>
                      </figure>
                      <figure className={styles.fitItem}>
                        <div className={styles.fitBox}>
                          <TabbiedArtwork
                            artwork={radius}
                            seed="k9Pz"
                            fit="cover"
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                        <figcaption className={styles.fitCaption}>
                          fit=&quot;cover&quot;
                        </figcaption>
                      </figure>
                      <figure className={styles.fitItem}>
                        <div className={styles.fitBox}>
                          <TabbiedArtwork
                            artwork={symmetry}
                            seed="k9Pz"
                            fit="contain"
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                        <figcaption className={styles.fitCaption}>
                          fit=&quot;contain&quot;
                        </figcaption>
                      </figure>
                    </div>
                  </Example>
                </section>

                {/* Custom palette */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Custom palette</h4>
                  <p>
                    Pass <Code>palette</Code> to recolor a design — the
                    background color (<Code>color0</Code>) comes first.
                    Unspecified slots fall back to the preset&apos;s palette.
                  </p>
                  <Example code={paletteCode}>
                    <TabbiedArtwork
                      artwork={radius}
                      seed="k9Pz"
                      palette={['#0b132b', '#5bc0be', '#6fffe9', '#ff6b6b']}
                      fit="cover"
                      className={styles.demoArt}
                      style={{ width: '100%', height: 280 }}
                    />
                  </Example>
                </section>

                {/* Options */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Options</h4>
                  <p>
                    Every preset exposes adjustable <Code>options</Code> — the
                    same controls the Tabbied editor shows. Pass them keyed by
                    option id; anything you omit uses the authored default.
                  </p>
                  <Example code={optionsCode}>
                    <TabbiedArtwork
                      artwork={radius}
                      seed="k9Pz"
                      options={{ grid: '4x6', shadow: true }}
                      fit="cover"
                      className={styles.demoArt}
                      style={{ width: '100%', height: 280 }}
                    />
                  </Example>
                </section>

                {/* Reseed & export */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Reseed &amp; export</h4>
                  <p>
                    Grab a ref to the component&apos;s handle to drive it
                    imperatively: <Code>redraw()</Code> re-randomizes the seed
                    (designs with CSS transitions morph between variations), and{' '}
                    <Code>exportImage()</Code> saves a PNG. Try it:
                  </p>
                  <Example code={reseedCode}>
                    <ReseedExportDemo />
                  </Example>
                </section>

                {/* Ambient animation */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Ambient animation</h4>
                  <p>
                    Set <Code>redrawInterval</Code> to reseed on a timer — the
                    gallery&apos;s shimmer. It pauses while the tab is hidden (or
                    when <Code>paused</Code> is set) and is skipped entirely
                    under <Code>prefers-reduced-motion</Code>.
                  </p>
                  <Example code={animatedCode}>
                    <TabbiedArtwork
                      artwork={quilt}
                      fit="cover"
                      redrawInterval={2000}
                      className={styles.demoArt}
                      style={{ width: '100%', height: 280 }}
                    />
                  </Example>
                </section>

                {/* Props */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Props</h4>
                  <table className={styles.propsTable}>
                    <thead>
                      <tr>
                        <th>Prop</th>
                        <th>Type</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={styles.propName}>artwork</td>
                        <td>
                          <code>ArtworkDefinition</code>
                        </td>
                        <td>
                          The artwork to render. Import a preset from{' '}
                          <Code>tabbied/artworks</Code> or pass your own
                          definition. Required.
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>seed</td>
                        <td>
                          <code>string</code>
                        </td>
                        <td>
                          Pattern seed. Omit for a random seed per mount; reseed
                          via the handle.
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>palette</td>
                        <td>
                          <code>string[]</code>
                        </td>
                        <td>
                          Active colors, background (<code>color0</code>) first.
                          Defaults to the preset palette.
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>options</td>
                        <td>
                          <code>Record&lt;string, OptionValue&gt;</code>
                        </td>
                        <td>
                          Option values keyed by option id; unset options use
                          authored defaults.
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>fit</td>
                        <td>
                          <code>
                            &apos;grid&apos; | &apos;stretch&apos; |
                            &apos;cover&apos; | &apos;contain&apos; |
                            &apos;fixed&apos;
                          </code>
                        </td>
                        <td>How the artwork fills its box. Defaults per artwork.</td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>cellSize</td>
                        <td>
                          <code>number</code>
                        </td>
                        <td>
                          <Code>fit=&quot;grid&quot;</Code> — target cell size in
                          px (default 36).
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>density</td>
                        <td>
                          <code>0 | 1 | 2 | 3 | 4</code>
                        </td>
                        <td>
                          <Code>fit=&quot;grid&quot;</Code> — authored density
                          level, an alternative to <Code>cellSize</Code>.
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>width / height</td>
                        <td>
                          <code>number</code>
                        </td>
                        <td>
                          <Code>fit=&quot;fixed&quot;</Code> — canvas size in px.
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>coverRender</td>
                        <td>
                          <code>{'{ width, height, cropTop? }'}</code>
                        </td>
                        <td>
                          <Code>cover</Code>/<Code>contain</Code> render
                          resolution override.
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>redrawInterval</td>
                        <td>
                          <code>number</code>
                        </td>
                        <td>
                          Re-randomize the seed every N ms (uncontrolled seed
                          only).
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>paused</td>
                        <td>
                          <code>boolean</code>
                        </td>
                        <td>
                          Pause <Code>redrawInterval</Code> ticks without
                          resetting the timer.
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>decorative</td>
                        <td>
                          <code>boolean</code>
                        </td>
                        <td>
                          <code>true</code> (default) renders an aria-hidden
                          image; <code>false</code> exposes{' '}
                          <code>role=&quot;img&quot;</code> with{' '}
                          <Code>ariaLabel</Code>.
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>onReady</td>
                        <td>
                          <code>() =&gt; void</code>
                        </td>
                        <td>Called once the first pattern render is committed.</td>
                      </tr>
                      <tr>
                        <td className={styles.propName}>className / style</td>
                        <td>
                          <code>string</code> / <code>CSSProperties</code>
                        </td>
                        <td>Applied to the wrapper box.</td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    See the inline JSDoc on <Code>TabbiedArtworkProps</Code> for
                    the full list.
                  </p>
                </section>

                {/* Handle */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Handle (ref)</h4>
                  <p>
                    A <Code>ref</Code> exposes a{' '}
                    <Code>TabbiedArtworkHandle</Code>:
                  </p>
                  <table className={styles.propsTable}>
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <code>redraw(seed?: string)</code>
                        </td>
                        <td>
                          Re-randomize (or set) the seed, animating designs with
                          CSS transitions.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code>exportImage(options?)</code>
                        </td>
                        <td>PNG export via css-doodle. Returns a promise.</td>
                      </tr>
                      <tr>
                        <td>
                          <code>element</code>
                        </td>
                        <td>
                          The raw <code>&lt;css-doodle&gt;</code> element, for
                          power users.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                {/* Tree-shaking */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Importing presets</h4>
                  <p>
                    <Code>artwork</Code> takes an <Code>ArtworkDefinition</Code>
                    . Each preset is a side-effect-free named export, so
                    importing only the ones you render keeps unused designs out
                    of your bundle.
                  </p>
                  <CodeBlock code={treeShakeCode} className={styles.codeStandalone} />
                </section>

                {/* SSR note */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Server components</h4>
                  <p>
                    <Code>TabbiedArtwork</Code> is a client component (it
                    registers a browser custom element on import). In the
                    Next.js App Router, render it from a client boundary, or rely
                    on its built-in measurable placeholder — it renders a
                    correctly-sized box on the server and hydrates without a
                    mismatch.
                  </p>
                </section>

                {/* Core */}
                <section className={styles.section}>
                  <h4 className={styles.subhead}>Not using React?</h4>
                  <p>
                    The same engine is available framework-free as{' '}
                    <Code>createArtwork</Code> from <Code>tabbied</Code>.
                  </p>
                  <CodeBlock code={coreCode} className={styles.codeStandalone} />
                  <p>
                    Browse the source, the full prop docs, and all 84 presets on{' '}
                    <a href="https://github.com/subwaymatch/tabbied/">GitHub</a>.
                  </p>
                </section>
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </>
  );
}
