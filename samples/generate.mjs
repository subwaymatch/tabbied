// Generates ten self-contained static-HTML sample sites into public/samples/.
// Each site uses Tabbied generative artworks as decorative accents (hero, an
// about panel, and a closing band), rendered by the vendored css-doodle build
// and sized/shuffled by samples/assets/tabbied-runtime.js so cells stay square
// (no stretching) and the drawings re-seed over time. Product/card imagery is
// left as image placeholders that carry a GPT Image 2 prompt (palette included)
// ready to generate a raster image and drop in. Run: node samples/generate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Lucide from 'lucide-react';
import { doodle } from './lib/tabbied-embed.mjs';
import { SHOWCASE_CSS } from './lib/showcase-css.mjs';
import { SHOWCASE_CSS_EXTRA } from './lib/showcase-css-extra.mjs';
import { STATIC_SECTIONS } from './lib/static-sections.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Reuse the exact lucide icons the React sites use, rendered to static SVG.
const iconCache = {};
function icon(name) {
  if (!iconCache[name]) {
    const C = Lucide[name] || Lucide.Sparkles;
    iconCache[name] = renderToStaticMarkup(
      React.createElement(C, { width: 24, height: 24, strokeWidth: 1.75 })
    );
  }
  return iconCache[name];
}
const OUT = path.resolve(__dirname, '../public/samples');
fs.mkdirSync(OUT, { recursive: true });

