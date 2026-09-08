import { TabbiedPattern } from 'tabbied/react';
import {
  bias, chip, notch, octagon, pennantbox, quaver, scramble, swapcut,
} from 'tabbied/patterns';
import s from './presse-neun.module.css';

export const metadata = {
  title: 'Presse Neun: Screenprint workshop, Rotterdam',
  description:
    'A nine-colour hand screenprint workshop. Editions, posters and impossible flat colour, printed wet on wet on paper we keep in the building.',
};

/* Warm paper, ink, one fluorescent pink. Every field takes `transparent` in
   the background slot and several are stacked in multiply, which is what an
   overprint is. */
const INK = '#141210';
const PINK = '#ff2d78';
const GREY = '#8c8a82';
const PALE = '#e2dfd4';

/* Whether a swatch label is set in paper or in ink is decided by the swatch,
   not by hand: relative luminance, the same threshold the WCAG contrast
   formula uses. */
function labelOn(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.32 ? INK : '#fff';
}

/* The house ink rack, printed as flat blocks - the loudest thing on the page
   and the only place all nine colours appear at once. */
const INKS = [
  ['Fluoro Pink', '#ff2d78'],
  ['Warm Red', '#f0421f'],
  ['Signal Orange', '#ff7a00'],
  ['Process Yellow', '#ffd400'],
  ['Chartreuse', '#c6e800'],
  ['Bottle', '#00714a'],
  ['Sky', '#4fc3ff'],
  ['Reflex', '#1b2ae0'],
  ['Rich Black', '#141210'],
];

const SERVICES = [
  {
    n: '01',
    t: 'Editions',
    d: 'Signed and numbered, up to nine colours, up to 700 × 1000 mm',
    lead: '3 weeks',
    from: '€ 640',
  },
  {
    n: '02',
    t: 'Posters',
    d: 'One to four colours on our own stock, runs of 50 to 500',
    lead: '10 days',
    from: '€ 380',
  },
  {
    n: '03',
    t: 'Overprints',
    d: 'Printing onto something already printed, including yours',
    lead: '1 week',
    from: '€ 190',
  },
  {
    n: '04',
    t: 'Colour matching',
    d: 'Mixed by eye against your sample, drawn down and posted to you',
    lead: '4 days',
    from: '€ 85',
  },
  {
    n: '05',
    t: 'Studio hire',
    d: 'One bed, one dryer, one person who knows where things are',
    lead: 'Same week',
    from: '€ 45 / day',
  },
];

const PROCESS = [
  {
    art: octagon,
    n: 'I',
    t: 'Separate',
    d: 'Your file becomes one screen per colour. This is where most of the thinking happens and where a nine-colour print becomes a five-colour print that looks better.',
  },
  {
    art: notch,
    n: 'II',
    t: 'Expose',
    d: 'Film positive, vacuum bed, four minutes under the lamp. Wash out, dry, tape up, and check the mesh against the light before it goes on the press.',
  },
  {
    art: chip,
    n: 'III',
    t: 'Print',
    d: 'One pull, one flood, one colour at a time, in the order the separation says. Wet on wet where the ink allows it and overnight where it does not.',
  },
  {
    art: quaver,
    n: 'IV',
    t: 'Dry and count',
    d: 'Racked for a day per colour, then counted twice, then the spoils are torn in half in front of you so nobody has to wonder.',
  },
];

const PRICES = [
  ['A2', '420 × 594 mm', '1 colour', '50 sheets', '€ 380'],
  ['A2', '420 × 594 mm', '3 colours', '50 sheets', '€ 640'],
  ['A1', '594 × 841 mm', '1 colour', '50 sheets', '€ 520'],
  ['A1', '594 × 841 mm', '4 colours', '50 sheets', '€ 1 090'],
  ['A1', '594 × 841 mm', '4 colours', '200 sheets', '€ 2 240'],
  ['B1', '700 × 1000 mm', '2 colours', '30 sheets', '€ 780'],
  ['B1', '700 × 1000 mm', '6 colours', '30 sheets', '€ 1 860'],
  ['B1', '700 × 1000 mm', '9 colours', '30 sheets', '€ 2 690'],
  ['Custom', 'Up to 700 × 1000 mm', 'Any', 'Any run', 'Ask'],
  ['Overprint', 'Your own sheets', '1 - 3 colours', 'Any run', 'From € 190'],
];

