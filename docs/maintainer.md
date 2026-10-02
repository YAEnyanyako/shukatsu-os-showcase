# Maintainer guide / 開発者・保守担当向け

[公開デモ](https://yaenyanyako.github.io/shukatsu-os-showcase/) · [日本語 README](../README.md) · [English README](../README.en.md)

## Run a local copy

Inside the standalone public directory, run:

```bash
python3 -m http.server 8876 --bind 127.0.0.1
```

Open `http://127.0.0.1:8876/` in a standalone browser. Embedded local-file previews may block navigation; use HTTP. No browser security setting needs to be disabled. The site has no build step or dependency installation requirement.

## Verify

Requires Node.js 18+ and Python 3.9+:

```bash
npm test
python3 scripts/check_public.py
```

The automated tests cover deterministic application behavior, not AI model accuracy. See [evaluation scope](evaluation.md). Review every public file and generated image before publishing. Capture screenshots with a fresh browser context and authored fixtures only; never use a private ledger or logged-in portal. The allowlisted PNG has a fixed reviewed digest and its metadata is checked by the public-file script. Replacing it requires another visual/privacy review and digest update.

## Put it on GitHub Pages

Upload the **contents** of this public directory to the repository root, keeping its folder structure. Do not upload a private project alongside it.

In GitHub, select **Settings → Pages → Deploy from a branch → default branch → /(root) → Save**. `.nojekyll` is included. See GitHub's [publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

For updates, commit changes on top of the existing history. Review the diff and public allowlist, use an anonymous commit identity, push without forcing, then check the deployed demo and README links. Do not replace the repository or rewrite history as part of an ordinary update.

## Package a release

```bash
python3 scripts/package_release.py ../shukatsu-os-showcase.zip
```

Only files in `release-files.json` are packaged. Unexpected files, symlinks, unsupported binary assets and privacy-check findings fail the check. Git history, machine metadata, browser state and private input are excluded.

## Source layout

| Path | Purpose |
|---|---|
| `index.html`, `assets/` | Application entry, local styles, illustration and reviewed fictional screenshot |
| `src/fixtures.js`, `src/catalog.js` | Authored notifications, projects and research samples |
| `src/workflow.js`, `src/preparation.js`, `src/records.js` | State rules, preparation and evidence handling |
| `src/app.js`, `src/workbench.js`, `src/record_views.js` | Browser UI, routes and material/review views |
| `tests/` | Deterministic behavioral and controller tests |
| `docs/`, `scripts/` | Case studies, documentation, public-file checks and release packaging |
