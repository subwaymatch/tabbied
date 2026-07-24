// Section + kit styles for the static sample sites, mirroring the additions in
// components/showcase/ShowcaseSite.module.css. Concatenated after SHOWCASE_CSS.
export const SHOWCASE_CSS_EXTRA = `
/* New sections */
.manifesto{position:relative;overflow:hidden;padding:clamp(96px,14vw,200px) clamp(20px,5vw,64px);text-align:center;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.manifesto-in{position:relative;z-index:2;max-width:900px;margin:0 auto}
.manifesto-in p{font-family:var(--display);font-weight:500;font-size:clamp(26px,4.6vw,52px);line-height:1.18;letter-spacing:-.02em;margin:0}

.alt-rows{max-width:1200px;margin:0 auto;padding:clamp(58px,8vw,124px) clamp(20px,5vw,64px);display:grid;gap:clamp(30px,5vw,72px)}
.alt-row{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,64px);align-items:center}
.alt-row.rev .alt-copy{order:2}
.alt-copy h3{font-family:var(--display);font-weight:600;font-size:clamp(24px,3.4vw,38px);letter-spacing:-.02em;margin:0 0 14px}
.alt-copy p{font-size:17px;line-height:1.7;opacity:.8;margin:0;max-width:46ch}
.alt-media{position:relative;aspect-ratio:4/3;border-radius:18px;overflow:hidden;border:1px solid var(--line)}
@media(max-width:820px){.alt-row{grid-template-columns:1fr}.alt-row.rev .alt-copy{order:0}}

.icon-feat{max-width:1200px;margin:0 auto;padding:clamp(70px,9vw,130px) clamp(20px,5vw,64px)}
.icon-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:clamp(28px,4vw,52px)}
.icon-wrap{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:12px;background:color-mix(in srgb,var(--c1) 16%,transparent);color:var(--c1);margin-bottom:16px}
.icon-wrap svg{width:24px;height:24px}
.icon-item h3{font-family:var(--display);font-weight:600;font-size:20px;margin:0 0 8px}
.icon-item p{margin:0;opacity:.72;font-size:15px;line-height:1.6}

.gallery{max-width:1200px;margin:0 auto;padding:clamp(58px,8vw,116px) clamp(20px,5vw,64px)}
.gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.gallery-cell{position:relative;aspect-ratio:1;border-radius:14px;overflow:hidden;border:1px solid var(--line)}
.gallery-cell:nth-child(4n+1){aspect-ratio:4/5}

.big-quote{position:relative;overflow:hidden;min-height:470px;display:grid;place-items:center;padding:clamp(84px,11vw,172px) 24px}
.big-quote-scrim{position:absolute;inset:0;background:color-mix(in srgb,var(--bg) 74%,transparent)}
.big-quote-in{position:relative;z-index:2;text-align:center;max-width:900px;margin:0}
.big-quote-in blockquote{font-family:var(--display);font-weight:500;font-size:clamp(24px,4vw,46px);line-height:1.24;letter-spacing:-.02em;margin:0 0 20px}
.big-quote-in figcaption{font-size:15px;font-weight:600}
.big-quote-in figcaption span{opacity:.6;font-weight:400}

.stat-band{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1px;background:var(--c1);color:var(--onC1)}
.stat-band>div{padding:clamp(30px,5vw,54px) clamp(20px,4vw,40px);background:var(--c1);text-align:center}
.stat-band-n{font-family:var(--display);font-weight:700;font-size:clamp(32px,5vw,52px);letter-spacing:-.02em}
.stat-band-l{font-size:13px;letter-spacing:.12em;text-transform:uppercase;opacity:.85;margin-top:8px}

.faq-head{max-width:1200px;margin:0 auto;padding:0 clamp(20px,5vw,64px)}
.faq-head h2{font-family:var(--display);font-weight:600;font-size:clamp(28px,5vw,48px);letter-spacing:-.02em;margin:0 0 24px}
.faq-list{max-width:820px;margin:0 auto;padding:0 clamp(20px,5vw,64px)}
.faq-item{border-top:1px solid var(--line);padding:20px 0}
.faq-item:last-child{border-bottom:1px solid var(--line)}
.faq-item summary{cursor:pointer;font-family:var(--display);font-weight:600;font-size:19px;list-style:none;display:flex;justify-content:space-between;gap:16px}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:"+";color:var(--c1);font-weight:400}
.faq-item[open] summary::after{content:"\\2013"}
.faq-item p{margin:14px 0 0;opacity:.75;font-size:16px;line-height:1.6;max-width:60ch}

.logos{max-width:1200px;margin:0 auto;padding:clamp(36px,5vw,60px) clamp(20px,5vw,64px);text-align:center;border-bottom:1px solid var(--line)}
.logos-label{font-size:12px;letter-spacing:.22em;text-transform:uppercase;opacity:.5}
.logos-row{display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(20px,4vw,52px);margin-top:18px;font-family:var(--display);font-weight:700;font-size:clamp(15px,2vw,20px);letter-spacing:.04em;opacity:.55}

/* Kits */
.kit-soft .card{border:none;border-radius:22px;box-shadow:0 18px 40px -26px rgba(0,0,0,.55)}
.kit-soft .btn{border-radius:100px}
.kit-soft .about-art,.kit-soft .alt-media{border-radius:24px}
.kit-soft .testi,.kit-soft .news-form input{border-radius:18px}

.kit-editorial .card{background:transparent;border:none;border-radius:0}
.kit-editorial .card-media{border:1px solid var(--ink);border-radius:0}
.kit-editorial .card-body{padding-left:2px;padding-right:2px}
.kit-editorial .btn{border-radius:2px}
.kit-editorial .about-art,.kit-editorial .alt-media,.kit-editorial .gallery-cell{border-radius:0;border-color:var(--ink)}
.kit-editorial .testi{border-radius:0}

.kit-brutal .card{border:2px solid var(--ink);border-radius:0;box-shadow:5px 5px 0 var(--ink);background:var(--bg)}
.kit-brutal .card:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 var(--ink)}
.kit-brutal .btn{border-radius:0;border:2px solid var(--ink)}
.kit-brutal .btn-solid{box-shadow:4px 4px 0 var(--ink)}
.kit-brutal .about-art,.kit-brutal .alt-media,.kit-brutal .gallery-cell,.kit-brutal .testi,.kit-brutal .icon-wrap,.kit-brutal .news-form input{border-radius:0}
.kit-brutal .icon-wrap{border:2px solid var(--ink);background:transparent}
.kit-brutal .testi{border:2px solid var(--ink)}

.kit-bordered .card{border:1px solid var(--line);border-radius:8px;box-shadow:none}
.kit-bordered .btn{border-radius:8px}
.kit-bordered .about-art,.kit-bordered .alt-media,.kit-bordered .gallery-cell,.kit-bordered .testi{border-radius:8px}

.kit-minimal .card{background:transparent;border:none;border-radius:0;box-shadow:none}
.kit-minimal .card-body{padding-left:0;padding-right:0}
.kit-minimal .card-media,.kit-minimal .about-art,.kit-minimal .alt-media,.kit-minimal .gallery-cell{border-radius:0}
.kit-minimal .btn-solid{background:transparent;color:var(--c1);border:1px solid var(--c1)}
.kit-minimal .testi{background:transparent;border:none;border-top:1px solid var(--line);border-radius:0;padding-left:0;padding-right:0}
.kit-minimal .news-form input{border-radius:0}
`;
