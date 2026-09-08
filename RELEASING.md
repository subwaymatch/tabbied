# Releasing the packages

Releases of the three published workspaces -
[`tabbied`](./packages/tabbied), [`tabbied-mcp`](./packages/tabbied-mcp) and
[`tabbied-templates`](./packages/tabbied-templates) - are automated with
[Changesets](https://github.com/changesets/changesets) and GitHub Actions.
`changeset publish` is workspace-wide, so a release run ships whichever of the
three have a version that isn't on npm yet; the workflow builds all of them
before it publishes.

Publishing uses npm **Trusted Publishing (OIDC)** - there is no `NPM_TOKEN`
secret to manage, and every release gets a
[provenance attestation](https://docs.npmjs.com/generating-provenance-statements)
automatically. Provenance is checked against `repository.url`: it must name the
repository the workflow actually runs in, or the registry rejects the upload
with a 422. **If the repo ever moves owner again, update `repository.url` in
all three `packages/*/package.json`** (and the `changelog` repo in
`.changeset/config.json`) in the same commit.

## The day-to-day flow

1. **Make your change** in a normal PR.
2. **Add a changeset** describing it:
   ```bash
   npm run changeset
   ```
   Pick which package(s) it affects, choose the bump (`patch` / `minor` /
   `major`), and write a short, user-facing summary. Commit the generated
   `.changeset/*.md` file with your PR.
3. **Merge the PR to `main`.** The [Release workflow](.github/workflows/release.yml)
   sees the pending changeset and opens (or updates) a **"Version Packages"** PR
   that bumps the versions, updates the affected packages' `CHANGELOG.md`, and
   removes the consumed changeset files.
4. **Either merge the "Version Packages" PR** to ship immediately, **or do
   nothing** - the weekly release below picks it up. Merging it triggers the
   workflow again, which **publishes to npm**, creates the git tag, and cuts a
   GitHub Release with the changelog.

So step 4 is a fast path, not a gate: shipping happens on its own, and merging
the version PR only makes it happen sooner.

## The weekly release

Every **Monday at 17:23 UTC** the same workflow runs on a schedule and releases
`main` by itself. It never opens a version PR - it versions, commits to `main`,
and publishes in one run. What it does depends on what it finds:

Every check is per package: the workflow reads each publishable workspace under
`packages/`, asks npm what version it has, and reads that package's own
`<name>@*` tags.

| State of `main`                                            | What happens                                       |
| ---------------------------------------------------------- | -------------------------------------------------- |
| Changesets are pending                                      | Version + publish (the same bump the version PR would have made) |
| Some package's `package.json` is ahead of npm               | Publish only (recovers a version commit whose publish failed) |
| Some package changed since **its own** last release tag     | Writes a **patch** changeset for each, then versions + publishes |
| None of the above                                           | Nothing - the run exits quietly                    |

That third row is why a release doesn't depend on anyone remembering to write a
changeset: any package change ships as a patch within the week. Write a
changeset when the change deserves more than a patch, or deserves a changelog
entry in your own words - a hand-written changeset always wins over the
generated one.

Changes outside `packages/` (the site, docs, CI, the templates) don't release
anything, which is what you want - they aren't part of any npm package.

**Ship right now instead of waiting for Monday:** merge the "Version Packages"
PR, or run the workflow by hand - Actions -> *Release* -> **Run workflow**. The
manual run takes the same path as the weekly one, with a toggle to turn off the
automatic patch bump.

> **Branch protection:** the weekly release pushes its version commit straight
> to `main`. If you protect `main`, allow `github-actions[bot]` to bypass the
> restriction (Settings -> Branches -> *Allow specified actors to bypass required
> pull requests*), or the run fails at the push step.
>
> **Pushes by `GITHUB_TOKEN` don't trigger workflows** - that's deliberate here.
> It's why the weekly run has to publish in the same job rather than letting the
> version commit start a second run, and it means there's no risk of a release
> loop.

## Turning the automation off

The weekly release is the `schedule:` trigger in
[`.github/workflows/release.yml`](.github/workflows/release.yml). Delete it and
you're back to "nothing publishes until a human merges the version PR". Keep the
schedule but want changesets to stay mandatory? Set `AUTO_PATCH` to `false` in
the *Decide what to release* step - pending changesets still ship weekly, but
nothing is bumped on its own.

## One-time setup (per package, on npmjs.com)

Trusted Publishing is configured **once per package**, and a package with no
trusted publisher fails to publish. Do this for each of `tabbied`,
`tabbied-mcp` and `tabbied-templates`:

1. Sign in at <https://www.npmjs.com> as a user with publish rights to the package.
2. Go to the package page -> **Settings** ->
   **Trusted Publisher** (a.k.a. "Publishing access").
3. Add a **GitHub Actions** trusted publisher with:
   - **Organization or user:** `tabbied-design`
   - **Repository:** `tabbied`
   - **Workflow filename:** `release.yml`
   - **Environment:** leave blank (the workflow doesn't use a GitHub Environment)
4. Save.

npm does not validate this when you save it, so a typo only shows up as a
failed publish. **These entries name the GitHub owner** - moving the repo
between accounts invalidates every one of them, and they have to be re-pointed
by hand alongside the `repository.url` change above.

That's it - `secrets.GITHUB_TOKEN` (provided automatically by Actions) covers the
PR creation and changelog generation; no other secrets are needed.

### Bootstrapping a new package

Trusted publishing cannot create a package that isn't on npm yet: the trusted
publisher lives on the package's settings page, and that page doesn't exist
until something has been published. A first automated publish therefore fails
with a **404 on `PUT`** - which reads like a permissions problem and isn't
(see [npm/cli#8544](https://github.com/npm/cli/issues/8544)).

So the first version of a new package goes up by hand, once:

```bash
npm run build:packages                     # dist/ is gitignored; files: ["dist"]
npm publish --workspace <name> --access public
```

Then add its trusted publisher as above, and every release after that is
automated. The *Decide what to release* step prints a warning naming any
publishable workspace that npm has never heard of, so this is visible in the
run log rather than only in the failure.

> **Prefer a token instead?** Create an npm **automation** access token, add it as
> the `NPM_TOKEN` repository secret, set `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`
> on the publish step, and add `--provenance` to the publish command. Trusted
> publishing is recommended because there is no long-lived secret to rotate.

## Notes & troubleshooting

- **`npm error need auth` / OIDC errors on publish:** confirm the trusted
  publisher above is configured for `release.yml`, and that the workflow keeps
  `permissions: id-token: write`. OIDC publishing also needs a recent npm, which
  the workflow's `npm install -g npm@latest` step ensures.
- **`E404 Not Found - PUT`:** the package has no trusted publisher - usually
  because it has never been published at all. See *Bootstrapping a new package*.
- **`E422 ... Error verifying sigstore provenance bundle`:** `repository.url`
  disagrees with the repository the workflow ran in. Fix `repository.url`; the
  registry compares them literally.
- **Build artifacts:** every package's `dist` is git-ignored, and the workflow's
  *Build the packages* step (`npm run build:packages`) is what fills them in -
  each package's `files` field is just `dist` (plus `catalog.json`, `llms.txt`
  and `AGENTS.md` for `tabbied`), so an unbuilt package publishes an empty
  tarball rather than failing. Only `tabbied` has a `prepublishOnly` backstop;
  the other two deliberately don't, because `changeset publish` runs packages
  concurrently and a build there would race `tabbied`'s `rm -rf dist`.
- **`tabbied-mcp` reports its own version** from a literal in `src/info.ts`
  (it's bundled into a Worker, which has no filesystem to read `package.json`
  from). `changeset version` doesn't know about it, so bump it in the version
  PR - `test/info.test.mjs` fails when the two drift.
- **Workspace link:** the root app depends on each package as `"*"` so the local
  workspace copies stay linked across version bumps - don't pin them back to
  exact versions.
- **First release / changelog credits:** changelogs are generated by
  `@changesets/changelog-github`, which links PRs and credits authors. Run
  `npm run version-packages` locally only if you set a `GITHUB_TOKEN` in your
  environment; normally the CI bot does this for you.
