# Newspaper sheets deployment

Date: 2026-09-23. Repository: `/var/home/tcs/Code/plumblines`. Source branch: `codex/plumblines-v1`. Source commit: `864d8ced113d9ca203006fae57a405d3d5918d45` (`feat(plumblines): add paginated newspaper sheets`).

## Artifact

- Web export built and passed the local checks recorded in the implementation turn; packaged with `python3 scripts/plumblines/prepare-pages.py`.
- Pages project: `plumbline`; Wrangler 4.136.3 direct-uploaded the same artifact to preview and production.
- Packaged directory: `.cloudflare/pages-bs_4wrc8` (389 files in the local manifest; Wrangler reported 376 deployable assets, with previously uploaded assets reused).
- SHA-256 manifest: `.cloudflare/pages-bs_4wrc8-sha256.json`; digest `ac579642f75af2cf8ba884b500083946b3deae6c77269e29449667268f64baa8`.
- Packaged, preview, and production `/index.html` SHA-256: `a3e07a38decfd0d58f2be9ef9042f7b917698e827e0cf4ddbf6a02713ae3b5fd`.
- Packaged and live primary stylesheet SHA-256: `498e3f272441bbd6cd9cdc81cff2618d6ca447f0289e25c79a2f27f76ed7f0d4`.

## Deployment and verification

| Environment | Deployment | Result |
|---|---|---|
| Preview branch `newspaper-preview` | [`2eb5af96.plumbline-f50.pages.dev`](https://2eb5af96.plumbline-f50.pages.dev), ID `2eb5af96-46ad-463a-9cb5-97468be7c6a4` | Full Playwright suite passed 43/43. Preview root HTML matched the packaged digest. |
| Production branch `main` | [`674b2234.plumbline-f50.pages.dev`](https://674b2234.plumbline-f50.pages.dev), ID `674b2234-551a-4f9b-b95a-161f162e5df4` | Full Playwright suite against `https://plumblines.uk` passed 43/43. Custom domain returned HTTP 200 and root HTML plus primary stylesheet matched the packaged hashes. |

The immediately preceding production deployment, retained as the rollback target, is `93d682e7-24b5-4c08-a7c6-67c99885b59d` (`https://93d682e7.plumbline-f50.pages.dev`). No DNS, PDS, AppView, or account data changes were made.

The hosted browser suite is guest-context automation. It verifies the front-page continuation/cursor behavior, distinct Reading destination, responsive widths, keyboard and reduced-motion behavior, moderation display, and that local attention controls are absent from the front page and remain in Settings. It does not certify credentialed account mutation or every signed-in Settings state.
