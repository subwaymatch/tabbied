import { TabbiedPattern } from 'tabbied/react';
import { eyot, percale, wale } from 'tabbied/patterns';
import s from './harbour-ledger.module.css';

export const metadata = {
  title: 'The Harbour Ledger: Local newspaper, Whitby',
  description:
    'The Harbour Ledger is the weekly newspaper of Whitby and the Esk Valley, printed every Friday since 1874. News, the harbour, the tides, the letters, and how to subscribe.',
};

/* Newsprint inks. Every field draws on `transparent`, so the pattern sits
   in the off-white of the page rather than on a plate of its own. */
const INK = '#111111';
const RED = '#B3261E';
const GREY = '#6B6B66';
const PALE = '#DCD9CF';

const NAV = [
  ['Front page', '#front'],
  ['Sections', '#sections'],
  ['Tides', '#tides'],
  ['Letters', '#letters'],
  ['Subscribe', '#subscribe'],
  ['About', '#about'],
];

type Story = {
  kicker: string;
  headline: string;
  standfirst: string;
  byline: string;
  body: string[];
};

const LEAD: Story = {
  kicker: 'Harbour',
  headline: 'Swing bridge to close for six weeks of repairs from October',
  standfirst:
    'The council has confirmed that the 1908 structure will shut to vehicles from Monday 5 October, with the footway kept open except at the top of the tide.',
  byline: 'By Anne Storr, Harbour correspondent',
  body: [
    'The bridge that joins the two halves of the town will close to traffic for the first time since 2011 while its turning gear is replaced. The work, put out to tender in March, has gone to a Hull firm that rebuilt the mechanism at Selby, and the council says the six-week programme has a fortnight of slack in it for weather.',
    'Pedestrians will keep the footway for most of each day. The bridge will be swung for the fishing fleet twice a day at high water, at which point the footway closes for up to forty minutes, and the council is asking the east side to plan around the tide table printed on page 15 of this edition.',
    'Traders on Church Street, who lost an estimated third of their autumn takings in the 2011 closure, have asked for the contractor\'s programme to be published week by week. The council has agreed, and the Ledger will print it.',
  ],
};

const STORIES: Story[] = [
  {
    kicker: 'Fishing',
    headline: 'Lobster landings up a fifth on last year, says quay office',
    standfirst: 'Eleven boats, warmer water, and a market in Spain that pays by the kilo.',
    byline: 'By Tom Ridley',
    body: [
      'The harbour office recorded 214 tonnes of lobster and crab landed at Whitby between April and August, against 178 for the same months last year. Four boats now sell direct to a buyer in Vigo who collects from the quay on Tuesdays.',
    ],
  },
  {
    kicker: 'Town',
    headline: 'Pannett Park bandstand to be repainted in its 1929 colours',
    standfirst: 'Green and cream, from a paint sample found under the eaves.',
    byline: 'By Cath Dunning',
    body: [
      'The Friends of Pannett Park have raised the 4,800 pounds needed to strip and repaint the bandstand, after a conservation officer found the original scheme beneath eleven later coats. Work starts once the last concert of the season has been played.',
    ],
  },
  {
    kicker: 'Schools',
    headline: 'Eskdale School choir takes the regional final in Middlesbrough',
    standfirst: 'Forty-one voices, one coach, and a rendition of the fishermen\'s hymn that the judges called unarguable.',
    byline: 'By Tom Ridley',
    body: [
      'The choir goes through to the national round in Birmingham in November. The school is asking for help with the coach, which is where the Ledger would gently point readers to the notices on page 15.',
    ],
  },
  {
    kicker: 'West pier',
    headline: 'Fog signal returns to the west pier after eleven silent years',
    standfirst: 'One blast every thirty seconds, from the first fog of the autumn.',
    byline: 'By Anne Storr',
    body: [
      'The signal was switched off in 2015 as a saving and switched back on last Thursday after a petition of 2,300 names and a winter in which two boats missed the entrance. The Ledger is told that the first night it sounded, the Fishermen\'s Arms fell quiet to listen.',
    ],
  },
];

const INDEX = [
  ['News', '2 to 5'],
  ['Harbour and fishing', '6'],
  ['Esk Valley', '7'],
  ['Letters', '8'],
  ['Arts and events', '9'],
  ['Sport', '10 to 11'],
  ['Property', '12 to 14'],
  ['Notices and tides', '15'],
  ['Crossword', '16'],
];

