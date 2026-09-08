// Packages a template site as a downloadable, framework-free HTML template.
//
// The static export is the source of truth: `next build` already renders every
// template page to complete HTML, so a template is derived from that rather
// than hand-ported. A hand-port is four artefacts per site to keep in step,
// and within two edits the download and the live site disagree - which is why
// this whole file reads out/ instead of any source tree (see the
// "Downloadable templates" section of CLAUDE.md).
//
// What comes out is a folder somebody can open from the filesystem and edit:
//
//   werkraum/
//     index.html          the export, minus the Next runtime, plain class names
//     styles/base.css     the site's global reset, verbatim
//     styles/werkraum.css the page's own stylesheet - the authored source file,
//                         comments and all, NOT the minified build output
//     images/             only the images this page references
//     README.md
//
// The stylesheet is the point worth spelling out. The build emits minified CSS
// with hashed class names (.werkraum-module__N8Ibmq__page), which is unreadable
// in a template. Rather than un-minify and de-hash that, this copies the
// *authored* module file - which is already the clean, commented stylesheet a
// person should be editing - and rewrites the hashed names in the HTML back to
// the plain ones the authored file already uses.
//
// Usage:
//   node scripts/package-templates.mjs                # every packageable site
//   node scripts/package-templates.mjs werkraum       # one site
//   node scripts/package-templates.mjs --out-dir dist/downloads
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const exportDir = path.join(repoRoot, 'out');
const templateDir = path.join(repoRoot, 'app', 'template');
const publicDir = path.join(repoRoot, 'public');
const globalsCss = path.join(repoRoot, 'styles', 'globals.css');

// Sites the packager knowingly can't handle. Listed (rather than left to
// fail) so a *new* failure is a real signal: anything not in here that throws
// exits non-zero, which is what makes this safe to wire into a build.
// Currently empty - all 57 sites package.
const KNOWN_UNSUPPORTED = new Map();

// ---- archiving -----------------------------------------------------------

// What `zip -qr <name>.zip <dir>` did, in-process.
//
// This used to shell out to the `zip` binary, which is on GitHub Actions'
// runner and on most developer machines but is NOT in Cloudflare's Workers
// Builds image - that image ships `unzip` and not `zip`. So CI stayed green
// while the deploy died with `spawn zip ENOENT` on all 57 sites, which is the
// same shape of failure the two-pass build exists to prevent: the packaging
// step is the one part of the build whose output nothing else validates.
//
// Deriving the download from the export is supposed to assume nothing about
// the host, and a binary on
// PATH is an assumption. fflate is a zero-dependency deflate/zip
// implementation, so the archive is written by the same Node that walked the
// tree and there is no host tool left to be missing.
//
// Archived from the *parent* so the zip expands into a named folder rather
// than scattering files into the download directory - hence `dirName` being
// relative to `parentDir` and forming the first path segment of every entry.
async function zipDirectory(parentDir, dirName, zipName) {
  /** @type {Record<string, [Uint8Array, { mtime: Date }]>} */
  const entries = {};

  // Zip entry names are always POSIX-separated, whatever the host uses.
  const entryName = (relativePath) => relativePath.split(path.sep).join('/');

  const walk = async (relativeDir) => {
    const absoluteDir = path.join(parentDir, relativeDir);
    // A directory gets an entry of its own - zero bytes, name ending in `/` -
    // exactly as `zip -r` writes one. For a directory with children this is
    // redundant (every extractor creates parents on the way to a file), but
    // for an *empty* one it is the only record that it existed, and 10 of the
    // 57 sites reference no images: without this their `images/` (and the
    // React package's `public/`) silently vanish from the download while the
    // README still lists them.
    entries[`${entryName(relativeDir)}/`] = [
      new Uint8Array(0),
      { mtime: (await fs.stat(absoluteDir)).mtime },
    ];

    const dirents = await fs.readdir(absoluteDir, { withFileTypes: true });
    for (const dirent of dirents) {
      const relativePath = path.join(relativeDir, dirent.name);
      if (dirent.isDirectory()) {
        await walk(relativePath);
        continue;
      }
      const absolutePath = path.join(parentDir, relativePath);
      entries[entryName(relativePath)] = [
        await fs.readFile(absolutePath),
        // Carry the real mtime across, as `zip -r` did. Without this fflate
        // stamps every entry with the time the archive was written.
        { mtime: (await fs.stat(absolutePath)).mtime },
      ];
    }
  };

  await walk(dirName);

  const target = path.join(parentDir, zipName);
  await fs.rm(target, { force: true });
  // level 6 is both `zip`'s default and fflate's, so the archives stay the
  // size the /templates copy quotes.
  await fs.writeFile(target, zipSync(entries, { level: 6 }));

  return (await fs.stat(target)).size;
}

