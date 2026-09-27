# Plumblines compact rail fix deployment

Date: 2026-09-27 (America/New_York). Repository: `/var/home/tcs/Code/plumblines`. Branch: `codex/plumblines-v1`. Source commit: `1bc3626e9198daf29b86112fcdb68ffafd16f584`.

The front-page stylesheet compacts the desktop left rail to 68px, while the general responsive breakpoint can still leave `DesktopLeftNav` in its full-size mode. That made `ComposeBtn` render its text label and default wide shape inside the narrow rail. The Home route now explicitly passes compact mode to the compose button, so it renders as a 48px round icon button without the label. With the rail's 6px horizontal padding, the 56px content width leaves 4px on either side of the button.

## Artifact

- Cloudflare Pages project: `plumbline`; Wrangler `4.136.3`; direct upload.
- Packaged directory: `.cloudflare/pages-y_w1akzx` (389 files).
- SHA-256 manifest: `.cloudflare/pages-y_w1akzx-sha256.json`; digest `85a32451f14a9ed77981d0b5dae2173eefffb95bad82b5c12b761684aac6815f`.
- Packaged `index.html` SHA-256: `42dc52b6b6295effdfb2b96607160420adfb411c358b06dd869c78e0cd09855c`.
- Main app bundle `/static/_expo/static/js/web/index-db7e6e2573e9f9846e622fc2f0e256ed.js` SHA-256: `70923e5e7b5b1036405347264b6270459cc62a8abd95bc4f2ed885695a2ffafe`.

## Deployment and verification

| Environment | Deployment | Result |
|---|---|---|
| Preview branch `newspaper-preview` | [6ddc5334.plumbline-f50.pages.dev](https://6ddc5334.plumbline-f50.pages.dev), ID `6ddc5334-3c11-4c7f-98b2-8115f388a957` | Root and `/search`, `/profile/edriffles.us`, and `/post/3lxxx` returned HTTP 200. All three JavaScript bundles matched the packaged bytes. |
| Production branch `main` | [1bb660d5.plumbline-f50.pages.dev](https://1bb660d5.plumbline-f50.pages.dev), ID `1bb660d5-31b1-4e59-bba8-ab2ca9ad177b`; custom domain [plumblines.uk](https://plumblines.uk) | Promoted the same package. Root, the same routes, client metadata, web manifest, and favicon returned HTTP 200. All three bundles matched the package byte for byte. |

Cloudflare injects Web Analytics into the custom-domain HTML. After removing that script, the custom-domain HTML matches the deployment-specific `pages.dev` HTML exactly.

## Checks and limits

- `pnpm lint:files src/view/shell/desktop/LeftNav.tsx`: passed.
- `pnpm typecheck:web`: passed.
- `pnpm build-web`: passed; Expo bundled 6,018 modules. Sentry source-map upload was skipped because `SENTRY_AUTH_TOKEN` was not configured.
- Commit hook `lint-staged`: passed.
- Playwright/Jest suites were not run. HTTP checks verify delivery and bundle integrity; they do not exercise an authenticated session's rendered compose control.

The build emitted the same `multiformats` and `hls.js` package-resolution warnings, then completed with fallback resolution. The previous production deployment is `cc46a01b-94d3-4bf1-9730-5e66ba39486d` ([cc46a01b.plumbline-f50.pages.dev](https://cc46a01b.plumbline-f50.pages.dev)).