type Tide = {
  day: string;
  date: string;
  high1: string;
  high2: string;
  low1: string;
  low2: string;
};

const TIDES: Tide[] = [
  { day: 'Saturday', date: '12 Sep', high1: '06:31', high2: '18:55', low1: '00:20', low2: '12:44' },
  { day: 'Sunday', date: '13 Sep', high1: '07:19', high2: '19:43', low1: '01:08', low2: '13:32' },
  { day: 'Monday', date: '14 Sep', high1: '08:07', high2: '20:31', low1: '01:56', low2: '14:20' },
  { day: 'Tuesday', date: '15 Sep', high1: '08:55', high2: '21:19', low1: '02:44', low2: '15:08' },
  { day: 'Wednesday', date: '16 Sep', high1: '09:43', high2: '22:07', low1: '03:32', low2: '15:56' },
  { day: 'Thursday', date: '17 Sep', high1: '10:31', high2: '22:55', low1: '04:20', low2: '16:44' },
  { day: 'Friday', date: '18 Sep', high1: '11:19', high2: '23:43', low1: '05:08', low2: '17:32' },
];

type Letter = {
  title: string;
  body: string;
  from: string;
};

const LETTERS: Letter[] = [
  {
    title: 'The bridge closure',
    body: 'Six weeks is optimistic. The last time the swing bridge shut, in 2011, the notice said four and the bridge said nine. Might the council publish the contractor\'s programme, so that those of us on the east side can plan our deliveries around it rather than around hope?',
    from: 'D. Hebden, Church Street',
  },
  {
    title: 'Gulls, again',
    body: 'I write, as I do every September, to point out that the gulls have not read the bylaw. A bin with a lid on Pier Road would achieve more than a sign with a fine on it, and would cost the council rather less than the sign did.',
    from: 'Margaret Foxton, Sandsend',
  },
  {
    title: 'The fog signal',
    body: 'Your report on the fog signal was the best news this paper has printed in years. My father kept the west light in the sixties and said he slept better for hearing it. So, it turns out, do I.',
    from: 'R. Coverdale, Ruswarp',
  },
  {
    title: 'Parking on the Cragg',
    body: 'Residents of the Cragg have had permits since 1998 and have never once been able to park on it in August. If the permits are a fiction, the council might at least stop charging us for the paper they are printed on.',
    from: 'P. Ainsley, Robin Hood\'s Bay',
  },
];

type Offer = {
  name: string;
  price: string;
  per: string;
  body: string;
};

const OFFERS: Offer[] = [
  {
    name: 'Print',
    price: '2.90',
    per: 'a week',
    body: 'Delivered before eight on Friday morning within YO21 and YO22. By post anywhere else in the country for 3.40, usually Saturday.',
  },
  {
    name: 'Digital',
    price: '4.99',
    per: 'a month',
    body: 'The paper exactly as printed, on your screen from ten on Thursday night, plus the archive back to the first edition of 1874.',
  },
  {
    name: 'Both',
    price: '6.49',
    per: 'a month',
    body: 'The print edition on the mat and the digital one the night before. Most subscribers who take both say the paper is for the kitchen table.',
  },
];

const HISTORY = [
  ['1874', 'First edition, four pages, printed on Flowergate by Josiah Pennock'],
  ['1902', 'Moves to Church Street, where the office still is'],
  ['1953', 'The flood edition, set by hand in Scarborough while the press stood under water'],
  ['1974', 'Bought by its staff when the Pennock family sold up'],
  ['2011', 'The archive digitised, every edition back to the first'],
  ['2026', 'Edition 7,912. Twelve staff, one press, still Fridays'],
];

const OFFICE = [
  ['Address', 'Ledger House, 4 Church Street, Whitby YO22 4AS'],
  ['Editor', 'Helen Marske'],
  ['News desk', 'news@harbourledger.example'],
  ['Letters', 'letters@harbourledger.example, 250 words, with a name and a village'],
  ['Telephone', '01947 000 000'],
  ['Counter', 'Monday to Friday, 9 to 5. Saturday, 9 to 12'],
];