// ---- HTML surgery --------------------------------------------------------

// Everything Next.js needs to hydrate and nothing a static page does: the
// runtime chunks, the RSC flight payload inlined in <script>, and the
// stylesheet links that point into /_next/.
const stripNextRuntime = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<link[^>]*\bas="script"[^>]*>/g, '')
    .replace(/<link[^>]*href="\/_next\/[^"]*"[^>]*>/g, '');

// Tabbied's own favicons, manifest, tile and theme colour. They resolve
// against tabbied.com and would 404 in a template; the site's identity isn't
// the template's to carry either.
const stripSiteChrome = (html) =>
  html
    .replace(/<link[^>]*rel="manifest"[^>]*>/g, '')
    .replace(/<link[^>]*rel="(icon|apple-touch-icon|mask-icon)"[^>]*>/g, '')
    .replace(/<meta[^>]*name="msapplication-TileColor"[^>]*>/g, '')
    .replace(/<meta[^>]*name="theme-color"[^>]*>/g, '');

// Traces of the renderer that mean nothing without it: Suspense boundary
// markers (matched exactly, so comments the page's author wrote survive),
// the empty div React parks them in, and the stylesheet-ordering attribute
// React uses to hoist <link>s.
const stripReactArtifacts = (html) =>
  html
    .replace(/<!--\/?\$[!?]?-->/g, '')
    .replace(/<div hidden(?:="")?>\s*<\/div>/g, '')
    .replace(/\s*data-precedence="[^"]*"/g, '');

/**
 * Rewrite hashed CSS-module class names back to the plain names the authored
 * stylesheet uses: `werkraum-module__N8Ibmq__heroTitle` -> `heroTitle`.
 *
 * Fails loudly on the two things that would silently corrupt a template: more
 * than one CSS module on the page (this ships exactly one stylesheet), and two
 * hashed names that collapse onto the same plain name (which would merge two
 * unrelated rules).
 */
function dehashClassNames(html, slug) {
  const hashedClass = /([A-Za-z0-9_-]+)-module__([A-Za-z0-9_]+)__([A-Za-z0-9_-]+)/g;
  const modules = new Set();
  const collisions = new Map();

  for (const [, moduleName, hash, localName] of html.matchAll(hashedClass)) {
    modules.add(`${moduleName}-module__${hash}__`);

    const seen = collisions.get(localName);
    const source = `${moduleName}__${hash}`;

    if (seen && seen !== source) {
      throw new Error(
        `${slug}: two CSS modules both define ".${localName}" - de-hashing ` +
          `would merge them. Package this site by hand or rename one.`
      );
    }

    collisions.set(localName, source);
  }

  if (modules.size > 1) {
    throw new Error(
      `${slug}: page uses ${modules.size} CSS modules (${[...modules].join(
        ', '
      )}). This packager ships one stylesheet per site.`
    );
  }

  return {
    html: html.replace(hashedClass, (_m, _module, _hash, localName) => localName),
    // Which module the page's classes came from, and which of its classes the
    // page actually uses - both needed to pick and trim the stylesheet.
    moduleName: [...modules][0]?.replace(/-module__[A-Za-z0-9_]+__$/, '') ?? null,
    usedClasses: new Set(collisions.keys()),
  };
}

/**
 * The stylesheet to ship, and whether it is this page's own.
 *
 * Most sites have an authored `<slug>.module.css` next to their page - that
 * file ships verbatim, comments and all. The five sites built on the shared
 * TemplateSite component have no per-page sheet; they use the component's,
 * which is shipped trimmed to what the page can match (see trimUnusedRules).
 */
async function resolveStylesheet(slug, moduleName) {
  const own = path.join(templateDir, slug, `${slug}.module.css`);

  try {
    return { css: await fs.readFile(own, 'utf-8'), shared: false };
  } catch {
    // Fall through to the shared component sheet the page's classes came from.
  }

  if (!moduleName) {
    throw new Error(`${slug}: no CSS module on the page and no ${slug}.module.css`);
  }

  const sharedPath = path.join(
    repoRoot,
    'components',
    'template',
    `${moduleName}.module.css`
  );

  try {
    return { css: await fs.readFile(sharedPath, 'utf-8'), shared: true };
  } catch {
    throw new Error(
      `${slug}: page uses ${moduleName}.module.css, which isn't at ` +
        `${path.relative(repoRoot, sharedPath)}`
    );
  }
}

/**
 * Point every asset at the template's own folder, and report which files need
 * copying. The build appends a content hash (`?v=d9e0e0f1`) to bust the cache
 * behind a stable slug; a template served from disk doesn't need it.
 */
