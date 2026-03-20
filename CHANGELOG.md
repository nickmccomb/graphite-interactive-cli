# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
