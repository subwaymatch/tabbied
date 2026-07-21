// Generates 10 self-contained sample websites that use Tabbied generative
// artworks as prominent design accents. Each site is themed with one palette
// from the Tabbied library (lib/paletteLibrary.ts) and one artwork from the
// package. Run: `node samples/generate.mjs`
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { doodle } from './lib/tabbied-embed.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Tooling lives in samples/; the built sites are emitted into public/samples/
// so the static export serves them live at /samples/ (mirrors how
// scripts/optimize-images.mjs writes into public/images/).
const OUT = path.resolve(__dirname, '../public/samples');
fs.mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------------------
// Palettes — copied verbatim from lib/paletteLibrary.ts (background first).
// ---------------------------------------------------------------------------
const PAL = {
  neon:        { name: 'Neon',        colors: ['#0d0d12', '#3fffb2', '#3eecff', '#ff3d8b'] },
  terracotta:  { name: 'Terracotta',  colors: ['#f7ede2', '#c1502e', '#84582c', '#2f3e46'] },
  cobalt:      { name: 'Cobalt',      colors: ['#0a1a3f', '#1e4fd6', '#3eecff', '#eef4ff'] },
  fern:        { name: 'Fern',        colors: ['#f4faf0', '#2d6a4f', '#95d5b2', '#1b4332'] },
  bauhaus:     { name: 'Bauhaus',     colors: ['#f4f1ea', '#d7263d', '#1b6ca8', '#f7b32b', '#232529'] },
  citrus:      { name: 'Citrus',      colors: ['#fffbe6', '#ff9f1c', '#2ec4b6', '#e71d36'] },
  amethyst:    { name: 'Amethyst',    colors: ['#12071f', '#5a189a', '#9d4edd', '#e0aaff'] },
  ocean:       { name: 'Ocean',       colors: ['#0b2545', '#8da9c4', '#eef4ed', '#13a8a8'] },
  vaporwave:   { name: 'Vaporwave',   colors: ['#2d0a45', '#ff6ad5', '#c774e8', '#94d0ff', '#ad8cff'] },
  espresso:    { name: 'Espresso',    colors: ['#efebe4', '#6f4e37', '#3b2417', '#c9a66b'] },
};