function rewriteImagePaths(html) {
  const used = new Set();

  const rewritten = html.replace(
    /\/images\/([A-Za-z0-9/_-]+\.(?:webp|png|jpg|jpeg|svg|avif))(\?v=[a-z0-9]+)?/g,
    (_match, relativePath) => {
      used.add(relativePath);
      return `./images/${path.basename(relativePath)}`;
    }
  );

  return { html: rewritten, used: [...used] };
}

/** The pattern slugs the page mounts, in first-appearance order. */
const patternSlugs = (html) => [
  ...new Set([...html.matchAll(/data-pattern="([a-z0-9]+)"/g)].map((m) => m[1])),
];

// ---- CSS -----------------------------------------------------------------

/**
 * The authored stylesheet, made valid outside the CSS-modules pipeline.
 *
 * `:global(img)` is a CSS-modules construct, not CSS - left in place a browser
 * drops the whole rule. Once class names are plain, the wrapper has nothing
 * left to do, so unwrapping it to `img` is exactly equivalent.
 *
 * `composes:` is a genuine transform (the composed declarations have to be
 * folded in, or the composed class added to the markup), so a site using it
 * fails here rather than shipping a stylesheet that quietly loses rules.
 */
function prepareStylesheet(css, slug, usedClasses) {
  return dropComposes(css, slug, usedClasses).replace(
    /:global\(([^)]*)\)/g,
    '$1'
  );
}

/**
 * Remove `composes:` declarations, having checked they were already resolved.
 *
 * `composes` needs no flattening here, which is easy to get wrong: CSS Modules
 * resolves a local `composes` in the *markup*, not the stylesheet. A rule
 * `.h2Light { composes: h2 }` compiles to `class="...__h2Light ...__h2"` on every
 * element that used it, and both rules are already in the sheet. So the
 * declaration is inert - it is simply not valid CSS outside the pipeline, and
 * dropping it leaves rendering untouched.
 *
 * That is a premise about the build's output, so it is verified rather than
 * assumed: if a page uses the composing class but its markup never picked up
 * the composed one, the assumption is wrong for that site and it fails here.
 * `composes: x from './other.css'` would pull in a second module, which the
 * one-module check in dehashClassNames already rejects before this runs.
 */
function dropComposes(css, slug, usedClasses) {
  const problems = [];

  // Rules with a `composes` are simple single-class blocks by definition -
  // CSS Modules rejects anything else - so a nesting-free block match is safe.
  const out = css.replace(
    /\.([A-Za-z0-9_-]+)([^{}]*)\{([^{}]*)\}/g,
    (rule, className, _rest, body) => {
      const declarations = [...body.matchAll(/composes\s*:\s*([^;}]+)/g)];

      if (declarations.length === 0) return rule;

      for (const [, value] of declarations) {
        for (const composed of value.trim().split(/\s+/)) {
          if (usedClasses.has(className) && !usedClasses.has(composed)) {
            problems.push(
              `.${className} composes .${composed}, but the markup carries ` +
                `only .${className} - the build did not resolve it`
            );
          }
        }
      }

      return rule.replace(/[ \t]*composes\s*:[^;}]+;?\n?/g, '');
    }
  );

  if (problems.length > 0) {
    throw new Error(`${slug}: ${problems.join('; ')}`);
  }

  return out;
}

/**
 * Drop rules that can never match the page.
 *
 * Only needed for the five sites that share TemplateSite.module.css: a
 * stylesheet written for every site in that collection carries ~45% rules for
 * layout kits the page in hand doesn't use, and shipping those in a download
 * called "this page's stylesheet" is misleading. A site with its own authored
 * sheet uses 100% of it and is left byte-for-byte alone.
 *
 * Conservative by construction: a rule is dropped only when it names at least
 * one class AND some class it needs is absent from the page. A selector with
 * no class at all (`html`, `:root`, `a:hover`) is always kept, because whether
 * it matches can't be decided from the class list. Selector lists are filtered
 * per-selector, so `.used, .dead` keeps `.used`.
 *
 * Safe here specifically because the packaged page has no framework: the only
 * script left is the pattern bootstrap, which sets inline styles, never
 * classes. Nothing can add a class after load. The pixel diff against the live
 * page is what proves it for real.
 */
