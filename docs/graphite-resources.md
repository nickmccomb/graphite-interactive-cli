# Official Graphite documentation (reference)

This project (**`gtm`**) is a community wrapper around Graphite’s **`gt`** CLI. It does not replace Graphite’s docs. Use the links below for authoritative behavior, flags, and troubleshooting.

All URLs point to **Graphite’s** documentation as of the last refresh.

## Product overview

- [Overview / get started](https://graphite.dev/docs/get-started) — stacked PRs workflow
- [Why Graphite](https://graphite.dev/docs/why-you-should-use-graphite)
- [Privacy & security](https://graphite.dev/docs/privacy-and-security)

## Install & authenticate the CLI

- [**Install & authenticate the CLI**](https://graphite.dev/docs/install-the-cli) — **start here for `gt`**

Official install options (from their docs):

- **Homebrew (recommended):** `brew install withgraphite/tap/graphite`
- **npm:** `npm install -g @withgraphite/graphite-cli@stable`

Requirements called out in their install guide:

- **Git** ≥ **2.38.0** (as of Graphite CLI v1.0.0+)
- **Node:** their npm build targets current Node; if you use npm to install `gt`, match their guidance (they develop with Node 22; any current Node is generally fine)

After install, authenticate so `gt` can talk to GitHub (see the same page):

- Sign in via [app.graphite.com/activate](https://app.graphite.com/activate) and use `gt auth --token <token>` as shown there.

- [GitHub app / permissions](https://graphite.dev/docs/authenticate-with-github-app)

## Quick start & tutorials

- [CLI quick start](https://graphite.dev/docs/cli-quick-start) — first stack, `gt init`, trunk
- [Basic tutorials](https://graphite.dev/docs/basic-tutorials)
- [Learn to stack](https://graphite.dev/docs/learn-to-stack)
- [Comparing `git` and `gt`](https://graphite.dev/docs/comparing-git-and-gt)

## Command help

- [Command reference](https://graphite.dev/docs/command-reference) — every `gt` command and flag
- [Command cheatsheet](https://graphite.dev/docs/cheatsheet) — common tasks in a table
- [CLI overview](https://graphite.dev/docs/cli-overview)

## Configuration & troubleshooting

- [Configure the CLI](https://graphite.dev/docs/configure-cli)
- [CLI troubleshooting / FAQs](https://graphite.dev/docs/troubleshooting)
- [Onboarding FAQs](https://graphite.dev/docs/onboarding-troubleshooting)
- [Update the CLI](https://graphite.dev/docs/update-cli)
- [CLI binaries (prebuilt)](https://graphite.dev/docs/cli-binaries)
- [CLI changelog](https://graphite.dev/docs/cli-changelog)
- [V1 command names](https://graphite.dev/docs/cli-v1-command-names) (legacy aliases noted in their docs)

## Concepts (stacks & collaboration)

- [Create a stack](https://graphite.dev/docs/create-stack)
- [Navigate a stack](https://graphite.dev/docs/navigate-stack)
- [Restack branches](https://graphite.dev/docs/restack-branches)
- [Sync with remote](https://graphite.dev/docs/sync-with-a-remote-repo)
- [Collaborate on a stack](https://graphite.dev/docs/collaborate-on-a-stack)
- [Stacking and CI](https://graphite.dev/docs/stacking-and-ci)

## For LLMs and AI tools

Graphite publishes machine-oriented doc bundles:

- [LLM-friendly documentation](https://graphite.dev/docs/ai-ingestion) — overview
- [`/llms.txt`](https://graphite.com/docs/llms.txt) — doc index for tools
- [`/llms-full.txt`](https://graphite.com/docs/llms-full.txt) — full site in one file

## This repo vs Graphite

- **`gtm`** (this package) only runs **`gt`** via a menu and passthrough; bugs in **`gt`** belong with Graphite.
- Support for **this** tool: [GitHub issues](https://github.com/nickmccomb/graphite-interactive-cli/issues).
