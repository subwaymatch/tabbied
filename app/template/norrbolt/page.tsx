import { TabbiedPattern } from 'tabbied/react';
import { gesso, jibboom, wedge } from 'tabbied/patterns';
import s from './norrbolt.module.css';

export const metadata = {
  title: 'Norrbolt: Fastener wholesaler, Gothenburg',
  description:
    'Norrbolt is a trade fastener wholesaler on Ringön, Gothenburg. 14,200 lines to ISO and DIN, 96 percent on the shelf, out of the door the same day if you order before four.',
};

/* Near-black ink on light grey paper, safety yellow, two steels. Every field
   takes `transparent` in the background slot so the pattern sits in the page
   colour like a stencil sprayed on the floor, not a picture hung on the wall. */
const INK = '#15171A';
const YELLOW = '#FFC300';
const GREY = '#6F7378';
const STEEL = '#A9AEB4';

const NAV = [
  ['Catalogue', '#catalogue'],
  ['Standards', '#standards'],
  ['Stock', '#stock'],
  ['Delivery', '#delivery'],
  ['Account', '#account'],
  ['Depot', '#depot'],
];

const FIGURES = [
  ['14 200', 'Lines in the catalogue'],
  ['96%', 'On the shelf today'],
  ['16.00', 'Cut-off for same-day'],
  ['1979', 'Trading since'],
];

type Part = {
  no: string;
  desc: string;
  thread: string;
  material: string;
  pack: string;
  price: string;
};

const CATALOGUE: Part[] = [
  { no: '4014-M10-060', desc: 'Hex bolt, partial thread, ISO 4014', thread: 'M10 x 60', material: 'Steel 8.8, zinc', pack: '100', price: '312.00' },
  { no: '4017-M08-025', desc: 'Hex set screw, full thread, ISO 4017', thread: 'M8 x 25', material: 'Steel 8.8, zinc', pack: '200', price: '248.00' },
  { no: '4762-M06-020', desc: 'Socket head cap screw, ISO 4762', thread: 'M6 x 20', material: 'Steel 12.9, black', pack: '200', price: '186.00' },
  { no: '4762-M12-050-A4', desc: 'Socket head cap screw, ISO 4762', thread: 'M12 x 50', material: 'Stainless A4-80', pack: '50', price: '745.00' },
  { no: '4032-M10', desc: 'Hex nut, ISO 4032', thread: 'M10', material: 'Steel 8, zinc', pack: '500', price: '265.00' },
  { no: '6923-M12', desc: 'Flange nut, serrated, DIN 6923', thread: 'M12', material: 'Steel 10, zinc flake', pack: '200', price: '398.00' },
  { no: '7089-M10', desc: 'Flat washer, ISO 7089', thread: 'M10, 10.5 x 20', material: 'Steel 200 HV, zinc', pack: '1000', price: '172.00' },
  { no: '0127-M12', desc: 'Spring lock washer, DIN 127 B', thread: 'M12', material: 'Spring steel, zinc', pack: '500', price: '134.00' },
  { no: '7380-M05-012-A2', desc: 'Button head socket screw, ISO 7380', thread: 'M5 x 12', material: 'Stainless A2-70', pack: '500', price: '289.00' },
  { no: '4026-M06-008', desc: 'Set screw, flat point, ISO 4026', thread: 'M6 x 8', material: 'Steel 45H, black', pack: '500', price: '118.00' },
];

const COLUMNS = ['Part no.', 'Description', 'Thread', 'Material', 'Pack', 'SEK / pack'];

type Standard = {
  iso: string;
  din: string;
  what: string;
  range: string;
};

const STANDARDS: Standard[] = [
  { iso: 'ISO 4014', din: 'DIN 931', what: 'Hex head bolts, partial thread', range: 'M5 to M36' },
  { iso: 'ISO 4017', din: 'DIN 933', what: 'Hex head screws, full thread', range: 'M3 to M30' },
  { iso: 'ISO 4762', din: 'DIN 912', what: 'Socket head cap screws', range: 'M2 to M24' },
  { iso: 'ISO 7380', din: 'none', what: 'Button head socket screws', range: 'M3 to M12' },
  { iso: 'ISO 10642', din: 'DIN 7991', what: 'Countersunk socket screws', range: 'M3 to M20' },
  { iso: 'ISO 4026', din: 'DIN 913', what: 'Set screws, flat point', range: 'M3 to M16' },
  { iso: 'ISO 4032', din: 'DIN 934', what: 'Hex nuts', range: 'M3 to M36' },
  { iso: 'ISO 7089', din: 'DIN 125', what: 'Flat washers, normal series', range: 'M3 to M36' },
  { iso: 'none', din: 'DIN 127', what: 'Spring lock washers', range: 'M3 to M30' },
  { iso: 'none', din: 'DIN 6923', what: 'Flange nuts, serrated', range: 'M5 to M16' },
];