function trimUnusedRules(css, usedClasses) {
  // Every class the selector requires. `.a.b .c:hover::after` -> a, b, c.
  const classesIn = (selector) =>
    [...selector.matchAll(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g)].map((m) => m[1]);

  const keepSelector = (selector) => {
    const classes = classesIn(selector);
    return classes.length === 0 || classes.every((c) => usedClasses.has(c));
  };

  // Scanning has to skip comments, not just count braces. This codebase
  // documents its CSS heavily and at least one comment contains a literal
  // `{ color: inherit }` as an example - counted naively, that desynchronises
  // the brace depth for the rest of the file and the output is silently wrong.
  const COMMENT = /\/\*[\s\S]*?\*\//g;

  // Index of the next `char` at top level, ignoring anything inside a comment.
  const scan = (source, from, chars) => {
    let index = from;

    while (index < source.length) {
      if (source[index] === '/' && source[index + 1] === '*') {
        const close = source.indexOf('*/', index + 2);
        index = close === -1 ? source.length : close + 2;
        continue;
      }
      if (chars.includes(source[index])) return index;
      index += 1;
    }

    return -1;
  };

  const walk = (source) => {
    let out = '';
    let index = 0;

    while (index < source.length) {
      const brace = scan(source, index, '{');

      if (brace === -1) {
        out += source.slice(index);
        break;
      }

      // Match the block this brace opens, comments excepted.
      let depth = 1;
      let end = brace + 1;
      while (end < source.length && depth > 0) {
        const next = scan(source, end, '{}');
        if (next === -1) { end = source.length; break; }
        depth += source[next] === '{' ? 1 : -1;
        end = next + 1;
      }

      const prelude = source.slice(index, brace);
      const body = source.slice(brace + 1, end - 1);
      // The selector is the prelude minus the comments sitting above it.
      const selectorText = prelude.replace(COMMENT, '').trim();

      if (/^@(media|supports|container|layer)/.test(selectorText)) {
        const inner = walk(body);
        // An at-rule whose every child was dropped goes with them.
        if (inner.trim()) out += `${prelude}{${inner}}`;
      } else if (selectorText.startsWith('@')) {
        out += `${prelude}{${body}}`; // @font-face, @keyframes: keep whole
      } else {
        const kept = selectorText
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean)
          .filter(keepSelector);

        if (kept.length) {
          // Keep the comments that documented this rule.
          const comments = (prelude.match(COMMENT) ?? []).join('\n');
          out += `\n${comments ? comments + '\n' : ''}${kept.join(',\n')} {${body}}\n`;
        }
      }

      index = end;
    }

    return out;
  };

  return walk(css);
}

// ---- React package -------------------------------------------------------

/**
 * The React format, as a copy rather than a port.
 *
 * The HTML package is derived from the export because the markup has to be -
 * there is no framework-free source to copy. React is the opposite case: a
 * template page is *already* a plain React component. The only Next.js API any
 * of the 57 uses is `export const metadata`, and there is no next/image,
 * next/link, 'use client' or generateStaticParams anywhere. So the page ships
 * as it was written, and what changes is only the frame around it.
 *
 * That also means the CSS needs no transform at all - Vite resolves
 * `.module.css` natively, so the authored stylesheet ships byte-for-byte with
 * its `composes:` and `:global()` intact and working. Only the HTML package,
 * which has no bundler, needs those flattened.
 */

// A page's non-relative imports, and where each one lands in the package.
// `tabbied/*` stay as npm deps; local components are copied in beside the page.
// Packages a template page may import that are *not* copied into the package
// as source, keyed to the range the scaffold should install. `tabbied` itself
// is always a dependency and is pinned separately, from the workspace version.
//
// `tabbied-templates` is here because the five shared-component sites carry the
// editable-section annotations, and the component derives its brand custom
// properties through that package (see docs/editable-templates.md).
const TEMPLATES_PACKAGE_VERSION = `^${
  JSON.parse(
    fsSync.readFileSync(
      path.join(repoRoot, 'packages', 'tabbied-templates', 'package.json'),
      'utf-8'
    )
  ).version
}`;

const EXTERNAL_DEPENDENCIES = new Map([
  ['lucide-react', '^1.17.0'],
  ['tabbied-templates', TEMPLATES_PACKAGE_VERSION],
]);

const LOCAL_IMPORTS = new Map([
  ['components/Figure', { from: 'components/Figure.tsx', to: 'Figure.tsx' }],
  ['components/template/TemplateSite', { from: 'components/template/TemplateSite.tsx', to: 'TemplateSite.tsx' }],
  ['components/template/templateData', { from: 'components/template/templateData.ts', to: 'templateData.ts' }],
  ['components/template/templateContent', { from: 'components/template/templateContent.ts', to: 'templateContent.ts' }],
  ['components/template/templateSections', { from: 'components/template/templateSections.ts', to: 'templateSections.ts' }],
  ['components/template/generatedImages', { from: 'components/template/generatedImages.ts', to: 'generatedImages.ts' }],
  ['components/template/ImageCard', { from: 'components/template/ImageCard.tsx', to: 'ImageCard.tsx' }],
]);

