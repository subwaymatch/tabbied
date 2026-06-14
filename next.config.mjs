/** @type {import('next').NextConfig} */

// The whole site is prerenderable (every route is built from the local
// artworks/ folder; interactivity is client-side), so it ships as a pure
// static export. On Vercel that means pages are served straight from the CDN
// as files — zero function invocations, zero ISR cache reads/writes — instead
// of App Router's default prerender-behind-a-function serving.
//
// Consequences handled elsewhere:
//  - Response headers can't come from next.config in export mode; they live in
//    vercel.json.
//  - The /_next/image optimizer doesn't exist in export mode, so the marketing
//    images are pre-sized into public/images by scripts/optimize-images.mjs.
//  - `next start` can't serve an export; `npm start` now runs `serve out`.
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