export default function HarbourLedgerPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f7f5ee',
        '--ink': '#111111',
        '--red': '#b3261e',
        '--grey': '#6b6b66',
        '--pale': '#dcd9cf',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,red,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:ital,wght@0,400;0,500;0,600;1,400&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">
          The Harbour Ledger
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Whitby, every Friday</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------ MASTHEAD
            wale runs behind the nameplate as a field of ribbing, washed
            with the paper colour where the name sits, so the type stays as
            crisp as a plate. */}
        <section className={s.masthead} aria-labelledby="masthead-h">
          <div data-edit-pattern="masthead.field" data-edit-roles="transparent,4,3,1" className={s.mastField} aria-hidden="true">
            <TabbiedPattern
              pattern={wale}
              palette={['transparent', PALE, GREY, INK]}
              fit="grid"
              cellSize={112}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.mastInner}>
            <p className={s.folio}>
              <span data-edit="masthead.text" data-edit-max="60">No. 7,912</span>
              <span data-edit="masthead.text2" data-edit-max="60">Friday 11 September 2026</span>
              <span data-edit="masthead.text3" data-edit-max="60">Whitby and the Esk Valley</span>
              <span data-edit="masthead.text4" data-edit-max="60">90p</span>
            </p>
            <h1 data-edit="masthead.nameplate" data-edit-max="70" id="masthead-h" className={s.nameplate}>
              The Harbour Ledger
            </h1>
            <p data-edit="masthead.tagline" data-edit-max="240" data-edit-multiline className={s.tagline}>Whitby's own weekly, printed on Church Street since 1874</p>
          </div>
        </section>

        {/* ---------------------------------------------------- FRONT PAGE */}
        <section id="front" className={s.front} aria-labelledby="front-h">
          <h2 data-edit="front.sectionHead" data-edit-max="60" id="front-h" className={s.sectionHead}>
            Front page
          </h2>
          <div className={s.frontGrid}>
            <article className={s.lead}>
              <p data-edit="lead.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>{LEAD.kicker}</p>
              <h3 data-edit="lead.leadHead" data-edit-max="40" className={s.leadHead}>{LEAD.headline}</h3>
              <p data-edit="lead.standfirst" data-edit-max="240" data-edit-multiline className={s.standfirst}>{LEAD.standfirst}</p>
              <p data-edit="lead.byline" data-edit-max="240" data-edit-multiline className={s.byline}>{LEAD.byline}</p>
              <div className={s.leadBody}>
                {LEAD.body.map((para, i) => (
                  <p data-edit={`lead.body.${i}`} data-edit-max="240" data-edit-multiline key={i}>{para}</p>
                ))}
              </div>
            </article>
            {STORIES.map((story, i) => (
              <article key={story.headline} className={s.story}>
                <p data-edit={`story.kicker.${i}`} data-edit-max="240" data-edit-multiline className={s.kicker}>{story.kicker}</p>
                <h3 data-edit={`story.title.${i}`} data-edit-max="40">{story.headline}</h3>
                <p data-edit={`story.standfirst.${i}`} data-edit-max="240" data-edit-multiline className={s.standfirst}>{story.standfirst}</p>
                <p data-edit={`story.byline.${i}`} data-edit-max="240" data-edit-multiline className={s.byline}>{story.byline}</p>
                <div className={s.storyBody}>
                  {story.body.map((para, j) => (
                    <p data-edit={`story.body.${i}.${j}`} data-edit-max="240" data-edit-multiline key={`${i}-${j}`}>{para}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ SECTIONS */}
        <section id="sections" className={s.sections} aria-labelledby="sections-h">
          <h2 data-edit="sections.sectionHead" data-edit-max="60" id="sections-h" className={s.sectionHead}>
            In this edition
          </h2>
          <div className={s.indexGrid}>
            <dl className={s.index}>
              {INDEX.map(([name, pages], i) => (
                <div key={name}>
                  <dt data-edit={`sections.term.${i}`} data-edit-max="28">{name}</dt>
                  <dd data-edit={`sections.body.${i}`} data-edit-max="200" data-edit-multiline>{pages}</dd>
                </div>
              ))}
            </dl>
            <p data-edit="sections.indexNote" data-edit-max="240" data-edit-multiline className={s.indexNote}>
              Sixteen pages, as every week. The crossword is set by a reader
              in Grosmont who has never missed a Friday since 1991 and would
              like it known that the answers are not on the website until
              Monday.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- BAND
            percale: an even stripe in newsprint inks, full width, with
            nothing to read. The one loud field on the page. */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,1,2,4,3" className={s.bandField} aria-hidden="true">
            <TabbiedPattern
              pattern={percale}
              palette={['transparent', INK, RED, PALE, GREY]}
              fit="grid"
              cellSize={96}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- TIDES */}
        <section id="tides" className={s.tides} aria-labelledby="tides-h">
          <h2 data-edit="tides.sectionHead" data-edit-max="60" id="tides-h" className={s.sectionHead}>
            Tide table, this week
          </h2>
          <div className={s.tideGrid}>
            <table className={s.tideTable}>
              <thead>
                <tr>
                  <th data-edit="tides.heading" scope="col">Day</th>
                  <th data-edit="tides.heading2" scope="col">Date</th>
                  <th data-edit="tides.heading3" scope="col">High water</th>
                  <th data-edit="tides.heading4" scope="col">High water</th>
                  <th data-edit="tides.heading5" scope="col">Low water</th>
                  <th data-edit="tides.heading6" scope="col">Low water</th>
                </tr>
              </thead>
              <tbody>
                {TIDES.map((t, i) => (
                  <tr key={t.date}>
                    <th data-edit={`tides.heading7.${i}`} scope="row">{t.day}</th>
                    <td data-edit={`tides.cell.${i}`}>{t.date}</td>
                    <td data-edit={`tides.time.${i}`} className={s.time}>{t.high1}</td>
                    <td data-edit={`tides.time2.${i}`} className={s.time}>{t.high2}</td>
                    <td data-edit={`tides.time3.${i}`} className={s.time}>{t.low1}</td>
                    <td data-edit={`tides.time4.${i}`} className={s.time}>{t.low2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={s.tideNote}>
              <p data-edit="tides.body" data-edit-max="240" data-edit-multiline>
                Times are for Whitby harbour entrance, British Summer Time.
                Springs on Tuesday 15 September; add twenty minutes for
                Sandsend and subtract ten for Robin Hood's Bay.
              </p>
              <p data-edit="tides.body2" data-edit-max="240" data-edit-multiline>
                Predictions are from the Admiralty tables and can be an hour
                out in a north-easterly. The harbour office answers the phone
                from six.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- LETTERS */}
        <section id="letters" className={s.letters} aria-labelledby="letters-h">
          <h2 data-edit="letters.sectionHead" data-edit-max="60" id="letters-h" className={s.sectionHead}>
            Letters to the editor
          </h2>
          <div className={s.letterGrid}>
            {LETTERS.map((l, i) => (
              <article key={l.title} className={s.letter}>
                <h3 data-edit={`letter.title.${i}`} data-edit-max="40">{l.title}</h3>
                <p data-edit={`letter.letterBody.${i}`} data-edit-max="240" data-edit-multiline className={s.letterBody}>{l.body}</p>
                <p data-edit={`letter.letterFrom.${i}`} data-edit-max="240" data-edit-multiline className={s.letterFrom}>{l.from}</p>
              </article>
            ))}
          </div>
          <p data-edit="letters.letterNote" data-edit-max="240" data-edit-multiline className={s.letterNote}>
            Letters are welcome on any subject, and are printed with a name
            and a village. We cut for length and, occasionally, for libel.
          </p>
        </section>

        {/* ----------------------------------------------------- SUBSCRIBE */}
        <section id="subscribe" className={s.subscribe} aria-labelledby="subscribe-h">
          <div className={s.subscribeBox}>
            <h2 data-edit="subscribe.subscribeHead" data-edit-max="60" id="subscribe-h" className={s.subscribeHead}>
              Subscribe
            </h2>
            <p data-edit="subscribe.subscribeLede" data-edit-max="240" data-edit-multiline className={s.subscribeLede}>
              Three ways to take the Ledger. Every one of them can be stopped
              with a phone call, and the counter will refund the balance.
            </p>
            <ul className={s.offers}>
              {OFFERS.map((o, i) => (
                <li key={o.name}>
                  <h3 data-edit={`subscribe.title.${i}`} data-edit-max="40">{o.name}</h3>
                  <p className={s.offerPrice}>
                    <span data-edit={`subscribe.pound.${i}`} data-edit-max="60" className={s.pound}>&#163;</span>
                    <strong data-edit={`subscribe.emphasis.${i}`}>{o.price}</strong>
                    <span data-edit={`subscribe.per.${i}`} data-edit-max="60" className={s.per}>{o.per}</span>
                  </p>
                  <p data-edit={`subscribe.offerBody.${i}`} data-edit-max="240" data-edit-multiline className={s.offerBody}>{o.body}</p>
                </li>
              ))}
            </ul>
            <div className={s.subscribeActions}>
              <a data-edit="subscribe.button" data-edit-max="28" className={s.button} href="mailto:counter@harbourledger.example">
                Write to the counter
              </a>
              <p data-edit="subscribe.subscribeNote" data-edit-max="240" data-edit-multiline className={s.subscribeNote}>
                Or call 01947 000 000 between nine and five, or come to
                Church Street with the coins.
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- ABOUT
            eyot as a quiet wash: a river islet between two banks, at low
            opacity, with the paper pooled under the text. */}
        <section id="about" className={s.about} aria-labelledby="about-h">
          <div data-edit-pattern="about.field" data-edit-roles="transparent,4,3,1" className={s.washField} aria-hidden="true">
            <TabbiedPattern
              pattern={eyot}
              palette={['transparent', PALE, GREY, INK]}
              fit="grid"
              cellSize={104}
              redrawInterval={6800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.aboutInner}>
            <h2 data-edit="about.sectionHead" data-edit-max="60" id="about-h" className={s.sectionHead}>
              About the paper
            </h2>
            <div className={s.aboutGrid}>
              <div className={s.aboutText}>
                <p data-edit="about.aboutLead" data-edit-max="240" data-edit-multiline className={s.aboutLead}>
                  The Ledger has been printed every Friday since 1874, through
                  two wars, one flood and the arrival of the internet, which
                  it covered on page 7.
                </p>
                <p data-edit="about.body" data-edit-max="240" data-edit-multiline>
                  Twelve people work here: five reporters, a photographer,
                  two on the press, two on the counter, an editor and a
                  crossword setter who is paid in stamps. The paper is owned
                  by its staff and answers to nobody in London, which is
                  why the harbour still gets a page of its own.
                </p>
                <p data-edit="about.body2" data-edit-max="240" data-edit-multiline>
                  We print 6,200 copies a week and sell 5,900 of them, which
                  is the same proportion of the town as in 1974 and a better
                  one than most. The rest go to the archive, the library, and
                  the pubs.
                </p>
              </div>
              <dl className={s.history}>
                {HISTORY.map(([year, event], i) => (
                  <div key={year}>
                    <dt data-edit={`about.term.${i}`} data-edit-max="28">{year}</dt>
                    <dd data-edit={`about.body3.${i}`} data-edit-max="200" data-edit-multiline>{event}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- OFFICE */}
        <section id="office" className={s.office} aria-labelledby="office-h">
          <h2 data-edit="office.sectionHead" data-edit-max="60" id="office-h" className={s.sectionHead}>
            The office
          </h2>
          <dl className={s.officeList}>
            {OFFICE.map(([term, value], i) => (
              <div key={term}>
                <dt data-edit={`office.term.${i}`} data-edit-max="28">{term}</dt>
                <dd data-edit={`office.body.${i}`} data-edit-max="200" data-edit-multiline>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* A coda: wale again at a smaller cell, in the two quiet tones. The
          last thing before the footer is the ribbing itself. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,3" className={s.codaField} aria-hidden="true">
          <TabbiedPattern
            pattern={wale}
            palette={['transparent', PALE, GREY]}
            fit="grid"
            cellSize={80}
            redrawInterval={5200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>The Harbour Ledger</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              The weekly newspaper of Whitby and the Esk Valley, printed on
              Church Street every Friday since 1874. Owned by its staff.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>This edition</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.front" data-edit-max="28" href="#front">Front page</a>
              </li>
              <li>
                <a data-edit="footer.tides" data-edit-max="28" href="#tides">Tide table</a>
              </li>
              <li>
                <a data-edit="footer.letters" data-edit-max="28" href="#letters">Letters</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>The paper</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.subscribe" data-edit-max="28" href="#subscribe">Subscribe</a>
              </li>
              <li>
                <a data-edit="footer.about" data-edit-max="28" href="#about">Since 1874</a>
              </li>
              <li>
                <a data-edit="footer.office" data-edit-max="28" href="#office">The office</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Post</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Ledger House
              <br />
              4 Church Street
              <br />
              Whitby YO22 4AS
              <br />
              01947 000 000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional newspaper. The stories, letters, tides, prices and people are invented.</p>
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
