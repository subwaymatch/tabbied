import { TabbiedPattern } from 'tabbied/react';
import { fadedwedge, lucarne, sound } from 'tabbied/patterns';
import s from './tidy-ledger.module.css';

export const metadata = {
  title: 'Tidy Ledger: Bookkeeping app for small shops',
  description:
    'Tidy Ledger is bookkeeping for shops with one till. The point of sale, the bank and the VAT return in one place, reconciled every evening in about two minutes.',
};

/* Product colours. The background slot of every pattern is `transparent`, so
   a field draws straight onto the lilac paper rather than onto a plate. */
const INK = '#1B1A2E';
const VIOLET = '#6D5DF5';
const MINT = '#2ED3A5';
const GREY = '#7D7A94';
const PALE = '#ECEAFB';
/* Tiles pin their doodle to a whole multiple of the cell (6 x 72px) and let
   the card clip it, so every grid track is a whole pixel. */
const TILE_BOX = 432;

const NAV = [
  ['Features', '#features'],
  ['How it works', '#how'],
  ['Pricing', '#pricing'],
  ['Integrations', '#integrations'],
  ['Stories', '#stories'],
  ['FAQ', '#faq'],
];

const STATS = [
  ['4,120', 'shops on the ledger'],
  ['14', 'bank feeds'],
  ['2 min', 'a day, on average'],
  ['EUR 9', 'a month to start'],
];

type Feature = {
  icon: string;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    icon: 'icoTill',
    title: 'Till sync, every evening',
    body: 'Sales come in from the point of sale at close, already split by VAT rate and payment method. You read them, you do not type them.',
  },
  {
    icon: 'icoBank',
    title: 'Bank feeds that match themselves',
    body: 'Fourteen banks, refreshed four times a day. Card settlements are matched to the days they cover, which is the part everyone gets wrong by hand.',
  },
  {
    icon: 'icoVat',
    title: 'The VAT return, drafted',
    body: 'Every quarter the return is filled in from the ledger. You check three numbers and press file, or send it to your accountant to press it for you.',
  },
  {
    icon: 'icoPhoto',
    title: 'Receipts by photo',
    body: 'Point the phone at a supplier receipt. The date, the total and the VAT are read off it and the picture is kept for seven years, as the law asks.',
  },
  {
    icon: 'icoCash',
    title: 'Cash counts at close',
    body: 'Count the drawer, type one number. The ledger works out the difference against the till and keeps a log of it, which the auditor loves and you will not mind.',
  },
  {
    icon: 'icoKey',
    title: 'A login for your accountant',
    body: 'Read-only or full, their choice and yours. No exports, no emailed spreadsheets, and no fee from us for the extra seat.',
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Connect the till and the bank',
    body: 'Twenty minutes on a quiet morning. The point of sale needs an API key, the bank needs a consent screen, and both are walked through on the page.',
  },
  {
    n: '2',
    title: 'Reconcile in the evening',
    body: 'The day arrives as a short list. Most lines are already matched; the rest want a category and a tap. Two minutes is the average, the record is nineteen seconds.',
  },
  {
    n: '3',
    title: 'File the quarter',
    body: 'On the last day of the quarter the return is waiting. Check it, file it, and forget about it until the next one, which is what bookkeeping is supposed to feel like.',
  },
];

