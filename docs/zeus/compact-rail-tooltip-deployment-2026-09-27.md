# Compact rail tooltip deployment

Date: 2026-09-27. Repository: `/var/home/tcs/Code/plumblines`. Branch: `codex/plumblines-v1`. Artifact source commit: `9a20ca2963b0bf5e60cc02e2bcf1349d2fa57405` (`feat: add compact rail destination tooltips`).

The compact newspaper rail now reveals translated destination labels when a reader points to or focuses its icon links. The labels use the existing raised-paper visual direction and sit beside the rail without widening it. Compose uses the same tooltip treatment. Routes, active-page semantics and the 68px front-page rail width are unchanged.

## Artifact

- Pages project: `plumbline`; Wrangler 4.136.3 direct upload.
- Packaged export: `.cloudflare/pages-txxu051j` (389 files).
- SHA-256 manifest: `.cloudflare/pages-txxu051j-sha256.json`; digest `9c16607c6520f1eef63f7f48e32c02690983689688dc41d7eeeb5d5396cc75c4`.
- Packaged and deployment-URL `/index.html`: `d2539f08d4211b6f1f395c02dfac164f75cb1640f7014978858de1cea5ca4c0f`.
- Primary stylesheet `/static/_expo/static/css/style-e5b57fc968428fcb6c55e75ea3e970d0.css`: `9530c5f87bf308852af901fe55abd0abadebc86405f726573ee771e13b77385d`.
- Primary app bundle `/static/_expo/static/js/web/index-b844b1b45c2cff2e350f7a3f092d4ef8.js`: `ec3a3653dd71d3d42adbb45b804703430ce6ec49bafcf240435d06bf79b71721`.

## Deployment and hosted verification

| Environment | Deployment | Result |
|---|---|---|
| Preview branch `newspaper-preview` | [`f832997d.plumbline-f50.pages.dev`](https://f832997d.plumbline-f50.pages.dev), ID `f832997d-587e-4c3a-a699-1a897889cae2` | Anonymous front-page shell loaded. Root HTML, primary stylesheet and app bundle returned HTTP 200 and matched packaged bytes. |
| Production branch `main` | [`46270db0.plumbline-f50.pages.dev`](https://46270db0.plumbline-f50.pages.dev), ID `46270db0-e84b-475c-9cd4-2caad20e38a5`; custom domain [`plumblines.uk`](https://plumblines.uk/) | Promoted the identical artifact. Deployment URL HTML, CSS and JS hashes matched the package. Custom-domain CSS and JS match; custom-domain HTML differs because Cloudflare injects Web Analytics. An authenticated browser render showed the fixed icon rail and raised-paper “Home” tooltip while the Home link was focused. |

The previous production deployment, available as the rollback target, is `2f3f09c1-e671-46d2-871a-089c356582df` (`https://2f3f09c1.plumbline-f50.pages.dev`). Deployment IDs were recorded from Wrangler's live Pages deployment list after promotion.

## Checks

- Packaged file verification: PASS, all 389 hashes match the manifest.
- `lint:files` for the changed TypeScript and CSS files: PASS.
- `typecheck:web`, `typecheck:ios`, and `typecheck:android`: PASS.
- Expo web export and Pages packaging: PASS. Metro emitted the existing `multiformats` and `hls.js` fallback-resolution warnings.
- Hosted browser check: PASS for the authenticated production rail and visible tooltip. The preview was signed out, so it did not display the account rail; no login was attempted there.
- No automated test suite was run for this focused UI change.