/** Strip the one Next-ism and point local imports at their copied neighbours. */
function toStandaloneComponent(source, componentName) {
  let out = source
    .replace(/^import type \{ Metadata \}[^\n]*\n/m, '')
    // `export const metadata = { ... };` - lifted into index.html instead.
    .replace(/^export const metadata(?::\s*Metadata)?\s*=\s*\{[\s\S]*?\n\};\n/m, '')
    .replace(/^export const metadata(?::\s*Metadata)?\s*=\s*\{[\s\S]*?\n\};\n/m, '');

  for (const [specifier, target] of LOCAL_IMPORTS) {
    out = out.replaceAll(`'${specifier}'`, `'./${target.to.replace(/\.tsx?$/, '')}'`);
  }

  out = out.replaceAll(`'lib/generated/images'`, `'./images'`);

  // The page's default export is the app's root component.
  out = out.replace(/export default function \w+\(/, `export default function ${componentName}(`);

  return out.replace(/\n{3,}/g, '\n\n').trimStart();
}

/**
 * Which local modules a set of sources pulls in, transitively.
 *
 * Two specifier shapes reach a local file. A page imports it by workspace path
 * (`components/template/TemplateSite`); that component then imports its
 * siblings relatively (`./templateContent`). Both are followed, and because
 * every copied module lands flat in `src/`, the relative ones already resolve
 * in the package - they only have to be *present*.
 */
function collectLocalImports(sources) {
  const needed = new Map();
  const queue = [...sources];

  const siblingsOf = (from) => {
    const dir = path.dirname(from);
    return [...LOCAL_IMPORTS.entries()].filter(
      ([, target]) => path.dirname(target.from) === dir
    );
  };

  while (queue.length > 0) {
    const { source, from } = queue.pop();
    const candidates = [
      ...LOCAL_IMPORTS.entries(),
      ...(from ? siblingsOf(from) : []),
    ];

    for (const [specifier, target] of candidates) {
      if (needed.has(specifier)) continue;

      const base = path.basename(target.from, path.extname(target.from));
      const byPath = new RegExp(`['"]${specifier}['"]`).test(source);
      const byRelative = new RegExp(`['"]\\./${base}['"]`).test(source);

      if (!byPath && !byRelative) continue;

      needed.set(specifier, target);
      queue.push({
        source: fsSync.readFileSync(path.join(repoRoot, target.from), 'utf-8'),
        from: target.from,
      });
    }
  }

  return needed;
}

const REACT_README = (slug, name, version) => `# ${name} - React template

The same page as the HTML download, as a Vite + React app.

\`\`\`bash
npm install
npm run dev
\`\`\`

\`\`\`
src/App.tsx              the page - edit this
src/${slug}.module.css${' '.repeat(Math.max(0, 12 - slug.length))} its stylesheet, a CSS module
src/main.tsx             mounts App
public/images/           the photography this page uses
\`\`\`

## The patterns

Blocks of pattern are \`<TabbiedPattern>\` elements from
[tabbied](https://www.npmjs.com/package/tabbied) (v${version}), rendered live by
[css-doodle](https://css-doodle.com/) - not images:

\`\`\`tsx
<TabbiedPattern pattern={ortho} palette={['transparent', '#C9C8C1']} fit="grid" />
\`\`\`

Swap \`pattern\` for any of the 254 designs (see https://tabbied.com), change
\`palette\` to recolour, or set \`seed\` to pin one arrangement.

## Images

The photography is AI-generated and ships with this template.
`;

async function packageReactSite(slug, outDir, version, name, images) {
  const pageSource = await fs.readFile(
    path.join(templateDir, slug, 'page.tsx'),
    'utf-8'
  );

  const locals = collectLocalImports([
    { source: pageSource, from: path.join('app/template', slug, 'page.tsx') },
  ]);
  const siteDir = path.join(outDir, `${slug}-react`);
  const srcDir = path.join(siteDir, 'src');

  await fs.rm(siteDir, { recursive: true, force: true });
  await fs.mkdir(srcDir, { recursive: true });
  await fs.mkdir(path.join(siteDir, 'public', 'images'), { recursive: true });

  await fs.writeFile(
    path.join(srcDir, 'App.tsx'),
    toStandaloneComponent(pageSource, 'App')
  );

  // Copied components keep their own local imports rewritten the same way.
  //
  // While reading them, note which external packages the shipped source
  // actually imports. A package that is imported but missing from the
  // scaffold's package.json fails at `npm install` time in somebody else's
  // folder, which is the worst place to find out - so this is derived from the
  // source rather than maintained by hand.
  const externals = new Set();
  const noteExternals = (source) => {
    for (const name of EXTERNAL_DEPENDENCIES.keys()) {
      if (new RegExp(`from '${name}(?:/[^']*)?'`).test(source)) {
        externals.add(name);
      }
    }
  };

  noteExternals(pageSource);

  for (const target of locals.values()) {
    const source = await fs.readFile(path.join(repoRoot, target.from), 'utf-8');
    noteExternals(source);
    await fs.writeFile(
      path.join(srcDir, target.to),
      toStandaloneComponent(source, path.basename(target.to, path.extname(target.to)))
    );
  }

  // Figure reads intrinsic dimensions from the site-wide manifest; ship only
  // the entries this page can ask for, so the template carries no other site.
  if (locals.has('components/Figure')) {
    const manifest = JSON.parse(
      (await fs.readFile(path.join(repoRoot, 'lib/generated/images.js'), 'utf-8'))
        .replace(/^[\s\S]*?export default /, '')
        .replace(/;\s*$/, '')
    );
    // Each entry keeps the `base` it has on the site (`/images/sites`), because
    // the images are copied in under the paths they already have - see the
    // copy loop below for why the React package can't flatten them.
    const mine = Object.fromEntries(
      Object.entries(manifest).filter(([id]) =>
        images.some((file) => path.basename(file, '.webp') === id)
      )
    );
    await fs.writeFile(
      path.join(srcDir, 'images.ts'),
      `// Intrinsic dimensions for this page's images, so it reserves layout\n` +
        `// space before they load. Trimmed from the site-wide manifest.\n` +
        `export default ${JSON.stringify(mine, null, 2)} as Record<string, { hash: string; width: number; height: number; base?: string }>;\n`
    );
  }

  // The page's own stylesheet, byte-for-byte - Vite handles CSS modules, so
  // nothing here needs the flattening the HTML package does.
  const own = path.join(templateDir, slug, `${slug}.module.css`);
  if (fsSync.existsSync(own)) {
    await fs.copyFile(own, path.join(srcDir, `${slug}.module.css`));
  }
  if (locals.has('components/template/TemplateSite')) {
    await fs.copyFile(
      path.join(repoRoot, 'components/template/TemplateSite.module.css'),
      path.join(srcDir, 'TemplateSite.module.css')
    );
  }

  await fs.copyFile(globalsCss, path.join(srcDir, 'base.css'));

  // Images keep the sub-path they have on the site - `sites/...`, `template/...` -
  // where the HTML package flattens them into one folder. The two formats
  // differ because of what each one ships: the HTML package rewrites the
  // markup, so it can put the files anywhere and point the `src` at them,
  // while the React package ships the page's *source*, which asks for its
  // images by the URL it was written with. Figure resolves one from the
  // manifest's `base` (`/images/sites/<id>.webp`) and ImageCard hardcodes
  // `/images/template/<id>.webp`; flattening 404s the second kind outright,
  // which is what emptied the five TemplateSite pages under `vite dev`.
  // Keeping the structure also means two same-named files from different
  // folders can't collide on the way in.
  for (const relativePath of images) {
    const destination = path.join(siteDir, 'public', 'images', relativePath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(path.join(publicDir, 'images', relativePath), destination);
  }

  const dependencies = {
    react: '^19.2.0',
    'react-dom': '^19.2.0',
    tabbied: `^${version}`,
    ...Object.fromEntries(
      [...externals].sort().map((name) => [name, EXTERNAL_DEPENDENCIES.get(name)])
    ),
  };

  await fs.writeFile(
    path.join(siteDir, 'package.json'),
    JSON.stringify(
      {
        name: `${slug}-template`,
        private: true,
        type: 'module',
        scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
        dependencies,
        devDependencies: {
          '@vitejs/plugin-react': '^5.0.0',
          typescript: '^5.9.0',
          vite: '^7.1.0',
        },
      },
      null,
      2
    ) + '\n'
  );

  await fs.writeFile(
    path.join(siteDir, 'vite.config.ts'),
    `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n`
  );

  await fs.writeFile(
    path.join(siteDir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          lib: ['DOM', 'DOM.Iterable', 'ES2020'],
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          skipLibCheck: true,
          allowImportingTsExtensions: true,
          noEmit: true,
          resolveJsonModule: true,
        },
        include: ['src'],
      },
      null,
      2
    ) + '\n'
  );

  await fs.writeFile(
    path.join(srcDir, 'main.tsx'),
    `import { StrictMode } from 'react';\n` +
      `import { createRoot } from 'react-dom/client';\n` +
      `import App from './App';\n` +
      `import './base.css';\n\n` +
      `createRoot(document.getElementById('root')!).render(\n` +
      `  <StrictMode>\n    <App />\n  </StrictMode>\n);\n`
  );

  // The <head> the page used to get from Next's metadata export.
  await fs.writeFile(
    path.join(siteDir, 'index.html'),
    `<!doctype html>\n<html lang="en">\n  <head>\n` +
      `    <meta charset="utf-8" />\n` +
      `    <meta name="viewport" content="width=device-width, initial-scale=1" />\n` +
      `    <title>${name}</title>\n` +
      `    <link rel="preconnect" href="https://fonts.googleapis.com" />\n` +
      `    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n` +
      `  </head>\n  <body>\n    <div id="root"></div>\n` +
      `    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`
  );

  await fs.writeFile(
    path.join(siteDir, 'README.md'),
    REACT_README(slug, name, version)
  );

  return zipDirectory(outDir, `${slug}-react`, `${slug}-react.zip`);
}