// Shared document shell. `assets` is the relative path to the vendored assets
// dir — subsites live one level deep ('../assets'); the gallery index sits at
// the samples root ('./assets').
function shell({ title, description, favicon, fonts = '', css, body, bg, assets = '../assets' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${favicon}</text></svg>" />
${fonts}
<script src="${assets}/css-doodle.min.js"></script>
<style>
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:${bg};-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
css-doodle{display:block;width:100%;height:100%}
img{max-width:100%}
a{color:inherit}
.doodle-wrap{position:absolute;inset:0;overflow:hidden}
${css}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

// Emit a doodle's scoped <style> inline next to its element so a page can carry
// several independent instances.
function art(cfg) {
  const d = doodle(cfg);
  return `<style>${d.style}</style>${d.element}`;
}

const sites = [];
const P = (k) => PAL[k].colors;

// ===========================================================================
// 01 — Aurora Sound · electronic music label · Neon · plasma
// ===========================================================================
sites.push({
  dir: '01-aurora-sound',
  name: 'Aurora Sound',
  topic: 'Electronic music label',
  palette: PAL.neon,
  artwork: 'plasma',
  html: () => {
    const c = P('neon');
    return shell({
      title: 'Aurora Sound — Electronic Music Label',
      description: 'An independent electronic music label releasing forward-looking club and ambient records.',
      favicon: '🎧',
      bg: c[0],
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@600;800&display=swap" rel="stylesheet">`,
      css: `
:root{--bg:${c[0]};--a:${c[1]};--b:${c[2]};--c:${c[3]}}
body{font-family:'Space Grotesk',system-ui,sans-serif;color:#eef0ff}
.nav{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;justify-content:space-between;align-items:center;padding:22px clamp(20px,5vw,64px);mix-blend-mode:difference}
.nav .logo{font-family:'Sora';font-weight:800;letter-spacing:.16em;font-size:15px;text-transform:uppercase}
.nav ul{display:flex;gap:30px;list-style:none;margin:0;padding:0;font-size:13px;letter-spacing:.1em;text-transform:uppercase}
.nav a{text-decoration:none;opacity:.85}
.hero{position:relative;min-height:100vh;display:grid;place-items:center;overflow:hidden}
.hero .doodle-wrap{filter:saturate(1.1)}
.hero::after{content:'';position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 42%,${c[0]}55 0,${c[0]}bb 55%,${c[0]} 100%)}
.hero-inner{position:relative;z-index:5;text-align:center;padding:0 24px}
.eyebrow{font-size:13px;letter-spacing:.42em;text-transform:uppercase;color:var(--a);margin-bottom:26px}
.hero h1{font-family:'Sora';font-weight:800;font-size:clamp(52px,12vw,168px);line-height:.9;margin:0;letter-spacing:-.03em;background:linear-gradient(96deg,var(--b),var(--a) 40%,var(--c));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{max-width:520px;margin:28px auto 0;font-size:clamp(15px,2vw,18px);line-height:1.6;color:#c9cee6}
.cta{display:inline-flex;gap:14px;margin-top:40px}
.btn{padding:14px 28px;border-radius:100px;font-weight:500;font-size:14px;letter-spacing:.04em;text-decoration:none;border:1px solid transparent}
.btn.solid{background:var(--a);color:#04120c}
.btn.ghost{border-color:#ffffff33;color:#eef0ff}
.marquee{border-top:1px solid #ffffff14;border-bottom:1px solid #ffffff14;overflow:hidden;white-space:nowrap;padding:16px 0;position:relative;z-index:5;background:${c[0]}}
.marquee span{font-family:'Sora';font-weight:800;font-size:26px;letter-spacing:-.01em;color:#ffffff10;padding:0 22px}
.marquee span b{color:var(--c);-webkit-text-stroke:0}
.releases{padding:clamp(70px,10vw,130px) clamp(20px,5vw,64px);max-width:1200px;margin:0 auto}
.sec-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:48px;flex-wrap:wrap}
.sec-head h2{font-family:'Sora';font-weight:800;font-size:clamp(30px,5vw,52px);margin:0;letter-spacing:-.02em}
.sec-head p{margin:0;color:#9aa0bd;max-width:360px;font-size:15px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:26px}
.rel{border-radius:18px;overflow:hidden;background:#15151d;border:1px solid #ffffff10;transition:transform .3s ease,border-color .3s ease}
.rel:hover{transform:translateY(-6px);border-color:var(--a)}
.rel .cover{position:relative;aspect-ratio:1;overflow:hidden}
.rel .meta{padding:18px 20px 22px}
.rel .cat{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--a)}
.rel h3{margin:8px 0 4px;font-family:'Sora';font-weight:600;font-size:20px}
.rel .artist{color:#8b90ad;font-size:14px}
footer{padding:64px clamp(20px,5vw,64px);border-top:1px solid #ffffff12;display:flex;justify-content:space-between;flex-wrap:wrap;gap:24px;color:#7c82a0;font-size:13px}
footer .logo{font-family:'Sora';font-weight:800;letter-spacing:.16em;color:#eef0ff;text-transform:uppercase}
@media(max-width:640px){.nav ul{display:none}}
`,
      body: `
<nav class="nav">
  <div class="logo">◈ Aurora</div>
  <ul><li><a href="#releases">Releases</a></li><li><a href="#">Artists</a></li><li><a href="#">Events</a></li><li><a href="#">About</a></li></ul>
</nav>
<header class="hero">
  <div class="doodle-wrap">${art({ slug: 'plasma', palette: P('neon'), options: { grid: '5x8', frequency: 1 }, seed: 'AUR7' })}</div>
  <div class="hero-inner">
    <div class="eyebrow">Independent · Est. 2019</div>
    <h1>AURORA<br>SOUND</h1>
    <p>A record label for forward-looking club, ambient, and everything that glows in between. Pressed with love, mixed for midnight.</p>
    <div class="cta"><a class="btn solid" href="#releases">Latest Releases</a><a class="btn ghost" href="#">Listen Live</a></div>
  </div>
</header>
<div class="marquee"><span>NEW SIGNINGS <b>✦</b> WAX &amp; DIGITAL <b>✦</b> DEEP CUTS <b>✦</b> AFTER HOURS <b>✦</b> NEW SIGNINGS <b>✦</b> WAX &amp; DIGITAL <b>✦</b> DEEP CUTS <b>✦</b> AFTER HOURS <b>✦</b></span></div>
<section class="releases" id="releases">
  <div class="sec-head">
    <h2>Recent Releases</h2>
    <p>Twelve inches and twelve bits — every drop mastered for the floor and the headphones.</p>
  </div>
  <div class="grid">
    ${[
      ['LP', 'Neon Tides', 'KAORU', 'plasma', '6x6', 'r1'],
      ['EP', 'Halcyon', 'Vela &amp; Mør', 'plasma', '4x4', 'r2'],
      ['Single', 'Afterglow', 'S U N J A', 'plasma', '8x8', 'r3'],
      ['LP', 'Static Bloom', 'Orbit Theory', 'plasma', '5x5', 'r4'],
    ].map(([cat, title, artist, slug, grid, seed]) => `
    <article class="rel">
      <div class="cover">${art({ slug, palette: P('neon'), options: { grid, frequency: 1 }, seed })}</div>
      <div class="meta"><div class="cat">${cat}</div><h3>${title}</h3><div class="artist">${artist}</div></div>
    </article>`).join('')}
  </div>
</section>
<footer>
  <div class="logo">◈ AURORA SOUND</div>
  <div>© 2026 Aurora Sound. Artwork generated with Tabbied · Neon palette.</div>
</footer>
`,
    });
  },
});

// ===========================================================================
// 02 — Terra Ceramics · pottery studio · Terracotta · pebble
// ===========================================================================
sites.push({
  dir: '02-terra-ceramics',
  name: 'Terra Ceramics',
  topic: 'Pottery & ceramics studio',
  palette: PAL.terracotta,
  artwork: 'pebble',
  html: () => {
    const c = P('terracotta');
    return shell({
      title: 'Terra — Handmade Ceramics Studio',
      description: 'A small-batch ceramics studio making tableware and vessels thrown by hand.',
      favicon: '🏺',
      bg: c[0],
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Inter:wght@400;500&display=swap" rel="stylesheet">`,
      css: `
:root{--bg:${c[0]};--rust:${c[1]};--umber:${c[2]};--ink:${c[3]}}
body{font-family:'Inter',system-ui,sans-serif;color:${c[3]}}
.nav{display:flex;justify-content:space-between;align-items:center;padding:26px clamp(20px,5vw,72px);position:relative;z-index:10}
.nav .logo{font-family:'Fraunces';font-size:24px;font-weight:600;letter-spacing:-.01em}
.nav ul{display:flex;gap:34px;list-style:none;margin:0;padding:0;font-size:14px}
.nav a{text-decoration:none;opacity:.75}
.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:0;align-items:stretch;min-height:82vh}
.hero-copy{padding:clamp(40px,7vw,110px) clamp(24px,5vw,72px);display:flex;flex-direction:column;justify-content:center}
.tag{font-size:13px;letter-spacing:.24em;text-transform:uppercase;color:var(--rust);margin-bottom:22px}
.hero h1{font-family:'Fraunces';font-weight:400;font-size:clamp(44px,7vw,88px);line-height:1.02;margin:0;letter-spacing:-.02em}
.hero h1 em{font-style:italic;color:var(--rust)}
.hero-copy p{max-width:440px;font-size:17px;line-height:1.7;color:${c[2]};margin:28px 0 0}
.hero-copy .row{margin-top:38px;display:flex;gap:16px;align-items:center}
.btn{display:inline-block;padding:15px 30px;border-radius:2px;text-decoration:none;font-size:14px;letter-spacing:.02em}
.btn.solid{background:var(--ink);color:${c[0]}}
.btn.link{color:var(--ink);border-bottom:1px solid var(--rust);padding:15px 2px}
.hero-art{position:relative;overflow:hidden;background:var(--rust)}
.strip{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid ${c[1]}33;border-bottom:1px solid ${c[1]}33}
.strip div{padding:30px clamp(20px,4vw,48px);border-right:1px solid ${c[1]}22}
.strip .n{font-family:'Fraunces';font-size:34px}
.strip .l{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:${c[2]};margin-top:6px}
.shop{padding:clamp(60px,9vw,120px) clamp(24px,5vw,72px);max-width:1180px;margin:0 auto}
.shop h2{font-family:'Fraunces';font-weight:400;font-size:clamp(30px,5vw,52px);margin:0 0 8px;letter-spacing:-.02em}
.shop .sub{color:${c[2]};margin:0 0 46px}
.pieces{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px}
.piece{background:#fff8f0;border:1px solid ${c[1]}1f;border-radius:4px;overflow:hidden}
.piece .ph{aspect-ratio:4/5;position:relative;overflow:hidden}
.piece .info{padding:18px 20px;display:flex;justify-content:space-between;align-items:baseline}
.piece h3{font-family:'Fraunces';font-weight:400;font-size:19px;margin:0}
.piece .price{color:var(--rust);font-size:15px}
.band{position:relative;height:340px;overflow:hidden;margin-top:20px;display:grid;place-items:center}
.band .doodle-wrap{filter:saturate(1.05)}
.band::after{content:'';position:absolute;inset:0;background:${c[3]}44}
.band blockquote{position:relative;z-index:3;font-family:'Fraunces';font-style:italic;font-weight:400;color:${c[0]};font-size:clamp(24px,4vw,44px);max-width:820px;text-align:center;margin:0;padding:0 24px;line-height:1.25}
footer{padding:60px clamp(24px,5vw,72px);display:flex;justify-content:space-between;flex-wrap:wrap;gap:18px;font-size:14px;color:${c[2]}}
footer .logo{font-family:'Fraunces';font-size:20px;color:${c[3]}}
@media(max-width:820px){.hero{grid-template-columns:1fr}.hero-art{min-height:300px}.nav ul{display:none}}
`,
      body: `
<nav class="nav">
  <div class="logo">Terra</div>
  <ul><li><a href="#shop">Shop</a></li><li><a href="#">Studio</a></li><li><a href="#">Classes</a></li><li><a href="#">Journal</a></li></ul>
</nav>
<header class="hero">
  <div class="hero-copy">
    <div class="tag">Small-batch · Thrown by hand</div>
    <h1>Quiet objects for <em>everyday</em> rituals.</h1>
    <p>Each piece is wheel-thrown, glazed, and fired in our riverside studio — no two exactly alike, all made to be used.</p>
    <div class="row"><a class="btn solid" href="#shop">Shop the collection</a><a class="btn link" href="#">Book a class →</a></div>
  </div>
  <div class="hero-art">${art({ slug: 'pebble', palette: P('terracotta'), options: { grid: '5x7', frequency: 1 }, seed: 'TERRA' })}</div>
</header>
<div class="strip">
  <div><div class="n">1,400°</div><div class="l">Stoneware firing</div></div>
  <div><div class="n">6 wks</div><div class="l">Kiln to table</div></div>
  <div><div class="n">100%</div><div class="l">Lead-free glaze</div></div>
</div>
<section class="shop" id="shop">
  <h2>The Riverstone Collection</h2>
  <p class="sub">Tableware toned after wet clay and dusk.</p>
  <div class="pieces">
    ${[
      ['Ripple Bowl', '$48', 'p1', '4x5'],
      ['Ember Mug', '$34', 'p2', '3x4'],
      ['Dune Vase', '$92', 'p3', '5x6'],
      ['Tide Plate', '$56', 'p4', '4x5'],
    ].map(([n, price, seed, grid]) => `
    <article class="piece">
      <div class="ph">${art({ slug: 'pebble', palette: P('terracotta'), options: { grid, frequency: 1 }, seed })}</div>
      <div class="info"><h3>${n}</h3><span class="price">${price}</span></div>
    </article>`).join('')}
  </div>
</section>
<section class="band">
  <div class="doodle-wrap">${art({ slug: 'pebble', palette: P('terracotta'), options: { grid: '8x4', frequency: 1 }, seed: 'BANDT' })}</div>
  <blockquote>“We make things that ask to be picked up.”</blockquote>
</section>
<footer>
  <div class="logo">Terra Ceramics</div>
  <div>© 2026 Terra Studio · Pattern by Tabbied — Terracotta palette</div>
</footer>
`,
    });
  },
});

// ===========================================================================
// 03 — Meridian · fintech / payments infra · Cobalt · circuit
// ===========================================================================
sites.push({
  dir: '03-meridian',
  name: 'Meridian',
  topic: 'Fintech payments platform',
  palette: PAL.cobalt,
  artwork: 'circuit',
  html: () => {
    const c = P('cobalt');
    return shell({
      title: 'Meridian — Payments Infrastructure',
      description: 'Programmable payments infrastructure for modern software teams.',
      favicon: '⬡',
      bg: '#ffffff',
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;800&display=swap" rel="stylesheet">`,
      css: `
:root{--navy:${c[0]};--blue:${c[1]};--cyan:${c[2]};--pale:${c[3]}}
body{font-family:'Manrope',system-ui,sans-serif;color:${c[0]}}
.nav{position:absolute;top:0;left:0;right:0;z-index:20;display:flex;justify-content:space-between;align-items:center;padding:22px clamp(20px,5vw,64px);color:#eaf1ff}
.nav .logo{font-weight:800;font-size:20px;letter-spacing:-.01em;display:flex;gap:9px;align-items:center}
.nav .logo b{width:22px;height:22px;background:var(--cyan);border-radius:6px;display:inline-block;transform:rotate(45deg)}
.nav ul{display:flex;gap:30px;list-style:none;margin:0;padding:0;font-size:14px;font-weight:500}
.nav a{text-decoration:none;opacity:.85}
.nav .signin{background:#ffffff;color:var(--navy);padding:10px 20px;border-radius:8px;font-weight:600}
.hero{position:relative;min-height:100vh;overflow:hidden;color:#eaf1ff;display:flex;align-items:center;background:linear-gradient(160deg,${c[0]},#061029)}
.hero .doodle-wrap{opacity:.55;mask-image:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent)}
.hero::after{content:'';position:absolute;inset:0;background:radial-gradient(70% 60% at 78% 50%,transparent,${c[0]} 80%)}
.hero-inner{position:relative;z-index:5;padding:0 clamp(20px,5vw,64px);max-width:760px}
.pill{display:inline-flex;align-items:center;gap:8px;background:#ffffff12;border:1px solid #ffffff22;padding:7px 14px;border-radius:100px;font-size:13px;font-weight:500;margin-bottom:26px}
.pill b{color:var(--cyan)}
.hero h1{font-size:clamp(42px,7vw,82px);line-height:1.02;letter-spacing:-.035em;margin:0;font-weight:800}
.hero h1 span{background:linear-gradient(92deg,var(--cyan),var(--pale));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{font-size:clamp(16px,2vw,20px);line-height:1.6;color:#b7c6e6;max-width:540px;margin:26px 0 0}
.hero .cta{display:flex;gap:14px;margin-top:38px;flex-wrap:wrap}
.btn{padding:15px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px}
.btn.solid{background:var(--cyan);color:#04122b}
.btn.ghost{border:1px solid #ffffff2e;color:#eaf1ff}
.code{margin-top:44px;background:#0a1836cc;border:1px solid #ffffff1a;border-radius:14px;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:14px;padding:20px 22px;max-width:520px;line-height:1.7;box-shadow:0 30px 60px -20px #00081e}
.code .k{color:var(--cyan)}.code .s{color:#9be7a0}.code .c{color:#6f83ad}
.logos{padding:40px clamp(20px,5vw,64px);display:flex;gap:44px;flex-wrap:wrap;justify-content:center;align-items:center;opacity:.55;font-weight:700;letter-spacing:.02em;color:${c[0]};border-bottom:1px solid #0a1a3f14}
.feat{max-width:1160px;margin:0 auto;padding:clamp(70px,9vw,120px) clamp(20px,5vw,64px)}
.feat h2{font-size:clamp(30px,5vw,50px);letter-spacing:-.03em;margin:0 0 14px;font-weight:800}
.feat .lead{color:#4a5a7c;max-width:520px;font-size:18px;margin:0 0 52px;line-height:1.6}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px}
.card{border:1px solid #0a1a3f18;border-radius:16px;overflow:hidden;background:#fff;transition:box-shadow .3s,transform .3s}
.card:hover{transform:translateY(-4px);box-shadow:0 24px 48px -24px ${c[1]}66}
.card .top{height:150px;position:relative;overflow:hidden;background:${c[0]}}
.card .b{padding:22px 24px 28px}
.card h3{margin:0 0 8px;font-size:20px;font-weight:700}
.card p{margin:0;color:#5a6a8a;font-size:15px;line-height:1.6}
.big{position:relative;margin:0 clamp(12px,3vw,40px) clamp(40px,6vw,70px);border-radius:24px;overflow:hidden;min-height:420px;display:grid;place-items:center;background:${c[0]}}
.big .doodle-wrap{opacity:.9}
.big::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,${c[0]}cc,${c[0]}22 50%,${c[0]}cc)}
.big .in{position:relative;z-index:3;text-align:center;color:#eaf1ff;padding:0 24px}
.big h2{font-size:clamp(30px,5vw,58px);letter-spacing:-.03em;margin:0 0 18px;font-weight:800}
.big p{color:#b7c6e6;max-width:440px;margin:0 auto 28px;font-size:17px}
footer{background:${c[0]};color:#9fb2d8;padding:60px clamp(20px,5vw,64px);display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px;font-size:14px}
footer .logo{color:#fff;font-weight:800;font-size:18px}
@media(max-width:720px){.nav ul{display:none}}
`,
      body: `
<nav class="nav">
  <div class="logo"><b></b> Meridian</div>
  <ul><li><a href="#">Products</a></li><li><a href="#features">Developers</a></li><li><a href="#">Pricing</a></li><li><a href="#">Docs</a></li></ul>
  <a class="signin" href="#">Sign in</a>
</nav>
<header class="hero">
  <div class="doodle-wrap">${art({ slug: 'circuit', palette: P('cobalt'), options: { grid: '12x18', frequency: 0.7 }, seed: 'MRDN' })}</div>
  <div class="hero-inner">
    <div class="pill"><b>●</b> New — Instant payouts in 40+ currencies</div>
    <h1>Payments <span>infrastructure</span> for software that moves money.</h1>
    <p>One API for cards, transfers, and ledgers. Ship compliant money movement in days, not quarters.</p>
    <div class="cta"><a class="btn solid" href="#">Start building</a><a class="btn ghost" href="#">Book a demo</a></div>
    <pre class="code"><span class="c">// charge a customer in 3 lines</span>
<span class="k">const</span> pay = <span class="k">await</span> meridian.charges.create({
  amount: <span class="s">4200</span>, currency: <span class="s">'usd'</span>,
  source: token, capture: <span class="k">true</span>
});</pre>
  </div>
</header>
<div class="logos">NORTHWIND · LUMEN · CASCADE · OBERON · FLEETLY · HARBOR</div>
<section class="feat" id="features">
  <h2>Built for the whole money lifecycle.</h2>
  <p class="lead">From the first authorization to reconciliation, Meridian gives your team programmable primitives with a real ledger underneath.</p>
  <div class="cards">
    ${[
      ['Unified Ledger', 'Double-entry accounting that stays correct at any scale, queryable in real time.', 'm1', '8x12'],
      ['Adaptive Routing', 'Route each transaction to the highest-converting path automatically.', 'm2', '10x15'],
      ['Fraud Signals', 'Risk scoring on every event, tuned to your traffic within a week.', 'm3', '12x18'],
    ].map(([h, p, seed, grid]) => `
    <article class="card">
      <div class="top">${art({ slug: 'circuit', palette: P('cobalt'), options: { grid, frequency: 0.7 }, seed })}</div>
      <div class="b"><h3>${h}</h3><p>${p}</p></div>
    </article>`).join('')}
  </div>
</section>
<section class="big">
  <div class="doodle-wrap">${art({ slug: 'circuit', palette: P('cobalt'), options: { grid: '14x22', frequency: 0.8 }, seed: 'BIGMR' })}</div>
  <div class="in">
    <h2>Go live this quarter.</h2>
    <p>Sandbox keys in a minute, production access after one review call.</p>
    <a class="btn solid" href="#">Create an account</a>
  </div>
</section>
<footer>
  <div class="logo">⬡ Meridian</div>
  <div>© 2026 Meridian, Inc. · Generative accents by Tabbied — Cobalt palette</div>
</footer>
`,
    });
  },
});

// ===========================================================================
// 04 — Verdant · plant shop · Fern · foliage
// ===========================================================================
sites.push({
  dir: '04-verdant',
  name: 'Verdant',
  topic: 'Indoor plant shop',
  palette: PAL.fern,
  artwork: 'foliage',
  html: () => {
    const c = P('fern');
    return shell({
      title: 'Verdant — Plants for Small Spaces',
      description: 'A neighbourhood plant shop delivering easy-care houseplants across the city.',
      favicon: '🌿',
      bg: c[0],
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">`,
      css: `
:root{--paper:${c[0]};--green:${c[1]};--mint:${c[2]};--forest:${c[3]}}
body{font-family:'DM Sans',system-ui,sans-serif;color:${c[3]}}
.nav{display:flex;justify-content:space-between;align-items:center;padding:22px clamp(20px,5vw,64px);position:relative;z-index:10}
.nav .logo{font-family:'DM Serif Display';font-size:26px;color:var(--forest)}
.nav ul{display:flex;gap:30px;list-style:none;margin:0;padding:0;font-size:15px;font-weight:500}
.nav a{text-decoration:none;opacity:.8}
.nav .cart{background:var(--forest);color:var(--paper);padding:10px 18px;border-radius:100px;font-size:14px;font-weight:500}
.hero{position:relative;margin:0 clamp(12px,3vw,32px);border-radius:30px;overflow:hidden;min-height:78vh;display:flex;align-items:flex-end;background:var(--forest)}
.hero .doodle-wrap{opacity:.9}
.hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,${c[3]}e0)}
.hero-inner{position:relative;z-index:4;padding:clamp(30px,6vw,70px);color:var(--paper)}
.hero h1{font-family:'DM Serif Display';font-weight:400;font-size:clamp(46px,9vw,120px);line-height:.92;margin:0;letter-spacing:-.01em}
.hero p{max-width:460px;font-size:18px;line-height:1.6;margin:22px 0 30px;color:#e7f6ea}
.btn{display:inline-block;background:var(--mint);color:var(--forest);padding:15px 30px;border-radius:100px;text-decoration:none;font-weight:700}
.usp{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:2px;background:${c[3]}12;margin:clamp(40px,6vw,70px) clamp(12px,3vw,32px) 0;border-radius:18px;overflow:hidden}
.usp div{background:var(--paper);padding:26px 28px}
.usp .e{font-size:24px}
.usp h4{margin:12px 0 4px;font-size:16px}
.usp p{margin:0;font-size:14px;color:#5a6f61}
.shop{padding:clamp(50px,8vw,100px) clamp(20px,5vw,64px);max-width:1180px;margin:0 auto}
.shop-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:40px;flex-wrap:wrap;gap:16px}
.shop-head h2{font-family:'DM Serif Display';font-weight:400;font-size:clamp(30px,5vw,52px);margin:0}
.shop-head a{color:var(--green);text-decoration:none;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:24px}
.plant{background:#fff;border-radius:20px;overflow:hidden;border:1px solid ${c[3]}12;transition:transform .3s}
.plant:hover{transform:translateY(-6px)}
.plant .ph{aspect-ratio:1;position:relative;overflow:hidden}
.plant .b{padding:18px 20px 22px}
.plant .care{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--green);font-weight:700}
.plant h3{font-family:'DM Serif Display';font-weight:400;font-size:22px;margin:8px 0 6px}
.plant .row{display:flex;justify-content:space-between;align-items:center}
.plant .price{font-weight:700}
.plant .add{width:34px;height:34px;border-radius:50%;background:var(--forest);color:#fff;border:none;font-size:18px;cursor:pointer}
footer{background:var(--forest);color:#cfe6d5;margin-top:clamp(40px,6vw,70px);padding:60px clamp(20px,5vw,64px);display:flex;justify-content:space-between;flex-wrap:wrap;gap:18px;font-size:14px}
footer .logo{font-family:'DM Serif Display';color:#fff;font-size:22px}
@media(max-width:720px){.nav ul{display:none}}
`,
      body: `
<nav class="nav">
  <div class="logo">Verdant</div>
  <ul><li><a href="#shop">Shop</a></li><li><a href="#">Care Guides</a></li><li><a href="#">Gifts</a></li></ul>
  <a class="cart" href="#">Cart · 2</a>
</nav>
<header class="hero">
  <div class="doodle-wrap">${art({ slug: 'foliage', palette: P('fern'), options: { grid: '6x9', frequency: 1, shadow: false }, seed: 'VRDNT' })}</div>
  <div class="hero-inner">
    <h1>Green,<br>made easy.</h1>
    <p>Hand-picked houseplants matched to your light, delivered to your door with everything they need to thrive.</p>
    <a class="btn" href="#shop">Find your plant</a>
  </div>
</header>
<div class="usp">
  <div><div class="e">🚚</div><h4>Free local delivery</h4><p>Next-day, potted and ready.</p></div>
  <div><div class="e">🌱</div><h4>30-day thrive promise</h4><p>We replace it if it struggles.</p></div>
  <div><div class="e">💬</div><h4>Text-a-botanist</h4><p>Real care advice, anytime.</p></div>
  <div><div class="e">♻️</div><h4>Peat-free potting</h4><p>Kinder soil, sturdier roots.</p></div>
</div>
<section class="shop" id="shop">
  <div class="shop-head"><h2>Easy-care favourites</h2><a href="#">Browse all 120 →</a></div>
  <div class="grid">
    ${[
      ['Low light', 'ZZ Plant', '$32', 'v1', '5x7'],
      ['Bright indirect', 'Fiddle Fig', '$68', 'v2', '6x9'],
      ['Beginner', 'Pothos', '$24', 'v3', '4x6'],
      ['Statement', 'Bird of Paradise', '$95', 'v4', '6x8'],
    ].map(([care, n, price, seed, grid]) => `
    <article class="plant">
      <div class="ph">${art({ slug: 'foliage', palette: P('fern'), options: { grid, frequency: 1, shadow: false }, seed })}</div>
      <div class="b"><div class="care">${care}</div><h3>${n}</h3><div class="row"><span class="price">${price}</span><button class="add" aria-label="Add">+</button></div></div>
    </article>`).join('')}
  </div>
</section>
<footer>
  <div class="logo">Verdant</div>
  <div>© 2026 Verdant Plant Co. · Foliage pattern by Tabbied — Fern palette</div>
</footer>
`,
    });
  },
});

// ===========================================================================
// 05 — The Sunday Press · editorial magazine · Bauhaus · bauhaus
// ===========================================================================
sites.push({
  dir: '05-sunday-press',
  name: 'The Sunday Press',
  topic: 'Independent editorial magazine',
  palette: PAL.bauhaus,
  artwork: 'bauhaus',
  html: () => {
    const c = P('bauhaus');
    return shell({
      title: 'The Sunday Press — Ideas, Design & Culture',
      description: 'An independent magazine on design, technology, and the culture around them.',
      favicon: '📰',
      bg: c[0],
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800;900&family=Newsreader:ital,opsz@0,6..72;1,6..72&display=swap" rel="stylesheet">`,
      css: `
:root{--paper:${c[0]};--red:${c[1]};--blue:${c[2]};--yellow:${c[3]};--ink:${c[4]}}
body{font-family:'Archivo',system-ui,sans-serif;color:${c[4]}}
.masthead{border-bottom:3px solid var(--ink);padding:16px clamp(20px,5vw,64px);display:flex;justify-content:space-between;align-items:center}
.masthead .date{font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
.masthead .sub{background:var(--ink);color:var(--paper);padding:8px 16px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;text-decoration:none}
.title-row{text-align:center;padding:26px 20px 18px;border-bottom:1px solid var(--ink)}
.title-row h1{font-family:'Archivo';font-weight:900;font-size:clamp(40px,10vw,120px);margin:0;letter-spacing:-.03em;line-height:.9}
.title-row .tag{font-family:'Newsreader';font-style:italic;font-size:clamp(14px,2vw,20px);margin-top:8px;color:#444}
.nav2{display:flex;gap:26px;justify-content:center;flex-wrap:wrap;padding:12px;border-bottom:3px solid var(--ink);font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:600}
.nav2 a{text-decoration:none}
.lead-grid{display:grid;grid-template-columns:2fr 1fr;border-bottom:3px solid var(--ink)}
.lead{border-right:1px solid var(--ink)}
.lead .art{position:relative;height:clamp(280px,42vw,560px);overflow:hidden;border-bottom:1px solid var(--ink)}
.lead .body{padding:clamp(20px,3vw,40px)}
.lead .kicker{color:var(--red);font-weight:800;letter-spacing:.1em;text-transform:uppercase;font-size:13px}
.lead h2{font-family:'Archivo';font-weight:800;font-size:clamp(28px,4.5vw,56px);line-height:1.02;letter-spacing:-.02em;margin:10px 0 14px}
.lead p{font-family:'Newsreader';font-size:19px;line-height:1.6;color:#2a2a2a;max-width:56ch;margin:0}
.lead .by{margin-top:18px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#555;font-weight:600}
.side{display:flex;flex-direction:column}
.side .item{padding:22px clamp(16px,2vw,28px);border-bottom:1px solid var(--ink)}
.side .item:last-child{border-bottom:none}
.side .n{font-family:'Archivo';font-weight:900;font-size:22px;color:var(--blue)}
.side h3{font-weight:700;font-size:19px;margin:6px 0 6px;line-height:1.15}
.side p{font-family:'Newsreader';margin:0;font-size:15px;color:#444}
.strip{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:3px solid var(--ink)}
.strip article{border-right:1px solid var(--ink);padding-bottom:22px}
.strip article:last-child{border-right:none}
.strip .art{height:180px;position:relative;overflow:hidden;border-bottom:1px solid var(--ink);margin-bottom:16px}
.strip .kicker{color:var(--red);font-weight:800;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:0 20px}
.strip h3{font-weight:800;font-size:22px;margin:8px 20px 6px;line-height:1.05;letter-spacing:-.01em}
.strip p{font-family:'Newsreader';margin:0 20px;color:#444;font-size:15px}
footer{padding:40px clamp(20px,5vw,64px);display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;font-weight:600}
@media(max-width:820px){.lead-grid{grid-template-columns:1fr}.lead{border-right:none}.strip{grid-template-columns:1fr}.strip article{border-right:none;border-bottom:1px solid var(--ink)}}
`,
      body: `
<div class="masthead"><div class="date">Vol. XII · Sunday, July 19, 2026</div><a class="sub" href="#">Subscribe — $6/mo</a></div>
<div class="title-row"><h1>THE SUNDAY PRESS</h1><div class="tag">Ideas, design, and the culture around them.</div></div>
<nav class="nav2"><a href="#">Design</a><a href="#">Technology</a><a href="#">Essays</a><a href="#">Interviews</a><a href="#">Archive</a></nav>
<div class="lead-grid">
  <article class="lead">
    <div class="art">${art({ slug: 'bauhaus', palette: P('bauhaus'), options: { grid: '7x11', frequency: 1 }, seed: 'PRESS' })}</div>
    <div class="body">
      <div class="kicker">The Feature</div>
      <h2>The Return of the Grid</h2>
      <p>A generation of designers raised on infinite canvases is rediscovering the humble column grid — and finding, in its constraints, a strange new freedom. We spent a month with the studios rebuilding the web on first principles.</p>
      <div class="by">By Mara Lindqvist · 14 min read</div>
    </div>
  </article>
  <div class="side">
    <div class="item"><div class="n">01</div><h3>Why every tool wants to be a canvas</h3><p>The quiet standardisation of creative software.</p></div>
    <div class="item"><div class="n">02</div><h3>Colour, computed</h3><p>Generative palettes and the death of the swatch.</p></div>
    <div class="item"><div class="n">03</div><h3>The typographer's dilemma</h3><p>When variable fonts made every weight possible.</p></div>
  </div>
</div>
<div class="strip">
  ${[
    ['Design', 'Systems that breathe', 'On leaving room in a design system for the unplanned.', 's1', '6x9'],
    ['Technology', 'Small software', 'The revival of tools built by one person, for a few.', 's2', '8x12'],
    ['Essays', 'In praise of the ugly draft', 'The creative case for shipping something rough.', 's3', '5x8'],
  ].map(([k, h, p, seed, grid]) => `
  <article>
    <div class="art">${art({ slug: 'bauhaus', palette: P('bauhaus'), options: { grid, frequency: 1 }, seed })}</div>
    <div class="kicker">${k}</div><h3>${h}</h3><p>${p}</p>
  </article>`).join('')}
</div>
<footer><div>© 2026 The Sunday Press</div><div>Cover art generated with Tabbied — Bauhaus palette</div></footer>
`,
    });
  },
});

// ===========================================================================
// 06 — Zest · recipe / food publication · Citrus · confetti
// ===========================================================================
sites.push({
  dir: '06-zest',
  name: 'Zest',
  topic: 'Recipe & food publication',
  palette: PAL.citrus,
  artwork: 'confetti',
  html: () => {
    const c = P('citrus');
    return shell({
      title: 'Zest — Bright, Fast, Weeknight Cooking',
      description: 'A food publication for bright, fast, weeknight cooking you will actually make.',
      favicon: '🍋',
      bg: c[0],
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;800&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">`,
      css: `
:root{--cream:${c[0]};--orange:${c[1]};--teal:${c[2]};--red:${c[3]}}
body{font-family:'Nunito Sans',system-ui,sans-serif;color:#26333a}
.nav{display:flex;justify-content:space-between;align-items:center;padding:20px clamp(20px,5vw,64px)}
.nav .logo{font-family:'Baloo 2';font-weight:800;font-size:28px;color:var(--red);letter-spacing:-.01em}
.nav ul{display:flex;gap:26px;list-style:none;margin:0;padding:0;font-weight:700;font-size:15px}
.nav a{text-decoration:none}
.nav .btn{background:var(--red);color:#fff;padding:11px 20px;border-radius:100px;font-weight:800}
.hero{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(20px,4vw,50px);align-items:center;padding:clamp(20px,4vw,50px) clamp(20px,5vw,64px)}
.hero-copy .kick{display:inline-block;background:var(--teal);color:#04302c;font-weight:800;padding:7px 16px;border-radius:100px;font-size:13px;letter-spacing:.04em;margin-bottom:20px}
.hero h1{font-family:'Baloo 2';font-weight:800;font-size:clamp(44px,7vw,90px);line-height:.98;margin:0;color:#20140a}
.hero h1 span{color:var(--orange)}
.hero p{font-size:19px;line-height:1.6;max-width:440px;margin:20px 0 30px;color:#4a5560}
.hero .row{display:flex;gap:14px;align-items:center}
.btn2{display:inline-block;background:var(--orange);color:#fff;padding:15px 30px;border-radius:100px;text-decoration:none;font-weight:800;box-shadow:0 12px 24px -8px ${c[1]}88}
.link{font-weight:800;color:var(--red);text-decoration:none}
.hero-art{position:relative;aspect-ratio:1;border-radius:32px;overflow:hidden;box-shadow:0 30px 60px -24px ${c[1]}66;border:6px solid #fff}
.ticker{background:var(--red);color:#fff;font-family:'Baloo 2';font-weight:800;padding:14px 0;overflow:hidden;white-space:nowrap}
.ticker span{padding:0 20px;font-size:20px}
.recipes{padding:clamp(50px,8vw,100px) clamp(20px,5vw,64px);max-width:1200px;margin:0 auto}
.recipes h2{font-family:'Baloo 2';font-weight:800;font-size:clamp(30px,5vw,52px);margin:0 0 8px;color:#20140a}
.recipes .sub{color:#5a6570;margin:0 0 42px;font-size:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:26px}
.rc{background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 16px 34px -22px #3a2a1088;transition:transform .3s}
.rc:hover{transform:translateY(-6px) rotate(-.6deg)}
.rc .ph{aspect-ratio:4/3;position:relative;overflow:hidden}
.rc .tag{position:absolute;z-index:3;top:12px;left:12px;background:#ffffffe6;color:#20140a;font-weight:800;font-size:12px;padding:6px 12px;border-radius:100px}
.rc .b{padding:18px 22px 24px}
.rc h3{font-family:'Baloo 2';font-weight:800;font-size:22px;margin:0 0 6px;color:#20140a}
.rc .meta{display:flex;gap:14px;color:#7a8590;font-weight:700;font-size:14px}
footer{background:#20140a;color:#f0d9a8;padding:56px clamp(20px,5vw,64px);display:flex;justify-content:space-between;flex-wrap:wrap;gap:18px;font-size:15px}
footer .logo{font-family:'Baloo 2';font-weight:800;color:var(--orange);font-size:26px}
@media(max-width:820px){.hero{grid-template-columns:1fr}.nav ul{display:none}}
`,
      body: `
<nav class="nav">
  <div class="logo">Zest 🍋</div>
  <ul><li><a href="#recipes">Recipes</a></li><li><a href="#">Quick</a></li><li><a href="#">Vegetarian</a></li><li><a href="#">Baking</a></li></ul>
  <a class="btn" href="#">Get the box</a>
</nav>
<header class="hero">
  <div class="hero-copy">
    <span class="kick">30 minutes or less</span>
    <h1>Dinner that <span>actually</span> gets made.</h1>
    <p>Bright, punchy recipes with short lists and shorter cook times — the kind you cook on a Tuesday and brag about on Friday.</p>
    <div class="row"><a class="btn2" href="#recipes">Tonight's recipe</a><a class="link" href="#">Browse all →</a></div>
  </div>
  <div class="hero-art">${art({ slug: 'confetti', palette: P('citrus'), options: { grid: '6x6', frequency: 1 }, seed: 'ZEST1' })}</div>
</header>
<div class="ticker"><span>★ 15-MINUTE MEALS ★ ONE-PAN WONDERS ★ PANTRY HEROES ★ NO-CHOP NIGHTS ★ 15-MINUTE MEALS ★ ONE-PAN WONDERS ★ PANTRY HEROES ★ NO-CHOP NIGHTS ★</span></div>
<section class="recipes" id="recipes">
  <h2>This week's brightest</h2>
  <p class="sub">Fresh from the test kitchen, sorted by how fast you'll be eating.</p>
  <div class="grid">
    ${[
      ['20 min', 'Chili-Lime Corn Bowls', '4 servings', 'z1', '5x4'],
      ['15 min', 'Blistered Tomato Orzo', '2 servings', 'z2', '6x5'],
      ['30 min', 'Sesame Crunch Noodles', '4 servings', 'z3', '5x4'],
      ['25 min', 'Charred Broccoli Tacos', '3 servings', 'z4', '6x5'],
    ].map(([time, n, serv, seed, grid]) => `
    <article class="rc">
      <div class="ph"><span class="tag">⏱ ${time}</span>${art({ slug: 'confetti', palette: P('citrus'), options: { grid, frequency: 1 }, seed })}</div>
      <div class="b"><h3>${n}</h3><div class="meta"><span>🍽 ${serv}</span><span>★ 4.9</span></div></div>
    </article>`).join('')}
  </div>
</section>
<footer>
  <div class="logo">Zest 🍋</div>
  <div>© 2026 Zest Kitchen · Confetti pattern by Tabbied — Citrus palette</div>
</footer>
`,
    });
  },
});

// ===========================================================================
// 07 — Nocturne · perfume house · Amethyst · veil
// ===========================================================================
sites.push({
  dir: '07-nocturne',
  name: 'Nocturne',
  topic: 'Luxury perfume house',
  palette: PAL.amethyst,
  artwork: 'veil',
  html: () => {
    const c = P('amethyst');
    return shell({
      title: 'Nocturne — Fragrance for the Small Hours',
      description: 'A perfume house composing fragrances for the small hours of the night.',
      favicon: '🌙',
      bg: c[0],
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">`,
      css: `
:root{--night:${c[0]};--violet:${c[1]};--orchid:${c[2]};--lilac:${c[3]}}
body{font-family:'Jost',system-ui,sans-serif;color:#efe6ff;letter-spacing:.01em}
.nav{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;justify-content:space-between;align-items:center;padding:26px clamp(20px,5vw,64px)}
.nav .logo{font-family:'Cormorant Garamond';font-weight:500;font-size:26px;letter-spacing:.28em;text-transform:uppercase}
.nav ul{display:flex;gap:34px;list-style:none;margin:0;padding:0;font-size:13px;letter-spacing:.18em;text-transform:uppercase;font-weight:300}
.nav a{text-decoration:none;opacity:.8}
.hero{position:relative;min-height:100vh;display:grid;place-items:center;overflow:hidden}
.hero .doodle-wrap{opacity:.9}
.hero::after{content:'';position:absolute;inset:0;background:radial-gradient(90% 80% at 50% 45%,transparent,${c[0]}d0 70%,${c[0]})}
.hero-inner{position:relative;z-index:4;text-align:center;padding:0 24px}
.hero .pre{font-size:13px;letter-spacing:.5em;text-transform:uppercase;color:var(--lilac);margin-bottom:30px}
.hero h1{font-family:'Cormorant Garamond';font-weight:400;font-size:clamp(58px,14vw,190px);line-height:.86;margin:0;letter-spacing:.02em}
.hero h1 em{font-style:italic;color:var(--orchid)}
.hero p{font-family:'Cormorant Garamond';font-size:clamp(18px,2.4vw,26px);font-style:italic;color:#d9c9f0;margin:26px auto 0;max-width:520px}
.hero .btn{margin-top:44px;display:inline-block;border:1px solid #ffffff40;color:#efe6ff;padding:16px 40px;text-decoration:none;font-size:13px;letter-spacing:.24em;text-transform:uppercase;transition:background .3s,color .3s}
.hero .btn:hover{background:#efe6ff;color:var(--night)}
.collection{padding:clamp(70px,10vw,140px) clamp(20px,5vw,64px);max-width:1200px;margin:0 auto}
.collection .head{text-align:center;margin-bottom:70px}
.collection .head .pre{font-size:12px;letter-spacing:.4em;text-transform:uppercase;color:var(--lilac)}
.collection h2{font-family:'Cormorant Garamond';font-weight:400;font-size:clamp(34px,5vw,64px);margin:14px 0 0;letter-spacing:.01em}
.scents{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:2px;background:#ffffff14}
.scent{background:var(--night);padding:0;text-align:center;position:relative}
.scent .ph{height:340px;position:relative;overflow:hidden}
.scent .ph::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,${c[0]})}
.scent .b{padding:26px 24px 40px;margin-top:-40px;position:relative;z-index:3}
.scent .no{font-size:12px;letter-spacing:.3em;color:var(--lilac)}
.scent h3{font-family:'Cormorant Garamond';font-weight:400;font-size:30px;margin:10px 0 8px;letter-spacing:.03em}
.scent .notes{font-style:italic;font-family:'Cormorant Garamond';font-size:17px;color:#c4b1e0}
.scent .price{margin-top:16px;font-size:14px;letter-spacing:.14em;color:#efe6ff}
.quote{position:relative;text-align:center;padding:clamp(80px,12vw,160px) 24px;overflow:hidden}
.quote .doodle-wrap{opacity:.5}
.quote::after{content:'';position:absolute;inset:0;background:${c[0]}b0}
.quote blockquote{position:relative;z-index:3;font-family:'Cormorant Garamond';font-style:italic;font-weight:400;font-size:clamp(26px,4.5vw,52px);max-width:840px;margin:0 auto;line-height:1.24}
footer{border-top:1px solid #ffffff1a;padding:56px clamp(20px,5vw,64px);display:flex;justify-content:space-between;flex-wrap:wrap;gap:18px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#a892c4}
footer .logo{font-family:'Cormorant Garamond';font-size:20px;letter-spacing:.28em;color:#efe6ff}
@media(max-width:720px){.nav ul{display:none}}
`,
      body: `
<nav class="nav">
  <div class="logo">Nocturne</div>
  <ul><li><a href="#collection">Collection</a></li><li><a href="#">The House</a></li><li><a href="#">Discovery Set</a></li></ul>
</nav>
<header class="hero">
  <div class="doodle-wrap">${art({ slug: 'veil', palette: P('amethyst'), options: { grid: '10x15', frequency: 1 }, seed: 'NOCT9' })}</div>
  <div class="hero-inner">
    <div class="pre">Eau de Parfum · Extrait</div>
    <h1>After<em>dark</em></h1>
    <p>Fragrance composed for the small hours — when the city quiets and scent speaks loudest.</p>
    <a class="btn" href="#collection">Discover the collection</a>
  </div>
</header>
<section class="collection" id="collection">
  <div class="head"><div class="pre">The Maison Collection</div><h2>Seven hours of night</h2></div>
  <div class="scents">
    ${[
      ['N° 01', 'Velvet Hour', 'iris · suede · black plum', '£165', 'n1', '8x12'],
      ['N° 02', 'Midnight Bloom', 'tuberose · incense · amber', '£180', 'n2', '10x15'],
      ['N° 03', 'Last Train', 'vetiver · smoke · bergamot', '£150', 'n3', '9x13'],
    ].map(([no, n, notes, price, seed, grid]) => `
    <article class="scent">
      <div class="ph">${art({ slug: 'veil', palette: P('amethyst'), options: { grid, frequency: 1 }, seed })}</div>
      <div class="b"><div class="no">${no}</div><h3>${n}</h3><div class="notes">${notes}</div><div class="price">${price} · 50ml</div></div>
    </article>`).join('')}
  </div>
</section>
<section class="quote">
  <div class="doodle-wrap">${art({ slug: 'veil', palette: P('amethyst'), options: { grid: '12x18', frequency: 1 }, seed: 'QNOCT' })}</div>
  <blockquote>“A perfume is a memory you can wear before it happens.”</blockquote>
</section>
<footer>
  <div class="logo">Nocturne</div>
  <div>© 2026 Maison Nocturne · Composed with Tabbied — Amethyst palette</div>
</footer>
`,
    });
  },
});

// ===========================================================================
// 08 — Shoreline · coastal architecture studio · Ocean · awning
// ===========================================================================
sites.push({
  dir: '08-shoreline',
  name: 'Shoreline',
  topic: 'Coastal architecture studio',
  palette: PAL.ocean,
  artwork: 'awning',
  html: () => {
    const c = P('ocean');
    return shell({
      title: 'Shoreline — Coastal Architecture Studio',
      description: 'An architecture studio designing calm, durable homes for the coast.',
      favicon: '⛵',
      bg: c[2],
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">`,
      css: `
:root{--deep:${c[0]};--slate:${c[1]};--foam:${c[2]};--teal:${c[3]}}
body{font-family:'Outfit',system-ui,sans-serif;color:${c[0]}}
.nav{display:flex;justify-content:space-between;align-items:center;padding:26px clamp(20px,5vw,72px)}
.nav .logo{font-family:'Spectral';font-weight:500;font-size:22px;letter-spacing:.08em}
.nav ul{display:flex;gap:32px;list-style:none;margin:0;padding:0;font-size:14px;font-weight:400}
.nav a{text-decoration:none;opacity:.75}
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:84vh}
.hero-art{position:relative;overflow:hidden;background:var(--deep)}
.hero-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(30px,5vw,90px) clamp(24px,5vw,72px)}
.hero .pre{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--teal);margin-bottom:24px}
.hero h1{font-family:'Spectral';font-weight:300;font-size:clamp(40px,6vw,80px);line-height:1.04;margin:0;letter-spacing:-.01em}
.hero h1 b{font-weight:500}
.hero p{font-size:18px;line-height:1.7;color:${c[1]};max-width:420px;margin:26px 0 0}
.hero .metae{margin-top:40px;display:flex;gap:40px}
.hero .metae div .n{font-family:'Spectral';font-size:32px}
.hero .metae div .l{font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:${c[1]}}
.work{padding:clamp(60px,9vw,120px) clamp(24px,5vw,72px);max-width:1200px;margin:0 auto}
.work .head{display:flex;justify-content:space-between;align-items:end;flex-wrap:wrap;gap:16px;margin-bottom:46px}
.work h2{font-family:'Spectral';font-weight:400;font-size:clamp(28px,4.5vw,48px);margin:0}
.work .head p{margin:0;max-width:340px;color:${c[1]};font-size:15px}
.projects{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2px;background:${c[0]}18}
.pj{position:relative;overflow:hidden;background:#fff}
.pj .ph{height:300px;position:relative;overflow:hidden}
.pj .b{padding:24px 26px 30px;display:flex;justify-content:space-between;align-items:baseline}
.pj .n{font-family:'Spectral';font-size:24px;font-weight:400}
.pj .loc{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--teal)}
.pj .yr{color:${c[1]};font-size:14px}
.wide{position:relative;min-height:400px;display:grid;place-items:center;overflow:hidden;margin:0 clamp(12px,3vw,40px)}
.wide .doodle-wrap{opacity:.92}
.wide::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,${c[0]}aa,${c[0]}33 50%,${c[0]}aa)}
.wide .in{position:relative;z-index:3;text-align:center;color:var(--foam);padding:0 24px;max-width:640px}
.wide h2{font-family:'Spectral';font-weight:300;font-size:clamp(28px,4.5vw,52px);margin:0 0 18px}
.wide a{display:inline-block;border:1px solid #ffffff55;color:var(--foam);padding:14px 34px;text-decoration:none;font-size:13px;letter-spacing:.16em;text-transform:uppercase}
footer{background:var(--deep);color:#b9cade;padding:60px clamp(24px,5vw,72px);display:flex;justify-content:space-between;flex-wrap:wrap;gap:18px;font-size:14px;margin-top:clamp(40px,6vw,80px)}
footer .logo{font-family:'Spectral';color:var(--foam);font-size:20px}
@media(max-width:820px){.hero{grid-template-columns:1fr}.hero-art{min-height:300px;order:-1}.nav ul{display:none}}
`,
      body: `
<nav class="nav">
  <div class="logo">SHORELINE</div>
  <ul><li><a href="#work">Work</a></li><li><a href="#">Studio</a></li><li><a href="#">Approach</a></li><li><a href="#">Contact</a></li></ul>
</nav>
<header class="hero">
  <div class="hero-copy">
    <div class="pre">Architecture · Est. 2008</div>
    <h1>Houses that <b>hold the weather</b> and let in the light.</h1>
    <p>We design durable, low-slung homes for the coast — buildings that weather beautifully and sit lightly on the land.</p>
    <div class="metae"><div><div class="n">60+</div><div class="l">Completed homes</div></div><div><div class="n">3</div><div class="l">RIBA awards</div></div></div>
  </div>
  <div class="hero-art">${art({ slug: 'awning', palette: P('ocean'), options: { grid: '7x11', frequency: 1 }, seed: 'SHORE' })}</div>
</header>
<section class="work" id="work">
  <div class="head"><h2>Selected work</h2><p>A decade of coastline, from single cabins to civic pavilions.</p></div>
  <div class="projects">
    ${[
      ['Salt House', 'Whitstable, UK', '2024', 'w1', '6x8'],
      ['Dune Pavilion', 'Cape Cod, US', '2023', 'w2', '8x10'],
      ['Harbour Rooms', 'Sagres, PT', '2022', 'w3', '7x9'],
      ['Tidal Studio', 'Bantry, IE', '2021', 'w4', '6x8'],
    ].map(([n, loc, yr, seed, grid]) => `
    <article class="pj">
      <div class="ph">${art({ slug: 'awning', palette: P('ocean'), options: { grid, frequency: 1 }, seed })}</div>
      <div class="b"><div><div class="loc">${loc}</div><div class="n">${n}</div></div><div class="yr">${yr}</div></div>
    </article>`).join('')}
  </div>
</section>
<section class="wide">
  <div class="doodle-wrap">${art({ slug: 'awning', palette: P('ocean'), options: { grid: '10x16', frequency: 1 }, seed: 'WIDESH' })}</div>
  <div class="in"><h2>Building something by the water?</h2><a href="#">Start a conversation</a></div>
</section>
<footer>
  <div class="logo">Shoreline</div>
  <div>© 2026 Shoreline Studio · Awning pattern by Tabbied — Ocean palette</div>
</footer>
`,
    });
  },
});

// ===========================================================================
// 09 — Pixel Playhouse · indie game studio · Vaporwave · tetro
// ===========================================================================
sites.push({
  dir: '09-pixel-playhouse',
  name: 'Pixel Playhouse',
  topic: 'Indie game studio',
  palette: PAL.vaporwave,
  artwork: 'tetro',
  html: () => {
    const c = P('vaporwave');
    return shell({
      title: 'Pixel Playhouse — Indie Game Studio',
      description: 'A tiny indie studio making cozy, colourful games about small worlds.',
      favicon: '🕹️',
      bg: c[0],
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Chivo:wght@400;600;800&display=swap" rel="stylesheet">`,
      css: `
:root{--purple:${c[0]};--pink:${c[1]};--orchid:${c[2]};--sky:${c[3]};--lav:${c[4]}}
body{font-family:'Chivo',system-ui,sans-serif;color:#f4ecff}
.nav{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;justify-content:space-between;align-items:center;padding:20px clamp(20px,5vw,64px)}
.nav .logo{font-family:'Press Start 2P';font-size:14px;color:var(--sky);text-shadow:2px 2px 0 var(--pink)}
.nav ul{display:flex;gap:26px;list-style:none;margin:0;padding:0;font-weight:600;font-size:14px}
.nav a{text-decoration:none;opacity:.9}
.nav .wish{background:var(--pink);color:#2d0a45;padding:10px 18px;border-radius:8px;font-weight:800;box-shadow:3px 3px 0 #00000040}
.hero{position:relative;min-height:100vh;display:grid;place-items:center;overflow:hidden;background:linear-gradient(180deg,${c[0]},#1a0530)}
.hero .doodle-wrap{opacity:.85}
.hero::after{content:'';position:absolute;inset:0;background:radial-gradient(80% 70% at 50% 42%,transparent,${c[0]}cc 72%)}
.hero-inner{position:relative;z-index:5;text-align:center;padding:0 24px}
.hero .badge{font-family:'Press Start 2P';font-size:11px;color:var(--sky);letter-spacing:.02em;margin-bottom:28px}
.hero h1{font-family:'Press Start 2P';font-size:clamp(30px,8vw,86px);line-height:1.15;margin:0;color:#fff;text-shadow:4px 4px 0 var(--pink),8px 8px 0 var(--purple)}
.hero p{font-size:clamp(16px,2vw,20px);max-width:520px;margin:34px auto 0;color:#d9c9f0;line-height:1.6}
.hero .row{display:flex;gap:16px;justify-content:center;margin-top:40px;flex-wrap:wrap}
.btn{font-family:'Chivo';font-weight:800;padding:15px 30px;border-radius:10px;text-decoration:none;box-shadow:4px 4px 0 #00000050}
.btn.pink{background:var(--pink);color:#2d0a45}
.btn.sky{background:var(--sky);color:#0a2540}
.games{padding:clamp(60px,9vw,120px) clamp(20px,5vw,64px);max-width:1200px;margin:0 auto}
.games h2{font-family:'Press Start 2P';font-size:clamp(18px,3vw,30px);margin:0 0 40px;color:var(--orchid)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:26px}
.game{border-radius:16px;overflow:hidden;background:#20083a;border:2px solid ${c[2]}55;box-shadow:6px 6px 0 #00000040;transition:transform .2s}
.game:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 #00000050}
.game .ph{aspect-ratio:16/10;position:relative;overflow:hidden;image-rendering:pixelated}
.game .b{padding:18px 20px 22px}
.game .status{font-family:'Press Start 2P';font-size:9px;color:var(--sky)}
.game h3{font-size:22px;font-weight:800;margin:12px 0 6px}
.game p{margin:0;color:#c0aede;font-size:14px}
.strip{background:${c[1]};color:#2d0a45;font-family:'Press Start 2P';font-size:12px;padding:14px 0;overflow:hidden;white-space:nowrap}
.strip span{padding:0 18px}
.news{padding:clamp(50px,8vw,100px) clamp(20px,5vw,64px);max-width:820px;margin:0 auto;text-align:center}
.news h2{font-family:'Press Start 2P';font-size:clamp(16px,2.6vw,24px);color:var(--sky);margin:0 0 16px}
.news p{color:#d0bfec;font-size:17px;line-height:1.6;margin:0 0 26px}
.news form{display:flex;gap:10px;max-width:420px;margin:0 auto;flex-wrap:wrap;justify-content:center}
.news input{flex:1;min-width:200px;padding:14px 18px;border-radius:10px;border:2px solid ${c[2]};background:#20083a;color:#fff;font-family:'Chivo';font-size:15px}
footer{padding:50px clamp(20px,5vw,64px);text-align:center;color:#a892c4;font-size:14px;border-top:2px solid ${c[2]}33}
footer .logo{font-family:'Press Start 2P';font-size:12px;color:var(--sky);display:block;margin-bottom:12px}
@media(max-width:720px){.nav ul{display:none}}
`,
      body: `
<nav class="nav">
  <div class="logo">PLAYHOUSE</div>
  <ul><li><a href="#games">Games</a></li><li><a href="#">Studio</a></li><li><a href="#">Devlog</a></li></ul>
  <a class="wish" href="#">♥ Wishlist</a>
</nav>
<header class="hero">
  <div class="doodle-wrap">${art({ slug: 'tetro', palette: P('vaporwave'), options: { grid: '9x14', frequency: 1 }, seed: 'PLAY8' })}</div>
  <div class="hero-inner">
    <div class="badge">▶ NOW IN EARLY ACCESS</div>
    <h1>SUNSET<br>SUBURBIA</h1>
    <p>A cozy little life-sim about a town that only exists at dusk. Grow a garden, meet the neighbours, keep the streetlights on.</p>
    <div class="row"><a class="btn pink" href="#">▶ Play the demo</a><a class="btn sky" href="#games">See our games</a></div>
  </div>
</header>
<div class="strip"><span>★ PLAYHOUSE ARCADE ★ MADE BY 3 FRIENDS ★ NO CRUNCH, JUST VIBES ★ SOUNDTRACK ON BANDCAMP ★ PLAYHOUSE ARCADE ★ MADE BY 3 FRIENDS ★ SOUNDTRACK ON BANDCAMP ★</span></div>
<section class="games" id="games">
  <h2>OUR GAMES</h2>
  <div class="grid">
    ${[
      ['OUT NOW', 'Sunset Suburbia', 'Dusk-only cozy life sim.', 'g1', '7x11'],
      ['DEMO', 'Neon Courier', 'A rooftop delivery roguelite.', 'g2', '8x12'],
      ['2027', 'Tidepool', 'Build a reef, one creature at a time.', 'g3', '6x10'],
      ['ARCHIVE', 'Blockparty', 'The falling-blocks game we started with.', 'g4', '9x14'],
    ].map(([status, n, p, seed, grid]) => `
    <article class="game">
      <div class="ph">${art({ slug: 'tetro', palette: P('vaporwave'), options: { grid, frequency: 1 }, seed })}</div>
      <div class="b"><div class="status">${status}</div><h3>${n}</h3><p>${p}</p></div>
    </article>`).join('')}
  </div>
</section>
<section class="news">
  <h2>JOIN THE PLAYHOUSE</h2>
  <p>Devlogs, wallpapers, and the odd free prototype — about one email a month, no spam ever.</p>
  <form onsubmit="return false"><input type="email" placeholder="you@email.com" aria-label="Email"><button class="btn pink" type="submit">Sign up</button></form>
</section>
<footer>
  <span class="logo">PIXEL PLAYHOUSE</span>
  © 2026 Pixel Playhouse · Tetro pattern by Tabbied — Vaporwave palette
</footer>
`,
    });
  },
});

// ===========================================================================
// 10 — Roast & Co · coffee roaster · Espresso · halftone
// ===========================================================================
sites.push({
  dir: '10-roast-and-co',
  name: 'Roast & Co',
  topic: 'Specialty coffee roaster',
  palette: PAL.espresso,
  artwork: 'halftone',
  html: () => {
    const c = P('espresso');
    return shell({
      title: 'Roast & Co — Specialty Coffee Roasters',
      description: 'A specialty coffee roaster shipping small-lot beans roasted to order.',
      favicon: '☕',
      bg: c[0],
      fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;800&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">`,
      css: `
:root{--cream:${c[0]};--coffee:${c[1]};--dark:${c[2]};--tan:${c[3]}}
body{font-family:'Work Sans',system-ui,sans-serif;color:${c[2]}}
.nav{display:flex;justify-content:space-between;align-items:center;padding:22px clamp(20px,5vw,64px);position:relative;z-index:10}
.nav .logo{font-family:'Playfair Display';font-weight:800;font-size:24px;letter-spacing:-.01em}
.nav ul{display:flex;gap:30px;list-style:none;margin:0;padding:0;font-size:15px;font-weight:500}
.nav a{text-decoration:none;opacity:.8}
.nav .bag{background:var(--dark);color:var(--cream);padding:10px 20px;border-radius:6px;font-weight:600;font-size:14px}
.hero{position:relative;min-height:86vh;display:flex;align-items:center;overflow:hidden;background:var(--dark)}
.hero .doodle-wrap{opacity:.9}
.hero::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,${c[2]}f0 30%,${c[2]}70 60%,transparent)}
.hero-inner{position:relative;z-index:4;padding:0 clamp(24px,6vw,90px);max-width:620px;color:var(--cream)}
.hero .pre{font-size:13px;letter-spacing:.26em;text-transform:uppercase;color:var(--tan);margin-bottom:22px}
.hero h1{font-family:'Playfair Display';font-weight:800;font-size:clamp(44px,8vw,96px);line-height:.98;margin:0;letter-spacing:-.02em}
.hero h1 em{font-style:italic;font-weight:500;color:var(--tan)}
.hero p{font-size:18px;line-height:1.7;color:#e6ddd0;max-width:440px;margin:26px 0 34px}
.btn{display:inline-block;background:var(--tan);color:${c[2]};padding:15px 32px;border-radius:6px;text-decoration:none;font-weight:600}
.btn.ghost{background:transparent;border:1px solid #ffffff44;color:var(--cream);margin-left:12px}
.vals{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));border-bottom:1px solid ${c[1]}22}
.vals div{padding:34px clamp(20px,4vw,44px);border-right:1px solid ${c[1]}18}
.vals .n{font-family:'Playfair Display';font-weight:800;font-size:20px;color:var(--coffee)}
.vals p{margin:8px 0 0;color:#6a5544;font-size:15px;line-height:1.5}
.shop{padding:clamp(60px,9vw,120px) clamp(20px,5vw,64px);max-width:1200px;margin:0 auto}
.shop .head{text-align:center;margin-bottom:52px}
.shop .pre{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--coffee)}
.shop h2{font-family:'Playfair Display';font-weight:800;font-size:clamp(30px,5vw,54px);margin:12px 0 0;letter-spacing:-.01em}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:26px}
.bag{background:#fff;border:1px solid ${c[1]}20;border-radius:14px;overflow:hidden;transition:transform .3s,box-shadow .3s}
.bag:hover{transform:translateY(-5px);box-shadow:0 24px 44px -26px ${c[2]}88}
.bag .ph{aspect-ratio:4/5;position:relative;overflow:hidden;background:var(--dark)}
.bag .b{padding:20px 22px 24px}
.bag .origin{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--coffee);font-weight:600}
.bag h3{font-family:'Playfair Display';font-weight:600;font-size:23px;margin:8px 0 6px}
.bag .notes{color:#7a6553;font-size:14px;margin:0 0 14px}
.bag .row{display:flex;justify-content:space-between;align-items:center}
.bag .price{font-weight:600;font-size:17px}
.bag .roast{font-size:12px;color:#9a8674}
.band{position:relative;min-height:320px;display:grid;place-items:center;overflow:hidden}
.band .doodle-wrap{opacity:.85}
.band::after{content:'';position:absolute;inset:0;background:${c[2]}cc}
.band .in{position:relative;z-index:3;text-align:center;color:var(--cream);padding:0 24px;max-width:600px}
.band h2{font-family:'Playfair Display';font-weight:500;font-style:italic;font-size:clamp(26px,4.5vw,46px);margin:0 0 20px}
.band a{display:inline-block;background:var(--tan);color:${c[2]};padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600}
footer{background:var(--dark);color:#d8c8b6;padding:58px clamp(20px,5vw,64px);display:flex;justify-content:space-between;flex-wrap:wrap;gap:18px;font-size:14px}
footer .logo{font-family:'Playfair Display';font-weight:800;color:var(--cream);font-size:22px}
@media(max-width:720px){.nav ul{display:none}}
`,
      body: `
<nav class="nav">
  <div class="logo">Roast &amp; Co.</div>
  <ul><li><a href="#shop">Shop</a></li><li><a href="#">Subscriptions</a></li><li><a href="#">Wholesale</a></li><li><a href="#">Our Roastery</a></li></ul>
  <a class="bag" href="#">Bag · 1</a>
</nav>
<header class="hero">
  <div class="doodle-wrap">${art({ slug: 'halftone', palette: P('espresso'), options: { grid: '11x16', frequency: 1 }, seed: 'ROAST' })}</div>
  <div class="hero-inner">
    <div class="pre">Small-lot · Roasted to order</div>
    <h1>Coffee with a <em>sense of place.</em></h1>
    <p>We source single-origin lots from growers we know by name and roast them in small batches the day before they ship.</p>
    <a class="btn" href="#shop">Shop the beans</a><a class="btn ghost" href="#">Start a subscription</a>
  </div>
</header>
<div class="vals">
  <div><div class="n">Roasted to order</div><p>Every bag leaves the roastery within 24 hours.</p></div>
  <div><div class="n">Direct trade</div><p>Long relationships, prices above fair-trade floors.</p></div>
  <div><div class="n">Traceable lots</div><p>Farm, altitude, and process printed on every bag.</p></div>
</div>
<section class="shop" id="shop">
  <div class="head"><div class="pre">The Current Lineup</div><h2>This month's roasts</h2></div>
  <div class="grid">
    ${[
      ['Ethiopia', 'Guji Highlands', 'blueberry · jasmine · honey', '$21', 'Light', 'c1', '8x12'],
      ['Colombia', 'Huila Reserve', 'cocoa · red apple · caramel', '$19', 'Medium', 'c2', '9x13'],
      ['Guatemala', 'Antigua Reserve', 'toffee · orange · almond', '$20', 'Med-Dark', 'c3', '10x14'],
      ['Kenya', 'Nyeri AA', 'blackcurrant · tomato · sugar', '$23', 'Light', 'c4', '8x12'],
    ].map(([origin, n, notes, price, roast, seed, grid]) => `
    <article class="bag">
      <div class="ph">${art({ slug: 'halftone', palette: P('espresso'), options: { grid, frequency: 1 }, seed })}</div>
      <div class="b"><div class="origin">${origin}</div><h3>${n}</h3><p class="notes">${notes}</p><div class="row"><span class="price">${price}</span><span class="roast">${roast} roast</span></div></div>
    </article>`).join('')}
  </div>
</section>
<section class="band">
  <div class="doodle-wrap">${art({ slug: 'halftone', palette: P('espresso'), options: { grid: '14x20', frequency: 1 }, seed: 'BANDC' })}</div>
  <div class="in"><h2>Fresh beans on your counter every other Friday.</h2><a href="#">Build your subscription</a></div>
</section>
<footer>
  <div class="logo">Roast &amp; Co.</div>
  <div>© 2026 Roast &amp; Co. · Halftone pattern by Tabbied — Espresso palette</div>
</footer>
`,
    });
  },
});

// ---------------------------------------------------------------------------
// Write out each site + a gallery index.
// ---------------------------------------------------------------------------
for (const site of sites) {
  const dir = path.join(OUT, site.dir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), site.html());
  console.log('wrote', path.relative(OUT, path.join(dir, 'index.html')));
}

// Gallery landing page (also uses a Tabbied artwork in its own hero).
const galleryCard = ({ href, n, name, topic, paletteName, colors, artwork, seed }) => {
  const swatches = colors.map((col) => `<span style="background:${col}"></span>`).join('');
  const thumb = art({ slug: artwork, palette: colors, options: { grid: '5x4' }, seed });
  return `
  <a class="card" href="${href}">
    <div class="thumb">${thumb}</div>
    <div class="cbody">
      <div class="ci"><span class="num">${String(n).padStart(2, '0')}</span><h3>${name}</h3></div>
      <p>${topic}</p>
      <div class="foot"><div class="sw">${swatches}</div><div class="pn">${paletteName} · ${artwork}</div></div>
    </div>
  </a>`;
};

const staticCards = sites
  .map((s, i) =>
    galleryCard({
      href: `./${s.dir}/index.html`,
      n: i + 1,
      name: s.name,
      topic: s.topic,
      paletteName: s.palette.name,
      colors: s.palette.colors,
      artwork: s.artwork,
      seed: `IDX${i}`,
    })
  )
  .join('');

// The ten React-component sites live as Next routes at /showcase/<slug>/ (see
// components/showcase/ + app/showcase/). Their metadata is mirrored here so the
// gallery can list all twenty builds in one place; the thumbnails are rendered
// with the same static engine, and each card links to the live React page.
const reactSites = [
  { slug: 'solstice', name: 'Solstice', topic: 'Yoga & wellness retreat', artwork: 'petal', paletteName: 'Sunset', colors: ['#2b1d3a', '#ff6b6b', '#ffd23e', '#ff3d8b', '#7048e8'] },
  { slug: 'harbor-and-vine', name: 'Harbor & Vine', topic: 'Natural wine bar', artwork: 'quilt', paletteName: 'Cranberry', colors: ['#fbeef1', '#9e1946', '#e63946', '#1d3557'] },
  { slug: 'lumen', name: 'Lumen', topic: 'Design & tech conference', artwork: 'spectrum', paletteName: 'Arcade', colors: ['#12002e', '#ff2079', '#00e5ff', '#f9f871', '#7a04eb'] },
  { slug: 'fathom', name: 'Fathom', topic: 'Ocean research nonprofit', artwork: 'lattice', paletteName: 'Lagoon', colors: ['#04252b', '#0d9488', '#5eead4', '#fef9c3'] },
  { slug: 'ember-and-oak', name: 'Ember & Oak', topic: 'Wood-fire restaurant', artwork: 'windowpane', paletteName: 'Ember', colors: ['#1a0f0a', '#e0511f', '#ff9f1c', '#ffe8c7'] },
  { slug: 'petal-and-post', name: 'Petal & Post', topic: 'Florist & stationery studio', artwork: 'frond', paletteName: 'Blush', colors: ['#fff0f3', '#ff8fab', '#c9184a', '#590d22'] },
  { slug: 'northwind', name: 'Northwind', topic: 'Outdoor apparel brand', artwork: 'maze', paletteName: 'Forest', colors: ['#1e2d24', '#6ca31c', '#e7fce3', '#c9a227'] },
  { slug: 'honeycomb', name: 'Honeycomb', topic: "Kids' learning app", artwork: 'bokeh', paletteName: 'Honey', colors: ['#fff9e6', '#f6c343', '#b8860b', '#3a2f0b'] },
  { slug: 'facet', name: 'Facet', topic: 'Fine jewelry brand', artwork: 'prisma', paletteName: 'Jewel', colors: ['#0b1021', '#5b2a86', '#2176ae', '#57b8ff', '#fbb13c'] },
  { slug: 'seabright', name: 'Seabright', topic: 'Coastal skincare line', artwork: 'metro', paletteName: 'Seaglass', colors: ['#f2fbf7', '#9ad1c9', '#5f9ea0', '#33576b'] },
];

const reactCards = reactSites
  .map((s, i) =>
    galleryCard({
      href: `/showcase/${s.slug}/`,
      n: i + 11,
      name: s.name,
      topic: s.topic,
      paletteName: s.paletteName,
      colors: s.colors,
      artwork: s.artwork,
      seed: `RCT${i}`,
    })
  )
  .join('');

const index = shell({
  title: 'Made with Tabbied — 20 Sample Websites',
  description: 'Twenty sample websites showing how Tabbied generative artworks work as design accents — ten static HTML builds and ten built with the TabbiedArtwork React component.',
  favicon: '🎨',
  bg: '#0e0e13',
  assets: './assets',
  fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@600;800&display=swap" rel="stylesheet">`,
  css: `
body{font-family:'Space Grotesk',system-ui,sans-serif;color:#eef0f6}
.hero{position:relative;min-height:64vh;display:grid;place-items:center;overflow:hidden;text-align:center;border-bottom:1px solid #ffffff12}
.hero .doodle-wrap{opacity:.5}
.hero::after{content:'';position:absolute;inset:0;background:radial-gradient(100% 90% at 50% 30%,transparent,#0e0e13cc 60%,#0e0e13)}
.hero-inner{position:relative;z-index:4;padding:80px 24px}
.hero .pre{font-size:13px;letter-spacing:.4em;text-transform:uppercase;color:#3fffb2;margin-bottom:24px}
.hero h1{font-family:'Sora';font-weight:800;font-size:clamp(40px,8vw,104px);line-height:.94;margin:0;letter-spacing:-.03em}
.hero h1 span{background:linear-gradient(96deg,#3eecff,#3fffb2 45%,#ff3d8b);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{max-width:620px;margin:26px auto 0;color:#b8bdd0;font-size:clamp(15px,2vw,19px);line-height:1.6}
.wrap{max-width:1240px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,48px)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:26px}
.card{text-decoration:none;color:inherit;background:#16161f;border:1px solid #ffffff10;border-radius:18px;overflow:hidden;transition:transform .3s,border-color .3s}
.card:hover{transform:translateY(-6px);border-color:#3fffb2}
.thumb{position:relative;height:190px;overflow:hidden}
.cbody{padding:20px 22px 24px}
.ci{display:flex;align-items:baseline;gap:12px}
.ci .num{font-family:'Sora';font-weight:800;color:#4a4f66;font-size:15px}
.ci h3{font-family:'Sora';font-weight:600;font-size:22px;margin:0}
.cbody p{margin:8px 0 18px;color:#9297b0;font-size:15px}
.foot{display:flex;justify-content:space-between;align-items:center;gap:12px}
.sw{display:flex;gap:5px}
.sw span{width:16px;height:16px;border-radius:50%;box-shadow:inset 0 0 0 1px #ffffff20}
.pn{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6d7290}
.group{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin:0 0 24px}
.group.two{margin-top:64px}
.group h2{font-family:'Sora';font-weight:800;font-size:clamp(22px,3vw,30px);margin:0;letter-spacing:-.01em}
.group .tag{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#3fffb2;border:1px solid #3fffb2aa;padding:5px 10px;border-radius:100px}
.group p{margin:0;color:#9297b0;font-size:15px;flex:1 1 260px}
.group code{font-family:ui-monospace,Menlo,monospace;color:#cfd3e6;font-size:13px}
footer{text-align:center;padding:50px 24px;color:#797e98;font-size:14px;border-top:1px solid #ffffff10}
footer a{color:#3fffb2}
`,
  body: `
<header class="hero">
  <div class="doodle-wrap">${art({ slug: 'spectrum', palette: PAL.neon.colors, options: { grid: '8x14', frequency: 1 }, seed: 'GAL01' })}</div>
  <div class="hero-inner">
    <div class="pre">Made with Tabbied</div>
    <h1>Twenty sites,<br><span>one pattern engine.</span></h1>
    <p>Each of these sample websites uses a <strong>Tabbied</strong> generative artwork as its main design accent, themed end-to-end with a single palette from the library. Ten are self-contained HTML; ten are built with the <code>TabbiedArtwork</code> React component. Same engine, twenty completely different moods.</p>
  </div>
</header>
<div class="wrap">
  <div class="group">
    <h2>Static HTML builds</h2><span class="tag">HTML</span>
    <p>Self-contained pages that embed the css-doodle engine directly.</p>
  </div>
  <div class="grid">${staticCards}</div>
  <div class="group two">
    <h2>React component builds</h2><span class="tag">React</span>
    <p>Live Next.js pages rendered with the <code>TabbiedArtwork</code> component.</p>
  </div>
  <div class="grid">${reactCards}</div>
</div>
<footer>
  Built with <a href="https://tabbied.com">Tabbied</a> · generative artworks powered by css-doodle. Open any card to view the full site.
</footer>
`,
});
fs.writeFileSync(path.join(OUT, 'index.html'), index);
console.log('wrote index.html');

// Copy the vendored css-doodle runtime into the output so the live pages have
// no external dependency (the source of truth is samples/assets/).
const assetsOut = path.join(OUT, 'assets');
fs.mkdirSync(assetsOut, { recursive: true });
fs.copyFileSync(
  path.join(__dirname, 'assets', 'css-doodle.min.js'),
  path.join(assetsOut, 'css-doodle.min.js')
);
console.log('copied assets/css-doodle.min.js');
console.log('done —', sites.length, 'sites →', path.relative(path.resolve(__dirname, '..'), OUT));
