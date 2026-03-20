# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-03-21

### Added

- `src/root-menu.ts` — single source for root menu options (with tests).
- Tests for `shouldTeachBack` / `shouldForwardGtDebug` (`GTM_*` / legacy `GTR_*`, `DEBUG`).
- GitHub Dependabot (npm + Actions), issue templates, PR template, `CODEOWNERS`, `FUNDING.yml`.
- CI: `test:coverage`, **Codecov** upload (optional `CODECOV_TOKEN`), **Release** workflow on `v*.*.*` tags (`npm publish --provenance`).
- Optional **shell completions** in `completions/` (bash + zsh), shipped on npm.

### Changed

- Interactive: root menu order and copy tweaks; **Environment check** only under **Start here** (not top-level); removed “Help — what is Graphite?”; **Navigate** hints point to **My stack** for log / stack moves.
- Non-TTY hint clarifies `gtm -- doctor` matches **Start here → Environment check**.

## [0.2.2] - 2026-03-20

### Removed

- Unused root helper (not referenced by `package.json` or the published package); dropped the ESLint ignore entry for that file.

## [0.2.1] - 2026-03-20

### Added

- `GTM_SHOW_GT` / `GTM_DEBUG` environment variables; `GTR_SHOW_GT` / `GTR_DEBUG` remain supported as aliases.

### Changed

- README title and interactive UI use **`gtm`** naming instead of “GTR”; README adds an environment-variable table.

## [0.2.0] - 2026-03-20

### Added

- `docs/graphite-resources.md`: curated official Graphite documentation (install, reference, cheatsheet, LLM `llms.txt`).
- `AGENTS.md`: contributor / agent orientation for this repo.

### Changed

- README, `gtm doctor`, in-app help, and install errors use **graphite.dev/docs** URLs aligned with Graphite’s current documentation.

## [0.1.0] - 2026-03-20

### Added

- Initial publish: interactive menu for Graphite CLI (`gt`), `gtm doctor`, `gt raw` / `gtm --` passthrough, `--cwd` / `-C`, env toggles `GTR_SHOW_GT` / `GTR_DEBUG`.