const CLASSES = ['8.8', '10.9', '12.9', 'A2-70', 'A4-80'];

type StockBand = {
  band: string;
  name: string;
  share: string;
  lead: string;
  body: string;
};

const STOCK: StockBand[] = [
  { band: 'A', name: 'Shelf stock', share: '96% of lines', lead: 'Same day', body: 'Picked from the Ringön racks. Ordered before 16.00, it is on a van or a pallet the same afternoon.' },
  { band: 'B', name: 'Swedish supply', share: '3% of lines', lead: '2 to 4 working days', body: 'Held by a mill or distributor inside Sweden. We order daily at 11.00 and it comes to us first.' },
  { band: 'C', name: 'European mill', share: '1% of lines', lead: '2 to 3 weeks', body: 'Large diameters, long lengths and odd materials. Quoted with a date, and the date is kept.' },
  { band: 'M', name: 'Made to order', share: 'Not stocked', lead: '4 to 8 weeks', body: 'Special threads, coatings or drawings. Minimum 500 pieces, or 50 above M24. Drawing in, price out in two days.' },
];

const BINS = [
  ['Hex bolts and screws', '3 640'],
  ['Socket screws', '2 910'],
  ['Nuts', '1 870'],
  ['Washers', '1 420'],
  ['Threaded rod and studs', '640'],
  ['Anchors and fixings', '1 980'],
  ['Rivets and inserts', '880'],
  ['Tools and bits', '860'],
];

type Zone = {
  zone: string;
  area: string;
  how: string;
  when: string;
  cost: string;
};

const ZONES: Zone[] = [
  { zone: '1', area: 'Göteborg city, Hisingen, Mölndal', how: 'Own van, two runs a day', when: 'Same day, ordered before 16.00', cost: 'Free over 1 500 SEK, else 85' },
  { zone: '2', area: 'Rest of Västra Götaland', how: 'Carrier, parcel or pallet', when: 'Next working day', cost: '95 parcel, 395 pallet' },
  { zone: '3', area: 'Rest of Sweden', how: 'Carrier, parcel or pallet', when: '1 to 2 working days', cost: '145 parcel, 495 pallet' },
  { zone: '4', area: 'Norway, Denmark, Finland', how: 'Carrier, export documents by us', when: '2 to 4 working days', cost: 'Quoted per consignment' },
];

const TERMS = [
  ['Payment', '30 days net from invoice date, after a credit check that takes a day'],
  ['Statements', 'Monthly, by e-mail, on the first working day'],
  ['Rebate', '2% on months over 25 000 SEK, 4% over 75 000, credited quarterly'],
  ['Prices', 'Ex VAT, per pack, valid to 31 December 2026'],
  ['Returns', 'Unopened packs within 30 days, less 15% restocking, own carriage'],
  ['Counter', 'Cash and card sales without an account, any quantity, no minimum'],
];

const HOURS = [
  ['Monday to Friday', '06.30 to 16.30'],
  ['Saturday', '08.00 to 12.00'],
  ['Sunday', 'Closed'],
  ['Goods in', 'Weekdays 07.00 to 14.00, dock 3'],
];

