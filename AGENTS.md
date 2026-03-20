# Agent / LLM notes

## What this repo is

- **Package:** `graphite-interactive-cli` on npm; CLI name **`gtm`**.
- **Role:** Unofficial interactive front-end for Graphite’s official **`gt`** CLI (`execa` subprocesses). Not affiliated with Graphite.

## Before changing behavior

- Read **[docs/graphite-resources.md](./docs/graphite-resources.md)** for canonical Graphite URLs, install commands (`brew` / `@withgraphite/graphite-cli`), `git` ≥ 2.38, and auth flow.
- For **`gt` semantics and flags**, rely on Graphite’s [command reference](https://graphite.dev/docs/command-reference) — do not invent flag behavior here.
- Graphite’s docs for tooling ingestion: [ai-ingestion](https://graphite.dev/docs/ai-ingestion), [`llms.txt`](https://graphite.com/docs/llms.txt).

## Code map

- **Entry:** `src/cli.ts` — argv, `gtm doctor`, `gtm raw`, `--` passthrough, TTY check → menu.
- **Menu:** `src/interactive.ts` — `@clack/prompts` UI calling `runGt`.
- **Subprocess / env:** `src/run-gt.ts` — `GTR_SHOW_GT`, `GTR_DEBUG`, binary resolution.
- **Doctor:** `src/doctor.ts`

## Dev commands

`pnpm install` · `pnpm dev` · `pnpm build` · `pnpm test` · `pnpm lint` · `pnpm typecheck` · `pnpm format:check`

Do not commit `dist/` or `node_modules/` (see `.gitignore`).
