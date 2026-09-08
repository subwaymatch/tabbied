import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TabbiedPattern } from 'tabbied/react';
import { radius, quilt } from 'tabbied/patterns';
import MainHeader from 'components/main-page/MainHeader';
import { Container, Row, Col } from 'components/layout';
import Footer from 'components/Footer';
import CodeBlock from 'components/react-docs-page/CodeBlock';
import Example from 'components/react-docs-page/Example';
import ReseedExportDemo from 'components/react-docs-page/ReseedExportDemo';
import DocsNav, {
  type DocsSection,
} from 'components/react-docs-page/DocsNav';
import styles from 'components/react-docs-page/ReactDocs.module.css';

export const metadata: Metadata = {
  title: 'Documentation - Tabbied',
  description:
    'Documentation for the tabbied npm package: render, resize, recolor, reseed, and export Tabbied generative patterns in React or vanilla JavaScript.',
};

const SECTIONS: DocsSection[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick start' },
  { id: 'presets', label: 'Importing presets' },
  { id: 'fit-modes', label: 'Sizing & fit modes' },
  { id: 'palettes', label: 'Colors & palettes' },
  { id: 'options', label: 'Options' },
  { id: 'seeds', label: 'Seeds, redraw & export' },
  { id: 'animation', label: 'Ambient animation' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'ssr', label: 'Server rendering' },
  { id: 'vanilla', label: 'Vanilla JavaScript' },
  { id: 'api', label: 'API reference' },
];

const installCode = `npm install tabbied`;

const basicCode = `import { TabbiedPattern } from 'tabbied/react';
import { radius } from 'tabbied/patterns';

export function Banner() {
  // The box fills its parent by default; height={320} pins one axis.
  return <TabbiedPattern pattern={radius} seed="k9Pz" height={320} />;
}`;

const treeShakeCode = `// Import only what you render - bundlers ship just those presets.
import { radius, windowpane } from 'tabbied/patterns';

// Building a gallery? The full record pulls in every design.
import { patterns } from 'tabbied/patterns';`;

const boxCode = `// Default: fill the containing block. .panel is 100% wide, 400px tall.
<div className="panel">
  <TabbiedPattern pattern={radius} />
</div>

// Fill the width, cap it, and let the ratio set the height.
<TabbiedPattern pattern={radius} maxWidth={960} aspectRatio={3 / 2} />

// Pin one axis; numbers are px, strings are CSS.
<TabbiedPattern pattern={radius} height={320} />
<TabbiedPattern pattern={radius} height="40vh" maxHeight={520} />

// Hand sizing back to a class name.
<TabbiedPattern pattern={radius} fill={false} className="hero-art" />`;

const fitCode = `// grid (default): the cell grid adapts to the container size
<TabbiedPattern pattern={radius} fit="grid" />

// cover: a fixed-resolution render scaled uniformly to fill the box.
// Every design is cell-tiled, so the render adapts to the box's shape
// and tiles it with whole cells - nothing is cropped mid-cell
<TabbiedPattern pattern={radius} fit="cover" />

// fixed: an explicit canvas size in px (what the Tabbied editor uses)
<TabbiedPattern pattern={radius} fit="fixed" width={360} height={540} />`;

const paletteCode = `<TabbiedPattern
  pattern={radius}
  seed="k9Pz"
  // color0 (the background) comes first
  palette={['#0b132b', '#5bc0be', '#6fffe9', '#ff6b6b']}
  fit="cover"
  height={280}
/>`;

const transparentCode = `// Any CSS color works for a slot - including 'transparent',
// which drops the background entirely.
<TabbiedPattern
  pattern={radius}
  palette={['transparent', '#232529', '#ff3d8b']}
/>`;

const optionsCode = `// Option ids come from the preset (the same controls the editor shows).
// Radius takes a grid size and a shape frequency.
<TabbiedPattern
  pattern={radius}
  seed="k9Pz"
  options={{ grid: '4x6', frequency: 0.6 }}
  fit="cover"
  height={280}
/>`;

