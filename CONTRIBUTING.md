# Contributing

Contributions are welcome. Please open an issue or pull request.

## Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm test:coverage
pnpm lint
pnpm typecheck
```

When changing features that mirror `gt` behavior, confirm against Graphite’s docs — link hub: [docs/graphite-resources.md](./docs/graphite-resources.md).

### Interactive menu

- Root menu entries (labels, hints, **order**) live in [`src/root-menu.ts`](./src/root-menu.ts). Update that file and keep [`src/root-menu.test.ts`](./src/root-menu.test.ts) passing so we don’t drop options or duplicate `value`s by mistake.
- Prefer **high-touch** flows first (stack view → create → submit/sync), onboarding under **Start here**, and avoid duplicating Graphite’s full command reference — link to their docs when in doubt.

## Pull requests

- Keep changes focused on one topic.
- Add or update tests when behavior changes.
- Run `pnpm format` before committing if you touch formatting.

## Releases

Maintainers bump version in `package.json`, update changelog if you keep one, and publish with npm provenance from CI when possible (see `RELEASING.md`).
