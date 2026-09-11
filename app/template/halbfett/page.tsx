import { TabbiedPattern } from 'tabbied/react';
import {
  dotmatrix, dotset, halftone, kern, misprint, ortho, peppering, stitch, thickset,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './halbfett.module.css';

export const metadata = {
  title: 'Halbfett: Schriftgiesserei, Zürich',
  description:
    'Halbfett is a type foundry in Zürich. Eleven families, drawn slowly, licensed plainly. Trials are free and never expire.',
};

/* Black, white, one vermilion, two greys. Every pattern field takes
   `transparent` in the background slot so the white page shows through. */
const INK = '#000000';
const RED = '#FF3B14';
const GREY = '#9A9A9A';
const PALE = '#DCDCDC';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const FAMILIES = [
  { name: 'Halbfett Grotesk', styles: 18, axes: 'Weight, Width', year: '2019', note: 'The house workhorse. Drawn for signage first, screens second, and it shows in the counters.' },
  { name: 'Halbfett Text', styles: 12, axes: 'Weight, Optical size', year: '2020', note: 'For long settings at 9 to 12 point. Slightly tall x-height, deliberately dull.' },
  { name: 'Halbfett Display', styles: 9, axes: 'Weight', year: '2021', note: 'Tight, high-contrast, unusable below 40 point. That is the intention.' },
  { name: 'Halbfett Mono', styles: 8, axes: 'Weight', year: '2022', note: 'Fixed pitch with real italics, drawn for code review rather than for terminals.' },
  { name: 'Halbfett Stencil', styles: 4, axes: 'Weight, Bridge', year: '2023', note: 'The bridge axis moves the cuts, not the strokes. Nobody asked for this. We enjoyed it.' },
  { name: 'Halbfett Serif', styles: 14, axes: 'Weight, Optical size', year: '2024', note: 'A quiet transitional. Our first serif in nine years and our slowest project.' },
];

const WEIGHTS = [
  ['100', 'Thin'],
  ['200', 'Extraleicht'],
  ['300', 'Leicht'],
  ['400', 'Normal'],
  ['500', 'Kräftig'],
  ['600', 'Halbfett'],
  ['700', 'Fett'],
  ['800', 'Extrafett'],
];

const LICENCES = [
  { name: 'Desktop', unit: 'per style, 5 users', price: 'CHF 60', body: 'Install and set anything. Print, logos, packaging. No annual renewal, ever.' },
  { name: 'Web', unit: 'per style, 500k views / month', price: 'CHF 60', body: 'Self-hosted WOFF2. We do not run a CDN and will not watch your traffic.' },
  { name: 'App', unit: 'per style, per app', price: 'CHF 240', body: 'Embed in a shipped binary. Updates included for the life of the app.' },
  { name: 'Broadcast', unit: 'per family, per production', price: 'CHF 480', body: 'Titles, lower thirds, motion. One production, unlimited episodes.' },
];

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ÄÖÜÆØÅßfiflÐÞ&@#§'.split('');

export default function HalbfettPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--white': '#ffffff',
        '--ink': '#000000',
        '--red': '#ff3b14',
        '--grey': '#9a9a9a',
        '--pale': '#dcdcdc',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="white,ink,red,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
      />

      <header className={s.bar}>
        <span data-edit="bar.logo" data-edit-max="60" className={s.logo}>Halbfett</span>
        <nav aria-label="Sections">
          <a data-edit="bar.library" data-edit-max="28" href="#library">Library</a>
          <a data-edit="bar.specimen" data-edit-max="28" href="#specimen">Specimen</a>
          <a data-edit="bar.licences" data-edit-max="28" href="#licences">Licences</a>
          <a data-edit="bar.studio" data-edit-max="28" href="#studio">Studio</a>
        </nav>
        <a data-edit="bar.trial" data-edit-max="28" className={s.trial} href="#licences">
          Free trial fonts
        </a>
      </header>

      <main>
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={dotmatrix}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={34}
              redrawInterval={3200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p data-edit="hero.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>Schriftgiesserei / Zürich / gegr. 2016</p>
          <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70" className={s.hero1}>
            Type drawn at the
            <br />
            speed it wants
            <br />
            <span>to be drawn.</span>
          </h1>
          <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
            Eleven families, sixty-five styles, three people. We release a
            family when it is finished, which is roughly once every eighteen
            months and never in September.
          </p>
        </section>

        {/* A full-bleed plate at the top of the page: the specimen wall, run
            edge to edge and cropped hard so it reads as a poster. */}
        <figure className={s.bleed}>
          <Figure editId="photo.halbfett-wall"
            slug="halbfett-wall"
            alt="A studio wall pinned edge to edge with large printed type specimen sheets"
            priority
          />
        </figure>

        {/* ------------------------------------------------------- LIBRARY */}
        <section id="library" className={s.library} aria-labelledby="library-h">
          <div className={s.head}>
            <h2 data-edit="library.title" data-edit-max="60" id="library-h">The library</h2>
            <p data-edit="library.body" data-edit-max="240" data-edit-multiline>Six families shown. Five more are in the trial pack.</p>
          </div>
          <ol className={s.families}>
            {FAMILIES.map((f, i) => (
              <li key={f.name}>
                <span className={s.fNo}>{String(i + 1).padStart(2, '0')}</span>
                <div className={s.fMain}>
                  <h3 data-edit={`library.title2.${i}`} data-edit-max="40">{f.name}</h3>
                  <p data-edit={`library.body2.${i}`} data-edit-max="240" data-edit-multiline>{f.note}</p>
                </div>
                <span className={s.fMeta}>{f.styles} styles</span>
                <span data-edit={`library.fMeta.${i}`} data-edit-max="60" className={s.fMeta}>{f.axes}</span>
                <span data-edit={`library.fYear.${i}`} data-edit-max="60" className={s.fYear}>{f.year}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------- WEIGHT LADDER */}
        <section id="specimen" className={s.specimen} aria-labelledby="specimen-h">
          <div data-edit-pattern="specimen.field" data-edit-roles="transparent,3,4" className={s.specField} aria-hidden="true">
            <TabbiedPattern
              pattern={halftone}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={46}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.specInner}>
            <div className={s.head}>
              <h2 data-edit="specimen.title" data-edit-max="60" id="specimen-h">Eight weights, one skeleton</h2>
              <p data-edit="specimen.body" data-edit-max="240" data-edit-multiline>Halbfett Grotesk, set at 96 point. The name of the foundry is the sixth one.</p>
            </div>
            <ol className={s.ladder}>
              {WEIGHTS.map(([w, label], i) => (
                <li key={w} style={{ fontWeight: Number(w) }}>
                  <span data-edit={`specimen.lWord.${i}`} data-edit-max="60" className={s.lWord}>Schriftgiesserei</span>
                  <span className={s.lMeta}>
                    {w} <i>{label}</i>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------- CHARACTER SET */}
        <section className={s.glyphs} aria-label="Character set">
          <div data-edit-pattern="glyphs.field" data-edit-roles="transparent,2,1" className={s.glyphField} aria-hidden="true">
            <TabbiedPattern
              pattern={ortho}
              palette={['transparent', RED, INK]}
              fit="grid"
              cellSize={68}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.glyphGrid}>
            {GLYPHS.map((g, i) => (
              <span data-edit={`glyphs.text.${i}`} data-edit-max="60" key={`${g}-${i}`}>{g}</span>
            ))}
          </div>
        </section>

        <div className={s.trioWrap}>
          <figure>
            <Figure editId="photo.halbfett-sorts" slug="halbfett-sorts" alt="Loose metal type sorts spilled on a steel surface" />
            <figcaption data-edit="main.caption" data-edit-max="120" data-edit-multiline>Sorts from the old Zürich foundry, kept for reference.</figcaption>
          </figure>
          <figure>
            <Figure editId="photo.halbfett-proof" slug="halbfett-proof" alt="A desk with proof sheets, a loupe and a red marker" />
            <figcaption data-edit="main.caption2" data-edit-max="120" data-edit-multiline>Proofing Serif, third pass, week forty-one.</figcaption>
          </figure>
          <figure>
            <Figure editId="photo.halbfett-press" slug="halbfett-press" alt="A proofing press with a fresh black print on the bed" />
            <figcaption data-edit="main.caption3" data-edit-max="120" data-edit-multiline>Every release is pulled once on the press.</figcaption>
          </figure>
        </div>

        {/* ------------------------------------------------------ LICENCES */}
        <section id="licences" className={s.licences} aria-labelledby="licences-h">
          <div className={s.head}>
            <h2 data-edit="licences.title" data-edit-max="60" id="licences-h">Licences, in plain terms</h2>
            <p data-edit="licences.body" data-edit-max="240" data-edit-multiline>
              One page, no legal counsel required. Buy once, use forever; we have
              never revoked a licence and would not know how.
            </p>
          </div>
          <div className={s.lic}>
            {LICENCES.map((l, i) => (
              <article key={l.name}>
                <h3 data-edit={`licences.title2.${i}`} data-edit-max="40">{l.name}</h3>
                <p data-edit={`licences.licUnit.${i}`} data-edit-max="240" data-edit-multiline className={s.licUnit}>{l.unit}</p>
                <p data-edit={`licences.licPrice.${i}`} data-edit-max="240" data-edit-multiline className={s.licPrice}>{l.price}</p>
                <p data-edit={`licences.licBody.${i}`} data-edit-max="240" data-edit-multiline className={s.licBody}>{l.body}</p>
              </article>
            ))}
          </div>
          <p data-edit="licences.licNote" data-edit-max="240" data-edit-multiline className={s.licNote}>
            Students and typography courses pay nothing. Write from an
            institutional address and say what the class is; we will send the
            whole library.
          </p>
        </section>

        {/* -------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.studio} aria-labelledby="studio-h">
          <div data-edit-pattern="studio.field" data-edit-roles="transparent,1,2" className={s.studioField} aria-hidden="true">
            <TabbiedPattern
              pattern={thickset}
              palette={['transparent', INK, RED]}
              fit="grid"
              cellSize={120}
              redrawInterval={4000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.studioInner}>
            <h2 data-edit="studio.title" data-edit-max="60" id="studio-h">Three people, Rämistrasse 40</h2>
            <div className={s.studioGrid}>
              <p data-edit="studio.big" data-edit-max="240" data-edit-multiline className={s.big}>
                Vera Zumbrunn draws. Ilja Brand engineers and hints. Sara Moretti
                answers everything else, usually the same day.
              </p>
              <dl>
                <div>
                  <dt data-edit="studio.term" data-edit-max="28">Studio</dt>
                  <dd data-edit="studio.body2" data-edit-max="200" data-edit-multiline>
                    Rämistrasse 40, 8001 Zürich
                    <br />
                    By appointment
                  </dd>
                </div>
                <div>
                  <dt data-edit="studio.term2" data-edit-max="28">Write</dt>
                  <dd>
                    <a data-edit="studio.link" data-edit-max="28" href="mailto:post@halbfett.example">post@halbfett.example</a>
                  </dd>
                </div>
                <div>
                  <dt data-edit="studio.term3" data-edit-max="28">Custom work</dt>
                  <dd data-edit="studio.body" data-edit-max="200" data-edit-multiline>Two commissions a year. The 2027 slots are open.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three things we test before release</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>A family ships when these three pass. There is no schedule that overrules them.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dotset}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5400}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                  <Figure editId="photo.halbfett-tile-sorts-cutout" slug="halbfett-tile-sorts-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Spacing, at text size</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Set the same paragraph at nine point in every style and read it on paper. Screen proofing hides spacing faults that paper finds in a second.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={misprint}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={6200}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                  <Figure editId="photo.halbfett-tile-stick-cutout" slug="halbfett-tile-stick-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Hinting and rendering</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Every style through four rasterisers at eight sizes. We keep the ugly screenshots and fix them rather than filing them.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={peppering}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={4800}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                  <Figure editId="photo.halbfett-tile-specimen-cutout" slug="halbfett-tile-specimen-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">The awkward pairs</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Two hundred kern pairs nobody remembers to check, including the ones with quotes, and the Swiss ones with numbers in them.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Character set</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>What is in every family. Extended Latin as standard; Greek and Cyrillic on the Grotesk only.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Set</span>
                <span data-edit="index.text2" data-edit-max="60">Glyphs</span>
                <span data-edit="index.text3" data-edit-max="60">In</span>
                <span data-edit="index.text4" data-edit-max="60">Note</span>
            </li>
              <li key="Latin, basic">
                <span data-edit="index.text5" data-edit-max="60">Latin, basic</span>
                <span data-edit="index.text6" data-edit-max="60">230</span>
                <span data-edit="index.text7" data-edit-max="60">All families</span>
                <span data-edit="index.text8" data-edit-max="60">ISO 8859-1 and then some</span>
              </li>
              <li key="Latin, extended">
                <span data-edit="index.text9" data-edit-max="60">Latin, extended</span>
                <span data-edit="index.text10" data-edit-max="60">412</span>
                <span data-edit="index.text11" data-edit-max="60">All families</span>
                <span data-edit="index.text12" data-edit-max="60">Central and eastern European</span>
              </li>
              <li key="Greek">
                <span data-edit="index.text13" data-edit-max="60">Greek</span>
                <span data-edit="index.text14" data-edit-max="60">188</span>
                <span data-edit="index.text15" data-edit-max="60">Grotesk</span>
                <span data-edit="index.text16" data-edit-max="60">Monotonic</span>
              </li>
              <li key="Cyrillic">
                <span data-edit="index.text17" data-edit-max="60">Cyrillic</span>
                <span data-edit="index.text18" data-edit-max="60">204</span>
                <span data-edit="index.text19" data-edit-max="60">Grotesk</span>
                <span data-edit="index.text20" data-edit-max="60">Russian and Ukrainian</span>
              </li>
              <li key="Figures">
                <span data-edit="index.text21" data-edit-max="60">Figures</span>
                <span data-edit="index.text22" data-edit-max="60">5 sets</span>
                <span data-edit="index.text23" data-edit-max="60">All families</span>
                <span data-edit="index.text24" data-edit-max="60">Lining, oldstyle, tabular, fractions, superior</span>
              </li>
              <li key="Arrows and symbols">
                <span data-edit="index.text25" data-edit-max="60">Arrows and symbols</span>
                <span data-edit="index.text26" data-edit-max="60">96</span>
                <span data-edit="index.text27" data-edit-max="60">All families</span>
                <span data-edit="index.text28" data-edit-max="60">Drawn, not borrowed</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Licensing questions</h2>
          <dl className={s.faqList}>
              <div key="Can I test before buying">
                <dt data-edit="faq.term" data-edit-max="28">Can I test before buying?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Yes. The trial pack is the full library with a limited character set, it is free, and it does not expire. We have never asked anyone to delete one.</dd>
              </div>
              <div key="What counts as one app?">
                <dt data-edit="faq.term2" data-edit-max="28">What counts as one app?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>One product on one storefront. Ship it on three platforms and it is still one app; ship a second product and it is a second licence.</dd>
              </div>
              <div key="Do you do exclusive comm">
                <dt data-edit="faq.term3" data-edit-max="28">Do you do exclusive commissions?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Two a year. Exclusivity is for five years, after which the family joins the library unless you buy the extension.</dd>
              </div>
              <div key="What if my traffic goes ">
                <dt data-edit="faq.term4" data-edit-max="28">What if my traffic goes over?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Nothing happens automatically. Write to us at the end of the year and we will invoice the difference at the same rate.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={kern}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={5040}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Halbfett</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>A type foundry at Rämistrasse 40, Zürich, since 2016.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Library</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.library" data-edit-max="28" href="#library">The library</a>
              </li>
              <li>
                <a data-edit="footer.specimen" data-edit-max="28" href="#specimen">Weight ladder</a>
              </li>
              <li>
                <a data-edit="footer.licences" data-edit-max="28" href="#licences">Trial fonts</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Licensing</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.licences2" data-edit-max="28" href="#licences">Desktop and web</a>
              </li>
              <li>
                <a data-edit="footer.licences3" data-edit-max="28" href="#licences">App and broadcast</a>
              </li>
              <li>
                <a data-edit="footer.studio" data-edit-max="28" href="#studio">Custom work</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Rämistrasse 40
              <br />
              8001 Zürich
              <br />
              post@halbfett.example
              <br />
              By appointment
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional type foundry. Prices and times are invented.</p>
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
