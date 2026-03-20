# Contributing

Contributions are welcome. Please open an issue or pull request.

## Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

When changing features that mirror `gt` behavior, confirm against Graphite’s docs — link hub: [docs/graphite-resources.md](./docs/graphite-resources.md).

## Pull requests

- Keep changes focused on one topic.
- Add or update tests when behavior changes.
- Run `pnpm format` before committing if you touch formatting.

## Releases

Maintainers bump version in `package.json`, update changelog if you keep one, and publish with npm provenance from CI when possible (see `RELEASING.md`).