const STOCK = [
  ['Somerset Satin', '300 gsm', 'Cotton, mould made', 'Editions', 'Held'],
  ['Somerset Velvet', '250 gsm', 'Cotton, mould made', 'Editions', 'Held'],
  ['Colorplan Pristine', '270 gsm', 'Coloured through', 'Posters', 'Held'],
  ['Colorplan Ebony', '270 gsm', 'Coloured through', 'Posters', 'Held'],
  ['Munken Pure Rough', '240 gsm', 'Uncoated, warm', 'Posters', 'Held'],
  ['Munken Lynx', '170 gsm', 'Uncoated, bright', 'Runs over 200', 'Held'],
  ['Fedrigoni Sirio', '290 gsm', 'Coloured through', 'Posters', 'To order'],
  ['Zerkall Litho', '250 gsm', 'Mould made', 'Editions', 'To order'],
  ['GF Smith Naturalis', '300 gsm', 'Uncoated, soft', 'Editions', 'To order'],
  ['Newsprint', '52 gsm', 'For proofing only', 'Never sold', 'Held'],
  ['Board, grey', '1.5 mm', 'For test pulls', 'Never sold', 'Held'],
  ['Yours', 'Any', 'Bring it and we will test it', 'Overprints', ' - '],
];

const EDITIONS = [
  ['PN-041', 'Iris Kaandorp', 'Zeven Havens', '9 colours', 'Ed. 30', 'Sold out'],
  ['PN-039', 'Mensah Osei', 'Loud Field', '6 colours', 'Ed. 40', '12 left'],
  ['PN-036', 'Tove Lindgren', 'Rood op Rood', '4 colours', 'Ed. 60', '31 left'],
  ['PN-034', 'Studio Bakker', 'Kade', '3 colours', 'Ed. 100', '4 left'],
  ['PN-030', 'Iris Kaandorp', 'Nachtploeg', '7 colours', 'Ed. 25', 'Sold out'],
  ['PN-027', 'Halima Yusuf', 'Overprint No. 2', '5 colours', 'Ed. 45', '19 left'],
  ['PN-023', 'Pieter Vos', 'Blauwe Maandag', '2 colours', 'Ed. 150', '88 left'],
  ['PN-019', 'Mensah Osei', 'Quiet Field', '6 colours', 'Ed. 40', 'Sold out'],
  ['PN-014', 'Tove Lindgren', 'Wit', '1 colour', 'Ed. 200', '112 left'],
  ['PN-009', 'Ensemble', 'Nine Inks', '9 colours', 'Ed. 9', 'Archive'],
];

const FAQ = [
  ['Can you print my gradient?', 'We can print four flat colours that read as a gradient from two metres away, which is what a screen does. A true gradient is a different process and we will say so.'],
  ['How close is your colour match?', 'Close enough that you will not pick it out of a line-up, and we post you the draw-down before printing so you can disagree in writing.'],
  ['Do you print on textiles?', 'No. The dryer, the inks and the mesh counts are all wrong for it and there are four workshops within a kilometre that do it properly.'],
  ['What happens to the spoils?', 'Torn in half and recycled. If you want the good spoils, say so before we print and they cost the same as a print.'],
  ['Can I watch?', 'Yes, and you should. A colour decision made at the press takes ten seconds and a colour decision made by email takes four days.'],
  ['Do you ship?', 'Rolled in a tube anywhere, flat in a crate within the Benelux. Editions over B1 travel flat or not at all.'],
];

/* What the letter is, answered before anyone has to ask. */
const SIGNUP_META: [string, string][] = [
  ['How often', 'Whenever an edition dries, which is roughly monthly.'],
  ['What is in it', 'One print, the separations behind it, and the price.'],
  ['Leaving', 'One link, bottom of every letter, no questions asked.'],
];