type Tier = {
  name: string;
  price: string;
  per: string;
  blurb: string;
  includes: string[];
  cta: string;
  featured: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Starter',
    price: 'EUR 9',
    per: 'a month, excl. VAT',
    blurb: 'One shop, one till, one bank. Enough for a stall or a studio.',
    includes: [
      'One point of sale connection',
      'One bank feed',
      'VAT return, quarterly',
      'Receipts by photo, 100 a month',
      'One accountant login',
      'Email support, next working day',
    ],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Shop',
    price: 'EUR 19',
    per: 'a month, excl. VAT',
    blurb: 'For a shop with staff, two tills, and a supplier list that grows.',
    includes: [
      'Up to three point of sale connections',
      'Up to three bank feeds',
      'VAT return, quarterly or monthly',
      'Receipts by photo, unlimited',
      'Cash counts and drawer log',
      'Purchase orders and supplier statements',
      'Two accountant logins',
      'Chat support, same day',
    ],
    cta: 'Start free',
    featured: true,
  },
  {
    name: 'Multi-shop',
    price: 'EUR 39',
    per: 'a month, excl. VAT',
    blurb: 'Several shops under one name, each with its own books and a combined view.',
    includes: [
      'Up to eight locations',
      'Unlimited tills and bank feeds',
      'Consolidated VAT and per-shop VAT',
      'Stock transfers between shops',
      'Payroll export for your payroll bureau',
      'Manager logins with per-shop access',
      'Phone support, 09:00 to 18:00',
    ],
    cta: 'Talk to us',
    featured: false,
  },
];

const BANKS = [
  'Noordbank',
  'Bank Meander',
  'Delta Spaarbank',
  'Kanaalbank',
  'Havenbank Rotterdam',
  'Zuiderbank',
  'Bank Laurier',
  'Vestingbank',
  'IJsselbank',
  'Grenzlandbank',
  'Banque Ardenne',
  'Lindenbank',
  'Bank Tulp',
  'Coöperatieve Bank Twente',
];

const POINTS_OF_SALE = [
  'Kassaflow',
  'Tilbox',
  'Bonnetje',
  'Ladenkasse',
  'Klink POS',
  'Toonbank',
  'Kassa Zes',
  'Comptoir',
];

type Story = {
  quote: string;
  name: string;
  shop: string;
  place: string;
  since: string;
};

const STORIES: Story[] = [
  {
    quote: 'I used to do the books on Sunday night with a bottle of wine and a bad mood. Now I do them at the till while the last customer finds her card.',
    name: 'Marieke de Bruin',
    shop: 'Bakkerij De Bruin',
    place: 'Zwolle',
    since: 'On the ledger since 2023',
  },
  {
    quote: 'The card settlements were the thing. Eleven days of sales in one bank line, and I never knew which days. It knows. That alone was worth the nineteen euros.',
    name: 'Tomasz Wierzbicki',
    shop: 'Fietsen Wierzbicki',
    place: 'Nijmegen',
    since: 'On the ledger since 2024',
  },
  {
    quote: 'My accountant logged in, looked around for ten minutes, and cut his fee. I have told him he is not allowed to leave.',
    name: 'Anneliese Kranz',
    shop: 'Buchhandlung Kranz',
    place: 'Aachen',
    since: 'On the ledger since 2022',
  },
];

type Faq = {
  q: string;
  a: string;
};

const FAQ: Faq[] = [
  {
    q: 'Which countries does the VAT return work for?',
    a: 'The Netherlands, Belgium, Germany and Austria today, with the forms for each filed through the official portal. France is on the roadmap for the first quarter of 2027, and we say so on the pricing page rather than in a footnote.',
  },
  {
    q: 'What if my point of sale is not on the list?',
    a: 'Most tills can export a daily CSV, and the ledger reads eleven common layouts. Email it to your shop address on the ledger and it lands as if it had synced. If yours is a layout we have not seen, send one and we will add it within the week.',
  },
  {
    q: 'Can my accountant keep using their own software?',
    a: 'Yes. The ledger exports the standard audit file for each country and a plain general ledger CSV. Most accountants use the login instead once they have seen it, but nothing forces them to.',
  },
  {
    q: 'Is there a contract?',
    a: 'No. You pay monthly and you cancel from the settings page, not from a phone call. Your data stays readable for twelve months after you leave and can be exported at any time before that.',
  },
  {
    q: 'What happens to my receipts if I leave?',
    a: 'You get a single archive with every picture, the extracted figures, and an index by month. The retention rules are yours to keep after that, and the archive is laid out so that a person can.',
  },
  {
    q: 'Do you sell my data to anyone?',
    a: 'No. We charge for the software so we do not have to. The bank connections are read-only, the feeds are held in a data centre in Amsterdam, and the privacy page says exactly which three subprocessors we use.',
  },
];