// ---- emit ----------------------------------------------------------------

const README = (slug, name, version, slugs) => `# ${name}

A Tabbied template, packaged as a plain HTML template. No build step, no
framework - open \`index.html\` in a browser and it runs.

\`\`\`
index.html            the page
styles/base.css       global reset
styles/${slug}.css${' '.repeat(Math.max(0, 14 - slug.length))}this page's stylesheet - edit this one
images/               the photography this page uses
\`\`\`

## The patterns are live, not images

The blocks of pattern are generated in the browser by
[css-doodle](https://css-doodle.com/) through
[tabbied](https://www.npmjs.com/package/tabbied). Each one is a plain \`<div>\`
that describes itself in \`data-\` attributes:

\`\`\`html
<div data-pattern="${slugs[0]}" data-palette="transparent, #C9C8C1"
     data-fit="grid" data-redraw-interval="5200"></div>
\`\`\`

Change \`data-palette\` to recolour it, \`data-pattern\` to swap the design
(254 to choose from - see https://tabbied.com), \`data-seed\` to pin a
particular arrangement, or drop \`data-redraw-interval\` to hold it still.
The script at the bottom of \`index.html\` is what brings them to life; remove
it and the patterns disappear.

## Fonts

The page links its webfonts from Google Fonts and Adobe Fonts. Self-host them
if you'd rather not depend on a CDN.

## Images

The photography is AI-generated and ships with this template.

## Credits

Patterns by [Tabbied](https://tabbied.com) (tabbied@${version}), MIT licensed.
`;

