import { TabbiedPattern } from 'tabbied/react';
import {
  comet, dotwash, flux, ribline, rungs, spraydown, streaking,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './frequenz.module.css';

export const metadata = {
  title: 'Frequenz 94,6: Freies Radio, Graz',
  description:
    'Frequenz 94,6 broadcasts from Graz, twenty-four hours a day, on air since 1979. Ninety-one programmes, all of them made by people who are not paid to.',
};

/* Dark ground, cream type, one amber that stands for the on-air lamp. All
   pattern fields take `transparent` in the background slot. */
const CREAM = '#F2EFE6';
const AMBER = '#FFA200';
const GREY = '#6B6560';
const PANEL = '#1D1A20';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PANEL;


const NOW = { time: '14.00', show: 'Zwischenspiel', host: 'Ruth Padberg', kind: 'New music, no talking over the intro' };

const SCHEDULE = [
  ['06.00', 'Frühwerk', 'Miron Salzer', 'Chamber music and weather'],
  ['09.00', 'Der lange Satz', 'Ivo Brand', 'One piece, in full, uninterrupted'],
  ['12.00', 'Mittagsband', 'Rotating', 'Listener requests, read out badly'],
  ['14.00', 'Zwischenspiel', 'Ruth Padberg', 'New music, no talking over the intro'],
  ['17.00', 'Feierabend', 'Nadia Kovač', 'Whatever got us through the week'],
  ['20.00', 'Nachtstück', 'Emil Weiler', 'Long-form, low volume, four hours'],
  ['00.00', 'Bandmaschine', 'Unattended', 'The archive plays itself until six'],
];

const STRANDS = [
  { n: '01', t: 'Live music, weekly', d: 'A band in the small studio every Thursday since 1984. Two takes, one microphone pair, whatever happens happens.' },
  { n: '02', t: 'The archive', d: 'Eleven thousand hours on tape, digitised at four hours a week by two volunteers who refuse to be thanked in public.' },
  { n: '03', t: 'Open desk', d: 'Anyone can propose a programme. About one in five gets a slot, and the first one is always at three in the morning.' },
  { n: '04', t: 'No advertising', d: 'Funded by 2,140 members at €5 a month. If that number drops below 1,800 we go back to twelve hours a day and say so.' },
];

const NUMBERS = [
  ['94,6', 'MHz, Graz and Umgebung'],
  ['1979', 'On air since'],
  ['91', 'Programmes'],
  ['2 140', 'Members'],
];

export default function FrequenzPage() {
  return (
    <div
      // Colour, declared inline so an edit can override it. The authored
      // defaults stay in the stylesheet as the fallback.
      style={{
        '--dark': '#121014',
        '--cream': '#f2efe6',
        '--amber': '#ffa200',
        '--grey': '#6b6560',
        '--panel': '#1d1a20',
      } as React.CSSProperties}
      data-edit-root="vars"
      data-edit-vars="dark,cream,amber,grey,panel"
      className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <a data-edit="bar.text" data-edit-format="emphasis" data-edit-max="28" className={s.mark} href="#top">
          Frequenz <span>94,6</span>
        </a>
        <nav aria-label="Sections">
          <a data-edit="bar.schedule" data-edit-max="28" href="#schedule">Programm</a>
          <a data-edit="bar.strands" data-edit-max="28" href="#strands">What we do</a>
          <a data-edit="bar.support" data-edit-max="28" href="#support">Support</a>
          <a data-edit="bar.studio" data-edit-max="28" href="#studio">Studio</a>
        </nav>
        <p data-edit="bar.body" data-edit-format="emphasis" data-edit-max="240" data-edit-multiline className={s.onair}>
          <span aria-hidden="true" />
          On air
        </p>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div data-edit-pattern="hero.field" data-edit-roles="transparent,2,3" className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={flux}
              palette={['transparent', AMBER, GREY]}
              fit="grid"
              cellSize={136}
              redrawInterval={2600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p data-edit="hero.eyebrow" data-edit-max="240" data-edit-multiline className={s.eyebrow}>Freies Radio Graz / seit 1979</p>
            <h1 data-edit="hero.text" data-edit-format="emphasis" data-edit-max="70">
              Twenty-four hours
              <br />
              a day, and nobody
              <br />
              <span>here is paid.</span>
            </h1>
            <div className={s.nowBox}>
              <p data-edit="hero.nowLabel" data-edit-max="240" data-edit-multiline className={s.nowLabel}>On air now</p>
              <p className={s.nowShow}>
                <b>{NOW.time}</b> {NOW.show}
              </p>
              <p className={s.nowMeta}>
                {NOW.host} · {NOW.kind}
              </p>
            </div>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure editId="photo.frequenz-studio"
            slug="frequenz-studio"
            alt="A radio broadcast studio at night with a microphone on a boom and an amber on-air lamp"
            priority
          />
          <figcaption data-edit="top.caption" data-edit-max="120" data-edit-multiline>Studio 1, 23.48. Nachtstück, hour three.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k], i) => (
            <div key={k}>
              <dt data-edit={`top.term.${i}`} data-edit-max="28">{v}</dt>
              <dd data-edit={`top.body.${i}`} data-edit-max="200" data-edit-multiline>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ------------------------------------------------------ SCHEDULE */}
        <section id="schedule" className={s.schedule} aria-labelledby="schedule-h">
          <h2 data-edit="schedule.h2" data-edit-max="60" className={s.h2} id="schedule-h">
            Today
          </h2>
          <ol className={s.grid}>
            {SCHEDULE.map(([t, show, host, note], i) => (
              <li key={t} className={show === NOW.show ? s.live : undefined}>
                <span data-edit={`schedule.gTime.${i}`} data-edit-max="60" className={s.gTime}>{t}</span>
                <span data-edit={`schedule.gShow.${i}`} data-edit-max="60" className={s.gShow}>{show}</span>
                <span data-edit={`schedule.gHost.${i}`} data-edit-max="60" className={s.gHost}>{host}</span>
                <span data-edit={`schedule.gNote.${i}`} data-edit-max="60" className={s.gNote}>{note}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------- CARRIER BAND */}
        <section className={s.carrier} aria-hidden="true">
          <div data-edit-pattern="carrier.field" data-edit-roles="transparent,2,1,3" className={s.carrierField}>
            <TabbiedPattern
              pattern={ribline}
              palette={['transparent', AMBER, CREAM, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={2200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------- STRANDS */}
        <section id="strands" className={s.strands} aria-labelledby="strands-h">
          <div data-edit-pattern="strands.field" data-edit-roles="transparent,3,2" className={s.strandsField} aria-hidden="true">
            <TabbiedPattern
              pattern={streaking}
              palette={['transparent', GREY, AMBER]}
              fit="grid"
              cellSize={116}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.strandsInner}>
            <h2 data-edit="strands.h2" data-edit-max="60" className={s.h2} id="strands-h">
              Four things we insist on
            </h2>
            <ol className={s.strandList}>
              {STRANDS.map((x, i) => (
                <li key={x.n}>
                  <span data-edit={`strands.stN.${i}`} data-edit-max="60" className={s.stN}>{x.n}</span>
                  <h3 data-edit={`strands.title.${i}`} data-edit-max="40">{x.t}</h3>
                  <p data-edit={`strands.body.${i}`} data-edit-max="240" data-edit-multiline>{x.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure editId="photo.frequenz-archive"
                  slug="frequenz-archive"
                  alt="Shelves of tape reels and record sleeves in a station archive lit by one lamp"
                />
                <figcaption data-edit="strands.caption" data-edit-max="120" data-edit-multiline>The archive. Eleven thousand hours, four a week.</figcaption>
              </figure>
              <figure>
                <Figure editId="photo.frequenz-desk"
                  slug="frequenz-desk"
                  alt="A close view of a broadcast mixing desk with faders and amber meter lamps"
                />
                <figcaption data-edit="strands.caption2" data-edit-max="120" data-edit-multiline>Desk 2. Channel 7 has been crackling since 2011.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- SUPPORT */}
        <section id="support" className={s.support} aria-labelledby="support-h">
          <h2 data-edit="support.h2" data-edit-max="60" className={s.h2} id="support-h">
            Membership
          </h2>
          <div className={s.supGrid}>
            <p data-edit="support.big" data-edit-max="240" data-edit-multiline className={s.big}>
              Five euro a month keeps the transmitter on, the licence paid and
              the coffee tin full. There is no other tier and no premium feed.
            </p>
            <div className={s.supCol}>
              <p data-edit="support.body" data-edit-max="240" data-edit-multiline>
                Members get nothing extra, on purpose. The point of a free radio
                station is that the person who pays and the person who does not
                hear exactly the same thing.
              </p>
              <p data-edit="support.body2" data-edit-max="240" data-edit-multiline>
                Our accounts are posted every January on the noticeboard by the
                door and, since 2016, on this website as a scan of the
                noticeboard.
              </p>
            </div>
          </div>
          <figure className={s.tall}>
            <Figure editId="photo.frequenz-mast"
              slug="frequenz-mast"
              alt="A lattice transmitter mast against a deep dusk sky with a single warning light"
            />
            <figcaption data-edit="support.caption" data-edit-max="120" data-edit-multiline>Schöckl, 1,445 m. 300 W ERP, which is plenty.</figcaption>
          </figure>
        </section>

        {/* -------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.studio} aria-labelledby="studio-h">
          <div data-edit-pattern="studio.field" data-edit-roles="transparent,2,3" className={s.studioField} aria-hidden="true">
            <TabbiedPattern
              pattern={dotwash}
              palette={['transparent', AMBER, GREY]}
              fit="grid"
              cellSize={44}
              redrawInterval={3800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.studioInner}>
            <h2 data-edit="studio.h2" data-edit-max="60" className={s.h2} id="studio-h">
              Come in
            </h2>
            <dl className={s.contact}>
              <div>
                <dt data-edit="studio.term" data-edit-max="28">Studio</dt>
                <dd data-edit="studio.body3" data-edit-max="200" data-edit-multiline>
                  Lendkai 94, Hof
                  <br />
                  8020 Graz
                </dd>
              </div>
              <div>
                <dt data-edit="studio.term2" data-edit-max="28">Write</dt>
                <dd>
                  <a data-edit="studio.link" data-edit-max="28" href="mailto:studio@frequenz946.example">studio@frequenz946.example</a>
                </dd>
              </div>
              <div>
                <dt data-edit="studio.term3" data-edit-max="28">Studio line</dt>
                <dd data-edit="studio.body" data-edit-max="200" data-edit-multiline>+43 316 000 000, open during live shows</dd>
              </div>
              <div>
                <dt data-edit="studio.term4" data-edit-max="28">Open desk</dt>
                <dd data-edit="studio.body2" data-edit-max="200" data-edit-multiline>First Monday of the month, 19.00. Bring an idea.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 data-edit="tiles.title" data-edit-max="60" id="tiles-h">Three rules of the desk</h2>
          <p data-edit="tiles.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>Pinned above the fader panel since 1984 and never once revised.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div data-edit-pattern="tiles.field" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={spraydown}
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
                  <Figure editId="photo.frequenz-tile-mic-cutout" slug="frequenz-tile-mic-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN" data-edit-max="240" data-edit-multiline className={s.tileN}>01</p>
                <h3 data-edit="tiles.title2" data-edit-max="40">Do not talk over the intro</h3>
                <p data-edit="tiles.tileBody" data-edit-max="240" data-edit-multiline className={s.tileBody}>If the piece has a beginning, let it begin. The listener came for the music and can read the time on their own phone.</p>
              </article>
              <article key="02">
                <div data-edit-pattern="tiles.field2" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dotwash}
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
                  <Figure editId="photo.frequenz-tile-cans-cutout" slug="frequenz-tile-cans-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN2" data-edit-max="240" data-edit-multiline className={s.tileN}>02</p>
                <h3 data-edit="tiles.title3" data-edit-max="40">Silence is allowed</h3>
                <p data-edit="tiles.tileBody2" data-edit-max="240" data-edit-multiline className={s.tileBody}>Four seconds of nothing is not dead air. It is four seconds. The transmitter is fine and so is everybody listening.</p>
              </article>
              <article key="03">
                <div data-edit-pattern="tiles.field3" data-edit-roles="transparent,3,4" className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={ribline}
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
                  <Figure editId="photo.frequenz-tile-fader-cutout" slug="frequenz-tile-fader-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p data-edit="tiles.tileN3" data-edit-max="240" data-edit-multiline className={s.tileN}>03</p>
                <h3 data-edit="tiles.title4" data-edit-max="40">Say what it was</h3>
                <p data-edit="tiles.tileBody3" data-edit-max="240" data-edit-multiline className={s.tileBody}>Every track, back-announced, with the label. Somebody is always trying to find it again and we are the only record.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 data-edit="index.title" data-edit-max="60" id="idx-h">Technical</h2>
          <p data-edit="index.secNote" data-edit-max="240" data-edit-multiline className={s.secNote}>What the station runs on. Most of it is older than most of the presenters.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span data-edit="index.text" data-edit-max="60">Item</span>
                <span data-edit="index.text2" data-edit-max="60">Detail</span>
                <span data-edit="index.text3" data-edit-max="60">Since</span>
                <span data-edit="index.text4" data-edit-max="60">State</span>
            </li>
              <li key="Transmitter, Schöckl">
                <span data-edit="index.text5" data-edit-max="60">Transmitter, Schöckl</span>
                <span data-edit="index.text6" data-edit-max="60">300 W ERP, 94.6 MHz</span>
                <span data-edit="index.text7" data-edit-max="60">1979</span>
                <span data-edit="index.text8" data-edit-max="60">Rebuilt 2011</span>
              </li>
              <li key="Studio desk 1">
                <span data-edit="index.text9" data-edit-max="60">Studio desk 1</span>
                <span data-edit="index.text10" data-edit-max="60">Analogue, 24 channel</span>
                <span data-edit="index.text11" data-edit-max="60">1998</span>
                <span data-edit="index.text12" data-edit-max="60">Channel 7 crackles</span>
              </li>
              <li key="Studio desk 2">
                <span data-edit="index.text13" data-edit-max="60">Studio desk 2</span>
                <span data-edit="index.text14" data-edit-max="60">Analogue, 16 channel</span>
                <span data-edit="index.text15" data-edit-max="60">1991</span>
                <span data-edit="index.text16" data-edit-max="60">Spare, and fine</span>
              </li>
              <li key="Playout">
                <span data-edit="index.text17" data-edit-max="60">Playout</span>
                <span data-edit="index.text18" data-edit-max="60">Own software, on Linux</span>
                <span data-edit="index.text19" data-edit-max="60">2007</span>
                <span data-edit="index.text20" data-edit-max="60">Nobody understands it</span>
              </li>
              <li key="Archive, tape">
                <span data-edit="index.text21" data-edit-max="60">Archive, tape</span>
                <span data-edit="index.text22" data-edit-max="60">11 000 hours</span>
                <span data-edit="index.text23" data-edit-max="60">1979</span>
                <span data-edit="index.text24" data-edit-max="60">Digitising, slowly</span>
              </li>
              <li key="Stream">
                <span data-edit="index.text25" data-edit-max="60">Stream</span>
                <span data-edit="index.text26" data-edit-max="60">Ogg and AAC, self hosted</span>
                <span data-edit="index.text27" data-edit-max="60">2004</span>
                <span data-edit="index.text28" data-edit-max="60">Same audio as air</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 data-edit="faq.title" data-edit-max="60" id="faq-h">Getting involved</h2>
          <dl className={s.faqList}>
              <div key="How do I propose a progr">
                <dt data-edit="faq.term" data-edit-max="28">How do I propose a programme?</dt>
                <dd data-edit="faq.body" data-edit-max="200" data-edit-multiline>Come to the open desk on the first Monday of the month with an idea and, ideally, twenty minutes of something you have already made.</dd>
              </div>
              <div key="Will I be paid?">
                <dt data-edit="faq.term2" data-edit-max="28">Will I be paid?</dt>
                <dd data-edit="faq.body2" data-edit-max="200" data-edit-multiline>No. Nobody here is, including the people who have been doing it since the eighties. The membership pays the transmitter and the licence.</dd>
              </div>
              <div key="Do I need experience?">
                <dt data-edit="faq.term3" data-edit-max="28">Do I need experience?</dt>
                <dd data-edit="faq.body3" data-edit-max="200" data-edit-multiline>No. You will be shown the desk twice, then left alone with it at three in the morning, which is how everybody learned.</dd>
              </div>
              <div key="Can I play whatever I wa">
                <dt data-edit="faq.term4" data-edit-max="28">Can I play whatever I want?</dt>
                <dd data-edit="faq.body4" data-edit-max="200" data-edit-multiline>Within the licence, yes. Nobody vets a running order and nobody ever has.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div data-edit-pattern="coda.field" data-edit-roles="transparent,1,3" className={s.codaField}>
            <TabbiedPattern
              pattern={comet}
              palette={['transparent', CREAM, GREY]}
              fit="grid"
              cellSize={114}
              redrawInterval={4998}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p data-edit="footer.footName" data-edit-max="240" data-edit-multiline className={s.footName}>Frequenz 94,6</p>
            <p data-edit="footer.footTag" data-edit-max="240" data-edit-multiline className={s.footTag}>Freies Radio Graz, Lendkai 94, on air since 1979.</p>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead" data-edit-max="60" className={s.footHead}>On air</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.schedule" data-edit-max="28" href="#schedule">Today</a>
              </li>
              <li>
                <a data-edit="footer.strands" data-edit-max="28" href="#strands">What we do</a>
              </li>
              <li>
                <a data-edit="footer.studio" data-edit-max="28" href="#studio">Open desk</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead2" data-edit-max="60" className={s.footHead}>Support</h2>
            <ul className={s.footLinks}>
              <li>
                <a data-edit="footer.support" data-edit-max="28" href="#support">Membership</a>
              </li>
              <li>
                <a data-edit="footer.support2" data-edit-max="28" href="#support">Our accounts</a>
              </li>
              <li>
                <a data-edit="footer.studio2" data-edit-max="28" href="#studio">Come in</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 data-edit="footer.footHead3" data-edit-max="60" className={s.footHead}>Contact</h2>
            <p data-edit="footer.body2" data-edit-max="240" data-edit-multiline className={s.footAddr}>
              Lendkai 94, Hof
              <br />
              8020 Graz
              <br />
              studio@frequenz946.example
              <br />
              +43 316 000 000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p data-edit="footer.body" data-edit-max="240" data-edit-multiline>A fictional radio station. Prices and times are invented.</p>
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
