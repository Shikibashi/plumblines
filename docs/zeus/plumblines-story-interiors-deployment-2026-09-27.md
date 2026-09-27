# Plumblines Story Interiors deployment

Date: 2026-09-27 (America/New_York). Repository: `/var/home/tcs/Code/plumblines`. Branch: `codex/plumblines-v1`. Code commit: `f5f68f6dbf8d74a47212ce422bc45562df571b15`. Branch head at deployment: `b33b59234d9882025efbfd23633fdd87e2731378`.

This direct-upload release includes the newspaper story interiors and Reading article front, layered paper treatment, bounded Following-feed requests, and compact left navigation. The artifact was built from the code commit above. During `pnpm build-web`, Lingui refreshed only source-location comments in 44 versioned `.po` catalogs; those metadata-only changes were committed as `b33b59234` before upload. No `msgid` or `msgstr` values changed between the two commits. Cloudflare reports `b33b592` as the upload source revision.

## Artifact

- Cloudflare Pages project: `plumbline`; Wrangler `4.136.3`; direct upload.
- Packaged directory: `.cloudflare/pages-5_f0bkuy` (389 files).
- SHA-256 manifest: `.cloudflare/pages-5_f0bkuy-sha256.json`; digest `d551c8349972a988c610d2246a4002f376066b713695ec40bba5cb8689c5843c`.
- Packaged `index.html` SHA-256: `a6ce871bd4dfccb351d04ec66d7e5d15362f632ffe97d3cebc50669ae5a041ae`.
- Main app bundle `/static/_expo/static/js/web/index-6682bb794549c8c8bbe0356bd9ef3aa3.js` SHA-256: `6d5914a5e2b42294e862bbc65b2f2ad5ec89464ae0e3576d8ddf6c836a550475`.
- Runtime bundle SHA-256: `b1ef6d76b027380c69191db9dbd0a9a6b419bd35693603bc4df119ebfec2873f`; shared bundle SHA-256: `245cf4056bc70ff5c9262e839e219111ba0e9b596e01f1bb066149fd3f191dcb`.

## Deployment and live verification

| Environment | Deployment | Result |
|---|---|---|
| Preview branch `newspaper-preview` | [d18f53e2.plumbline-f50.pages.dev](https://d18f53e2.plumbline-f50.pages.dev), ID `d18f53e2-08b1-450d-aaa7-aa733aec35bf` | Root and `/search`, `/profile/edriffles.us`, and `/post/3lxxx` returned HTTP 200. All three JavaScript bundles matched the package byte for byte. |
| Production branch `main` | [cc46a01b.plumbline-f50.pages.dev](https://cc46a01b.plumbline-f50.pages.dev), ID `cc46a01b-94d3-4bf1-9730-5e66ba39486d`; custom domain [plumblines.uk](https://plumblines.uk) | Promoted the identical package. Root, the same three routes, client metadata, web manifest, and favicon returned HTTP 200. All app bundles matched the package byte for byte. |

The custom-domain HTML includes Cloudflare Web Analytics. Removing its injected script made the HTML match the deployment-specific `pages.dev` response byte for byte. The preview and production deployment IDs point to the same package; production reused all uploaded assets.

## Checks and limits

- `pnpm lint`: passed.
- `pnpm typecheck:web`: passed.
- `pnpm build-web`: passed; Expo bundled 6,018 modules. Sentry source-map upload was skipped because `SENTRY_AUTH_TOKEN` was not configured.
- Commit hook `lint-staged`: passed for the source commit; catalog-only follow-up commit had no matching lint-staged files.
- `git diff --check`: passed.
- Playwright and Jest suites: not run in this deployment turn. The HTTP checks establish delivery and asset integrity, not authenticated AT Protocol account behavior.

Metro emitted package-resolution warnings for `multiformats` and `hls.js` and fell back to file resolution; the web export completed successfully.

The prior production deployment, available as the rollback target, is `581b0f09-e2e2-47a5-9e97-49f49628e756` ([581b0f09.plumbline-f50.pages.dev](https://581b0f09.plumbline-f50.pages.dev)). No DNS or PDS configuration was changed.