const bootstrapScript = (version, slugs) => `
    <!-- Brings the [data-pattern] blocks above to life. Pinned to a version so
         the template keeps rendering the way it looked when you downloaded it. -->
    <script type="module">
      import { hydratePatterns } from 'https://esm.sh/tabbied@${version}';
      import { ${slugs.join(
        ', '
      )} } from 'https://esm.sh/tabbied@${version}/patterns';

      hydratePatterns({ patterns: { ${slugs.join(', ')} } });
    </script>
`;

async function packageSite(slug, outDir, version) {
  const source = path.join(exportDir, 'template', slug, 'index.html');

  let html;

  try {
    html = await fs.readFile(source, 'utf-8');
  } catch {
    throw new Error(
      `${slug}: no static export at ${path.relative(repoRoot, source)} - ` +
        `run \`npm run build\` first.`
    );
  }

  const slugs = patternSlugs(html);

  if (slugs.length === 0) {
    throw new Error(`${slug}: no [data-pattern] elements in the export.`);
  }

  html = stripReactArtifacts(stripSiteChrome(stripNextRuntime(html)));

  const dehashed = dehashClassNames(html, slug);
  const { moduleName, usedClasses } = dehashed;
  html = dehashed.html;

  const images = rewriteImagePaths(html);
  html = images.html;

  // The two stylesheets replace the /_next/ links that were just stripped.
  html = html.replace(
    '</head>',
    '<link rel="stylesheet" href="./styles/base.css"/>' +
      `<link rel="stylesheet" href="./styles/${slug}.css"/></head>`
  );
  html = html.replace('</body>', `${bootstrapScript(version, slugs)}  </body>`);

  // Write the folder.
  const siteDir = path.join(outDir, slug);
  await fs.rm(siteDir, { recursive: true, force: true });
  await fs.mkdir(path.join(siteDir, 'styles'), { recursive: true });
  await fs.mkdir(path.join(siteDir, 'images'), { recursive: true });

  await fs.writeFile(path.join(siteDir, 'index.html'), html);
  await fs.copyFile(globalsCss, path.join(siteDir, 'styles', 'base.css'));

  const stylesheet = await resolveStylesheet(slug, moduleName);
  let siteCss = prepareStylesheet(stylesheet.css, slug, usedClasses);

  if (stylesheet.shared) {
    // A sheet written for a whole collection carries rules for layout kits
    // this page never uses. Ship what this page can actually match.
    const before = siteCss.length;
    siteCss = trimUnusedRules(siteCss, usedClasses);
    stylesheet.trimmedPercent = Math.round((1 - siteCss.length / before) * 100);
  }

  await fs.writeFile(path.join(siteDir, 'styles', `${slug}.css`), siteCss);

  for (const relativePath of images.used) {
    await fs.copyFile(
      path.join(publicDir, 'images', relativePath),
      path.join(siteDir, 'images', path.basename(relativePath))
    );
  }

  // The page's own <title> is the site's name.
  const name = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? slug;
  await fs.writeFile(
    path.join(siteDir, 'README.md'),
    README(slug, name, version, slugs)
  );

  const size = await zipDirectory(outDir, slug, `${slug}-html.zip`);

  const reactSize = await packageReactSite(slug, outDir, version, name, images.used);

  return {
    slug,
    patterns: slugs.length,
    images: images.used.length,
    size,
    reactSize,
    sharedCss: stylesheet.shared ? stylesheet.trimmedPercent : null,
  };
}

