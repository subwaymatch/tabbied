# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets).
It drives versioning, changelogs, and npm publishing for the `tabbied` package.

## Adding a changeset

Whenever you make a change that should be released, run:

```bash
npm run changeset
```

Pick the bump type (patch / minor / major) and write a short, user-facing
summary. This creates a markdown file in this folder — **commit it alongside
your change**. The accumulated changesets are consumed automatically when the
"Version Packages" PR is merged.

See [`RELEASING.md`](../RELEASING.md) at the repo root for the full release
flow and the one-time npm setup.