// ---- helpers --------------------------------------------------------------
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function toRgb(hex) {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function mix(a, b, t) {
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  const c = (x, y) => Math.round(x + (y - x) * t);
  return `rgb(${c(ar, br)}, ${c(ag, bg)}, ${c(ab, bb)})`;
}
const onColor = (hex) => (luminance(hex) < 0.55 ? '#ffffff' : '#151515');

function cssVars(site) {
  const c = site.colors;
  const bg = c[0];
  const c1 = c[1] ?? bg;
  const dark = luminance(bg) < 0.5;
  const darkest = [...c].sort((a, b) => luminance(a) - luminance(b))[0];
  const ink = dark ? '#f5f3ef' : luminance(darkest) < 0.4 ? darkest : '#1c1e24';
  return [
    `--bg:${bg}`,
    `--c1:${c1}`,
    `--ink:${ink}`,
    `--onC1:${onColor(c1)}`,
    `--card:${dark ? mix(bg, '#ffffff', 0.07) : mix(bg, '#ffffff', 0.6)}`,
    `--soft:${dark ? mix(bg, '#ffffff', 0.04) : mix(bg, '#ffffff', 0.45)}`,
    `--line:${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
    `--display:${site.fonts.display}`,
    `--body:${site.fonts.body}`,
  ].join(';');
}

const artAt = (site, i) =>
  site.artworks[((i % site.artworks.length) + site.artworks.length) % site.artworks.length];

// A decorative accent: cover-fit (square cells, never stretched) and re-seeding
// over time. The runtime derives the grid from the box and shuffles the seed.
function decor(site, i, cell = 54) {
  const d = doodle({ slug: artAt(site, i), palette: site.colors, cell, reseed: 4200 });
  return `<style>${d.style}</style>${d.element}`;
}

// A raster-image placeholder carrying a GPT Image 2 prompt, with the site
// palette (and background color) appended so a generated image blends in.
function imgCard(prompt, colors) {
  const bg = colors[0];
  const full = `${prompt} Color palette: ${colors.join(', ')}. Use ${bg} as the background so the image blends into the page.`;
  return `<figure class="imgph" data-image-prompt="${esc(full)}"><div class="imgph-in"><span class="imgph-badge">◳ GPT Image 2 prompt</span><p class="imgph-text">${esc(full)}</p><button type="button" class="imgph-copy" data-copy-prompt aria-label="Copy prompt">⧉ Copy prompt</button></div></figure>`;
}

const renderTitle = (t) =>
  t.replace(/\{em\}(.*?)\{\/em\}/g, '<em class="em">$1</em>');

// ---- shared sections ------------------------------------------------------
const navHTML = (site) => `
<nav class="nav">
  <a class="logo" href="#">${site.brand}</a>
  <ul class="navlinks">${site.nav.map((n) => `<li><a href="#">${n}</a></li>`).join('')}</ul>
  <a class="navcta" href="#">${site.primaryCta}</a>
</nav>`;

const statStripHTML = (site) =>
  !site.stats ? '' : `
<div class="stat-strip">${site.stats
    .map((s) => `<div><div class="stat-n">${s.n}</div><div class="stat-l">${s.l}</div></div>`)
    .join('')}</div>`;

const marqueeHTML = (site) =>
  !site.ticker ? '' : `
<div class="marquee"><span>${[...site.ticker, ...site.ticker]
    .map((t) => `${t} <i>✦</i> `)
    .join('')}</span></div>`;

const aboutHTML = (site) => `
<section class="about${site.reverse ? ' rev' : ''}">
  <div class="about-copy">
    <div class="eyebrow">${site.about.eyebrow}</div>
    <h2>${site.about.title}</h2>
    ${site.about.body.map((p) => `<p>${p}</p>`).join('')}
    <ul class="points">${site.about.points.map((pt) => `<li>${pt}</li>`).join('')}</ul>
  </div>
  <div class="about-art">${decor(site, 2, 44)}</div>
</section>`;

const itemsHTML = (site) => `
<section class="section" id="items">
  <div class="section-head"><h2>${site.sectionTitle}</h2><p>${site.sectionSub}</p></div>
  <div class="grid">${site.items
    .map(
      (it) => `
    <article class="card">
      <div class="card-media">${imgCard(site.images[it.seed], site.colors)}</div>
      <div class="card-body">
        <div class="card-eyebrow">${it.eyebrow}</div>
        <h3>${it.title}</h3>
        <div class="card-meta">${it.meta}</div>
      </div>
    </article>`
    )
    .join('')}</div>
</section>`;

const featuresHTML = (site) => `
<section class="features"><div class="feat-grid">${site.features
    .map(
      (f, i) => `
    <div class="feat"><div class="feat-num">${String(i + 1).padStart(2, '0')}</div><h3>${f.title}</h3><p>${f.body}</p></div>`
    )
    .join('')}</div></section>`;

const testiHTML = (site) => `
<section class="section"><div class="testi-grid">${site.testimonials
    .map(
      (t) => `
    <figure class="testi"><blockquote>“${t.quote}”</blockquote><figcaption><span class="q-name">${t.name}</span><span class="q-role">${t.role}</span></figcaption></figure>`
    )
    .join('')}</div></section>`;

const bandHTML = (site) => {
  const i = site.layout === 'editorial' ? 3 : 1;
  return `
<section class="band">
  <div class="abs">${decor(site, i, 58)}</div>
  <div class="band-scrim"></div>
  <div class="band-in"><h2>${site.bandTitle}</h2><a class="btn btn-solid" href="#">${site.bandCta}</a></div>
</section>`;
};

const manifestoHTML = (site) =>
  !site.manifesto ? '' : `
<section class="manifesto">
  <div class="abs" style="opacity:.16">${decor(site, 2, 58)}</div>
  <div class="manifesto-in"><div class="eyebrow">${site.manifesto.kicker}</div><p>${site.manifesto.text}</p></div>
</section>`;

const altRowsHTML = (site) =>
  !site.altRows ? '' : `
<section class="alt-rows">${site.altRows
    .map(
      (r, i) => `
  <div class="alt-row${i % 2 ? ' rev' : ''}">
    <div class="alt-copy"><div class="eyebrow">${r.eyebrow}</div><h3>${r.title}</h3><p>${r.body}</p></div>
    <div class="alt-media">${imgCard(r.image, site.colors)}</div>
  </div>`
    )
    .join('')}</section>`;

const iconFeaturesHTML = (site) =>
  !site.iconFeatures ? '' : `
<section class="icon-feat"><div class="icon-grid">${site.iconFeatures
    .map(
      (f) => `
  <div class="icon-item"><span class="icon-wrap">${icon(f.icon)}</span><h3>${f.title}</h3><p>${f.body}</p></div>`
    )
    .join('')}</div></section>`;

const galleryHTML = (site) =>
  !site.gallery ? '' : `
<section class="gallery"><div class="gallery-grid">${site.gallery
    .map((p) => `<div class="gallery-cell">${imgCard(p, site.colors)}</div>`)
    .join('')}</div></section>`;

const bigQuoteHTML = (site) =>
  !site.bigQuote ? '' : `
<section class="big-quote">
  <div class="abs" style="opacity:.18">${decor(site, 3, 58)}</div>
  <div class="big-quote-scrim"></div>
  <figure class="big-quote-in"><blockquote>“${site.bigQuote.quote}”</blockquote><figcaption>${site.bigQuote.name}, <span>${site.bigQuote.role}</span></figcaption></figure>
</section>`;

const faqHTML = (site) =>
  !site.faq ? '' : `
<section class="section"><div class="faq-head"><h2>Questions</h2></div><div class="faq-list">${site.faq
    .map((f) => `<details class="faq-item"><summary>${f.q}</summary><p>${f.a}</p></details>`)
    .join('')}</div></section>`;

const logosHTML = (site) =>
  !site.logos ? '' : `
<section class="logos"><span class="logos-label">As seen in</span><div class="logos-row">${site.logos
    .map((n) => `<span>${n}</span>`)
    .join('')}</div></section>`;

const statBandHTML = (site) =>
  !site.stats ? '' : `
<section class="stat-band">${site.stats
    .map((s) => `<div><div class="stat-band-n">${s.n}</div><div class="stat-band-l">${s.l}</div></div>`)
    .join('')}</section>`;

const newsletterHTML = (site) => `
<section class="newsletter"><div class="news-in">
  <h2>${site.newsletter.title}</h2>
  <p>${site.newsletter.body}</p>
  <form class="news-form" action="#">
    <input type="email" placeholder="${esc(site.newsletter.placeholder)}" aria-label="Email">
    <button type="submit" class="btn btn-solid">${site.newsletter.cta}</button>
  </form>
</div></section>`;

const footerHTML = (site) => `
<footer class="footer">
  <div class="foot-top">
    <span class="logo">${site.brand}</span>
    <nav class="foot-nav">${site.nav.map((n) => `<a href="#">${n}</a>`).join('')}</nav>
  </div>
  <div class="foot-bottom">
    <span>© 2026 ${site.brand}. All rights reserved.</span>
    <span>${site.artworks.length} Tabbied artworks (${site.artworks.join(' · ')}) via css-doodle, ${site.paletteName} palette.</span>
  </div>
</footer>`;

function renderSection(site, key) {
  switch (key) {
    case 'stats': return statStripHTML(site);
    case 'statBand': return statBandHTML(site);
    case 'about': return aboutHTML(site);
    case 'manifesto': return manifestoHTML(site);
    case 'altRows': return altRowsHTML(site);
    case 'iconFeatures': return iconFeaturesHTML(site);
    case 'items': return itemsHTML(site);
    case 'gallery': return galleryHTML(site);
    case 'features': return featuresHTML(site);
    case 'testimonials': return testiHTML(site);
    case 'bigQuote': return bigQuoteHTML(site);
    case 'faq': return faqHTML(site);
    case 'logos': return logosHTML(site);
    case 'band': return bandHTML(site);
    case 'newsletter': return newsletterHTML(site);
    default: return '';
  }
}

// The tail below each hero: the site's own ordered section list, then footer.
const DEFAULT_SECTIONS = ['stats', 'about', 'items', 'features', 'testimonials', 'band', 'newsletter'];
const tailHTML = (site) =>
  (site.sections || DEFAULT_SECTIONS).map((k) => renderSection(site, k)).join('') +
  footerHTML(site);

// ---- layouts --------------------------------------------------------------
function renderSplit(site) {
  return `${navHTML(site)}
<header class="split-hero${site.reverse ? ' rev' : ''}">
  <div class="split-copy">
    <div class="eyebrow">${site.eyebrow}</div>
    <h1>${renderTitle(site.title)}</h1>
    <p class="lede">${site.lede}</p>
    <div class="cta-row"><a class="btn btn-solid" href="#">${site.primaryCta}</a><a class="btn btn-ghost" href="#">${site.secondaryCta}</a></div>
  </div>
  <div class="split-art">${decor(site, 0, 58)}</div>
</header>
${tailHTML(site)}`;
}

function renderSpotlight(site) {
  return `${navHTML(site)}
<header class="spot-hero">
  <div class="abs">${decor(site, 0, 58)}</div>
  <div class="spot-scrim"></div>
  <div class="spot-in">
    <div class="eyebrow">${site.eyebrow}</div>
    <h1>${renderTitle(site.title)}</h1>
    <p class="lede">${site.lede}</p>
    <div class="cta-row cta-center"><a class="btn btn-solid" href="#">${site.primaryCta}</a><a class="btn btn-ghost" href="#">${site.secondaryCta}</a></div>
  </div>
</header>
${marqueeHTML(site)}
${tailHTML(site)}`;
}

function renderEditorial(site) {
  const lead = site.items[0];
  return `
<div class="ed-mast"><span>Vol. IV · No. 12</span><a class="navcta" href="#">${site.primaryCta}</a></div>
<div class="ed-title"><h1>${site.brand}</h1><p class="lede">${site.lede}</p></div>
<nav class="ed-nav">${site.nav.map((n) => `<a href="#">${n}</a>`).join('')}</nav>
<div class="ed-cover">${decor(site, 0, 58)}<div class="ed-cap"><div class="k">${lead.eyebrow}</div><h2>${lead.title}</h2></div></div>
${tailHTML(site)}`;
}

function renderBoutique(site) {
  return `${navHTML(site)}
<header class="bout-hero">
  <div class="abs">${decor(site, 0, 58)}</div>
  <div class="bout-scrim"></div>
  <div class="bout-in">
    <div class="eyebrow">${site.eyebrow}</div>
    <h1>${renderTitle(site.title)}</h1>
    <p class="lede">${site.lede}</p>
    <a class="bout-btn" href="#">${site.primaryCta}</a>
  </div>
</header>
${tailHTML(site)}`;
}

const LAYOUTS = {
  split: renderSplit,
  spotlight: renderSpotlight,
  editorial: renderEditorial,
  boutique: renderBoutique,
};

function render(site) {
  const body = LAYOUTS[site.layout](site);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(site.brand)} · ${esc(site.topic)}</title>
<meta name="description" content="${esc(site.lede)}" />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${site.favicon}</text></svg>" />
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${site.fonts.href}" rel="stylesheet">
<script src="../assets/css-doodle.min.js"></script>
<script src="../assets/tabbied-runtime.js" defer></script>
<style>
html{scroll-behavior:smooth}
body{margin:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
${SHOWCASE_CSS}${SHOWCASE_CSS_EXTRA}
</style>
</head>
<body>
<div class="site kit-${site.kit || 'soft'}" style="${cssVars(site)}">
${body}
</div>
</body>
</html>`;
}

// ---- site data ------------------------------------------------------------
const gf = (f) => `https://fonts.googleapis.com/css2?${f}&display=swap`;
const FONT = {
  sora: { href: gf('family=Space+Grotesk:wght@400;500;700&family=Sora:wght@600;800'), display: "'Sora', system-ui, sans-serif", body: "'Space Grotesk', system-ui, sans-serif" },
  fraunces: { href: gf('family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Inter:wght@400;500'), display: "'Fraunces', Georgia, serif", body: "'Inter', system-ui, sans-serif" },
  manrope: { href: gf('family=Manrope:wght@400;500;600;800'), display: "'Manrope', system-ui, sans-serif", body: "'Manrope', system-ui, sans-serif" },
  dmserif: { href: gf('family=DM+Serif+Display&family=DM+Sans:wght@400;500;700'), display: "'DM Serif Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif" },
  archivo: { href: gf('family=Archivo:wght@400;600;800;900&family=Newsreader:ital,opsz@0,6..72;1,6..72'), display: "'Archivo', system-ui, sans-serif", body: "'Newsreader', Georgia, serif" },
  baloo: { href: gf('family=Baloo+2:wght@500;600;800&family=Nunito+Sans:wght@400;600;700'), display: "'Baloo 2', system-ui, sans-serif", body: "'Nunito Sans', system-ui, sans-serif" },
  cormorant: { href: gf('family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500'), display: "'Cormorant Garamond', Georgia, serif", body: "'Jost', system-ui, sans-serif" },
  spectral: { href: gf('family=Spectral:ital,wght@0,300;0,400;0,600;1,400&family=Outfit:wght@300;400;500;600'), display: "'Spectral', Georgia, serif", body: "'Outfit', system-ui, sans-serif" },
  chivo: { href: gf('family=Chivo:wght@400;700;900&family=Space+Grotesk:wght@400;500;700'), display: "'Chivo', system-ui, sans-serif", body: "'Space Grotesk', system-ui, sans-serif" },
  playfair: { href: gf('family=Playfair+Display:wght@500;600;800&family=Work+Sans:wght@400;500;600'), display: "'Playfair Display', Georgia, serif", body: "'Work Sans', system-ui, sans-serif" },
};

const IMG = 'Soft natural studio light, shallow depth of field, high detail, no text or logos.';

const SITES = [
  // 01 Aurora Sound
  {
    dir: '01-aurora-sound', brand: 'Aurora Sound', topic: 'Electronic music label', favicon: '🎧',
    paletteName: 'Neon', colors: ['#0d0d12', '#3fffb2', '#3eecff', '#ff3d8b'], layout: 'spotlight', fonts: FONT.sora,
    artworks: ['plasma', 'spectrum', 'prisma', 'bokeh'],
    nav: ['Releases', 'Artists', 'Events', 'About'], primaryCta: 'Latest releases', secondaryCta: 'Listen live',
    eyebrow: 'Independent · Est. 2019',
    title: 'Sound for the {em}small hours{/em}.',
    lede: 'An independent label for forward-looking club, ambient, and everything that glows in between. Pressed with love, mixed for midnight.',
    ticker: ['NEW SIGNINGS', 'WAX & DIGITAL', 'DEEP CUTS', 'AFTER HOURS'],
    sectionTitle: 'Recent releases', sectionSub: 'Twelve inches and twelve bits, mastered for the floor and the headphones.',
    items: [
      { eyebrow: 'LP', title: 'Neon Tides', meta: 'KAORU · 2026', seed: 'r1' },
      { eyebrow: 'EP', title: 'Halcyon', meta: 'Vela & Mor · 2026', seed: 'r2' },
      { eyebrow: 'Single', title: 'Afterglow', meta: 'S U N J A · 2025', seed: 'r3' },
    ],
    about: {
      eyebrow: 'The label', title: 'Records made to glow in the dark',
      body: [
        'Aurora Sound is a small crew of producers, cutters, and DJs who care as much about the sleeve as the mix. Every release is mastered twice, once for the club and once for the couch.',
        'We press short runs on coloured wax, ship worldwide, and put the artist first on every split.',
      ],
      points: ['Vinyl and lossless digital', 'Artist-first splits', 'Mastered for club and headphones'],
    },
    features: [
      { title: 'Sign', body: 'We chase sounds, not follower counts, and give new artists room to grow.' },
      { title: 'Press', body: 'Short-run coloured vinyl, cut and sleeved by people who love it.' },
      { title: 'Play', body: 'Label nights and a weekly radio show that keeps the catalogue alive.' },
    ],
    testimonials: [
      { quote: 'The only label whose whole catalogue I buy on sight.', name: 'DJ Verre', role: 'Resident, Basement FM' },
      { quote: 'They treated my first EP like it mattered. It did.', name: 'S U N J A', role: 'Artist' },
    ],
    newsletter: { title: 'Never miss a drop', body: 'New releases, label nights, and the odd unreleased edit, straight to your inbox.', cta: 'Join the list', placeholder: 'you@email.com' },
    bandTitle: 'Turn it up. The next one lands Friday.', bandCta: 'Pre-save the release',
    images: {
      r1: `A moody album cover render of glowing liquid light waves in vivid neon, abstract and futuristic. ${IMG}`,
      r2: `An abstract electronic album cover of soft glowing gradients and grain, calm and dreamy. ${IMG}`,
      r3: `A neon-lit album cover of a single glowing orb over dark water, cinematic and atmospheric. ${IMG}`,
    },
  },

  // 02 Terra Ceramics
  {
    dir: '02-terra-ceramics', brand: 'Terra Ceramics', topic: 'Pottery & ceramics studio', favicon: '🏺',
    paletteName: 'Terracotta', colors: ['#f7ede2', '#c1502e', '#84582c', '#2f3e46'], layout: 'split', fonts: FONT.fraunces,
    artworks: ['pebble', 'bowl', 'lobe', 'quilt'],
    nav: ['Shop', 'Studio', 'Classes', 'Journal'], primaryCta: 'Shop the collection', secondaryCta: 'Book a class',
    eyebrow: 'Small-batch · Thrown by hand',
    title: 'Quiet objects for {em}everyday{/em} rituals.',
    lede: 'Each piece is wheel-thrown, glazed, and fired in our riverside studio. No two exactly alike, all made to be used.',
    stats: [{ n: '1,400°', l: 'Stoneware firing' }, { n: '6 wks', l: 'Kiln to table' }, { n: '100%', l: 'Lead-free glaze' }],
    sectionTitle: 'The Riverstone collection', sectionSub: 'Tableware toned after wet clay and dusk.',
    items: [
      { eyebrow: 'Bowls', title: 'Ripple Bowl', meta: '$48', seed: 'p1' },
      { eyebrow: 'Mugs', title: 'Ember Mug', meta: '$34', seed: 'p2' },
      { eyebrow: 'Vases', title: 'Dune Vase', meta: '$92', seed: 'p3' },
    ],
    about: {
      eyebrow: 'In the studio', title: 'Made slowly, by two pairs of hands',
      body: [
        'We throw every piece on the wheel, trim it the next day, and glaze it by hand before a long firing. The little marks left behind are the point, not a flaw.',
        'Our glazes are mixed in-house from local minerals, so the colours shift with the season and the kiln.',
      ],
      points: ['Wheel-thrown, never moulded', 'Food-safe, lead-free glazes', 'Fired in small batches'],
    },
    features: [
      { title: 'Throw', body: 'Each vessel starts as a ball of local stoneware on the wheel.' },
      { title: 'Glaze', body: 'Hand-dipped in small-batch glazes mixed from mineral oxides.' },
      { title: 'Fire', body: 'A slow stoneware firing sets the colour and makes it last.' },
    ],
    testimonials: [
      { quote: 'My morning coffee has never felt so considered.', name: 'Hana W.', role: 'Customer' },
      { quote: 'You can feel the hand that made it. That is rare now.', name: 'Robin C.', role: 'Regular' },
    ],
    newsletter: { title: 'New drops and open studio', body: 'A gentle note when a fresh batch lands and when class spots open up.', cta: 'Keep in touch', placeholder: 'you@email.com' },
    bandTitle: 'We make things that ask to be picked up.', bandCta: 'Visit the studio',
    images: {
      p1: `A handmade stoneware ripple bowl in warm terracotta glaze on a linen surface, artisanal ceramics. ${IMG}`,
      p2: `A rustic hand-thrown ceramic mug in earthy rust glaze on a wooden table, cozy and tactile. ${IMG}`,
      p3: `A tall matte ceramic vase in dune tones with a single dried stem, minimal studio still life. ${IMG}`,
    },
  },

  // 03 Meridian
  {
    dir: '03-meridian', brand: 'Meridian', topic: 'Payments infrastructure', favicon: '⬡',
    paletteName: 'Cobalt', colors: ['#0a1a3f', '#1e4fd6', '#3eecff', '#eef4ff'], layout: 'split', fonts: FONT.manrope,
    artworks: ['circuit', 'lattice', 'metro', 'windowpane'],
    nav: ['Products', 'Developers', 'Pricing', 'Docs'], primaryCta: 'Start building', secondaryCta: 'Book a demo',
    eyebrow: 'Money movement · API-first',
    title: 'Payments {em}infrastructure{/em} for software that moves money.',
    lede: 'One API for cards, transfers, and ledgers. Ship compliant money movement in days, not quarters.',
    stats: [{ n: '40+', l: 'Currencies' }, { n: '99.99%', l: 'Uptime' }, { n: '3 lines', l: 'To first charge' }],
    sectionTitle: 'Built for the whole lifecycle', sectionSub: 'From the first authorization to reconciliation.',
    items: [
      { eyebrow: 'Ledger', title: 'Unified Ledger', meta: 'Real-time, double-entry', seed: 'm1' },
      { eyebrow: 'Routing', title: 'Adaptive Routing', meta: 'Highest-converting path', seed: 'm2' },
      { eyebrow: 'Risk', title: 'Fraud Signals', meta: 'Scoring on every event', seed: 'm3' },
    ],
    about: {
      eyebrow: 'Why Meridian', title: 'A real ledger under every primitive',
      body: [
        'Most stacks bolt accounting on at the end. Meridian starts with a correct, double-entry ledger and exposes cards, transfers, and payouts on top of it.',
        'That means your balances reconcile in real time, and an audit is a query, not a project.',
      ],
      points: ['Double-entry by default', 'Programmable payouts', 'SOC 2 and PCI ready'],
    },
    features: [
      { title: 'Integrate', body: 'Sandbox keys in a minute, production access after one review call.' },
      { title: 'Route', body: 'Send each transaction down the path most likely to succeed.' },
      { title: 'Reconcile', body: 'Every movement lands in a ledger you can actually query.' },
    ],
    testimonials: [
      { quote: 'We replaced three vendors and a spreadsheet with one API.', name: 'Priya S.', role: 'CTO, Cascade' },
      { quote: 'The ledger alone is worth the switch.', name: 'Owen D.', role: 'Eng lead, Harbor' },
    ],
    newsletter: { title: 'Ship this quarter', body: 'Product updates and the occasional deep dive from the engineering team.', cta: 'Get updates', placeholder: 'you@company.com' },
    bandTitle: 'Go live this quarter.', bandCta: 'Create an account',
    images: {
      m1: `A clean isometric render of a glowing ledger and account graph, cobalt blue fintech data visualization. ${IMG}`,
      m2: `An abstract network routing diagram with bright cyan nodes on deep navy, sleek technical render. ${IMG}`,
      m3: `A minimal fraud-scoring dashboard render with glowing risk gauges, cobalt and cyan UI. ${IMG}`,
    },
  },

  // 04 Verdant
  {
    dir: '04-verdant', brand: 'Verdant', topic: 'Indoor plant shop', favicon: '🌿',
    paletteName: 'Fern', colors: ['#f4faf0', '#2d6a4f', '#95d5b2', '#1b4332'], layout: 'split', fonts: FONT.dmserif,
    artworks: ['foliage', 'frond', 'ivy', 'blossom'], reverse: true,
    nav: ['Shop', 'Care Guides', 'Gifts', 'Studio'], primaryCta: 'Find your plant', secondaryCta: 'Care quiz',
    eyebrow: 'Hand-picked · Delivered potted',
    title: 'Green, made {em}easy{/em}.',
    lede: 'Hand-picked houseplants matched to your light, delivered to your door with everything they need to thrive.',
    stats: [{ n: 'Next-day', l: 'Local delivery' }, { n: '30-day', l: 'Thrive promise' }, { n: '120+', l: 'Varieties' }],
    sectionTitle: 'Easy-care favourites', sectionSub: 'Cut this morning, potted and ready to go.',
    items: [
      { eyebrow: 'Low light', title: 'ZZ Plant', meta: '$32', seed: 'v1' },
      { eyebrow: 'Bright indirect', title: 'Fiddle Fig', meta: '$68', seed: 'v2' },
      { eyebrow: 'Statement', title: 'Bird of Paradise', meta: '$95', seed: 'v3' },
    ],
    about: {
      eyebrow: 'Our promise', title: 'Plants that actually make it',
      body: [
        'We match every plant to your light before it ships, pot it in peat-free soil, and text you a care plan so nothing gets guessed at.',
        'If it struggles in the first month, we replace it. No receipts, no questions.',
      ],
      points: ['Matched to your light', 'Peat-free potting', '30-day thrive guarantee'],
    },
    features: [
      { title: 'Match', body: 'A two-minute quiz points you to plants that suit your space.' },
      { title: 'Deliver', body: 'Potted, watered, and boxed to arrive standing up and happy.' },
      { title: 'Support', body: 'Text a botanist any time your leaves look unsure.' },
    ],
    testimonials: [
      { quote: 'First plants I have ever managed to keep alive.', name: 'Mei L.', role: 'Customer' },
      { quote: 'The care texts are weirdly delightful.', name: 'Sam P.', role: 'Plant parent' },
    ],
    newsletter: { title: 'Grow with us', body: 'Seasonal care tips and first dibs on rare drops, about twice a month.', cta: 'Sign up', placeholder: 'you@email.com' },
    bandTitle: 'Your greenest room is one box away.', bandCta: 'Start the quiz',
    images: {
      v1: `A potted ZZ plant with glossy dark-green leaves in a matte ceramic pot, bright airy interior. ${IMG}`,
      v2: `A tall fiddle-leaf fig in a woven basket by a sunlit window, fresh green houseplant photography. ${IMG}`,
      v3: `A dramatic bird-of-paradise plant with broad leaves against a pale wall, lush and vibrant. ${IMG}`,
    },
  },

  // 05 The Sunday Press
  {
    dir: '05-sunday-press', brand: 'The Sunday Press', topic: 'Ideas, design & culture', favicon: '📰',
    paletteName: 'Bauhaus', colors: ['#f4f1ea', '#d7263d', '#1b6ca8', '#f7b32b', '#232529'], layout: 'editorial', fonts: FONT.archivo,
    artworks: ['bauhaus', 'windowpane', 'domino', 'tetro'],
    nav: ['Design', 'Technology', 'Essays', 'Archive'], primaryCta: 'Subscribe', secondaryCta: 'Read the issue',
    eyebrow: 'Vol. XII',
    title: 'Ideas, design, and the culture around them.',
    lede: 'An independent magazine on design, technology, and the culture around them.',
    sectionTitle: 'In this issue', sectionSub: 'Long reads from the current edition.',
    items: [
      { eyebrow: 'The Feature', title: 'The Return of the Grid', meta: 'By Mara Lindqvist · 14 min', seed: 's1' },
      { eyebrow: 'Technology', title: 'Small Software', meta: 'By Idris Bell · 9 min', seed: 's2' },
      { eyebrow: 'Essays', title: 'In Praise of the Ugly Draft', meta: 'By Nora Vance · 7 min', seed: 's3' },
    ],
    about: {
      eyebrow: 'About the Press', title: 'Slow journalism about fast tools',
      body: [
        'The Sunday Press is a reader-funded magazine that takes design and technology seriously without taking itself too seriously. No ads, no chum, just long reads and clean typography.',
        'We publish one considered issue a month and keep the whole archive open.',
      ],
      points: ['Reader-funded, no ads', 'One issue a month', 'Open archive, forever'],
    },
    features: [
      { title: 'Read', body: 'A monthly issue of essays, interviews, and criticism worth your Sunday.' },
      { title: 'Support', body: 'Subscriptions keep it independent and the archive free.' },
      { title: 'Contribute', body: 'We pay writers fairly and edit them generously.' },
    ],
    testimonials: [
      { quote: 'The only newsletter I read start to finish.', name: 'Dana R.', role: 'Subscriber' },
      { quote: 'Design writing with a spine. Rare and welcome.', name: 'Theo M.', role: 'Reader' },
    ],
    newsletter: { title: 'The Sunday note', body: 'A short dispatch each week with what we are reading and publishing.', cta: 'Subscribe free', placeholder: 'you@email.com' },
    bandTitle: 'Six dollars a month keeps us independent.', bandCta: 'Become a member',
    images: {
      s1: `A bold editorial illustration of an abstract modernist grid in primary colors, Bauhaus poster style. ${IMG}`,
      s2: `A clean flat-lay of a small laptop and notebook on a warm paper desk, minimal editorial photo. ${IMG}`,
      s3: `A geometric collage of overlapping paper shapes in red, blue, and yellow, playful print-style artwork. ${IMG}`,
    },
  },

  // 06 Zest
  {
    dir: '06-zest', brand: 'Zest', topic: 'Bright, fast weeknight cooking', favicon: '🍋',
    paletteName: 'Citrus', colors: ['#fffbe6', '#ff9f1c', '#2ec4b6', '#e71d36'], layout: 'split', fonts: FONT.baloo,
    artworks: ['confetti', 'polka', 'sprinkles', 'spark'],
    nav: ['Recipes', 'Quick', 'Vegetarian', 'Baking'], primaryCta: "Tonight's recipe", secondaryCta: 'Browse all',
    eyebrow: '30 minutes or less',
    title: 'Dinner that {em}actually{/em} gets made.',
    lede: 'Bright, punchy recipes with short lists and shorter cook times, the kind you cook on a Tuesday and brag about on Friday.',
    stats: [{ n: '15 min', l: 'Fastest meals' }, { n: '1 pan', l: 'Less washing up' }, { n: '4.9★', l: 'Reader rating' }],
    sectionTitle: "This week's brightest", sectionSub: 'Fresh from the test kitchen, sorted by speed.',
    items: [
      { eyebrow: '20 min', title: 'Chili-Lime Corn Bowls', meta: '4 servings', seed: 'z1' },
      { eyebrow: '15 min', title: 'Blistered Tomato Orzo', meta: '2 servings', seed: 'z2' },
      { eyebrow: '30 min', title: 'Sesame Crunch Noodles', meta: '4 servings', seed: 'z3' },
    ],
    about: {
      eyebrow: 'How Zest works', title: 'Short lists, big flavour',
      body: [
        'Every recipe is built around a handful of ingredients you can actually find and a cook time that fits a weeknight. We test each one until a tired person can nail it.',
        'No ten-step reductions, no shopping for one obscure thing. Just fast food that tastes like you tried.',
      ],
      points: ['Ten ingredients or fewer', 'One pan where we can', 'Tested by real weeknight cooks'],
    },
    features: [
      { title: 'Pick', body: 'Filter by time, mood, or what is wilting in the fridge.' },
      { title: 'Cook', body: 'Clear steps, big photos, and a timer built into every recipe.' },
      { title: 'Brag', body: 'Snap it, share it, and pretend it took longer than it did.' },
    ],
    testimonials: [
      { quote: 'I cook from Zest four nights a week now.', name: 'Aya T.', role: 'Subscriber' },
      { quote: 'Finally recipes that respect a Tuesday.', name: 'Marco B.', role: 'Home cook' },
    ],
    newsletter: { title: 'Dinner, sorted', body: 'One quick recipe in your inbox every weekday afternoon.', cta: 'Get the box', placeholder: 'you@email.com' },
    bandTitle: "What's for dinner? We already answered that.", bandCta: 'See tonight’s recipe',
    images: {
      z1: `A vibrant chili-lime corn bowl in a colorful bowl, fresh and appetizing overhead food photo. ${IMG}`,
      z2: `A skillet of blistered cherry tomato orzo with basil, bright and saucy weeknight dinner. ${IMG}`,
      z3: `A tangle of sesame crunch noodles with scallions in a bowl, glossy and colorful food photo. ${IMG}`,
    },
  },

  // 07 Nocturne
  {
    dir: '07-nocturne', brand: 'Nocturne', topic: 'Fragrance for the small hours', favicon: '🌙',
    paletteName: 'Amethyst', colors: ['#12071f', '#5a189a', '#9d4edd', '#e0aaff'], layout: 'boutique', fonts: FONT.cormorant,
    artworks: ['veil', 'bokeh', 'lens', 'prisma'],
    nav: ['Collection', 'The House', 'Discovery Set'], primaryCta: 'Discover the collection', secondaryCta: 'Book a consultation',
    eyebrow: 'Eau de Parfum · Extrait',
    title: 'After{em}dark{/em}',
    lede: 'Fragrance composed for the small hours, when the city quiets and scent speaks loudest.',
    sectionTitle: 'The Maison collection', sectionSub: 'Seven hours of night, bottled.',
    items: [
      { eyebrow: 'N° 01', title: 'Velvet Hour', meta: 'iris · suede · black plum', seed: 'n1' },
      { eyebrow: 'N° 02', title: 'Midnight Bloom', meta: 'tuberose · incense · amber', seed: 'n2' },
      { eyebrow: 'N° 03', title: 'Last Train', meta: 'vetiver · smoke · bergamot', seed: 'n3' },
    ],
    about: {
      eyebrow: 'The house', title: 'Composed like music, worn like memory',
      body: [
        'Nocturne is a small perfume house that works the way a composer does: a few notes, held in balance, that unfold over hours. Each scent is built to change as the night goes on.',
        'We bottle in refillable glass and never test on animals.',
      ],
      points: ['Extrait concentrations', 'Refillable glass', 'Never tested on animals'],
    },
    features: [
      { title: 'Compose', body: 'Our perfumer builds each scent around a single central accord.' },
      { title: 'Age', body: 'Every batch rests for weeks before it is ever bottled.' },
      { title: 'Wear', body: 'A discovery set lets you live with three before you commit.' },
    ],
    testimonials: [
      { quote: 'Strangers stop me to ask what I am wearing.', name: 'Camille D.', role: 'Client' },
      { quote: 'It smells like a memory I have not made yet.', name: 'Iris N.', role: 'Client' },
    ],
    newsletter: { title: 'Private previews', body: 'Occasional notes on new compositions and members-only releases.', cta: 'Request an invitation', placeholder: 'you@email.com' },
    bandTitle: 'A perfume is a memory you can wear before it happens.', bandCta: 'Order a discovery set',
    images: {
      n1: `A faceted perfume bottle glowing amethyst on black velvet, luxurious moody product photograph. ${IMG}`,
      n2: `A dark still life of a perfume flacon among night-blooming flowers, deep purple and violet. ${IMG}`,
      n3: `A minimalist perfume bottle backlit in soft violet haze, elegant and cinematic. ${IMG}`,
    },
  },

  // 08 Shoreline
  {
    dir: '08-shoreline', brand: 'Shoreline', topic: 'Coastal architecture studio', favicon: '⛵',
    paletteName: 'Ocean', colors: ['#0b2545', '#8da9c4', '#eef4ed', '#13a8a8'], layout: 'split', fonts: FONT.spectral,
    artworks: ['awning', 'picket', 'sail', 'lattice'],
    nav: ['Work', 'Studio', 'Approach', 'Contact'], primaryCta: 'Start a project', secondaryCta: 'See our work',
    eyebrow: 'Architecture · Est. 2008',
    title: 'Houses that hold the weather and {em}let in the light{/em}.',
    lede: 'We design durable, low-slung homes for the coast. Buildings that weather beautifully and sit lightly on the land.',
    stats: [{ n: '60+', l: 'Completed homes' }, { n: '3', l: 'RIBA awards' }, { n: '18 yrs', l: 'On the coast' }],
    sectionTitle: 'Selected work', sectionSub: 'A decade of coastline, from cabins to civic rooms.',
    items: [
      { eyebrow: 'Whitstable, UK', title: 'Salt House', meta: '2024', seed: 'w1' },
      { eyebrow: 'Cape Cod, US', title: 'Dune Pavilion', meta: '2023', seed: 'w2' },
      { eyebrow: 'Sagres, PT', title: 'Harbour Rooms', meta: '2022', seed: 'w3' },
    ],
    about: {
      eyebrow: 'Our approach', title: 'Build for the wind, plan for the light',
      body: [
        'We start every project by walking the site at different tides and times of day. The building follows from where the light lands and where the weather comes from.',
        'We favour durable, low-maintenance materials that grey gracefully and belong to their coast.',
      ],
      points: ['Site-led, weather-first', 'Materials that age well', 'Low-energy by design'],
    },
    features: [
      { title: 'Listen', body: 'We spend time on the land before we draw a single line.' },
      { title: 'Design', body: 'Low-slung forms that shelter, frame a view, and last.' },
      { title: 'Build', body: 'We stay close through construction so the details survive.' },
    ],
    testimonials: [
      { quote: 'They gave us a house that feels like the coast itself.', name: 'The Aldous family', role: 'Salt House' },
      { quote: 'Calm, rigorous, and a joy to build with.', name: 'J. Reis', role: 'Contractor' },
    ],
    newsletter: { title: 'From the studio', body: 'Occasional notes on new work, talks, and the odd open house.', cta: 'Follow along', placeholder: 'you@email.com' },
    bandTitle: 'Building something by the water?', bandCta: 'Start a conversation',
    images: {
      w1: `A low-slung coastal house in weathered timber against a grey sky, calm architectural photography. ${IMG}`,
      w2: `A minimalist dune pavilion with large glass facing the sea, soft coastal daylight, architecture photo. ${IMG}`,
      w3: `A stone harbourside building with deep window reveals at dusk, serene architectural photograph. ${IMG}`,
    },
  },

  // 09 Pixel Playhouse
  {
    dir: '09-pixel-playhouse', brand: 'Pixel Playhouse', topic: 'Indie game studio', favicon: '🕹️',
    paletteName: 'Vaporwave', colors: ['#2d0a45', '#ff6ad5', '#c774e8', '#94d0ff', '#ad8cff'], layout: 'spotlight', fonts: FONT.chivo,
    artworks: ['tetro', 'maze', 'bloks', 'domino'],
    nav: ['Games', 'Studio', 'Devlog'], primaryCta: 'Play the demo', secondaryCta: 'See our games',
    eyebrow: '▶ Now in early access',
    title: 'Cozy games about {em}small worlds{/em}.',
    lede: 'A tiny studio making colourful, low-stress games you can lose an evening to. No crunch, just vibes.',
    ticker: ['MADE BY 3 FRIENDS', 'NO CRUNCH', 'SOUNDTRACK ON BANDCAMP', 'PLAYHOUSE ARCADE'],
    sectionTitle: 'Our games', sectionSub: 'Little worlds, made with care.',
    items: [
      { eyebrow: 'Out now', title: 'Sunset Suburbia', meta: 'Dusk-only life sim', seed: 'g1' },
      { eyebrow: 'Demo', title: 'Neon Courier', meta: 'Rooftop delivery roguelite', seed: 'g2' },
      { eyebrow: '2027', title: 'Tidepool', meta: 'Build a reef, one creature at a time', seed: 'g3' },
    ],
    about: {
      eyebrow: 'The studio', title: 'Three friends and a shared drive',
      body: [
        'Pixel Playhouse is a three-person studio that makes the kind of games we want to come home to. Warm, weird, and never in a hurry.',
        'We build in the open, post devlogs every Friday, and put the soundtrack up for free.',
      ],
      points: ['Wishlist-friendly demos', 'Free soundtracks', 'Devlogs every Friday'],
    },
    features: [
      { title: 'Play', body: 'Short, cozy sessions that respect your evening.' },
      { title: 'Wishlist', body: 'Every game ships a demo before it asks for a cent.' },
      { title: 'Follow', body: 'Weekly devlogs, wallpapers, and the odd prototype.' },
    ],
    testimonials: [
      { quote: 'The comfort food of video games. I adore it.', name: 'pixelfox', role: 'Player' },
      { quote: 'Wishlisted on sight, refunded never.', name: 'mossy', role: 'Player' },
    ],
    newsletter: { title: 'Join the Playhouse', body: 'Devlogs, wallpapers, and the odd free prototype, about one email a month.', cta: 'Sign up', placeholder: 'you@email.com' },
    bandTitle: 'Come lose an evening in a small world.', bandCta: 'Play the demo',
    images: {
      g1: `A cozy pixel-art town at dusk with glowing streetlights, warm vaporwave pinks and purples, game screenshot. ${IMG}`,
      g2: `A neon rooftop delivery scene in pixel art, night city with pink and blue glow, indie game art. ${IMG}`,
      g3: `A colorful pixel-art coral reef aquarium builder scene, playful pastel vaporwave palette. ${IMG}`,
    },
  },

  // 10 Roast & Co
  {
    dir: '10-roast-and-co', brand: 'Roast & Co', topic: 'Specialty coffee roasters', favicon: '☕',
    paletteName: 'Espresso', colors: ['#efebe4', '#6f4e37', '#3b2417', '#c9a66b'], layout: 'split', fonts: FONT.playfair,
    artworks: ['halftone', 'grain', 'dogtooth', 'pebble'], reverse: true,
    nav: ['Shop', 'Subscriptions', 'Wholesale', 'Roastery'], primaryCta: 'Shop the beans', secondaryCta: 'Start a subscription',
    eyebrow: 'Small-lot · Roasted to order',
    title: 'Coffee with a {em}sense of place{/em}.',
    lede: 'We source single-origin lots from growers we know by name and roast them in small batches the day before they ship.',
    stats: [{ n: '24 hr', l: 'Roast to ship' }, { n: 'Direct', l: 'Trade sourcing' }, { n: 'Traceable', l: 'Every lot' }],
    sectionTitle: "This month's roasts", sectionSub: 'The current lineup, roasted to order.',
    items: [
      { eyebrow: 'Ethiopia', title: 'Guji Highlands', meta: 'blueberry · jasmine · honey', seed: 'c1' },
      { eyebrow: 'Colombia', title: 'Huila Reserve', meta: 'cocoa · red apple · caramel', seed: 'c2' },
      { eyebrow: 'Kenya', title: 'Nyeri AA', meta: 'blackcurrant · tomato · sugar', seed: 'c3' },
    ],
    about: {
      eyebrow: 'From crop to cup', title: 'Roasted the day before it ships',
      body: [
        'We buy small lots direct from farms we visit, roast them in batches you can count, and send them out within a day so they reach you at their peak.',
        'Every bag lists the farm, altitude, and process, because where a coffee comes from is half the flavour.',
      ],
      points: ['Direct-trade sourcing', 'Roasted to order', 'Farm and process on every bag'],
    },
    features: [
      { title: 'Source', body: 'Long relationships with growers, and prices above the fair-trade floor.' },
      { title: 'Roast', body: 'Small batches dialled in for each lot, the day before dispatch.' },
      { title: 'Brew', body: 'A card in every bag with the recipe we brew it by.' },
    ],
    testimonials: [
      { quote: 'The freshest coffee that has ever reached my kitchen.', name: 'Lena K.', role: 'Subscriber' },
      { quote: 'You can taste the care in the cup.', name: 'Sam R.', role: 'Cafe owner' },
    ],
    newsletter: { title: 'Fresh beans, fortnightly', body: 'New lots and brewing notes, plus the occasional roastery invite.', cta: 'Build a subscription', placeholder: 'you@email.com' },
    bandTitle: 'Fresh beans on your counter every other Friday.', bandCta: 'Start a subscription',
    images: {
      c1: `A bag of single-origin coffee beans spilling onto burlap, warm espresso-brown tones, product photo. ${IMG}`,
      c2: `A pour-over coffee setup with rich crema in soft window light, cozy cafe still life, brown palette. ${IMG}`,
      c3: `Glossy roasted coffee beans piled close-up with warm highlights, rich brown coffee photography. ${IMG}`,
    },
  },
];

// Merge each site's kit + section composition + new-section content.
for (const site of SITES) Object.assign(site, STATIC_SECTIONS[site.dir] || {});

// ---- write ---------------------------------------------------------------
for (const site of SITES) {
  const dir = path.join(OUT, site.dir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(site));
  console.log('wrote', site.dir);
}

// The gallery landing page (/samples/) is a React route (app/samples/page.tsx).
// This script emits only the ten static site pages plus the vendored runtime.
const assetsOut = path.join(OUT, 'assets');
fs.mkdirSync(assetsOut, { recursive: true });
for (const f of ['css-doodle.min.js', 'tabbied-runtime.js']) {
  fs.copyFileSync(path.join(__dirname, 'assets', f), path.join(assetsOut, f));
}
console.log('copied assets: css-doodle.min.js, tabbied-runtime.js');
console.log('done,', SITES.length, 'sites ->', path.relative(path.resolve(__dirname, '..'), OUT));
