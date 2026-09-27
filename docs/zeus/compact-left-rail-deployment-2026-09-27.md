# Compact left rail deployment

Date: 2026-09-27. Repository: `/var/home/tcs/Code/plumblines`. Branch: `codex/plumblines-v1`. Source commit: `60aa118cc9554b094546c8b9a97171c588e206d1` (`fix: scope front page nav label styling`).

The left rail's compact mode was blank because a broad last-child selector hid the icon wrapper. Removing that selector alone exposed labels at a wider breakpoint. The final implementation marks the label explicitly, hides only that marked node on the newspaper front page, exposes the selected link with `aria-current="page"`, and places a 3px accent marker inside the rail's clipped padding. Route targets, rail width and compose behavior are unchanged.

## Artifact

- Pages project: `plumbline`; Wrangler 4.136.3 direct upload.
- Packaged export: `.cloudflare/pages-u0oy97vj` (389 files in the manifest).
- SHA-256 manifest: `.cloudflare/pages-u0oy97vj-sha256.json`; digest `6dca88ac32a9117b914bd65cf9fc9593124fbaf8b63a62a7c865e18c31531f1b`.
- Packaged, preview and deployment-URL `/index.html`: `76af490fc4807252cc74c42b523536a679faa09808f27bb772067e92231761b2`.
- Primary stylesheet `/static/_expo/static/css/style-01e46becec07cc42a91397bf58f16e61.css`: `a7a5a5b84345284309f3d6b0ee515c05db7d2dcd540cf2fcf002a03ebec934a6`.
- Primary app bundle `/static/_expo/static/js/web/index-1f21b199fd549b80e954433ea02247b4.js`: `8f0638050cc8a4146bea9a0fd5a7d945d3e26892698630fdc0c9a1600060986a`.

## Deployment and verification

| Environment | Deployment | Result |
|---|---|---|
| Preview branch `newspaper-preview` | [`e04ffab6.plumbline-f50.pages.dev`](https://e04ffab6.plumbline-f50.pages.dev), ID `e04ffab6-7213-446e-81a0-93433422b661` | Front-page shell loaded. Root HTML, primary stylesheet and app bundle returned HTTP 200 and matched the packaged bytes. |
| Production branch `main` | [`2f3f09c1.plumbline-f50.pages.dev`](https://2f3f09c1.plumbline-f50.pages.dev), ID `2f3f09c1-e671-46d2-871a-089c356582df`; custom domain [`plumblines.uk`](https://plumblines.uk/) | Promoted the identical artifact. Deployment URL HTML, CSS and JS hashes matched the package. Custom-domain CSS and JS also matched; its root HTML differs due to Cloudflare Web Analytics injection. Authenticated browser render showed all rail icons, the red active Home marker, no clipped labels, and a visible compose control. |

The previous production deployment, available as the rollback target, is `402ccf74-21aa-44aa-be65-4f34ed91d2cd` (`https://402ccf74.plumbline-f50.pages.dev`).

## Checks

- `lint:files src/view/shell/desktop/LeftNav.tsx`: PASS.
- `typecheck:web`: PASS.
- `build-web`: PASS; existing `multiformats` and `hls.js` fallback-resolution warnings were emitted.
- No full test suite was run for this focused visual correction.