const reseedCode = `import { useRef } from 'react';
import { TabbiedPattern, type TabbiedPatternHandle } from 'tabbied/react';
import { radius } from 'tabbied/patterns';

export function Reseedable() {
  const ref = useRef<TabbiedPatternHandle>(null);

  return (
    <>
      <TabbiedPattern ref={ref} pattern={radius} fit="cover" />
      <button onClick={() => ref.current?.redraw()}>Redraw</button>
      <button onClick={() => ref.current?.exportImage()}>Export PNG</button>
    </>
  );
}`;

const animatedCode = `// Reseed on a timer (the gallery's shimmer). Ticks are skipped while
// the tab is hidden or the element is outside the viewport. Under
// prefers-reduced-motion the timer never starts and the designs' own
// cell transitions are muted, so nothing here moves.
<TabbiedPattern
  pattern={quilt}
  fit="cover"
  redrawInterval={2000}
  height={280}
/>`;

const a11yCode = `// Decorative (default): hidden from assistive tech.
<TabbiedPattern pattern={radius} />

// Meaningful image: exposed with role="img" and a label.
<TabbiedPattern
  pattern={radius}
  decorative={false}
  ariaLabel="Generative pattern of quarter circles"
/>`;

const ssrCode = `// App Router: works directly in a Server Component tree - the
// component itself is the client boundary.
import { TabbiedPattern } from 'tabbied/react';
import { radius } from 'tabbied/patterns';

export default function Page() {
  return <TabbiedPattern pattern={radius} height={320} />;
}`;

const coreCode = `import { createPattern } from 'tabbied';
import { radius } from 'tabbied/patterns';

const controller = createPattern(document.querySelector('#stage'), {
  pattern: radius,
  seed: 'k9Pz',
  redrawInterval: 5200, // optional: reseed on a timer, gates included
  // Measured fits (grid/cover) mount asynchronously, once the
  // host's size is known - drive the controller from onReady.
  onReady: async () => {
    controller.redraw(); // re-randomize the seed
    await controller.exportImage();
  },
});

// later, when the pattern is removed:
controller.destroy();`;

const definitionCode = `import type { PatternDefinition } from 'tabbied';

const myPattern: PatternDefinition = {
  name: 'My design',
  slug: 'my-design',
  palette: ['#101418', '#3e8bff', '#3fffb2'],
  options: [
    {
      id: 'grid',
      displayName: 'Columns and rows',
      type: 'ButtonSelectGroup',
      default: '6x9',
      options: ['2x3', '4x6', '6x9'],
      replace: '\${grid}',
    },
  ],
  code: {
    style: '--rule: ( background: var(--color1); );',
    doodle:
      ':doodle { @grid: \${grid}; @size: \${width} \${height}; } ' +
      ':container { background: var(--color0); }',
  },
};`;

// The fit-mode gallery below. Every entry draws `radius` at the same seed into
// the same landscape and portrait boxes, so the only variable on show is `fit`;
// describing the modes in prose never makes clear how differently they treat
// a box that doesn't match the drawing.
const FIT_DEMOS = [
  {
    fit: 'grid',
    label: 'fit="grid"',
    note: 'The cell grid is re-derived per box, so cells stay square in both.',
  },
  {
    fit: 'cover',
    label: 'fit="cover"',
    note: 'One render, scaled uniformly to fill. Fixed-px strokes keep their proportions.',
  },
  {
    fit: 'fixed',
    label: 'fit="fixed"',
    note: 'A canvas of its own size - here 150 × 225, which each box crops.',
  },
] as const;

function Code({ children }: { children: ReactNode }) {
  return <code className={styles.inlineCode}>{children}</code>;
}

