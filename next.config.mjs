/** @type {import('next').NextConfig} */

// The whole site is prerenderable (every route is built from the local
// patterns/ folder; interactivity is client-side), so it ships as a pure
// static export. On Cloudflare Workers that means out/ is uploaded as static
// assets and served straight off the network as files, without invoking the
// Worker at all - see wrangler.jsonc, and worker/index.ts for the two paths
// that do reach code.
//
// Consequences handled elsewhere:
//  - Response headers can't come from next.config in export mode; they live in
//    public/_headers, which Next copies to out/ and wrangler reads.
//  - The /_next/image optimizer doesn't exist in export mode, so the marketing
//    images are pre-sized into public/images by scripts/optimize-images.mjs.
//  - `next start` can't serve an export; `npm start` runs `serve out` (and
//    `npm run preview` runs the real Worker over the same folder).
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Emit every page as <route>/index.html so any static file server (and the
  // mixed trailing/non-trailing hrefs already in the app) resolve cleanly.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
