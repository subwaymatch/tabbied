// Plain-CSS counterpart of components/showcase/ShowcaseSite.module.css, used by
// the static-HTML sample sites. Everything themes off CSS custom properties
// (--bg, --c1, --ink, --card, --soft, --line, --onC1, --display, --body) that
// generate.mjs sets per site, so one stylesheet dresses all ten brands.
export const SHOWCASE_CSS = `
*,*::before,*::after{box-sizing:border-box}
.site{min-height:100vh;background:var(--bg);color:var(--ink);font-family:var(--body);overflow-x:hidden}
.site a{color:inherit}
css-doodle{display:block;width:100%;height:100%}
.doodle-box{position:relative;overflow:hidden}
.abs{position:absolute;inset:0;overflow:hidden}

.nav{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px clamp(20px,5vw,64px);position:relative;z-index:20}
.logo{font-family:var(--display);font-weight:700;font-size:23px;letter-spacing:-.01em;text-decoration:none}
.navlinks{display:flex;gap:28px;list-style:none;margin:0;padding:0;font-size:14px;font-weight:500}
.navlinks a{text-decoration:none;opacity:.82}
.navcta{padding:10px 20px;border-radius:100px;background:var(--c1);color:var(--onC1);text-decoration:none;font-weight:600;font-size:14px}
@media(max-width:760px){.navlinks{display:none}}

.btn{display:inline-block;padding:15px 30px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;border:1px solid transparent;cursor:pointer}
.btn-solid{background:var(--c1);color:var(--onC1)}
.btn-ghost{background:transparent;border-color:currentColor;opacity:.85}
.cta-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-top:36px}
.cta-center{justify-content:center}
.eyebrow{font-size:13px;letter-spacing:.24em;text-transform:uppercase;color:var(--c1);margin-bottom:22px;font-weight:600}

.section{max-width:1200px;margin:0 auto;padding:clamp(60px,9vw,120px) clamp(20px,5vw,64px)}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:44px}
.section-head h2{font-family:var(--display);font-weight:600;font-size:clamp(28px,5vw,52px);letter-spacing:-.02em;margin:0}
.section-head p{margin:0;max-width:340px;opacity:.7;font-size:15px}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:24px}
.card{border-radius:18px;overflow:hidden;background:var(--card);border:1px solid var(--line);transition:transform .3s ease}
.card:hover{transform:translateY(-6px)}
.card-media{aspect-ratio:4/3;position:relative;overflow:hidden}
.card-body{padding:18px 20px 22px}
.card-eyebrow{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--c1);font-weight:600}
.card-body h3{font-family:var(--display);font-weight:600;font-size:21px;margin:8px 0 6px}
.card-meta{opacity:.65;font-size:14px}

.imgph{position:absolute;inset:0;margin:0;display:flex;border-bottom:1px solid var(--line);
  background:radial-gradient(120% 120% at 100% 0,color-mix(in srgb,var(--c1) 22%,transparent),transparent 60%),var(--soft)}
.imgph-in{margin:auto;padding:16px 18px;text-align:center;max-width:92%}
.imgph-badge{display:inline-block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--c1);
  border:1px solid color-mix(in srgb,var(--c1) 55%,transparent);border-radius:100px;padding:4px 10px;margin-bottom:12px}
.imgph-text{margin:0;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:12px;line-height:1.5;opacity:.75;
  display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
.imgph-copy{margin-top:14px;font:inherit;font-size:12px;font-weight:600;letter-spacing:.02em;color:var(--onC1);background:var(--c1);border:none;border-radius:100px;padding:7px 16px;cursor:pointer;transition:opacity .2s}
.imgph-copy:hover{opacity:.88}

.stat-strip{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.stat-strip>div{padding:30px clamp(20px,4vw,48px);border-right:1px solid var(--line)}
.stat-strip>div:last-child{border-right:none}
.stat-n{font-family:var(--display);font-size:32px;font-weight:600}
.stat-l{font-size:13px;letter-spacing:.12em;text-transform:uppercase;opacity:.6;margin-top:6px}

.about{max-width:1200px;margin:0 auto;padding:clamp(60px,9vw,120px) clamp(20px,5vw,64px);display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(30px,5vw,70px);align-items:center}
.about.rev .about-copy{order:2}
.about-copy h2{font-family:var(--display);font-weight:600;font-size:clamp(28px,4.5vw,48px);letter-spacing:-.02em;margin:0 0 20px}
.about-copy p{font-size:17px;line-height:1.7;opacity:.8;margin:0 0 16px;max-width:52ch}
.points{list-style:none;margin:24px 0 0;padding:0;display:grid;gap:10px}
.points li{position:relative;padding-left:26px;font-size:15.5px}
.points li::before{content:"";position:absolute;left:0;top:.5em;width:10px;height:10px;border-radius:3px;background:var(--c1)}
.about-art{position:relative;overflow:hidden;border-radius:18px;aspect-ratio:4/5;border:1px solid var(--line);background:var(--c1)}
@media(max-width:820px){.about{grid-template-columns:1fr}.about.rev .about-copy{order:0}.about-art{aspect-ratio:16/10}}

.features{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--soft)}
.feat-grid{max-width:1200px;margin:0 auto;padding:clamp(40px,6vw,72px) clamp(20px,5vw,64px);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:clamp(24px,4vw,48px)}
.feat-num{font-family:var(--display);font-weight:700;font-size:15px;color:var(--c1);letter-spacing:.08em}
.feat h3{font-family:var(--display);font-weight:600;font-size:21px;margin:10px 0 8px}
.feat p{margin:0;opacity:.72;font-size:15px;line-height:1.6}

.testi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.testi{margin:0;padding:30px 32px;border-radius:18px;background:var(--card);border:1px solid var(--line)}
.testi blockquote{margin:0 0 18px;font-family:var(--display);font-size:clamp(19px,2.4vw,25px);line-height:1.35;letter-spacing:-.01em}
.testi .q-name{font-weight:600;font-size:15px;display:block}
.testi .q-role{font-size:13px;opacity:.6}

.band{position:relative;min-height:360px;display:grid;place-items:center;overflow:hidden;margin:clamp(40px,6vw,80px) 0 0}
.band-scrim{position:absolute;inset:0;background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 82%,transparent),color-mix(in srgb,var(--bg) 40%,transparent) 50%,color-mix(in srgb,var(--bg) 82%,transparent))}
.band-in{position:relative;z-index:3;text-align:center;padding:0 24px;max-width:640px}
.band-in h2{font-family:var(--display);font-weight:600;font-size:clamp(28px,4.6vw,50px);letter-spacing:-.02em;margin:0 0 24px;line-height:1.08}

.newsletter{padding:clamp(56px,8vw,104px) clamp(20px,5vw,64px)}
.news-in{max-width:620px;margin:0 auto;text-align:center}
.news-in h2{font-family:var(--display);font-weight:600;font-size:clamp(28px,4.4vw,46px);letter-spacing:-.02em;margin:0 0 12px}
.news-in p{opacity:.75;font-size:17px;margin:0 0 26px}
.news-form{display:flex;gap:10px;max-width:440px;margin:0 auto;flex-wrap:wrap;justify-content:center}
.news-form input{flex:1 1 220px;padding:14px 18px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);font-family:var(--body);font-size:15px}

.footer{padding:48px 0 40px;font-size:14px;border-top:1px solid var(--line)}
.foot-top{max-width:1200px;margin:0 auto;padding:0 clamp(20px,5vw,64px) 26px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;border-bottom:1px solid var(--line)}
.foot-top .logo{opacity:1}
.foot-nav{display:flex;gap:24px;flex-wrap:wrap;font-size:14px}
.foot-nav a{text-decoration:none;opacity:.75}
.foot-bottom{max-width:1200px;margin:0 auto;padding:22px clamp(20px,5vw,64px) 0;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13px;opacity:.6}
.em{color:var(--c1);font-style:inherit}

/* Split hero */
.split-hero{display:grid;grid-template-columns:1.02fr .98fr;align-items:stretch;min-height:82vh}
.split-hero.rev .split-copy{order:2}
.split-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(36px,6vw,96px) clamp(24px,5vw,72px)}
.split-copy h1{font-family:var(--display);font-weight:600;font-size:clamp(40px,6.4vw,82px);line-height:1.02;letter-spacing:-.02em;margin:0}
.split-copy .lede{font-size:18px;line-height:1.7;opacity:.78;max-width:440px;margin:26px 0 0}
.split-art{position:relative;overflow:hidden;background:var(--c1);min-height:320px}
@media(max-width:820px){.split-hero{grid-template-columns:1fr}.split-hero.rev .split-copy{order:0}.split-art{min-height:300px}}

/* Spotlight hero */
.spot-hero{position:relative;min-height:100vh;display:grid;place-items:center;overflow:hidden;text-align:center}
.spot-scrim{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 42%,color-mix(in srgb,var(--bg) 34%,transparent) 0,color-mix(in srgb,var(--bg) 78%,transparent) 55%,var(--bg) 100%)}
.spot-in{position:relative;z-index:5;padding:0 24px;max-width:900px}
.spot-in h1{font-family:var(--display);font-weight:800;font-size:clamp(46px,10vw,128px);line-height:.94;letter-spacing:-.03em;margin:0}
.spot-in .lede{max-width:560px;margin:28px auto 0;font-size:clamp(16px,2vw,19px);line-height:1.6;opacity:.82}
.marquee{overflow:hidden;white-space:nowrap;padding:15px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--bg)}
.marquee span{font-family:var(--display);font-weight:800;font-size:22px;letter-spacing:.02em;padding:0 20px;color:var(--c1)}
.marquee span i{color:var(--ink);opacity:.35;font-style:normal}

/* Editorial */
.ed-mast{display:flex;justify-content:space-between;align-items:center;padding:16px clamp(20px,5vw,64px);border-bottom:2px solid var(--ink);font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
.ed-title{text-align:center;padding:30px 20px 20px;border-bottom:1px solid var(--ink)}
.ed-title h1{font-family:var(--display);font-weight:700;font-size:clamp(40px,9vw,118px);letter-spacing:-.02em;line-height:.92;margin:0}
.ed-title .lede{font-style:italic;opacity:.72;margin:12px 0 0;font-size:clamp(14px,2vw,20px)}
.ed-nav{display:flex;gap:26px;justify-content:center;flex-wrap:wrap;padding:12px;border-bottom:2px solid var(--ink);font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:600}
.ed-nav a{text-decoration:none}
.ed-cover{position:relative;height:clamp(300px,44vw,560px);overflow:hidden;border-bottom:2px solid var(--ink)}
.ed-cap{position:absolute;z-index:3;left:0;right:0;bottom:0;padding:clamp(20px,4vw,44px);background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--bg) 92%,transparent))}
.ed-cap .k{color:var(--c1);font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:13px}
.ed-cap h2{font-family:var(--display);font-weight:700;font-size:clamp(26px,4vw,46px);margin:8px 0 0;letter-spacing:-.01em}

/* Boutique */
.bout-hero{position:relative;min-height:96vh;display:grid;place-items:center;overflow:hidden;text-align:center}
.bout-scrim{position:absolute;inset:0;background:radial-gradient(92% 82% at 50% 44%,color-mix(in srgb,var(--bg) 30%,transparent),color-mix(in srgb,var(--bg) 82%,transparent) 68%,var(--bg))}
.bout-in{position:relative;z-index:4;padding:0 24px;max-width:820px}
.bout-in h1{font-family:var(--display);font-weight:500;font-size:clamp(52px,12vw,170px);line-height:.9;letter-spacing:.01em;margin:0}
.bout-in .lede{font-family:var(--display);font-style:italic;font-size:clamp(18px,2.4vw,26px);opacity:.82;max-width:520px;margin:24px auto 0}
.bout-in .eyebrow{letter-spacing:.42em}
.bout-btn{margin-top:40px;display:inline-block;border:1px solid currentColor;padding:15px 40px;text-decoration:none;font-size:13px;letter-spacing:.22em;text-transform:uppercase;opacity:.9}
`;
