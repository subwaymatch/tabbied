import { TabbiedPattern } from 'tabbied/react';
import { giornata, gully, raku } from 'tabbied/patterns';
import s from './kiln-aoi.module.css';

export const metadata = {
  title: 'Kiln Aoi: Ceramics studio, Kanazawa',
  description:
    'Kiln Aoi is a two-person pottery in a house on Utatsuyama hill, Kanazawa. Tea bowls, plates and vases from one wood kiln fired four times a year, with classes in between.',
};

/* Soft ink, a clay and a moss. Every field takes `transparent` in the
   background slot so the scorch and the mosaic sit in the warm grey of the
   page rather than on a plate laid over it. */
const INK = '#2B2926';
const CLAY = '#9C6B4E';
const MOSS = '#6F7A5C';
const GREY = '#A19C93';
/* Tiles pin their doodle to a whole multiple of the cell (9 x 72px) and let
   the plate clip it, so every grid track is a whole pixel. */
const TILE_BOX = 648;

const NAV = [
  ['Vessels', '#vessels'],
  ['Glazes', '#glazes'],
  ['Firings', '#firings'],
  ['Classes', '#classes'],
  ['Visit', '#visit'],
  ['Notes', '#notes'],
];

type Item = {
  name: string;
  size: string;
  price: string;
};

type Group = {
  no: string;
  title: string;
  body: string;
  items: Item[];
};

const VESSELS: Group[] = [
  {
    no: '1',
    title: 'Tea bowls',
    body: 'Thrown a little heavy so the hand knows where the foot is, and fired on the side of the kiln that catches the ash.',
    items: [
      { name: 'Chawan, ao glaze', size: '12 x 8 cm', price: '18 000 yen' },
      { name: 'Chawan, shino', size: '12 x 8 cm', price: '18 000 yen' },
      { name: 'Chawan, ash deposit', size: '13 x 8 cm', price: '24 000 yen' },
      { name: 'Yunomi', size: '7 x 9 cm', price: '6 500 yen' },
    ],
  },
  {
    no: '2',
    title: 'Plates',
    body: 'Flat enough to stack, with a rim that rises just where a thumb would go. Most are kaki; a few come out of each firing in ao.',
    items: [
      { name: 'Round plate', size: '21 cm', price: '9 800 yen' },
      { name: 'Round plate, small', size: '15 cm', price: '4 800 yen' },
      { name: 'Square plate', size: '18 x 18 cm', price: '8 200 yen' },
      { name: 'Serving plate', size: '30 cm', price: '22 000 yen' },
    ],
  },
  {
    no: '3',
    title: 'Vases',
    body: 'One flower, mostly. The tall ones stand nearest the firebox and carry the heaviest ash, so no two are alike and none are repeated.',
    items: [
      { name: 'Hanaire, tall', size: '9 x 24 cm', price: '28 000 yen' },
      { name: 'Hanaire, wide', size: '14 x 16 cm', price: '26 000 yen' },
      { name: 'Bud vase', size: '6 x 14 cm', price: '8 500 yen' },
      { name: 'Wall vase', size: '7 x 19 cm', price: '12 000 yen' },
    ],
  },
];

type Glaze = {
  name: string;
  made: string;
  body: string;
};

const GLAZES: Glaze[] = [
  {
    name: 'Ao',
    made: 'Rice-straw ash, feldspar, a little iron',
    body: 'A blue-green that runs where it is thick and thins to a pale celadon over the rim. In reduction it goes cloudy; in a clean firing it clears like water over stones.',
  },
  {
    name: 'Kaki',
    made: 'Iron-saturated, on a red clay',
    body: 'Persimmon. Matte rust where the glaze is thin, glossy black where it pools in the foot ring, and a metallic sheen on the side that faced the flame.',
  },
  {
    name: 'Shino',
    made: 'Feldspar and clay, put on thick',
    body: 'White, with pinholes and a crawl at the edges. It traps carbon in the first days of the firing and comes out grey and orange where the smoke got under it.',
  },
  {
    name: 'Hai-kaburi',
    made: 'No glaze at all',
    body: 'The wood ash lands on the bare clay over four days and melts to a green glass on the side facing the firebox. The back of the pot stays dry and dark. This is the one we cannot plan.',
  },
];

type Firing = {
  date: string;
  kiln: string;
  what: string;
  sale: string;
};

