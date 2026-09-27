# Implementation Log: Compact Rail Wayfinding

Date: 2026-09-27. Repository: `/var/home/tcs/Code/plumblines`. Branch: `codex/plumblines-v1`.

## Prompt Contract

Improve Plumblines' compact desktop navigation while preserving the newspaper shell, icon rail width, routes, and existing interaction behavior. Make the current destination easier to spot and expose its current-page state to assistive technology.

## Evidence and Decision

The authenticated production front page showed a compact, icon-only left rail, but its rows were blank: a broad `> div:last-child { display: none }` rule hid the icon wrapper because minimal navigation already omits its text label. The links retained accessible names, but had no explicit current-page semantics or persistent route marker. The user had already selected the newspaper direction and paper-object depth; this is a local navigation refinement, so new full-page direction candidates were not needed.

The first live correction restored the compact-mode icons but exposed clipped labels in the wider standard-nav mode. The final CSS hides an explicitly marked label only, preserving the icon in either render mode.

Product Design gate: `RESTART_REQUIRED`. `product-design@openai-curated-remote` v0.1.56 is installed and enabled, but no Product Design tools are exposed in this session. The native repository implementation path was used; no Product Design prototype is claimed.

## Implemented

- The active left-nav link now carries `aria-current="page"`.
- On the compact newspaper front-page rail, the active destination receives a 3px accent margin rule using the existing paper token. The rail width and link targets do not change.
- Replaced the overbroad child-hiding rule with a label-specific data marker, so compact navigation keeps icons visible and the wide front page hides labels without clipping them.
- After the first production render, moved the active rule fully inside the rail's clipped padding so it remains visible at the viewport edge.
- `DESIGN.md` records the compact-rail wayfinding rule for future UI work.

## Follow-up: Labels on the compact rail

The authenticated production render now shows the complete 68px icon rail, but its icon-only destinations still require readers to recognize each symbol. Keep the rail and newspaper measure fixed while making each destination legible on demand.

### Implemented

- Compact and front-page icon links open the existing tooltip component to the right on pointer hover and keyboard focus.
- The compose control uses the same interaction, with its existing accessible label.
- Tooltips use the raised-paper token, ink, edge, and offset shadow so they read as small editorial slips in light, dim, and dark themes.
- Tooltip placement supports left and right sides in addition to its existing top and bottom positions; edge collision can flip a side tooltip.
- The front-page rail stays 68px wide; route targets, active-page semantics, and the paper sheet measure remain unchanged.

## Verification

- `lint:files src/view/shell/desktop/LeftNav.tsx`: PASS.
- `typecheck:web`: PASS.
- Final `build-web`: PASS. Metro reported the existing `multiformats` and `hls.js` fallback-resolution warnings; export completed.
- Preview and production `/`, primary stylesheet and app bundle returned HTTP 200 and matched the packaged SHA-256 bytes. The custom-domain HTML differs from the deployment URL because Cloudflare injects Web Analytics; its stylesheet and app bundle match.
- Authenticated production browser render: PASS. The rail shows every icon, the active Home route has a visible red marker, labels stay hidden within the narrow rail, and the compose control remains visible.
- Deployment IDs, artifact hashes and hosted checks are in [the compact rail deployment receipt](../zeus/compact-left-rail-deployment-2026-09-27.md).
- No data, routing, feed order, or protocol behavior changed.