export default function PresseNeunPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f4f2ea',
        '--ink': '#141210',
        '--pink': '#ff2d78',
        '--grey': '#8c8a82',
        '--pale': '#e2dfd4',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,pink,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Presse Neun</a>
        <nav aria-label="Sections">
          <a data-edit="bar.work" data-edit-max="28" href="#work">Work</a>
          <a data-edit="bar.process" data-edit-max="28" href="#process">Process</a>
          <a data-edit="bar.prices" data-edit-max="28" href="#prices">Prices</a>
          <a data-edit="bar.editions" data-edit-max="28" href="#editions">Editions</a>
        </nav>
        <span data-edit="bar.now" data-edit-max="60" className={s.now}>Zeefdruk / Rotterdam</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            Two fields stacked in multiply - which is exactly what happens
            when a second colour goes down on a sheet that is still wet. */}
        <section className={s.hero}>
          <div className={s.heroStack} aria-hidden="true">
            <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,4" className={s.heroLayer}>
              <TabbiedPattern
                pattern={swapcut}
                palette={['transparent', PINK, PALE]}
                fit="grid"
                cellSize={168}
                redrawInterval={5600}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div data-edit-pattern="hero.field2" data-edit-roles="transparent,3,4" className={`${s.heroLayer} ${s.heroLayerTwo}`}>
              <TabbiedPattern
                pattern={bias}
                palette={['transparent', GREY, PALE]}
                fit="grid"
                cellSize={124}
                redrawInterval={4300}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
          </div>
          <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>Hand screenprint / Rotterdam / nine colours</p>
          <h1 className={s.heroType}>
            <span data-edit="hero.text" data-edit-max="60">Presse</span>
            <span data-edit="hero.pink" data-edit-max="60" className={s.pink}>Neun</span>
          </h1>
          <div className={s.heroFoot}>
            <p data-edit="hero.body" data-edit-max="240" data-edit-multiline>
              Flat colour you cannot get any other way, pulled by hand, one
              screen at a time, on paper we keep in the building.
            </p>
            <a data-edit="hero.cta" data-edit-max="28" className={s.cta} href="#prices">
              What it costs
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------------ INKS */}
        <section className={s.inks} aria-label="The house ink rack">
          {INKS.map(([name, hex], i) => (
            <div key={name} style={{ background: hex }}>
              <span data-edit={`inks.text.${i}`} data-edit-max="60" style={{ color: labelOn(hex) }}>{name}</span>
            </div>
          ))}
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p data-edit="statement.big" data-edit-max="240" data-edit-multiline className={s.big}>
            A screen lays down more ink than any other process, which is why a
            flat colour printed this way looks lit from inside and the same
            colour printed digitally looks like a photograph of it.
          </p>
          <div className={s.statementMeta}>
            <p data-edit="statement.body" data-edit-max="240" data-edit-multiline>
              Nine of us, one four-metre bed, two dryers and a rack that holds
              eleven hundred sheets. We print editions for artists, posters for
              anybody, and we mix every colour in the building.
            </p>
            <p data-edit="statement.body2" data-edit-max="240" data-edit-multiline>
              The workshop has been in the same brick shed on the Maashaven
              since 2013, and the lease says 2038, which is longer than most of
              our plans.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <div className={s.secHead}>
            <h2 data-edit="work.title" data-edit-max="60" id="work-h">What we print</h2>
            <p data-edit="work.body" data-edit-max="240" data-edit-multiline>Lead times are honest ones and include the day we spend arguing about the separation.</p>
          </div>
          <ol className={s.rows}>
            {SERVICES.map((x, i) => (
              <li key={x.n}>
                <span data-edit={`work.rowN.${i}`} data-edit-max="60" className={s.rowN}>{x.n}</span>
                <h3 data-edit={`work.rowTitle.${i}`} data-edit-max="40" className={s.rowTitle}>{x.t}</h3>
                <span data-edit={`work.rowSub.${i}`} data-edit-max="60" className={s.rowSub}>{x.d}</span>
                <span data-edit={`work.rowLead.${i}`} data-edit-max="60" className={s.rowLead}>{x.lead}</span>
                <span data-edit={`work.rowFrom.${i}`} data-edit-max="60" className={s.rowFrom}>{x.from}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div data-edit-pattern="top.field" data-edit-roles="transparent,2,1,4" className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={scramble}
            palette={['transparent', PINK, INK, PALE]}
            fit="grid"
            cellSize={108}
            redrawInterval={3800}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* --------------------------------------------------------- PROCESS */}
        <section id="process" className={s.process} aria-labelledby="process-h">
          <div className={s.secHead}>
            <h2 data-edit="process.title" data-edit-max="60" id="process-h">Four stages</h2>
            <p data-edit="process.body" data-edit-max="240" data-edit-multiline>The same four whether it is one colour or nine. Only the third one gets longer.</p>
          </div>
          <div className={s.pGrid}>
            {PROCESS.map((p, i) => (
              <article key={p.n}>
                <div data-edit-pattern={`process.field.${i}`} data-edit-roles="transparent,2,3" className={s.pPlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={p.art}
                    palette={['transparent', PINK, GREY]}
                    fit="grid"
                    cellSize={56}
                    redrawInterval={5400}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p data-edit={`process.pN.${i}`} data-edit-max="240" data-edit-multiline className={s.pN}>{p.n}</p>
                <h3 data-edit={`process.title2.${i}`} data-edit-max="40">{p.t}</h3>
                <p data-edit={`process.pBody.${i}`} data-edit-max="240" data-edit-multiline className={s.pBody}>{p.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- PRICES */}
        <section id="prices" className={s.listing} aria-labelledby="prices-h">
          <div className={s.secHead}>
            <h2 data-edit="prices.title" data-edit-max="60" id="prices-h">The price list</h2>
            <p data-edit="prices.body" data-edit-max="240" data-edit-multiline>Published, unnegotiated, and the same for everybody. Setup is in the figure.</p>
          </div>
          <ol className={s.table}>
            {PRICES.map((r, i) => (
              <li key={i}>
                <span data-edit={`prices.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`prices.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[1]}</span>
                <span data-edit={`prices.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`prices.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`prices.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- STOCK */}
        <section id="stock" className={s.listing} aria-labelledby="stock-h">
          <div className={s.secHead}>
            <h2 data-edit="stock.title" data-edit-max="60" id="stock-h">Paper in the building</h2>
            <p data-edit="stock.body" data-edit-max="240" data-edit-multiline>Held means we have it today. To order means four working days from Amsterdam.</p>
          </div>
          <ol className={s.table}>
            {STOCK.map((r, i) => (
              <li key={r[0]}>
                <span data-edit={`stock.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[1]}</span>
                <span data-edit={`stock.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[0]}</span>
                <span data-edit={`stock.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[2]}</span>
                <span data-edit={`stock.tMid2.${i}`} data-edit-max="60" className={s.tMid}>{r[3]}</span>
                <span data-edit={`stock.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div data-edit-pattern="quote.field" data-edit-roles="transparent,2,4" className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={pennantbox}
              palette={['transparent', PINK, PALE]}
              fit="grid"
              cellSize={126}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p data-edit="quote.body" data-edit-max="240" data-edit-multiline>Nine colours is not nine times better than four. It is nine times more places to go wrong.</p>
            <cite data-edit="quote.attribution" data-edit-max="48">Halima Yusuf, master printer</cite>
          </blockquote>
        </section>

        {/* -------------------------------------------------------- EDITIONS */}
        <section id="editions" className={s.listing} aria-labelledby="ed-h">
          <div className={s.secHead}>
            <h2 data-edit="editions.title" data-edit-max="60" id="ed-h">Editions we published</h2>
            <p data-edit="editions.body" data-edit-max="240" data-edit-multiline>Our own imprint. Printed here, sold here, and never reprinted once an edition closes.</p>
          </div>
          <ol className={s.table}>
            {EDITIONS.map((r, i) => (
              <li key={r[0]}>
                <span data-edit={`editions.tKey.${i}`} data-edit-max="60" className={s.tKey}>{r[0]}</span>
                <span data-edit={`editions.tMain.${i}`} data-edit-max="60" className={s.tMain}>{r[2]}</span>
                <span data-edit={`editions.tMid.${i}`} data-edit-max="60" className={s.tMid}>{r[1]}</span>
                <span className={s.tMid}>{r[3]}, {r[4]}</span>
                <span data-edit={`editions.tEnd.${i}`} data-edit-max="60" className={s.tEnd}>{r[5]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------- FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <div className={s.secHead}>
            <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Asked at the door</h2>
            <p data-edit="faq.body" data-edit-max="240" data-edit-multiline>Usually while somebody is holding a wet sheet, so the answers are short.</p>
          </div>
          <dl className={s.faqList}>
            {FAQ.map(([q, a], i) => (
              <div key={q}>
                <dt data-edit={`faq.term.${i}`} data-edit-max="28">{q}</dt>
                <dd data-edit={`faq.body2.${i}`} data-edit-max="200" data-edit-multiline>{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <p data-edit="contact.contactPre" data-edit-max="240" data-edit-multiline className={s.contactPre}>Bring us a file - or just watch</p>
          <h2 data-edit="contact.signupTitle" data-edit-max="60" id="contact-h" className={s.signupTitle}>Editions, as they come off the bed</h2>
          <form className={s.signup}>
            <label data-edit="contact.srOnly" className={s.srOnly} htmlFor="signup-mail">
              Email address
            </label>
            <input id="signup-mail" name="email" type="email" placeholder="you@example.com" />
            <button data-edit="contact.action" data-edit-max="24" type="submit">Put me on it</button>
          </form>
          <dl className={s.signupMeta}>
            {SIGNUP_META.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`contact.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`contact.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
          <p data-edit="contact.contactFine" data-edit-max="240" data-edit-multiline className={s.contactFine}>
            Maashaven Oostzijde 9, 3072 Rotterdam. The workshop is open to
            visitors on Thursdays, and to clients whenever their job is on the
            bed - write to bed@presseneun.example if you would rather not wait
            for a letter.
          </p>
        </section>
      </main>

      <div data-edit-pattern="page.field" data-edit-roles="transparent,4,2,3" className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={octagon}
          palette={['transparent', PALE, PINK, GREY]}
          fit="grid"
          cellSize={96}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <nav className={s.footIndex} aria-label="Sections">
          <a data-edit="footer.work" data-edit-max="28" href="#work">What we print</a>
          <a data-edit="footer.process" data-edit-max="28" href="#process">Four stages</a>
          <a data-edit="footer.editions" data-edit-max="28" href="#editions">Editions</a>
          <a data-edit="footer.prices" data-edit-max="28" href="#prices">Prices</a>
        </nav>
        <div className={s.footGrid}>
          <div>
            <h2 data-edit="footer.title" data-edit-max="60">On the floor</h2>
            <p>
              A 1974 Heidelberg KORD, still on its original bed
              <br />
              Two flatbed proofing presses
              <br />
              A Vandercook of 1953 that nobody is allowed to move
            </p>
          </div>
          <div>
            <h2 data-edit="footer.title2" data-edit-max="60">Imprint</h2>
            <ul>
              <li><a data-edit="footer.editions2" data-edit-max="28" href="#editions">Editions</a></li>
              <li><a data-edit="footer.stock" data-edit-max="28" href="#stock">Paper</a></li>
              <li><a data-edit="footer.faq" data-edit-max="28" href="#faq">Questions</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.title3" data-edit-max="60">Here</h2>
            <p>
              Maashaven Oostzijde 9
              <br />
              3072 Rotterdam
              <br />
              bed@presseneun.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional print workshop. Prices, editions and paper stocks are invented.</p>
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