type FootColumn = {
  head: string;
  links: [string, string][];
};

const FOOT_COLUMNS: FootColumn[] = [
  { head: 'Product', links: [['Features', '#features'], ['Pricing', '#pricing'], ['Integrations', '#integrations'], ['What is new', '#top']] },
  { head: 'Company', links: [['Stories', '#stories'], ['Working here', '#top'], ['Press', '#top'], ['Contact', '#start']] },
  { head: 'Legal', links: [['Terms', '#top'], ['Privacy', '#top'], ['Subprocessors', '#top'], ['Status', '#top']] },
];

export default function TidyLedgerPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#fbfaff',
        '--ink': '#1b1a2e',
        '--violet': '#6d5df5',
        '--mint': '#2ed3a5',
        '--grey': '#7d7a94',
        '--pale': '#eceafb',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,violet,mint,grey,pale"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          <span className={s.markDot} aria-hidden="true" />
          <span data-edit="bar.text" data-edit-max="60">Tidy Ledger</span>
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <div className={s.barActions}>
          <a data-edit="bar.barLink" data-edit-max="28" className={s.barLink} href="#top">Sign in</a>
          <a data-edit="bar.pill" data-edit-max="28" className={s.pill} href="#start">Start free</a>
        </div>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,5,2,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={sound}
              palette={['transparent', PALE, VIOLET, MINT]}
              fit="grid"
              cellSize={120}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Bookkeeping for shops with one till</p>
            <h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
              Your till, your bank and
              <br />
              your VAT return,
              <br />
              <em>finally in one place.</em>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Tidy Ledger reads the day from your point of sale and your bank,
              matches them up, and leaves you a short list to look at with the
              shutters half down. Two minutes, most evenings.
            </p>
            <div className={s.heroActions}>
              <a data-edit="hero.pillLarge" data-edit-max="28" className={s.pillLarge} href="#start">Start 30 days free</a>
              <a data-edit="hero.ghost" data-edit-max="28" className={s.ghost} href="#pricing">See pricing</a>
            </div>
            <p data-edit="hero.heroNote" data-edit-max="240" data-edit-multiline className={s.heroNote}>No card needed. Cancel from the settings page, not from a phone call.</p>
          </div>
          <dl className={s.stats}>
            {STATS.map(([v, k], i) => (
              <div key={k}>
                <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* -------------------------------------------------------- FEATURES */}
        <section id="features" className={s.features} aria-labelledby="features-h">
          <div className={s.secHead}>
            <p data-edit="features.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>Features</p>
            <h2 data-edit="features.title" data-edit-max="60" id="features-h">Six things it does, and does every day</h2>
            <p data-edit="features.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              There is no dashboard with forty widgets. There is the day, the
              quarter, and the things that went wrong in between.
            </p>
          </div>
          <ul className={s.featureGrid}>
            {FEATURES.map((f, i) => (
              <li key={f.icon} className={s.card}>
                <span className={`${s.ico} ${s[f.icon]}`} aria-hidden="true" />
                <h3 data-edit={`features.title2.${i}`} data-edit-max="40">{f.title}</h3>
                <p data-edit={`features.body.${i}`} data-edit-max="240" data-edit-multiline>{f.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------------- HOW */}
        <section id="how" className={s.how} aria-labelledby="how-h">
          <div className={s.secHead}>
            <p data-edit="how.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>How it works</p>
            <h2 data-edit="how.title" data-edit-max="60" id="how-h">Set up once, then it is Tuesday</h2>
          </div>
          <ol className={s.steps}>
            {STEPS.map((st, i) => (
              <li key={st.n}>
                <span data-edit={`how.stepNo.${i}`} data-edit-max="60" className={s.stepNo}>{st.n}</span>
                <h3 data-edit={`how.title2.${i}`} data-edit-max="40">{st.title}</h3>
                <p data-edit={`how.body.${i}`} data-edit-max="240" data-edit-multiline>{st.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------------- PRICING */}
        <section id="pricing" className={s.pricing} aria-labelledby="pricing-h">
          <div className={s.secHead}>
            <p data-edit="pricing.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>Pricing</p>
            <h2 data-edit="pricing.title" data-edit-max="60" id="pricing-h">Three plans, priced like a shop would price them</h2>
            <p data-edit="pricing.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Every plan starts with thirty days free and every plan includes
              the VAT return. The difference is how many tills and how many
              doors.
            </p>
          </div>
          <div className={s.tiers}>
            {TIERS.map((t, i) => (
              <article key={t.name} className={t.featured ? `${s.tier} ${s.tierFeatured}` : s.tier}>
                <p data-edit={`tier.tierName.${i}`} data-edit-max="240" data-edit-multiline className={s.tierName}>{t.name}</p>
                <p data-edit={`tier.tierPrice.${i}`} data-edit-max="240" data-edit-multiline className={s.tierPrice}>{t.price}</p>
                <p data-edit={`tier.tierPer.${i}`} data-edit-max="240" data-edit-multiline className={s.tierPer}>{t.per}</p>
                <p data-edit={`tier.tierBlurb.${i}`} data-edit-max="240" data-edit-multiline className={s.tierBlurb}>{t.blurb}</p>
                <ul className={s.tierList}>
                  {t.includes.map((line, j) => (
                    <li data-edit={`tier.item.${i}.${j}`} data-edit-max="80" key={line}>{line}</li>
                  ))}
                </ul>
                <a data-edit={`tier.pill.${i}`} data-edit-max="28" className={t.featured ? s.pill : s.pillOutline} href="#start">{t.cta}</a>
              </article>
            ))}
          </div>
          <p data-edit="pricing.pricingNote" data-edit-max="240" data-edit-multiline className={s.pricingNote}>
            Prices exclude VAT and are billed monthly. A shop that closes for
            the season can pause for up to four months a year and keep its
            books readable while it does.
          </p>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <section className={s.band} aria-hidden="true">
          <div data-edit-pattern="band.field" data-edit-roles="transparent,2,3,1" className={s.bandField}>
            <TabbiedPattern
              pattern={fadedwedge}
              palette={['transparent', VIOLET, MINT, INK]}
              fit="grid"
              cellSize={96}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------- INTEGRATIONS */}
        <section id="integrations" className={s.integrations} aria-labelledby="integrations-h">
          <div className={s.secHead}>
            <p data-edit="integrations.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>Integrations</p>
            <h2 data-edit="integrations.title" data-edit-max="60" id="integrations-h">Fourteen banks, eight tills, one ledger</h2>
            <p data-edit="integrations.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              A connection is either on this list or it is not. We do not say
              coming soon about things that are not in the build.
            </p>
          </div>
          <div className={s.intGrid}>
            <div className={s.intCol}>
              <h3 data-edit="integrations.title2" data-edit-max="40">Banks</h3>
              <ul className={s.chips}>
                {BANKS.map((b, i) => (
                  <li data-edit={`integrations.item.${i}`} data-edit-max="80" key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className={s.intCol}>
              <h3 data-edit="integrations.title3" data-edit-max="40">Points of sale</h3>
              <ul className={s.chips}>
                {POINTS_OF_SALE.map((p, i) => (
                  <li data-edit={`integrations.item2.${i}`} data-edit-max="80" key={p}>{p}</li>
                ))}
              </ul>
              <p data-edit="integrations.intNote" data-edit-max="240" data-edit-multiline className={s.intNote}>
                Anything else can email a daily CSV to its shop address on the
                ledger. Eleven layouts are read on arrival.
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- STORIES */}
        <section id="stories" className={s.stories} aria-labelledby="stories-h">
          <div className={s.secHead}>
            <p data-edit="stories.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>Stories</p>
            <h2 data-edit="stories.title" data-edit-max="60" id="stories-h">Three shops, three Sunday nights back</h2>
          </div>
          <div className={s.storyGrid}>
            {STORIES.map((st, i) => (
              <article key={st.name} className={s.story}>
                {/* A pattern tile stands in for the portrait. */}
                <div data-edit-pattern={`story.field.${i}`} data-edit-roles="transparent,5,2" className={s.storyTile} aria-hidden="true">
                  <TabbiedPattern
                    pattern={lucarne}
                    palette={['transparent', PALE, VIOLET]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={6200 + i * 300}
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
                <blockquote>
                  <p data-edit={`story.body.${i}`} data-edit-max="240" data-edit-multiline>{st.quote}</p>
                </blockquote>
                <p data-edit={`story.storyName.${i}`} data-edit-max="240" data-edit-multiline className={s.storyName}>{st.name}</p>
                <p data-edit={`story.storyShop.${i}`} data-edit-max="240" data-edit-multiline className={s.storyShop}>{st.shop}</p>
                <p data-edit={`story.storyMeta.${i}`} data-edit-max="240" data-edit-multiline className={s.storyMeta}>{st.place}</p>
                <p data-edit={`story.storySince.${i}`} data-edit-max="240" data-edit-multiline className={s.storySince}>{st.since}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <div className={s.secHead}>
            <p data-edit="faq.kicker" data-edit-max="240" data-edit-multiline className={s.kicker}>Questions</p>
            <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Six things people ask before they start</h2>
          </div>
          <div className={s.faqList}>
            {FAQ.map((f, i) => (
              <details key={f.q} className={s.faqItem}>
                <summary data-edit={`faq.question.${i}`} data-edit-max="80">{f.q}</summary>
                <p data-edit={`faq.body.${i}`} data-edit-max="240" data-edit-multiline>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------- START */}
        <section id="start" className={s.start} aria-labelledby="start-h">
          <div className={s.startCard}>
            <h2 data-edit="start.title" data-edit-max="60" id="start-h">Start with last month</h2>
            <p data-edit="start.body" data-edit-max="240" data-edit-multiline>
              Connect the till and the bank, and the ledger pulls the previous
              thirty days so the first evening already has something to
              reconcile. Most shops are caught up before the free month is.
            </p>
            <div className={s.heroActions}>
              <a data-edit="start.pillLarge" data-edit-max="28" className={s.pillLarge} href="#top">Create a shop</a>
              <a data-edit="start.ghost" data-edit-max="28" className={s.ghost} href="mailto:hello@tidyledger.example">hello@tidyledger.example</a>
            </div>
            <p data-edit="start.startNote" data-edit-max="240" data-edit-multiline className={s.startNote}>Support answers between 09:00 and 18:00 CET, Monday to Friday, and on Saturdays until 14:00 because that is when shops are open.</p>
          </div>
        </section>
      </main>

      {/* A coda: the hero's pattern again, quietly, with nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,5,3" className={s.codaField}>
          <TabbiedPattern
            pattern={sound}
            palette={['transparent', PALE, MINT]}
            fit="grid"
            cellSize={96}
            redrawInterval={6600}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Tidy Ledger</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Bookkeeping for shops with one till, and for shops with eight.</p>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Tidy Ledger B.V.
              <br />
              Oudegracht 214
              <br />
              3511 NS Utrecht
              <br />
              KvK 00000000
            </p>
          </div>
          {FOOT_COLUMNS.map((col, i) => (
            <div key={col.head} className={s.footCol}>
              <h2 data-edit={`footer.footHead.${i}`} data-edit-max="60" className={s.footHead}>{col.head}</h2>
              <ul className={s.footLinks}>
                {col.links.map(([label, href], j) => (
                  <li key={label}>
                    <a data-edit={`footer.link.${i}.${j}`} data-edit-max="28" href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional bookkeeping product. Prices, banks, tills and shop owners are invented.</p>
          <p>
            Patterns by{' '}
            <a data-edit="footer.link2" data-edit-max="28" href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            , drawn live on a transparent ground and redrawn on a timer.
          </p>
        </div>
      </footer>
    </div>
  );
}
