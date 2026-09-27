# Editorial front page deployment receipt

**Date:** 2026-09-23 UTC

**Project:** Cloudflare Pages `plumbline`

**Domain:** <https://plumblines.uk>

**Repository:** `Shikibashi/plumblines`, branch `codex/plumblines-v1`

**Deployed source:** `e65ebee3b239229a2c6063bad602db703bc7fa9d`

**Previous production deployment:** `a1ec660d-f432-44dc-aaf4-9919babb15d3`

## Release

The user-authorized newspaper redesign replaced the previous production Pages deployment. The optimized Expo web export was packaged once at `.cloudflare/pages-l2r2yobr` and uploaded first to preview, then to production. Both uploads used this same local package directory.

| Environment | Deployment ID | Source | URL | Browser result |
|---|---|---|---|---|
| Preview | `2dc89d59-275f-4ca3-bd8e-a2cd437ad505` | `8fa3251` | <https://2dc89d59.plumbline-f50.pages.dev> | 40/40 pass |
| Production | `1abaaf7f-e124-4fe3-aa1b-9c50ed955a63` | `e65ebee` | <https://1abaaf7f.plumbline-f50.pages.dev> / <https://plumblines.uk> | 40/40 pass |

The Cloudflare deployment list confirms the production environment, `main` branch, source commit and deployment ID. The deployed package contains 389 files. SHA-256 for `index.html` is `47a108e44a12b1d3b40c87cde9570332c3d9ff0a840322ae310bc429de53e9e6`; the local 389-file manifest is `.cloudflare/pages-l2r2yobr-sha256.json` (manifest SHA-256 `ba74c274c97f6fd548e9cf8df6164faed74f088a8244f4ab1b4f28b0c912d971`). Wrangler reported all 376 already-cached files reused at production promotion and uploaded zero changed files.

## Live verification

- The complete 40-case Playwright suite passed on preview and on `https://plumblines.uk`. Coverage includes five viewport sizes, light/dark/dim contrast, reduced motion, keyboard behavior, section ordering and filters, local attention, social thread/article mode, share image, PWA paths, and public blocked-post/profile reads.
- A separate real-browser Reading smoke test on production loaded 20 live Standard Reader entries, of which four were marked body-bearing, then opened and rendered an actual Japanese-language Standard.site document body through `@standard-reader/renderer-react`. No Standard Reader requests failed.
- Production HTTP checks returned 200 for `/`, `/profile/edriffles.us/post/3mtf4xncr6c24/quotes`, and `/manifest.webmanifest` (`application/manifest+json`).
- The current digest-pinned Docker image is `sha256:440fd6867ba481f95d9a5a204dd17046393fb050ffad7ca276619ef4c1e11a81`; its loopback smoke returned `/healthz` = `ok`, `/` = HTTP 200 and nginx UID 101.

## Rollback and boundaries

The immediately previous production deployment remains available for rollback: `a1ec660d-f432-44dc-aaf4-9919babb15d3`. No rollback was needed. The PDS, its Docker image, DNS, tunnel routes and Cloudflare zone settings were not changed.

This release was not tested with an authenticated account or real account mutations. Native device builds, assistive-technology certification and OS-level PWA installation remain unverified. Live app-config, geolocation and other inherited Bluesky-origin restrictions and the upstream dependency advisories documented in the existing v1 receipts remain outside this UI release.
