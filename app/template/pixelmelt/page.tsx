import { TabbiedPattern } from 'tabbied/react';
import { bengaline, facetgrad, spectrum } from 'tabbied/patterns';
import s from './pixelmelt.module.css';

export const metadata = {
  title: 'Pixelmelt: Independent game studio, Tallinn',
  description:
    'Pixelmelt is a seven-person game studio in Tallinn. Three games, one in-house engine called Meltdown, a devlog that is actually kept, and a press kit that fits in one zip.',
};

/* Violet-black, lilac, hot pink and cyan. Every field takes `transparent` in
   the background slot so the pattern glows out of the dark of the page
   rather than sitting on a plate of its own. */
const INK = '#F4EEFF';
const PINK = '#FF5FD2';
const CYAN = '#38E0FF';
const GREY = '#7C6F94';
/* The tiles pin their doodle to a whole multiple of the cell (9 x 72px) and
   let the plate clip it. A fluid box gives fractional grid tracks and a
   hairline seam at every cell edge. */
const TILE_BOX = 648;

const NAV = [
  ['Games', '#games'],
  ['Engine', '#engine'],
  ['Team', '#team'],
  ['Devlog', '#devlog'],
  ['Press', '#press'],
  ['Studio', '#studio'],
];

const FACTS = [
  ['3', 'games'],
  ['7', 'people'],
  ['1', 'engine'],
  ['2019', 'founded'],
];

type Game = {
  title: string;
  pitch: string;
  platforms: string;
  status: string;
  when: string;
};

const GAMES: Game[] = [
  {
    title: 'Saltmarsh',
    pitch: 'A tide-table survival game about a lighthouse keeper who is also the tide.',
    platforms: 'PC and handheld',
    status: 'In development',
    when: 'Spring 2027',
  },
  {
    title: 'Neon Ferry',
    pitch: 'Drive the last night ferry across a flooded city, one passenger at a time.',
    platforms: 'PC and consoles',
    status: 'Released',
    when: '2023, now version 1.6',
  },
  {
    title: 'Loop Station',
    pitch: 'A rhythm puzzle about fixing a broken radio tower by ear.',
    platforms: 'PC and handheld',
    status: 'Released',
    when: '2021, now version 1.4',
  },
];

const ENGINE_STATS = [
  ['2.1 MB', 'runtime', 'The whole executable, art not included'],
  ['64', 'colours a scene', 'A hard limit, and the reason everything looks like this'],
  ['4 ms', 'frame budget', 'At 240 Hz, on a laptop from 2019'],
  ['31 000', 'lines of C', 'And no scripting language, on purpose'],
  ['0', 'dependencies', 'Beyond the window the platform gives us'],
  ['3', 'platforms', 'From one build script that fits on a screen'],
];

const TEAM = [
  ['Kaarel Mägi', 'Director, code', '2019'],
  ['Liisa Tamm', 'Art director', '2019'],
  ['Rasmus Kask', 'Engine', '2020'],
  ['Mari Ilves', 'Game design', '2020'],
  ['Oskar Lepik', 'Audio and music', '2021'],
  ['Anu Pärn', 'Producer', '2022'],
  ['Jaan Sepp', 'QA and community', '2023'],
];

type Post = {
  date: string;
  tag: string;
  title: string;
  body: string;
};

const DEVLOG: Post[] = [
  {
    date: '04 Sep 2026',
    tag: 'Saltmarsh',
    title: 'Tide simulation, third attempt',
    body: 'The first two were wrong in ways that only showed up at spring tides, which in the game is every ninth day. The third one is a lookup table with 720 entries and a lerp, and it is right.',
  },
  {
    date: '21 Aug 2026',
    tag: 'Meltdown',
    title: 'Sixty-four colours, revisited',
    body: 'Every year somebody asks whether the palette limit can go. Every year the answer is that the limit is the art direction. This year the answer came with a chart.',
  },
  {
    date: '30 Jul 2026',
    tag: 'Neon Ferry',
    title: 'Version 1.6: the ramp',
    body: 'A passenger who uses a wheelchair, a ramp on the ferry, and a rewrite of the boarding code that was overdue anyway. Free, for everyone who has the game.',
  },
  {
    date: '02 Jul 2026',
    tag: 'Meltdown',
    title: 'Why there is no scripting language',
    body: 'Levels are data. Behaviour is C. Hot reload takes 80 milliseconds. We tried the other way in 2020 and the game got slower and the bugs got stranger.',
  },
  {
    date: '12 Jun 2026',
    tag: 'Studio',
    title: 'We moved to Telliskivi',
    body: 'Building C, third floor, a window that faces the railway. The desks are the same desks. The coffee machine did not survive the stairs.',
  },
];