// One fit mode, drawn into both box shapes. Density 1 (90px cells) keeps the
// cells big enough to read as shapes at preview size - and to make it obvious
// when they stay square.
function FitDemo({
  fit,
  label,
  note,
}: {
  fit: (typeof FIT_DEMOS)[number]['fit'];
  label: string;
  note: string;
}) {
  const pattern = (
    <TabbiedPattern
      pattern={radius}
      seed="k9Pz"
      fit={fit}
      density={1}
      {...(fit === 'fixed' ? { width: 150, height: 225 } : {})}
    />
  );

  return (
    <figure className={styles.fitItem}>
      <div className={styles.fitShapes}>
        <div className={styles.fitWide}>{pattern}</div>
        <div className={styles.fitTall}>{pattern}</div>
      </div>
      <figcaption className={styles.fitCaption}>
        <code>{label}</code>
        {note}
      </figcaption>
    </figure>
  );
}

// A docs section with an anchored, hover-linkable heading.
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.subhead}>
        {title}
        <a className={styles.anchor} href={`#${id}`} aria-label={`Link to ${title}`}>
          #
        </a>
      </h2>
      {children}
    </section>
  );
}

export default function ReactDocsPage() {
  return (
    <>
      <MainHeader />

      <main style={{ padding: '3rem 0 4rem' }}>
        <Container>
          <Row>
            <Col lg={12} md={12}>
              <header className={styles.docsHeader}>
                <p className={styles.eyebrow}>Documentation</p>
                <h1 className={styles.pageTitle}>The tabbied package</h1>
                <p className={styles.intro}>
                  Tabbied&apos;s generative patterns as a library: a
                  framework-agnostic core plus a React component, powered by{' '}
                  <a href="https://css-doodle.com/">css-doodle</a>. Render any
                  preset (or your own definition) at any size, recolor it,
                  reseed it, and export it to PNG.
                </p>
                <div className={styles.headerMeta}>
                  <span className={styles.metaBadge}>tabbied · MIT</span>
                  <a
                    className={styles.metaLink}
                    href="https://www.npmjs.com/package/tabbied"
                    target="_blank"
                    rel="noreferrer"
                  >
                    npm
                  </a>
                  <a
                    className={styles.metaLink}
                    href="https://github.com/tabbied-design/tabbied/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </header>

              <div className={styles.docs}>
                <DocsNav sections={SECTIONS} />

                <article className={styles.article}>
                  <Section id="introduction" title="Introduction">
                    <p>
                      The <Code>tabbied</Code> package ships three entry
                      points:
                    </p>
                    <ul className={styles.list}>
                      <li>
                        <Code>tabbied/react</Code> - the{' '}
                        <Code>TabbiedPattern</Code> component. It renders an
                        pattern into a normal, CSS-sizeable box, like an{' '}
                        <Code>&lt;img&gt;</Code>.
                      </li>
                      <li>
                        <Code>tabbied/patterns</Code> - 100+ preset designs as
                        tree-shakeable <Code>PatternDefinition</Code> exports.
                      </li>
                      <li>
                        <Code>tabbied</Code> - the framework-agnostic core
                        (<Code>createPattern</Code>) plus all shared types and
                        sizing helpers.
                      </li>
                    </ul>
                    <p>
                      Patterns are deterministic: the same pattern, seed, grid
                      and options always draw the same design, at any size.
                      That makes patterns safe to use as reproducible brand
                      assets - a seed is a design you can keep.
                    </p>
                  </Section>

                  <Section id="installation" title="Installation">
                    <p>
                      React is an <em>optional</em> peer dependency - you only
                      need it for the <Code>tabbied/react</Code> entry point.
                      The only hard dependency is css-doodle, which is
                      installed automatically.
                    </p>
                    <CodeBlock
                      code={installCode}
                      title="terminal"
                      className={styles.codeStandalone}
                    />
                  </Section>

                  <Section id="quick-start" title="Quick start">
                    <p>
                      Import the component and a preset, then render it inside
                      a sized box. On the server and the first client paint it
                      shows the pattern&apos;s background color (correct size,
                      zero layout shift); the live pattern takes over once it
                      mounts.
                    </p>
                    <Example code={basicCode}>
                      <TabbiedPattern
                        pattern={radius}
                        seed="k9Pz"
                        fit="cover"
                        className={styles.demoArt}
                        style={{ width: '100%', height: 320 }}
                      />
                    </Example>
                  </Section>

                  <Section id="presets" title="Importing presets">
                    <p>
                      <Code>pattern</Code> takes an{' '}
                      <Code>PatternDefinition</Code> object. Each preset is a
                      side-effect-free named export, so importing only the
                      designs you render keeps the rest of the catalog out of
                      your bundle.
                    </p>
                    <CodeBlock
                      code={treeShakeCode}
                      className={styles.codeStandalone}
                    />
                    <p>
                      Browse every design (and its options) in the{' '}
                      <a href="/patterns/">gallery</a> - the preset export
                      name is the slug in the editor URL.
                    </p>
                  </Section>

                  <Section id="fit-modes" title="Sizing & fit modes">
                    <p>
                      Sizing splits in two: the <strong>box props</strong> say
                      how big the element is, and <Code>fit</Code> says how the
                      drawing meets that box. A pattern has no intrinsic size,
                      so by default the box simply{' '}
                      <strong>fills its containing block</strong> - drop one
                      into a sized parent and you are done.
                    </p>
                    <Example code={boxCode}>
                      <div className={styles.boxDemo}>
                        <figure className={styles.fitItem}>
                          <div className={styles.boxDemoFill}>
                            <TabbiedPattern
                              pattern={radius}
                              seed="k9Pz"
                              density={1}
                            />
                          </div>
                          <figcaption className={styles.fitCaption}>
                            <code>
                              &lt;TabbiedPattern pattern={'{radius}'} /&gt;
                            </code>
                            No sizing props - it fills the 120px-tall box it was
                            dropped into.
                          </figcaption>
                        </figure>
                        <figure className={styles.fitItem}>
                          <TabbiedPattern
                            pattern={radius}
                            seed="k9Pz"
                            density={1}
                            maxWidth={320}
                            aspectRatio={3 / 2}
                            className={styles.demoArt}
                          />
                          <figcaption className={styles.fitCaption}>
                            <code>maxWidth={'{320}'} aspectRatio={'{3 / 2}'}</code>
                            Fills the width up to 320px; the ratio sets the
                            height, with no sized parent involved.
                          </figcaption>
                        </figure>
                      </div>
                    </Example>
                    <p>
                      The box props are the CSS properties they are named
                      after, resolved onto the wrapper element (on the server
                      render too, so there is no layout shift on mount).
                      Numbers are px; strings are used as written.
                    </p>
                    <ul className={styles.list}>
                      <li>
                        <Code>fill</Code> (default <Code>true</Code>) - {' '}
                        <Code>width: 100%; height: 100%</Code>. An explicit{' '}
                        <Code>width</Code>/<Code>height</Code> takes over that
                        axis; <Code>fill={'{false}'}</Code> leaves the box to a
                        class name or the surrounding layout.
                      </li>
                      <li>
                        <Code>maxWidth</Code> / <Code>maxHeight</Code> - upper
                        bounds on the box.
                      </li>
                      <li>
                        <Code>aspectRatio</Code> - derives the height from the
                        width, so it pairs with <Code>maxWidth</Code> in a
                        parent that has no fixed height.
                      </li>
                    </ul>
                    <p>
                      One caveat comes with the territory:{' '}
                      <Code>height: 100%</Code> only resolves against a parent
                      with a definite height. In a parent that sizes to its
                      content, reach for <Code>height</Code> or{' '}
                      <Code>aspectRatio</Code> instead of <Code>fill</Code>.
                    </p>
                    <p>
                      Whatever the box turns out to be, the pattern is fitted
                      into it <strong>without distortion</strong> - nothing is
                      ever scaled by a different factor horizontally than
                      vertically. <Code>fit</Code> picks which
                      non-distorting strategy is used:
                    </p>
                    <ul className={styles.list}>
                      <li>
                        <Code>grid</Code> (default) - re-derives the cell grid
                        from the measured container, so any box is tiled
                        edge-to-edge with whole, near-square cells. Tune the
                        density with <Code>cellSize</Code> (px) or{' '}
                        <Code>density</Code> (0-4).
                      </li>
                      <li>
                        <Code>cover</Code> - draws a fixed-resolution render
                        and scales it uniformly into the box, preserving the
                        authored proportions of fixed-px strokes and shadows.
                        The render follows the box&apos;s aspect ratio and
                        re-derives its grid, so the pattern is never cut off
                        mid-cell.
                      </li>
                      <li>
                        <Code>fixed</Code> - renders at an explicit canvas
                        size, <Code>width</Code>/<Code>height</Code> in px
                        (default 360 × 540). This is what the Tabbied editor
                        uses.
                      </li>
                    </ul>
                    <p>
                      Every design supports all three, so <Code>fit</Code> is a
                      plain choice - omit it and you get <Code>grid</Code>.
                    </p>
                    <p>
                      Each column below is one mode, drawing the same pattern at
                      the same seed into a landscape box and a portrait one. The
                      differences only show up when the box stops matching the
                      drawing - which is most of the time.
                    </p>
                    <Example code={fitCode}>
                      <div className={styles.fitGrid}>
                        {FIT_DEMOS.map((demo) => (
                          <FitDemo key={demo.fit} {...demo} />
                        ))}
                      </div>
                    </Example>
                  </Section>

                  <Section id="palettes" title="Colors & palettes">
                    <p>
                      Pass <Code>palette</Code> to recolor a design - the
                      background color (<Code>color0</Code>) comes first,
                      followed by the inks. Passing fewer colors than the
                      pattern was authored with is fine: the unused slots
                      cycle back through your inks, so a two-color palette
                      redraws the whole design in your two colors.
                    </p>
                    <Example code={paletteCode}>
                      <TabbiedPattern
                        pattern={radius}
                        seed="k9Pz"
                        palette={['#0b132b', '#5bc0be', '#6fffe9', '#ff6b6b']}
                        fit="cover"
                        className={styles.demoArt}
                        style={{ width: '100%', height: 280 }}
                      />
                    </Example>
                    <CodeBlock
                      code={transparentCode}
                      className={styles.codeStandalone}
                    />
                    <div className={styles.callout}>
                      <p>
                        Trying a custom palette across every design? The{' '}
                        <a href="/patterns/">gallery</a> lets you save named
                        palettes (exportable as JSON) and preview all presets
                        with them - including with a transparent background.
                      </p>
                    </div>
                  </Section>

                  <Section id="options" title="Options">
                    <p>
                      Every preset exposes adjustable <Code>options</Code> -
                      the same controls the Tabbied editor shows. Pass them
                      keyed by option id; anything you omit uses the authored
                      default. Option ids and their allowed values live on the
                      definition itself (<Code>pattern.options</Code>), so you
                      can build your own controls against them.
                    </p>
                    <Example code={optionsCode}>
                      <TabbiedPattern
                        pattern={radius}
                        seed="k9Pz"
                        options={{ grid: '4x6', frequency: 0.6 }}
                        fit="cover"
                        className={styles.demoArt}
                        style={{ width: '100%', height: 280 }}
                      />
                    </Example>
                    <div className={styles.callout}>
                      <p>
                        Under <Code>fit=&quot;grid&quot;</Code> (and adaptive{' '}
                        <Code>cover</Code>) the <Code>grid</Code> option is
                        derived from the container, so a pinned{' '}
                        <Code>grid</Code> value acts as a density hint rather
                        than an exact count.
                      </p>
                    </div>
                  </Section>

                  <Section id="seeds" title="Seeds, redraw & export">
                    <p>
                      The <Code>seed</Code> prop pins the pattern: omit it for
                      a random variation per mount, or set it to freeze a
                      design you like. Grab a ref to the component&apos;s
                      handle to drive it imperatively - {' '}
                      <Code>redraw()</Code> re-randomizes (or sets) the seed,
                      morphing designs with CSS transitions between
                      variations, and <Code>exportImage()</Code> saves a PNG.
                      Try it:
                    </p>
                    <Example code={reseedCode}>
                      <ReseedExportDemo />
                    </Example>
                    <p>
                      <Code>exportImage()</Code> accepts{' '}
                      <Code>{'{ scale, name, download, detail }'}</Code> and
                      resolves when css-doodle has produced the file - bump{' '}
                      <Code>scale</Code> for print-resolution exports.
                    </p>
                    <p>
                      <Code>exportSvg()</Code> converts the rendered pattern
                      to a native vector SVG (real shapes and gradients, no{' '}
                      <Code>foreignObject</Code>) that opens in design tools
                      and scales to any resolution; pass{' '}
                      <Code>{'{ download: true }'}</Code> to save a{' '}
                      <Code>.svg</Code>. A few designs use smooth
                      conic-gradient sweeps SVG can&apos;t express - they set{' '}
                      <Code>svgExport: false</Code> in their definition, which{' '}
                      <Code>supportsSvgExport(pattern)</Code> checks.
                    </p>
                  </Section>

                  <Section id="animation" title="Ambient animation">
                    <p>
                      Set <Code>redrawInterval</Code> to reseed on a timer -
                      the gallery&apos;s shimmer. Ticks are dropped while the
                      tab is hidden or the element is scrolled out of the
                      viewport, so a long page of animated patterns only pays
                      for what&apos;s on screen. Use the <Code>paused</Code>{' '}
                      prop for your own gating on top (it preserves the timer
                      phase), and see{' '}
                      <a href="#accessibility">Accessibility</a> for what{' '}
                      <Code>prefers-reduced-motion</Code> switches off.
                    </p>
                    <Example code={animatedCode}>
                      <TabbiedPattern
                        pattern={quilt}
                        fit="cover"
                        redrawInterval={2000}
                        className={styles.demoArt}
                        style={{ width: '100%', height: 280 }}
                      />
                    </Example>
                  </Section>

                  <Section id="accessibility" title="Accessibility">
                    <p>
                      By default the pattern is decorative: the box is{' '}
                      <Code>aria-hidden</Code> and invisible to assistive
                      tech. Set <Code>decorative={'{false}'}</Code> to expose
                      it as an image with <Code>role=&quot;img&quot;</Code>{' '}
                      and an accessible name (<Code>ariaLabel</Code>, falling
                      back to the pattern&apos;s display name).
                    </p>
                    <CodeBlock
                      code={a11yCode}
                      className={styles.codeStandalone}
                    />
                    <h3 className={styles.minihead}>Reduced motion</h3>
                    <p>
                      A pattern has two sources of movement, and{' '}
                      <Code>prefers-reduced-motion: reduce</Code> suppresses
                      both - with no configuration and no props to pass:
                    </p>
                    <ul>
                      <li>
                        the <Code>redrawInterval</Code> timer never starts, and
                      </li>
                      <li>
                        the designs&apos; own cell transitions are muted, so
                        anything that re-renders cuts to the new arrangement
                        instead of morphing into it.
                      </li>
                    </ul>
                    <p>
                      The second half does more work than it sounds like. Every
                      design carries a ~400ms <Code>transition</Code>, and a
                      re-render is not always something the reader asked for:{' '}
                      <Code>grid</Code> and <Code>cover</Code> re-derive their
                      cell grid when the box changes, so turning a phone or
                      dragging a window would otherwise animate every cell on
                      the page. That is the passive motion the preference
                      exists for. A <Code>redraw()</Code> you call yourself is
                      muted on the same terms.
                    </p>
                    <p>
                      Nothing is lost either way - the pattern renders
                      identically, it just stops easing between states. The
                      preference is <em>observed</em>, not read once, so
                      toggling it while the page is open takes effect
                      immediately.
                    </p>
                  </Section>

                  <Section id="ssr" title="Server rendering">
                    <p>
                      <Code>TabbiedPattern</Code> is a client component (it
                      registers a browser custom element on import) with a
                      built-in server placeholder: on the server and the first
                      client paint it renders the wrapper box filled with the
                      pattern&apos;s background color - correct dimensions,
                      zero layout shift, no hydration mismatch. In the Next.js
                      App Router you can use it directly from Server
                      Components; no <Code>ssr: false</Code> ceremony needed.
                    </p>
                    <CodeBlock
                      code={ssrCode}
                      className={styles.codeStandalone}
                    />
                  </Section>

                  <Section id="vanilla" title="Vanilla JavaScript">
                    <p>
                      The React component is a thin wrapper over the
                      framework-free engine. <Code>createPattern(host,
                      config)</Code> mounts a pattern into any element and
                      returns a controller with{' '}
                      <Code>update()</Code>, <Code>redraw()</Code>,{' '}
                      <Code>exportImage()</Code>, <Code>exportSvg()</Code> and{' '}
                      <Code>destroy()</Code>.
                      It accepts the same config the component takes as props,
                      minus the box props - the host element is yours to size,
                      or run them through <Code>resolveBoxStyle()</Code>. That
                      includes <Code>redrawInterval</Code> and{' '}
                      <Code>paused</Code>: the timer and its reduced-motion,
                      tab-visibility and viewport gates live in the
                      controller, so patterns animate here without
                      reimplementing any of it.
                    </p>
                    <CodeBlock
                      code={coreCode}
                      className={styles.codeStandalone}
                    />
                  </Section>

                  <Section id="api" title="API reference">
                    <h3 className={styles.minihead}>
                      &lt;TabbiedPattern /&gt; props
                    </h3>
                    <div className={styles.tableScroll}>
                      <table className={styles.propsTable}>
                        <thead>
                          <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th className={styles.defaultCol}>Default</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className={styles.propName}>
                              pattern
                              <span className={styles.required}>required</span>
                            </td>
                            <td>
                              <code>PatternDefinition</code>
                            </td>
                            <td className={styles.defaultCol}> - </td>
                            <td>
                              The pattern to render - a preset from{' '}
                              <Code>tabbied/patterns</Code> or your own
                              definition.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>seed</td>
                            <td>
                              <code>string</code>
                            </td>
                            <td className={styles.defaultCol}>random</td>
                            <td>
                              Randomization seed. Omit for a random seed per mount;
                              reseed via the handle.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>palette</td>
                            <td>
                              <code>string[]</code>
                            </td>
                            <td className={styles.defaultCol}>preset palette</td>
                            <td>
                              Active colors, background (<code>color0</code>)
                              first. Shorter palettes cycle their inks into
                              the unused slots.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>options</td>
                            <td>
                              <code>Record&lt;string, OptionValue&gt;</code>
                            </td>
                            <td className={styles.defaultCol}>authored</td>
                            <td>
                              Option values keyed by option id; unset options
                              use authored defaults.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>fit</td>
                            <td>
                              <code>
                                &apos;grid&apos; | &apos;cover&apos; |
                                &apos;fixed&apos;
                              </code>
                            </td>
                            <td className={styles.defaultCol}>
                              &apos;grid&apos;
                            </td>
                            <td>
                              How the drawing meets its box - never by
                              distorting it (see{' '}
                              <a href="#fit-modes">Sizing &amp; fit modes</a>).
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>fill</td>
                            <td>
                              <code>boolean</code>
                            </td>
                            <td className={styles.defaultCol}>true</td>
                            <td>
                              Fill the containing block (
                              <code>width: 100%; height: 100%</code>).
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>
                              maxWidth / maxHeight
                            </td>
                            <td>
                              <code>number | string</code>
                            </td>
                            <td className={styles.defaultCol}> - </td>
                            <td>
                              Upper bounds on the box. Numbers are px.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>aspectRatio</td>
                            <td>
                              <code>number | string</code>
                            </td>
                            <td className={styles.defaultCol}> - </td>
                            <td>
                              CSS <code>aspect-ratio</code> - derives the
                              height from the width.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>cellSize</td>
                            <td>
                              <code>number</code>
                            </td>
                            <td className={styles.defaultCol}>36</td>
                            <td>
                              <Code>fit=&quot;grid&quot;</Code> - target cell
                              size in px.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>density</td>
                            <td>
                              <code>0 | 1 | 2 | 3 | 4</code>
                            </td>
                            <td className={styles.defaultCol}>4</td>
                            <td>
                              <Code>fit=&quot;grid&quot;</Code> - authored
                              density level, an alternative to{' '}
                              <Code>cellSize</Code>.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>width / height</td>
                            <td>
                              <code>number | string</code>
                            </td>
                            <td className={styles.defaultCol}>fill</td>
                            <td>
                              Box size; numbers are px. Under{' '}
                              <Code>fit=&quot;fixed&quot;</Code> the numeric
                              form is also the canvas size (default 360 × 540).
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>coverRender</td>
                            <td>
                              <code>{'{ width, height }'}</code>
                            </td>
                            <td className={styles.defaultCol}>800 × 800</td>
                            <td>
                              <Code>cover</Code> render
                              resolution override.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>redrawInterval</td>
                            <td>
                              <code>number</code>
                            </td>
                            <td className={styles.defaultCol}>off</td>
                            <td>
                              Re-randomize the seed every N ms (uncontrolled
                              seed only). Paused off-screen, in hidden tabs,
                              and under reduced motion.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>paused</td>
                            <td>
                              <code>boolean</code>
                            </td>
                            <td className={styles.defaultCol}>false</td>
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
                            <td className={styles.defaultCol}>true</td>
                            <td>
                              <code>true</code> renders an aria-hidden image;{' '}
                              <code>false</code> exposes{' '}
                              <code>role=&quot;img&quot;</code> with{' '}
                              <Code>ariaLabel</Code>.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>onReady</td>
                            <td>
                              <code>() =&gt; void</code>
                            </td>
                            <td className={styles.defaultCol}> - </td>
                            <td>
                              Called once the first pattern render is
                              committed.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>
                              className / style
                            </td>
                            <td>
                              <code>string</code> / <code>CSSProperties</code>
                            </td>
                            <td className={styles.defaultCol}> - </td>
                            <td>Applied to the wrapper box.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h3 className={styles.minihead}>Handle (ref)</h3>
                    <div className={styles.tableScroll}>
                      <table className={styles.propsTable}>
                        <thead>
                          <tr>
                            <th>Member</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className={styles.propName}>
                              redraw(seed?: string)
                            </td>
                            <td>
                              Re-randomize (or set) the seed, animating
                              designs with CSS transitions.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>
                              exportImage(options?)
                            </td>
                            <td>
                              PNG export via css-doodle. Returns a promise;
                              rejects before the pattern has mounted.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>
                              exportSvg(options?)
                            </td>
                            <td>
                              Native vector SVG export (no{' '}
                              <code>foreignObject</code>). Resolves with{' '}
                              <code>
                                {'{ svg, width, height, warnings }'}
                              </code>
                              ; <code>{'{ download: true }'}</code> saves a
                              file. Unavailable for definitions with{' '}
                              <code>svgExport: false</code>.
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.propName}>element</td>
                            <td>
                              The raw <code>&lt;css-doodle&gt;</code> element,
                              for power users.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h3 className={styles.minihead}>PatternDefinition</h3>
                    <p>
                      Presets are plain data. You can author your own - the
                      renderer only cares about the shape:
                    </p>
                    <CodeBlock
                      code={definitionCode}
                      className={styles.codeStandalone}
                    />
                    <p>
                      The full type (palette slots, option kinds, per-pattern
                      sizing metadata) ships with the package - {' '}
                      <Code>import type {'{ PatternDefinition }'} from
                      &apos;tabbied&apos;</Code>.
                    </p>
                  </Section>

                  <footer className={styles.articleFooter}>
                    <p>
                      Found a problem or missing something? Open an issue on{' '}
                      <a
                        href="https://github.com/tabbied-design/tabbied/issues"
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                      . The package is MIT-licensed - patterns you export are
                      yours to use anywhere.
                    </p>
                  </footer>
                </article>
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </>
  );
}
