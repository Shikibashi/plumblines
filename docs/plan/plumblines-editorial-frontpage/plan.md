# Plan: editorial front page and Standard.site Reading

## Objective

Replace the dashboard-like Home composition with a spatially stable, deterministic newspaper page that still behaves as a modern AT Protocol client. Promote Standard.site documents into a first-class Reading section by reusing its public index and open React renderer when local compatibility checks pass.

## Dependency order

1. Audit and protect branch/upstream state; identify current integration and acceptance baselines.
2. Implement pure deterministic template/layout functions and tests.
3. Refactor section queries/rendering into a single scroll surface with treatment wrappers, layout templates, sheet landmarks and section settings.
4. Integrate Standard Reader public API + renderer for public Reading. Confirm CORS, schema, package license/size/runtime and error behavior before locking dependency.
5. Add responsive masthead, editorial spacing/rules, and interior masthead state with correct shell offsets.
6. Add fixtures and browser coverage for template order, content truth, no nested scrollers, persistence, Standard article metadata/body/fallback, and existing moderation behavior.
7. Run reviewer/audit and all required local checks; start and inspect refreshed Docker UI, capture wide/laptop/phone light/dim/dark screenshots.
8. Build/export preview and verify the exact candidate before production. Existing user authorization permits replacement of plumblines.uk, but only after candidate acceptance and rollback recording.

## Layout model

- Local setting: `broadsheet | compact | reading`, default `broadsheet`; stored beside existing section preferences under account/guest local namespace, with strict validator and fallback.
- Prominence comes only from explicit section order and deterministic source-item position. Broadsheet uses configured first section as lead and subsequent configured sections as briefs/secondary fronts; later sections flow to numbered sheets. Placement text explicitly attributes lead position to reader configuration.
- Compact uses multiple equal-width story columns with a deterministic first/next-N flow.
- Reading uses one chronological section stream.
- Individual story treatments use original post content and source type. Article titles are emitted only from actual Standard.site document records/index results.
- Sheet boundaries and page anchors are normal document-flow landmarks; no nested scrollbars.

## Gate and rollback

No dependencies are added until package inspection establishes clean React Native Web compatibility and the API is verified. No new backend, protocol writes, service worker or proprietary records. If Standard Reader integration cannot satisfy CSP/CORS or moderation/provenance checks, preserve the Reading section as a truthful link/embed surface with the failed assumption documented and continue the front-page architecture.

## Gate outcome

The exact 389-file package passed the preview gate and was promoted to Cloudflare Pages production at `1abaaf7f-e124-4fe3-aa1b-9c50ed955a63`. Preview and live custom-domain browser suites each passed 40/40. The immediately previous production deployment remains available for rollback. See [the receipt](../../zeus/editorial-frontpage-deployment-2026-09-23.md) and [verification report](verify-report.md) for the evidence boundaries and remaining work.

Implementation map, traceable spec, QA and research references are in this folder. A reviewer can revert the work as focused commits on `codex/plumblines-v1` without touching the clean `main` or `develop` baselines.
