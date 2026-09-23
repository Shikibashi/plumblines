# Newspaper front page follow-up deployment

Date: 2026-09-23. Repository: `/var/home/tcs/Code/plumblines`. Source branch: `codex/plumblines-v1`. Source commit: `a545d4dacb5d4d88f28066532c5f8bc6f6205dfe` (`feat(plumblines): compose newspaper front page`).

## Artifact

- Built with `pnpm build-web` and packaged with `python3 scripts/plumblines/prepare-pages.py`.
- Pages project: `plumbline`; direct upload used the same local directory for preview and production.
- Packaged directory: `.cloudflare/pages-ebfrkvu4` (376 files uploaded by Wrangler).
- SHA-256 manifest: `.cloudflare/pages-ebfrkvu4-sha256.json`.
- Manifest digest: `53cb3a0dd78c3c4a4a8286327c4a7278ac48fa6a48d341f563a4fd1efdc83150`.
- `index.html` digest: `a808b8071786cfd86b9fde44a79084b3bd4cf1e435e045af4292c2edaffe4302`; both preview and production `/index.html` returned this exact digest.
- Legacy `client-metadata.json` remains preserved in the package.

## Deployments and verification

| Environment | Deployment | Result |
|---|---|---|
| Preview branch `newspaper-preview` | [`4303aac2.plumbline-f50.pages.dev`](https://4303aac2.plumbline-f50.pages.dev), ID `4303aac2-59cc-4ae2-a35d-ccbd2e70b591` | Full Playwright suite: 41/41 passed. |
| Production branch `main` | [`08bd8ccc.plumbline-f50.pages.dev`](https://08bd8ccc.plumbline-f50.pages.dev), ID `08bd8ccc-1600-4c98-acaf-588ed144fc43` | Full Playwright suite against `https://plumblines.uk`: 41/41 passed; custom domain returned HTTP 200 and its root HTML hash matched the packaged artifact. |

Before this deployment, the latest production deployment was `be8464c3-b168-4edd-a76a-fb7feda34fdb` (`https://be8464c3.plumbline-f50.pages.dev`). It remains available as the Cloudflare Pages rollback target.

The UI acceptance run is guest-context automation. It does not certify every authenticated account mutation, native iOS/Android layout, screen-reader support, or PWA installation. A fresh signed-in browser load after deploy displayed the live Following lead, Dispatches rail, and current Standard Reader articles.