const FIRINGS: Firing[] = [
  { date: '12 to 15 Feb 2027', kiln: 'Wood kiln', what: 'Tea bowls and vases', sale: 'Sat 20 Feb, from 11.00' },
  { date: '8 to 11 May 2027', kiln: 'Wood kiln', what: "Plates, the year's serving pieces", sale: 'Sat 15 May, from 11.00' },
  { date: '3 Jul 2027', kiln: 'Electric', what: 'Class work, glaze tests', sale: 'No sale' },
  { date: '18 to 21 Sep 2027', kiln: 'Wood kiln', what: 'Everything, the largest of the year', sale: 'Sat 25 Sep, from 11.00' },
  { date: '20 to 23 Nov 2027', kiln: 'Wood kiln', what: 'Tea bowls for the winter', sale: 'Sat 27 Nov, from 11.00' },
];

type Course = {
  title: string;
  when: string;
  length: string;
  fee: string;
  body: string;
};

const CLASSES: Course[] = [
  { title: 'A tea bowl in a day', when: 'Saturdays: 16 Jan, 13 Mar, 12 Jun, 9 Oct', length: 'Four hours', fee: '9 000 yen', body: 'Six people. You throw three bowls, keep one, and we glaze and fire it in the next wood firing. Collect it, or we post it.' },
  { title: 'The wheel, six evenings', when: 'Tuesdays from 2 Feb, 4 May, 7 Sep', length: 'Six weeks, 18.30 to 21.00', fee: '36 000 yen', body: 'Four people at four wheels. Centring, cylinders, bowls, a lid. Clay and firing included; most people leave with about a dozen pieces.' },
  { title: 'Glazing day', when: 'The Sunday before each wood firing', length: 'Five hours', fee: '7 000 yen', body: 'Bring bisqued work of your own or use ours. Four glazes, a talk about what each will do, and a place in the kiln for three pieces.' },
  { title: "Children's afternoon", when: 'School holidays, Wednesdays', length: 'Two hours', fee: '3 000 yen', body: 'Ages six to twelve, with an adult. Pinch pots and a plate, fired in the electric kiln and ready in a fortnight.' },
];

const HOURS = [
  ['Friday to Sunday', '11.00 to 17.00'],
  ['After a firing', 'Every day for a week, 11.00 to 17.00'],
  ['During a firing', 'Closed, and the road is closed too'],
  ['Other days', 'By arrangement, for a purchase or a class'],
];

type Note = {
  date: string;
  title: string;
  body: string;
};

const NOTES: Note[] = [
  { date: '14 Aug 2026', title: 'The kiln shed', body: 'The roof over the kiln was re-tiled this week with tiles from a house being taken down in Nomachi. They are older than the kiln and they fit better than the ones we bought.' },
  { date: '2 Jun 2026', title: 'The May firing', body: 'Cooler on the left than we wanted, which gave us twelve dry shino bowls and one hai-kaburi vase that is the best thing to come out of the kiln in three years. It is not for sale.' },
  { date: '19 Mar 2026', title: 'A clay from Noto', body: 'A farmer near Wajima sent two sacks of a red clay from a bank behind his barn. It throws short and cracks if you hurry, and under kaki it is the colour of the barn.' },
];

