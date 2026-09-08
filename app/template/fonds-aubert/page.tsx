import { TabbiedPattern } from 'tabbied/react';
import {
  chain, dotfield, matryoshka, quire, stitch, subdivide,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './fonds-aubert.module.css';

export const metadata = {
  title: 'Fonds Aubert: Archives Privées, Lausanne',
  description:
    'Fonds Aubert holds 4.2 linear kilometres of private and business records. Deposit, conservation, and a reading room open four days a week.',
};

/* Pale paper, dark ink, one olive that only ever appears on a reference.
   Pattern fields take `transparent` in the background slot. */
const INK = '#1A1C18';
const OLIVE = '#4C6B2F';
const GREY = '#8C8F84';
const PALE = '#DEDAD4';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const FONDS = [
  { ref: 'FA 001', name: 'Aubert et Fils, négoce', span: '1861 to 1974', extent: '312 m', state: 'Catalogued' },
  { ref: 'FA 014', name: 'Papeteries de la Broye', span: '1903 to 1991', extent: '486 m', state: 'Catalogued' },
  { ref: 'FA 022', name: 'Fonds Marthe Vionnet', span: '1919 to 1988', extent: '46 m', state: 'Catalogued' },
  { ref: 'FA 031', name: 'Chemins de fer du Jorat', span: '1889 to 1963', extent: '204 m', state: 'In progress' },
  { ref: 'FA 040', name: 'Coopérative du Léman', span: '1932 to 2004', extent: '618 m', state: 'In progress' },
  { ref: 'FA 047', name: 'Atelier Perrin, photographie', span: '1948 to 1997', extent: '91 m', state: 'Uncatalogued' },
];

const SERVICES = [
  { n: 'A', t: 'Deposit', d: 'We accept records of lasting value from businesses, associations and families in the canton. Appraisal is free and honest: most of what people offer us should be recycled, and we say so.' },
  { n: 'B', t: 'Conservation', d: 'Rehousing, surface cleaning, paper repair and a bindery for anything a reader would otherwise tear. Nothing is treated that does not need it.' },
  { n: 'C', t: 'Cataloguing', d: 'To ISAD(G), at fonds, series and file level. Item level only where a researcher has already asked twice.' },
  { n: 'D', t: 'Access', d: 'A reading room of eight places, four days a week. Anything catalogued can be ordered the same morning.' },
];

const NUMBERS = [
  ['4.2 km', 'Linear extent'],
  ['47', 'Fonds held'],
  ['1861', 'Earliest record'],
  ['8', 'Reading places'],
];

export default function FondsAubertPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f0f0e8',
        '--ink': '#1a1c18',
        '--olive': '#4c6b2f',
        '--grey': '#8c8f84',
        '--pale': '#dedad4',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,olive,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..600&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          Fonds Aubert
          <i>Archives privées, Lausanne</i>
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.holdings" data-edit-max="28" href="#holdings">Holdings</a>
          <a data-edit="bar.services" data-edit-max="28" href="#services">Services</a>
          <a data-edit="bar.reading" data-edit-max="28" href="#reading">Reading room</a>
          <a data-edit="bar.deposit" data-edit-max="28" href="#deposit">Deposit</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={quire}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={124}
              redrawInterval={6800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Fondation privée / depuis 1974</p>
            <h1>
              Four point two
              <br />
              kilometres of paper
              <br />
              <span data-edit="hero.text" data-edit-max="60">somebody kept.</span>
            </h1>
            <p data-edit="hero.lede" data-edit-max="240" data-edit-multiline className={s.lede}>
              Business ledgers, family correspondence, a photographer's
              negatives, and the minutes of a cooperative that argued for
              seventy years.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure editId="photo.aubert-stacks"
            slug="aubert-stacks"
            alt="Long rows of grey archive boxes on steel shelving receding into the distance"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Repository 2, aisle 14. 16 °C, 45 % RH, no daylight.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k], i) => (
            <div key={k}>
              <dt data-edit={`top.term.${i}`} data-edit-max="28">{v}</dt>
              <dd data-edit={`top.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
            </div>
          ))}
        </dl>

        {/* -------------------------------------------------------- HOLDINGS */}
        <section id="holdings" className={s.holdings} aria-labelledby="holdings-h">
          <h2 data-edit="holdings.h2" data-edit-max="60" className={s.h2} id="holdings-h">
            Selected fonds
          </h2>
          <p data-edit="holdings.note" data-edit-max="240" data-edit-multiline className={s.note}>
            Six of forty-seven. The full finding aid is in the reading room and,
            for anything catalogued, online as a plain list.
          </p>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span data-edit="holdings.text" data-edit-max="60">Reference</span>
              <span data-edit="holdings.text2" data-edit-max="60">Fonds</span>
              <span data-edit="holdings.text3" data-edit-max="60">Dates</span>
              <span data-edit="holdings.text4" data-edit-max="60">Extent</span>
              <span data-edit="holdings.text5" data-edit-max="60">State</span>
            </li>
            {FONDS.map((f, i) => (
              <li key={f.ref}>
                <span data-edit={`holdings.ref.${i}`} data-edit-max="60" className={s.ref}>{f.ref}</span>
                <span data-edit={`holdings.fname.${i}`} data-edit-max="60" className={s.fname}>{f.name}</span>
                <span data-edit={`holdings.span.${i}`} data-edit-max="60" className={s.span}>{f.span}</span>
                <span data-edit={`holdings.extent.${i}`} data-edit-max="60" className={s.extent}>{f.extent}</span>
                <span data-edit={`holdings.done.${i}`} data-edit-max="60"
                  className={
                    f.state === 'Catalogued'
                      ? s.done
                      : f.state === 'In progress'
                        ? s.wip
                        : s.todo
                  }
                >
                  {f.state}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ SHELF BAND */}
        <section className={s.shelfBand} aria-hidden="true">
          <div data-edit-pattern="shelfBand.field" data-edit-roles="transparent,1,2,3" className={s.shelfField}>
            <TabbiedPattern
              pattern={stitch}
              palette={['transparent', INK, OLIVE, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* -------------------------------------------------------- SERVICES */}
        <section id="services" className={s.services} aria-labelledby="services-h">
          <div data-edit-pattern="services.field" data-edit-roles="transparent,4,3" className={s.svcField} aria-hidden="true">
            <TabbiedPattern
              pattern={subdivide}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={166}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.svcInner}>
            <h2 data-edit="services.h2" data-edit-max="60" className={s.h2} id="services-h">
              What the foundation does
            </h2>
            <ol className={s.svcList}>
              {SERVICES.map((x, i) => (
                <li key={x.n}>
                  <span data-edit={`services.svcN.${i}`} data-edit-max="60" className={s.svcN}>{x.n}</span>
                  <div>
                    <h3 data-edit={`services.title.${i}`} data-edit-max="40">{x.t}</h3>
                    <p data-edit={`services.body.${i}`} data-edit-max="240" data-edit-multiline>{x.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.aubert-bench"
                  slug="aubert-bench"
                  alt="A paper conservation bench with tools and a sheet under repair"
                />
                <figcaption data-edit="services.caption" data-edit-max="120" data-edit-multiline>Conservation. Two days a week, one pair of hands.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.aubert-door"
                  slug="aubert-door"
                  alt="A heavy steel strongroom door standing ajar in a plain corridor"
                />
                <figcaption data-edit="services.caption2" data-edit-max="120" data-edit-multiline>Repository 1. Closed at 16.00, checked twice.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- READING ROOM */}
        <section id="reading" className={s.reading} aria-labelledby="reading-h">
          <h2 data-edit="reading.h2" data-edit-max="60" className={s.h2} id="reading-h">
            Reading room
          </h2>
          <div className={s.readGrid}>
            <p data-edit="reading.big" data-edit-max="240" data-edit-multiline className={s.big}>
              Eight places, Tuesday to Friday, 09.00 to 17.00. Pencils are
              provided because pens are not permitted, and we would rather give
              you one than have the conversation.
            </p>
            <ul className={s.rules}>
              <li data-edit="reading.item" data-edit-max="80">Order by 11.00 for the same afternoon</li>
              <li data-edit="reading.item2" data-edit-max="80">Five boxes on the desk at a time</li>
              <li data-edit="reading.item3" data-edit-max="80">Photography without flash, for private study</li>
              <li data-edit="reading.item4" data-edit-max="80">Foam supports and weights on every desk</li>
              <li data-edit="reading.item5" data-edit-max="80">No appointment needed for catalogued material</li>
            </ul>
          </div>
          <figure className={s.wide}>
            <Figure editId="photo.aubert-reading"
              slug="aubert-reading"
              alt="An empty reading room desk with a single open document, foam supports and weights"
            />
            <figcaption data-edit="reading.caption" data-edit-max="120" data-edit-multiline>Desk 3. North light, which is the only kind we trust.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- DEPOSIT */}
        <section id="deposit" className={s.deposit} aria-labelledby="deposit-h">
          <div data-edit-pattern="deposit.field" data-edit-roles="transparent,2,3" className={s.depField} aria-hidden="true">
            <TabbiedPattern
              pattern={dotfield}
              palette={['transparent', OLIVE, GREY]}
              fit="grid"
              cellSize={48}
              redrawInterval={4000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.depInner}>
            <h2 data-edit="deposit.h2" data-edit-max="60" className={s.h2} id="deposit-h">
              Depositing records
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="deposit.term" data-edit-max="28">Foundation</dt>
                <dd>
                  Chemin des Croix-Rouges 14
                  <br />
                  1007 Lausanne
                </dd>
              </div>
              <div>
                <dt data-edit="deposit.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="deposit.link" data-edit-max="28" href="mailto:depot@fonds-aubert.example">depot@fonds-aubert.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="deposit.term3" data-edit-max="28">Appraisal</dt>
                <dd data-edit="deposit.body" data-edit-max="200" data-edit-multiline>Free, on site, usually within a month of asking</dd>
              </div>
              <div>
                <dt data-edit="deposit.term4" data-edit-max="28">Terms</dt>
                <dd data-edit="deposit.body2" data-edit-max="200" data-edit-multiline>Deposit or gift. Closure periods up to fifty years, agreed in writing.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three enemies of paper</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>What the repository is actually built to keep out. None of them is dramatic and all of them are slow.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={quire}
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
                  <Figure editId="photo.fonds-aubert-tile-box-cutout" slug="fonds-aubert-tile-box-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Water</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>Not floods. Humidity above sixty per cent, held for a season, which is enough for mould to start and impossible to reverse afterwards.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={subdivide}
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
                  <Figure editId="photo.fonds-aubert-tile-folders-cutout" slug="fonds-aubert-tile-folders-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Light</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Cumulative and irreversible. There is no daylight anywhere in the repository and the reading room lamps are metered.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dotfield}
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
                  <Figure editId="photo.fonds-aubert-tile-gloves-cutout" slug="fonds-aubert-tile-gloves-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Ourselves</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Handling causes more damage than any environmental factor. Foam, weights, pencils, and a limit of five boxes on a desk.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Reading room equipment</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>On every desk, provided, because asking people to bring their own guarantees they will not.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Item</span>
                <span data-edit="index.text2" data-edit-max="60">Per desk</span>
                <span data-edit="index.text3" data-edit-max="60">Detail</span>
                <span data-edit="index.text4" data-edit-max="60">Note</span>
            </li>
              <li key="Foam supports">
                <span data-edit="index.text5" data-edit-max="60">Foam supports</span>
                <span data-edit="index.text6" data-edit-max="60">2</span>
                <span data-edit="index.text7" data-edit-max="60">Adjustable wedge</span>
                <span data-edit="index.text8" data-edit-max="60">For bound volumes</span>
              </li>
              <li key="Snake weights">
                <span data-edit="index.text9" data-edit-max="60">Snake weights</span>
                <span data-edit="index.text10" data-edit-max="60">4</span>
                <span data-edit="index.text11" data-edit-max="60">Cotton covered</span>
                <span data-edit="index.text12" data-edit-max="60">Never on ink</span>
              </li>
              <li key="Pencils">
                <span data-edit="index.text13" data-edit-max="60">Pencils</span>
                <span data-edit="index.text14" data-edit-max="60">Supplied</span>
                <span data-edit="index.text15" data-edit-max="60">HB, unsharpened tips</span>
                <span data-edit="index.text16" data-edit-max="60">Pens are not permitted</span>
              </li>
              <li key="Book cushion">
                <span data-edit="index.text17" data-edit-max="60">Book cushion</span>
                <span data-edit="index.text18" data-edit-max="60">1</span>
                <span data-edit="index.text19" data-edit-max="60">Beanbag</span>
                <span data-edit="index.text20" data-edit-max="60">On request</span>
              </li>
              <li key="Copy stand">
                <span data-edit="index.text21" data-edit-max="60">Copy stand</span>
                <span data-edit="index.text22" data-edit-max="60">Shared</span>
                <span data-edit="index.text23" data-edit-max="60">Overhead, no flash</span>
                <span data-edit="index.text24" data-edit-max="60">For private study</span>
              </li>
              <li key="Gloves">
                <span data-edit="index.text25" data-edit-max="60">Gloves</span>
                <span data-edit="index.text26" data-edit-max="60">On request</span>
                <span data-edit="index.text27" data-edit-max="60">Nitrile</span>
                <span data-edit="index.text28" data-edit-max="60">For photographs only</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Depositing and access</h2>
          <dl className={s.faqList}>
              <div key="What will you not accept">
                <dt data-edit="faq.term" data-edit-max="28">What will you not accept?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Anything already in a public archive, anything with no connection to the canton, and most of what people bring us, which we say kindly and in person.</dd>
              </div>
              <div key="Can I close my records f">
                <dt data-edit="faq.term2" data-edit-max="28">Can I close my records for a period?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>Yes, up to fifty years, agreed in writing at deposit. We have never broken a closure and would not be able to explain ourselves if we did.</dd>
              </div>
              <div key="How long until my deposi">
                <dt data-edit="faq.term3" data-edit-max="28">How long until my deposit is usable?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>Catalogued in eighteen months to four years depending on extent. Uncatalogued material is accessible in principle and unfindable in practice.</dd>
              </div>
              <div key="Do you digitise on reque">
                <dt data-edit="faq.term4" data-edit-max="28">Do you digitise on request?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Up to two hundred images a year, free, for research. Beyond that we quote, and we would rather you came and sat at a desk.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField}>
            <TabbiedPattern
              pattern={matryoshka}
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
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Fonds Aubert</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Archives privées, Chemin des Croix-Rouges 14, Lausanne, depuis 1974.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Holdings</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.holdings" data-edit-max="28" href="#holdings">Selected fonds</a>
              </li>
              <li>
                <a data-edit="footer.services" data-edit-max="28" href="#services">What we do</a>
              </li>
              <li>
                <a data-edit="footer.reading" data-edit-max="28" href="#reading">Reading room</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Depositing</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.deposit" data-edit-max="28" href="#deposit">Depositing records</a>
              </li>
              <li>
                <a data-edit="footer.deposit2" data-edit-max="28" href="#deposit">Appraisal</a>
              </li>
              <li>
                <a data-edit="footer.deposit3" data-edit-max="28" href="#deposit">Terms and closure</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Chemin des Croix-Rouges 14
              <br />
              1007 Lausanne
              <br />
              depot@fonds-aubert.example
              <br />
              Tue to Fri, 09.00 to 17.00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional archive. Prices and times are invented.</p>
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
