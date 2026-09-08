import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import type { Env } from '../env';
import { hashText, loadPackagedHtml, loadTemplateSpec } from '../lib/templateAssets';

// The packaged template, read through the assets binding the way the sites
// route reads it. The binding applies `html_handling`, and the default answers
// a request for `/dir/index.html` with a redirect to `/dir/` rather than the
// file. Whether the binding then follows that redirect is a property of the
// runtime, not of this code: workerd did here, so the request came back 200
// with a different URL, and the route that asked by file name looked fine
// locally. The reader therefore asks for the directory URL, which is served
// outright, and copes with a redirect if one is handed back anyway.

const ORIGIN = 'https://tabbied.com';
const SLUG = 'verdant';
const request = new Request(`${ORIGIN}/api/studio/sites`, { method: 'POST' });

describe('the packaged page through the binding', () => {
  it('is served under its directory URL; the file name is a redirect', async () => {
    const byDirectory = await env.ASSETS.fetch(`${ORIGIN}/downloads/${SLUG}/`);
    expect(byDirectory.status).toBe(200);
    expect(new URL(byDirectory.url).pathname).toBe(`/downloads/${SLUG}/`);
    expect(await byDirectory.text()).toContain('data-pattern');

    // Asked for by file name, the answer is the directory URL's: whether the
    // runtime followed the redirect (as here) or handed it back, the request
    // did not get the file under the name it asked for.
    const byFile = await env.ASSETS.fetch(`${ORIGIN}/downloads/${SLUG}/index.html`);
    const followed = byFile.status === 200 && new URL(byFile.url).pathname === `/downloads/${SLUG}/`;
    const handedBack = byFile.status >= 300 && byFile.status < 400;
    expect(followed || handedBack).toBe(true);
  });

  it('loads the page and its spec, and hashes what a browser would download', async () => {
    const html = await loadPackagedHtml(env, request, SLUG);
    expect(html).toContain('data-pattern');

    const spec = await loadTemplateSpec(env, request, SLUG);
    expect(spec.site.slug).toBe(SLUG);

    const direct = await (await env.ASSETS.fetch(`${ORIGIN}/downloads/${SLUG}/`)).text();
    expect(await hashText(html)).toBe(await hashText(direct));
  });

  it('follows a redirect the binding hands back, on the same origin only', async () => {
    const seen: string[] = [];
    const fake = {
      ASSETS: {
        fetch: async (input: Request | string) => {
          const url = new URL(typeof input === 'string' ? input : input.url);
          seen.push(url.pathname);

          if (url.pathname === '/downloads/redirected/') {
            return new Response(null, { status: 307, headers: { location: '/downloads/final/' } });
          }
          if (url.pathname === '/downloads/final/') {
            return new Response('<html data-pattern></html>', { status: 200 });
          }
          if (url.pathname === '/downloads/elsewhere/') {
            return new Response(null, { status: 307, headers: { location: 'https://evil.test/x' } });
          }
          if (url.pathname === '/downloads/loop/') {
            return new Response(null, { status: 307, headers: { location: '/downloads/loop/' } });
          }
          return new Response('nope', { status: 404 });
        },
      },
    } as unknown as Env;

    expect(await loadPackagedHtml(fake, request, 'redirected')).toContain('data-pattern');
    expect(seen).toEqual(['/downloads/redirected/', '/downloads/final/']);

    await expect(loadPackagedHtml(fake, request, 'elsewhere')).rejects.toThrow(/off-site/);
    await expect(loadPackagedHtml(fake, request, 'loop')).rejects.toThrow(/more than/);
  });

  it('names a template that is not packaged', async () => {
    await expect(loadPackagedHtml(env, request, 'no-such-template')).rejects.toThrow(/404/);
  });
});