const PRESS = [
  ['Founded', 'Tallinn, 2019'],
  ['Team', 'Seven people, all in the one room'],
  ['Games', 'Three, two released, one in development'],
  ['Kit', 'Logos, key art, screenshots and a fact sheet in one 48 MB zip'],
  ['Awards', 'Baltic Indie Prize 2024, finalist, for Neon Ferry'],
  ['Interviews', 'Yes, by email or on a call, in Estonian or English'],
  ['Keys', 'Review copies for anyone with a byline; write and say where'],
  ['Contact', 'press@pixelmelt.example'],
];

const STUDIO = [
  ['Address', 'Telliskivi 60a, building C, third floor, 10412 Tallinn'],
  ['Tram', '1 and 2 to Telliskivi, then across the tracks'],
  ['Hours', 'In from 10 to 18 on most days, later before a release'],
  ['The door', 'Locked. The buzzer works and so do we, so ring'],
];

export default function PixelmeltPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#12081f',
        '--ink': '#f4eeff',
        '--pink': '#ff5fd2',
        '--cyan': '#38e0ff',
        '--grey': '#7c6f94',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,pink,cyan,grey"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Bungee&family=Space+Grotesk:wght@300..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          Pixelmelt
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a data-edit="bar.barCta" data-edit-max="28" className={s.barCta} href="#wishlist">
          Wishlist
        </a>
      </header>

      <main id="top">
        {/* ----------------------------------------------------------- HERO
            spectrum behind the headline, washed dark in the middle so the
            gradient type reads, and left glowing at the edges. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,3,4" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={spectrum}
              palette={['transparent', PINK, CYAN, GREY]}
              fit="grid"
              cellSize={136}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Independent game studio / Tallinn / est. 2019</p>
            <h1 data-edit="hero.accent" data-edit-format="emphasis" data-edit-max="70" className={s.heroTitle} id="hero-h">
              We melt
              <br />
              <span className={s.accent}>pixels.</span>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Seven people, one room by the railway, one engine we wrote
              ourselves, and three games that all look like they came out of
              the same broken CRT. That is on purpose.
            </p>
            <p className={s.heroCta}>
              <a data-edit="hero.glow" data-edit-max="28" className={s.glow} href="#wishlist">
                Wishlist Saltmarsh
              </a>
              <a data-edit="hero.ghost" data-edit-max="28" className={s.ghost} href="#games">
                All three games
              </a>
            </p>
            <dl className={s.facts}>
              {FACTS.map(([v, k], i) => (
                <div key={k}>
                  <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                  <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className={s.chrome} aria-hidden="true" />

        {/* ---------------------------------------------------------- GAMES
            Three tiles, one per game: bengaline on a transparent ground,
            standing in for key art. */}
        <section id="games" className={s.section} aria-labelledby="games-h">
          <div className={s.secHead}>
            <p data-edit="games.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>The games</p>
            <h2 data-edit="games.h2" data-edit-max="60" className={s.h2} id="games-h">Three so far</h2>
          </div>
          <ul className={s.gameGrid}>
            {GAMES.map((g, i) => (
              <li key={g.title}>
                <div data-edit-pattern={`games.field.${i}`} data-edit-roles="transparent,2,3,4" className={s.gamePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={bengaline}
                    palette={['transparent', PINK, CYAN, GREY]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5800}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                </div>
                <p data-edit={`games.gameStatus.${i}`} data-edit-max="240" data-edit-multiline className={s.gameStatus}>{g.status}</p>
                <h3 data-edit={`games.title.${i}`} data-edit-max="40">{g.title}</h3>
                <p data-edit={`games.gamePitch.${i}`} data-edit-max="240" data-edit-multiline className={s.gamePitch}>{g.pitch}</p>
                <p data-edit={`games.gamePlatforms.${i}`} data-edit-max="240" data-edit-multiline className={s.gamePlatforms}>{g.platforms}</p>
                <p data-edit={`games.gameWhen.${i}`} data-edit-max="240" data-edit-multiline className={s.gameWhen}>{g.when}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className={s.chrome} aria-hidden="true" />

        {/* --------------------------------------------------------- ENGINE */}
        <section id="engine" className={s.section} aria-labelledby="engine-h">
          <div className={s.secHead}>
            <p data-edit="engine.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>The engine</p>
            <h2 data-edit="engine.h2" data-edit-max="60" className={s.h2} id="engine-h">Meltdown</h2>
            <p data-edit="engine.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              A software rasteriser with a palette limit, written in C by one
              person and read by six. Every game we have shipped runs on it
              and so does the tool that makes the levels.
            </p>
          </div>
          <dl className={s.stats}>
            {ENGINE_STATS.map(([v, k, note], i) => (
              <div key={k}>
                <dt data-edit={`engine.term.${i}`} data-edit-max="28">{v}</dt>
                <dd data-edit={`engine.statLabel.${i}`} data-edit-max="200" data-edit-multiline className={s.statLabel}>{k}</dd>
                <dd data-edit={`engine.statNote.${i}`} data-edit-max="200" data-edit-multiline className={s.statNote}>{note}</dd>
              </div>
            ))}
          </dl>
          <div className={s.engineText}>
            <p data-edit="engine.body" data-edit-max="240" data-edit-multiline>
              Meltdown draws every frame into a 480 by 270 buffer with a
              sixty-four colour palette and scales it up by whole numbers.
              There is no anti-aliasing, no bloom and no shader, and the
              glow you see in the games is dithering that Liisa drew by hand.
            </p>
            <p data-edit="engine.body2" data-edit-max="240" data-edit-multiline>
              Levels are data files that reload in eighty milliseconds while
              the game is running. Replays are forty kilobytes and play back
              bit for bit on every platform, which is how the community finds
              bugs faster than we do.
            </p>
          </div>
        </section>

        <div className={s.chrome} aria-hidden="true" />

        {/* ----------------------------------------------------------- TEAM */}
        <section id="team" className={s.section} aria-labelledby="team-h">
          <div className={s.secHead}>
            <p data-edit="team.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>The team</p>
            <h2 data-edit="team.h2" data-edit-max="60" className={s.h2} id="team-h">Seven people</h2>
            <p data-edit="team.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Everyone here has shipped every game since they arrived. Nobody
              has a title with the word head in it.
            </p>
          </div>
          <ol className={s.team}>
            {TEAM.map(([name, role, since], i) => (
              <li key={name}>
                <span data-edit={`team.teamName.${i}`} data-edit-max="60" className={s.teamName}>{name}</span>
                <span data-edit={`team.teamRole.${i}`} data-edit-max="60" className={s.teamRole}>{role}</span>
                <span data-edit={`team.teamSince.${i}`} data-edit-max="60" className={s.teamSince}>{since}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className={s.chrome} aria-hidden="true" />

        {/* --------------------------------------------------------- DEVLOG */}
        <section id="devlog" className={s.section} aria-labelledby="devlog-h">
          <div className={s.secHead}>
            <p data-edit="devlog.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>The devlog</p>
            <h2 data-edit="devlog.h2" data-edit-max="60" className={s.h2} id="devlog-h">Written every fortnight</h2>
            <p data-edit="devlog.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Since 2019, without missing one. The five most recent are here;
              the other hundred and eighty are in the archive.
            </p>
          </div>
          <ol className={s.posts}>
            {DEVLOG.map((p, i) => (
              <li key={p.date}>
                <time data-edit={`devlog.postDate.${i}`} className={s.postDate}>{p.date}</time>
                <span data-edit={`devlog.postTag.${i}`} data-edit-max="60" className={s.postTag}>{p.tag}</span>
                <h3 data-edit={`devlog.title.${i}`} data-edit-max="40">{p.title}</h3>
                <p data-edit={`devlog.postBody.${i}`} data-edit-max="240" data-edit-multiline className={s.postBody}>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className={s.chrome} aria-hidden="true" />

        {/* ---------------------------------------------------------- PRESS */}
        <section id="press" className={s.section} aria-labelledby="press-h">
          <div className={s.secHead}>
            <p data-edit="press.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Press kit</p>
            <h2 data-edit="press.h2" data-edit-max="60" className={s.h2} id="press-h">Everything in one zip</h2>
          </div>
          <dl className={s.press}>
            {PRESS.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`press.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`press.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={s.pressCta}>
            <a data-edit="press.ghost" data-edit-max="28" className={s.ghost} href="mailto:press@pixelmelt.example">
              Ask for the kit
            </a>
          </p>
        </section>

        {/* ------------------------------------------------------- WISHLIST
            The call to action, on its own glowing panel. */}
        <section id="wishlist" className={s.wishlist} aria-labelledby="wishlist-h">
          <p data-edit="wishlist.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Saltmarsh, spring 2027</p>
          <h2 data-edit="wishlist.accent" data-edit-format="emphasis" data-edit-max="60" className={s.wishTitle} id="wishlist-h">
            Wishlist
            <br />
            <span className={s.accent}>Saltmarsh.</span>
          </h2>
          <p data-edit="wishlist.wishBody" data-edit-max="240" data-edit-multiline className={s.wishBody}>
            A wishlist is worth more to a studio this size than any amount of
            applause. It is the number the storefront looks at, and it costs
            you one click and nothing else.
          </p>
          <p className={s.wishCta}>
            <a data-edit="wishlist.glow" data-edit-max="28" className={s.glow} href="mailto:hello@pixelmelt.example">
              Add it to your list
            </a>
          </p>
        </section>

        <div className={s.chrome} aria-hidden="true" />

        {/* --------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.section} aria-labelledby="studio-h">
          <div className={s.secHead}>
            <p data-edit="studio.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>The studio</p>
            <h2 data-edit="studio.h2" data-edit-max="60" className={s.h2} id="studio-h">Telliskivi 60a</h2>
            <p data-edit="studio.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Building C, third floor, the door with the sticker. One room,
              seven desks, a couch that has seen three release nights and a
              window over the railway.
            </p>
          </div>
          <dl className={s.studio}>
            {STUDIO.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`studio.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`studio.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* The coda band: facetgrad across the whole width, the last thing
          before the footer and the brightest thing on the page. */}
      <section className={s.band} aria-hidden="true">
        <div data-edit-pattern="band.field" data-edit-roles="transparent,3,2,1" className={s.bandField}>
          <TabbiedPattern
            pattern={facetgrad}
            palette={['transparent', CYAN, PINK, INK]}
            fit="grid"
            cellSize={120}
            redrawInterval={4400}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Pixelmelt</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              An independent game studio in Tallinn. Seven people, three
              games, one engine, since 2019.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Games</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.games" data-edit-max="28" href="#games">Saltmarsh</a>
              </li>
              <li>
                <a data-edit="footer.games2" data-edit-max="28" href="#games">Neon Ferry</a>
              </li>
              <li>
                <a data-edit="footer.games3" data-edit-max="28" href="#games">Loop Station</a>
              </li>
              <li>
                <a data-edit="footer.wishlist" data-edit-max="28" href="#wishlist">Wishlist</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Studio</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.engine" data-edit-max="28" href="#engine">Meltdown</a>
              </li>
              <li>
                <a data-edit="footer.team" data-edit-max="28" href="#team">The team</a>
              </li>
              <li>
                <a data-edit="footer.devlog" data-edit-max="28" href="#devlog">Devlog</a>
              </li>
              <li>
                <a data-edit="footer.press" data-edit-max="28" href="#press">Press kit</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Here</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Telliskivi 60a, building C
              <br />
              10412 Tallinn
              <br />
              hello@pixelmelt.example
              <br />
              press@pixelmelt.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional studio. The games, the engine and its figures are invented.</p>
          <p>
            Patterns by{' '}
            <a data-edit="footer.link" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            , drawn live on a transparent ground and redrawn on a timer.
          </p>
        </div>
      </footer>
    </div>
  );
}
