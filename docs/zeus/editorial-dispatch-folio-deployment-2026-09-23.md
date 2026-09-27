# Editorial dispatch and folio deployment

Date: 2026-09-23. Repository: `/var/home/tcs/Code/plumblines`. Source branch: `codex/plumblines-v1`. Source commit: `1ee632e73` (`polish lead story reading label`).

This deployment completes a focused front-page follow-up: posts receive the Plumblines dispatch treatment within the lead/briefs composition, later Following items continue onto document-scrolling pages, and the page navigator keeps its selected folio at a document scroll boundary until the reader moves. The lead is labeled simply “Lead”; layout-editor explanation has been removed from normal reading mode. Reading remains a separate section, while local attention and muting controls remain in Settings. The page keeps the existing upstream post renderer inside the editorial wrapper; this is not a replacement for the broader Standard.site/article renderer work or a complete redesign of every app surface.

## Artifact

- Pages project: `plumbline`; Wrangler 4.136.3 direct-uploaded the same packaged export to preview and production.
- Packaged directory: `.cloudflare/pages-8jful99x` (389 files in the manifest; Wrangler reported 376 deployable assets and reused previously uploaded files).
- SHA-256 manifest: `.cloudflare/pages-8jful99x-sha256.json`; digest `5cbd4a1a60603a98708eb0a270ff3bc78a673643fa767ef1f0ca28e80428856b`.
- Packaged, preview, and production `/index.html` SHA-256: `3f663eb596f9ddc1ac0c2ab90376d284fcac3bbd6509488ec4abec1a59d88057`.
- Packaged and production primary stylesheet (`/static/_expo/static/css/style-3b26f73aba679052691df6585d775f8b.css`) SHA-256: `914cf72b921885310ae6731bed882c4e63d38d29d24eb1609b0ce303088fc029`.

## Deployment and verification

| Environment | Deployment | Result |
|---|---|---|
| Preview branch `newspaper-preview` | [`7586c61c.plumbline-f50.pages.dev`](https://7586c61c.plumbline-f50.pages.dev), ID `7586c61c-1de3-476f-8d78-4ea55ebe255c` | Full hosted Playwright suite passed 43/43. Preview root HTML matched the packaged digest. |
| Production branch `main` | [`e877ca2d.plumbline-f50.pages.dev`](https://e877ca2d.plumbline-f50.pages.dev), ID `e877ca2d-3a36-4952-a374-4c4721017a8a` | Promoted the identical preview artifact. Live custom-domain UI loaded; root HTML and primary stylesheet matched the packaged hashes. |

The preceding production deployment, retained as the rollback target, is `88c9ed10-53df-4820-a3f0-16b6c123a084` (`https://88c9ed10.plumbline-f50.pages.dev`). The production browser inspection showed the live front page, concise Lead marker without layout-editor copy, separate Reading navigation, composed Following lead and Dispatches rail, and later numbered pages with a “Load more posts” continuation. This browser smoke was unauthenticated. The hosted suite covers responsive widths, theme contrast, keyboard/reduced-motion behavior, page continuation and folio selection, and keeps local attention controls in Settings. It does not certify credentialed account mutation or every signed-in Settings state.
