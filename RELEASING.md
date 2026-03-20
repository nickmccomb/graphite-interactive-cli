# Releasing to npm

1. **Name:** The published package is **`graphite-interactive-cli`** (install: `npm i -g graphite-interactive-cli`). It exposes the **`gtm`** bin. For a scoped name instead, change `package.json` and republish.

2. **Repository URLs:** Keep `package.json` `repository` / `bugs` / `homepage` aligned with the GitHub repo (currently [nickmccomb/graphite-interactive-cli](https://github.com/nickmccomb/graphite-interactive-cli)).

3. **Build:** `pnpm install && pnpm build` — verify `dist/cli.mjs` exists and runs (`node dist/cli.mjs --help`).

4. **Registry auth**
   - **Local:** `npm login` / `npm adduser` (with OTP if 2FA is on).
   - **CI:** add a repository secret **`NPM_TOKEN`** (publish-enabled [granular token](https://docs.npmjs.com/about-access-tokens) or classic). The **Release** workflow (`.github/workflows/release.yml`) runs **`npm publish --provenance --access public`** on **`v*.*.*`** tag pushes.
   - **Trusted publishing (optional):** Configure an [npm Trusted Publisher](https://docs.npmjs.com/trusted-publishers) for this GitHub repo to reduce reliance on long-lived tokens; you may still need `NPM_TOKEN` depending on npm/GitHub behavior.

5. **Version & changelog**
   - Bump **`package.json`** `version`.
   - Update **`CHANGELOG.md`** with a dated section for that version.
   - Commit, then tag: `git tag vX.Y.Z && git push origin main && git push origin vX.Y.Z` (or push the tag from the release commit).

6. **Automated publish (recommended)**
   - Push a tag matching **`vMAJOR.MINOR.PATCH`** (must match `package.json`). **Release** workflow runs tests, builds, and publishes with **provenance**.
   - Ensure **`NPM_TOKEN`** is set on the GitHub repo **Settings → Secrets and variables → Actions**.

7. **Publish (local fallback)**

   ```bash
   npm publish --provenance --access public
   ```

   For a **scoped** package name (e.g. `@scope/pkg`), use `npm publish --access public` the first time.

8. **Smoke test after publish:** `npm install -g graphite-interactive-cli` then `gtm --help`; or `npx graphite-interactive-cli gtm --help`.

   **Dry run / offline check:** `npm pack` then `npm install ./graphite-interactive-cli-0.1.0.tgz` in a temp folder and run `./node_modules/.bin/gtm --help`.

9. **Codecov (optional):** Add a **`CODECOV_TOKEN`** repo secret if you want [Codecov](https://codecov.io) reports from CI (CI still passes without it).

10. **Optional:** Add [Changesets](https://github.com/changesets/changesets) later for changelog-driven semver; this repo documents manual release for v0.x.
