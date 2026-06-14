<p align="center">
  <img src="https://user-images.githubusercontent.com/1064036/102738324-5c79f900-430f-11eb-8403-c4c8aa786dc9.png" alt="Tabbied Logo" width="80" />
</p>
<h1 align="center">Tabbied</h1>
<p align="center">
  <a href="https://deepscan.io/dashboard#view=project&tid=10181&pid=14972&bid=290677"><img src="https://deepscan.io/api/teams/10181/projects/14972/branches/290677/badge/grade.svg" alt="DeepScan grade"></a>
  <a href="https://www.codacy.com/gh/subwaymatch/tabbied/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=subwaymatch/tabbied&amp;utm_campaign=Badge_Grade"><img src="https://app.codacy.com/project/badge/Grade/40c0ce7aab95429aa5660d0db16fe353"/></a>
</p>

Tabbied lets you easily create timeless and beautifully generated patterns or artwork to use for wall art, websites, print materials and more. Under the hood, Tabbied uses <a href="https://css-doodle.com/">&lt;css-doodle /&gt;</a> to generate the artworks.

Try it at **[tabbied.com](https://tabbied.com)**.

![tabbied_patterns_screenshot](https://user-images.githubusercontent.com/1064036/102739688-6e5d9b00-4313-11eb-88b9-c3ddb11c04b3.jpg)

## 📦 What's in this repo

Tabbied is an [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) monorepo with two parts:

- **The website** (repo root) — the [Next.js](https://nextjs.org/) app behind [tabbied.com](https://tabbied.com), where you browse, customize, reseed, and export the designs.
- **The [`tabbied`](./packages/tabbied) package** — the generative engine as a published, framework-agnostic library with an optional React component. The site renders every design through this package, so it doubles as the package's integration test.

## 🎨 Using the `tabbied` package

Render any of the generative designs in your own app:

```bash
npm install tabbied
```

```tsx
import { TabbiedArtwork } from 'tabbied/react';
import { radius } from 'tabbied/artworks';

export function Example() {
  return (
    <TabbiedArtwork artwork={radius} fit="cover" style={{ width: '100%', height: 320 }} />
  );
}
```

Presets are imported individually, so your bundle only includes the designs you actually use. See the **[package README](./packages/tabbied/README.md)** for the full API, the framework-agnostic core, and exporting to PNG.

## 🚀 Developing locally

To develop locally, clone the repository, run `npm install`, and start the dev server with `npm run dev`:

```bash
# Clone repository
git clone https://github.com/subwaymatch/tabbied.git

# CD into tabbied
cd tabbied

# Install dependencies
npm install

# Run development server (builds the workspace package first, then starts Next.js)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The designs live as JSON in [`packages/tabbied/artworks/`](./packages/tabbied/artworks) — the package's codegen turns them into a typed module that both the site and the published package consume, so adding a new design is just a new JSON file.

## ✅ Testing

End-to-end smoke tests run with [Playwright](https://playwright.dev/) against a
production build:

```bash
# Install the browser once
npx playwright install chromium

# Build and run the e2e tests
npm run build
npm run test:e2e
```

## 🔨 Built by

Designed by <a href="https://www.syunghong.com/">Syung Hong</a>, developed by <a href="https://park.is">Ye Joo Park</a>.


## ❤️ Thanks to

Thanks to <a href="https://yuanchuan.dev/">Yuan Chaun</a>, the developer of <a href="https://css-doodle.com/">&lt;css-doodle /&gt;</a>.