export default function NorrboltPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--paper': '#f1f1ee',
        '--ink': '#15171a',
        '--yellow': '#ffc300',
        '--grey': '#6f7378',
        '--steel': '#a9aeb4',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="paper,ink,yellow,grey,steel"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.mark" data-edit-max="28" className={s.mark} href="#top">Norrbolt</a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([label, href], i) => (
            <a data-edit={`bar.link.${i}`} data-edit-max="28" key={href} href={href}>{label}</a>
          ))}
        </nav>
        <span data-edit="bar.barStamp" data-edit-max="60" className={s.barStamp}>Trade only</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO
            Gesso in steel and yellow over the grey, the loudest field on the
            page, fading under the copy so the headline reads on paper. */}
        <section className={s.hero} aria-labelledby="hero-h">
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,4,3,2" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={gesso}
              palette={['transparent', STEEL, GREY, YELLOW]}
              fit="grid"
              cellSize={112}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.stamp" data-edit-max="240" data-edit-multiline className={s.stamp}>Fastener wholesaler, Ringön</p>
            <h1 data-edit="hero.accent" data-edit-format="emphasis" data-edit-max="70" id="hero-h" className={s.heroTitle}>
              Every bolt
              <br />
              in Västsverige
              <br />
              <span className={s.accent}>by four o&apos;clock.</span>
            </h1>
            <p data-edit="hero.heroLede" data-edit-max="240" data-edit-multiline className={s.heroLede}>
              Fourteen thousand lines of bolts, nuts, washers and anchors to
              ISO and DIN, racked in one shed on Ringön. Trade counter, own
              vans, no minimum order, and the catalogue is the price list.
            </p>
            <dl className={s.figures}>
              {FIGURES.map(([v, k], i) => (
                <div key={k}>
                  <dt data-edit={`hero.term.${i}`} data-edit-max="28">{v}</dt>
                  <dd data-edit={`hero.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={s.hazard} aria-hidden="true" />
        </section>

        {/* ------------------------------------------------------- CATALOGUE */}
        <section id="catalogue" className={s.catalogue} aria-labelledby="catalogue-h">
          <div className={s.secHead}>
            <p data-edit="catalogue.stamp" data-edit-max="240" data-edit-multiline className={s.stamp}>Section 01</p>
            <h2 data-edit="catalogue.title" data-edit-max="60" id="catalogue-h">Ten lines from the shelf</h2>
            <p data-edit="catalogue.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              The full catalogue is 412 pages and comes with the account.
              These ten are the fastest moving this quarter. Prices are per
              pack, ex VAT, and the part number is the order.
            </p>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  {COLUMNS.map((c, i) => (
                    <th data-edit={`catalogue.heading.${i}`} key={c} scope="col">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATALOGUE.map((p, i) => (
                  <tr key={p.no}>
                    <td data-edit={`catalogue.partNo.${i}`} className={s.partNo}>{p.no}</td>
                    <td data-edit={`catalogue.partDesc.${i}`} className={s.partDesc}>{p.desc}</td>
                    <td data-edit={`catalogue.num.${i}`} className={s.num}>{p.thread}</td>
                    <td data-edit={`catalogue.cell.${i}`}>{p.material}</td>
                    <td data-edit={`catalogue.num2.${i}`} className={s.num}>{p.pack}</td>
                    <td data-edit={`catalogue.price.${i}`} className={s.price}>{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p data-edit="catalogue.tableNote" data-edit-max="240" data-edit-multiline className={s.tableNote}>
            Zinc is trivalent clear passivate, 5 microns minimum. Black is
            phosphate and oil. Zinc flake is 480 hours salt spray. All of it
            on the certificate that ships with the pack.
          </p>
        </section>

        {/* ------------------------------------------------------------ BAND
            A hazard stripe above, wedge's rolled triangles below, edge to
            edge. Pinned to whole cells so no track lands on a half pixel. */}
        <section className={s.band} aria-hidden="true">
          <div className={s.hazardThin} />
          <div data-edit-pattern="band.field" data-edit-roles="transparent,1,2,4" className={s.bandField}>
            <TabbiedPattern
              pattern={wedge}
              palette={['transparent', INK, YELLOW, STEEL]}
              fit="grid"
              cellSize={96}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------- STANDARDS */}
        <section id="standards" className={s.standards} aria-labelledby="standards-h">
          <div className={s.secHead}>
            <p data-edit="standards.stamp" data-edit-max="240" data-edit-multiline className={s.stamp}>Section 02</p>
            <h2 data-edit="standards.title" data-edit-max="60" id="standards-h">Stocked to the standard, not near it</h2>
            <p data-edit="standards.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
              Every line carries its ISO number and the DIN it replaced, so a
              drawing from 1994 and one from last week order the same part.
              Certificates 3.1 to EN 10204 on request, at no charge.
            </p>
          </div>
          <ul className={s.stdGrid}>
            {STANDARDS.map((st, i) => (
              <li key={`${st.iso}-${st.din}`} className={s.std}>
                <div className={s.stdNos}>
                  <span data-edit={`standards.stdIso.${i}`} data-edit-max="60" className={s.stdIso}>{st.iso}</span>
                  <span data-edit={`standards.stdDin.${i}`} data-edit-max="60" className={s.stdDin}>{st.din}</span>
                </div>
                <h3 data-edit={`standards.title2.${i}`} data-edit-max="40">{st.what}</h3>
                <p data-edit={`standards.body.${i}`} data-edit-max="240" data-edit-multiline>{st.range}</p>
              </li>
            ))}
          </ul>
          <div className={s.classes}>
            <p data-edit="standards.classesLabel" data-edit-max="240" data-edit-multiline className={s.classesLabel}>Property classes held</p>
            <ul className={s.classList}>
              {CLASSES.map((c, i) => (
                <li data-edit={`standards.item.${i}`} data-edit-max="80" key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------------- STOCK */}
        <section id="stock" className={s.stock} aria-labelledby="stock-h">
          <div className={s.stockInner}>
            <div className={s.secHead}>
              <p data-edit="stock.stamp" data-edit-max="240" data-edit-multiline className={s.stamp}>Section 03</p>
              <h2 data-edit="stock.title" data-edit-max="60" id="stock-h">Stock bands and lead times</h2>
              <p data-edit="stock.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                Every line in the catalogue is marked A, B, C or M. The letter
                tells you where it is and how long it takes, and the website
                and the counter read from the same count.
              </p>
            </div>
            <ol className={s.bands}>
              {STOCK.map((b, i) => (
                <li key={b.band}>
                  <span data-edit={`stock.bandLetter.${i}`} data-edit-max="60" className={s.bandLetter}>{b.band}</span>
                  <div className={s.bandBody}>
                    <h3 data-edit={`stock.title2.${i}`} data-edit-max="40">{b.name}</h3>
                    <p data-edit={`stock.bandMeta.${i}`} data-edit-max="240" data-edit-multiline className={s.bandMeta}>{b.share}</p>
                    <p data-edit={`stock.bandLead.${i}`} data-edit-max="240" data-edit-multiline className={s.bandLead}>{b.lead}</p>
                    <p data-edit={`stock.bandText.${i}`} data-edit-max="240" data-edit-multiline className={s.bandText}>{b.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={s.bins}>
              <p data-edit="stock.binsLabel" data-edit-max="240" data-edit-multiline className={s.binsLabel}>Lines on the shelf, by rack, counted Monday</p>
              <dl className={s.binList}>
                {BINS.map(([k, v], i) => (
                  <div key={k}>
                    <dt data-edit={`stock.term.${i}`} data-edit-max="28">{k}</dt>
                    <dd data-edit={`stock.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- DELIVERY
            Gesso again, far back and washed with paper, so the zone table
            reads over a hint of the same texture as the hero. */}
        <section id="delivery" className={s.delivery} aria-labelledby="delivery-h">
          <div data-edit-pattern="delivery.field" data-edit-roles="transparent,4,3" className={s.deliveryField} aria-hidden="true">
            <TabbiedPattern
              pattern={gesso}
              palette={['transparent', STEEL, GREY]}
              fit="grid"
              cellSize={128}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.deliveryInner}>
            <div className={s.secHead}>
              <p data-edit="delivery.stamp" data-edit-max="240" data-edit-multiline className={s.stamp}>Section 04</p>
              <h2 data-edit="delivery.title" data-edit-max="60" id="delivery-h">Four zones, two vans, one cut-off</h2>
              <p data-edit="delivery.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                The vans leave at 11.00 and 16.15. Anything for zone 1 that is
                picked before the second run goes on it. Everything else is
                with the carrier by 17.00 the same day.
              </p>
            </div>
            <ol className={s.zones}>
              {ZONES.map((z, i) => (
                <li key={z.zone}>
                  <span data-edit={`delivery.zoneNo.${i}`} data-edit-max="60" className={s.zoneNo}>{z.zone}</span>
                  <h3 data-edit={`delivery.zoneArea.${i}`} data-edit-max="40" className={s.zoneArea}>{z.area}</h3>
                  <p data-edit={`delivery.zoneHow.${i}`} data-edit-max="240" data-edit-multiline className={s.zoneHow}>{z.how}</p>
                  <p data-edit={`delivery.zoneWhen.${i}`} data-edit-max="240" data-edit-multiline className={s.zoneWhen}>{z.when}</p>
                  <p data-edit={`delivery.zoneCost.${i}`} data-edit-max="240" data-edit-multiline className={s.zoneCost}>{z.cost}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --------------------------------------------------------- ACCOUNT */}
        <section id="account" className={s.account} aria-labelledby="account-h">
          <div className={s.accountGrid}>
            <div>
              <p data-edit="account.stamp" data-edit-max="240" data-edit-multiline className={s.stamp}>Section 05</p>
              <h2 data-edit="account.title" data-edit-max="60" id="account-h">Trade account terms</h2>
              <p data-edit="account.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                An account takes one form and one day. It gets you thirty days,
                the printed catalogue, the rebate, and a name at the counter
                who knows what you usually order.
              </p>
              <a data-edit="account.button" data-edit-max="28" className={s.button} href="mailto:konto@norrbolt.example">Open an account</a>
            </div>
            <dl className={s.terms}>
              {TERMS.map(([k, v], i) => (
                <div key={k}>
                  <dt data-edit={`account.term.${i}`} data-edit-max="28">{k}</dt>
                  <dd data-edit={`account.body.${i}`} data-edit-max="200" data-edit-multiline>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ----------------------------------------------------------- DEPOT */}
        <section id="depot" className={s.depot} aria-labelledby="depot-h">
          <div className={s.depotGrid}>
            <div className={s.depotAddress}>
              <p data-edit="depot.stamp" data-edit-max="240" data-edit-multiline className={s.stamp}>Section 06</p>
              <h2 data-edit="depot.title" data-edit-max="60" id="depot-h">Ringögatan 14</h2>
              <p data-edit="depot.depotLine" data-edit-max="240" data-edit-multiline className={s.depotLine}>417 07 Göteborg</p>
              <p data-edit="depot.secLede" data-edit-max="240" data-edit-multiline className={s.secLede}>
                On Ringön, north bank, between the two boatyards. The trade
                counter is through the yellow door on the right; goods in is
                round the back at dock 3. Parking for vans on the apron.
              </p>
              <dl className={s.contact}>
                <div>
                  <dt data-edit="depot.term" data-edit-max="28">Counter</dt>
                  <dd>
                    <a data-edit="depot.link" data-edit-max="28" href="tel:+4631000000">031 000 000</a>
                  </dd>
                </div>
                <div>
                  <dt data-edit="depot.term2" data-edit-max="28">Orders</dt>
                  <dd>
                    <a data-edit="depot.link2" data-edit-max="28" href="mailto:order@norrbolt.example">order@norrbolt.example</a>
                  </dd>
                </div>
                <div>
                  <dt data-edit="depot.term3" data-edit-max="28">Accounts</dt>
                  <dd>
                    <a data-edit="depot.link3" data-edit-max="28" href="mailto:konto@norrbolt.example">konto@norrbolt.example</a>
                  </dd>
                </div>
              </dl>
            </div>
            <dl className={s.hours}>
              {HOURS.map(([d, h], i) => (
                <div key={d}>
                  <dt data-edit={`depot.term4.${i}`} data-edit-max="28">{d}</dt>
                  <dd data-edit={`depot.body.${i}`} data-edit-max="200" data-edit-multiline>{h}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      {/* A coda: jibboom's paired spars in steel and yellow, the last thing
          before the footer and nothing to read. */}
      <section className={s.coda} aria-hidden="true">
        <div data-edit-pattern="coda.field" data-edit-roles="transparent,4,2,3" className={s.codaField}>
          <TabbiedPattern
            pattern={jibboom}
            palette={['transparent', STEEL, YELLOW, GREY]}
            fit="grid"
            cellSize={104}
            redrawInterval={5200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Norrbolt</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>
              Trade fastener wholesaler, Ringön, Göteborg. Fourteen thousand
              lines to ISO and DIN since 1979.
            </p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>Catalogue</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.catalogue" data-edit-max="28" href="#catalogue">Ten lines</a></li>
              <li><a data-edit="footer.standards" data-edit-max="28" href="#standards">Standards</a></li>
              <li><a data-edit="footer.stock" data-edit-max="28" href="#stock">Stock bands</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Trade</h2>
            <ul className={s.footLinks}>
              <li><a data-edit="footer.delivery" data-edit-max="28" href="#delivery">Delivery zones</a></li>
              <li><a data-edit="footer.account" data-edit-max="28" href="#account">Account terms</a></li>
              <li><a data-edit="footer.depot" data-edit-max="28" href="#depot">The depot</a></li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Depot</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Ringögatan 14
              <br />
              417 07 Göteborg
              <br />
              order@norrbolt.example
              <br />
              031 000 000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>
            Org. nr 556000-0000. VAT SE556000000001. A fictional wholesaler;
            the parts, prices and hours are invented.
          </p>
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