export default function KilnAoiPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#efeae2',
        '--ink': '#2b2926',
        '--clay': '#9c6b4e',
        '--moss': '#6f7a5c',
        '--grey': '#a19c93',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,clay,moss,grey"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500&family=Zen+Kaku+Gothic+New:wght@300;400;500&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Kiln Aoi</a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <span data-edit="bar.barMeta" data-edit-max="60" className={s.barMeta}>Kanazawa</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            The scorch reaches in from the top right; the words sit low and
            left, and a vertical label stands at the edge like a hanging
            scroll. Nothing is centred. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,1,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={raku}
              palette={['transparent', CLAY, INK, MOSS]}
              fit="grid"
              cellSize={168}
              redrawInterval={6600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <span data-edit="hero.text" data-edit-max="60" className={s.vertical} aria-hidden="true">Utatsuyama, Kanazawa</span>
          <div className={s.heroInner}>
            <p data-edit="hero.heroKicker" data-edit-max="240" data-edit-multiline className={s.heroKicker}>A pottery on a hill, since 2014</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" className={s.heroTitle} id="hero-h">
              Two people, one wood kiln,
              <br />
              <em>four firings a year.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Tea bowls, plates and vases, made in a house above the old tea
              district and fired for four days at a time. What comes out is
              sold from the front room on the Saturday after.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------- VESSELS
            Three groups, each a tile and a list, and the tile changes sides
            from one group to the next. */}
        <section id="vessels" className={s.vessels} aria-labelledby="vessels-h">
          <div className={s.secHead}>
            <h2 data-edit="vessels.title" data-edit-max="60" id="vessels-h">The vessels</h2>
            <p data-edit="vessels.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Prices include tax and the box. Sizes are width, then height,
              measured after the firing, which takes a tenth off everything.
            </p>
          </div>
          {VESSELS.map((g, i) => (
            <article key={g.no} className={s.group}>
              <div data-edit-pattern={`group.field.${i}`} data-edit-roles="transparent,2,3,4" className={s.tile} aria-hidden="true">
                <TabbiedPattern
                  pattern={gully}
                  palette={['transparent', CLAY, MOSS, GREY]}
                  fit="grid"
                  cellSize={72}
                  redrawInterval={5600 + i * 400}
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
              <div className={s.groupText}>
                <span data-edit={`group.groupNo.${i}`} data-edit-max="60" className={s.groupNo}>{g.no}</span>
                <h3 data-edit={`group.title.${i}`} data-edit-max="40">{g.title}</h3>
                <p data-edit={`group.groupBody.${i}`} data-edit-max="240" data-edit-multiline className={s.groupBody}>{g.body}</p>
                <ul className={s.items}>
                  {g.items.map((it, j) => (
                    <li key={it.name}>
                      <span data-edit={`group.itemName.${i}.${j}`} data-edit-max="60" className={s.itemName}>{it.name}</span>
                      <span data-edit={`group.itemSize.${i}.${j}`} data-edit-max="60" className={s.itemSize}>{it.size}</span>
                      <span data-edit={`group.itemPrice.${i}.${j}`} data-edit-max="60" className={s.itemPrice}>{it.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        {/* ---------------------------------------------------------- GLAZES */}
        <section id="glazes" className={s.glazes} aria-labelledby="glazes-h">
          <div className={s.secHead}>
            <h2 data-edit="glazes.title" data-edit-max="60" id="glazes-h">Four glazes</h2>
            <p data-edit="glazes.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Mixed in the shed from ash, feldspar and clay, and tested on a
              tile in every firing because the wood changes every year.
            </p>
          </div>
          <div className={s.glazeGrid}>
            {GLAZES.map((g, i) => (
              <article key={g.name} className={s.glaze}>
                <h3 data-edit={`glaze.title.${i}`} data-edit-max="40">{g.name}</h3>
                <p data-edit={`glaze.glazeMade.${i}`} data-edit-max="240" data-edit-multiline className={s.glazeMade}>{g.made}</p>
                <p data-edit={`glaze.glazeBody.${i}`} data-edit-max="240" data-edit-multiline className={s.glazeBody}>{g.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- FIRINGS */}
        <section id="firings" className={s.firings} aria-labelledby="firings-h">
          <div data-edit-pattern="firings.field" data-edit-roles="transparent,4,3" className={s.firingsField} aria-hidden="true">
            <TabbiedPattern
              pattern={giornata}
              palette={['transparent', GREY, MOSS]}
              fit="grid"
              cellSize={96}
              redrawInterval={7000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.firingsInner}>
            <div className={s.secHead}>
              <h2 data-edit="firings.title" data-edit-max="60" id="firings-h">Firings in 2027</h2>
              <p data-edit="firings.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
                The wood kiln takes four days and three of us awake. The sale
                opens in the front room the Saturday after, and what is left
                goes on the shelves.
              </p>
            </div>
            <ol className={s.firingList}>
              <li className={s.firingHead} aria-hidden="true">
                <span data-edit="firings.text" data-edit-max="60">Dates</span>
                <span data-edit="firings.text2" data-edit-max="60">Kiln</span>
                <span data-edit="firings.text3" data-edit-max="60">What goes in</span>
                <span data-edit="firings.text4" data-edit-max="60">Sale</span>
              </li>
              {FIRINGS.map((f, i) => (
                <li key={f.date} className={s.firing}>
                  <time data-edit={`firings.date.${i}`}>{f.date}</time>
                  <span data-edit={`firings.firingKiln.${i}`} data-edit-max="60" className={s.firingKiln}>{f.kiln}</span>
                  <span data-edit={`firings.text5.${i}`} data-edit-max="60">{f.what}</span>
                  <span data-edit={`firings.firingSale.${i}`} data-edit-max="60" className={s.firingSale}>{f.sale}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --------------------------------------------------------- CLASSES */}
        <section id="classes" className={s.classes} aria-labelledby="classes-h">
          <div className={s.secHead}>
            <h2 data-edit="classes.title" data-edit-max="60" id="classes-h">Classes</h2>
            <p data-edit="classes.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Small, slow, and in the same room the work is made in. Book by
              e-mail; a place is held for a week without payment.
            </p>
          </div>
          <ol className={s.classList}>
            {CLASSES.map((c, i) => (
              <li key={c.title}>
                <h3 data-edit={`classes.title2.${i}`} data-edit-max="40">{c.title}</h3>
                <dl className={s.classFacts}>
                  <div>
                    <dt data-edit={`classes.term.${i}`} data-edit-max="28">When</dt>
                    <dd data-edit={`classes.body.${i}`} data-edit-max="200" data-edit-multiline>{c.when}</dd>
                  </div>
                  <div>
                    <dt data-edit={`classes.term2.${i}`} data-edit-max="28">Length</dt>
                    <dd data-edit={`classes.body2.${i}`} data-edit-max="200" data-edit-multiline>{c.length}</dd>
                  </div>
                  <div>
                    <dt data-edit={`classes.term3.${i}`} data-edit-max="28">Fee</dt>
                    <dd data-edit={`classes.body3.${i}`} data-edit-max="200" data-edit-multiline>{c.fee}</dd>
                  </div>
                </dl>
                <p data-edit={`classes.body4.${i}`} data-edit-max="240" data-edit-multiline>{c.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- VISIT */}
        <section id="visit" className={s.visit} aria-labelledby="visit-h">
          <div className={s.visitText}>
            <h2 data-edit="visit.title" data-edit-max="60" id="visit-h">A house on a hill</h2>
            <p data-edit="visit.visitLead" data-edit-max="240" data-edit-multiline className={s.visitLead}>
              Twenty minutes on foot from the Higashi Chaya district, up a
              path that is steeper than it looks and stone all the way. The
              house is the one with the woodpile. Come in through the garden;
              the front room is the shop and the kiln shed is behind it.
            </p>
            <p data-edit="visit.visitNote" data-edit-max="240" data-edit-multiline className={s.visitNote}>
              There is no parking on the hill. The bus to Utatsuyama-koen
              stops four minutes below the house, and a taxi will take you to
              the bottom of the path but not up it.
            </p>
          </div>
          <dl className={s.hours}>
            {HOURS.map(([k, v], i) => (
              <div key={k}>
                <dt data-edit={`visit.term.${i}`} data-edit-max="28">{k}</dt>
                <dd data-edit={`visit.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ----------------------------------------------------------- NOTES */}
        <section id="notes" className={s.notes} aria-labelledby="notes-h">
          <div className={s.secHead}>
            <h2 data-edit="notes.title" data-edit-max="60" id="notes-h">Notes from the studio</h2>
            <p data-edit="notes.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>
              Written after each firing and whenever something happens. Not
              often.
            </p>
          </div>
          <ol className={s.noteList}>
            {NOTES.map((n, i) => (
              <li key={n.date}>
                <time data-edit={`notes.noteDate.${i}`} className={s.noteDate}>{n.date}</time>
                <h3 data-edit={`notes.title2.${i}`} data-edit-max="40">{n.title}</h3>
                <p data-edit={`notes.body.${i}`} data-edit-max="240" data-edit-multiline>{n.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <h2 data-edit="contact.title" data-edit-max="60" id="contact-h">Write to us</h2>
          <dl className={s.contactList}>
            <div>
              <dt data-edit="contact.term" data-edit-max="28">Post</dt>
              <dd data-edit="contact.body3" data-edit-max="200" data-edit-multiline>
                Kiln Aoi
                <br />
                3-12 Utatsuyama
                <br />
                Kanazawa 920-0831
              </dd>
            </div>
            <div>
              <dt data-edit="contact.term2" data-edit-max="28">Mail</dt>
              <dd>
                <a data-edit="contact.link" data-edit-max="28" href="mailto:studio@kilnaoi.example">studio@kilnaoi.example</a>
              </dd>
            </div>
            <div>
              <dt data-edit="contact.term3" data-edit-max="28">Telephone</dt>
              <dd data-edit="contact.body" data-edit-max="200" data-edit-multiline>+81 76 000 0000, not during a firing</dd>
            </div>
            <div>
              <dt data-edit="contact.term4" data-edit-max="28">Posting</dt>
              <dd data-edit="contact.body2" data-edit-max="200" data-edit-multiline>Within Japan 1 200 yen a parcel; abroad by quote, and it takes a fortnight</dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Kiln Aoi</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              A two-person pottery on Utatsuyama hill, Kanazawa. Four wood
              firings a year, and classes in between.
            </p>
          </div>
          <div>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>The work</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.vessels" data-edit-max="28" href="#vessels">The vessels</a></li>
              <li><a data-edit="footer.glazes" data-edit-max="28" href="#glazes">Four glazes</a></li>
              <li><a data-edit="footer.firings" data-edit-max="28" href="#firings">Firings in 2027</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Coming</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.classes" data-edit-max="28" href="#classes">Classes</a></li>
              <li><a data-edit="footer.visit" data-edit-max="28" href="#visit">A house on a hill</a></li>
              <li><a data-edit="footer.notes" data-edit-max="28" href="#notes">Notes</a></li>
            </ul>
          </div>
          <div>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Here</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              3-12 Utatsuyama
              <br />
              Kanazawa 920-0831
              <br />
              studio@kilnaoi.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional pottery. Prices, dates and people are invented.</p>
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