// ---- cli -----------------------------------------------------------------

const args = process.argv.slice(2);
const outDirIndex = args.indexOf('--out-dir');
const outDir = path.resolve(
  repoRoot,
  // Not out/templates: that is now the exported /templates route, and a site
  // slug landing next to its index.html would be a collision waiting to
  // happen. /downloads/<slug>-html.zip is the public URL anyway.
  outDirIndex === -1 ? 'out/downloads' : args[outDirIndex + 1]
);
// Positional args are slugs. A flag's value is not one.
const flagValueIndexes = new Set(
  args.flatMap((arg, index) => (arg.startsWith('--') ? [index + 1] : []))
);
const requested = args.filter(
  (arg, index) => !arg.startsWith('--') && !flagValueIndexes.has(index)
);

// Templates pin the package version so a download keeps rendering the way it
// looked. That comes from the workspace's package.json, which changesets has
// already bumped by the time a release builds the site - so a template always
// points at a version that is either published or about to be. Override it
// when generating templates against an unreleased build.
const versionIndex = args.indexOf('--tabbied-version');
const version =
  versionIndex !== -1
    ? args[versionIndex + 1]
    : JSON.parse(
        await fs.readFile(
          path.join(repoRoot, 'packages', 'tabbied', 'package.json'),
          'utf-8'
        )
      ).version;

const packageable = (await fs.readdir(templateDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const targets = requested.length > 0 ? requested : packageable;

// Packaging everything owns the whole folder, so a site that has since been
// renamed or retired doesn't linger in it. This matters on the deploy path,
// where the folder is `public/downloads` and `next build` copies whatever is
// in it into the export. Naming a slug repackages just that one, in place.
if (requested.length === 0) {
  await fs.rm(outDir, { recursive: true, force: true });
}

await fs.mkdir(outDir, { recursive: true });

let written = 0;
let skipped = 0;
let failed = 0;

for (const slug of targets) {
  const knownReason = KNOWN_UNSUPPORTED.get(slug);

  // A site named explicitly is still attempted, so the reason is a fresh
  // error message rather than a stale note.
  if (knownReason && requested.length === 0) {
    skipped += 1;
    console.log(`package-templates: skipping ${slug} - ${knownReason}`);
    continue;
  }

  try {
    const result = await packageSite(slug, outDir, version);
    written += 1;
    console.log(
      `package-templates: ${result.slug} - ${result.patterns} pattern(s), ` +
        `${result.images} image(s), html ${(result.size / 1024).toFixed(0)} KB ` +
        `+ react ${(result.reactSize / 1024).toFixed(0)} KB` +
        (result.sharedCss !== null
          ? ` (shared stylesheet, ${result.sharedCss}% trimmed)`
          : '')
    );
  } catch (error) {
    failed += 1;
    console.error(`package-templates: ${slug} - ${error.message}`);
  }
}

console.log(
  `package-templates: wrote ${written} template(s) to ` +
    `${path.relative(repoRoot, outDir)}` +
    (skipped > 0 ? `, skipped ${skipped} known-unsupported` : '') +
    (failed > 0 ? `, ${failed} FAILED` : '')
);


// Only unexpected failures are fatal - the known-unsupported set is skipped
// above, so this stays safe to run as part of a build.
if (failed > 0) {
  process.exitCode = 1;
}
