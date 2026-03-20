# Graphite interactive CLI (`gtm`)

[![npm version](https://img.shields.io/npm/v/graphite-interactive-cli.svg)](https://www.npmjs.com/package/graphite-interactive-cli)
[![CI](https://github.com/nickmccomb/graphite-interactive-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/nickmccomb/graphite-interactive-cli/actions/workflows/ci.yml)

Unofficial interactive menu for the official [Graphite](https://graphite.dev/) **`gt`** CLI — stacks, PRs, and branching with fewer memorized flags. **Not affiliated with Graphite.**

**Repository:** [nickmccomb/graphite-interactive-cli](https://github.com/nickmccomb/graphite-interactive-cli) · [Issues](https://github.com/nickmccomb/graphite-interactive-cli/issues)

## Graphite documentation

Authoritative **`gt`** behavior, install methods, GitHub auth, and troubleshooting live in **Graphite’s docs**. This repo maintains a curated link list:

- **[docs/graphite-resources.md](./docs/graphite-resources.md)** — install (`brew` / npm), requirements (Git ≥ 2.38), quick start, command reference, cheatsheet, LLM-oriented `llms.txt` / `llms-full.txt` pointers.

Highlights from their [install guide](https://graphite.dev/docs/install-the-cli):

```bash
brew install withgraphite/tap/graphite   # recommended
gt --version
```

```bash
npm install -g @withgraphite/graphite-cli@stable
gt --version
```

Then authenticate (see their docs): open [app.graphite.com/activate](https://app.graphite.com/activate) and run the `gt auth --token …` command they provide.

Learn the workflow: [CLI quick start](https://graphite.dev/docs/cli-quick-start) · [Command reference](https://graphite.dev/docs/command-reference) · [Cheatsheet](https://graphite.dev/docs/cheatsheet).

**Using Graphite with AI tools:** [LLM-friendly documentation](https://graphite.dev/docs/ai-ingestion) · [`graphite.com/docs/llms.txt`](https://graphite.com/docs/llms.txt).

## Install `gtm` (this tool)

Requires a working **`gt`** on your `PATH` (see above). **Node 20+** for this package.

```bash
npm install -g graphite-interactive-cli
```

Then run **`gtm`** (interactive menu in a TTY, or `gtm doctor` for an environment check). The name avoids clashing with GNU coreutils’ `gtr` (GNU `tr`) on many Macs.

Most Node installs put global binaries on your PATH automatically. If `gtm` is not found, add the directory from `npm prefix -g` (plus `/bin` on Unix) to PATH, like other global npm tools.

Without a global install: `npx graphite-interactive-cli gtm`.

### Environment variables

| Variable                            | Effect                                             |
| ----------------------------------- | -------------------------------------------------- |
| **`GTM_SHOW_GT=1`**                 | Print an “equivalent `gt …`” line before each run. |
| **`GTM_DEBUG=1`**                   | Forwards `gt --debug` on invocations.              |
| **`GTR_SHOW_GT`** / **`GTR_DEBUG`** | Same as above (legacy names, still supported).     |

## Develop

```bash
pnpm install
pnpm dev              # tsx src/cli.ts
pnpm build && node dist/cli.mjs --help
pnpm test
```

For AI/IDE agents working in this repo, see **[AGENTS.md](./AGENTS.md)**.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Releases: [RELEASING.md](./RELEASING.md) · [CHANGELOG.md](./CHANGELOG.md)

## Security

See [SECURITY.md](./SECURITY.md).

## License

MIT — see [LICENSE](./LICENSE).
