# Editorial dispatch working-tree deployment

Date: 2026-09-23 (America/New_York). Repository: `/var/home/tcs/Code/plumblines`. Source branch: `codex/plumblines-v1`. Source HEAD: `feab0d2ea6e9b1df8ff0893e5f487991c3bfff0f`.

This was a direct-upload deployment of the current dirty working tree, not a build from a committed source revision. It deploys the newspaper follow-through in that tree: the front page and section fronts continue through document scrolling, and social posts receive a Plumblines editorial-dispatch presentation while retaining the upstream post renderer for moderation, rich text, embeds, provenance, and protocol actions. Reading remains a distinct section, and local attention controls remain in Settings.

## Artifact

- Cloudflare Pages project: `plumbline`; Wrangler `4.136.3`; direct upload.
- Packaged directory: `.cloudflare/pages-tue2l0fi` (389 files).
- SHA-256 manifest: `.cloudflare/pages-tue2l0fi-sha256.json`; digest `4fed74a895b6df99276f1fd478458c2b0085ea9eabb82fef455754a3b1896a93`.
- Packaged and preview `/index.html` SHA-256: `a4f6d451f9b15ca9e68d2b2a296883961fe6998da314779015978e6b260088ce`.
- The primary app bundle `/static/_expo/static/js/web/index-a2674b7945f8b8eab4cdeb389ac284da.js` has SHA-256 `a676cde3d022ebc37af01e67f4d6df5e5ae00be96489be866a9aea8e111dbdd9` in both the package and production custom-domain response.

## Deployment and verification

| Environment | Deployment | Result |
|---|---|---|
| Preview branch `newspaper-preview` | [`5381655d.plumbline-f50.pages.dev`](https://5381655d.plumbline-f50.pages.dev), ID `5381655d-d998-41e5-a331-d3a097e00b6e` | Full hosted Playwright suite passed 44/44. Root HTML matched the packaged SHA-256. |
| Production branch `main` | [`581b0f09.plumbline-f50.pages.dev`](https://581b0f09.plumbline-f50.pages.dev), ID `581b0f09-e2e2-47a5-9e97-49f49628e756`; custom domain [`plumblines.uk`](https://plumblines.uk) | Promoted the identical package. Full hosted Playwright suite passed 44/44. Root, client metadata, PWA manifest, favicon, touch icon, and a deep post route returned HTTP 200. Production app bundle matched the packaged SHA-256. |

Cloudflare injects its Web Analytics beacon into the production custom-domain HTML, so that response's full HTML hash differs from the packaged index. A diff against the deployment-specific `pages.dev` response showed only the injected script; the app script URLs and production app-bundle bytes match the package. The preview and production test suites both covered responsive layouts, continuation/loading, moderation views, reduced motion, keyboard controls, and local-attention placement in Settings.

Local checks passed before deployment: `pnpm lint`, `pnpm typecheck:web`, the blockless-policy and unblock-menu Jest suites (15 tests), `pnpm build-web`, and the full Plumblines Playwright suite (44/44). The build skipped Sentry source-map upload because no Sentry token was configured. The hosted browser suites do not certify authenticated production account mutations or a real user's PDS session.

The previous production deployment, retained as the rollback target, is `e877ca2d-3a36-4952-a374-4c4721017a8a` ([`e877ca2d.plumbline-f50.pages.dev`](https://e877ca2d.plumbline-f50.pages.dev)). The PDS container and DNS configuration were not changed. The existing dirty source changes were preserved and neither staged nor committed. `pnpm build-web` regenerated locale catalogs under `src/locale/locales/*/messages.po`; those working-tree changes were also left intact.
