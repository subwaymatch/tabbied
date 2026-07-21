import type { Metadata } from 'next';
import { TabbiedArtwork } from 'tabbied/react';
import type { ArtworkDefinition } from 'tabbied';
import {
  // static-sample primaries
  plasma, pebble, circuit, foliage, bauhaus, confetti, veil, awning, tetro, halftone,
  // react-showcase primaries
  petal, quilt, spectrum, lattice, windowpane, frond, maze, bokeh, prisma, metro,
} from 'tabbied/artworks';
import { STATIC_SAMPLES } from 'components/showcase/galleryData';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';
import s from './samples.module.css';

export const metadata: Metadata = {
  title: 'Made with Tabbied — 20 Sample Websites',
  description:
    'Twenty sample websites using Tabbied generative artworks as design accents — ten static HTML builds and ten built with the TabbiedArtwork React component.',
};

const ART: Record<string, ArtworkDefinition> = {
  plasma, pebble, circuit, foliage, bauhaus, confetti, veil, awning, tetro, halftone,
  petal, quilt, spectrum, lattice, windowpane, frond, maze, bokeh, prisma, metro,
};

type CardData = {
  href: string;
  n: number;
  name: string;
  topic: string;
  artwork: string;
  paletteName: string;
  colors: string[];
  seed: string;
};

function Card({ c }: { c: CardData }) {
  return (
    <a className={s.card} href={c.href}>
      <div className={s.thumb}>
        <TabbiedArtwork
          artwork={ART[c.artwork]}
          palette={c.colors}
          seed={c.seed}
          fit="cover"
          density={2}
        />
      </div>
      <div className={s.cbody}>
        <div className={s.ci}>
          <span className={s.num}>{String(c.n).padStart(2, '0')}</span>
          <h3>{c.name}</h3>
        </div>
        <p>{c.topic}</p>
        <div className={s.foot}>
          <div className={s.sw}>
            {c.colors.map((col, i) => (
              <span key={i} style={{ background: col }} />
            ))}
          </div>
          <div className={s.pn}>
            {c.paletteName} · {c.artwork}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function SamplesGallery() {
  const staticCards: CardData[] = STATIC_SAMPLES.map((x, i) => ({
    href: `/samples/${x.dir}/`,
    n: i + 1,
    name: x.name,
    topic: x.topic,
    artwork: x.artwork,
    paletteName: x.paletteName,
    colors: x.colors,
    seed: `IDX${i}`,
  }));

  const reactCards: CardData[] = SHOWCASE_SITES.map((x, i) => ({
    href: `/showcase/${x.slug}/`,
    n: i + 11,
    name: x.brand,
    topic: x.topic,
    artwork: x.artwork,
    paletteName: x.paletteName,
    colors: x.colors,
    seed: `RCT${i}`,
  }));

  return (
    <main className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@600;800&display=swap"
        precedence="default"
      />

      <header className={s.hero}>
        <div className={s.heroArt}>
          <TabbiedArtwork
            artwork={spectrum}
            palette={['#0d0d12', '#3fffb2', '#3eecff', '#ff3d8b']}
            seed="GAL01"
            fit="cover"
            density={1}
          />
        </div>
        <div className={s.heroScrim} />
        <div className={s.heroInner}>
          <div className={s.pre}>Made with Tabbied</div>
          <h1>
            Twenty sites,
            <br />
            <span>one pattern engine.</span>
          </h1>
          <p>
            Each of these sample websites uses a <strong>Tabbied</strong> generative
            artwork as its main design accent, themed end-to-end with a single palette
            from the library. Ten are self-contained HTML; ten are built with the{' '}
            <code>TabbiedArtwork</code> React component. Same engine, twenty completely
            different moods.
          </p>
        </div>
      </header>

      <div className={s.wrap}>
        <div className={s.group}>
          <h2>Static HTML builds</h2>
          <span className={s.tag}>HTML</span>
          <p>Self-contained pages that embed the css-doodle engine directly.</p>
        </div>
        <div className={s.grid}>
          {staticCards.map((c) => (
            <Card key={c.href} c={c} />
          ))}
        </div>

        <div className={`${s.group} ${s.two}`}>
          <h2>React component builds</h2>
          <span className={s.tag}>React</span>
          <p>
            Live Next.js pages rendered with the <code>TabbiedArtwork</code> component.
          </p>
        </div>
        <div className={s.grid}>
          {reactCards.map((c) => (
            <Card key={c.href} c={c} />
          ))}
        </div>
      </div>

      <footer className={s.footer}>
        Built with <a href="https://tabbied.com">Tabbied</a> · generative artworks
        powered by css-doodle. Open any card to view the full site.
      </footer>
    </main>
  );
}
