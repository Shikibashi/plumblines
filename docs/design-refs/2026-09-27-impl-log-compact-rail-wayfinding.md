# Implementation Log: Compact Rail Wayfinding

Date: 2026-09-27. Repository: `/var/home/tcs/Code/plumblines`. Branch: `codex/plumblines-v1`.

## Prompt Contract

Improve Plumblines' compact desktop navigation while preserving the newspaper shell, icon rail width, routes, and existing interaction behavior. Make the current destination easier to spot and expose its current-page state to assistive technology.

## Evidence and Decision

The authenticated production front page showed a compact, icon-only left rail, but its rows were blank: a broad `> div:last-child { display: none }` rule hid the icon wrapper because minimal navigation already omits its text label. The links retained accessible names, but had no explicit current-page semantics or persistent route marker. The user had already selected the newspaper direction and paper-object depth; this is a local navigation refinement, so new full-page direction candidates were not needed.

Product Design gate: `RESTART_REQUIRED`. `product-design@openai-curated-remote` v0.1.56 is installed and enabled, but no Product Design tools are exposed in this session. The native repository implementation path was used; no Product Design prototype is claimed.

## Implemented

- The active left-nav link now carries `aria-current="page"`.
- On the compact newspaper front-page rail, the active destination receives a 3px accent margin rule using the existing paper token. The rail width and link targets do not change.
- Removed the overbroad child-hiding rule so compact navigation keeps its icon controls visible.
- After the first production render, moved the active rule fully inside the rail's clipped padding so it remains visible at the viewport edge.
- `DESIGN.md` records the compact-rail wayfinding rule for future UI work.

## Verification

- Focused source lint and web typecheck passed; the first corrected web build completed successfully. Production render confirmed the icons were restored and exposed a clipped active rule; rebuilding now with that final placement adjustment.
- No data, routing, feed order, or protocol behavior changed.
