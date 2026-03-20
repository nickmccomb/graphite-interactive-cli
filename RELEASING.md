# Releasing to npm

1. **Name:** The published package is **`graphite-interactive-cli`** (install: `npm i -g graphite-interactive-cli`). It exposes the **`gtm`** bin. For a scoped name instead, change `package.json` and republish.

2. **Repository URLs:** Keep `package.json` `repository` / `bugs` / `homepage` aligned with the GitHub repo (currently [nickmccomb/graphite-interactive-cli](https://github.com/nickmccomb/graphite-interactive-cli)).

3. **Build:** `pnpm install && pnpm build` — verify `dist/cli.mjs` exists and runs (`node dist/cli.mjs --help`).

4. **Registry auth:** Ensure you are logged in (`npm whoami`). If not: `npm login` (or `npm adduser`) with an account that has 2FA configured if your npm settings require it.

5. **Publish (local):**

   ```bash
   npm publish
   ```

   For a **scoped** package name (e.g. `@scope/pkg`), use `npm publish --access public` the first time.

   With [provenance](https://docs.npmjs.com/generating-provenance-statements) (recommended from CI with OIDC):

   ```bash
   npm publish --provenance --access public
   ```

6. **Smoke test after publish:** `npm install -g graphite-interactive-cli` then `gtm --help`; or `npx graphite-interactive-cli gtm --help`.

   **Dry run / offline check:** `npm pack` then `npm install ./graphite-interactive-cli-0.1.0.tgz` in a temp folder and run `./node_modules/.bin/gtm --help`.

7. **Optional:** Add [Changesets](https://github.com/changesets/changesets) later for changelog-driven semver; this repo documents manual release for v0.x.

8. **Trusted publishing:** Configure npm “Trusted Publisher” for your GitHub repo to avoid long-lived tokens.
